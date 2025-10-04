import { cn } from "@/lib/utils";
import { useState } from "react";
import { Message } from "./message";

interface MessageData {
  id: string;
  type: "bot" | "user";
  title?: string;
  content: string;
  timestamp: Date;
}

interface StaticChatProps {
  showNewContent: boolean;
}

// Wszystkie pytania i odpowiedzi w jednym miejscu
const CHAT_MESSAGES: Omit<MessageData, "id" | "timestamp">[] = [
  {
    type: "bot",
    title: "Witaj! 👋",
    content:
      "Cześć! Jestem Twoim asystentem emerytalnym. Pomogę Ci zaplanować przyszłość finansową. Jak się czujesz z myślą o emeryturze?",
  },
  {
    type: "bot",
    title: "Rozumiem Twoje obawy",
    content:
      "To całkowicie normalne! Większość ludzi ma podobne uczucia. Czy wiesz, że można to zmienić już dziś?",
  },
  {
    type: "bot",
    title: "Świetnie! 🎯",
    content:
      "Czy masz już jakieś oszczędności na emeryturę, czy dopiero zaczynasz planować?",
  },
];

export const StaticChat = ({ showNewContent }: StaticChatProps) => {
  const [messages, setMessages] = useState<MessageData[]>(() =>
    CHAT_MESSAGES.map((msg, index) => ({
      ...msg,
      id: `msg-${index}`,
      timestamp: new Date(),
    }))
  );
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newUserMessage: MessageData = {
      id: `user-${Date.now()}`,
      type: "user",
      content: userInput.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");

    // Symulacja odpowiedzi bota po 1 sekundzie
    setTimeout(() => {
      const botResponse: MessageData = {
        id: `bot-${Date.now()}`,
        type: "bot",
        title: "Dziękuję za odpowiedź!",
        content:
          "To bardzo pomocne informacje. Czy chciałbyś dowiedzieć się więcej o opcjach inwestycyjnych?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-1000 ease-in-out w-full max-w-4xl mx-auto px-4",
        showNewContent ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="w-full max-w-3xl h-[600px] flex flex-col">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              type={message.type}
              title={message.title}
              content={message.content}
              timestamp={message.timestamp}
            />
          ))}
        </div>

        {/* Input Area */}
        <div className="flex justify-end gap-2 pt-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Napisz wiadomość..."
            className="w-64 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Wyślij
          </button>
        </div>
      </div>
    </div>
  );
};
