import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  clearStoredAdmin,
  DUMMY_ADMIN_USER,
  persistAdmin,
  readStoredAdmin,
  validateAdminCredentials,
  type AdminUser,
} from '../services/authService';

interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => readStoredAdmin());

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: (email, password) => {
      if (!validateAdminCredentials(email, password)) return false;
      persistAdmin(DUMMY_ADMIN_USER);
      setUser(DUMMY_ADMIN_USER);
      return true;
    },
    logout: () => {
      clearStoredAdmin();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
