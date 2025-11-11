-- Migración: Crear bucket de Storage para documentos de pacientes
-- Fecha: 2024
-- Descripción: Esta migración crea el bucket de Storage para almacenar los documentos
--              escaneados de los formularios de pacientes.

-- ============================================================================
-- Crear bucket de Storage
-- ============================================================================
-- Nota: Los buckets de Storage se crean a través de la API de Supabase Storage
--       o desde la interfaz web. Este script SQL no puede crear buckets directamente.
--       Sin embargo, puedes ejecutar este script para crear las políticas de acceso.

-- ============================================================================
-- Políticas de acceso para el bucket (si ya existe)
-- ============================================================================
-- Estas políticas permiten:
-- - Los usuarios autenticados pueden subir archivos
-- - Los usuarios autenticados pueden leer archivos
-- - Los usuarios autenticados pueden actualizar archivos
-- - Los usuarios autenticados pueden eliminar archivos

-- Eliminar políticas existentes si existen (para evitar duplicados)
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden leer documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar documentos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar documentos" ON storage.objects;

-- Política para INSERT (subir archivos)
CREATE POLICY "Usuarios autenticados pueden subir documentos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'patient-forms' AND
  auth.role() = 'authenticated'
);

-- Política para SELECT (leer archivos)
CREATE POLICY "Usuarios autenticados pueden leer documentos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'patient-forms' AND
  auth.role() = 'authenticated'
);

-- Política para UPDATE (actualizar archivos)
CREATE POLICY "Usuarios autenticados pueden actualizar documentos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'patient-forms' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'patient-forms' AND
  auth.role() = 'authenticated'
);

-- Política para DELETE (eliminar archivos)
CREATE POLICY "Usuarios autenticados pueden eliminar documentos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'patient-forms' AND
  auth.role() = 'authenticated'
);

-- ============================================================================
-- INSTRUCCIONES PARA CREAR EL BUCKET MANUALMENTE:
-- ============================================================================
-- 1. Ve a tu proyecto en Supabase
-- 2. Navega a Storage
-- 3. Haz clic en "New bucket"
-- 4. Nombre: patient-forms
-- 5. Público: No (privado)
-- 6. File size limit: 50MB (o el que prefieras)
-- 7. Allowed MIME types: application/pdf,image/jpeg,image/png,image/jpg
-- 8. Haz clic en "Create bucket"
-- ============================================================================

