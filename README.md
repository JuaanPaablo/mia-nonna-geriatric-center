# Mia Nonna - Centro Geriátrico

Un sistema de gestión profesional para centros geriátricos construido con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

### Landing Page
- **Header/Navbar** responsivo con navegación completa
- **Hero Section** con llamada a la acción destacada
- **Sección "Por Qué Elegirnos"** con 4 tarjetas destacadas
- **Servicios** detallados del centro geriátrico
- **Galería de Instalaciones** con imágenes optimizadas
- **Personal Médico** y equipo de cuidado
- **Testimonios** de familiares y residentes
- **Formulario de Contacto** con integración WhatsApp
- **Footer** con información completa de contacto

### Panel de Administración
- **Autenticación segura** con Supabase Auth
- **Dashboard** con estadísticas y métricas
- **Gestión de Pacientes** (CRUD completo)
- **Sistema de Matrículas** para nuevos residentes
- **Gestión de Formularios** de contacto
- **Administración de Usuarios** del sistema

### Base de Datos
- **Users**: Administradores del sistema
- **Patients**: Información completa de residentes
- **Enrollments**: Registro de matrículas
- **ContactForms**: Formularios del landing page
- **Services**: Servicios ofrecidos por el centro

## 🛠️ Stack Técnico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript (configuración estricta)
- **Estilos**: Tailwind CSS v4 con tema healthcare
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **UI Components**: shadcn/ui + Radix UI
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React
- **Notificaciones**: React Toastify
- **Deployment**: Optimizado para Vercel

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                # Rutas de autenticación
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/           # Panel de administrador
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── enrollments/
│   │   └── contacts/
│   ├── api/                   # API Routes
│   │   ├── auth/
│   │   ├── patients/
│   │   └── contacts/
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Componentes base (shadcn/ui)
│   ├── forms/                # Formularios específicos
│   ├── layout/               # Componentes de layout
│   └── sections/             # Secciones del landing
├── lib/
│   ├── supabase.ts          # Configuración Supabase
│   ├── utils.ts             # Utilidades generales
│   ├── validations.ts       # Esquemas Zod
│   └── constants.ts         # Constantes de la app
├── types/
│   ├── database.ts          # Tipos de la base de datos
│   └── global.ts            # Tipos globales
└── hooks/
    ├── use-auth.ts          # Hook de autenticación
    └── use-patients.ts      # Hook para pacientes
```

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd mia-nonna-geriatric-center
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local

# Editar .env.local con tus credenciales de Supabase
```

### 4. Configurar Supabase

1. Crear un nuevo proyecto en [Supabase](https://supabase.com)
2. Obtener la URL del proyecto y la clave anónima
3. Actualizar `.env.local` con tus credenciales
4. Ejecutar las migraciones de la base de datos (incluidas en el proyecto)

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗄️ Configuración de la Base de Datos

### Tablas Principales

#### `users` (Administradores)
```sql
- id: UUID (PK)
- email: VARCHAR
- password: VARCHAR (hash)
- role: ENUM('admin', 'staff')
- full_name: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `patients` (Residentes)
```sql
- id: UUID (PK)
- full_name: VARCHAR
- date_of_birth: DATE
- gender: ENUM('male', 'female', 'other')
- medical_conditions: TEXT[]
- emergency_contact: JSONB
- admission_date: DATE
- status: ENUM('active', 'inactive', 'discharged')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `enrollments` (Matrículas)
```sql
- id: UUID (PK)
- patient_id: UUID (FK)
- enrollment_date: DATE
- care_type: ENUM('full_time', 'day_care', 'respite')
- monthly_fee: DECIMAL
- status: ENUM('pending', 'approved', 'rejected')
- created_at: TIMESTAMP
```

#### `contact_forms` (Formularios de Contacto)
```sql
- id: UUID (PK)
- family_name: VARCHAR
- phone: VARCHAR
- email: VARCHAR
- resident_name: VARCHAR
- resident_age: INTEGER
- care_type: VARCHAR
- message: TEXT
- status: ENUM('new', 'contacted', 'converted')
- created_at: TIMESTAMP
```

### Políticas RLS (Row Level Security)

Todas las tablas incluyen políticas de seguridad a nivel de fila para proteger los datos según el rol del usuario.

## 🎨 Tema y Diseño

### Paleta de Colores
- **Primario**: Azules profesionales (#009de6)
- **Secundario**: Verdes suaves (#14b8a6)
- **Acento**: Amarillos cálidos (#eab308)
- **Neutros**: Grises elegantes
- **Estados**: Verde (éxito), Amarillo (advertencia), Rojo (error)

### Tipografía
- **Títulos**: Inter (Sans Serif)
- **Texto**: Merriweather (Serif)
- **UI**: Inter (Sans Serif)

## 📱 Características Técnicas

### Responsive Design
- **Mobile First**: Diseño optimizado para dispositivos móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch Friendly**: Elementos optimizados para pantallas táctiles

### Performance
- **Image Optimization**: Next.js Image con lazy loading
- **Code Splitting**: Carga automática por rutas
- **Caching**: Estrategias de cache optimizadas
- **Bundle Analysis**: Análisis del tamaño del bundle

### SEO
- **Meta Tags**: Configuración completa de metadatos
- **Open Graph**: Integración para redes sociales
- **Schema Markup**: Datos estructurados para motores de búsqueda
- **Sitemap**: Generación automática del sitemap

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variables de entorno en Vercel Dashboard
```

### Variables de Entorno en Producción

Asegúrate de configurar todas las variables de entorno en tu plataforma de deployment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Scripts Disponibles

- `npm run dev`: Servidor de desarrollo
- `npm run build`: Build de producción
- `npm run start`: Servidor de producción
- `npm run lint`: Linting con ESLint
- `npm run lint:fix`: Fix automático de lint
- `npm run type-check`: Verificación de tipos TypeScript

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema
4. Contacta al equipo de desarrollo

## 🏥 Sobre Mia Nonna

Mia Nonna es un centro geriátrico dedicado a proporcionar cuidado de alta calidad y atención personalizada para nuestros residentes, creando un ambiente familiar y profesional donde cada persona recibe el cuidado que merece.
