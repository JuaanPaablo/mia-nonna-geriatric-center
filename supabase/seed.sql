-- Insert initial services
INSERT INTO public.services (name, description, icon, featured, category, price, duration) VALUES
('Atención Médica 24/7', 'Supervisión médica constante con personal especializado en geriatría. Nuestro equipo médico está disponible las 24 horas para atender cualquier necesidad de salud.', 'Stethoscope', true, 'medical', 150.00, 'Permanente'),
('Fisioterapia', 'Programas de rehabilitación física adaptados a cada residente. Ejercicios personalizados para mantener la movilidad y mejorar la calidad de vida.', 'Activity', true, 'therapy', 45.00, '1 hora'),
('Terapia Ocupacional', 'Actividades para mantener la autonomía y habilidades cognitivas. Programas diseñados para estimular la memoria y las capacidades funcionales.', 'Brain', true, 'therapy', 40.00, '45 minutos'),
('Nutrición Especializada', 'Dietas personalizadas supervisadas por nutricionistas. Menús adaptados a las necesidades específicas de cada residente.', 'Apple', true, 'dietary', 25.00, 'Diario'),
('Actividades Sociales', 'Programas de socialización y entretenimiento adaptados. Eventos, juegos y actividades grupales para fomentar la interacción social.', 'Users', false, 'social', 15.00, '2 horas'),
('Apoyo Psicológico', 'Acompañamiento emocional para residentes y familias. Sesiones individuales y grupales con psicólogos especializados en geriatría.', 'Heart', false, 'therapy', 60.00, '50 minutos'),
('Cuidado Personal', 'Asistencia con higiene personal y actividades diarias. Apoyo profesional para el cuidado personal y la dignidad del residente.', 'User', false, 'medical', 30.00, 'Según necesidad'),
('Musicoterapia', 'Sesiones de música terapéutica para estimular la memoria y el bienestar emocional. Actividades musicales adaptadas a diferentes niveles cognitivos.', 'Music', false, 'recreational', 35.00, '1 hora'),
('Jardinería Terapéutica', 'Actividades de jardinería adaptadas para promover el bienestar físico y mental. Contacto con la naturaleza en espacios seguros.', 'Flower', false, 'recreational', 20.00, '1.5 horas'),
('Servicio Religioso', 'Acompañamiento espiritual y servicios religiosos. Respeto por todas las creencias y prácticas espirituales.', 'Church', false, 'spiritual', null, 'Según solicitud');

-- Insert sample patients (for testing purposes)
INSERT INTO public.patients (
    full_name, 
    date_of_birth, 
    gender, 
    medical_conditions, 
    emergency_contact, 
    admission_date, 
    status,
    room_number,
    care_plan,
    allergies,
    medications
) VALUES
(
    'María González López',
    '1935-03-15',
    'female',
    ARRAY['Diabetes tipo 2', 'Hipertensión', 'Artritis'],
    '{"name": "Ana González", "relationship": "Hija", "phone": "+34 612 345 678", "email": "ana.gonzalez@email.com", "address": "Calle Mayor 123, Madrid", "is_primary": true}',
    '2023-06-15',
    'active',
    '101',
    'Plan de cuidado integral con monitoreo de glucosa, fisioterapia diaria y actividades cognitivas. Dieta controlada en carbohidratos.',
    ARRAY['Penicilina', 'Mariscos'],
    ARRAY[
        '{"name": "Metformina", "dosage": "500mg", "frequency": "2 veces al día", "prescribing_doctor": "Dr. Rodríguez", "start_date": "2023-06-15", "instructions": "Tomar con las comidas"}',
        '{"name": "Enalapril", "dosage": "10mg", "frequency": "1 vez al día", "prescribing_doctor": "Dr. Rodríguez", "start_date": "2023-06-15", "instructions": "Tomar por la mañana"}'
    ]
),
(
    'Antonio Ruiz Fernández',
    '1940-11-22',
    'male',
    ARRAY['Alzheimer leve', 'Osteoporosis'],
    '{"name": "Carlos Ruiz", "relationship": "Hijo", "phone": "+34 623 456 789", "email": "carlos.ruiz@email.com", "address": "Avenida de la Paz 45, Madrid", "is_primary": true}',
    '2023-08-10',
    'active',
    '205',
    'Programa de estimulación cognitiva, supervisión constante, actividades de orientación temporal y espacial.',
    ARRAY['Ibuprofeno'],
    ARRAY[
        '{"name": "Donepezilo", "dosage": "5mg", "frequency": "1 vez al día", "prescribing_doctor": "Dra. Martínez", "start_date": "2023-08-10", "instructions": "Tomar por la noche"}',
        '{"name": "Calcio + Vitamina D", "dosage": "600mg", "frequency": "1 vez al día", "prescribing_doctor": "Dra. Martínez", "start_date": "2023-08-10", "instructions": "Tomar con el desayuno"}'
    ]
),
(
    'Carmen Pérez Martín',
    '1938-07-08',
    'female',
    ARRAY['Parkinson', 'Depresión'],
    '{"name": "Isabel Pérez", "relationship": "Hija", "phone": "+34 634 567 890", "email": "isabel.perez@email.com", "address": "Plaza España 78, Madrid", "is_primary": true}',
    '2023-09-05',
    'active',
    '302',
    'Fisioterapia especializada para Parkinson, apoyo psicológico, actividades de motricidad fina y terapia ocupacional.',
    ARRAY[],
    ARRAY[
        '{"name": "Levodopa", "dosage": "250mg", "frequency": "3 veces al día", "prescribing_doctor": "Dr. Santos", "start_date": "2023-09-05", "instructions": "Tomar con las comidas principales"}',
        '{"name": "Sertralina", "dosage": "50mg", "frequency": "1 vez al día", "prescribing_doctor": "Dr. Santos", "start_date": "2023-09-05", "instructions": "Tomar por la mañana"}'
    ]
);

