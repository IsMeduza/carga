import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
import { BRAND_NAME, PAGE_TITLES, API_URL } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { fetchStats, fetchCargas, fetchEnvios, fetchTransportistas, DEMO_CARGAS } from '@/services/api';

// Components
import Sidebar from '@/components/dashboard/Sidebar';
import PanelPage from '@/components/dashboard/PanelPage';
import EnviosPage from '@/components/dashboard/EnviosPage';
import TransportistasPage from '@/components/dashboard/TransportistasPage';
import FacturasPage from '@/components/dashboard/FacturasPage';
import EstadisticasPage from '@/components/dashboard/EstadisticasPage';
import AjustesPage from '@/components/dashboard/AjustesPage';
import LoadMap from '@/components/loads/LoadMap';
import EnhancedChatWidget from '@/components/chat/ChatWidget';
import { MenuIcon, HomeIcon } from '@/components/Icons';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
  style: { height: '100%', width: '100%' },
};

function DashboardPage() {
  const { user, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState('panel');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState({
    cargas_disponibles: 0,
    envios_en_curso: 0,
    completados_mes: 0,
    transportistas_activos: 0
  });
  const [cargas, setCargas] = useState([]);
  const [envios, setEnvios] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState(null);

  useEffect(() => {
    document.title = PAGE_TITLES.DASHBOARD;
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const [statsData, cargasData, enviosData, transportistasData] = await Promise.all([
        fetchStats(),
        fetchCargas(),
        fetchEnvios(),
        fetchTransportistas(),
      ]);
      setStats(statsData);
      setCargas(cargasData);
      setEnvios(enviosData);
      setTransportistas(transportistasData);
    };

    loadData();
    setNotifications([
      { id: 1, type: 'carga', message: 'Nueva carga urgente: Madrid \u2192 Barcelona', time: '2 min' },
      { id: 2, type: 'envio', message: 'Env\u00edo #4521 entregado exitosamente', time: '15 min' },
      { id: 3, type: 'precio', message: 'Precio actualizado: Valencia \u2192 Sevilla +5%', time: '1 hora' },
      { id: 4, type: 'carga', message: 'Carga frigor\u00edfica disponible: Murcia \u2192 Barcelona', time: '30 min' },
    ]);
  }, []);

  const handleAcceptCarga = (cargaId) => {
    const carga = cargas.find(c => c.id === cargaId);
    if (carga) {
      setCargas(prev => prev.filter(c => c.id !== cargaId));
      setEnvios(prev => [{
        id: `e-${Date.now()}`,
        origen: carga.origen,
        destino: carga.destino,
        peso: carga.peso,
        precio: carga.precio,
        estado: 'recogida_pendiente',
        progreso: 5,
        transportista: user?.user_metadata?.first_name || 'Carlos Lopez'
      }, ...prev]);
      setStats(prev => ({
        ...prev,
        cargas_disponibles: prev.cargas_disponibles - 1,
        envios_en_curso: prev.envios_en_curso + 1
      }));
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: `Carga aceptada: ${carga.origen} \u2192 ${carga.destino}`,
        time: 'Ahora'
      }, ...prev]);
      setSelectedCarga(null);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/auth/login.html';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/auth/login.html';
    }
  };

  const sendChatMessage = async (message) => {
    const msg = message || chatInput;
    if (!msg.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, session_id: sessionId })
      });
      if (!res.ok) throw new Error('Backend failed');
      const data = await res.json();

      if (!sessionId) setSessionId(data.session_id);

      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        cargas: data.cargas_encontradas,
        actions: data.suggested_actions
      }]);
      setChatLoading(false);
    } catch (e) {
      console.warn('Chat API error, falling back to simulated logic:', e);
      setTimeout(() => {
        const lowerMsg = msg.toLowerCase();
        let response = "Puedo ayudarte a encontrar cargas. Prueba preguntando por una ciudad o tipo de carga.";
        let cargasEncontradas = [];
        const allCargas = cargas.length > 0 ? cargas : DEMO_CARGAS;

        if (lowerMsg.includes("madrid") || lowerMsg.includes("barcelona")) {
          cargasEncontradas = allCargas.filter(c =>
            c.origen.toLowerCase().includes("madrid") || c.destino.toLowerCase().includes("barcelona") ||
            c.origen.toLowerCase().includes("barcelona") || c.destino.toLowerCase().includes("madrid")
          );
          response = `He encontrado ${cargasEncontradas.length} cargas relacionadas con Madrid/Barcelona:`;
        } else if (lowerMsg.includes("valencia")) {
          cargasEncontradas = allCargas.filter(c =>
            c.origen.toLowerCase().includes("valencia") || c.destino.toLowerCase().includes("valencia")
          );
          response = `He encontrado ${cargasEncontradas.length} cargas relacionadas con Valencia:`;
        } else if (lowerMsg.includes("urgente")) {
          cargasEncontradas = allCargas.filter(c => c.tipo === "urgente");
          response = `Hay ${cargasEncontradas.length} cargas urgentes disponibles:`;
        } else if (lowerMsg.includes("frigorifico") || lowerMsg.includes("refriger")) {
          cargasEncontradas = allCargas.filter(c => c.tipo === "frigorifico");
          response = `Hay ${cargasEncontradas.length} cargas frigor\u00edficas disponibles:`;
        } else if (lowerMsg.includes("sevilla")) {
          cargasEncontradas = allCargas.filter(c =>
            c.origen.toLowerCase().includes("sevilla") || c.destino.toLowerCase().includes("sevilla")
          );
          response = `He encontrado ${cargasEncontradas.length} cargas relacionadas con Sevilla:`;
        } else if (lowerMsg.includes("bilbao")) {
          cargasEncontradas = allCargas.filter(c =>
            c.origen.toLowerCase().includes("bilbao") || c.destino.toLowerCase().includes("bilbao")
          );
          response = `He encontrado ${cargasEncontradas.length} cargas relacionadas con Bilbao:`;
        } else if (lowerMsg.includes("mejor") || lowerMsg.includes("rentable") || lowerMsg.includes("precio")) {
          cargasEncontradas = [...allCargas].sort((a, b) => (b.precio / b.distancia) - (a.precio / a.distancia));
          response = `Las cargas mejor pagadas por kil\u00f3metro:`;
        } else if (lowerMsg.includes("resumen")) {
          response = `Resumen del d\u00eda: ${allCargas.length} cargas disponibles, ${envios.length} env\u00edos en curso. Las rutas m\u00e1s activas son Madrid-Barcelona y Valencia-Sevilla.`;
        } else if (lowerMsg.includes("hola") || lowerMsg.includes("ayuda")) {
          response = "\u00a1Hola! Puedes preguntarme sobre cargas por ciudad (Madrid, Barcelona, Valencia, Sevilla, Bilbao) o tipo (urgente, frigor\u00edfico). Tambi\u00e9n puedo darte un resumen del d\u00eda o buscar las rutas m\u00e1s rentables.";
        }

        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: response,
          cargas: cargasEncontradas,
          actions: ["Ver mapa", "Filtrar cargas"]
        }]);
        setChatLoading(false);
      }, 700);
    }
  };

  const enviosActivos = envios.filter(e => e.estado !== 'entregado').length;

  const renderPage = () => {
    switch (currentPage) {
      case 'panel':
        return (
          <motion.div key="panel" {...pageTransition}>
            <PanelPage
              user={user}
              stats={stats}
              setCurrentPage={setCurrentPage}
              cargas={cargas}
              envios={envios}
              onAcceptCarga={handleAcceptCarga}
              notifications={notifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
            />
          </motion.div>
        );
      case 'mapa':
        return (
          <motion.div key="mapa" {...pageTransition}>
            <LoadMap
              cargas={cargas}
              onAccept={handleAcceptCarga}
              selectedCarga={selectedCarga}
              setSelectedCarga={setSelectedCarga}
            />
          </motion.div>
        );
      case 'envios':
        return (
          <motion.div key="envios" {...pageTransition}>
            <EnviosPage envios={envios} />
          </motion.div>
        );
      case 'transportistas':
        return (
          <motion.div key="transportistas" {...pageTransition}>
            <TransportistasPage transportistas={transportistas} />
          </motion.div>
        );
      case 'facturas':
        return (
          <motion.div key="facturas" {...pageTransition}>
            <FacturasPage envios={envios} />
          </motion.div>
        );
      case 'estadisticas':
        return (
          <motion.div key="estadisticas" {...pageTransition}>
            <EstadisticasPage stats={stats} envios={envios} cargas={cargas} />
          </motion.div>
        );
      case 'ajustes':
        return (
          <motion.div key="ajustes" {...pageTransition}>
            <AjustesPage user={user} />
          </motion.div>
        );
      default:
        return (
          <motion.div key="panel" {...pageTransition}>
            <PanelPage
              user={user}
              stats={stats}
              setCurrentPage={setCurrentPage}
              cargas={cargas}
              envios={envios}
              onAcceptCarga={handleAcceptCarga}
              notifications={notifications}
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="app-container app-container-pro">
      <div className="dashboard-wrapper">
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
            <Sidebar
              user={user}
              currentPage={currentPage}
              setCurrentPage={(page) => { setCurrentPage(page); setMobileMenuOpen(false); }}
              mobile={true}
              onClose={() => setMobileMenuOpen(false)}
              enviosCount={enviosActivos}
              onLogout={handleLogout}
            />
          </div>
        )}

        <div className={`desktop-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Sidebar
            user={user}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enviosCount={enviosActivos}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            onLogout={handleLogout}
          />
        </div>

        <main className="main-content main-content-pro">
          <div className="mobile-header">
            <button onClick={() => setMobileMenuOpen(true)} className="menu-btn" data-testid="mobile-menu-btn">
              <MenuIcon />
            </button>
            <span className="mobile-title">{BRAND_NAME}</span>
            <button
              type="button"
              className="mobile-home-link"
              title="Volver a la web"
              onClick={() => window.location.href = '/'}
            >
              <HomeIcon />
            </button>
          </div>

          <div className="page-wrapper">
            <AnimatePresence mode="wait">
              {renderPage()}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <EnhancedChatWidget
        open={chatOpen}
        setOpen={setChatOpen}
        messages={chatMessages}
        input={chatInput}
        setInput={setChatInput}
        onSend={sendChatMessage}
        loading={chatLoading}
        cargas={cargas}
        onAcceptCarga={handleAcceptCarga}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default DashboardPage;
