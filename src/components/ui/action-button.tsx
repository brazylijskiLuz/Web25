"use client";

interface ActionButtonProps {
  text: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
}

export function ActionButton({ text, onClick, variant = "outline" }: ActionButtonProps) {
  const getButtonStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-green-500 text-white hover:bg-green-600";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "outline":
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-full font-medium text-sm transition-colors duration-200
        ${getButtonStyles()}
      `}
    >
      {text}
    </button>
  );
}