-- Insert sample enrollments
INSERT INTO public.enrollments (patient_id, enrollment_date, care_type, monthly_fee, status, notes) VALUES
(
    (SELECT id FROM public.patients WHERE full_name = 'María González López'),
    '2023-06-15',
    'full_time',
    2800.00,
    'approved',
    'Matrícula aprobada. Familiar satisfecho con el plan de cuidado propuesto.'
),
(
    (SELECT id FROM public.patients WHERE full_name = 'Antonio Ruiz Fernández'),
    '2023-08-10',
    'full_time',
    3200.00,
    'approved',
    'Requiere supervisión especializada debido al Alzheimer. Plan de cuidado personalizado.'
),
(
    (SELECT id FROM public.patients WHERE full_name = 'Carmen Pérez Martín'),
    '2023-09-05',
    'day_care',
    1800.00,
    'approved',
    'Centro de día con fisioterapia especializada. Excelente progreso en el tratamiento.'
);

-- Insert sample contact forms
INSERT INTO public.contact_forms (
    family_name, 
    phone, 
    email, 
    resident_name, 
    resident_age, 
    care_type, 
    message, 
    status
) VALUES
(
    'Familia Martínez',
    '+34 645 678 901',
    'martinez.familia@email.com',
    'José Martínez García',
    82,
    'Centro de día',
    'Buenos días, estamos interesados en el centro de día para mi padre. Necesita fisioterapia y le gustaría participar en actividades sociales. ¿Podrían proporcionarnos más información sobre horarios y precios?',
    'new'
),
(
    'Familia López',
    '+34 656 789 012',
    'lopez.ana@email.com',
    'Rosa López Sánchez',
    78,
    'Tiempo completo',
    'Hola, mi madre necesita cuidados de tiempo completo. Tiene diabetes y problemas de movilidad. ¿Qué servicios médicos ofrecen? Me gustaría concertar una visita.',
    'contacted'
),
(
    'Familia Rodríguez',
    '+34 667 890 123',
    'rodriguez.pedro@email.com',
    'Manuel Rodríguez Jiménez',
    85,
    'Respiro familiar',
    'Necesitamos cuidado temporal para mi padre durante las vacaciones de verano (2 semanas). ¿Ofrecen este servicio? ¿Cuáles serían los costos?',
    'new'
),
(
    'Familia García',
    '+34 678 901 234',
    'garcia.familia@email.com',
    'Pilar García Moreno',
    80,
    'Centro de día',
    'Mi madre vive sola y creemos que le vendría bien la socialización y actividades del centro de día. ¿Tienen transporte disponible?',
    'converted'
),
(
    'Familia Hernández',
    '+34 689 012 345',
    'hernandez.luis@email.com',
    'Francisco Hernández Vila',
    77,
    'Tiempo completo',
    'Buenos días, estamos buscando una residencia para mi padre. Tiene Alzheimer en fase inicial. ¿Tienen programa especializado para esta condición?',
    'contacted'
);

-- Create a sample admin user (this would typically be done through Supabase Auth)
-- Note: This is just for reference, actual user creation should be done through the auth system

-- Update sequences to ensure proper ID generation
SELECT setval('patients_id_seq', (SELECT MAX(id) FROM patients) + 1, false);
SELECT setval('enrollments_id_seq', (SELECT MAX(id) FROM enrollments) + 1, false);
SELECT setval('contact_forms_id_seq', (SELECT MAX(id) FROM contact_forms) + 1, false);
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services) + 1, false);

-- Create some utility functions for the application

-- Function to get patient age
CREATE OR REPLACE FUNCTION public.get_patient_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN DATE_PART('year', AGE(birth_date));
END;
$$ LANGUAGE plpgsql;

-- Function to get monthly revenue
CREATE OR REPLACE FUNCTION public.get_monthly_revenue(year_param INTEGER, month_param INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(monthly_fee) 
         FROM public.enrollments 
         WHERE status = 'approved' 
         AND EXTRACT(YEAR FROM enrollment_date) = year_param
         AND EXTRACT(MONTH FROM enrollment_date) = month_param), 
        0
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get occupancy rate
CREATE OR REPLACE FUNCTION public.get_occupancy_rate()
RETURNS DECIMAL AS $$
DECLARE
    total_capacity INTEGER := 50; -- Adjust based on facility capacity
    active_patients INTEGER;
BEGIN
    SELECT COUNT(*) INTO active_patients 
    FROM public.patients 
    WHERE status = 'active';
    
    IF total_capacity > 0 THEN
        RETURN ROUND((active_patients::DECIMAL / total_capacity) * 100, 1);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for utility functions
GRANT EXECUTE ON FUNCTION public.get_patient_age TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_monthly_revenue TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_occupancy_rate TO authenticated;
