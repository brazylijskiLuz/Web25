import { create } from "zustand";

interface FormattedStore {
  formatted: string;
  setFormatted: (value: string) => void;
  clearFormatted: () => void;
}

export const useFormatted = create<FormattedStore>((set) => ({
  formatted: "",
  setFormatted: (formatted) => set({ formatted }),
  clearFormatted: () => set({ formatted: "" }),
}));
