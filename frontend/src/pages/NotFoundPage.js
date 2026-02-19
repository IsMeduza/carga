import React from 'react';
import MagneticLink from '@/components/ui/MagneticLink';
import { BRAND_NAME } from '@/constants';

function NotFoundPage() {
  return (
    <>
      <style jsx>{`
        @keyframes enterUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes enterScale {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .anim-up {
          animation: enterUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .anim-scale {
          animation: enterScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        .delay-1 {
          animation-delay: 0.1s;
        }
        
        .delay-2 {
          animation-delay: 0.2s;
        }
        
        .delay-3 {
          animation-delay: 0.3s;
        }
      `}</style>
      
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#A6CBE8] via-[#BFD9EF] to-[#EAE3D6]">
        {/* Background Layer with Parallax - from home.html */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <img
            src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bfd2f4cf-65ed-4b1a-86d1-a1710619267b_1600w.png"
            alt="Sky Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#A6CBE8]/20 via-[#BFD9EF]/40 to-[#EAE3D6]"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-6">
            <h1 className="text-6xl font-bold text-[#1A1A1A] mb-4 anim-up">404</h1>
            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4 anim-up delay-1">
              Página no encontrada
            </h2>
            <p className="text-lg text-[#64748B] mb-8 anim-up delay-2">
              Lo sentimos, la página que buscas no existe en {BRAND_NAME}.
            </p>
            <div className="space-y-4 anim-up delay-3">
              <MagneticLink
                to="/"
                shine={true}
                className="inline-flex bg-[#1A1A1A] text-white text-[15px] font-bold px-8 py-3 rounded-full items-center gap-2 shadow-lg hover:bg-[#2A2A2A] transition-all"
              >
                <span>Ir a la página principal</span>
              </MagneticLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFoundPage;
