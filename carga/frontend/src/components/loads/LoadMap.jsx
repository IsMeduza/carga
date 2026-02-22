import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import LoadCard from '@/components/loads/LoadCard';
import {
  SearchIcon,
  SlidersIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListIcon,
  GridIcon,
  RefreshIcon,
  PackageIcon,
  XIcon,
  CheckCircleIcon,
  PhoneIcon
} from '@/components/Icons';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN || 'pk.eyJ1IjoiaXNtYXhzbSIsImEiOiJjbWxvM2RhNHEwZnR1M2hzYXhqbTZsbGw2In0.TIwBRUdmLazCgdrmQca0mQ';

function LoadMap({ cargas, onAccept, selectedCarga, setSelectedCarga }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const routeLayerId = useRef('route-line');
  const [mapReady, setMapReady] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);

  const [filterTipo, setFilterTipo] = useState('todas');
  const [filterPeso, setFilterPeso] = useState([0, 30]);
  const [filterPrecioKm, setFilterPrecioKm] = useState(0);
  const [filterDistanciaMax, setFilterDistanciaMax] = useState(1000);
  const [sortBy, setSortBy] = useState('precio');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [visibleCount, setVisibleCount] = useState(20);

  // Debounce search for better performance with many items
  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedPrecioKm = useDebounce(filterPrecioKm, 200);
  const debouncedDistancia = useDebounce(filterDistanciaMax, 200);

  // Memoized filtered cargas - prevents recalculation on every render
  const filteredCargas = useMemo(() => {
    return cargas
      .filter(c => {
        const matchesTipo = filterTipo === 'todas' || c.tipo === filterTipo;
        const matchesPeso = c.peso >= filterPeso[0] && c.peso <= filterPeso[1];
        const precioKm = c.precio / c.distancia;
        const matchesPrecioKm = precioKm >= debouncedPrecioKm;
        const matchesDistancia = c.distancia <= debouncedDistancia;
        const matchesSearch = !debouncedSearch ||
          c.origen.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          c.destino.toLowerCase().includes(debouncedSearch.toLowerCase());
        return matchesTipo && matchesPeso && matchesPrecioKm && matchesDistancia && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'precio') return b.precio - a.precio;
        if (sortBy === 'distancia') return a.distancia - b.distancia;
        if (sortBy === 'precioKm') return (b.precio / b.distancia) - (a.precio / a.distancia);
        if (sortBy === 'peso') return b.peso - a.peso;
        if (sortBy === 'reciente') return b.id.localeCompare(a.id);
        return 0;
      });
  }, [cargas, filterTipo, filterPeso, debouncedPrecioKm, debouncedDistancia, debouncedSearch, sortBy]);

  // Paginated cargas for display - load more on scroll
  const displayedCargas = useMemo(() => {
    return filteredCargas.slice(0, visibleCount);
  }, [filteredCargas, visibleCount]);

  // Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (visibleCount < filteredCargas.length) {
      setVisibleCount(prev => Math.min(prev + 20, filteredCargas.length));
    }
  }, [visibleCount, filteredCargas.length]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [filterTipo, debouncedSearch, debouncedPrecioKm, debouncedDistancia]);

  const getTipoColor = useCallback((tipo) => ({
    completa: '#10b981', parcial: '#eab308', frigorifico: '#3b82f6', urgente: '#f97316'
  }[tipo] || '#6b7280'), []);

  // Initialize map - LIGHT THEME for better visibility
  const initMap = useCallback(() => {
    if (!mapContainer.current || map.current) return;
    if (!window.mapboxgl) return;

    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      bounds: [[-9.5, 35.8], [4.0, 43.8]],
      fitBoundsOptions: { padding: 40 },
      minZoom: 4.5,
      pitch: 0,
      fadeDuration: 0,
      trackResize: true,
      refreshExpiredTiles: false,
      maxBounds: [[-18.5, 27.0], [4.5, 44.5]]
    });

    // Resize observer to fix map expansion issues
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) map.current.resize();
    });
    if (mapContainer.current) resizeObserver.observe(mapContainer.current);

    map.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Ocultar nombres de lugares y países fuera de España
      const styleLayers = map.current.getStyle().layers;
      styleLayers.forEach((layer) => {
        if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
          const sourceLayer = layer['source-layer'];
          if (['country_label', 'state_label', 'place_label', 'settlement_label', 'poi_label'].includes(sourceLayer)) {
            const currentFilter = layer.filter || ['all'];
            map.current.setFilter(layer.id, [
              'all',
              currentFilter,
              ['==', ['get', 'iso_3166_1'], 'ES']
            ]);
          }
        }
      });

      // Add Mapbox Country Boundaries source
      map.current.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Dim neighboring countries to give Spain prominence
      map.current.addLayer({
        id: 'other-countries-dim',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': '#ffffff',
          'fill-opacity': 0.6
        },
        filter: ['!=', ['get', 'iso_3166_1_alpha_3'], 'ESP']
      });

      // Subtle highlight for Spain interior
      map.current.addLayer({
        id: 'spain-fill',
        type: 'fill',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.02
        },
        filter: ['==', ['get', 'iso_3166_1_alpha_3'], 'ESP']
      });

      // Elegant border for Spain
      map.current.addLayer({
        id: 'spain-highlight',
        type: 'line',
        source: 'country-boundaries',
        'source-layer': 'country_boundaries',
        paint: {
          'line-color': '#1A1A1A',
          'line-width': 1.5,
          'line-opacity': 0.15
        },
        filter: ['==', ['get', 'iso_3166_1_alpha_3'], 'ESP']
      });

      // Add route source
      map.current.addSource('route', {
        type: 'geojson',
        data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] } }
      });

      // Add route layer with gradient
      map.current.addLayer({
        id: routeLayerId.current,
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 5,
          'line-opacity': 0.9
        }
      });

      // Add glow effect layer
      map.current.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3b82f6',
          'line-width': 14,
          'line-opacity': 0.25,
          'line-blur': 6
        }
      }, routeLayerId.current);

      // Mark map as ready
      setMapReady(true);
    });
  }, []);

  // Add markers
  const addMarkers = useCallback(() => {
    if (!map.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredCargas.forEach(carga => {
      const color = getTipoColor(carga.tipo);
      const isSelected = selectedCarga?.id === carga.id;

      const el = document.createElement('div');
      el.className = 'pro-marker';
      el.innerHTML = `
        <div class="marker-pulse" style="background: ${color}"></div>
        <div class="marker-dot" style="background: ${color}; transform: scale(${isSelected ? 1.5 : 1})">
          <span class="marker-price">${carga.precio}\u20AC</span>
        </div>
      `;
      el.style.cursor = 'pointer';

      el.addEventListener('click', () => {
        setSelectedCarga(carga);
      });

      const marker = new window.mapboxgl.Marker(el)
        .setLngLat(carga.origen_coords)
        .addTo(map.current);

      markersRef.current.push(marker);
    });
  }, [filteredCargas, selectedCarga, setSelectedCarga, getTipoColor]);

  // Draw route when carga is selected - Using REAL ROADS via Mapbox Directions API
  useEffect(() => {
    if (!map.current || !mapReady) return;

    const fetchRealRoute = async (origin, destination) => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          return data.routes[0].geometry.coordinates;
        }
        return null;
      } catch (error) {
        console.error('Error fetching route:', error);
        return null;
      }
    };

    const updateRoute = async () => {
      try {
        const source = map.current.getSource('route');
        if (!source) return;

        if (selectedCarga) {
          setRouteLoading(true);

          // Fetch real route from Mapbox Directions API
          const realRouteCoords = await fetchRealRoute(
            selectedCarga.origen_coords,
            selectedCarga.destino_coords
          );

          setRouteLoading(false);

          // Use real route if available, fallback to straight line
          const coordinates = realRouteCoords || [
            selectedCarga.origen_coords,
            selectedCarga.destino_coords
          ];

          source.setData({
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          });

          // Fit bounds to show full route
          if (window.mapboxgl && coordinates.length > 0) {
            try {
              const firstCoord = coordinates[0];
              const bounds = new window.mapboxgl.LngLatBounds(firstCoord, firstCoord);

              coordinates.forEach(coord => {
                if (Array.isArray(coord) && coord.length >= 2) {
                  bounds.extend(coord);
                }
              });

              map.current.fitBounds(bounds, {
                padding: { top: 100, bottom: 100, left: 450, right: 380 },
                duration: 1000
              });
            } catch (boundsErr) {
              console.log('Bounds error:', boundsErr);
            }
          }

          // Update route color based on tipo
          const color = getTipoColor(selectedCarga.tipo);
          if (map.current.setPaintProperty) {
            map.current.setPaintProperty(routeLayerId.current, 'line-color', color);
            map.current.setPaintProperty('route-glow', 'line-color', color);
          }
        } else {
          source.setData({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: [] }
          });
        }
      } catch (err) {
        console.log('Route update error:', err);
        setRouteLoading(false);
      }
    };

    updateRoute();
  }, [selectedCarga, mapReady, getTipoColor]);

  // Load Mapbox script and CSS dynamically
  useEffect(() => {
    if (!window.mapboxgl) {
      const link = document.createElement('link');
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js';
      script.onload = () => {
        initMap();
        setTimeout(addMarkers, 500);
      };
      document.head.appendChild(script);
    } else {
      initMap();
      addMarkers();
    }
  }, [initMap, addMarkers]);

  // Update markers when filteredCargas changes
  useEffect(() => {
    if (map.current) addMarkers();
  }, [filteredCargas, addMarkers]);

  const estimateTime = (distancia) => {
    const hours = Math.floor(distancia / 80);
    const minutes = Math.round((distancia % 80) / 80 * 60);
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="pro-mapa-page">
      {/* Left Panel - Cargas List */}
      <div className={`mapa-panel ${panelCollapsed ? 'collapsed' : ''}`}>
        {!panelCollapsed ? (
          <>
            <div className="panel-header">
              <div className="panel-title">
                <h2>Cargas disponibles</h2>
                <div className="panel-title-actions">
                  <span className="cargas-count">{filteredCargas.length} resultados</span>
                  <button
                    className="panel-toggle-inline"
                    onClick={() => setPanelCollapsed(true)}
                    title="Ocultar panel"
                  >
                    <ChevronLeftIcon />
                  </button>
                </div>
              </div>
              <div className="panel-search">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Buscar origen o destino..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-controls filter-main">
                <button className={`advanced-filter-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                  <SlidersIcon />
                  Filtros
                  {(filterPrecioKm > 0 || filterDistanciaMax < 1000 || filterPeso[1] < 30) && <span className="filter-active-dot"></span>}
                </button>
              </div>
              <div className="filter-tipos">
                {['todas', 'urgente', 'completa', 'parcial', 'frigorifico'].map(tipo => (
                  <button
                    key={tipo}
                    className={`tipo-btn ${filterTipo === tipo ? 'active' : ''} ${tipo}`}
                    onClick={() => setFilterTipo(tipo)}
                  >
                    {tipo === 'todas' ? 'Todas' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </button>
                ))}
              </div>
              <div className="filter-controls">
                <button className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="Vista lista">
                  <ListIcon />
                </button>
                <button className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')} title="Vista cuadrícula">
                  <GridIcon />
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="advanced-filters">
                <div className="filter-group">
                  <label>Peso: {filterPeso[0]}t - {filterPeso[1]}t</label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={filterPeso[1]}
                    onChange={e => setFilterPeso([0, parseInt(e.target.value)])}
                  />
                </div>
                <div className="filter-group">
                  <label>Min \u20AC/km: {filterPrecioKm.toFixed(1)}</label>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={filterPrecioKm}
                    onChange={e => setFilterPrecioKm(parseFloat(e.target.value))}
                  />
                </div>
                <div className="filter-group">
                  <label>Distancia max: {filterDistanciaMax}km</label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={filterDistanciaMax}
                    onChange={e => setFilterDistanciaMax(parseInt(e.target.value))}
                  />
                </div>
                <div className="filter-group">
                  <label>Ordenar por:</label>
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="precio">Mayor precio</option>
                    <option value="precioKm">Mejor \u20AC/km</option>
                    <option value="distancia">Menor distancia</option>
                    <option value="peso">Mayor peso</option>
                    <option value="reciente">M\u00E1s reciente</option>
                  </select>
                </div>
                <button className="clear-filters-btn" onClick={() => {
                  setFilterPeso([0, 30]);
                  setFilterPrecioKm(0);
                  setFilterDistanciaMax(1000);
                  setFilterTipo('todas');
                }}>
                  <RefreshIcon /> Limpiar filtros
                </button>
              </div>
            )}

            {/* Cargas List */}
            <div
              className={`cargas-scroll ${viewMode}`}
              onScroll={(e) => {
                const { scrollTop, scrollHeight, clientHeight } = e.target;
                if (scrollHeight - scrollTop <= clientHeight + 100) {
                  loadMore();
                }
              }}
            >
              {filteredCargas.length === 0 ? (
                <div className="no-results">
                  <PackageIcon />
                  <p>No hay cargas con estos filtros</p>
                  <button onClick={() => {
                    setFilterPeso([0, 30]);
                    setFilterPrecioKm(0);
                    setFilterDistanciaMax(1000);
                    setFilterTipo('todas');
                    setSearchQuery('');
                  }}>Limpiar filtros</button>
                </div>
              ) : (
                <>
                  {displayedCargas.map(carga => (
                    <LoadCard
                      key={carga.id}
                      carga={carga}
                      isSelected={selectedCarga?.id === carga.id}
                      onClick={() => setSelectedCarga(selectedCarga?.id === carga.id ? null : carga)}
                      onAccept={onAccept}
                      viewMode={viewMode}
                    />
                  ))}
                  {visibleCount < filteredCargas.length && (
                    <div className="load-more-indicator">
                      <button onClick={loadMore} className="load-more-btn">
                        Cargar m\u00E1s ({filteredCargas.length - visibleCount} restantes)
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <div className="collapsed-panel-content" onClick={() => setPanelCollapsed(false)}>
            <button className="panel-toggle-collapsed">
              <ChevronRightIcon />
            </button>
            <div className="collapsed-info">
              <span className="collapsed-count">{filteredCargas.length}</span>
              <span className="collapsed-label">cargas</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="mapa-container-pro">
        <div ref={mapContainer} className="mapbox-pro" data-testid="mapbox-container"></div>

        {/* Route Loading Indicator */}
        {routeLoading && (
          <div className="route-loading">
            <div className="route-loading-spinner"></div>
            <span>Calculando ruta...</span>
          </div>
        )}

        {/* Map Legend */}
        <div className="map-legend-pro">
          <div className="legend-item"><span className="dot urgente"></span>Urgente</div>
          <div className="legend-item"><span className="dot completa"></span>Completa</div>
          <div className="legend-item"><span className="dot parcial"></span>Parcial</div>
          <div className="legend-item"><span className="dot frigorifico"></span>Frigorifico</div>
        </div>

        {/* Selected Carga Detail */}
        {selectedCarga && (
          <div className="selected-carga-panel" data-testid="carga-detail-panel">
            <button className="close-panel" onClick={() => setSelectedCarga(null)}>
              <XIcon />
            </button>
            <div className="panel-route">
              <div className="route-point origin">
                <span className="point-marker"></span>
                <div className="point-info">
                  <span className="point-label">Origen</span>
                  <span className="point-city">{selectedCarga.origen}</span>
                </div>
              </div>
              <div className="route-connector">
                <div className="connector-line"></div>
                <div className="connector-info">
                  {routeLoading ? (
                    <span className="loading-text">Calculando...</span>
                  ) : (
                    <>
                      <span>{selectedCarga.distancia} km</span>
                      <span>{estimateTime(selectedCarga.distancia)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="route-point destination">
                <span className="point-marker"></span>
                <div className="point-info">
                  <span className="point-label">Destino</span>
                  <span className="point-city">{selectedCarga.destino}</span>
                </div>
              </div>
            </div>

            <div className="panel-details-scroll">
              <div className="panel-details">
                <div className="detail-row">
                  <span className="detail-label">Tipo de carga</span>
                  <span className={`detail-value tipo-${selectedCarga.tipo}`}>{selectedCarga.tipo}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Peso</span>
                  <span className="detail-value">{selectedCarga.peso} toneladas</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Distancia</span>
                  <span className="detail-value">{selectedCarga.distancia} km</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tiempo estimado</span>
                  <span className="detail-value">{estimateTime(selectedCarga.distancia)}</span>
                </div>
                {selectedCarga.descripcion && (
                  <div className="detail-row description">
                    <span className="detail-label">Descripci\u00F3n</span>
                    <span className="detail-value">{selectedCarga.descripcion}</span>
                  </div>
                )}
                <div className="detail-row highlight">
                  <span className="detail-label">Precio total</span>
                  <span className="detail-value price">{selectedCarga.precio} \u20AC</span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">Rentabilidad</span>
                  <span className="detail-value profit">{(selectedCarga.precio / selectedCarga.distancia).toFixed(2)} \u20AC/km</span>
                </div>
              </div>
            </div>

            <div className="panel-actions">
              <button className="accept-btn-full" onClick={() => onAccept(selectedCarga.id)}>
                <CheckCircleIcon />
                Aceptar esta carga
              </button>
              <button className="contact-carrier-btn">
                <PhoneIcon />
                Contactar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadMap;
