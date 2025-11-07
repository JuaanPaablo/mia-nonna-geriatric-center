# Configuración de Supabase para Mia Nonna

Esta guía te ayudará a configurar Supabase para el proyecto del centro geriátrico Mia Nonna.

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Supabase (gratuita disponible)
- Git instalado

## 🚀 Configuración Paso a Paso

### 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa la información:
   - **Name**: `mia-nonna-geriatric-center`
   - **Database Password**: Genera una contraseña segura (guárdala)
   - **Region**: Selecciona la más cercana a tu ubicación
5. Haz clic en "Create new project"

### 2. Obtener Credenciales

Una vez creado el proyecto:

1. Ve a **Settings** → **API**
2. Copia las siguientes credenciales:
   - **Project URL**
   - **anon public key**
   - **service_role key** (mantener en secreto)

### 3. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` con tus credenciales:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_WHATSAPP_NUMBER=+34612345678
   ```

### 4. Ejecutar Migraciones

#### Opción A: Usando la Interfaz Web de Supabase

1. Ve a tu proyecto en Supabase
2. Navega a **SQL Editor**
3. Copia y pega el contenido de `supabase/migrations/001_initial_schema.sql`
4. Ejecuta el script
5. Luego copia y pega el contenido de `supabase/seed.sql`
6. Ejecuta el script de datos iniciales

#### Opción B: Usando Supabase CLI (Recomendado)

1. Instala Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Inicia sesión:
   ```bash
   supabase login
   ```

3. Vincula tu proyecto:
   ```bash
   supabase link --project-ref tu-project-id
   ```

4. Ejecuta las migraciones:
   ```bash
   supabase db push
   ```

5. Ejecuta los datos iniciales:
   ```bash
   supabase db seed
   ```

### 5. Configurar Autenticación

1. Ve a **Authentication** → **Settings**
2. En **Site URL**, configura: `http://localhost:3000`
3. En **Redirect URLs**, añade:
   - `http://localhost:3000/auth/callback`
   - `https://tu-dominio.com/auth/callback` (para producción)

### 6. Configurar Row Level Security (RLS)

Las políticas de RLS ya están incluidas en las migraciones, pero puedes verificarlas:

1. Ve a **Authentication** → **Policies**
2. Revisa que todas las tablas tengan RLS habilitado
3. Verifica que las políticas estén activas

### 7. Crear Usuario Administrador

1. Ve a **Authentication** → **Users**
2. Haz clic en "Invite a user"
3. Introduce el email del administrador
4. Una vez confirmado, ve a **SQL Editor**
5. Ejecuta:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'
   WHERE email = 'admin@mianonna.com';
   ```

## 📊 Verificar la Configuración

### 1. Verificar Tablas

Ve a **Table Editor** y confirma que tienes estas tablas:
- `users`
- `patients`
- `enrollments`
- `contact_forms`
- `services`

### 2. Verificar Datos de Prueba

En **Table Editor** → **services**, deberías ver los servicios de ejemplo.

### 3. Probar la Conexión

En tu aplicación Next.js:

```bash
npm run dev
```

Verifica que no hay errores de conexión en la consola.

## 🔧 Funcionalidades Avanzadas

### Configurar Storage (Opcional)

Para subir imágenes de pacientes o documentos:

1. Ve a **Storage**
2. Crea un bucket llamado `patient-documents`
3. Configura las políticas de acceso según necesites

### Configurar Edge Functions (Opcional)

Para funcionalidades avanzadas como notificaciones:

1. Ve a **Edge Functions**
2. Puedes crear funciones para:
   - Envío de emails automáticos
   - Procesamiento de datos
   - Integraciones con terceros

### Configurar Webhooks (Opcional)

Para integraciones en tiempo real:

1. Ve a **Database** → **Webhooks**
2. Configura webhooks para:
   - Nuevos formularios de contacto
   - Cambios en el estado de pacientes
   - Notificaciones a familiares

## 🚨 Seguridad

### Variables de Entorno en Producción

**NUNCA** expongas estas variables:
- `SUPABASE_SERVICE_ROLE_KEY`
- Credenciales de base de datos

### Configurar HTTPS

En producción, asegúrate de:
1. Usar HTTPS en tu dominio
2. Actualizar las Redirect URLs
3. Configurar CORS apropiadamente

### Backup de Base de Datos

Supabase hace backups automáticos, pero considera:
1. Exportar datos periódicamente
2. Tener un plan de recuperación
3. Probar las restauraciones

## 📈 Monitoreo

### Dashboard de Supabase

Utiliza el dashboard para monitorear:
- **Usage**: Uso de la base de datos
- **Logs**: Errores y actividad
- **Performance**: Consultas lentas

### Alertas

Configura alertas para:
- Límites de uso alcanzados
- Errores en la aplicación
- Actividad sospechosa

## 🆘 Solución de Problemas

### Error de Conexión

Si no puedes conectar:
1. Verifica las variables de entorno
2. Confirma que el proyecto está activo
3. Revisa los logs en Supabase

### Errores de Permisos

Si hay errores de RLS:
1. Verifica que el usuario está autenticado
2. Confirma que las políticas están activas
3. Revisa los roles asignados

### Problemas de Migraciones

Si las migraciones fallan:
1. Revisa los logs de error
2. Ejecuta las queries manualmente
3. Verifica las dependencias

## 📚 Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guías de Next.js con Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/reference/cli)

## ✅ Checklist de Configuración

- [ ] Proyecto creado en Supabase
- [ ] Variables de entorno configuradas
- [ ] Migraciones ejecutadas
- [ ] Datos de prueba cargados
- [ ] RLS configurado
- [ ] Usuario administrador creado
- [ ] Autenticación configurada
- [ ] Aplicación conectada exitosamente

¡Una vez completados todos estos pasos, tu base de datos estará lista para el centro geriátrico Mia Nonna! 🏥✨
