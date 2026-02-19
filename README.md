# Nombre - Plataforma de Transporte

Marketplace de transporte por carretera en España. Conecta generadores de carga con transportistas verificados.

## Arquitectura

```
/app/
├── backend/                # FastAPI Backend
│   ├── server.py           # App principal + endpoints API
│   ├── auth.py             # Middleware Supabase JWT
│   ├── requirements.txt    # Dependencias Python
│   └── .env                # Variables de entorno
├── frontend/               # React Frontend (CRA + CRACO)
│   ├── src/
│   │   ├── App.js          # Router principal
│   │   ├── constants.js    # Constantes globales
│   │   ├── lib/
│   │   │   ├── supabase.js # Cliente Supabase
│   │   │   └── utils.js    # Utilidades
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Contexto de autenticacion
│   │   ├── hooks/
│   │   │   ├── useDebounce.js  # Hook debounce
│   │   │   └── use-toast.js    # Hook toast
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx # Rutas protegidas
│   │   │   ├── ErrorBoundary.js   # Error boundary
│   │   │   └── ui/               # Componentes shadcn/ui
│   │   └── pages/
│   │       ├── LoginPage.jsx      # Login con Supabase
│   │       ├── RegisterPage.jsx   # Registro con Supabase (3 pasos)
│   │       ├── DashboardPage.js   # Dashboard principal
│   │       └── Dashboard.css      # Estilos dashboard
│   ├── package.json
│   ├── craco.config.js
│   └── tailwind.config.js
└── README.md
```

## Stack Tecnologico

- **Frontend**: React 19, Tailwind CSS, shadcn/ui, Mapbox GL JS
- **Backend**: FastAPI, Motor (MongoDB async), httpx
- **Auth**: Supabase (email/password)
- **Base de datos**: MongoDB (datos de la app), Supabase (auth)

## Autenticacion

Se usa Supabase para autenticacion real:
- **Login**: Email + Password via `supabase.auth.signInWithPassword()`
- **Register**: Formulario de 3 pasos, crea cuenta via `supabase.auth.signUp()`
- **Rutas protegidas**: El dashboard requiere sesion activa
- **Backend**: Verifica tokens JWT llamando a la API de Supabase

## API Endpoints

### Publicos
- `GET /api/` - Status
- `GET /api/stats` - Estadisticas generales
- `GET /api/cargas` - Lista de cargas disponibles
- `GET /api/envios` - Lista de envios
- `GET /api/transportistas` - Lista de transportistas
- `POST /api/chat` - Chat asistente

### Protegidos (requieren JWT)
- `GET /api/auth/me` - Perfil del usuario
- `POST /api/auth/profile` - Crear/actualizar perfil
- `POST /api/cargas/accept/{id}` - Aceptar carga

## Variables de Entorno

### Backend (.env)
- `MONGO_URL` - URL de MongoDB
- `DB_NAME` - Nombre de la base de datos
- `SUPABASE_URL` - URL del proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key de Supabase

### Frontend (.env)
- `REACT_APP_BACKEND_URL` - URL del backend
- `REACT_APP_SUPABASE_URL` - URL del proyecto Supabase
- `REACT_APP_SUPABASE_ANON_KEY` - Anon key de Supabase

## Instalacion

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
yarn install
```

## Desarrollo

```bash
# Backend (puerto 8001)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload

# Frontend (puerto 3000)
yarn start
```
