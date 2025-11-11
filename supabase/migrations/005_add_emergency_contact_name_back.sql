-- Migración: Agregar columna emergency_contact_name de vuelta a la tabla patients
-- Fecha: 2024
-- Descripción: Esta migración agrega el campo 'emergency_contact_name' a la tabla patients
--              para almacenar el nombre de la persona de contacto en caso de emergencia.

-- ============================================================================
-- Verificación: Verificar que la tabla patients existe
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'patients'
  ) THEN
    RAISE EXCEPTION 'La tabla patients no existe';
  END IF;
END $$;

-- ============================================================================
-- Paso 1: Agregar la columna emergency_contact_name
-- ============================================================================
-- Tipo VARCHAR sin límite específico (similar a otros campos de nombre en la tabla)
-- NULL permitido ya que es un campo opcional
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS emergency_contact_name CHARACTER VARYING;

-- ============================================================================
-- Paso 2: Agregar comentario descriptivo a la nueva columna
-- ============================================================================
COMMENT ON COLUMN public.patients.emergency_contact_name IS 'Nombre completo de la persona de contacto en caso de emergencia. Máximo 100 caracteres recomendado.';

-- ============================================================================
-- Paso 3: Verificación final - Confirmar que la columna se agregó correctamente
-- ============================================================================
DO $$
DECLARE
  emergency_contact_name_exists BOOLEAN;
BEGIN
  -- Verificar que emergency_contact_name fue creada
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patients' 
    AND column_name = 'emergency_contact_name'
  ) INTO emergency_contact_name_exists;
  
  -- Reportar resultado
  IF emergency_contact_name_exists THEN
    RAISE NOTICE '✓ Columna emergency_contact_name agregada exitosamente';
  ELSE
    RAISE WARNING '✗ No se pudo verificar la creación de emergency_contact_name';
  END IF;
END $$;

-- ============================================================================
-- Consulta de verificación manual (descomentar para ejecutar):
-- ============================================================================
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable,
--   character_maximum_length
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'patients'
--   AND column_name IN ('emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship')
-- ORDER BY column_name;

