import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon, SettingsIcon, BellIcon, TruckIcon, MapPinIcon
} from '@/components/Icons';

export default function AjustesPage({ user }) {
  const [activeTab, setActiveTab] = useState('perfil');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifCargas, setNotifCargas] = useState(true);
  const [notifPrecios, setNotifPrecios] = useState(false);
  const [distanciaMax, setDistanciaMax] = useState(800);
  const [pesoMax, setPesoMax] = useState(24);
  const [zonaPreferida, setZonaPreferida] = useState('centro');

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: <UserIcon /> },
    { id: 'notificaciones', label: 'Notificaciones', icon: <BellIcon /> },
    { id: 'vehiculo', label: 'Veh\u00edculo', icon: <TruckIcon /> },
    { id: 'preferencias', label: 'Preferencias', icon: <MapPinIcon /> },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Ajustes</h1>
      </div>

      <div className="ajustes-layout">
        {/* Tabs laterales */}
        <div className="ajustes-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`ajuste-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="ajustes-content">
          {activeTab === 'perfil' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ajuste-section"
            >
              <h2>Informaci\u00f3n personal</h2>
              <div className="ajuste-form">
                <div className="form-group">
                  <label>Nombre</label>
                  <input type="text" defaultValue={user?.user_metadata?.first_name || 'Carlos'} />
                </div>
                <div className="form-group">
                  <label>Apellidos</label>
                  <input type="text" defaultValue={user?.user_metadata?.last_name || 'Lopez'} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user?.email || 'carlos@empresa.com'} />
                </div>
                <div className="form-group">
                  <label>Tel\u00e9fono</label>
                  <input type="tel" defaultValue="+34 612 345 678" />
                </div>
                <div className="form-group">
                  <label>Empresa</label>
                  <input type="text" defaultValue="Transportes Lopez S.L." />
                </div>
                <div className="form-group">
                  <label>NIF/CIF</label>
                  <input type="text" defaultValue="B12345678" />
                </div>
              </div>
              <button className="primary-btn" style={{ marginTop: '1.5rem' }}>Guardar cambios</button>
            </motion.div>
          )}

          {activeTab === 'notificaciones' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ajuste-section"
            >
              <h2>Preferencias de notificaci\u00f3n</h2>
              <div className="toggle-list">
                <ToggleItem label="Notificaciones por email" desc="Recibe alertas en tu correo" value={notifEmail} onChange={setNotifEmail} />
                <ToggleItem label="Notificaciones push" desc="Alertas en tiempo real en el navegador" value={notifPush} onChange={setNotifPush} />
                <ToggleItem label="Nuevas cargas disponibles" desc="Aviso cuando haya cargas en tu zona" value={notifCargas} onChange={setNotifCargas} />
                <ToggleItem label="Cambios de precio" desc="Alerta cuando las tarifas cambien" value={notifPrecios} onChange={setNotifPrecios} />
              </div>
            </motion.div>
          )}

          {activeTab === 'vehiculo' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ajuste-section"
            >
              <h2>Datos del veh\u00edculo</h2>
              <div className="ajuste-form">
                <div className="form-group">
                  <label>Tipo de veh\u00edculo</label>
                  <select defaultValue="trailer">
                    <option value="trailer">Tr\u00e1iler (40t)</option>
                    <option value="rigido">Cami\u00f3n r\u00edgido (12t)</option>
                    <option value="furgoneta">Furgoneta (3.5t)</option>
                    <option value="frigorifico">Frigor\u00edfico</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Matr\u00edcula</label>
                  <input type="text" defaultValue="1234 ABC" />
                </div>
                <div className="form-group">
                  <label>Capacidad m\u00e1xima (toneladas)</label>
                  <input type="number" defaultValue="24" />
                </div>
                <div className="form-group">
                  <label>A\u00f1o del veh\u00edculo</label>
                  <input type="number" defaultValue="2022" />
                </div>
                <div className="form-group">
                  <label>Certificaciones</label>
                  <div className="checkbox-list">
                    <label><input type="checkbox" defaultChecked /> ATP (Transporte perecederos)</label>
                    <label><input type="checkbox" defaultChecked /> ADR (Mercanc\u00edas peligrosas)</label>
                    <label><input type="checkbox" /> GDP (Productos farmac\u00e9uticos)</label>
                  </div>
                </div>
              </div>
              <button className="primary-btn" style={{ marginTop: '1.5rem' }}>Guardar cambios</button>
            </motion.div>
          )}

          {activeTab === 'preferencias' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="ajuste-section"
            >
              <h2>Preferencias de carga</h2>
              <div className="ajuste-form">
                <div className="form-group">
                  <label>Distancia m\u00e1xima preferida: {distanciaMax} km</label>
                  <input
                    type="range" min="100" max="2000" step="50"
                    value={distanciaMax}
                    onChange={(e) => setDistanciaMax(Number(e.target.value))}
                  />
                  <div className="range-labels">
                    <span>100 km</span>
                    <span>2000 km</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Peso m\u00e1ximo: {pesoMax} t</label>
                  <input
                    type="range" min="1" max="40" step="1"
                    value={pesoMax}
                    onChange={(e) => setPesoMax(Number(e.target.value))}
                  />
                  <div className="range-labels">
                    <span>1 t</span>
                    <span>40 t</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Zona preferida</label>
                  <select value={zonaPreferida} onChange={(e) => setZonaPreferida(e.target.value)}>
                    <option value="norte">Norte (Pa\u00eds Vasco, Cantabria, Asturias)</option>
                    <option value="centro">Centro (Madrid, Castilla)</option>
                    <option value="levante">Levante (Valencia, Murcia)</option>
                    <option value="sur">Sur (Andaluc\u00eda)</option>
                    <option value="noreste">Noreste (Catalu\u00f1a, Arag\u00f3n)</option>
                    <option value="todas">Todas las zonas</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipos de carga preferidos</label>
                  <div className="checkbox-list">
                    <label><input type="checkbox" defaultChecked /> Completa</label>
                    <label><input type="checkbox" defaultChecked /> Parcial</label>
                    <label><input type="checkbox" /> Urgente</label>
                    <label><input type="checkbox" /> Frigor\u00edfico</label>
                  </div>
                </div>
              </div>
              <button className="primary-btn" style={{ marginTop: '1.5rem' }}>Guardar preferencias</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleItem({ label, desc, value, onChange }) {
  return (
    <div className="toggle-item">
      <div className="toggle-info">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{desc}</span>
      </div>
      <button
        className={`toggle-switch ${value ? 'active' : ''}`}
        onClick={() => onChange(!value)}
      >
        <span className="toggle-knob"></span>
      </button>
    </div>
  );
}
