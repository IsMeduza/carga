import React, { useState } from 'react';
import { PlusIcon, SearchIcon } from '@/components/Icons';

export default function EnviosPage({ envios }) {
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
