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
  options?: { label: string; value: string }[];
  inputType?: "text" | "number";
}

interface StaticChatProps {
  showNewContent: boolean;
}

const CHAT_MESSAGES: Omit<MessageData, "id">[] = [
  {
    type: "bot",
    title: "Witaj! 👋",
    content:
      "Cześć! Jakiej wysokości emeryturę chciałbyś/chciałabyś otrzymywać?",
    inputType: "number",
  },
  {
    type: "bot",
    title: "Ile masz lat?",
    content: "Ile masz lat?",
    inputType: "number",
  },
  {
    type: "bot",
    title: "Jaka jest Twoja płeć?",
    content: "Jaka jest Twoja płeć?",
    options: [
      { label: "Kobieta", value: "kobieta" },
      { label: "Mężczyzna", value: "mężczyzna" },
    ],
    inputType: "text",
  },
  {
    type: "bot",
    title: "Aktualne wynagrodzenie brutto",
    content: "Ile wynosi Twoje aktualne miesięczne wynagrodzenie brutto?",
    inputType: "number",
  },
  {
    type: "bot",
    title: "Rok rozpoczęcia pracy",
    content: "W którym roku rozpocząłeś/rozpoczęłaś pracę?",
    inputType: "number",
  },
  {
    type: "bot",
    title: "Rok przejścia na emeryturę",
    content: "W którym roku planujesz przejść na emeryturę?",
    inputType: "number",
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
    inputType: "number",
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
    inputType: "number",
  },
  {
    type: "bot",
    title: "Środki na subkoncie ZUS",
    content:
      "Ile wynoszą zgromadzone środki na Twoim subkoncie emerytalnym w ZUS?",
    inputType: "number",
  },
];

export const StaticChat = ({ showNewContent }: StaticChatProps) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [userInput, setUserInput] = useState("");
  const [botPending, setBotPending] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    const container = chatScrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight - 20,
      behavior: "smooth",
    });
  };

  // Inicjalizuj pierwszą wiadomość bota
  useEffect(() => {
    if (showNewContent && messages.length === 0 && CHAT_MESSAGES.length > 0) {
      const firstMessage = CHAT_MESSAGES[0];
      const initialMessage: MessageData = {
        id: `bot-${Date.now()}`,
        type: firstMessage.type,
        title: firstMessage.title,
        content: firstMessage.content,
        inputType: firstMessage.inputType,
        options: firstMessage.options,
      };
      setMessages([initialMessage]);
      setCurrentMessageIndex(1);
    }
  }, [showNewContent, messages.length]);

  const handleSendMessage = (label?: string) => {
    const content = (label ?? userInput).toString().trim();
    if (!content) return;

    const newUserMessage: MessageData = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
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
          inputType: nextBotMessage.inputType,
          options: nextBotMessage.options,
        };
        setMessages((prev) => [...prev, botResponse]);
        setCurrentMessageIndex((prev) => prev + 1);
        setBotPending(false);
        setTimeout(scrollToBottom, 180);
      }
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const lastMessage = messages[messages.length - 1] as MessageData | undefined;
  const hasOptions =
    !botPending &&
    lastMessage?.type === "bot" &&
    Boolean(lastMessage.options && lastMessage.options.length);
  console.log(hasOptions, "has options", lastMessage?.options);
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
      <div className="w-full pb-12 relative max-w-3xl h-[480px] flex flex-col">
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

          {/* Option buttons */}
          {hasOptions && (
            <div className="flex gap-2 flex-wrap pt-2 justify-end">
              {lastMessage!.options!.map((opt) => (
                <Button
                  key={opt.value}
                  variant="secondary"
                  onClick={() => {
                    handleSendMessage(opt.label);
                  }}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          )}
          {!botPending && !hasOptions && (
            <div className="flex justify-end gap-2 pt-4">
              <Input
                type={lastMessage?.inputType ?? "text"}
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
        <div className="flex justify-end gap-2 pt-4" id="chat-input-container">
          {/* Floating Next Button */}
          <Button
            onClick={() => handleSendMessage()}
            disabled={!userInput.trim() || botPending || hasOptions}
            className="absolute bottom-0 right-0"
          >
            Dalej
          </Button>
        </div>
      </div>
    </div>
  );
};
