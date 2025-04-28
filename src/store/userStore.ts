import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User tipi
interface User {
  id: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setUser: (accessToken: string, refreshToken: string, user: User) => void;
  updateTokens: (newAccessToken: string, newRefreshToken: string) => void;
  clearUser: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      darkMode: false,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setUser: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user }),

      updateTokens: (newAccessToken, newRefreshToken) =>
        set({ accessToken: newAccessToken, refreshToken: newRefreshToken }),

      clearUser: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "user-store-tour-admin",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
