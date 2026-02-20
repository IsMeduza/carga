import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Demo Mode first
    if (localStorage.getItem('demoMode') === 'true') {
      const mockUser = {
        id: 'demo-user-1234',
        email: 'demo@empresa.com',
        user_metadata: {
          first_name: 'Usuario',
          last_name: 'Demo'
        }
      };
      setUser(mockUser);
      setSession({ user: mockUser, access_token: 'demo-token' });
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. First, set up the auth state listener.
    //    This will fire for the initial session AND for OAuth callback tokens in the URL hash.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth event:', event);
        if (newSession?.user) {
          setUser(newSession.user);
          setSession(newSession);
        } else {
          setUser(null);
          setSession(null);
        }
        setLoading(false);
      }
    );

    // 2. Then check existing session as a fallback.
    //    onAuthStateChange should fire INITIAL_SESSION first, but just in case:
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        setUser(currentSession.user);
        setSession(currentSession);
      }
      // If onAuthStateChange hasn't fired yet, stop loading
      setLoading(false);
    }).catch((error) => {
      console.error('Error checking session:', error);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (localStorage.getItem('demoMode') === 'true') {
      localStorage.removeItem('demoMode');
      setUser(null);
      setSession(null);
      return;
    }
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) throw error;
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isLoggedIn: !!user,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
    }),
    [user, session, loading, signUp, signIn, signOut, signInWithGoogle]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
