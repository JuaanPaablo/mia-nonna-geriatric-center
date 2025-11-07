-- Script para restaurar datos de prueba después de limpiar la base de datos
-- Ejecuta esto en el SQL Editor de Supabase después de usar el limpiador

-- 1. Restaurar servicios de ejemplo
INSERT INTO services (id, name, description, price, category, is_active, created_at, updated_at) VALUES
(gen_random_uuid(), 'Cuidado Básico 24/7', 'Atención personalizada las 24 horas del día', 800, 'Cuidado Personal', true, NOW(), NOW()),
(gen_random_uuid(), 'Fisioterapia', 'Sesiones de rehabilitación y ejercicios terapéuticos', 120, 'Terapia', true, NOW(), NOW()),
(gen_random_uuid(), 'Nutrición Especializada', 'Planes de alimentación personalizados', 150, 'Salud', true, NOW(), NOW()),
(gen_random_uuid(), 'Actividades Recreativas', 'Programa de entretenimiento y socialización', 80, 'Recreación', true, NOW(), NOW()),
(gen_random_uuid(), 'Transporte Médico', 'Traslado a citas médicas y emergencias', 200, 'Transporte', true, NOW(), NOW());

-- 2. Restaurar pacientes de ejemplo
INSERT INTO patients (id, patient_number, full_name, date_of_birth, age, gender, status, cedula, emergency_contact_name, emergency_contact_phone, medical_conditions, medications, allergies, dietary_restrictions, additional_notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'P-001', 'María González', '1940-05-15', 83, 'Femenino', 'Activo', '1234567890', 'Carlos González', '+593 99 123 4567', 'Hipertensión, Diabetes tipo 2, Artritis leve', 'Metformina 500mg 2x día, Enalapril 10mg 1x día, Paracetamol 500mg según necesidad', 'Penicilina, Sulfamidas', 'Sin sal, bajo en carbohidratos, sin azúcar refinada', 'Paciente estable, requiere monitoreo de glucosa diario. Prefiere actividades de grupo.', NOW(), NOW()),
(gen_random_uuid(), 'P-002', 'José Rodríguez', '1935-12-03', 88, 'Masculino', 'Activo', '0987654321', 'Ana Rodríguez', '+593 98 765 4321', 'Artritis reumatoide, Osteoporosis, Cataratas', 'Calcio 600mg 2x día, Vitamina D 1000 UI, Ibuprofeno 400mg según dolor', 'Ninguna conocida', 'Rica en calcio, sin cafeína, sin alcohol', 'Movilidad reducida, necesita ayuda para caminar. Le gusta la música clásica y la lectura.', NOW(), NOW()),
(gen_random_uuid(), 'P-003', 'Carmen López', '1942-08-22', 81, 'Femenino', 'Activo', '1122334455', 'Miguel López', '+593 97 112 2334', 'Asma bronquial, Alergias estacionales, Hipertensión leve', 'Salbutamol inhalador según necesidad, Antihistamínicos en temporada, Enalapril 5mg 1x día', 'Polen, ácaros, pelo de gato', 'Sin mariscos, sin frutos secos, baja en sodio', 'Independiente, solo supervisión general. Muy activa en actividades recreativas.', NOW(), NOW()),
(gen_random_uuid(), 'P-004', 'Roberto Silva', '1938-03-10', 85, 'Masculino', 'Activo', '5566778899', 'Patricia Silva', '+593 96 556 6778', 'Problemas cardíacos, Diabetes tipo 1, Glaucoma', 'Insulina NPH 20 unidades 2x día, Aspirina 100mg 1x día, Estatinas 20mg 1x día, Gotas para glaucoma', 'Ninguna conocida', 'Baja en grasas, sin azúcar, rica en fibra', 'Monitoreo cardíaco constante. Requiere supervisión para inyecciones de insulina.', NOW(), NOW()),
(gen_random_uuid(), 'P-005', 'Isabel Torres', '1945-11-28', 78, 'Femenino', 'Activo', '9988776655', 'Fernando Torres', '+593 95 998 8776', 'Demencia leve, Hipertensión, Osteoporosis', 'Donepezilo 5mg 1x día, Enalapril 10mg 1x día, Calcio 600mg 1x día', 'Ninguna conocida', 'Sin restricciones especiales', 'Requiere supervisión por demencia. Le gusta la jardinería y las manualidades.', NOW(), NOW());

