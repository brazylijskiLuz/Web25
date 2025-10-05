import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AccessibilitySettings {
  // Text scaling
  fontSize: "normal" | "large" | "extra-large";
  lineHeight: "normal" | "relaxed" | "loose";

  // Color contrast
  highContrast: boolean;
  darkMode: boolean;

  // Focus indicators
  focusIndicator: "default" | "high-visibility";

  // Motion preferences
  reducedMotion: boolean;

  // Screen reader support
  screenReaderOptimized: boolean;

  // Keyboard navigation
  keyboardNavigation: boolean;
}

interface AccessibilityStore extends AccessibilitySettings {
  isAccessibilityPanelOpen: boolean;

  // Actions
  setFontSize: (size: AccessibilitySettings["fontSize"]) => void;
  setLineHeight: (height: AccessibilitySettings["lineHeight"]) => void;
  setHighContrast: (enabled: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setFocusIndicator: (
    indicator: AccessibilitySettings["focusIndicator"]
  ) => void;
  setReducedMotion: (enabled: boolean) => void;
  setScreenReaderOptimized: (enabled: boolean) => void;
  setKeyboardNavigation: (enabled: boolean) => void;
  setAccessibilityPanelOpen: (open: boolean) => void;
  resetToDefaults: () => void;

  // Apply all settings to document
  applySettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "normal",
  lineHeight: "normal",
  highContrast: false,
  darkMode: false,
  focusIndicator: "default",
  reducedMotion: false,
  screenReaderOptimized: false,
  keyboardNavigation: true,
};

export const useAccessibility = create<AccessibilityStore>((set, get) => ({
  ...defaultSettings,
  isAccessibilityPanelOpen: false,

  setFontSize: (fontSize) => {
    set({ fontSize });
    get().applySettings();
  },

  setLineHeight: (lineHeight) => {
    set({ lineHeight });
    get().applySettings();
  },

  setHighContrast: (highContrast) => {
    set({ highContrast });
    get().applySettings();
  },

  setDarkMode: (darkMode) => {
    set({ darkMode });
    get().applySettings();
  },

  setFocusIndicator: (focusIndicator) => {
    set({ focusIndicator });
    get().applySettings();
  },

  setReducedMotion: (reducedMotion) => {
    set({ reducedMotion });
    get().applySettings();
  },

  setScreenReaderOptimized: (screenReaderOptimized) => {
    set({ screenReaderOptimized });
    get().applySettings();
  },

  setKeyboardNavigation: (keyboardNavigation) => {
    set({ keyboardNavigation });
    get().applySettings();
  },

  setAccessibilityPanelOpen: (isAccessibilityPanelOpen) => {
    set({ isAccessibilityPanelOpen });
  },

  resetToDefaults: () => {
    set({ ...defaultSettings });
    get().applySettings();
  },

  applySettings: () => {
    const settings = get();
    const root = document.documentElement;

    // Apply font size
    root.setAttribute("data-font-size", settings.fontSize);

    // Apply line height
    root.setAttribute("data-line-height", settings.lineHeight);

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    // Apply dark mode
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Apply focus indicator
    root.setAttribute("data-focus-indicator", settings.focusIndicator);

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add("reduced-motion");
    } else {
      root.classList.remove("reduced-motion");
    }

    // Apply screen reader optimization
    if (settings.screenReaderOptimized) {
      root.classList.add("screen-reader-optimized");
    } else {
      root.classList.remove("screen-reader-optimized");
    }

    // Apply keyboard navigation
    root.setAttribute(
      "data-keyboard-navigation",
      settings.keyboardNavigation.toString()
    );
  },
}));
