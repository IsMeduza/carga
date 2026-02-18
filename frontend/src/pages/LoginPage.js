import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { BRAND_NAME, PAGE_TITLES, DEMO_MODE, API_URL as API } from '@/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = PAGE_TITLES.LOGIN;
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Modo DEMO: redirigir directamente sin llamar a la API
    if (DEMO_MODE) {
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
      return;
    }

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Error al iniciar sesión');
      }

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2EBE5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-200 bg-white shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-slate-900">
              {BRAND_NAME}
            </CardTitle>
            <CardDescription className="text-slate-500">
              Accede a tu panel de transporte
              {DEMO_MODE && (
                <span className="block text-xs text-orange-600 mt-1 font-medium">🚀 Modo Demo activado</span>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@empresa.es"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-slate-800 text-white h-11"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Accediendo...</>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>

              <p className="text-sm text-slate-500 text-center">
                No tienes cuenta?{' '}
                <a href="/register.html" className="font-semibold text-slate-900 hover:underline">
                  Regístrate gratis
                </a>
              </p>

              {DEMO_MODE && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard', { replace: true })}
                  className="w-full mt-2 border-dashed border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400"
                >
                  ⚡ Entrar sin credenciales (Demo)
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
