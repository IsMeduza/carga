# 🚀 Cómo Iniciar la Web con Efectos Visuales

## 📋 Requisitos Previos

- Node.js instalado
- Python (opcional, para servidor simple)
- Navegador web moderno

---

## 🌐 Opción 1: Servidor Simple (Recomendado para ver efectos)

### Paso 1: Navegar al directorio público
```bash
cd i:\finitue\carga\frontend\public
```

### Paso 2: Iniciar servidor Python
```bash
python -m http.server 8000
```

### Paso 3: Acceder a la web
```
http://localhost:8000/home.html
```

---

## ⚛️ Opción 2: Servidor React (Completo)

### Paso 1: Navegar al directorio frontend
```bash
cd i:\finitue\carga\frontend
```

### Paso 2: Instalar dependencias (solo primera vez)
```bash
npx yarn install
```

### Paso 3: Iniciar servidor de desarrollo
```bash
npx yarn start
```

### Paso 4: Acceder a la web
```
http://localhost:3000
```

---

## ✨ Efectos Visuales Implementados

### 🌟 Efectos de Brillo (btn-shine)
**Botones con efecto sweep:**
- ✅ "Iniciar sesión" (navegación)
- ✅ "Crear cuenta" (navegación) 
- ✅ "Ver cómo funciona" (CTA principal)
- ✅ "Empezar como transportista — gratis"
- ✅ "Publicar mi primera carga — gratis"
- ✅ Todas las 9 preguntas del FAQ

**Cómo funciona:**
- Pasa el cursor sobre cualquier botón
- Verás un brillo que se desplaza de izquierda a derecha
- Animación de 0.6s con gradiente lineal

### 🎯 Efectos Magnéticos (magnetic-btn)
**Botones con seguimiento del cursor:**
- Todos los botones principales tienen efecto magnético
- El botón "sigue" sutilmente al cursor
- Desplazamiento de 15% de la distancia del cursor

**Cómo funciona:**
- Mueve el cursor sobre cualquier botón
- El botón se desplaza ligeramente hacia el cursor
- Vuelve a su posición original al salir el cursor

### 🎮 Efectos 3D Interactivos
**Elementos con rotación 3D:**

#### 1. Dashboard Mockup Principal
- **Rotación**: ±10 grados en X e Y
- **Elevación**: 20px (translateZ)
- **Perspectiva**: 1000px
- **Animación retorno**: 0.6s con curva suave

#### 2. Tarjeta "Resumen de envíos"
- **Rotación**: ±8 grados en X e Y  
- **Elevación**: 10px (translateZ)
- **Perspectiva**: 1000px
- **Animación retorno**: 0.4s con curva suave

#### 3. Tarjeta "Cargas disponibles"
- **Rotación**: ±8 grados en X e Y
- **Elevación**: 10px (translateZ)
- **Perspectiva**: 1000px
- **Animación retorno**: 0.4s con curva suave

**Cómo funciona:**
- Mueve el cursor sobre estos elementos
- Verás rotación 3D basada en la posición del cursor
- El elemento "flota" y responde naturalmente
- Al salir el cursor, vuelve suavemente a su posición

---

## 🎨 Tecnologías Utilizadas

### CSS
- **Pseudo-elementos** ::after para efecto de brillo
- **@keyframes** para animaciones sweep
- **transform-style: preserve-3d** para efectos 3D
- **perspective** para profundidad 3D
- **transitions** con curvas cubic-bezier

### JavaScript
- **Event listeners** para mousemove y mouseleave
- **Cálculos matemáticos** para rotación basada en cursor
- **Transformaciones CSS dinámicas**
- **setTimeout** para restaurar transiciones

### Librerías
- **GSAP** para animaciones de scroll
- **ScrollTrigger** para animaciones al hacer scroll
- **TailwindCSS** para estilos base

---

## 🔍 Pruebas de Efectos

### Para probar el brillo:
1. Pasa el cursor sobre cualquier botón
2. Observa el efecto sweep de izquierda a derecha
3. Verifica que todos los botones mencionados lo tengan

### Para probar efectos magnéticos:
1. Mueve el cursor lentamente sobre los botones
2. Observa el seguimiento suave del cursor
3. Verifica que vuelven a su posición original

### Para probar efectos 3D:
1. Mueve el cursor sobre el dashboard principal
2. Observa la rotación en 3D (±10°)
3. Prueba las tarjetas "Resumen de envíos" y "Cargas disponibles"
4. Verifica la animación de retorno suave

---

## 🛠️ Troubleshooting

### Si el servidor no inicia:
```bash
# Verificar Python
python --version

# Usar ruta completa de Python
C:\Users\TU_USUARIO\AppData\Local\Python\pythoncore-3.14-64\python.exe -m http.server 8000
```

### Si los efectos no funcionan:
1. Verifica que el archivo home.html esté cargado completamente
2. Revisa la consola del navegador (F12) para errores
3. Asegúrate de que JavaScript esté habilitado

### Si el servidor React no funciona:
```bash
# Limpiar caché
npx yarn cache clean

# Reinstalar dependencias
npx yarn install --force

# Iniciar nuevamente
npx yarn start
```

---

## 📱 Compatibilidad

### Navegadores soportados:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Dispositivos:
- ✅ Desktop (todos los efectos)
- ✅ Tablet (efectos adaptados)
- ⚠️ Mobile (efectos 3D desactivados para rendimiento)

---

## 🎯 Tips Adicionales

### Para desarrollo:
- Usa el servidor Python para pruebas rápidas
- El servidor React es para desarrollo completo
- Ambos servidores muestran los mismos efectos

### Para presentación:
- Abre en pantalla completa
- Usa un navegador moderno
- Prueba todos los efectos antes de presentar

### Para debugging:
- Abre DevTools (F12)
- Revisa la pestaña Console
- Observa las transformaciones CSS en Elements

---

## 🚀 Listo para usar

¡Con estos pasos tendrás la web funcionando con todos los efectos visuales implementados! La experiencia incluye:

- 🌟 **Brillos sweep** en botones
- 🎯 **Efectos magnéticos** interactivos  
- 🎮 **Efectos 3D** en dashboard y tarjetas
- 🎨 **Animaciones suaves** y profesionales
- 📱 **Diseño responsive** y moderno

Disfruta de la experiencia visual completa de la plataforma de transporte! 🚛✨
