"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAccessibility } from "@/stores/useAccessibility";
import {
  X,
  Eye,
  Type,
  Focus,
  MousePointer,
  Volume2,
  Keyboard,
} from "lucide-react";

export const AccessibilityPanel: React.FC = () => {
  const {
    fontSize,
    lineHeight,
    highContrast,
    darkMode,
    focusIndicator,
    reducedMotion,
    screenReaderOptimized,
    keyboardNavigation,
    isAccessibilityPanelOpen,
    setFontSize,
    setLineHeight,
    setHighContrast,
    setDarkMode,
    setFocusIndicator,
    setReducedMotion,
    setScreenReaderOptimized,
    setKeyboardNavigation,
    setAccessibilityPanelOpen,
    resetToDefaults,
  } = useAccessibility();

  if (!isAccessibilityPanelOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <CardTitle>Ustawienia Dostępności WCAG 2.0</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAccessibilityPanelOpen(false)}
              aria-label="Zamknij panel dostępności"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Dostosuj stronę do swoich potrzeb zgodnie ze standardami WCAG 2.0
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Rozmiar tekstu</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "large", "extra-large"] as const).map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFontSize(size)}
                  className="text-xs"
                >
                  {size === "normal" && "Normalny"}
                  {size === "large" && "Duży"}
                  {size === "extra-large" && "Bardzo duży"}
                </Button>
              ))}
            </div>
          </div>

          {/* Line Height */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Wysokość linii</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["normal", "relaxed", "loose"] as const).map((height) => (
                <Button
                  key={height}
                  variant={lineHeight === height ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLineHeight(height)}
                  className="text-xs"
                >
                  {height === "normal" && "Normalna"}
                  {height === "relaxed" && "Luźna"}
                  {height === "loose" && "Bardzo luźna"}
                </Button>
              ))}
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Ustawienia wizualne</h3>
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Wysoki kontrast</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Tryb ciemny</span>
              </label>
            </div>
          </div>

          {/* Focus Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Focus className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Wskaźniki fokusa</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["default", "high-visibility"] as const).map((indicator) => (
                <Button
                  key={indicator}
                  variant={focusIndicator === indicator ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFocusIndicator(indicator)}
                  className="text-xs"
                >
                  {indicator === "default" && "Standardowy"}
                  {indicator === "high-visibility" && "Wysoka widoczność"}
                </Button>
              ))}
            </div>
          </div>

          {/* Motion Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Animacje</h3>
            </div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Ograniczone animacje</span>
            </label>
          </div>

          {/* Screen Reader Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Czytnik ekranu</h3>
            </div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={screenReaderOptimized}
                onChange={(e) => setScreenReaderOptimized(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Optymalizacja dla czytnika ekranu</span>
            </label>
          </div>

          {/* Keyboard Navigation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Nawigacja klawiatura</h3>
            </div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={keyboardNavigation}
                onChange={(e) => setKeyboardNavigation(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>Włączona nawigacja klawiaturą</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="text-sm"
            >
              Resetuj do domyślnych
            </Button>
            <Button
              onClick={() => setAccessibilityPanelOpen(false)}
              className="text-sm"
            >
              Zamknij
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
