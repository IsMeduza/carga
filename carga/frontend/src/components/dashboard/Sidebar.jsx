import React from 'react';
import { BRAND_NAME } from '@/constants';
import {
  HomeIcon, MapPinIcon, FolderIcon, UsersIcon,
  ReceiptIcon, TrendingUpIcon, SettingsIcon,
  XIcon, ChevronLeftIcon, ChevronRightIcon,
  ArrowRightIcon, LogOutIcon, UserIcon
} from '@/components/Icons';

export default function Sidebar({ user, currentPage, setCurrentPage, mobile, onClose, enviosCount, collapsed, setCollapsed, onLogout }) {
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
            <span className="logo-text">{BRAND_NAME}</span>
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