-- 3. Restaurar matrículas de ejemplo
INSERT INTO enrollments (id, patient_id, room_type, care_level, enrollment_date, monthly_fee, status, notes, created_at, updated_at) VALUES
(gen_random_uuid(), (SELECT id FROM patients WHERE patient_number = 'P-001' LIMIT 1), 'Individual', 'Alto', '2024-01-15', 1200, 'Activa', 'Paciente estable, requiere monitoreo de glucosa', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM patients WHERE patient_number = 'P-002' LIMIT 1), 'Individual', 'Medio', '2024-01-20', 1000, 'Activa', 'Movilidad reducida, necesita ayuda para caminar', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM patients WHERE patient_number = 'P-003' LIMIT 1), 'Compartida', 'Bajo', '2024-02-01', 800, 'Activa', 'Independiente, solo supervisión general', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM patients WHERE patient_number = 'P-004' LIMIT 1), 'Individual', 'Alto', '2024-02-10', 1200, 'Activa', 'Monitoreo cardíaco constante', NOW(), NOW()),
(gen_random_uuid(), (SELECT id FROM patients WHERE patient_number = 'P-005' LIMIT 1), 'Individual', 'Medio', '2024-02-15', 1000, 'Activa', 'Requiere supervisión por demencia', NOW(), NOW());

-- 4. Restaurar contactos de ejemplo
INSERT INTO contact_forms (id, family_name, phone, email, resident_name, resident_age, care_type, message, status, whatsapp_sent, notes, created_at, updated_at) VALUES
(gen_random_uuid(), 'Familia Martínez', '+593 99 111 2222', 'martinez@email.com', 'Pedro Martínez', 82, 'Cuidado 24/7', 'Buscamos un lugar cálido y profesional para mi padre', 'Nuevo', false, 'Interesado en habitación individual', NOW(), NOW()),
(gen_random_uuid(), 'Familia Herrera', '+593 98 333 4444', 'herrera@email.com', 'Rosa Herrera', 79, 'Cuidado diurno', 'Mi madre necesita atención durante el día', 'Contactado', true, 'Programar visita al centro', NOW(), NOW()),
(gen_random_uuid(), 'Familia Jiménez', '+593 97 555 6666', 'jimenez@email.com', 'Alberto Jiménez', 85, 'Cuidado especializado', 'Requiere atención para Alzheimer', 'Procesado', true, 'En lista de espera', NOW(), NOW()),
(gen_random_uuid(), 'Familia Ruiz', '+593 96 777 8888', 'ruiz@email.com', 'Elena Ruiz', 76, 'Cuidado básico', 'Buscamos un lugar tranquilo y seguro', 'Nuevo', false, 'Pendiente de contacto', NOW(), NOW()),
(gen_random_uuid(), 'Familia Vargas', '+593 95 999 0000', 'vargas@email.com', 'Manuel Vargas', 81, 'Cuidado integral', 'Necesita rehabilitación y cuidados médicos', 'Contactado', true, 'Evaluación médica pendiente', NOW(), NOW());

-- 5. Verificar que se insertaron los datos
SELECT 'Servicios' as tabla, COUNT(*) as total FROM services
UNION ALL
SELECT 'Pacientes', COUNT(*) FROM patients
UNION ALL
SELECT 'Matrículas', COUNT(*) FROM enrollments
UNION ALL
SELECT 'Contactos', COUNT(*) FROM contact_forms;

-- 6. Mostrar resumen de datos insertados
SELECT 
  'Resumen de Datos Restaurados' as titulo,
  'Se han restaurado exitosamente los datos de prueba' as mensaje,
  NOW() as fecha_restauracion;

-- 7. Verificar la estructura actualizada de pacientes
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'patients' 
ORDER BY ordinal_position;
