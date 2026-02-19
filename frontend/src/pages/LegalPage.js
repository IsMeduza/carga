import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BRAND_NAME } from '@/constants';

const legalPages = {
  'terminos': {
    title: 'Términos y Condiciones',
    description: 'Términos de uso de la plataforma ' + BRAND_NAME,
    content: 'Al usar nuestra plataforma, aceptas estos términos y condiciones de uso.'
  },
  'privacidad': {
    title: 'Política de Privacidad',
    description: 'Cómo protegemos tus datos',
    content: 'Nos comprometemos a proteger la privacidad de nuestros usuarios y sus datos personales.'
  },
  'cookies': {
    title: 'Política de Cookies',
    description: 'Uso de cookies en nuestra plataforma',
    content: 'Utilizamos cookies para mejorar tu experiencia en nuestra plataforma.'
  }
};

function LegalPage() {
  const { page } = useParams();
  const pageData = legalPages[page];

  if (!pageData) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">Página no encontrada</h1>
          <Link to="/" className="text-[#1A1A1A] underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <nav className="mb-8">
          <Link to="/" className="text-[#64748B] hover:text-[#1A1A1A]">
            ← Inicio
          </Link>
        </nav>
        
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
          {pageData.title}
        </h1>
        
        <p className="text-xl text-[#64748B] mb-8">
          {pageData.description}
        </p>
        
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#E2E8F0]">
          <div className="prose max-w-none">
            <p className="text-[#1A1A1A] leading-relaxed mb-6">
              {pageData.content}
            </p>
            
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Información Legal</h3>
              <p className="text-[#64748B]">
                Esta es la versión React de nuestra página legal. Para obtener la información completa y detallada,
                puedes consultar la{' '}
                <a 
                  href={`/legal/${page}.html`}
                  className="text-[#1A1A1A] underline hover:text-[#2A2A2A]"
                >
                  versión estática oficial aquí
                </a>.
              </p>
              
              <div className="bg-[#F8FAFC] p-4 rounded border border-[#E2E8F0]">
                <p className="text-sm text-[#64748B]">
                  <strong>Nota:</strong> La versión estática contiene los términos legales completos y actualizados.
                  Esta versión React es para navegación integrada dentro de la aplicación.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-[#E2E8F0] pt-6 mt-8">
            <div className="flex gap-4">
              <Link 
                to="/"
                className="bg-[#1A1A1A] text-white px-4 py-2 rounded hover:bg-[#2A2A2A] transition-colors"
              >
                Volver al inicio
              </Link>
              <Link 
                to="/dashboard"
                className="border border-[#1A1A1A] text-[#1A1A1A] px-4 py-2 rounded hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                Ir al dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalPage;
