import React from 'react';
import { BRAND_NAME } from '@/constants';

function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
          Bienvenido a {BRAND_NAME}
        </h1>
        <p className="text-lg text-[#64748B] mb-8">
          Marketplace de transporte por carretera en España
        </p>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0]">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Para Generadores de Carga
            </h2>
            <p className="text-[#64748B]">
              Publica tus cargas y encuentra transportistas verificados
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-[#E2E8F0]">
            <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
              Para Transportistas
            </h2>
            <p className="text-[#64748B]">
              Accede a cargas disponibles y optimiza tus rutas
            </p>
          </div>
        </div>
        <div className="mt-8 text-sm text-[#94A3B8]">
          <p>Para acceder al dashboard, inicia sesión o regístrate</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
