# Documento de Requisitos del Producto (PRD) - Plataforma "Nombre"

## 1. Visión General
**Nombre del Proyecto:** Plataforma de Carga "Nombre"
**Objetivo:** Crear un marketplace robusto y escalable para conectar generadores de carga con transportistas en el mercado español.

## 2. Objetivos Estratégicos
- **Simplicidad:** Interfaz intuitiva para usuarios no técnicos.
- **Transparencia:** Seguimiento en tiempo real de envíos y pagos.
- **Fiabilidad:** Verificación de usuarios mediante Supabase y perfiles de empresa.

## 3. Características Principales (MVP)
### v1.0 - Cimentación
- [x] **Autenticación:** Flujo completo de Login y Registro (3 pasos) usando Supabase.
- [x] **Dashboard:** Resumen de actividad con métricas clave (cargas activas, envíos en curso).
- [x] **Gestión de Cargas:** Listado dinámico con filtros por tipo (frigorífico, urgente, etc.).
- [x] **Mapa Interactivo:** Visualización de origen/destino mediante Mapbox.
- [x] **Backoffice:** API REST funcional construida con FastAPI.

### v2.0 - Interacción (En Desarrollo)
- [x] **Chat con IA:** Asistente capaz de buscar cargas y responder dudas básicas.
- [x] **Aceptación de Cargas:** Lógica para transformar una "carga" en un "envío" activo.
- [x] **Perfiles de Usuario:** Extensión de datos de Supabase almacenados en MongoDB (NIF, Empresa, Teléfono).

## 4. Stack Tecnológico
| Capa | Tecnología | Razón |
| :--- | :--- | :--- |
| **Frontend** | React 19 + Tailwind | Velocidad de desarrollo y UI moderna. |
| **Backend** | FastAPI | Rendimiento asíncrono superior. |
| **BBDD** | MongoDB | Flexibilidad para cambios en el esquema de cargas. |
| **Auth** | Supabase | Seguridad industrial y gestión de usuarios "out of the box". |

## 5. Glosario de Términos
- **Carga:** Oferta publicada por un generador de carga.
- **Envío:** Una carga que ha sido aceptada por un transportista y está en proceso.
- **Transportista:** Usuario con vehículo verificado que puede aceptar cargas.

---
*Última actualización: 19 de febrero de 2026*
