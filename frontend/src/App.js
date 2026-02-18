import { useEffect, useState, Suspense, lazy } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { BRAND_NAME } from "@/constants";

// Lazy loading para code splitting
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));

// Loading fallback
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
      <div className="App">
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/index.html" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;
