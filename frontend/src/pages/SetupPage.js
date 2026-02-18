import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Truck, MapPin, Package, BarChart3, LogOut } from 'lucide-react';
import { BRAND_NAME, PAGE_TITLES } from '@/constants';

export default function SetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    document.title = PAGE_TITLES.DASHBOARD;
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API}/stats`, { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2EBE5] flex items-center justify-center">
        <div className="text-slate-500 flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Cargando {BRAND_NAME}...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EBE5] text-slate-800">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Truck className="w-7 h-7 text-slate-900" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">{BRAND_NAME}</span>
        </div>
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesion
        </Button>
      </header>

      {/* Dashboard */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Panel de control</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Cargas activas</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.cargas_activas || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Envios en curso</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.envios_en_curso || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Transportistas</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.transportistas || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Facturacion mes</p>
                  <p className="text-2xl font-bold text-slate-900">{stats?.facturacion_mes || '0 EUR'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Acciones rapidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-[#1A1A1A] hover:bg-slate-800 text-white">
                <Package className="w-4 h-4 mr-2" /> Nueva carga
              </Button>
              <Button variant="outline">
                <MapPin className="w-4 h-4 mr-2" /> Ver mapa
              </Button>
              <Button variant="outline">
                <Truck className="w-4 h-4 mr-2" /> Mis envios
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
