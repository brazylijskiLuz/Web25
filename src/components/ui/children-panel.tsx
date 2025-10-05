"use client";

import { Info, Users } from "lucide-react";
import { ActionButton } from "./action-button";
import { Button } from "./button";

interface ChildrenPanelProps {
  numberOfChildren: number;
  onNumberOfChildrenChange: (count: number) => void;
  onAddToChat?: (message: string) => void;
}

export function ChildrenPanel({ 
  numberOfChildren, 
  onNumberOfChildrenChange, 
  onAddToChat 
}: ChildrenPanelProps) {
  const handleChildrenImpact = () => {
    const message = "Jak liczba dzieci wpływa na wysokość emerytury?";
    onAddToChat?.(message);
  };

  const handleOptimizeForChildren = () => {
    const message = `Jak zoptymalizować emeryturę mając ${numberOfChildren} dzieci?`;
    onAddToChat?.(message);
  };

  const handleChildrenBenefits = () => {
    const message = "Jakie są dodatkowe świadczenia emerytalne dla rodziców?";
    onAddToChat?.(message);
  };

  const incrementChildren = () => {
    onNumberOfChildrenChange(numberOfChildren + 1);
  };

  const decrementChildren = () => {
    if (numberOfChildren > 0) {
      onNumberOfChildrenChange(numberOfChildren - 1);
    }
  };

  return (
    <div className="w-full rounded-2xl p-6 bg-white shadow-2x mt-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="items-center flex font-bold text-[24px]">
          <Users className="w-6 h-6 mr-2 text-primary" />
          Ilość dzieci
          <Info className="w-4 h-4 ml-2 text-gray-500" />
        </h2>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <p className="text-sm text-gray-600 mb-4">
            Tutaj opis jak to wpływa na kwotę wyliczonej emerytury
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={decrementChildren}
            disabled={numberOfChildren <= 0}
          >
            -
          </Button>
          <div className="text-[48px] font-bold text-primary leading-none min-w-[80px] text-center">
            {numberOfChildren}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={incrementChildren}
          >
            +
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Wpływ na emeryturę:</strong> Każde dziecko może wpływać na wysokość emerytury poprzez:
        </p>
        <ul className="text-sm text-blue-700 mt-2 ml-4 list-disc">
          <li>Okresy opieki nad dzieckiem (do 4 lat na dziecko)</li>
          <li>Dodatkowe składki emerytalne w okresach wychowywania dzieci</li>
          <li>Możliwość wcześniejszego przejścia na emeryturę</li>
        </ul>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <ActionButton 
          text="Jak dzieci wpływają na emeryturę?" 
          onClick={handleChildrenImpact}
          variant="primary"
        />
        <ActionButton 
          text="Optymalizacja dla rodziców" 
          onClick={handleOptimizeForChildren}
          variant="outline"
        />
        <ActionButton 
          text="Dodatkowe świadczenia" 
          onClick={handleChildrenBenefits}
          variant="outline"
        />
      </div>
    </div>
  );
}