// ==========================================
// CONSTANTES GLOBALES DE LA APLICACIÓN
// ==========================================

// Nombre de la marca/plataforma
export const BRAND_NAME = 'Nombre';

// URLs
export const IS_LOCALHOST = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const STATIC_URL = IS_LOCALHOST ? 'http://localhost:5500' : '';
export const LANDING_URL = `${STATIC_URL}/index.html`;
export const LOGO_URL = `${STATIC_URL}/assets/img/assets/img/logo.svg`;

// Títulos de página
export const PAGE_TITLES = {
  LOGIN: `Login - ${BRAND_NAME}`,
  DASHBOARD: `Dashboard - ${BRAND_NAME}`,
  REGISTER: `Registro - ${BRAND_NAME}`,
  DEFAULT: `${BRAND_NAME} - Plataforma de Transporte`
};

// Modo demo
export const DEMO_MODE = true;

// API
export const API_URL = process.env.REACT_APP_BACKEND_URL || '';
