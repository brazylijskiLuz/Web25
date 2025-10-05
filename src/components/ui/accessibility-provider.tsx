"use client";

import React, { useEffect } from "react";
import { useAccessibility } from "@/stores/useAccessibility";

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const { applySettings } = useAccessibility();

  useEffect(() => {
    // Apply accessibility settings on mount
    applySettings();
  }, [applySettings]);

  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      applySettings();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [applySettings]);

  return <>{children}</>;
};
