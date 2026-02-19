import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { BRAND_NAME } from '@/constants';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF9]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-[#1A1A1A] rounded-full animate-spin" />
          <span className="text-slate-600 font-medium">Cargando {BRAND_NAME}...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    window.location.href = '/auth/login.html';
    return null;
  }

  return children;
}
