# Nombre - Plataforma PRO de Transporte para Camioneros

## Problema Original
Plataforma de transporte de cargas para camioneros en España inspirada en apps como DAT, Trucker Path y Uber Freight.

## Rutas Reales por Carretera - Feb 2026

### Mapbox Directions API Integration
- **Rutas reales**: Ya no son líneas rectas, siguen autopistas y carreteras
- **6000+ puntos por ruta**: Precisión de carretera real
- **Zoom automático**: Se ajusta para mostrar la ruta completa
- **Colores por tipo**: Verde (completa), Azul (frigorífico), Naranja (urgente), Amarillo (parcial)
- **Efecto glow**: Sombra suave alrededor de la ruta
- **Indicador de carga**: "Calculando ruta..." mientras se obtiene

### API Endpoint Usado
```
GET https://api.mapbox.com/directions/v5/mapbox/driving/{origen};{destino}
  ?geometries=geojson
  &overview=full
  &access_token={token}
```

### Mapa Light Theme
- Estilo `mapbox://styles/mapbox/light-v11`
- Mayor legibilidad
- Marcadores con precios visibles
- Leyenda centrada

## Optimizaciones para Escala

### Frontend
- **useMemo**: Filtrado memoizado
- **useDebounce**: 300ms delay en búsqueda
- **React.memo**: CargaCard optimizado
- **Scroll infinito**: Carga progresiva
- **mapReady state**: Control de inicialización del mapa

### Backend
- **Connection Pool**: 10-100 conexiones MongoDB
- **Caché en memoria**: 30s TTL para cargas
- **Rate Limiting**: 120 req/min por IP
- **GZip Compression**: Respuestas comprimidas
- **Paginación**: `?page=1&page_size=50`

## Features Implementadas
- ✅ Rutas reales via Mapbox Directions API
- ✅ Mapa claro profesional
- ✅ Chatbot IA PRO con comandos
- ✅ Paneles colapsables
- ✅ Filtros con debounce
- ✅ Paginación y scroll infinito
- ✅ Caché de respuestas
- ✅ Rate limiting

## Tech Stack
- React 18 + Hooks optimizados
- FastAPI con middleware
- MongoDB con connection pooling
- Mapbox GL JS + Directions API
- LLM via Emergent LLM Key

## Backlog P0
- [ ] Caché de rutas en localStorage
- [ ] WebSockets para actualizaciones
- [ ] Clustering de marcadores

## Backlog P1
- [ ] Waypoints intermedios
- [ ] Rutas alternativas
- [ ] Tráfico en tiempo real
- [ ] Peajes estimados
