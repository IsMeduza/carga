# Nombre - Plataforma de Transporte

Marketplace de transporte por carretera en España. Conecta generadores de carga con transportistas verificados.

## 📁 Estructura del Proyecto

```
finiti/
├── index.html              # Landing page principal (sitio estático)
├── auth/
│   ├── login.html          # Login estático (HTML + Tailwind)
│   └── register.html       # Registro estático (HTML + Tailwind)
├── frontend/               # Dashboard React
│   ├── src/
│   │   ├── App.js         # Rutas principales React
│   │   ├── components/
│   │   │   └── ErrorBoundary.js  # Manejo de errores
│   │   └── pages/
│   │       ├── DashboardPage.js   # Dashboard principal
│   │       └── LoginPage.js       # Login React (alternativo)
│   ├── .env               # Configuración desarrollo
│   ├── .env.production    # Configuración producción
│   ├── public/
│   │   ├── manifest.json  # PWA manifest
│   │   └── ...
│   └── package.json       # Dependencias React
├── backend/               # API FastAPI (opcional para desarrollo)
│   └── server.py
├── assets/                # Imágenes, logos, etc.
└── .htaccess              # Config Apache para producción
```

## 🚀 Cómo Iniciar

### Opción 1: Modo Demo (Recomendado)

Funciona completamente sin backend, con datos de demostración.

#### Paso 1: Iniciar el Dashboard React
```bash
cd frontend
npm install        # Solo la primera vez
npm start
```

Esto iniciará el dashboard en `http://localhost:3000`

#### Paso 2: Iniciar el sitio estático (Landing + Login)

Usa **Live Server** de VS Code o cualquier servidor estático:

```bash
# Opción A: Live Server (VS Code extension)
# Click derecho en index.html -> "Open with Live Server"
# Por defecto usa el puerto 5500

# Opción B: Python (si tienes Python instalado)
cd ..  # Volver a la carpeta raíz
python -m http.server 5500

# Opción C: Node.js npx
npx serve . -p 5500
```

El sitio estático estará en `http://localhost:5500`

### Opción 2: Con Backend (Para desarrollo full-stack)

Si necesitas la API real:

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm start

# El backend estará en http://localhost:8000
# El frontend en http://localhost:3000
```

**Nota:** Cambia `DEMO_MODE = false` en:
- `frontend/src/pages/DashboardPage.js`
- `frontend/src/pages/LoginPage.js`

## 🌐 URLs de Desarrollo

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Landing | `http://localhost:5500/index.html` | Página principal estática |
| Login | `http://localhost:5500/auth/login.html` | Login HTML estático |
| Dashboard | `http://localhost:3000/dashboard` | App React con datos demo |
| Login React | `http://localhost:3000/login` | Login React (alternativo) |

## 🔗 Flujo de Navegación

1. **Usuario visita** `http://localhost:5500/index.html` (Landing)
2. **Click "Acceder"** → Va a `http://localhost:5500/auth/login.html`
3. **Click "Acceder en modo demo"** → Va a `http://localhost:3000/dashboard`
4. **Desde Dashboard** → Click logo o "Volver a la web" → Vuelve a `http://localhost:5500/index.html`

## ⚙️ Configuración

### Variables de entorno (frontend/.env)

```env
PORT=3000                      # Puerto del servidor React
FAST_REFRESH=false             # Desactivar hot reload (evita errores WebSocket)
REACT_APP_BACKEND_URL=         # URL del backend (vacío = modo demo)
HOST=localhost                 # Host permitido
```

### Modo Demo

Por defecto, el dashboard funciona en **modo demo** con datos falsos. Para cambiar:

```javascript
// En frontend/src/pages/DashboardPage.js (línea 7)
const DEMO_MODE = true;   // Cambiar a false para usar API real
```

## 🛠 Tech Stack

| Capa | Tecnología |
|------|-----------|
| Landing/Login estático | HTML5 + Tailwind CSS |
| Dashboard | React 19 + shadcn/ui + Tailwind |
| Routing | React Router DOM |
| Build Tool | CRACO (Create React App) |
| Backend (opcional) | FastAPI + MongoDB |

## ✨ Optimizaciones para Producción

### 1. SEO Implementado
- ✅ Meta tags Open Graph / Twitter Cards
- ✅ Descripción y keywords optimizadas
- ✅ Canonical URLs
- ✅ Favicon y Apple Touch Icon

### 2. Performance
- ✅ Lazy Loading con React.lazy() + Suspense
- ✅ Error Boundaries para manejo de errores
- ✅ Code Splitting automático
- ✅ Preconnect DNS para recursos externos
- ✅ Manifest.json para PWA

### 3. Seguridad
- ✅ Headers de seguridad en `.htaccess`
- ✅ X-Frame-Options, X-Content-Type-Options
- ✅ Referrer-Policy
- ✅ HTTPS redirect listo (comentado)

### 4. Accesibilidad
- ✅ Skip links
- ✅ ARIA labels
- ✅ Contraste optimizado
- ✅ Focus visible

## 📦 Build para Producción

```bash
cd frontend
npm run build
```

Esto genera la carpeta `build/` lista para desplegar en:
- Apache/Nginx
- Vercel
- Netlify
- AWS S3 + CloudFront

### Configuración Apache (.htaccess incluido)
- Compresión Gzip/Brotli
- Cache de archivos estáticos
- Redirección HTTPS
- SPA fallback (React Router)

## 🔧 Checklist Pre-Deploy

- [ ] `DEMO_MODE = false` en DashboardPage.js
- [ ] `REACT_APP_BACKEND_URL` configurado en `.env.production`
- [ ] Google Analytics configurado (opcional)
- [ ] Sentry configurado para errores (opcional)
- [ ] Imágenes optimizadas (WebP donde sea posible)
- [ ] Dominio configurado en meta tags
- [ ] SSL/HTTPS habilitado
- [ ] `.htaccess` subido al servidor

## 🐛 Solución de Problemas

### "No se pudo conectar al dashboard"
Asegúrate de:
1. Haber ejecutado `npm start` en la carpeta `frontend`
2. Esperar a que aparezca "Compiled successfully!" en la terminal
3. Que no haya otro servicio usando el puerto 3000

### El botón "Volver a la web" no funciona
Verifica que el Live Server esté corriendo en el puerto 5500, o actualiza la URL en `DashboardPage.js`:
```javascript
const LANDING_URL = 'http://localhost:5500/index.html';
```

### Error 404 en rutas de React
Asegúrate de que el servidor tenga configurado el **SPA fallback**. Con Apache, usa el `.htaccess` incluido. Con Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 📄 Licencia

Proyecto privado - Carga Platform

---

## 🎯 Roadmap

- [ ] Service Worker para offline
- [ ] Push notifications
- [ ] Chat en tiempo real (WebSockets)
- [ ] App móvil (React Native / PWA)
- [ ] Integración con pasarelas de pago
