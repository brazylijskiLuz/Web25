import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface MessageProps {
  id: string;
  type: "bot" | "user";
  title?: string;
  content: string;
}

export const Message = ({ type, title, content }: MessageProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "flex gap-3 transition-all duration-200 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        type === "user" ? "justify-end" : "justify-start"
      )}
    >
      {type === "bot" && (
        <Image
          src="/avatar.png"
          alt="Bot avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
          priority
        />
      )}

      <div className="max-w-xs lg:max-w-md px-4">
        {type === "bot" ? (
          <>
            {title && (
              <h4 className="font-semibold text-sm mb-1 text-gray-900">
                {title}
              </h4>
            )}
            <p className="text-sm leading-relaxed text-gray-700">{content}</p>
          </>
        ) : (
          <Input
            value={content}
            readOnly
            className="bg-gray-100 text-gray-800 cursor-default"
          />
        )}
      </div>
    </div>
  );
};
