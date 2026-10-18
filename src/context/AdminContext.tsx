import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService, subscribeToStorageChanges } from '../services/storage';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'branch_manager';
}

interface AdminContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: () => void;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => StorageService.isAdminLoggedIn());
  const [user, setUser] = useState<AdminUser | null>(() => {
    if (StorageService.isAdminLoggedIn()) {
      return {
        id: 'usr-admin-1',
        name: 'Executive Concierge',
        email: 'admin@dineframe.pk',
        role: 'super_admin',
      };
    }
    return null;
  });

  useEffect(() => {
    const unsubscribe = subscribeToStorageChanges(() => {
      const logged = StorageService.isAdminLoggedIn();
      setIsAuthenticated(logged);
      if (!logged) setUser(null);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Standard secure-like check for restaurant admin
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@dineframe.pk' && pass === 'dineframe2026') {
      StorageService.setAdminLogin('admin_auth_token_' + Date.now());
      setUser({
        id: 'usr-admin-1',
        name: 'Executive Concierge',
        email: cleanEmail,
        role: 'super_admin',
      });
      setIsAuthenticated(true);
      return { success: true };
    }
    // Also allow any manager demo credential
    if (cleanEmail.includes('@') && pass.length >= 6) {
      StorageService.setAdminLogin('admin_auth_token_' + Date.now());
      setUser({
        id: 'usr-admin-2',
        name: 'Restaurant Operations Lead',
        email: cleanEmail,
        role: 'branch_manager',
      });
      setIsAuthenticated(true);
      return { success: true };
    }
    return {
      success: false,
      error: 'Invalid credentials. You can use admin@dineframe.pk with password dineframe2026.',
    };
  };

  const quickDemoLogin = () => {
    StorageService.setAdminLogin('admin_quick_token_' + Date.now());
    setUser({
      id: 'usr-admin-1',
      name: 'Operations Manager (Karachi)',
      email: 'admin@dineframe.pk',
      role: 'super_admin',
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    StorageService.setAdminLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, login, quickDemoLogin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
