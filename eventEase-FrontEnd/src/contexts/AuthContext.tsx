/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, verifyToken, logout } from '../services/authService';
import { useUserStore } from '../stores/userStore';

// Auth Context Types
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  needsEmailVerification: boolean;
  checkAuth: () => Promise<void>;
  handleLogout: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/about', '/contact', '/login', '/signup', '/verify-email'];

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [needsEmailVerification, setNeedsEmailVerification] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is public
  const isPublicRoute = (path: string): boolean => {
    return PUBLIC_ROUTES.includes(path);
  };

  // Check authentication status
  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // If it's a public route, only check auth if there's a token
      if (isPublicRoute(location.pathname)) {
        const hasToken = isAuthenticated();
        if (hasToken) {
          // Only verify token if we actually have one
          try {
            const isValid = await verifyToken();
            setIsLoggedIn(isValid);
            
            // Check if user needs email verification
            const { user } = useUserStore.getState();
            if (user && user.emailVerified === false) {
              setNeedsEmailVerification(true);
            } else {
              setNeedsEmailVerification(false);
            }
          } catch (error) {
            // Token is invalid, clear it but don't redirect on public routes
            logout();
            setIsLoggedIn(false);
            setNeedsEmailVerification(false);
          }
        } else {
          setIsLoggedIn(false);
          setNeedsEmailVerification(false);
        }
        return;
      }

      // For protected routes, require authentication
      const hasToken = isAuthenticated();
      
      if (!hasToken) {
        setIsLoggedIn(false);
        setNeedsEmailVerification(false);
        // Redirect to home page for protected routes
        navigate('/', { replace: true });
        return;
      }

      // Verify token with backend
      const isValid = await verifyToken();
      
      if (isValid) {
        setIsLoggedIn(true);
        
        // Check if user needs email verification
        const { user } = useUserStore.getState();
        if (user && user.emailVerified === false) {
          setNeedsEmailVerification(true);
          // If on protected route and needs verification, redirect to verification page
          if (!location.pathname.startsWith('/verify-email')) {
            navigate('/verify-email', { replace: true });
          }
          return;
        } else {
          setNeedsEmailVerification(false);
        }
      } else {
        setIsLoggedIn(false);
        setNeedsEmailVerification(false);
        logout();
        // Redirect to home page
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
      setNeedsEmailVerification(false);
      logout();
      // Only redirect if not on a public route
      if (!isPublicRoute(location.pathname)) {
        navigate('/', { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = (): void => {
    logout();
    setIsLoggedIn(false);
    setNeedsEmailVerification(false);
    navigate('/', { replace: true });
  };

  // Check auth on component mount and when location changes
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  // Check auth when localStorage changes (from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const contextValue: AuthContextType = {
    isLoggedIn,
    isLoading,
    needsEmailVerification,
    checkAuth,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component (optional - for additional route protection)
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = <div>Loading...</div> 
}) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isLoggedIn) {
    return null; // Will be redirected by AuthProvider
  }

  return <>{children}</>;
};
