-- Script para crear un usuario administrador en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Crear el usuario administrador
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@mianonna.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Administrador", "role": "admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- 2. Verificar que el usuario se creó correctamente
SELECT 
  id,
  email,
  role,
  created_at,
  raw_user_meta_data
FROM auth.users 
WHERE email = 'admin@mianonna.com';

-- 3. Si prefieres usar la interfaz de Supabase:
-- Ve a Authentication > Users > Add User
-- Email: admin@mianonna.com
-- Password: admin123
-- Marca "Auto-confirm email" si quieres que se confirme automáticamente
