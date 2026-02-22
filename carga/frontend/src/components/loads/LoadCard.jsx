import React from 'react';
import { WeightIcon, RouteIcon, ClockIcon } from '@/components/Icons';

export function estimateTime(distance) {
  const hours = Math.floor(distance / 85);
  const mins = Math.round((distance % 85) / 85 * 60);
  return `${hours}h ${mins}min`;
}

const LoadCard = React.memo(function LoadCard({ carga, isSelected, onClick, onAccept, viewMode }) {
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

export default LoadCard;
