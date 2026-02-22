import { API_URL } from '@/constants';

const DEMO_CARGAS = [
  { "id": "c1", "origen": "Madrid", "destino": "Barcelona", "peso": 18, "distancia": 621, "precio": 1250, "tipo": "completa", "origen_coords": [-3.7038, 40.4168], "destino_coords": [2.1734, 41.3851], "descripcion": "Carga paletizada - 33 palets europeos" },
  { "id": "c2", "origen": "Valencia", "destino": "Sevilla", "peso": 12, "distancia": 654, "precio": 980, "tipo": "parcial", "origen_coords": [-0.3763, 39.4699], "destino_coords": [-5.9845, 37.3891], "descripcion": "Mercancía textil en cajas" },
  { "id": "c3", "origen": "Bilbao", "destino": "Madrid", "peso": 24, "distancia": 395, "precio": 890, "tipo": "urgente", "origen_coords": [-2.9253, 43.2630], "destino_coords": [-3.7038, 40.4168], "descripcion": "Piezas industriales - Entrega antes de 24h" },
  { "id": "c4", "origen": "Zaragoza", "destino": "Valencia", "peso": 8, "distancia": 302, "precio": 620, "tipo": "frigorifico", "origen_coords": [-0.8773, 41.6488], "destino_coords": [-0.3763, 39.4699], "descripcion": "Productos refrigerados a 4°C" }
];

const DEMO_ENVIOS = [
  { "id": "e1", "origen": "Madrid", "destino": "Barcelona", "peso": 18, "precio": 1250, "estado": "en_transito", "progreso": 65, "transportista": "Miguel Fernández" },
  { "id": "e2", "origen": "Valencia", "destino": "Bilbao", "peso": 14, "precio": 1100, "estado": "en_transito", "progreso": 30, "transportista": "Ana García" }
];

const DEMO_TRANSPORTISTAS = [
  { "id": "t1", "nombre": "Miguel Fernández", "email": "miguel@transporte.es", "vehiculo": "Tráiler 40t", "capacidad": 24, "rating": 4.8, "envios_completados": 234, "estado": "en_ruta" },
  { "id": "t2", "nombre": "Ana García", "email": "ana@logistica.com", "vehiculo": "Camión rígido 12t", "capacidad": 12, "rating": 4.9, "envios_completados": 187, "estado": "en_ruta" }
];

export async function fetchStats() {
  try {
    const res = await fetch(`${API_URL}/api/stats`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Stats fetch failed, using fallback metrics');
  }
  return { cargas_disponibles: 0, envios_en_curso: 0, completados_mes: 0, transportistas_activos: 0 };
}

export async function fetchCargas() {
  try {
    const res = await fetch(`${API_URL}/api/cargas`);
    if (res.ok) {
      const data = await res.json();
      return data.cargas || data;
    }
  } catch (err) {
    console.warn('Cargas fetch failed, using demo data');
  }
  return DEMO_CARGAS;
}

export async function fetchEnvios() {
  try {
    const res = await fetch(`${API_URL}/api/envios`);
    if (res.ok) {
      const data = await res.json();
      return data.envios || data;
    }
  } catch (err) {
    console.warn('Envios fetch failed, using demo data');
  }
  return DEMO_ENVIOS;
}

export async function fetchTransportistas() {
  try {
    const res = await fetch(`${API_URL}/api/transportistas`);
    if (res.ok) {
      const data = await res.json();
      return data.transportistas || data;
    }
  } catch (err) {
    console.warn('Transportistas fetch failed, using demo data');
  }
  return DEMO_TRANSPORTISTAS;
}

export async function sendChatMessage(message, sessionId) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId })
  });
  if (!res.ok) throw new Error('Backend failed');
  return await res.json();
}

export { DEMO_CARGAS, DEMO_ENVIOS, DEMO_TRANSPORTISTAS };
