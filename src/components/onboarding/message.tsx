import { cn } from "@/lib/utils";

interface MessageProps {
  id: string;
  type: "bot" | "user";
  title?: string;
  content: string;
  timestamp: Date;
}

export const Message = ({ type, title, content, timestamp }: MessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm">🤖</span>
        </div>
      )}

      <div className="max-w-xs lg:max-w-md bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3">
        {title && (
          <h4 className="font-semibold text-sm mb-1 text-gray-900">{title}</h4>
        )}
        <p className="text-sm leading-relaxed text-gray-700">{content}</p>
        <p className="text-xs opacity-70 mt-1 text-gray-500">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {type === "user" && (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-gray-600 text-sm">👤</span>
        </div>
      )}
    </div>
  );
};
