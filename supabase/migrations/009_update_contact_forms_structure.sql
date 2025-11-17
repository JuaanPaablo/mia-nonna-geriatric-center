-- Migración 009: Actualizar estructura de contact_forms
-- Esta migración actualiza la tabla contact_forms para que coincida con la estructura requerida
-- donde los contactos solo se crean desde el formulario de la landing page

-- Paso 0: Eliminar la vista dashboard_stats primero (depende de la columna status)
DROP VIEW IF EXISTS public.dashboard_stats CASCADE;

-- Paso 1: Agregar columnas faltantes si no existen
DO $$ 
BEGIN
    -- Agregar columna whatsapp_sent si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_forms' 
        AND column_name = 'whatsapp_sent'
    ) THEN
        ALTER TABLE public.contact_forms 
        ADD COLUMN whatsapp_sent BOOLEAN DEFAULT false;
    END IF;

    -- Agregar columna notes si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_forms' 
        AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.contact_forms 
        ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Paso 2: Hacer opcionales los campos que deben serlo
-- Primero, eliminar las restricciones NOT NULL de los campos opcionales
ALTER TABLE public.contact_forms 
    ALTER COLUMN email DROP NOT NULL,
    ALTER COLUMN resident_name DROP NOT NULL,
    ALTER COLUMN resident_age DROP NOT NULL,
    ALTER COLUMN care_type DROP NOT NULL,
    ALTER COLUMN message DROP NOT NULL;

-- Paso 3: Actualizar el tipo de status de ENUM a VARCHAR con CHECK constraint
-- Primero, eliminar el tipo ENUM si existe y crear una columna temporal
DO $$
BEGIN
    -- Si la columna status es de tipo contact_status (ENUM), necesitamos cambiarla
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_forms' 
        AND column_name = 'status'
        AND udt_name = 'contact_status'
    ) THEN
        -- Convertir valores existentes del ENUM a VARCHAR
        ALTER TABLE public.contact_forms 
        ALTER COLUMN status TYPE VARCHAR USING 
            CASE status::text
                WHEN 'new' THEN 'Nuevo'
                WHEN 'contacted' THEN 'Contactado'
                WHEN 'converted' THEN 'Interesado'
                ELSE 'Nuevo'
            END;
    END IF;
END $$;

-- Asegurar que status sea VARCHAR
ALTER TABLE public.contact_forms 
    ALTER COLUMN status TYPE VARCHAR;

-- Paso 4: Agregar CHECK constraint para los valores válidos de status
-- Primero eliminar el constraint anterior si existe
ALTER TABLE public.contact_forms 
    DROP CONSTRAINT IF EXISTS contact_forms_status_check;

-- Agregar el nuevo CHECK constraint con los valores correctos
ALTER TABLE public.contact_forms 
    ADD CONSTRAINT contact_forms_status_check 
    CHECK (status IN ('Nuevo', 'Contactado', 'Interesado', 'No interesado'));

-- Paso 5: Establecer el valor por defecto de status a 'Nuevo'
ALTER TABLE public.contact_forms 
    ALTER COLUMN status SET DEFAULT 'Nuevo';

-- Paso 6: Actualizar valores de status existentes que no coincidan con los nuevos valores
UPDATE public.contact_forms 
SET status = 'Nuevo' 
WHERE status NOT IN ('Nuevo', 'Contactado', 'Interesado', 'No interesado');

-- Paso 7: Recrear la vista dashboard_stats con el nuevo valor de status
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

-- Paso 8: Re-grant permisos en la vista
GRANT SELECT ON public.dashboard_stats TO authenticated;

-- Comentarios para documentación
COMMENT ON COLUMN public.contact_forms.family_name IS 'Nombre del familiar que contacta (obligatorio)';
COMMENT ON COLUMN public.contact_forms.phone IS 'Teléfono de contacto (obligatorio)';
COMMENT ON COLUMN public.contact_forms.email IS 'Email de contacto (opcional)';
COMMENT ON COLUMN public.contact_forms.resident_name IS 'Nombre del residente (opcional)';
COMMENT ON COLUMN public.contact_forms.resident_age IS 'Edad del residente (opcional)';
COMMENT ON COLUMN public.contact_forms.care_type IS 'Tipo de cuidado solicitado (opcional)';
COMMENT ON COLUMN public.contact_forms.message IS 'Mensaje del formulario (opcional)';
COMMENT ON COLUMN public.contact_forms.status IS 'Estado del contacto: Nuevo, Contactado, Interesado, No interesado';
COMMENT ON COLUMN public.contact_forms.whatsapp_sent IS 'Indica si se ha enviado mensaje por WhatsApp';
COMMENT ON COLUMN public.contact_forms.notes IS 'Notas adicionales del administrador';

