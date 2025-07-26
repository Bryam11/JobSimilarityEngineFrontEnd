# JobMatch - Plataforma de Recomendación de Trabajos

Una moderna aplicación web tipo LinkedIn para la búsqueda y recomendación de trabajos, construida con Next.js, TypeScript y Tailwind CSS.

## 🚀 Características

- **🔐 Autenticación completa**: Login, registro y gestión de sesiones con JWT
- **👤 Gestión de perfil**: Perfil de usuario completo con experiencia, educación y habilidades
- **🔍 Búsqueda avanzada**: Filtros por ubicación, tipo de trabajo, salario y más
- **🎯 Recomendaciones inteligentes**: Sistema de recomendación de trabajos basado en el perfil
- **📱 Diseño responsive**: Experiencia optimizada para desktop y móvil
- **🎨 UI moderna**: Interfaz elegante y fácil de usar con Tailwind CSS

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilos**: Tailwind CSS 4
- **Iconos**: Lucide React
- **HTTP Client**: Axios
- **Fechas**: date-fns
- **Gestión de estado**: React Context API
- **Autenticación**: JWT con cookies

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd job-similarity-engine-front-end
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   
   Edita el archivo `.env.local` con tus configuraciones:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador**
   
   Ve a [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── dashboard/         # Dashboard principal
│   ├── jobs/             # Búsqueda y detalle de trabajos
│   ├── login/            # Página de login
│   ├── profile/          # Perfil de usuario
│   ├── register/         # Registro de usuario
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Landing page
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes de UI básicos
│   └── Navbar.tsx       # Barra de navegación
├── contexts/            # Contextos de React
│   └── AuthContext.tsx  # Contexto de autenticación
├── lib/                 # Utilidades y servicios
│   ├── api.ts          # Cliente HTTP configurado
│   ├── services.ts     # Servicios de API
│   └── utils.ts        # Funciones de utilidad
└── types/              # Definiciones de TypeScript
    └── index.ts        # Tipos principales
```

## 🔌 API Endpoints

La aplicación está preparada para conectarse con un backend que implemente los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `GET /api/auth/profile` - Obtener perfil del usuario
- `PUT /api/auth/profile` - Actualizar perfil del usuario

### Trabajos
- `GET /api/jobs/search` - Buscar trabajos con filtros
- `GET /api/jobs/:id` - Obtener detalle de trabajo
- `GET /api/jobs/recommended` - Obtener trabajos recomendados
- `POST /api/jobs/:id/apply` - Aplicar a un trabajo

## 🎯 Funcionalidades Principales

### 1. Landing Page
- Hero section atractivo
- Características principales
- Estadísticas de la plataforma
- Preview de trabajos destacados
- Footer completo

### 2. Autenticación
- **Registro**: Formulario completo con validaciones
- **Login**: Autenticación con email y contraseña
- **Gestión de sesiones**: JWT almacenado en cookies seguras
- **Protección de rutas**: Redirección automática según estado de autenticación

### 3. Dashboard
- Saludo personalizado al usuario
- Acciones rápidas (buscar trabajos, ver perfil, estadísticas)
- Trabajos recomendados basados en el perfil
- Trabajos recientes
- Widget de progreso del perfil

### 4. Búsqueda de Trabajos
- **Barra de búsqueda**: Por título, empresa o habilidades
- **Filtros avanzados**: 
  - Ubicación
  - Tipo de trabajo (tiempo completo, parcial, contrato, etc.)
  - Rango salarial
  - Trabajo remoto
- **Resultados**: Cards con información completa
- **Ordenamiento**: Por fecha, salario, relevancia
- **Paginación**: Navegación entre páginas de resultados

### 5. Detalle de Trabajo
- Información completa del trabajo
- Descripción detallada
- Requisitos y habilidades
- Información de la empresa
- Botón de aplicación
- Trabajos similares
- Consejos para la aplicación

### 6. Perfil de Usuario
- **Información básica**: Nombre, email, título, empresa, ubicación
- **Biografía**: Descripción personal y profesional
- **Habilidades**: Lista de competencias técnicas
- **Experiencia laboral**: Historial profesional (preparado para futuras implementaciones)
- **Educación**: Formación académica (preparado para futuras implementaciones)
- **Estadísticas**: Aplicaciones enviadas, vistas del perfil

## 🎨 Diseño y UX

- **Tema de colores**: Azules profesionales con acentos verdes
- **Tipografía**: Sistema de fuentes Geist optimizado
- **Iconografía**: Lucide React para iconos consistentes
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Micro-interacciones**: Hover effects y transiciones suaves
- **Loading states**: Skeletons y spinners para mejor UX

## 🔒 Seguridad

- **JWT**: Tokens seguros para autenticación
- **Cookies httpOnly**: Almacenamiento seguro de tokens
- **Validación de formularios**: Cliente y servidor
- **Sanitización de datos**: Prevención de XSS
- **Rutas protegidas**: Verificación de autenticación

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run start        # Inicia servidor de producción

# Código
npm run lint         # Ejecuta ESLint
```

## 🔧 Configuración del Backend

Para conectar con tu backend, asegúrate de que implemente los endpoints mencionados anteriormente. Ejemplo de respuesta esperada:

```typescript
// Login response
{
  "user": {
    "id": "123",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "title": "Desarrollador Full Stack",
    "company": "TechCorp"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

// Jobs search response
[
  {
    "id": "1",
    "title": "Desarrollador Full Stack",
    "company": "TechCorp",
    "location": "Madrid, España",
    "type": "full-time",
    "salary": { "min": 50000, "max": 70000, "currency": "EUR" },
    "description": "...",
    "requirements": ["React", "Node.js"],
    "skills": ["JavaScript", "React"],
    "postedDate": "2025-01-07T10:00:00Z",
    "remote": false
  }
]
```

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- 📧 Email: soporte@jobmatch.com
- 🐛 Issues: GitHub Issues
- 📖 Documentación: Wiki del proyecto
