import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Moderator/Admin types
export interface Moderator {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  address?: string;
  phone: string;
  email: string;
  isActive: boolean;
  permissions: {
    canManageUsers: boolean;
    canManageVendors: boolean;
    canManageEvents: boolean;
    canManagePayments: boolean;
    canViewReports: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Admin store state interface
interface AdminState {
  moderator: Moderator | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Admin store actions interface
interface AdminActions {
  setModerator: (moderator: Moderator | null) => void;
  setToken: (token: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  login: (moderator: Moderator, token: string) => void;
  logout: () => void;
  updateModerator: (moderatorData: Partial<Moderator>) => void;
}

// Combined store type
type AdminStore = AdminState & AdminActions;

// Create the admin store with persistence
export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial state
      moderator: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setModerator: (moderator) => set({ moderator }),
      
      setToken: (token) => set({ token }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setLoading: (isLoading) => set({ isLoading }),

      // Login action - sets moderator, token, and authenticated state
      login: (moderator, token) => set({
        moderator,
        token,
        isAuthenticated: true,
        isLoading: false,
      }),

      // Logout action - clears all admin data
      logout: () => set({
        moderator: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }),

      // Update moderator data
      updateModerator: (moderatorData) => {
        const currentModerator = get().moderator;
        if (currentModerator) {
          set({ moderator: { ...currentModerator, ...moderatorData } });
        }
      },
    }),
    {
      name: 'admin-store', // unique name for localStorage key
      // Only persist moderator data and token, not loading states
      partialize: (state) => ({
        moderator: state.moderator,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access to specific parts of the store
export const useModerator = () => useAdminStore((state) => state.moderator);
export const useAdminToken = () => useAdminStore((state) => state.token);
export const useIsAdminAuthenticated = () => useAdminStore((state) => state.isAuthenticated);
export const useIsAdminLoading = () => useAdminStore((state) => state.isLoading);

// Action selectors - individual selectors to avoid object recreation
export const useSetModerator = () => useAdminStore((state) => state.setModerator);
export const useSetAdminToken = () => useAdminStore((state) => state.setToken);
export const useSetAdminAuthenticated = () => useAdminStore((state) => state.setAuthenticated);
export const useSetAdminLoading = () => useAdminStore((state) => state.setLoading);
export const useAdminLogin = () => useAdminStore((state) => state.login);
export const useAdminLogout = () => useAdminStore((state) => state.logout);
export const useUpdateModerator = () => useAdminStore((state) => state.updateModerator);
