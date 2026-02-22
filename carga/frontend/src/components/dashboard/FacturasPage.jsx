import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ReceiptIcon, SearchIcon, PlusIcon, DownloadIcon,
  CheckCircleIcon, ClockIcon, FileTextIcon
} from '@/components/Icons';

const DEMO_FACTURAS = [
  { id: 'F-2024-001', fecha: '2024-12-15', cliente: 'Transportes Garc\u00eda S.L.', origen: 'Madrid', destino: 'Barcelona', importe: 1250, estado: 'pagada', vencimiento: '2025-01-15' },
  { id: 'F-2024-002', fecha: '2024-12-18', cliente: 'Log\u00edstica Mart\u00ednez', origen: 'Valencia', destino: 'Sevilla', importe: 980, estado: 'pendiente', vencimiento: '2025-01-18' },
  { id: 'F-2024-003', fecha: '2024-12-20', cliente: 'Envios R\u00e1pidos Norte', origen: 'Bilbao', destino: 'Madrid', importe: 890, estado: 'pagada', vencimiento: '2025-01-20' },
  { id: 'F-2024-004', fecha: '2024-12-22', cliente: 'Frio Express S.A.', origen: 'Zaragoza', destino: 'Valencia', importe: 620, estado: 'vencida', vencimiento: '2025-01-05' },
  { id: 'F-2024-005', fecha: '2025-01-02', cliente: 'Transportes Garc\u00eda S.L.', origen: 'Barcelona', destino: 'Sevilla', importe: 1450, estado: 'pendiente', vencimiento: '2025-02-02' },
  { id: 'F-2024-006', fecha: '2025-01-05', cliente: 'Cargas del Sur', origen: 'M\u00e1laga', destino: 'Madrid', importe: 1100, estado: 'pagada', vencimiento: '2025-02-05' },
];

export default function FacturasPage({ envios }) {
  const [filter, setFilter] = useState('todas');
  const [search, setSearch] = useState('');

  const filteredFacturas = DEMO_FACTURAS
    .filter(f => {
      if (filter === 'todas') return true;
      return f.estado === filter;
    })
    .filter(f =>
      !search || f.id.toLowerCase().includes(search.toLowerCase()) ||
      f.cliente.toLowerCase().includes(search.toLowerCase()) ||
      f.origen.toLowerCase().includes(search.toLowerCase()) ||
      f.destino.toLowerCase().includes(search.toLowerCase())
    );

  const totales = {
    pagadas: DEMO_FACTURAS.filter(f => f.estado === 'pagada').reduce((s, f) => s + f.importe, 0),
    pendientes: DEMO_FACTURAS.filter(f => f.estado === 'pendiente').reduce((s, f) => s + f.importe, 0),
    vencidas: DEMO_FACTURAS.filter(f => f.estado === 'vencida').reduce((s, f) => s + f.importe, 0),
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Facturas</h1>
        <div className="header-actions">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar factura..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="primary-btn"><PlusIcon />Nueva factura</button>
        </div>
      </div>

      {/* Resumen */}
      <div className="mockup-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total facturado', value: `${(totales.pagadas + totales.pendientes + totales.vencidas).toLocaleString()} \u20ac`, icon: <ReceiptIcon />, color: '#1A1A1A' },
          { label: 'Cobradas', value: `${totales.pagadas.toLocaleString()} \u20ac`, icon: <CheckCircleIcon />, color: '#10b981' },
          { label: 'Pendientes', value: `${totales.pendientes.toLocaleString()} \u20ac`, icon: <ClockIcon />, color: '#f59e0b' },
          { label: 'Vencidas', value: `${totales.vencidas.toLocaleString()} \u20ac`, icon: <FileTextIcon />, color: '#ef4444' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="mockup-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1) }}
          >
            <div className="m-stat-header">
              <div className="m-stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
              <span>{stat.label}</span>
            </div>
            <div className="m-stat-body">
              <h3>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtros */}
      <div className="filter-tabs" style={{ marginBottom: '1rem' }}>
        {['todas', 'pagada', 'pendiente', 'vencida'].map(f => (
          <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1) + (f === 'todas' ? '' : 's')}
          </button>
        ))}
      </div>

      {/* Tabla de facturas */}
      <div className="facturas-table-wrapper">
        <table className="facturas-table">
          <thead>
            <tr>
              <th>N\u00ba Factura</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Ruta</th>
              <th>Importe</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.map((factura, i) => (
              <motion.tr
                key={factura.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <td className="factura-id">{factura.id}</td>
                <td>{factura.fecha}</td>
                <td>{factura.cliente}</td>
                <td>{factura.origen} \u2192 {factura.destino}</td>
                <td className="factura-importe">{factura.importe.toLocaleString()} \u20ac</td>
                <td>
                  <span className={`envio-badge ${factura.estado}`}>
                    {factura.estado === 'pagada' ? 'Pagada' : factura.estado === 'pendiente' ? 'Pendiente' : 'Vencida'}
                  </span>
                </td>
                <td>
                  <button className="icon-btn" title="Descargar PDF">
                    <DownloadIcon />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredFacturas.length === 0 && (
          <div className="empty-state">
            <ReceiptIcon />
            <p>No se encontraron facturas</p>
          </div>
        )}
      </div>
    </div>
  );
}
