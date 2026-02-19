# 🚀 Guía de Inicio Rápido - Plataforma Carga

## Requisitos Previos
- **Python 3.10+**
- **Node.js 18+** y **npm**
- **MongoDB** (local o remoto)
- **Cuenta de Supabase** (ya configurada en el proyecto)

## 🛠️ Pasos de Inicio

### 1. Backend (Puerto 8001)
```bash
# Navegar al directorio del backend
cd f:/finitue/carga/backend

# Instalar dependencias (solo la primera vez)
pip install -r requirements.txt

# Iniciar servidor de desarrollo
python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Nota:** Si tienes problemas con Python, usa la ruta completa:
```bash
C:\Users\maxsa\AppData\Local\Python\pythoncore-3.14-64\python.exe -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Frontend (Puerto 3000)
```bash
# Navegar al directorio del frontend
cd f:/finitue/carga/frontend

# Instalar dependencias (solo la primera vez)
npx yarn install

# Iniciar servidor de desarrollo
npx yarn start
```

## 🔍 Verificación de Funcionamiento

### Backend
- Abre: `http://localhost:8001/api/`
- Deberías ver: `{"status": "ok", "message": "Carga Platform API v2.0.0"}`

### Frontend
- Abre: `http://localhost:3000`
- Verás la interfaz de la plataforma de transporte

## ⚠️ Troubleshooting

### Problemas Comunes
1. **MongoDB no está activo**: Asegúrate que MongoDB esté corriendo en `localhost:27017`
2. **Python no encuentra uvicorn**: Usa la ruta completa de Python como se muestra arriba
3. **Problemas con yarn**: Usa `npx yarn` en lugar de `yarn` directamente

### Variables de Entorno
El archivo `.env` ya está configurado con:
- `MONGO_URL=mongodb://localhost:27017`
- `DB_NAME=carga`
- Credenciales de Supabase incluidas

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/` | Estado de la API |
| GET | `/api/stats` | Estadísticas del mercado |
| GET | `/api/cargas` | Listado de cargas |
| POST | `/api/chat` | Asistente inteligente |

## 🎯 Acceso a la Aplicación

Una vez ambos servidores estén corriendo:
1. **Frontend**: `http://localhost:3000`
2. **Backend API**: `http://localhost:8001`
3. **Documentación API**: `http://localhost:8001/docs`

La plataforma está lista para usar!
