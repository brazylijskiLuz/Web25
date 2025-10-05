"use client";

import { ActionButton } from "./action-button";

export function ActionButtonsGroup() {
  const handleIncreaseRetirement = () => {
    console.log("How to increase retirement clicked");
  };

  const handleHowCalculated = () => {
    console.log("How it's calculated clicked");
  };

  const handleOptimizePlan = () => {
    console.log("Optimize plan clicked");
  };

  return (
    <div className="flex gap-4 mt-6 flex-wrap">
      <ActionButton 
        text="Jak zwiększyć emeryturę?" 
        onClick={handleIncreaseRetirement}
        variant="primary"
      />
      <ActionButton 
        text="Jak się to przelicza?" 
        onClick={handleHowCalculated}
        variant="outline"
      />
      <ActionButton 
        text="Zoptymalizuj mój plan" 
        onClick={handleOptimizePlan}
        variant="outline"
      />
    </div>
  );
}