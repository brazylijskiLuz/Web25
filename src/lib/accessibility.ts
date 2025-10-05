/**
 * Accessibility utilities for WCAG 2.0 compliance
 */

// ARIA Live Region utilities
export const createLiveRegion = (id: string = "live-region"): HTMLElement => {
  let region = document.getElementById(id);

  if (!region) {
    region = document.createElement("div");
    region.id = id;
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    region.className = "live-region";
    document.body.appendChild(region);
  }

  return region;
};

export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
): void => {
  const region = createLiveRegion();
  region.setAttribute("aria-live", priority);
  region.textContent = message;

  // Clear after announcement
  setTimeout(() => {
    region.textContent = "";
  }, 1000);
};

// Focus management utilities
export const trapFocus = (element: HTMLElement): (() => void) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent): void => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Focus first element
  firstElement?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
};

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;

    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Keyboard navigation utilities
export const handleEscapeKey = (
  callback: () => void
): ((e: KeyboardEvent) => void) => {
  return (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      callback();
    }
  };
};

export const handleEnterOrSpaceKey = (
  callback: () => void
): ((e: KeyboardEvent) => void) => {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };
};

// Screen reader utilities
export const generateId = (): string => {
  return `id-${Math.random().toString(36).substr(2, 9)}`;
};

export const createAriaDescribedBy = (...ids: string[]): string => {
  return ids.filter(Boolean).join(" ");
};

// Form accessibility utilities
export const getFieldError = (fieldName: string): string | null => {
  const errorElement = document.getElementById(`${fieldName}-error`);
  return errorElement?.textContent || null;
};

export const setFieldError = (fieldName: string, message: string): void => {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.setAttribute("role", "alert");
  }
};

export const clearFieldError = (fieldName: string): void => {
  const errorElement = document.getElementById(`${fieldName}-error`);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.removeAttribute("role");
  }
};

// WCAG compliance checks
export const isWCAGCompliant = {
  contrastRatio: (ratio: number, level: "AA" | "AAA" = "AA"): boolean => {
    const thresholds = { AA: 4.5, AAA: 7 };
    return ratio >= thresholds[level];
  },

  fontSize: (size: number): boolean => {
    return size >= 16; // 16px is recommended minimum
  },

  touchTarget: (size: number): boolean => {
    return size >= 44; // 44px minimum touch target size
  },
};
