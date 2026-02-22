import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUpIcon, TruckIcon, MapPinIcon, CheckCircleIcon,
  EuroIcon, RouteIcon, ChevronDownIcon
} from '@/components/Icons';

export default function EstadisticasPage({ stats, envios, cargas }) {
  const [periodo, setPeriodo] = useState('mes');

  const completados = envios.filter(e => e.estado === 'entregado').length;
  const enCurso = envios.filter(e => e.estado !== 'entregado').length;
  const ingresoTotal = envios.reduce((sum, e) => sum + (e.precio || 0), 0);
  const precioMedioKm = cargas.length > 0
    ? (cargas.reduce((sum, c) => sum + (c.precio / c.distancia), 0) / cargas.length).toFixed(2)
    : '1.85';

  const monthlyData = [
    { label: 'Ene', envios: 28, ingresos: 35200 },
    { label: 'Feb', envios: 35, ingresos: 42800 },
    { label: 'Mar', envios: 22, ingresos: 28600 },
    { label: 'Abr', envios: 31, ingresos: 38900 },
    { label: 'May', envios: 18, ingresos: 22400 },
    { label: 'Jun', envios: 42, ingresos: 51200 },
    { label: 'Jul', envios: 55, ingresos: 68400 },
    { label: 'Ago', envios: 15, ingresos: 19800 },
    { label: 'Sep', envios: 38, ingresos: 46200 },
    { label: 'Oct', envios: 48, ingresos: 58100 },
    { label: 'Nov', envios: 12, ingresos: 15600 },
    { label: 'Dic', envios: 40, ingresos: 49200 },
  ];

  const maxEnvios = Math.max(...monthlyData.map(m => m.envios));

  const topRutas = [
    { ruta: 'Madrid \u2192 Barcelona', envios: 87, ingresos: 108750 },
    { ruta: 'Valencia \u2192 Sevilla', envios: 65, ingresos: 63700 },
    { ruta: 'Bilbao \u2192 Madrid', envios: 52, ingresos: 46280 },
    { ruta: 'Zaragoza \u2192 Valencia', envios: 41, ingresos: 25420 },
    { ruta: 'Barcelona \u2192 Sevilla', envios: 38, ingresos: 55100 },
  ];

  const tiposCarga = [
    { tipo: 'Completa', porcentaje: 42, color: '#3b82f6' },
    { tipo: 'Parcial', porcentaje: 28, color: '#10b981' },
    { tipo: 'Urgente', porcentaje: 18, color: '#f97316' },
    { tipo: 'Frigor\u00edfico', porcentaje: 12, color: '#06b6d4' },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Estad\u00edsticas</h1>
        <div className="header-actions">
          <div className="filter-tabs">
            {[
              { id: 'semana', label: 'Semana' },
              { id: 'mes', label: 'Mes' },
              { id: 'trimestre', label: 'Trimestre' },
              { id: 'anual', label: 'Anual' },
            ].map(p => (
              <button key={p.id} className={`filter-tab ${periodo === p.id ? 'active' : ''}`} onClick={() => setPeriodo(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="mockup-stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Ingresos totales', value: `${(ingresoTotal || 476400).toLocaleString()} \u20ac`, icon: <EuroIcon />, trend: '+18.2%' },
          { label: 'Env\u00edos completados', value: completados || 384, icon: <CheckCircleIcon />, trend: '+12.5%' },
          { label: 'Env\u00edos en curso', value: enCurso || 87, icon: <TruckIcon />, trend: '+8.3%' },
          { label: 'Precio medio/km', value: `${precioMedioKm} \u20ac`, icon: <RouteIcon />, trend: '+3.1%' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="mockup-stat-card"
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

      <div className="mockup-bottom-grid">
        {/* Gr\u00e1fico de env\u00edos por mes */}
        <div className="mockup-chart-card">
          <div className="m-chart-header">
            <h3>Env\u00edos por mes</h3>
            <button className="m-chart-filter">2024 <ChevronDownIcon /></button>
          </div>
          <div className="m-chart-bars">
            {monthlyData.map((bar, i) => (
              <div key={i} className="m-chart-col">
                <motion.div
                  className={`m-bar ${bar.envios === maxEnvios ? 'active' : ''}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${(bar.envios / maxEnvios) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.05, ease: "easeOut" }}
                />
                <span>{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribuci\u00f3n por tipo de carga */}
        <div className="mockup-chart-card">
          <div className="m-chart-header">
            <h3>Tipo de carga</h3>
          </div>
          <div className="tipos-carga-list">
            {tiposCarga.map((tipo, i) => (
              <motion.div
                key={tipo.tipo}
                className="tipo-carga-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (i + 1) }}
              >
                <div className="tipo-info">
                  <span className="tipo-dot" style={{ background: tipo.color }}></span>
                  <span className="tipo-name">{tipo.tipo}</span>
                  <span className="tipo-pct">{tipo.porcentaje}%</span>
                </div>
                <div className="tipo-bar-bg">
                  <motion.div
                    className="tipo-bar-fill"
                    style={{ background: tipo.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${tipo.porcentaje}%` }}
                    transition={{ duration: 0.8, delay: 0.2 * (i + 1) }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top rutas */}
      <div className="mockup-chart-card" style={{ marginTop: '1.5rem' }}>
        <div className="m-chart-header">
          <h3>Rutas m\u00e1s populares</h3>
        </div>
        <div className="top-rutas-list">
          {topRutas.map((ruta, i) => (
            <motion.div
              key={ruta.ruta}
              className="ruta-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * (i + 1) }}
            >
              <div className="ruta-rank">#{i + 1}</div>
              <div className="ruta-info">
                <span className="ruta-name">{ruta.ruta}</span>
                <span className="ruta-detail">{ruta.envios} env\u00edos</span>
              </div>
              <div className="ruta-ingresos">{ruta.ingresos.toLocaleString()} \u20ac</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
