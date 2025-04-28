// darkModeStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DarkModeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
    }),
    {
      name: "darkmode-store", // ⚡️ dark mode uchun alohida localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
