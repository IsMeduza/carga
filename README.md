# 🚛 Plataforma de Transporte "Nombre" - Marketplace Logístico

¡Bienvenido a la plataforma líder para el transporte de mercancías por carretera en España! Este marketplace conecta de forma eficiente a generadores de carga con una red de transportistas verificados, optimizando la logística y reduciendo los tiempos de inactividad.

---

## 🏗️ Arquitectura del Sistema

El proyecto está diseñado siguiendo una arquitectura de microservicios simplificada, separando claramente las responsabilidades del cliente y el servidor:

```text
/app/
├── backend/                # 🚀 API Core (FastAPI)
│   ├── server.py           # Endpoints principales y lógica de negocio
│   ├── auth.py             # Middleware de autenticación con Supabase JWT
│   ├── requirements.txt    # Dependencias de Python
│   └── .env                # Variables de entorno (Configuración)
├── frontend/               # ⚛️ Interfaz de Usuario (React + Tailwind)
│   ├── src/
│   │   ├── App.js          # Enrutador y estructura base
│   │   ├── context/        # Gestión de estado global (AuthContext)
│   │   ├── components/     # Componentes reutilizables y UI (Shadcn)
│   │   └── pages/          # Vistas principales (Dashboard, Login, etc.)
│   ├── package.json        # Configuración de npm/yarn
│   ├── craco.config.js     # Personalización de CRA
│   └── tailwind.config.js  # Estilos atómicos
├── memory/                 # 🧠 Documentación de producto (PRD)
└── README.md               # 📖 Esta guía
```

---

## 🛠️ Stack Tecnológico

### Frontend: Experiencia de Usuario Premium
- **React 19**: Biblioteca base para una UI reactiva.
- **Tailwind CSS**: Estilizado moderno y eficiente.
- **shadcn/ui**: Componentes de alta calidad y accesibles.
- **Mapbox GL JS**: Visualización interactiva de rutas y cargas.
- **Framer Motion**: Animaciones fluidas para una sensación "premium".

### Backend: Potencia y Fiabilidad
- **FastAPI**: Framwork asíncrono de alto rendimiento para Python.
- **MongoDB**: Base de datos NoSQL para flexibilidad en los datos de carga.
- **Supabase Auth**: Autenticación segura y escalable (JWT).
- **Motor**: Driver asíncrono para MongoDB.

---

## 🚀 Guía de Instalación y Uso

### 1. Requisitos Previos
- **Python 3.10+**
- **Node.js 18+** y **npm** (o yarn).
- **MongoDB**: Una instancia corriendo localmente en el puerto `27017` o una URL remota.
- **Cuenta de Supabase**: Con un proyecto configurado.

### 2. Configuración del Backend
```bash
cd backend
pip install -r requirements.txt
# Asegúrate de configurar el archivo .env con:
# MONGO_URL, DB_NAME, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

Para iniciar el servidor:
```bash
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 3. Configuración del Frontend
Si ya existe un archivo `yarn.lock`, se recomienda usar **yarn**. Si no tienes yarn instalado globalmente, puedes usar `npx`.

```bash
cd frontend
# Instalación de dependencias
npx yarn install

# Iniciar servidor de desarrollo (Puerto 3000)
npx yarn start
```

---

## 🔐 Autenticación y Seguridad

La plataforma utiliza **Supabase** para gestionar la identidad de los usuarios:
- **Login/Registro**: Implementado a nivel de cliente con `AuthContext`.
- **Protección de Rutas**: Los componentes `ProtectedRoute` aseguran que solo usuarios autenticados accedan al Dashboard.
- **Verificación Backend**: Cada petición protegida incluye un token JWT que es validado por el backend llamando a Supabase, garantizando que los datos solo sean accesibles por sus dueños.

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/` | Estado de la API | Público |
| `GET` | `/api/stats` | Estadísticas generales del mercado | Público |
| `GET` | `/api/cargas` | Listado de cargas disponibles con filtros | Público |
| `POST` | `/api/chat` | Asistente inteligente para transporte | Público |
| `GET` | `/api/auth/me` | Perfil del usuario actual | Protegido |
| `POST` | `/api/cargas/accept/{id}`| Aceptar una carga y crear envío | Protegido |

---

## 📝 Notas de Desarrollo
> **IMPORTANTE**: La documentación anterior mencionaba errores en los comandos iniciales. Se ha corregido para incluir el uso de `npx` y la necesidad de tener **MongoDB** activo para que el sembrado de datos (seeding) no falle al arrancar el backend.
