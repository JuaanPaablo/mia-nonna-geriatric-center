-- Script para actualizar la tabla de pacientes con las nuevas validaciones
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Agregar nueva columna para número de paciente
ALTER TABLE patients ADD COLUMN IF NOT EXISTS patient_number VARCHAR(10) UNIQUE;

-- 2. Agregar nueva columna para alergias
ALTER TABLE patients ADD COLUMN IF NOT EXISTS allergies TEXT;

-- 3. Agregar nueva columna para restricciones dietéticas
ALTER TABLE patients ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT;

-- 4. Agregar nueva columna para notas adicionales
ALTER TABLE patients ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- 5. Agregar restricciones de longitud para los campos de texto
-- Nota: PostgreSQL no tiene restricciones CHECK para longitud de TEXT, pero podemos usar triggers
-- Por ahora, las validaciones se harán en el frontend

-- 6. Crear índices para mejorar el rendimiento de búsquedas
CREATE INDEX IF NOT EXISTS idx_patients_cedula ON patients(cedula);
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_patients_full_name ON patients(full_name);

-- 7. Agregar restricciones de validación para la cédula
-- La cédula debe ser exactamente 10 dígitos
ALTER TABLE patients ADD CONSTRAINT IF NOT EXISTS check_cedula_format 
CHECK (cedula ~ '^[0-9]{10}$');

-- 8. Agregar restricción para que la edad sea mayor a 50 años
ALTER TABLE patients ADD CONSTRAINT IF NOT EXISTS check_age_range 
CHECK (age >= 50 AND age <= 120);

-- 9. Agregar restricción para el formato del número de paciente
ALTER TABLE patients ADD CONSTRAINT IF NOT EXISTS check_patient_number_format 
CHECK (patient_number ~ '^P-[0-9]{3,6}$');

-- 10. Actualizar registros existentes para agregar números de paciente
-- Solo si no tienen número asignado
UPDATE patients 
SET patient_number = 'P-' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0')
WHERE patient_number IS NULL;

-- 11. Verificar la estructura actualizada
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;

-- 12. Mostrar resumen de la actualización
SELECT 
  'Tabla de Pacientes Actualizada' as mensaje,
  COUNT(*) as total_pacientes,
  COUNT(CASE WHEN patient_number IS NOT NULL THEN 1 END) as pacientes_con_numero,
  COUNT(CASE WHEN cedula IS NOT NULL THEN 1 END) as pacientes_con_cedula
FROM patients;
