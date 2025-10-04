import { create } from "zustand";

interface AvatarStore {
  avatarPosition: "right" | "left" | "middle" | "pointing-up";
  avatarAssistant:
    | "hand-raised"
    | "pointing-right"
    | "pointing-left"
    | "pointing-up";
  avatarSize: "small" | "medium" | "large";
  setAvatarAssistant: (
    assistant:
      | "hand-raised"
      | "pointing-right"
      | "pointing-left"
      | "pointing-up"
  ) => void;
  setAvatarPosition: (
    position: "right" | "left" | "middle" | "pointing-up"
  ) => void;
  setAvatarSize: (size: "small" | "medium" | "large") => void;
}

const useAvatar = create<AvatarStore>((set) => ({
  avatarPosition: "right",
  avatarAssistant: "pointing-left",
  avatarSize: "medium",
  setAvatarAssistant: (assistant) => set({ avatarAssistant: assistant }),
  setAvatarPosition: (position) => set({ avatarPosition: position }),
  setAvatarSize: (size) => set({ avatarSize: size }),
}));

export default useAvatar;
