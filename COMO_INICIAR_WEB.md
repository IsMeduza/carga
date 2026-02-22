# 🚀 Guía de Inicio Rápido

## 1. Servidor Estático (Recomendado para efectos visuales)
Ideal para ver rápidamente los efectos 3D, brillos y animaciones.

```bash
# Navegar a la carpeta pública
cd i:\finitue\carga\frontend\public

# Iniciar servidor
python -m http.server 8000
```
👉 Acceder a: **[http://localhost:8000/home.html](http://localhost:8000/home.html)**

---

## 2. Servidor React (Proyecto completo)
Para desarrollo y funcionalidad completa de la aplicación.

```bash
# Navegar al frontend
cd .\carga\
cd .\frontend\

# Iniciar aplicación
npm start
```
👉 Acceder a: **[http://localhost:3000](http://localhost:3000)**

---

## ✨ Características Principales
- **Efectos 3D**: Hover en tarjetas y dashboard.
- **Efecto Brillo**: En todos los botones principales.
- **Botones Magnéticos**: El botón sigue sutilmente al cursor.
- **Responsive**: Optimizado para Desktop y Tablet.

---

## 🛠️ Solución de Problemas
- **Faltan archivos**: Ejecuta `npm install --force` en la carpeta `frontend`.
- **Puerto ocupado**: Cierra otros servidores o usa `netstat -ano | findstr :3000` para identificar el proceso.
- **Backend**: Requiere MongoDB activo en el puerto 27017.
