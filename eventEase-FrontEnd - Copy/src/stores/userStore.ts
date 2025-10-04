import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User and Vendor types (matching the authService types)
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'vendor' | 'admin';
  email: string;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: number;
  userId: number;
  businessName: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  capacity: number;
  websiteUrl?: string;
  businessRegistrationNumber: string;
  businessLicenseNumber: string;
  createdAt: string;
  updatedAt: string;
}

// User store state interface
interface UserState {
  user: User | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// User store actions interface
interface UserActions {
  setUser: (user: User | null) => void;
  setVendor: (vendor: Vendor | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  login: (user: User, vendor?: Vendor) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateVendor: (vendorData: Partial<Vendor>) => void;
}

// Combined store type
type UserStore = UserState & UserActions;

// Create the user store with persistence
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      vendor: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setUser: (user) => set({ user }),
      
      setVendor: (vendor) => set({ vendor }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setLoading: (isLoading) => set({ isLoading }),

      // Login action - sets user, vendor (if applicable), and authenticated state
      login: (user, vendor) => set({
        user,
        vendor: vendor || null,
        isAuthenticated: true,
        isLoading: false,
      }),

      // Logout action - clears all user data
      logout: () => set({
        user: null,
        vendor: null,
        isAuthenticated: false,
        isLoading: false,
      }),

      // Update user data
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },

      // Update vendor data
      updateVendor: (vendorData) => {
        const currentVendor = get().vendor;
        if (currentVendor) {
          set({ vendor: { ...currentVendor, ...vendorData } });
        }
      },
    }),
    {
      name: 'user-store', // unique name for localStorage key
      // Only persist user data, not loading states
      partialize: (state) => ({
        user: state.user,
        vendor: state.vendor,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selectors for easier access to specific parts of the store
export const useUser = () => useUserStore((state) => state.user);
export const useVendor = () => useUserStore((state) => state.vendor);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsLoading = () => useUserStore((state) => state.isLoading);

// Action selectors - individual selectors to avoid object recreation
export const useSetUser = () => useUserStore((state) => state.setUser);
export const useSetVendor = () => useUserStore((state) => state.setVendor);
export const useSetAuthenticated = () => useUserStore((state) => state.setAuthenticated);
export const useSetLoading = () => useUserStore((state) => state.setLoading);
export const useLogin = () => useUserStore((state) => state.login);
export const useLogout = () => useUserStore((state) => state.logout);
export const useUpdateUser = () => useUserStore((state) => state.updateUser);
export const useUpdateVendor = () => useUserStore((state) => state.updateVendor);
