
-- Crear tabla para pipelines
CREATE TABLE public.pipelines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para etapas de pipeline
CREATE TABLE public.pipeline_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_id UUID NOT NULL REFERENCES public.pipelines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  display_order INTEGER NOT NULL DEFAULT 0,
  is_final BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Añadir columnas a la tabla opportunities para soportar pipelines
ALTER TABLE public.opportunities 
ADD COLUMN pipeline_id UUID REFERENCES public.pipelines(id),
ADD COLUMN stage_id UUID REFERENCES public.pipeline_stages(id),
ADD COLUMN last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Crear índices para mejorar rendimiento
CREATE INDEX idx_pipelines_user_id ON public.pipelines(user_id);
CREATE INDEX idx_pipeline_stages_pipeline_id ON public.pipeline_stages(pipeline_id);
CREATE INDEX idx_pipeline_stages_order ON public.pipeline_stages(pipeline_id, display_order);
CREATE INDEX idx_opportunities_pipeline_stage ON public.opportunities(pipeline_id, stage_id);
CREATE INDEX idx_opportunities_last_interaction ON public.opportunities(last_interaction_at);

-- Habilitar RLS para pipelines
ALTER TABLE public.pipelines ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pipelines
CREATE POLICY "Users can view their own pipelines" 
  ON public.pipelines 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create their own pipelines" 
  ON public.pipelines 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own pipelines" 
  ON public.pipelines 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own pipelines" 
  ON public.pipelines 
  FOR DELETE 
  USING (user_id = auth.uid());

-- Habilitar RLS para pipeline_stages
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pipeline_stages
CREATE POLICY "Users can view stages of their pipelines" 
  ON public.pipeline_stages 
  FOR SELECT 
  USING (pipeline_id IN (SELECT id FROM public.pipelines WHERE user_id = auth.uid()));

CREATE POLICY "Users can create stages in their pipelines" 
  ON public.pipeline_stages 
  FOR INSERT 
  WITH CHECK (pipeline_id IN (SELECT id FROM public.pipelines WHERE user_id = auth.uid()));

CREATE POLICY "Users can update stages in their pipelines" 
  ON public.pipeline_stages 
  FOR UPDATE 
  USING (pipeline_id IN (SELECT id FROM public.pipelines WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete stages from their pipelines" 
  ON public.pipeline_stages 
  FOR DELETE 
  USING (pipeline_id IN (SELECT id FROM public.pipelines WHERE user_id = auth.uid()));

-- Crear pipeline por defecto y sus etapas
INSERT INTO public.pipelines (name, description, is_default, user_id, display_order)
SELECT 'Pipeline Principal', 'Pipeline de ventas principal', true, id, 0
FROM auth.users;

-- Insertar etapas por defecto para cada pipeline creado
INSERT INTO public.pipeline_stages (pipeline_id, name, display_order, color)
SELECT p.id, 'Prospecto', 0, '#6b7280' FROM public.pipelines p WHERE p.is_default = true
UNION ALL
SELECT p.id, 'Calificado', 1, '#3b82f6' FROM public.pipelines p WHERE p.is_default = true
UNION ALL
SELECT p.id, 'Propuesta', 2, '#f59e0b' FROM public.pipelines p WHERE p.is_default = true
UNION ALL
SELECT p.id, 'Negociación', 3, '#ef4444' FROM public.pipelines p WHERE p.is_default = true
UNION ALL
SELECT p.id, 'Ganado', 4, '#10b981' FROM public.pipelines p WHERE p.is_default = true
UNION ALL
SELECT p.id, 'Perdido', 5, '#6b7280' FROM public.pipelines p WHERE p.is_default = true;

-- Actualizar oportunidades existentes para asignarles el pipeline por defecto
UPDATE public.opportunities 
SET pipeline_id = (
  SELECT id FROM public.pipelines 
  WHERE user_id = opportunities.user_id AND is_default = true 
  LIMIT 1
),
stage_id = (
  SELECT ps.id FROM public.pipeline_stages ps
  JOIN public.pipelines p ON ps.pipeline_id = p.id
  WHERE p.user_id = opportunities.user_id AND p.is_default = true
  ORDER BY ps.display_order 
  LIMIT 1
)
WHERE pipeline_id IS NULL;

-- Crear vista para oportunidades con información de pipeline
CREATE OR REPLACE VIEW public.opportunities_with_pipeline AS
SELECT 
  o.*,
  p.name as pipeline_name,
  ps.name as stage_name,
  ps.color as stage_color,
  ps.display_order as stage_order,
  ps.is_final as stage_is_final
FROM public.opportunities o
LEFT JOIN public.pipelines p ON o.pipeline_id = p.id
LEFT JOIN public.pipeline_stages ps ON o.stage_id = ps.id;
