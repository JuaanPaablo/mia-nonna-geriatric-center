-- Migración para eliminar las tablas enrollments y services de la base de datos
-- Esta migración elimina las tablas, sus índices, triggers, políticas RLS y referencias en vistas

-- Paso 1: Eliminar la vista dashboard_stats si existe y referencia enrollments
DROP VIEW IF EXISTS public.dashboard_stats CASCADE;

-- Paso 2: Eliminar políticas RLS de enrollments
DROP POLICY IF EXISTS "Authenticated users can view enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Staff can manage enrollments" ON public.enrollments;

-- Paso 3: Eliminar políticas RLS de services
DROP POLICY IF EXISTS "Anyone can view services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;

-- Paso 4: Eliminar triggers de enrollments
DROP TRIGGER IF EXISTS handle_updated_at_enrollments ON public.enrollments;

-- Paso 5: Eliminar triggers de services
DROP TRIGGER IF EXISTS handle_updated_at_services ON public.services;

-- Paso 6: Eliminar índices de enrollments
DROP INDEX IF EXISTS public.idx_enrollments_patient_id;
DROP INDEX IF EXISTS public.idx_enrollments_status;

-- Paso 7: Eliminar índices de services
DROP INDEX IF EXISTS public.idx_services_category;
DROP INDEX IF EXISTS public.idx_services_featured;

-- Paso 8: Eliminar las tablas (CASCADE eliminará automáticamente las foreign keys y constraints)
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

-- Paso 9: Recrear la vista dashboard_stats sin referencias a enrollments
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM public.patients) AS total_patients,
    (SELECT COUNT(*) FROM public.patients WHERE status = 'Activo') AS active_patients,
    (SELECT COUNT(*) FROM public.contact_forms WHERE status = 'Nuevo') AS new_contacts,
    (SELECT 
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE status = 'Activo')::DECIMAL / COUNT(*)) * 100, 1)
            ELSE 0 
        END 
     FROM public.patients) AS occupancy_rate;

-- Paso 10: Otorgar permisos a la vista
GRANT SELECT ON public.dashboard_stats TO authenticated;

