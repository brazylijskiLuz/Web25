import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageData {
  id: string;
  type: "bot" | "user";
  title?: string;
  content: string;
}

interface StaticChatProps {
  showNewContent: boolean;
}

// Wszystkie pytania i odpowiedzi w jednym miejscu
const CHAT_MESSAGES: Omit<MessageData, "id">[] = [
  {
    type: "bot",
    title: "Witaj! 👋",
    content:
      "Cześć! Jakiej wysokości emeryturę chciałbyś/chciałabyś otrzymywać?",
  },
  {
    type: "bot",
    title: "Ile masz lat?",
    content: "Ile masz lat?",
  },
  {
    type: "bot",
    title: "Jaka jest Twoja płeć?",
    content: "Jaka jest Twoja płeć?",
  },
  {
    type: "bot",
    title: "Aktualne wynagrodzenie brutto",
    content: "Ile wynosi Twoje aktualne miesięczne wynagrodzenie brutto?",
  },
  {
    type: "bot",
    title: "Rok rozpoczęcia pracy",
    content: "W którym roku rozpocząłeś/rozpoczęłaś pracę?",
  },
  {
    type: "bot",
    title: "Rok przejścia na emeryturę",
    content: "W którym roku planujesz przejść na emeryturę?",
  },
  {
    type: "bot",
    title: "Przerwy w pracy zawodowej",
    content: "Czy miałeś/miałaś przerwy w pracy zawodowej?",
  },
  {
    type: "bot",
    title: "Czas trwania przerw w pracy",
    content: "Ile łącznie miesięcy trwały przerwy w Twojej pracy?",
  },
  {
    type: "bot",
    title: "Znajomość stanu konta ZUS",
    content: "Czy znasz stan swojego konta emerytalnego w ZUS?",
  },
  {
    type: "bot",
    title: "Środki na koncie ZUS",
    content:
      "Ile wynoszą zgromadzone środki na Twoim koncie emerytalnym w ZUS?",
  },
  {
    type: "bot",
    title: "Środki na subkoncie ZUS",
    content:
      "Ile wynoszą zgromadzone środki na Twoim subkoncie emerytalnym w ZUS?",
  },
];

export const StaticChat = ({ showNewContent }: StaticChatProps) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [userInput, setUserInput] = useState("");
  const [botPending, setBotPending] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Inicjalizuj pierwszą wiadomość bota
  useEffect(() => {
    if (showNewContent && messages.length === 0 && CHAT_MESSAGES.length > 0) {
      const firstMessage = CHAT_MESSAGES[0];
      const initialMessage: MessageData = {
        id: `bot-${Date.now()}`,
        type: firstMessage.type,
        title: firstMessage.title,
        content: firstMessage.content,
      };
      setMessages([initialMessage]);
      setCurrentMessageIndex(1);
    }
  }, [showNewContent, messages.length]);

  // Scroll to bottom whenever messages array changes
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    const newUserMessage: MessageData = {
      id: `user-${Date.now()}`,
      type: "user",
      content: userInput.trim(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setBotPending(true);

    setTimeout(() => {
      if (currentMessageIndex < CHAT_MESSAGES.length) {
        const nextBotMessage = CHAT_MESSAGES[currentMessageIndex];
        const botResponse: MessageData = {
          id: `bot-${Date.now()}`,
          type: nextBotMessage.type,
          title: nextBotMessage.title,
          content: nextBotMessage.content,
        };
        setMessages((prev) => [...prev, botResponse]);
        setCurrentMessageIndex((prev) => prev + 1);
        setBotPending(false);
      }
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
      {/* Top gradient overlay using inline styles */}
      <div
        className="absolute top-0 left-0 w-full h-[60px] z-20"
        style={{
          background:
            "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div className="w-full pb-12 relative max-w-3xl h-[500px] flex flex-col">
        {/* Messages Container */}
        <div
          className="overflow-y-auto no-scrollbar pt-10 space-y-4 transition-padding duration-500"
          id="chat-scroll-container"
          ref={chatScrollRef}
        >
          {messages.map((message) => (
            <Message
              key={message.id}
              id={message.id}
              type={message.type}
              title={message.title}
              content={message.content}
            />
          ))}
          {!botPending && (
            <div className="flex justify-end gap-2 pt-4">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Napisz wiadomość..."
                className="w-64"
              />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="flex justify-end gap-2 pt-4 transition-all duration-500"
          id="chat-input-container"
        >
          {/* Floating Next Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || botPending}
            className="absolute bottom-0 right-0"
          >
            Dalej
          </Button>
        </div>
      </div>
    </div>
  );
};
