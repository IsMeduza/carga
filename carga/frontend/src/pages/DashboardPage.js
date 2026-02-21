import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Dashboard.css';
import { BRAND_NAME, PAGE_TITLES, API_URL } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
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

// Main Dashboard Component
function DashboardPage() {
  const navigate = useNavigate();
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

  // Set page title
  useEffect(() => {
    document.title = PAGE_TITLES.DASHBOARD;
  }, []);

  // Fetch data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stats`);
        if (res.ok) { setStats(await res.json()); }
      } catch (err) { console.warn('Stats fetch failed, using fallback metrics'); }

      try {
        const res = await fetch(`${API_URL}/api/cargas`);
        if (res.ok) {
          const data = await res.json();
          setCargas(data.cargas || data);
        } else {
          setCargas(DEMO_CARGAS);
        }
      } catch (err) {
        console.warn('Cargas fetch failed, using demo data');
        setCargas(DEMO_CARGAS);
      }

      try {
        const res = await fetch(`${API_URL}/api/envios`);
        if (res.ok) {
          const data = await res.json();
          setEnvios(data.envios || data);
        } else {
          setEnvios(DEMO_ENVIOS);
        }
      } catch (err) {
        console.warn('Envios fetch failed, using demo data');
        setEnvios(DEMO_ENVIOS);
      }

      try {
        const res = await fetch(`${API_URL}/api/transportistas`);
        if (res.ok) {
          const data = await res.json();
          setTransportistas(data.transportistas || data);
        } else {
          setTransportistas(DEMO_TRANSPORTISTAS);
        }
      } catch (err) {
        console.warn('Transportistas fetch failed, using demo data');
        setTransportistas(DEMO_TRANSPORTISTAS);
      }
    };

    loadData();
    setNotifications([
      { id: 1, type: 'carga', message: 'Nueva carga urgente: Madrid → Barcelona', time: '2 min' },
      { id: 2, type: 'envio', message: 'Envío #4521 entregado exitosamente', time: '15 min' },
      { id: 3, type: 'precio', message: 'Precio actualizado: Valencia → Sevilla +5%', time: '1 hora' },
      { id: 4, type: 'carga', message: 'Carga frigorífica disponible: Murcia → Barcelona', time: '30 min' },
    ]);
  }, []);

  const handleAcceptCarga = (cargaId) => {
    // Move carga to envios (demo mode)
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
        transportista: 'Carlos Lopez'
      }, ...prev]);
      setStats(prev => ({
        ...prev,
        cargas_disponibles: prev.cargas_disponibles - 1,
        envios_en_curso: prev.envios_en_curso + 1
      }));
      setNotifications(prev => [{
        id: Date.now(),
        type: 'success',
        message: `Carga aceptada: ${carga.origen} → ${carga.destino}`,
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

    const userMsg = { role: 'user', content: msg };
    setChatMessages(prev => [...prev, userMsg]);
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

      const assistantMsg = {
        role: 'assistant',
        content: data.response,
        cargas: data.cargas_encontradas,
        actions: data.suggested_actions
      };
      setChatMessages(prev => [...prev, assistantMsg]);
      setChatLoading(false);
    } catch (e) {
      console.warn('Chat API error, falling back to simulated logic:', e);
      // Simulate backend response offline
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
        } else if (lowerMsg.includes("hola") || lowerMsg.includes("ayuda")) {
          response = "¡Hola! Puedes preguntarme sobre cargas por ciudad (Madrid, Barcelona, Valencia) o tipo (urgente, frigorífico, etc.).";
        }

        const assistantMsg = {
          role: 'assistant',
          content: response,
          cargas: cargasEncontradas,
          actions: ["Ver mapa", "Filtrar cargas"]
        };
        setChatMessages(prev => [...prev, assistantMsg]);
        setChatLoading(false);
      }, 700);
    }
  };

  return (
    <div className="app-container app-container-pro">
      <div className="dashboard-wrapper">
        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
            <Sidebar
              user={user}
              currentPage={currentPage}
              setCurrentPage={(page) => { setCurrentPage(page); setMobileMenuOpen(false); }}
              mobile={true}
              onClose={() => setMobileMenuOpen(false)}
              enviosCount={envios.filter(e => e.estado !== 'entregado').length}
              onLogout={handleLogout}
            />
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className={`desktop-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Sidebar
            user={user}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            enviosCount={envios.filter(e => e.estado !== 'entregado').length}
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            onLogout={handleLogout}
          />
        </div>

        {/* Main Content */}
        <main className="main-content main-content-pro">
          {/* Mobile Header */}
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

          {/* Pages */}
          <div className="page-wrapper">
            <AnimatePresence mode="wait">
              {currentPage === 'panel' && (
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', width: '100%' }}
                >
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
              )}
              {currentPage === 'mapa' && (
                <motion.div
                  key="mapa"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', width: '100%' }}
                >
                  <ProMapaPage
                    cargas={cargas}
                    onAccept={handleAcceptCarga}
                    selectedCarga={selectedCarga}
                    setSelectedCarga={setSelectedCarga}
                  />
                </motion.div>
              )}
              {currentPage === 'envios' && (
                <motion.div
                  key="envios"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', width: '100%' }}
                >
                  <EnviosPage envios={envios} />
                </motion.div>
              )}
              {currentPage === 'transportistas' && (
                <motion.div
                  key="transportistas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TransportistasPage transportistas={transportistas} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Enhanced Chat Widget */}
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

// Sidebar Component
function Sidebar({ user, currentPage, setCurrentPage, mobile, onClose, enviosCount, collapsed, setCollapsed, onLogout }) {
  const navItems = [
    { id: 'panel', label: 'Panel', icon: <HomeIcon /> },
    { id: 'mapa', label: 'Mapa de cargas', icon: <MapPinIcon /> },
    { id: 'envios', label: 'Mis envios', icon: <FolderIcon />, badge: enviosCount },
    { id: 'transportistas', label: 'Transportistas', icon: <UsersIcon /> },
  ];

  return (
    <aside className={`sidebar ${mobile ? 'mobile' : ''} ${collapsed ? 'collapsed' : ''}`} onClick={e => e.stopPropagation()}>
      <div className="sidebar-header">
        <button
          type="button"
          className="logo-link"
          onClick={() => window.location.href = '/'}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div className="logo-icon">
            <img src='/assets/img/logo.svg' alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          {!collapsed && (
            <>
              <span className="logo-text">{BRAND_NAME}</span>
            </>
          )}
        </button>
        {mobile && (
          <button onClick={onClose} className="close-btn">
            <XIcon />
          </button>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`collapse-btn ${collapsed ? 'is-collapsed' : ''}`}
            data-testid="sidebar-toggle"
            title={collapsed ? "Expandir menú" : "Minimizar menú"}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            data-testid={`nav-${item.id}`}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
            {!collapsed && item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            {collapsed && item.badge > 0 && <span className="nav-badge-mini">{item.badge}</span>}
          </button>
        ))}

        {!collapsed && (
          <div className="nav-divider">
            <span>Herramientas</span>
          </div>
        )}
        {collapsed && <div className="nav-divider-mini"></div>}

        {[
          { id: 'facturas', label: 'Facturas', icon: <ReceiptIcon /> },
          { id: 'estadisticas', label: 'Estadisticas', icon: <TrendingUpIcon /> },
          { id: 'ajustes', label: 'Ajustes', icon: <SettingsIcon /> },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        {!collapsed && (
          <div className="nav-divider">
            <span>Otros</span>
          </div>
        )}
        {collapsed && <div className="nav-divider-mini"></div>}

        <button
          type="button"
          className="nav-link back-to-site"
          title={collapsed ? 'Volver a la web' : ''}
          onClick={() => window.location.href = '/'}
          style={{ textDecoration: 'none', width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <ArrowRightIcon />
          {!collapsed && <span>Volver a la web</span>}
        </button>
      </nav>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <UserIcon />
            </div>
            <div className="user-details">
              <p className="user-name">{user?.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}` : 'Carlos Lopez'}</p>
              <p className="user-email">{user?.email || 'carlos@empresa.com'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <LogOutIcon />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
      {collapsed && (
        <div className="sidebar-footer-collapsed">
          <div className="user-avatar-mini user-avatar">
            <UserIcon />
          </div>
        </div>
      )}
    </aside>
  );
}

