import React, { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useModerator, useAdminToken, useIsAdminAuthenticated, useIsAdminLoading, useAdminLogin, useAdminLogout, useSetAdminLoading } from '../stores/adminStore';
import { adminService } from '../services/adminService';

interface AdminAuthContextType {
  moderator: ReturnType<typeof useModerator>;
  token: ReturnType<typeof useAdminToken>;
  isAuthenticated: ReturnType<typeof useIsAdminAuthenticated>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: ReturnType<typeof useIsAdminLoading>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const moderator = useModerator();
  const token = useAdminToken();
  const isAuthenticated = useIsAdminAuthenticated();
  const loading = useIsAdminLoading();
  const loginAction = useAdminLogin();
  const logoutAction = useAdminLogout();
  const setLoading = useSetAdminLoading();

  useEffect(() => {
    // Zustand persist middleware handles localStorage automatically
    // Just set loading to false on mount
    setLoading(false);
  }, [setLoading]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await adminService.login(email, password);
      
      loginAction(result.moderator, result.token);
      
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = () => {
    logoutAction();
    // Zustand persist middleware handles localStorage cleanup automatically
  };

  const value: AdminAuthContextType = {
    moderator,
    token,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
