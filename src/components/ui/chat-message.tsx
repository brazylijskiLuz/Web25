"use client";

import Image from "next/image";

interface ChatMessageProps {
  title: string;
  description?: string;
  avatarSrc?: string;
  isUser?: boolean;
}

export function ChatMessage({
  title,
  description,
  avatarSrc = "/avatar.png",
  isUser = false,
}: ChatMessageProps) {
  if (isUser) {
    // User message - right aligned, no avatar
    return (
      <div className="flex justify-end mb-6">
        <div className="max-w-[80%]">
          <div className="bg-primary text-white rounded-2xl px-6 py-4">
            <p className="text-[16px] leading-relaxed">{title}</p>
          </div>
        </div>
      </div>
    );
  }

  // Bot message - left aligned with avatar
  return (
    <div className="flex gap-4 mb-6">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-green-500">
          <Image
            src={avatarSrc}
            alt="Avatar"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1">
        <h3 className="text-[20px] font-bold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-[16px] text-gray-700 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
