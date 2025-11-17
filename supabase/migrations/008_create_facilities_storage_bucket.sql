-- Migración: Crear bucket de Storage público para imágenes de instalaciones
-- Fecha: 2024
-- Descripción: Esta migración crea políticas de acceso para un bucket público
--              que almacenará las imágenes de las instalaciones del centro geriátrico.

-- ============================================================================
-- Políticas de acceso para el bucket público (si ya existe)
-- ============================================================================
-- Estas políticas permiten:
-- - Cualquiera puede leer las imágenes (público)
-- - Solo usuarios autenticados pueden subir/actualizar/eliminar

-- Eliminar políticas existentes si existen (para evitar duplicados)
DROP POLICY IF EXISTS "Público puede leer imágenes de instalaciones" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir imágenes de instalaciones" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar imágenes de instalaciones" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar imágenes de instalaciones" ON storage.objects;

-- Política para SELECT (leer imágenes) - PÚBLICO
CREATE POLICY "Público puede leer imágenes de instalaciones"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'facilities-images');

-- Política para INSERT (subir imágenes) - Solo autenticados
CREATE POLICY "Usuarios autenticados pueden subir imágenes de instalaciones"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'facilities-images' AND
  auth.role() = 'authenticated'
);

-- Política para UPDATE (actualizar imágenes) - Solo autenticados
CREATE POLICY "Usuarios autenticados pueden actualizar imágenes de instalaciones"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'facilities-images' AND
  auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'facilities-images' AND
  auth.role() = 'authenticated'
);

-- Política para DELETE (eliminar imágenes) - Solo autenticados
CREATE POLICY "Usuarios autenticados pueden eliminar imágenes de instalaciones"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'facilities-images' AND
  auth.role() = 'authenticated'
);

-- ============================================================================
-- INSTRUCCIONES PARA CREAR EL BUCKET MANUALMENTE:
-- ============================================================================
-- 1. Ve a tu proyecto en Supabase Dashboard
-- 2. Navega a Storage
-- 3. Haz clic en "New bucket"
-- 4. Nombre: facilities-images
-- 5. Público: SÍ (para que las imágenes sean accesibles públicamente)
-- 6. File size limit: 10MB (suficiente para imágenes optimizadas)
-- 7. Allowed MIME types: image/jpeg,image/png,image/webp,image/jpg
-- 8. Haz clic en "Create bucket"
-- ============================================================================
--
-- ESTRUCTURA RECOMENDADA DE CARPETAS:
-- facilities-images/
--   ├── habitaciones-privadas.jpg
--   ├── comedor-principal.jpg
--   ├── sala-fisioterapia.jpg
--   ├── jardin-terapeutico.jpg
--   ├── sala-actividades.jpg
--   └── enfermeria.jpg
-- ============================================================================

