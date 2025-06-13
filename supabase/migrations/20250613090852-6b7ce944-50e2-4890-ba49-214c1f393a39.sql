
-- Actualizar la tabla calls para incluir el campo de asistencia
ALTER TABLE public.calls 
ADD COLUMN attended BOOLEAN DEFAULT NULL;

-- Crear un tipo ENUM para los tipos de llamadas
CREATE TYPE call_type AS ENUM (
  'Discovery 1',
  'Discovery 2', 
  'Discovery 3',
  'Closing 1',
  'Closing 2',
  'Closing 3'
);

-- Primero crear una nueva columna temporal con el tipo ENUM
ALTER TABLE public.calls 
ADD COLUMN type_new call_type;

-- Actualizar la nueva columna con los valores convertidos
UPDATE public.calls 
SET type_new = CASE 
  WHEN type = 'Discovery' THEN 'Discovery 1'::call_type
  WHEN type = 'Closing' THEN 'Closing 1'::call_type
  ELSE 'Discovery 1'::call_type
END;

-- Hacer la nueva columna NOT NULL
ALTER TABLE public.calls 
ALTER COLUMN type_new SET NOT NULL;

-- Eliminar la columna antigua
ALTER TABLE public.calls 
DROP COLUMN type;

-- Renombrar la nueva columna
ALTER TABLE public.calls 
RENAME COLUMN type_new TO type;
