import React from 'react';
import { XIcon, PackageIcon, TruckIcon, TrendingUpIcon, CheckCircleIcon } from '@/components/Icons';

export default function NotificationsPanel({ notifications, onClose }) {
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
