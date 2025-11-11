-- Migración: Eliminar columna emergency_contact_name y agregar family_history
-- Fecha: 2024
-- Descripción: Esta migración elimina el campo 'emergency_contact_name' de la tabla patients
--              y agrega el nuevo campo 'family_history' para antecedentes familiares.

-- ============================================================================
-- IMPORTANTE: Hacer backup antes de ejecutar esta migración
-- ============================================================================
-- Si necesitas conservar los datos de emergency_contact_name, ejecuta primero:
-- 
-- CREATE TABLE IF NOT EXISTS public.patients_backup_emergency_contacts AS 
-- SELECT 
--   id, 
--   full_name,
--   emergency_contact_name, 
--   emergency_contact_phone,
--   emergency_contact_relationship,
--   created_at
-- FROM public.patients 
-- WHERE emergency_contact_name IS NOT NULL;
-- ============================================================================

-- Paso 1: Verificar que la tabla patients existe
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

-- Paso 2: Agregar la nueva columna family_history
-- Tipo TEXT para permitir texto largo (similar a medical_conditions, medications, etc.)
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS family_history TEXT;

-- Paso 3: Agregar comentario descriptivo a la nueva columna
COMMENT ON COLUMN public.patients.family_history IS 'Antecedentes familiares del paciente (enfermedades hereditarias, condiciones familiares, etc.). Máximo 300 caracteres recomendado.';

-- Paso 4: Eliminar la columna emergency_contact_name
-- NOTA: Esta operación es irreversible. Asegúrate de tener un backup.
ALTER TABLE public.patients 
DROP COLUMN IF EXISTS emergency_contact_name;

-- Paso 5: Verificación final - Confirmar que los cambios se aplicaron correctamente
DO $$
DECLARE
  family_history_exists BOOLEAN;
  emergency_contact_name_exists BOOLEAN;
BEGIN
  -- Verificar que family_history fue creada
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patients' 
    AND column_name = 'family_history'
  ) INTO family_history_exists;
  
  -- Verificar que emergency_contact_name fue eliminada
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'patients' 
    AND column_name = 'emergency_contact_name'
  ) INTO emergency_contact_name_exists;
  
  -- Reportar resultados
  IF family_history_exists THEN
    RAISE NOTICE '✓ Columna family_history creada exitosamente';
  ELSE
    RAISE WARNING '✗ No se pudo verificar la creación de family_history';
  END IF;
  
  IF NOT emergency_contact_name_exists THEN
    RAISE NOTICE '✓ Columna emergency_contact_name eliminada exitosamente';
  ELSE
    RAISE WARNING '✗ La columna emergency_contact_name aún existe';
  END IF;
END $$;

-- Consulta de verificación manual (descomentar para ejecutar):
-- SELECT 
--   column_name, 
--   data_type, 
--   is_nullable,
--   character_maximum_length
-- FROM information_schema.columns
-- WHERE table_schema = 'public' 
--   AND table_name = 'patients'
--   AND column_name IN ('family_history', 'emergency_contact_name', 'emergency_contact_phone')
-- ORDER BY column_name;

