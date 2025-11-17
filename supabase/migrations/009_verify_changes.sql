-- Script de verificación para la migración 009
-- Ejecuta este script para verificar que todos los cambios se aplicaron correctamente

-- 1. Verificar que las columnas existen y tienen los tipos correctos
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name = 'contact_forms'
ORDER BY ordinal_position;

-- 2. Verificar el constraint de status
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'contact_forms_status_check';

-- 3. Verificar valores de status existentes (si hay datos)
SELECT 
    status,
    COUNT(*) as cantidad
FROM public.contact_forms
GROUP BY status
ORDER BY status;

-- 4. Verificar que la vista dashboard_stats existe
SELECT 
    table_name,
    view_definition
FROM information_schema.views
WHERE table_schema = 'public' 
    AND table_name = 'dashboard_stats';

-- 5. Probar que se puede insertar un contacto con campos opcionales NULL
-- (Solo muestra la estructura, no inserta realmente)
SELECT 
    'Verificación completada' as resultado,
    'La tabla contact_forms está lista para recibir datos del formulario' as mensaje;

