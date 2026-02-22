import React from 'react';
import { motion } from 'framer-motion';
import NotificationsPanel from './NotificationsPanel';
import {
  UserIcon, SearchIcon, BellIcon, ZapIcon,
  MapPinIcon, TruckIcon, CheckCircleIcon, UsersIcon,
  PlusCircleIcon, ReceiptIcon, FileTextIcon,
  ChevronDownIcon
} from '@/components/Icons';

export default function PanelPage({ user, stats, setCurrentPage, cargas, envios, onAcceptCarga, notifications, showNotifications, setShowNotifications }) {
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
        {[
          { icon: <MapPinIcon />, label: 'Cargas disponibles', value: demoStats.cargas, trend: demoStats.c_perc, onClick: () => setCurrentPage('mapa') },
          { icon: <TruckIcon />, label: 'Envíos en curso', value: demoStats.envios, trend: demoStats.e_perc, onClick: () => setCurrentPage('envios') },
          { icon: <CheckCircleIcon />, label: 'Completados este mes', value: demoStats.completados, trend: demoStats.co_perc },
          { icon: <UsersIcon />, label: 'Transportistas activos', value: demoStats.transportistas, trend: demoStats.t_perc, onClick: () => setCurrentPage('transportistas') },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="mockup-stat-card"
            onClick={stat.onClick}
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
          >
            <div className="m-stat-header">
              <div className="m-stat-icon">{stat.icon}</div>
              <span>{stat.label}</span>
            </div>
            <div className="m-stat-body">
              <h3>{stat.value}</h3>
              <span className="m-stat-trend positive">{stat.trend}</span>
            </div>
          </motion.div>
        ))}
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
