# ☁️ Guía de Despliegue en la Nube (Cloudflare)

Esta guía explica cómo subir los cambios a producción y cómo está estructurada la aplicación actualmente.

## 🚀 Despliegue Rápido a Producción

Para actualizar la web en vivo, sigue estos pasos desde la terminal:

```bash
# 1. Entrar en la carpeta del proyecto
cd i:\finitue\carga\frontend

# 2. Generar la versión de producción (Compilar)
npm run build

# 3. Subir a Cloudflare Pages
npx wrangler pages deploy build
```

👉 **URL de Producción:** **[https://carga-57w.pages.dev](https://carga-57w.pages.dev)**

---

## 🏗️ Arquitectura Actual (Estado Crítico)

Actualmente la aplicación tiene una **estructura mixta** que debemos unificar:

1.  **Landing Page (`/home.html`)**: Es un archivo HTML estático dentro de la carpeta `public`. Se carga de forma independiente a React.
2.  **Dashboard (`/dashboard`)**: Es una aplicación Single Page Application (SPA) construida con **React**.

> ⚠️ **Nota:** Al ser una estructura mixta, el paso de la Home al Dashboard provoca una recarga completa del navegador. Se recomienda migrar `home.html` a un componente de React para una experiencia fluida.

---

## ⚙️ Configuración de Cloudflare

- **Proyecto:** `carga`
- **Plataforma:** Cloudflare Pages (Direct Upload)
- **SSL/HTTPS:** Cloudflare gestiona el certificado automáticamente en el dominio principal `.pages.dev`.

### 🚨 Solución de errores comunes
- **Error SSL (Cipher Mismatch):** Ocurre a veces en los enlaces de "preview" generados por Wrangler (ej. `hash.proyecto.pages.dev`). Usa siempre el enlace principal `https://carga-57w.pages.dev` para evitarlo.
- **Cambios no se ven:** Asegúrate de ejecutar siempre `npm run build` ANTES de hacer el deploy, de lo contrario estarás subiendo la versión antigua de la carpeta `build`.

---

## 🛠️ Próximos Pasos Recomendados
1.  **Migración a React:** Convertir `home.html` en un componente para eliminar el salto brusco entre páginas.
2.  **Backend Moderno:** Implementar Cloudflare Workers para sustituir los datos de prueba (`DEMO_CARGAS`) por una base de datos real.
