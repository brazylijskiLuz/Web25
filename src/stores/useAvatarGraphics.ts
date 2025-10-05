import { create } from "zustand";

interface AvatarGraphicsStore {
  hidden: boolean;
  hide: () => void;
  show: () => void;
}

export const useAvatarGraphics = create<AvatarGraphicsStore>((set) => ({
  hidden: false,
  hide: () => set({ hidden: true }),
  show: () => set({ hidden: false }),
}));
