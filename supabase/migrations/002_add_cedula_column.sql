-- Agregar columna cedula a la tabla patients
ALTER TABLE patients ADD COLUMN IF NOT EXISTS cedula VARCHAR(10) UNIQUE;

-- Crear índice para búsquedas rápidas por cédula
CREATE INDEX IF NOT EXISTS idx_patients_cedula ON patients(cedula);

-- Agregar comentario a la columna
COMMENT ON COLUMN patients.cedula IS 'Cédula ecuatoriana del paciente (10 dígitos)';

-- Actualizar pacientes existentes con cédulas temporales si es necesario
-- (Esto es opcional, solo si quieres que todos los pacientes tengan cédula)
-- UPDATE patients SET cedula = CONCAT('TEMP', LPAD(id::text, 6, '0')) WHERE cedula IS NULL;
