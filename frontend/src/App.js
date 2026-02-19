import React, { Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { BRAND_NAME } from '@/constants';

// Lazy loading
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
// Redirect to static pages
const RedirectTo = ({ path }) => {
  React.useEffect(() => {
    window.location.href = path;
  }, [path]);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-slate-200 border-t-[#1A1A1A] rounded-full animate-spin" />
      <span className="text-slate-600 font-medium">Cargando {BRAND_NAME}...</span>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/" element={<RedirectTo path="/home.html" />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
