-- Script para generar 40 pacientes de prueba
-- Ejecuta esto en el SQL Editor de Supabase
-- Este script crea pacientes con datos realistas y variados

-- Obtener el siguiente número de paciente
DO $$
DECLARE
  max_num INTEGER;
  i INTEGER;
BEGIN
  -- Obtener el número máximo de paciente existente
  SELECT COALESCE(MAX(CAST(SUBSTRING(patient_number FROM 'P-([0-9]+)') AS INTEGER)), 0)
  INTO max_num
  FROM patients
  WHERE patient_number ~ '^P-[0-9]+$';
  
  -- Insertar 40 pacientes
  FOR i IN 1..40 LOOP
    INSERT INTO patients (
      patient_number, full_name, date_of_birth, age, gender, status, cedula,
      emergency_contact_name, emergency_contact_phone, medical_conditions, 
      medications, allergies, dietary_restrictions, family_history, additional_notes, 
      created_at, updated_at
    ) VALUES (
      'P-' || LPAD((max_num + i)::TEXT, 3, '0'),
      (ARRAY[
        'María González', 'José Rodríguez', 'Carmen López', 'Roberto Silva', 'Isabel Torres',
        'Carlos Martínez', 'Ana García', 'Miguel Pérez', 'Rosa Sánchez', 'Luis Ramírez',
        'Patricia Flores', 'Fernando Torres', 'Elena Rivera', 'Antonio Gómez', 'Laura Díaz',
        'Manuel Cruz', 'Marta Morales', 'Francisco Ortiz', 'Sofía Gutiérrez', 'Pedro Chávez',
        'Lucía Ramos', 'Juan Mendoza', 'Paula Herrera', 'Ricardo Jiménez', 'Andrea Ruiz',
        'Alberto Vargas', 'Diana Moreno', 'Eduardo Fernández', 'Claudia Castro', 'Mario Romero',
        'Gloria Álvarez', 'Sergio Medina', 'Beatriz Vega', 'Daniel Paredes', 'Silvia Córdova',
        'Andrés Salazar', 'Monica Espinoza', 'Jorge Valdez', 'Adriana Rojas', 'Rafael Campos'
      ])[1 + (i % 40)],
      CURRENT_DATE - INTERVAL '70 years' - (i % 26 || ' years')::INTERVAL - (i % 365 || ' days')::INTERVAL,
      70 + (i % 26),
      CASE WHEN i % 2 = 0 THEN 'Femenino' ELSE 'Masculino' END,
      CASE WHEN i % 5 = 0 THEN 'Inactivo' ELSE 'Activo' END,
      LPAD((1000000000 + (i * 1234567) % 9000000000)::TEXT, 10, '0'),
      (ARRAY[
        'Carlos González', 'Ana Rodríguez', 'Miguel López', 'Patricia Silva', 'Fernando Torres',
        'Elena Martínez', 'Luis García', 'Rosa Pérez', 'Manuel Sánchez', 'Marta Ramírez',
        'Francisco Flores', 'Sofía Torres', 'Pedro Rivera', 'Lucía Gómez', 'Juan Díaz',
        'Paula Cruz', 'Ricardo Morales', 'Andrea Ortiz', 'Alberto Gutiérrez', 'Diana Chávez',
        'Eduardo Ramos', 'Claudia Mendoza', 'Mario Herrera', 'Gloria Jiménez', 'Sergio Ruiz',
        'Beatriz Vargas', 'Daniel Moreno', 'Silvia Fernández', 'Andrés Castro', 'Monica Romero',
        'Jorge Álvarez', 'Adriana Medina', 'Rafael Vega', 'María Paredes', 'José Córdova',
        'Carmen Salazar', 'Roberto Espinoza', 'Isabel Valdez', 'Carlos Rojas', 'Ana Campos'
      ])[1 + (i % 40)],
      '+593 9' || LPAD(((i * 7) % 10)::TEXT, 1, '0') || ' ' || 
      LPAD(((i * 123) % 1000)::TEXT, 3, '0') || ' ' || 
      LPAD(((i * 456) % 10000)::TEXT, 4, '0'),
      (ARRAY[
        'Hipertensión, Diabetes tipo 2, Artritis leve',
        'Artritis reumatoide, Osteoporosis, Cataratas',
        'Asma bronquial, Alergias estacionales, Hipertensión leve',
        'Problemas cardíacos, Diabetes tipo 1, Glaucoma',
        'Demencia leve, Hipertensión, Osteoporosis',
        'Parkinson, Temblores, Rigidez muscular',
        'Alzheimer, Demencia moderada, Pérdida de memoria',
        'Glaucoma, Cataratas, Problemas de visión',
        'Insuficiencia renal, Hipertensión, Anemia',
        'EPOC, Bronquitis crónica, Dificultad respiratoria',
        'Artritis reumatoide, Osteoporosis, Dolor articular',
        'Diabetes tipo 2, Neuropatía, Problemas circulatorios',
        'Hipertensión, Problemas cardíacos, Arritmia',
        'Osteoporosis, Artritis, Fracturas previas',
        'Demencia leve, Alzheimer incipiente, Confusión',
        'Hipertensión, Diabetes tipo 2, Obesidad',
        'Artritis, Osteoartritis, Dolor crónico',
        'Asma, Alergias, Problemas respiratorios',
        'Problemas cardíacos, Hipertensión, Colesterol alto',
        'Demencia, Pérdida de memoria, Desorientación'
      ])[1 + (i % 20)],
      (ARRAY[
        'Metformina 500mg 2x día, Enalapril 10mg 1x día, Paracetamol 500mg según necesidad',
        'Calcio 600mg 2x día, Vitamina D 1000 UI, Ibuprofeno 400mg según dolor',
        'Salbutamol inhalador según necesidad, Antihistamínicos en temporada, Enalapril 5mg 1x día',
        'Insulina NPH 20 unidades 2x día, Aspirina 100mg 1x día, Estatinas 20mg 1x día, Gotas para glaucoma',
        'Donepezilo 5mg 1x día, Enalapril 10mg 1x día, Calcio 600mg 1x día',
        'Levodopa 250mg 3x día, Carbidopa 25mg 3x día, Anticolinérgicos según necesidad',
        'Memantina 10mg 2x día, Rivastigmina 3mg 2x día, Antidepresivos según necesidad',
        'Gotas para glaucoma 2x día, Suplementos vitamínicos, Antioxidantes',
        'Diuréticos según prescripción, Enalapril 10mg 1x día, Hierro suplementario',
        'Broncodilatadores 2x día, Corticosteroides inhalados, Oxígeno según necesidad',
        'Metotrexato semanal, Ácido fólico diario, Antiinflamatorios según dolor',
        'Metformina 1000mg 2x día, Gabapentina 300mg 3x día, Vitaminas del complejo B',
        'Atenolol 50mg 1x día, Enalapril 10mg 1x día, Aspirina 100mg 1x día',
        'Bifosfonatos mensuales, Calcio 1200mg diario, Vitamina D 2000 UI',
        'Donepezilo 10mg 1x día, Antidepresivos según necesidad, Ansiolíticos según necesidad',
        'Metformina 850mg 2x día, Glibenclamida 5mg 1x día, Enalapril 10mg 1x día',
        'Paracetamol 500mg 3x día, Ibuprofeno 400mg según dolor, Glucosamina 1500mg diario',
        'Salbutamol 2x día, Beclometasona inhalada, Antihistamínicos',
        'Atenolol 50mg 1x día, Furosemida 40mg 1x día, Estatinas 20mg 1x día',
        'Memantina 20mg 1x día, Quetiapina 25mg según necesidad, Melatonina 3mg nocturno'
      ])[1 + (i % 20)],
      (ARRAY[
        'Penicilina, Sulfamidas',
        'Ninguna conocida',
        'Polen, Ácaros, Pelo de gato',
        'Ninguna conocida',
        'Lactosa',
        'Ninguna conocida',
        'Gluten',
        'Ninguna conocida',
        'Contraste yodado',
        'Mariscos, Frutos secos',
        'Ninguna conocida',
        'Metformina (leve)',
        'Ninguna conocida',
        'Lactosa, Huevos',
        'Ninguna conocida',
        'Penicilina',
        'Ninguna conocida',
        'Polen, Ácaros',
        'Ninguna conocida',
        'Sulfamidas, Aspirina'
      ])[1 + (i % 20)],
      CASE 
        WHEN i % 3 = 0 THEN 'Sin sal, bajo en carbohidratos'
        WHEN i % 3 = 1 THEN 'Rica en calcio, sin cafeína'
        ELSE 'Sin azúcar, rica en fibra'
      END,
      (ARRAY[
        'Historia familiar de diabetes tipo 2, hipertensión arterial',
        'Antecedentes familiares de enfermedades cardíacas, osteoporosis',
        'Historia familiar de asma, alergias estacionales',
        'Antecedentes familiares de diabetes tipo 1, problemas oculares',
        'Historia familiar de demencia, Alzheimer',
        'Antecedentes familiares de Parkinson, trastornos neurológicos',
        'Historia familiar de Alzheimer, demencia senil',
        'Antecedentes familiares de glaucoma, cataratas',
        'Historia familiar de problemas renales, hipertensión',
        'Antecedentes familiares de EPOC, enfermedades respiratorias',
        'Historia familiar de artritis reumatoide, enfermedades autoinmunes',
        'Antecedentes familiares de diabetes, neuropatía',
        'Historia familiar de enfermedades cardíacas, hipertensión',
        'Antecedentes familiares de osteoporosis, fracturas',
        'Historia familiar de demencia, pérdida de memoria',
        'Antecedentes familiares de diabetes, obesidad',
        'Historia familiar de artritis, dolor crónico',
        'Antecedentes familiares de asma, problemas respiratorios',
        'Historia familiar de enfermedades cardiovasculares',
        'Antecedentes familiares de demencia, trastornos cognitivos',
        'Historia familiar de hipertensión, diabetes',
        'Antecedentes familiares de artritis, osteoporosis',
        'Historia familiar de problemas respiratorios, asma',
        'Antecedentes familiares de enfermedades cardíacas',
        'Historia familiar de diabetes, hipertensión',
        'Antecedentes familiares de demencia, Alzheimer',
        'Historia familiar de artritis, dolor articular',
        'Antecedentes familiares de problemas oculares',
        'Historia familiar de enfermedades renales',
        'Antecedentes familiares de EPOC, bronquitis',
        'Historia familiar de diabetes tipo 2',
        'Antecedentes familiares de hipertensión arterial',
        'Historia familiar de osteoporosis',
        'Antecedentes familiares de enfermedades cardíacas',
        'Historia familiar de demencia',
        'Antecedentes familiares de artritis',
        'Historia familiar de asma',
        'Antecedentes familiares de glaucoma',
        'Historia familiar de problemas renales',
        'Sin antecedentes familiares relevantes'
      ])[1 + (i % 40)],
      CASE 
        WHEN i % 4 = 0 THEN 'Paciente estable, requiere monitoreo regular. Prefiere actividades de grupo.'
        WHEN i % 4 = 1 THEN 'Movilidad reducida, necesita ayuda para caminar. Le gusta la música y la lectura.'
        WHEN i % 4 = 2 THEN 'Independiente, solo supervisión general. Muy activo en actividades recreativas.'
        ELSE 'Requiere supervisión constante. Le gusta la jardinería y las manualidades.'
      END,
      NOW() - (i || ' days')::INTERVAL,
      NOW() - (i || ' days')::INTERVAL
    );
  END LOOP;
  
  RAISE NOTICE '✓ Se han creado 40 pacientes de prueba exitosamente';
END $$;

-- Verificar que se crearon los pacientes
SELECT 
  'Pacientes creados' as resumen,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'Activo') as activos,
  COUNT(*) FILTER (WHERE status = 'Inactivo') as inactivos,
  COUNT(*) FILTER (WHERE gender = 'Masculino') as masculinos,
  COUNT(*) FILTER (WHERE gender = 'Femenino') as femeninos
FROM patients;

-- Mostrar algunos ejemplos
SELECT 
  patient_number,
  full_name,
  age,
  gender,
  status,
  medical_conditions,
  emergency_contact_name
FROM patients
ORDER BY created_at DESC
LIMIT 10;
