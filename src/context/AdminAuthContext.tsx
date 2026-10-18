import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession, UserRole } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface AdminAuthContextType {
  currentUser: UserSession | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: UserRole, specificEmail?: string) => void;
  logout: () => void;
  canManageSettings: boolean;
  canManageFinancials: boolean;
  canManageStaff: boolean;
  canManageAllAppointments: boolean;
}

const AUTH_STORAGE_KEY = 'luma_current_auth_session';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  useEffect(() => {
    void fetch('/api/auth/session', { credentials: 'include' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Not authenticated')))
      .then(({ user }: { user: UserSession }) => {
        setCurrentUser(user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      })
      .catch(() => localStorage.removeItem(AUTH_STORAGE_KEY));
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json() as { user?: UserSession; error?: string };
      if (!response.ok || !result.user) return { success: false, error: result.error || 'Invalid credentials.' };
      setCurrentUser(result.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.user));
      return { success: true };
    } catch (error) {
      console.error('Admin login request failed', error);
      return { success: false, error: 'Unable to reach the backend. Start the API server and try again.' };
    }
  };

  const switchDemoRole = (role: UserRole, specificEmail?: string) => {
    let target = DEMO_USERS.find((u) => u.role === role);
    if (specificEmail) {
      const byEmail = DEMO_USERS.find((u) => u.email === specificEmail);
      if (byEmail) target = byEmail;
    }
    if (target) {
      void fetch('/api/auth/demo', { method: 'POST', credentials: 'include' })
        .then((response) => response.json())
        .then(({ user }: { user: UserSession }) => {
          setCurrentUser(user);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        })
        .catch((error) => console.error('Demo login request failed', error));
    }
  };

  const logout = () => {
    void fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      .catch((error) => console.error('Admin logout request failed', error))
      .finally(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setCurrentUser(null);
      });
  };

  const role = currentUser?.role;
  const canManageSettings = role === 'owner';
  const canManageFinancials = role === 'owner';
  const canManageStaff = role === 'owner';
  const canManageAllAppointments = role === 'owner' || role === 'receptionist';

  return (
    <AdminAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        switchDemoRole,
        logout,
        canManageSettings,
        canManageFinancials,
        canManageStaff,
        canManageAllAppointments
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  return ctx;
};
