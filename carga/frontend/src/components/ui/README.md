# Componentes Magnéticos UI

Esta carpeta contiene componentes reutilizables con efectos magnéticos y de brillo para botones y enlaces.

## Componentes

### MagneticButton
Botón con efecto magnético que sigue el cursor y opcionalmente un efecto de brillo.

```jsx
import MagneticButton from './ui/MagneticButton';

// Uso básico
<MagneticButton onClick={() => console.log('click')}>
  Botón magnético
</MagneticButton>

// Con efecto de brillo
<MagneticButton shine onClick={handleClick}>
  Botón con brillo
</MagneticButton>

// Con clases personalizadas
<MagneticButton 
  className="bg-blue-500 text-white px-6 py-3 rounded-lg"
  shine
>
  Botón estilizado
</MagneticButton>

// Con intensidad personalizada
<MagneticButton intensity={0.2} shine>
  Botón más sensible
</MagneticButton>

// Deshabilitado
<MagneticButton disabled>
  Botón deshabilitado
</MagneticButton>

// Con referencia
const buttonRef = useRef();
<MagneticButton ref={buttonRef}>
  Botón con referencia
</MagneticButton>
```

#### Props
- `children` (ReactNode): Contenido del botón
- `className` (string): Clases CSS adicionales
- `shine` (boolean): Activa efecto de brillo
- `onClick` (function): Manejador de clic
- `type` (string): Tipo de botón (default: 'button')
- `disabled` (boolean): Deshabilita el botón
- `intensity` (number): Intensidad del efecto magnético (default: 0.15)
- `transition` (string): Transición CSS personalizada

### MagneticLink
Enlace con efecto magnético que funciona tanto para rutas internas como enlaces externos.

```jsx
import MagneticLink from './ui/MagneticLink';

// Enlace interno (React Router)
<MagneticLink to="/dashboard">
  Ir al dashboard
</MagneticLink>

// Enlace externo
<MagneticLink href="https://example.com" external>
  Visitar sitio
</MagneticLink>

// Con efecto de brillo
<MagneticLink to="/about" shine>
  Acerca de
</MagneticLink>

// Con clases personalizadas
<MagneticLink 
  to="/contact"
  className="text-blue-600 hover:text-blue-800 font-medium"
  shine
>
  Contacto
</MagneticLink>

// Deshabilitado
<MagneticLink to="/disabled" disabled>
  Enlace deshabilitado
</MagneticLink>
```

#### Props
- `children` (ReactNode): Contenido del enlace
- `className` (string): Clases CSS adicionales
- `shine` (boolean): Activa efecto de brillo
- `to` (string): Ruta para React Router
- `href` (string): URL para enlaces externos
- `external` (boolean): Indica si es un enlace externo
- `intensity` (number): Intensidad del efecto magnético (default: 0.15)
- `transition` (string): Transición CSS personalizada
- `disabled` (boolean): Deshabilita el enlace

## Características

- ✅ Efecto magnético que sigue el cursor
- ✅ Efecto de brillo opcional
- ✅ Soporte para referencias (ref)
- ✅ Deshabilitado con estilos apropiados
- ✅ Intensidad personalizable
- ✅ Transiciones suaves
- ✅ Cleanup automático de event listeners
- ✅ TypeScript friendly (displayName)

## Estilos CSS Adicionales

Para que los componentes funcionen correctamente, asegúrate de tener estas clases CSS disponibles:

```css
.magnetic-btn {
  display: inline-block;
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}

.magnetic-btn:hover {
  transform: translate(0, 0);
}

.btn-shine {
  position: relative;
  overflow: hidden;
}

.btn-shine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transition: none;
}

.btn-shine:hover::after {
  animation: btnSweep 0.6s ease forwards;
}

@keyframes btnSweep {
  to {
    left: 150%;
  }
}
```

## Ejemplos de Uso

### Botón primario con brillo
```jsx
<MagneticButton 
  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
  shine
  onClick={handleSubmit}
>
  Enviar formulario
</MagneticButton>
```

### Enlace de navegación
```jsx
<MagneticLink 
  to="/products" 
  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
  shine
>
  Ver productos
</MagneticLink>
```

### Botón con intensidad personalizada
```jsx
<MagneticButton 
  intensity={0.25}
  className="bg-green-500 text-white px-6 py-2 rounded-md"
  shine
>
  Botón muy sensible
</MagneticButton>
```
