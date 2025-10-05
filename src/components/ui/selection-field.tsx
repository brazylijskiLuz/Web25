"use client";

import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  value: string | number;
  label: string;
}

interface SelectionFieldProps {
  title: string;
  description?: string;
  value: string | number;
  displayValue?: string;
  options: Option[];
  onChange: (value: string | number) => void;
  showInfo?: boolean;
  onInfoClick?: () => void;
}

export function SelectionField({
  title,
  description,
  value,
  displayValue,
  options,
  onChange,
  showInfo = true,
  onInfoClick,
}: SelectionFieldProps) {
  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      {/* Header with title and info icon */}
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-[20px] font-semibold text-gray-900">{title}</h3>
        {showInfo && (
          <button
            type="button"
            onClick={onInfoClick}
            className="p-1 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
            aria-label="Informacja"
          >
            <Info className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-[14px] text-primary font-medium mb-6">
          {description}
        </p>
      )}

      {/* Display value */}
      {displayValue && (
        <div className="text-[48px] font-bold text-primary mb-8">
          {displayValue}
        </div>
      )}

      {/* Options */}
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "px-6 py-3 rounded-full text-[16px cursor-pointer font-medium transition-all",
              "border-2",
              value === option.value
                ? "bg-primary text-white border-primary shadow-md"
                : "bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200 hover:border-gray-200"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