// Enhanced Panel Page
function PanelPage({ user, stats, setCurrentPage, cargas, envios, onAcceptCarga, notifications, showNotifications, setShowNotifications }) {
  // Use user context or hardcoded demo values for the mockup
  const demoStats = {
    cargas: stats?.cargas_disponibles > 0 ? stats.cargas_disponibles : 1284,
    envios: stats?.envios_en_curso > 0 ? stats.envios_en_curso : 87,
    completados: stats?.completados_mes > 0 ? stats.completados_mes : 342,
    transportistas: stats?.transportistas_activos > 0 ? stats.transportistas_activos : 2150,
    c_perc: '+22.1%',
    e_perc: '+8.3%',
    co_perc: '+15.6%',
    t_perc: '+31.4%'
  };

  return (
    <div className="page-content dashboard-mockup-layout">
      {/* Top Header Row */}
      <div className="mockup-header">
        <div className="mockup-user">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mockup-avatar user-avatar"
          >
            <UserIcon />
          </motion.div>
          <div className="mockup-user-info">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ¡Hola, {user?.user_metadata?.first_name || 'Carlos'}! 👋
            </motion.h2>
            <motion.p
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tienes <span className="highlight-text">{stats?.cargas_disponibles || 12} cargas</span> esperándote hoy.
            </motion.p>
          </div>
        </div>

        <div className="mockup-actions">
          <div className="mockup-search">
            <SearchIcon />
            <input type="text" placeholder="¿A dónde vamos hoy?" />
          </div>
          <button className="mockup-bell" onClick={() => setShowNotifications(!showNotifications)}>
            <BellIcon />
            <span className="bell-dot"></span>
          </button>

          <div className="smart-insights-pill">
            <ZapIcon />
            <span>Optimizando 4 rutas</span>
          </div>

          {showNotifications && (
            <div className="mockup-notifications-dropdown">
              <NotificationsPanel notifications={notifications} onClose={() => setShowNotifications(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="mockup-stats-grid">
        <motion.div
          className="mockup-stat-card"
          onClick={() => setCurrentPage('mapa')}
          whileHover={{ y: -8, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="m-stat-header">
            <div className="m-stat-icon"><MapPinIcon /></div>
            <span>Cargas disponibles</span>
          </div>
          <div className="m-stat-body">
            <h3>{demoStats.cargas}</h3>
            <span className="m-stat-trend positive">{demoStats.c_perc}</span>
          </div>
        </motion.div>
        <motion.div
          className="mockup-stat-card"
          onClick={() => setCurrentPage('envios')}
          whileHover={{ y: -8, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="m-stat-header">
            <div className="m-stat-icon"><TruckIcon /></div>
            <span>Envíos en curso</span>
          </div>
          <div className="m-stat-body">
            <h3>{demoStats.envios}</h3>
            <span className="m-stat-trend positive">{demoStats.e_perc}</span>
          </div>
        </motion.div>
        <motion.div
          className="mockup-stat-card"
          whileHover={{ y: -8, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="m-stat-header">
            <div className="m-stat-icon"><CheckCircleIcon /></div>
            <span>Completados este mes</span>
          </div>
          <div className="m-stat-body">
            <h3>{demoStats.completados}</h3>
            <span className="m-stat-trend positive">{demoStats.co_perc}</span>
          </div>
        </motion.div>
        <motion.div
          className="mockup-stat-card"
          onClick={() => setCurrentPage('transportistas')}
          whileHover={{ y: -8, scale: 1.02 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="m-stat-header">
            <div className="m-stat-icon"><UsersIcon /></div>
            <span>Transportistas activos</span>
          </div>
          <div className="m-stat-body">
            <h3>{demoStats.transportistas}</h3>
            <span className="m-stat-trend positive">{demoStats.t_perc}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Bottom Section */}
      <div className="mockup-bottom-grid">
        {/* Chart Area */}
        <div className="mockup-chart-card">
          <div className="m-chart-header">
            <h3>Envíos completados por mes</h3>
            <button className="m-chart-filter">Mes <ChevronDownIcon /></button>
          </div>
          <div className="m-chart-bars">
            {/* Hardcoded chart data to match mockup visually */}
            {[
              { label: 'Ene', height: 40 },
              { label: 'Feb', height: 65, active: true },
              { label: 'Mar', height: 35 },
              { label: 'Abr', height: 45 },
              { label: 'May', height: 30 },
              { label: 'Jun', height: 50 },
              { label: 'Jul', height: 80, active: true },
              { label: 'Ago', height: 25 },
              { label: 'Sep', height: 45 },
              { label: 'Oct', height: 60 },
              { label: 'Nov', height: 20 },
              { label: 'Dic', height: 55 }
            ].map((bar, i) => (
              <div key={i} className="m-chart-col">
                <motion.div
                  className={`m-bar ${bar.active ? 'active' : ''}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${bar.height}%` }}
                  transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                ></motion.div>
                <span>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="mockup-actions-grid">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="m-action-btn" onClick={() => setCurrentPage('mapa')}>
            <div className="m-action-icon"><MapPinIcon /></div>
            <span>Ver mapa de cargas</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="m-action-btn">
            <div className="m-action-icon"><PlusCircleIcon /></div>
            <span>Publicar nueva carga</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="m-action-btn">
            <div className="m-action-icon"><ReceiptIcon /></div>
            <span>Generar factura</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="m-action-btn" onClick={() => setCurrentPage('envios')}>
            <div className="m-action-icon"><TruckIcon /></div>
            <span>Seguir envío</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="m-action-btn">
            <div className="m-action-icon"><FileTextIcon /></div>
            <span>Subir CMR/albarán</span>
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="m-action-btn" onClick={() => setCurrentPage('transportistas')}>
            <div className="m-action-icon"><UsersIcon /></div>
            <span>Invitar transportista</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// Notifications Panel
function NotificationsPanel({ notifications, onClose }) {
  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h4>Notificaciones</h4>
        <button onClick={onClose}><XIcon /></button>
      </div>
      <div className="notifications-list">
        {notifications.map(n => (
          <div key={n.id} className={`notification-item ${n.type}`}>
            <span className="notification-icon">
              {n.type === 'carga' && <PackageIcon />}
              {n.type === 'envio' && <TruckIcon />}
              {n.type === 'precio' && <TrendingUpIcon />}
              {n.type === 'success' && <CheckCircleIcon />}
            </span>
            <div className="notification-content">
              <p>{n.message}</p>
              <span className="notification-time">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Memoized CargaCard component - prevents re-renders when parent updates
const CargaCard = React.memo(function CargaCard({ carga, isSelected, onClick, onAccept, viewMode }) {
  const estimateTime = (distance) => {
    const hours = Math.floor(distance / 85);
    const mins = Math.round((distance % 85) / 85 * 60);
    return `${hours}h ${mins}min`;
  };

  return (
    <div
      className={`pro-carga-card ${isSelected ? 'selected' : ''} ${viewMode}`}
      onClick={onClick}
    >
      <div className="carga-top">
        <div className="carga-route-info">
          <div className="route-cities">
            <span className="city-origin">{carga.origen}</span>
            <div className="route-line-mini">
              <span className={`dot ${carga.tipo}`}></span>
              <span className="line"></span>
              <span className={`dot ${carga.tipo}`}></span>
            </div>
            <span className="city-dest">{carga.destino}</span>
          </div>
        </div>
        <span className={`tipo-badge ${carga.tipo}`}>{carga.tipo}</span>
      </div>

      <div className="carga-stats">
        <div className="stat">
          <WeightIcon />
          <span>{carga.peso}t</span>
        </div>
        <div className="stat">
          <RouteIcon />
          <span>{carga.distancia}km</span>
        </div>
        <div className="stat">
          <ClockIcon />
          <span>{estimateTime(carga.distancia)}</span>
        </div>
      </div>

      <div className="carga-bottom">
        <div className="price-info">
          <span className="price-main">{carga.precio} €</span>
          <span className="price-per-km">{(carga.precio / carga.distancia).toFixed(2)} €/km</span>
        </div>
        <button
          className="accept-btn-pro"
          onClick={(e) => { e.stopPropagation(); onAccept(carga.id); }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
});

// PRO MAPA PAGE - Like DAT/Trucker Path - OPTIMIZED FOR SCALE
function ProMapaPage({ cargas, onAccept, selectedCarga, setSelectedCarga }) {
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
  const [visibleCount, setVisibleCount] = useState(20); // Pagination for performance

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

    window.mapboxgl.accessToken = 'pk.eyJ1IjoiaXNtYXhzbSIsImEiOiJjbWxvM2RhNHEwZnR1M2hzYXhqbTZsbGw2In0.TIwBRUdmLazCgdrmQca0mQ';

    map.current = new window.mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-3.7038, 40.4168],
      zoom: 5.5,
      minZoom: 5.2, // Añadimos esto para evitar que se alejen demasiado y vean todo el mundo
      pitch: 0,
      // Performance optimizations
      fadeDuration: 0,
      trackResize: true,
      refreshExpiredTiles: false,
      maxBounds: [[-18.5, 27.0], [4.5, 44.5]] // Límites todavía más ajustados a España (con Canarias incluidas)
    });

    // Resize observer to fix map expansion issues
    const resizeObserver = new ResizeObserver(() => {
      if (map.current) map.current.resize();
    });
    if (mapContainer.current) resizeObserver.observe(mapContainer.current);

    map.current.addControl(new window.mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      // Logic to only show Spain
      // Hide standard layers that show other countries' data if possible
      // or simply add a mask over everything but Spain.

      // Add Mapbox Country Boundaries source
      map.current.addSource('country-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Enfoque Premium: En lugar de usar una "máscara" opaca cutre que rompe el mar y las fronteras,
      // dejamos el exquisito mapa base (light-v11). Solo atenuamos con blanco semitransparente a los vecinos
      // y destacamos a España con un mínimo toque azul. Esto mantiene el contexto geográfico real.

      // 1. Atenuar los países vecinos para dar protagonismo a España
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

      // 2. Destacar ligeramente el interior de España
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

      // 3. Borde elegante para España
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
          <span class="marker-price">${carga.precio}€</span>
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
  }, [filteredCargas, selectedCarga, setSelectedCarga]);

  // Draw route when carga is selected - Using REAL ROADS via Mapbox Directions API
  useEffect(() => {
    if (!map.current || !mapReady) return;

    const fetchRealRoute = async (origin, destination) => {
      try {
        const accessToken = 'pk.eyJ1IjoiaXNtYXhzbSIsImEiOiJjbWxvM2RhNHEwZnR1M2hzYXhqbTZsbGw2In0.TIwBRUdmLazCgdrmQca0mQ';
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&overview=full&access_token=${accessToken}`;

        console.log('Fetching route from:', url);
        const response = await fetch(url);
        const data = await response.json();
        console.log('Route response:', data);

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
        if (!source) {
          console.log('Route source not found');
          return;
        }

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

          console.log('Drawing route with', coordinates.length, 'points');

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

  // Load Mapbox
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
                  <label>Min €/km: {filterPrecioKm.toFixed(1)}</label>
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
                    <option value="precioKm">Mejor €/km</option>
                    <option value="distancia">Menor distancia</option>
                    <option value="peso">Mayor peso</option>
                    <option value="reciente">Más reciente</option>
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

            {/* Cargas List - Virtualized for performance */}
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
                    <CargaCard
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
                        Cargar más ({filteredCargas.length - visibleCount} restantes)
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
                    <span className="detail-label">Descripción</span>
                    <span className="detail-value">{selectedCarga.descripcion}</span>
                  </div>
                )}
                <div className="detail-row highlight">
                  <span className="detail-label">Precio total</span>
                  <span className="detail-value price">{selectedCarga.precio} €</span>
                </div>
                <div className="detail-row highlight">
                  <span className="detail-label">Rentabilidad</span>
                  <span className="detail-value profit">{(selectedCarga.precio / selectedCarga.distancia).toFixed(2)} €/km</span>
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

// Envios Page
function EnviosPage({ envios }) {
  const [filter, setFilter] = useState('todos');

  const filteredEnvios = envios.filter(e => {
    if (filter === 'todos') return true;
    if (filter === 'activos') return e.estado !== 'entregado';
    if (filter === 'completados') return e.estado === 'entregado';
    return true;
  });

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Mis envios</h1>
        <div className="header-actions">
          <div className="filter-tabs">
            {['todos', 'activos', 'completados'].map(f => (
              <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button className="primary-btn"><PlusIcon />Nueva carga</button>
        </div>
      </div>

      <div className="envios-list">
        {filteredEnvios.map(envio => (
          <div key={envio.id} className="envio-card">
            <div className="envio-info">
              <div className="envio-header">
                <h3>{envio.origen} → {envio.destino}</h3>
                <span className={`envio-badge ${envio.estado}`}>
                  {envio.estado === 'recogida_pendiente' ? 'Recogida pendiente' :
                    envio.estado === 'en_transito' ? 'En transito' : 'Entregado'}
                </span>
              </div>
              <div className="envio-details">
                <span>{envio.peso}t</span>
                <span>{envio.precio} €</span>
              </div>
            </div>
            <div className="envio-progress">
              <div className="progress-text">
                <p className="progress-value">{envio.progreso}%</p>
                <p className="progress-label">completado</p>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar">
                  <div className={`progress-fill ${envio.estado === 'en_transito' ? 'bg-blue-500' : envio.estado === 'entregado' ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${envio.progreso}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Transportistas Page
function TransportistasPage({ transportistas }) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Transportistas</h1>
        <div className="header-actions">
          <div className="search-box">
            <SearchIcon />
            <input type="text" placeholder="Buscar transportista..." />
          </div>
          <button className="primary-btn"><UserPlusIcon />Invitar</button>
        </div>
      </div>

      <div className="transportistas-grid">
        {transportistas.map(trans => (
          <div key={trans.id} className="transportista-card">
            <div className="transportista-header">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(trans.nombre)}&background=1A1A1A&color=fff`}
                alt={trans.nombre}
                className="transportista-avatar"
              />
              <div className="transportista-info">
                <h3>{trans.nombre}</h3>
                <p>{trans.email}</p>
              </div>
              <span className={`estado-badge ${trans.estado}`}>
                {trans.estado === 'disponible' ? 'Disponible' : trans.estado === 'en_ruta' ? 'En ruta' : 'No disponible'}
              </span>
            </div>
            <div className="transportista-stats">
              <div className="trans-stat"><TruckIcon /><span>{trans.vehiculo || 'N/A'}</span></div>
              <div className="trans-stat"><PackageIcon /><span>{trans.capacidad || 0}t</span></div>
              <div className="trans-stat"><StarIcon /><span>{trans.rating}</span></div>
              <div className="trans-stat"><CheckCircleIcon /><span>{trans.envios_completados}</span></div>
            </div>
            <button className="contact-btn">Contactar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Enhanced Chat Widget - PRO VERSION with DRAG & RESIZE
function EnhancedChatWidget({ open, setOpen, messages, input, setInput, onSend, loading, cargas, onAcceptCarga, setCurrentPage }) {
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);
  const dragHandleRef = useRef(null);

  // Chat features state
  const [isMinimized, setIsMinimized] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [chatSize, setChatSize] = useState('normal'); // 'normal', 'fullscreen'

  // Drag state
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  // Resize state
  const [size, setSize] = useState({ width: 420, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset state when closing
  useEffect(() => {
    if (!open) {
      setChatSize('normal');
      setIsMinimized(false);
      setShowCommands(false);
      setShowHistory(false);
      setSearchQuery('');
    }
  }, [open]);

  // Reset position when size changes to fullscreen
  useEffect(() => {
    if (chatSize === 'fullscreen') {
      setPosition({ x: null, y: null });
    }
  }, [chatSize]);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    if (chatSize === 'fullscreen') return;

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    dragStartRef.current = {
      x: clientX,
      y: clientY,
      posX: rect.left,
      posY: rect.top
    };

    e.preventDefault();
  }, [chatSize]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    let newX = dragStartRef.current.posX + deltaX;
    let newY = dragStartRef.current.posY + deltaY;

    // Boundary constraints (keep at least 100px visible on all sides)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    newX = Math.max(-size.width + 100, Math.min(viewportWidth - 100, newX));
    newY = Math.max(-size.height + 100, Math.min(viewportHeight - 100, newY));

    setPosition({ x: newX, y: newY });
  }, [isDragging, size.width, size.height]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Resize handlers
  const handleResizeStart = useCallback((e, direction) => {
    if (chatSize === 'fullscreen') return;
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = chatWindowRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsResizing(true);
    setResizeDirection(direction);
    resizeStartRef.current = {
      x: clientX,
      y: clientY,
      width: rect.width,
      height: rect.height,
      posX: rect.left,
      posY: rect.top
    };
  }, [chatSize]);

  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !resizeDirection) return;

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    const deltaX = clientX - resizeStartRef.current.x;
    const deltaY = clientY - resizeStartRef.current.y;

    let newWidth = resizeStartRef.current.width;
    let newHeight = resizeStartRef.current.height;
    let newX = position.x;
    let newY = position.y;

    // Handle different resize directions
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(320, Math.min(800, resizeStartRef.current.width + deltaX));
    }
    if (resizeDirection.includes('w')) {
      const widthDelta = -deltaX;
      newWidth = Math.max(320, Math.min(800, resizeStartRef.current.width + widthDelta));
      if (newWidth !== resizeStartRef.current.width) {
        newX = resizeStartRef.current.posX + deltaX;
      }
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(400, Math.min(900, resizeStartRef.current.height + deltaY));
    }
    if (resizeDirection.includes('n')) {
      const heightDelta = -deltaY;
      newHeight = Math.max(400, Math.min(900, resizeStartRef.current.height + heightDelta));
      if (newHeight !== resizeStartRef.current.height) {
        newY = resizeStartRef.current.posY + deltaY;
      }
    }

    setSize({ width: newWidth, height: newHeight });
    if (newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }, [isResizing, resizeDirection, position.x, position.y]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeDirection(null);
  }, []);

  // Global mouse/touch events for dragging and resizing
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.addEventListener('touchmove', handleResizeMove, { passive: false });
      document.addEventListener('touchend', handleResizeEnd);
      document.body.style.userSelect = 'none';

      // Set cursor based on direction
      const cursors = {
        'n': 'ns-resize', 's': 'ns-resize',
        'e': 'ew-resize', 'w': 'ew-resize',
        'ne': 'nesw-resize', 'sw': 'nesw-resize',
        'nw': 'nwse-resize', 'se': 'nwse-resize'
      };
      document.body.style.cursor = cursors[resizeDirection] || 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
      if (!isDragging) {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };
  }, [isResizing, resizeDirection, handleResizeMove, handleResizeEnd, isDragging]);

  // Reset position and size
  const resetPosition = () => {
    setPosition({ x: null, y: null });
    setSize({ width: 420, height: 600 });
  };

  const quickActions = [
    { icon: <ZapIcon />, label: 'Urgentes', query: 'Busca cargas urgentes disponibles', color: '#f97316' },
    { icon: <MapPinIcon />, label: 'Madrid', query: 'Cargas desde Madrid', color: '#3b82f6' },
    { icon: <TruckIcon />, label: 'Barcelona', query: 'Cargas hacia Barcelona', color: '#10b981' },
    { icon: <EuroIcon />, label: 'Rentables', query: 'Cargas con mejor precio por km', color: '#8b5cf6' },
    { icon: <SnowflakeIcon />, label: 'Frigorífico', query: 'Busca cargas frigoríficas', color: '#06b6d4' },
    { icon: <RouteIcon />, label: 'Cortas', query: 'Cargas de menos de 300km', color: '#ec4899' },
  ];

  const commands = [
    { cmd: '/urgentes', desc: 'Ver cargas urgentes', action: () => onSend('Muestra cargas urgentes') },
    { cmd: '/mejores', desc: 'Cargas mejor pagadas', action: () => onSend('Cargas con mejor precio por kilómetro') },
    { cmd: '/cerca', desc: 'Cargas cercanas', action: () => onSend('Cargas que salen desde mi ubicación') },
    { cmd: '/frigorifico', desc: 'Cargas refrigeradas', action: () => onSend('Busca cargas frigoríficas disponibles') },
    { cmd: '/resumen', desc: 'Resumen del día', action: () => onSend('Dame un resumen de las cargas disponibles hoy') },
    { cmd: '/ayuda', desc: 'Ver comandos', action: () => setShowCommands(true) },
  ];

  const suggestions = [
    { text: 'Cargas de Madrid a Barcelona', icon: <RouteIcon /> },
    { text: 'Busca cargas frigoríficas', icon: <SnowflakeIcon /> },
    { text: '¿Qué cargas hay hacia Sevilla?', icon: <MapPinIcon /> },
    { text: 'Rutas más rentables hoy', icon: <TrendingUpIcon /> },
    { text: 'Cargas urgentes disponibles', icon: <ZapIcon /> },
    { text: 'Compara rutas Madrid-Valencia vs Madrid-Barcelona', icon: <TargetIcon /> },
  ];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Show commands menu when typing /
    if (value.startsWith('/')) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();

      // Check if it's a command
      const cmd = commands.find(c => input.toLowerCase().startsWith(c.cmd));
      if (cmd) {
        cmd.action();
        setInput('');
        setShowCommands(false);
      } else {
        onSend();
      }
    }
    if (e.key === 'Escape') {
      setShowCommands(false);
    }
  };

  const exportChat = () => {
    const chatText = messages.map(m => `${m.role === 'user' ? 'Tú' : 'Asistente'}: ${m.content}`).join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-carga-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const clearChat = () => {
    if (window.confirm('¿Borrar toda la conversación?')) {
      // This would need to be handled in parent component
      window.location.reload();
    }
  };

  const filteredMessages = searchQuery
    ? messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  // Calculate position and size style
  const getPositionStyle = () => {
    if (chatSize === 'fullscreen') return {};

    let clampedX = position.x;
    let clampedY = position.y;

    // Ensure position stays within viewport bounds
    if (clampedX !== null && clampedY !== null) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      clampedX = Math.max(0, Math.min(viewportWidth - size.width, clampedX));
      clampedY = Math.max(0, Math.min(viewportHeight - size.height, clampedY));
    }

    const style = {
      width: `${size.width}px`,
      height: `${size.height}px`
    };

    if (clampedX !== null && clampedY !== null) {
      style.left = `${clampedX}px`;
      style.top = `${clampedY}px`;
      style.right = 'auto';
      style.bottom = 'auto';
    }

    return style;
  };

  const hasCustomPosition = position.x !== null || size.width !== 420 || size.height !== 600;

  return (
    <>
      <button
        className={`chat-fab ${open ? 'open' : ''} ${messages.length > 0 && !open ? 'has-messages' : ''}`}
        onClick={() => setOpen(!open)}
        data-testid="chat-toggle"
      >
        {open ? <XIcon /> : <MessageCircleIcon />}
        {!open && <span className="chat-fab-label">Abrir el asistente</span>}
        {!open && messages.length > 0 && <span className="chat-fab-badge">{messages.length}</span>}
      </button>

      {open && (
        <div
          ref={chatWindowRef}
          className={`chat-window enhanced ${chatSize} ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''} ${isResizing ? 'resizing' : ''} ${hasCustomPosition ? 'custom-position' : ''} ${open ? 'open' : ''}`}
          style={getPositionStyle()}
        >
          {/* Resize handles */}
          {chatSize !== 'fullscreen' && !isMinimized && (
            <>
              <div className="resize-handle resize-n" onMouseDown={(e) => handleResizeStart(e, 'n')} onTouchStart={(e) => handleResizeStart(e, 'n')} />
              <div className="resize-handle resize-s" onMouseDown={(e) => handleResizeStart(e, 's')} onTouchStart={(e) => handleResizeStart(e, 's')} />
              <div className="resize-handle resize-e" onMouseDown={(e) => handleResizeStart(e, 'e')} onTouchStart={(e) => handleResizeStart(e, 'e')} />
              <div className="resize-handle resize-w" onMouseDown={(e) => handleResizeStart(e, 'w')} onTouchStart={(e) => handleResizeStart(e, 'w')} />
              <div className="resize-handle resize-ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} onTouchStart={(e) => handleResizeStart(e, 'ne')} />
              <div className="resize-handle resize-nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} onTouchStart={(e) => handleResizeStart(e, 'nw')} />
              <div className="resize-handle resize-se" onMouseDown={(e) => handleResizeStart(e, 'se')} onTouchStart={(e) => handleResizeStart(e, 'se')} />
              <div className="resize-handle resize-sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} onTouchStart={(e) => handleResizeStart(e, 'sw')} />
            </>
          )}

          {/* Draggable Header */}
          <div
            ref={dragHandleRef}
            className={`chat-header ${chatSize !== 'fullscreen' ? 'draggable' : ''}`}
            onMouseDown={chatSize !== 'fullscreen' ? handleDragStart : undefined}
            onTouchStart={chatSize !== 'fullscreen' ? handleDragStart : undefined}
          >
            <div className="chat-header-info">
              <div className="chat-bot-avatar premium-bot">
                <PremiumBotIcon />
                <span className="bot-status"></span>
              </div>
              <div>
                <h4>Asistente</h4>
                <p>
                  {loading ? 'Escribiendo...' : 'Bot • En línea'}
                </p>
              </div>
            </div>
            <div className="chat-header-actions">
              {hasCustomPosition && chatSize !== 'fullscreen' && (
                <button
                  onClick={(e) => { e.stopPropagation(); resetPosition(); }}
                  className="header-action-btn reset-btn"
                  title="Volver a tamaño original"
                >
                  <ResetIcon />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setChatSize(chatSize === 'fullscreen' ? 'normal' : 'fullscreen'); }}
                className="header-action-btn"
                title="Pantalla completa"
              >
                <ExpandIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="header-action-btn" title="Minimizar">
                <MinusIcon />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} className="chat-close">
                <XIcon />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Actions Carousel */}
              <div className="chat-quick-actions">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="chat-quick-btn"
                    onClick={() => onSend(action.query)}
                    style={{ '--action-color': action.color }}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Context Bar */}
              {messages.length > 0 && (
                <div className="chat-context-bar">
                  <div className="context-info">
                    <span className="context-count">{messages.length} mensajes</span>
                    <span className="context-separator">•</span>
                    <span className="context-cargas">{cargas.length} cargas disponibles</span>
                  </div>
                  <div className="context-actions">
                    <button onClick={() => setShowHistory(!showHistory)} className={showHistory ? 'active' : ''} title="Buscar">
                      <SearchIcon />
                    </button>
                    <button onClick={exportChat} title="Exportar chat">
                      <DownloadIcon />
                    </button>
                    <button onClick={clearChat} title="Limpiar chat">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              )}

              {/* Search Bar */}
              {showHistory && (
                <div className="chat-search-bar">
                  <SearchIcon />
                  <input
                    type="text"
                    placeholder="Buscar en la conversación..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => { setShowHistory(false); setSearchQuery(''); }}>
                    <XIcon />
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="chat-messages">
                {filteredMessages.length === 0 && !searchQuery && (
                  <div className="chat-welcome">
                    {/* <div className="welcome-icon"><img src="/assets/img/bot-icon.svg" alt="Bot" style={{ width: 70, height: 70 }} /></div> */}
                    <h3>¡Hola! Soy tu asistente</h3>
                    <p>Puedo ayudarte a encontrar las mejores cargas. Prueba alguna de estas opciones:</p>
                    <div className="welcome-suggestions">
                      {suggestions.map((s, i) => (
                        <button key={i} className="suggestion-btn" onClick={() => onSend(s.text)}>
                          {s.icon}
                          <span>{s.text}</span>
                        </button>
                      ))}
                    </div>
                    <div className="welcome-tip">
                      <LightbulbIcon />
                      <span>Tip: Escribe <code>/</code> para ver comandos rápidos</span>
                    </div>
                  </div>
                )}

                {searchQuery && filteredMessages.length === 0 && (
                  <div className="no-results-chat">
                    <SearchIcon />
                    <p>No se encontraron mensajes con "{searchQuery}"</p>
                  </div>
                )}

                {filteredMessages.map((msg, i) => (
                  <div key={i} className={`chat-message ${msg.role} ${msg.isError ? 'error' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="assistant-avatar">
                        <PremiumBotIconStatic />
                      </div>
                    )}
                    <div className="message-wrapper">
                      <div className="message-content">
                        {msg.content}
                      </div>
                      {msg.cargas && msg.cargas.length > 0 && (
                        <div className="chat-cargas">
                          {msg.cargas.slice(0, 4).map(carga => (
                            <div key={carga.id} className="chat-carga-card">
                              <div className="chat-carga-header">
                                <span className="chat-carga-route">{carga.origen} → {carga.destino}</span>
                                <span className={`chat-carga-tipo ${carga.tipo}`}>{carga.tipo}</span>
                              </div>
                              <div className="chat-carga-details">
                                <span><WeightIcon /> {carga.peso}t</span>
                                <span><RouteIcon /> {carga.distancia}km</span>
                                <span className="chat-carga-price"><EuroIcon /> {carga.precio}€</span>
                              </div>
                              <div className="chat-carga-metrics">
                                <span className="metric">{(carga.precio / carga.distancia).toFixed(2)} €/km</span>
                              </div>
                              <div className="chat-carga-actions">
                                <button className="chat-accept-btn" onClick={() => onAcceptCarga(carga.id)}>
                                  <CheckCircleIcon /> Aceptar
                                </button>
                                <button className="chat-view-btn" onClick={() => setCurrentPage('mapa')}>
                                  <MapIcon /> Ver
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {msg.role === 'assistant' && i === messages.length - 1 && !loading && (
                        <div className="message-actions">
                          <button onClick={() => onSend('Dame más opciones')}>
                            <RefreshIcon /> Más opciones
                          </button>
                          <button onClick={() => setCurrentPage('mapa')}>
                            <MapIcon /> Ver en mapa
                          </button>
                          <button onClick={() => onSend('Compara estas cargas')}>
                            <TargetIcon /> Comparar
                          </button>
                        </div>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="user-avatar">
                        <UserIcon />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="chat-message assistant">
                    <div className="assistant-avatar"><PremiumBotIconStatic /></div>
                    <div className="message-wrapper">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Commands Menu */}
              {showCommands && (
                <div className="commands-menu">
                  <div className="commands-header">
                    <span>Comandos rápidos</span>
                    <button onClick={() => setShowCommands(false)}><XIcon /></button>
                  </div>
                  <div className="commands-list">
                    {commands
                      .filter(c => !input || c.cmd.includes(input.toLowerCase()))
                      .map((cmd, i) => (
                        <button
                          key={i}
                          className="command-item"
                          onClick={() => { cmd.action(); setInput(''); setShowCommands(false); }}
                        >
                          <span className="command-name">{cmd.cmd}</span>
                          <span className="command-desc">{cmd.desc}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Input Container */}
              <div className="chat-input-container">
                <div className="input-wrapper">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu mensaje o usa / para comandos..."
                    disabled={loading}
                    data-testid="chat-input"
                  />
                  <div className="input-actions">
                    <button
                      className="input-action-btn"
                      onClick={() => setShowCommands(!showCommands)}
                      title="Comandos"
                    >
                      <CommandIcon />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onSend()}
                  disabled={loading || !input.trim()}
                  data-testid="chat-send"
                  className={`send-btn ${input.trim() ? 'active' : ''}`}
                >
                  <SendIcon />
                </button>
              </div>
            </>
          )}

          {/* Minimized State */}
          {isMinimized && (
            <div className="chat-minimized-content" onClick={() => setIsMinimized(false)}>
              <span>{messages.length} mensajes • Click para expandir</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// Icons
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const ReceiptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17V7" /></svg>;
const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>;
const FileTextIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" /><line x1="16" x2="8" y1="17" y2="17" /><line x1="10" x2="8" y1="9" y2="9" /></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
const MessageCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>;
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>;
// Componente de robot unificado: Premium, Animado y Seguimiento de ojos integrados en Dashboard
const BotIcon = ({ size = 24, showParallax = true, whiteTheme = false }) => {
  const containerRef = React.useRef(null);
  const pupilLRef = React.useRef(null);
  const pupilRRef = React.useRef(null);
  const svgRef = React.useRef(null);
  const id = React.useId().replace(/:/g, '');

  React.useEffect(() => {
    const pupilL = pupilLRef.current;
    const pupilR = pupilRRef.current;
    const svg = svgRef.current;
    const container = containerRef.current;

    const handleMouseMove = (e) => {
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (!rect || rect.width === 0) return;

      const svgCenterX = rect.left + rect.width / 2;
      const svgCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - svgCenterX;
      const deltaY = e.clientY - svgCenterY;

      // 1. Parallax 3D
      if (showParallax && container) {
        let rotateY = (deltaX / window.innerWidth) * 40;
        let rotateX = (deltaY / window.innerHeight) * -40;
        // Limit
        rotateY = Math.max(-20, Math.min(20, rotateY));
        rotateX = Math.max(-20, Math.min(20, rotateX));
        container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      }

      // 2. Pupil Tracking
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / (showParallax ? 120 : 160), 1);

      // We restrict moveX and moveY to stay inside the eye capsules
      const moveX = Math.cos(angle) * (showParallax ? 0.5 : 0.4) * distance;
      const moveY = Math.sin(angle) * 2.2 * distance;

      if (pupilL) pupilL.style.transform = `translate(${moveX}px, ${moveY}px)`;
      if (pupilR) pupilR.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const handleMouseLeave = () => {
      if (container && showParallax) container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      if (pupilL) pupilL.style.transform = 'translate(0px, 0px)';
      if (pupilR) pupilR.style.transform = 'translate(0px, 0px)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showParallax]);
  const bodyFill = whiteTheme ? `url(#grad-white-${id})` : `url(#grad-${id})`;
  const eyeStroke = whiteTheme ? '#000000' : '#FFFFFF';
  const pupilFill = whiteTheme ? '#000000' : '#FFFFFF';

  return (
    <div className={`bot-icon-wrapper ${showParallax ? 'floating' : ''}`} style={{ width: size, height: size, position: 'relative' }}>
      {/* Bot Glow removed to avoid strange shadows as requested */}

      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d', transition: 'transform 0.1s linear' }}
      >
        <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
          <defs>
            {whiteTheme ? (
              <linearGradient id={`grad-white-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#A0A0A0', stopOpacity: 1 }} />
              </linearGradient>
            ) : (
              <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#2D2D33', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#141416', stopOpacity: 1 }} />
              </linearGradient>
            )}

            <clipPath id={`leftEyeClip-${id}`}>
              <rect x="6.5" y="8" width="3" height="8" rx="1.5">
                <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
              </rect>
            </clipPath>

            <clipPath id={`rightEyeClip-${id}`}>
              <rect x="14.5" y="8" width="3" height="8" rx="1.5">
                <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
                <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
              </rect>
            </clipPath>
          </defs>

          <path d="M0 11 Q0 0 11 0 L24 0 L24 13 Q24 24 13 24 L0 24 Z" fill={bodyFill} />

          <g clipPath={`url(#leftEyeClip-${id})`}>
            <circle ref={pupilLRef} cx="8" cy="12" r={showParallax ? 1.1 : 0.9} fill={pupilFill} style={{ transition: 'transform 0.05s linear' }} />
          </g>

          <g clipPath={`url(#rightEyeClip-${id})`}>
            <circle ref={pupilRRef} cx="16" cy="12" r={showParallax ? 1.1 : 0.9} fill={pupilFill} style={{ transition: 'transform 0.05s linear' }} />
          </g>

          <rect x="6.5" y="8" width="3" height="8" rx="1.5" fill="none" stroke={eyeStroke} strokeWidth="0.75">
            <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
          </rect>

          <rect x="14.5" y="8" width="3" height="8" rx="1.5" fill="none" stroke={eyeStroke} strokeWidth="0.75">
            <animate attributeName="height" values="8; 0; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="8; 12; 8; 8" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="rx" values="1.5; 0; 1.5; 1.5" keyTimes="0; 0.03; 0.06; 1" dur="4s" repeatCount="indefinite" />
          </rect>
        </svg>
      </div>
    </div>
  );
};

// Componente de robot premium - usa el SVG integrado interactivo
const PremiumBotIcon = () => (
  <BotIcon size={42} showParallax={false} whiteTheme={true} />
);

// Componente interactivo para mensajes (con seguimiento de ojos, versión normal)
const PremiumBotIconStatic = () => (
  <BotIcon size={24} showParallax={false} whiteTheme={false} />
);


const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
const WeightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3" /><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" /></svg>;
const RouteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" /></svg>;
const EuroIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12" /><path d="M4 14h9" /><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" /></svg>;
const ZapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
const SlidersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4" /><line x1="10" x2="3" y1="4" y2="4" /><line x1="21" x2="12" y1="12" y2="12" /><line x1="8" x2="3" y1="12" y2="12" /><line x1="21" x2="16" y1="20" y2="20" /><line x1="12" x2="3" y1="20" y2="20" /><line x1="14" x2="14" y1="2" y2="6" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="16" x2="16" y1="18" y2="22" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const SnowflakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="22" /><path d="m20 16-4-4 4-4" /><path d="m4 8 4 4-4 4" /><path d="m16 4-4 4-4-4" /><path d="m8 20 4-4 4 4" /></svg>;
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
const MaximizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>;
const MinimizeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h6v6" /><path d="M20 10h-6V4" /><path d="M14 10l7-7" /><path d="M3 21l7-7" /></svg>;
const ExpandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" /></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>;
const CommandIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const ResetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
const GripIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;

export default DashboardPage;


