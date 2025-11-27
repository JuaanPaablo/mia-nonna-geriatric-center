-- Migración: Crear tabla para formularios de pacientes
-- Fecha: 2024
-- Descripción: Esta migración crea la tabla patient_forms para almacenar los 14 formularios
--              requeridos para el ingreso de cada paciente.

-- ============================================================================
-- Crear tipo ENUM para el estado del formulario (solo si no existe)
-- ============================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_status') THEN
    CREATE TYPE form_status AS ENUM ('pendiente', 'completado', 'revisado');
  END IF;
END $$;

-- ============================================================================
-- Crear tipo ENUM para los tipos de formularios (14 formularios requeridos)
-- ============================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_type') THEN
    CREATE TYPE form_type AS ENUM (
      'admission',                    -- 1. Formulario de Admisión
      'medical_evaluation',           -- 2. Evaluación Médica Inicial
      'nursing_evaluation',           -- 3. Evaluación de Enfermería
      'psychological_evaluation',     -- 4. Evaluación Psicológica
      'nutritional_evaluation',       -- 5. Evaluación Nutricional
      'social_evaluation',            -- 6. Evaluación Social
      'functional_evaluation',        -- 7. Evaluación Funcional
      'informed_consent',             -- 8. Consentimiento Informado
      'treatment_authorization',       -- 9. Autorización de Tratamiento
      'medication_history',           -- 10. Historial de Medicamentos
      'allergy_evaluation',           -- 11. Evaluación de Alergias
      'care_plan',                    -- 12. Plan de Cuidados
      'risk_assessment',              -- 13. Evaluación de Riesgos
      'image_consent'                 -- 14. Consentimiento de Imágenes
    );
  END IF;
END $$;

-- ============================================================================
-- Crear tabla patient_forms
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.patient_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  form_type form_type NOT NULL,
  status form_status DEFAULT 'pendiente',
  form_data JSONB DEFAULT '{}'::jsonb,
  completed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  -- Asegurar que un paciente solo tenga un formulario de cada tipo
  UNIQUE(patient_id, form_type)
);

-- ============================================================================
-- Agregar columnas de archivo si no existen (para tablas creadas anteriormente)
-- ============================================================================
DO $$ 
BEGIN
  -- Agregar file_url si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patient_forms' 
    AND column_name = 'file_url'
  ) THEN
    ALTER TABLE public.patient_forms ADD COLUMN file_url TEXT;
  END IF;

  -- Agregar file_name si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patient_forms' 
    AND column_name = 'file_name'
  ) THEN
    ALTER TABLE public.patient_forms ADD COLUMN file_name TEXT;
  END IF;

  -- Agregar file_size si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patient_forms' 
    AND column_name = 'file_size'
  ) THEN
    ALTER TABLE public.patient_forms ADD COLUMN file_size BIGINT;
  END IF;

  -- Agregar file_type si no existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patient_forms' 
    AND column_name = 'file_type'
  ) THEN
    ALTER TABLE public.patient_forms ADD COLUMN file_type TEXT;
  END IF;
END $$;

-- ============================================================================
-- Crear índices para mejor rendimiento
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_patient_forms_patient_id ON public.patient_forms(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_forms_form_type ON public.patient_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_patient_forms_status ON public.patient_forms(status);
CREATE INDEX IF NOT EXISTS idx_patient_forms_patient_status ON public.patient_forms(patient_id, status);

-- ============================================================================
-- Crear función para actualizar updated_at automáticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION update_patient_forms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Crear trigger para updated_at (eliminar si existe primero)
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_update_patient_forms_updated_at ON public.patient_forms;
CREATE TRIGGER trigger_update_patient_forms_updated_at
  BEFORE UPDATE ON public.patient_forms
  FOR EACH ROW
  EXECUTE FUNCTION update_patient_forms_updated_at();

-- ============================================================================
-- Agregar comentarios descriptivos
-- ============================================================================
COMMENT ON TABLE public.patient_forms IS 'Almacena los 14 formularios requeridos para el ingreso de cada paciente';
COMMENT ON COLUMN public.patient_forms.form_type IS 'Tipo de formulario (1-14 formularios requeridos)';
COMMENT ON COLUMN public.patient_forms.status IS 'Estado del formulario: pendiente, completado, revisado';
COMMENT ON COLUMN public.patient_forms.form_data IS 'Datos del formulario en formato JSON flexible';
COMMENT ON COLUMN public.patient_forms.file_url IS 'URL del documento escaneado subido (Supabase Storage)';
COMMENT ON COLUMN public.patient_forms.file_name IS 'Nombre original del archivo subido';
COMMENT ON COLUMN public.patient_forms.file_size IS 'Tamaño del archivo en bytes';
COMMENT ON COLUMN public.patient_forms.file_type IS 'Tipo MIME del archivo (ej: application/pdf, image/jpeg)';
COMMENT ON COLUMN public.patient_forms.completed_by IS 'Usuario que completó el formulario';
COMMENT ON COLUMN public.patient_forms.completed_at IS 'Fecha y hora de completado';
COMMENT ON COLUMN public.patient_forms.reviewed_by IS 'Usuario que revisó el formulario';
COMMENT ON COLUMN public.patient_forms.reviewed_at IS 'Fecha y hora de revisión';

-- ============================================================================
-- Verificación: Confirmar que la tabla se creó correctamente
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'patient_forms'
  ) THEN
    RAISE NOTICE '✓ Tabla patient_forms creada exitosamente';
  ELSE
    RAISE EXCEPTION '✗ Error al crear la tabla patient_forms';
  END IF;
END $$;

