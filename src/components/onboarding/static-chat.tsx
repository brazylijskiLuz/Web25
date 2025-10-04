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
  // {
  //   type: "bot",
  //   title: "Znajomość stanu konta ZUS",
  //   content: "Czy znasz stan swojego konta emerytalnego w ZUS?",
  // },
  // {
  //   type: "bot",
  //   title: "Środki na koncie ZUS",
  //   content:
  //     "Ile wynoszą zgromadzone środki na Twoim koncie emerytalnym w ZUS?",
  // },
  // {
  //   type: "bot",
  //   title: "Środki na subkoncie ZUS",
  //   content:
  //     "Ile wynoszą zgromadzone środki na Twoim subkoncie emerytalnym w ZUS?",
  // },
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

    // Check if this is the last question
    const isLastQuestion = currentMessageIndex >= CHAT_MESSAGES.length;

    if (isLastQuestion) {
      // Collect all user answers
      try {
        const allMessages = [...messages, newUserMessage];
        const userAnswers = allMessages
          .filter((msg) => msg.type === "user")
          .map((msg) => msg.content);

        // Map answers to fields
        // Index 0: Wysokość emerytury (pomijamy - nie ma w formacie)
        // Index 1: Wiek
        const wiek = userAnswers[1] || "";
        // Index 2: Płeć
        const plec = userAnswers[2] || "";
        // Index 3: Wynagrodzenie brutto
        const wynagrodzenie_brutto = userAnswers[3] || "";
        // Index 4: Rok rozpoczęcia pracy
        const rok_rozpoczecia_pracy = userAnswers[4] || "";
        // Index 5: Rok zakończenia pracy
        const rok_zakonczenia_pracy = userAnswers[5] || "";
        // Index 6: Przerwy w pracy
        const przerwy_w_pracy = userAnswers[6] || "";
        // Index 7: Liczba miesięcy przerw
        const przerwy_laczna_liczba_miesiecy = userAnswers[7] || "";

        // Format the data
        let formattedContent = "Dane użytkownika (obowiązkowe):\n";
        formattedContent += `wiek: ${wiek}\n`;
        formattedContent += `plec: "${plec}"\n`;
        formattedContent += `wynagrodzenie_brutto: ${wynagrodzenie_brutto}\n`;
        formattedContent += `rok_rozpoczecia_pracy: ${rok_rozpoczecia_pracy}\n`;
        formattedContent += `rok_zakonczenia_pracy: ${rok_zakonczenia_pracy}`;

        // Add optional data if present
        if (przerwy_w_pracy || przerwy_laczna_liczba_miesiecy) {
          formattedContent += "\n\nDane użytkownika (opcjonalne):";
          if (przerwy_w_pracy) {
            const przerwyValue =
              przerwy_w_pracy.toLowerCase().includes("tak") ||
              przerwy_w_pracy.toLowerCase().includes("yes");
            formattedContent += `\nprzerwy_w_pracy: ${przerwyValue}`;
          }
          if (przerwy_laczna_liczba_miesiecy) {
            formattedContent += `\nprzerwy_laczna_liczba_miesiecy: ${przerwy_laczna_liczba_miesiecy}`;
          }
        }

        const requestPayload = {
          messages: [
            {
              role: "user",
              content: formattedContent,
            },
          ],
        };

        console.log("Sending to API:", requestPayload);

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from chat API");
        }

        // Read the streaming response and log it
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullResponse += chunk;
          }
        }

        console.log("API Response:", fullResponse);
      } catch (error) {
        console.error("Error sending message to API:", error);
      } finally {
        setBotPending(false);
      }
    } else {
      // Show the next static bot message
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
