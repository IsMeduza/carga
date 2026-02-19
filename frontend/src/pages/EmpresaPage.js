import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BRAND_NAME } from '@/constants';

const empresaPages = {
  'sobre-nosotros': {
    title: 'Sobre Nosotros',
    description: 'Conoce la historia y misión de ' + BRAND_NAME,
    content: 'Somos una plataforma dedicada a conectar generadores de carga con transportistas verificados en España.'
  },
  'contacto': {
    title: 'Contacto',
    description: 'Ponte en contacto con nuestro equipo',
    content: 'Estamos aquí para ayudarte. Contáctanos para cualquier consulta sobre nuestros servicios.'
  },
  'empleo': {
    title: 'Empleo',
    description: 'Únete a nuestro equipo',
    content: 'Buscamos talentos apasionados por revolucionar el sector del transporte.'
  },
  'blog': {
    title: 'Blog',
    description: 'Noticias y artículos del sector',
    content: 'Mantente informado sobre las últimas tendencias en transporte y logística.'
  }
};

function EmpresaPage() {
  const { page } = useParams();
  const pageData = empresaPages[page];

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
          <p className="text-[#1A1A1A] leading-relaxed mb-6">
            {pageData.content}
          </p>
          
          <div className="border-t border-[#E2E8F0] pt-6 mt-8">
            <p className="text-[#64748B] mb-4">
              Esta es la versión React de la página. También puedes ver la{' '}
              <a 
                href={`/empresa/${page}.html`}
                className="text-[#1A1A1A] underline hover:text-[#2A2A2A]"
              >
                versión estática aquí
              </a>.
            </p>
            
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

export default EmpresaPage;
