import React from 'react';
import {
  SearchIcon, UserPlusIcon, TruckIcon,
  PackageIcon, StarIcon, CheckCircleIcon
} from '@/components/Icons';

export default function TransportistasPage({ transportistas }) {
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
