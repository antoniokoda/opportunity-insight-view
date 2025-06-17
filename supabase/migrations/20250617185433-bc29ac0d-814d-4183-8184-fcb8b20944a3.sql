
-- Añadir nuevas tablas y campos necesarios para el sistema completo

-- Tabla para configuración de vistas de usuario
CREATE TABLE IF NOT EXISTS public.user_view_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  view_type TEXT NOT NULL DEFAULT 'pipeline', -- 'pipeline' o 'table'
  selected_pipeline_id UUID,
  filters JSONB DEFAULT '{}',
  sort_settings JSONB DEFAULT '{}',
  column_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Actualizar triggers para timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pipelines_updated_at BEFORE UPDATE ON public.pipelines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_stages_updated_at BEFORE UPDATE ON public.pipeline_stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_view_settings_updated_at BEFORE UPDATE ON public.user_view_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Asegurar que todas las oportunidades existentes tengan pipeline y stage asignados
DO $$
DECLARE
    default_pipeline_id UUID;
    first_stage_id UUID;
BEGIN
    -- Obtener el primer pipeline disponible
    SELECT id INTO default_pipeline_id FROM public.pipelines ORDER BY created_at LIMIT 1;
    
    IF default_pipeline_id IS NOT NULL THEN
        -- Obtener la primera etapa de ese pipeline
        SELECT id INTO first_stage_id FROM public.pipeline_stages 
        WHERE pipeline_id = default_pipeline_id 
        ORDER BY display_order LIMIT 1;
        
        -- Actualizar oportunidades sin pipeline asignado
        UPDATE public.opportunities 
        SET pipeline_id = default_pipeline_id,
            stage_id = first_stage_id
        WHERE pipeline_id IS NULL OR stage_id IS NULL;
    END IF;
END $$;

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_user_view_settings_user_id ON public.user_view_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage_pipeline ON public.opportunities(stage_id, pipeline_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_last_interaction ON public.opportunities(last_interaction_at DESC);
CREATE INDEX IF NOT EXISTS idx_pipeline_stages_pipeline_order ON public.pipeline_stages(pipeline_id, display_order);
