import { create } from "zustand";

interface AvatarStore {
  avatarPosition: "right" | "left" | "middle";
  avatarAssistant: "hand-raised" | "pointing-right" | "pointing-left";
  setAvatarAssistant: (
    assistant: "hand-raised" | "pointing-right" | "pointing-left"
  ) => void;
  setAvatarPosition: (position: "right" | "left" | "middle") => void;
}

const useAvatar = create<AvatarStore>((set) => ({
  avatarPosition: "right",
  avatarAssistant: "pointing-left",
  setAvatarAssistant: (assistant) => set({ avatarAssistant: assistant }),
  setAvatarPosition: (position) => set({ avatarPosition: position }),
}));

export default useAvatar;
