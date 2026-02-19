import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BRAND_NAME, PAGE_TITLES } from '@/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, isLoggedIn, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = PAGE_TITLES.LOGIN;
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, authLoading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.message?.includes('Invalid login')) {
        setError('Email o contraseña incorrectos');
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Por favor confirma tu email antes de iniciar sesión');
      } else {
        setError(err.message || 'Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Error al iniciar con Google');
      setGoogleLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-[#1A1A1A] rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL — Dark */}
      <div className="lg:w-[48%] bg-[#0F0F0F] relative overflow-hidden min-h-[40vh] lg:min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative z-10 w-full px-8 py-12 lg:px-14 xl:px-20 flex items-center justify-center min-h-full">
          <div className="max-w-lg mx-auto space-y-8">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" />
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">{BRAND_NAME}</span>
            </div>

            <div>
              <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] xl:text-[46px] font-bold leading-[1.08] text-white tracking-tight">
                Conecta cargas con transportistas en toda España
              </h1>
              <p className="text-[15px] lg:text-base text-white/50 leading-relaxed mt-4 max-w-md">
                La plataforma que une a generadores de carga y transportistas verificados. Sin comisiones. Sin complicaciones.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-white">+2.150</div>
                <div className="text-[11px] text-white/40 font-medium">Transportistas</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div>
                <div className="text-2xl font-bold text-white">1.284</div>
                <div className="text-[11px] text-white/40 font-medium">Cargas/dia</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div>
                <div className="text-2xl font-bold text-white">4.8<span className="text-base text-white/40">/5</span></div>
                <div className="text-[11px] text-white/40 font-medium">Valoracion</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="border-l-2 border-white/10 pl-4">
              <p className="text-[14px] text-white/50 italic leading-relaxed">
                "Antes era una hora al telefono con tres agencias distintas. Ahora en cinco minutos tengo la carga asignada y la documentacion generada."
              </p>
              <div className="flex items-center gap-2.5 mt-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold">TH</div>
                <div>
                  <span className="text-[13px] font-semibold text-white/70">Tomas Herrera</span>
                  <span className="text-[12px] text-white/30 ml-1">· Transportista autonomo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="lg:w-[52%] bg-gradient-to-b from-[#ABCDE9] to-[#EAE3D6] flex flex-col justify-center items-center p-5 sm:p-8 lg:p-12 xl:p-16 overflow-y-auto min-h-[60vh] lg:min-h-screen relative">
        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">{BRAND_NAME}</span>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-xl shadow-black/[0.04] p-7 sm:p-9">
            <div className="text-center mb-7">
              <h1 className="text-[22px] font-bold text-[#1A1A1A]">Bienvenido de vuelta</h1>
              <p className="text-sm text-slate-400 mt-1">Inicia sesion en tu cuenta</p>
            </div>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} noValidate>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@empresa.com"
                    required
                    autoComplete="email"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-[#F6F4F0] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full px-4 py-3 bg-[#F6F4F0] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 transition-all pr-11 focus:outline-none focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-[#1A1A1A] text-white text-[15px] font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesion...
                  </>
                ) : (
                  <>
                    Iniciar sesion
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-400 font-medium">o continua con</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full bg-white border border-slate-200 text-slate-700 text-[15px] font-semibold px-6 py-3.5 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {googleLoading ? 'Conectando...' : 'Continuar con Google'}
            </button>

            {/* Register link */}
            <p className="text-center text-sm text-slate-500 mt-6">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Crea una gratis
              </Link>
            </p>

            {/* Home link */}
            <div className="text-center mt-3">
              <a href="/home.html" className="text-sm text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Volver al inicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
