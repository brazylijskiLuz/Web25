"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { Input } from "./input";
import { Send } from "lucide-react";

interface Message {
  id: string;
  title: string;
  description?: string;
  isUser?: boolean;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
}

export function ChatPanel({ messages, onSendMessage }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.isUser) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100/60 rounded-xl">
      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-3 pr-2 no-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Witaj w symulatorze emerytalnym!
              </h3>
              <p className="text-gray-600 text-sm max-w-sm">
                Zadaj pytanie dotyczące Twojej przyszłej emerytury tutaj.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              title={message.title}
              description={message.description}
              isUser={message.isUser}
            />
          ))
        )}
      </div>

      {/* Input area */}
      <div className="flex gap-3 items-center border-t pt-3 mb-4 bg-transparent">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Wpisz liczbę"
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleSend}
          className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputValue.trim()}
          aria-label="Wyślij wiadomość"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
