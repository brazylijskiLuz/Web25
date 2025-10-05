"use client";

import { Info } from "lucide-react";
import { ActionButton } from "./action-button";

interface RetirementQuotaProps {
  expectedAmount: number;
  calculatedAmount: number;
  onAddToChat?: (message: string) => void;
}

export function RetirementQuota({ expectedAmount, calculatedAmount, onAddToChat }: RetirementQuotaProps) {
  const handleIncreaseRetirement = () => {
    const message = "Jak mogę zwiększyć moją obliczaną emeryturę?";
    onAddToChat?.(message);
  };

  const handleHowCalculated = () => {
    const message = "Opowiedz mi więcej jak się przelicza emerytura?";
    onAddToChat?.(message);
  };

  const handleOptimizePlan = () => {
    const message = "Pomóż mi zoptymalizować mój plan emerytalny";
    onAddToChat?.(message);
  };

  return (
    <div className="w-full rounded-2xl p-6 bg-white shadow-2x mt-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="items-center flex font-bold text-[24px]">
          Kwota emerytury
          <Info className="w-4 h-4 ml-2 text-gray-500" />
        </h2>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-[48px] font-bold text-green-600 leading-none">
            {Math.floor(expectedAmount).toLocaleString('pl-PL')} zł
          </div>
          <div className="text-[16px] font-medium text-green-600 mt-1">
            OCZEKIWANA
          </div>
        </div>
        
        <div className="flex flex-col text-right">
          <div className="text-[48px] font-bold text-blue-600 leading-none">
            {Math.floor(calculatedAmount).toLocaleString('pl-PL')} zł
          </div>
          <div className="text-[16px] font-medium text-blue-600 mt-1">
            OBLICZONA
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6 flex-wrap">
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
    </div>
  );
}