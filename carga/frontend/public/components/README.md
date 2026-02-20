# Footer Page Component

Componente global reutilizable para todas las páginas del footer que proporciona una estructura y estilos consistentes.

## Archivos

- `footer-page.css` - Estilos CSS reutilizables
- `footer-page-template.html` - Plantilla base con placeholders
- `README.md` - Este documento de instrucciones

## Cómo usar

### 1. Incluir el CSS

```html
<link rel="stylesheet" href="../components/footer-page.css">
```

### 2. Estructura HTML básica

```html
<body class="min-h-screen">
  <!-- Background Layer -->
  <div class="footer-page-bg">
    <img src="sky-background.jpg" alt="Sky Background">
    <div class="gradient-overlay"></div>
    <img src="clouds.jpg" alt="Clouds">
  </div>

  <!-- Navigation -->
  <nav class="footer-page-nav footer-page-anim-up">
    <div class="logo-section">
      <img src="../assets/img/logo.svg" alt="Nombre">
      <a href="../home.html">Nombre</a>
    </div>
    <a href="../home.html" class="back-link">
      <svg>...</svg>
      Volver
    </a>
  </nav>

  <!-- Content -->
  <div class="footer-page-content">
    <div class="footer-page-header footer-page-anim-up footer-page-delay-1">
      <span class="footer-page-breadcrumb">Sección</span>
      <h1 class="footer-page-title footer-page-anim-scale footer-page-delay-2">Título</h1>
      <p class="footer-page-subtitle footer-page-anim-up footer-page-delay-3">Subtítulo</p>
    </div>

    <!-- Tu contenido aquí -->
    <div class="footer-page-card footer-page-anim-up">
      <!-- Contenido -->
    </div>
  </div>
</body>
```

## Clases disponibles

### Layout
- `.footer-page-bg` - Contenedor del fondo
- `.footer-page-nav` - Navegación superior
- `.footer-page-content` - Contenedor principal
- `.footer-page-header` - Cabecera con título

### Cards
- `.footer-page-card` - Tarjeta principal con fondo blur
- `.footer-page-info-card` - Tarjeta pequeña para información de contacto

### Formularios
- `.footer-page-form` - Contenedor de formulario
- `.footer-page-btn` - Botón principal

### Grids
- `.footer-page-grid-2` - Grid de 2 columnas (responsive)
- `.footer-page-grid-3` - Grid de 3 columnas (responsive)

### Animaciones
- `.footer-page-anim-up` - Animación de entrada hacia arriba
- `.footer-page-anim-scale` - Animación de entrada con escala
- `.footer-page-delay-1` a `.footer-page-delay-5` - Retrasos de animación

## Ejemplos de uso

### Página de contacto
```html
<div class="footer-page-grid-3">
  <div class="lg:col-span-2">
    <div class="footer-page-card footer-page-anim-up">
      <form class="footer-page-form space-y-5">
        <div class="footer-page-grid-2">
          <div>
            <label>Nombre</label>
            <input type="text" placeholder="Tu nombre">
          </div>
          <div>
            <label>Email</label>
            <input type="email" placeholder="tu@email.com">
          </div>
        </div>
        <button type="submit" class="footer-page-btn">Enviar</button>
      </form>
    </div>
  </div>
  <div>
    <div class="footer-page-info-card">
      <div class="icon-wrapper">...</div>
      <div class="info-title">Email</div>
      <div class="info-content">hola@nombre.es</div>
    </div>
  </div>
</div>
```

### Página de contenido
```html
<div class="footer-page-card footer-page-anim-up footer-page-delay-3">
  <h2>Título de sección</h2>
  <p>Contenido descriptivo...</p>
</div>
```

## Variables personalizables

### Colores
- Fondo cards: `rgb(255 255 255 / 0.6)`
- Texto principal: `rgb(26 26 26)`
- Texto secundario: `rgb(71 85 105)`
- Bordes: `rgb(255 255 255 / 0.5)`

### Espaciado
- Padding content: `4rem 1.5rem` (mobile), `4rem 3rem` (desktop)
- Padding cards: `2rem` (mobile), `3rem` (desktop)
- Margin bottom sections: `2.5rem`

### Tipografía
- Título: `2.5rem` (mobile), `3.5rem` (desktop)
- Subtítulo: `1.125rem`
- Texto: `0.875rem` - `1.0625rem`

## Beneficios

✅ **Consistencia** - Todas las páginas tienen el mismo look & feel
✅ **Mantenimiento** - Cambios en un solo lugar afectan a todas las páginas
✅ **Responsive** - Diseño adaptado para mobile y desktop
✅ **Accesibilidad** - Estructura semántica y navegación clara
✅ **Performance** - CSS optimizado y reutilizable

## Migración existente

Para migrar páginas existentes:

1. Reemplazar estilos inline con clases del componente
2. Usar la estructura HTML estándar
3. Eliminar CSS duplicado
4. Probar responsive y animaciones

## Archivos de ejemplo

- `contacto-new.html` - Ejemplo completo de página de contacto
- `sobre-nosotros-new.html` - Ejemplo de página de contenido corporativo
