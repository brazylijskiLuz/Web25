import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getRandomFact } from "@/lib/facts";
import { Message } from "./message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

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
  onResultsReceived?: (data: any) => void;
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
    // Zmieniono content aby różnił się od title
    content: "Podaj, proszę, swój wiek.",
    inputType: "number",
  },
  {
    type: "bot",
    title: "Jaka jest Twoja płeć?",
    // Zmieniono content aby różnił się od title
    content: "Jaką posiadasz płeć?",
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
  // {
  //   type: "bot",
  //   title: "Rok przejścia na emeryturę",
  //   content: "W którym roku planujesz przejść na emeryturę?",
  //   inputType: "number",
  // },
  {
    type: "bot",
    title: "Obliczyć zwolnienia lekarskie?",
    content:
      "Czy chcesz, aby zwolnienia lekarskie zostały obliczone przez nasz AI kalkulator, czy przyjmujesz domyślną (średnią) wartość?",
    options: [
      { label: "Oblicz AI", value: "ai" },
      { label: "Domyślna", value: "domyslna" },
    ],
  },
  // Branching will happen after this question based on user choice (AI vs Domyślna)
];

// Additional questions for AI path
const AI_ADDITIONAL_MESSAGES: Omit<MessageData, "id">[] = [
  {
    type: "bot",
    title: "Ryzyko zawodowe",
    content:
      "Czy Twoja praca wiąże się z podwyższonym ryzykiem uszczerbku na zdrowiu?",
    options: [
      { label: "Tak", value: "tak" },
      { label: "Nie", value: "nie" },
    ],
  },
  {
    type: "bot",
    title: "Opieka nad bliskimi",
    content:
      "Czy opiekujesz się starszym lub przewlekle chorym członkiem rodziny?",
    options: [
      { label: "Tak", value: "tak" },
      { label: "Nie", value: "nie" },
    ],
  },
  {
    type: "bot",
    title: "Praca zdalna podczas choroby",
    content:
      "Czy Twoja praca pozwala Ci pracować zdalnie lub elastycznie w czasie choroby?",
    options: [
      { label: "Tak", value: "tak" },
      { label: "Nie", value: "nie" },
    ],
  },
];

// Helper to extend message queue dynamically
function insertQuestions(
  queue: MessageData[],
  newQs: Omit<MessageData, "id">[]
) {
  const now = Date.now();
  return [
    ...queue,
    ...newQs.map((m, idx) => ({
      ...m,
      id: `bot-${now + idx}`,
    })),
  ];
}

const MIN_LOADING_TIME_MS = 4000;
// Pension thresholds for 2025 (PLN)
const MIN_PENSION = 1878.91;
const AVG_PENSION = 4190;
const HIGH_PENSION = 7000;

// Static hex approximations of --primary and --secondary from globals.css (≈2025 theme)
const PRIMARY_HEX = "#00993F"; // approx. oklch(0.596 0.1699 148.6)
const SECONDARY_HEX = "#C1D9F6"; // approx. oklch(0.9363 0.0273 160.86)

// Tooltip descriptions for each pension group
const GROUP_DESCRIPTIONS: Record<string, string> = {
  min: "Emerytury minimalne: świadczenia gwarantowane po spełnieniu lat pracy.",
  "min-śr":
    "Emerytury pomiędzy minimalną a średnią – standardowe przebiegi kariery.",
  "> śr": "Powyżej średniej: dłuższa aktywność zawodowa i wyższe składki.",
  wys: "Bardzo wysokie świadczenia (>7 000 zł).", // 'wys' stands for high
  Cel: "Kwota, którą chciałbyś/chciałabyś otrzymywać.",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const name: string = item.payload.name;
  const value: number = item.value;
  return (
    <div className="rounded-md border bg-card p-3 text-xs shadow">
      <p className="font-medium mb-1">
        {name}: {value.toLocaleString()} zł
      </p>
      <p className="text-muted-foreground max-w-[200px] whitespace-pre-line">
        {GROUP_DESCRIPTIONS[name]}
      </p>
    </div>
  );
};

export const StaticChat = ({
  showNewContent,
  onResultsReceived,
}: StaticChatProps) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [userInput, setUserInput] = useState("");
  const [botPending, setBotPending] = useState(false);
  const [chatFinished, setChatFinished] = useState(false); // indicates that all questions are answered
  const [pendingResults, setPendingResults] = useState<any>(null); // stores API results until user proceeds
  const [proceedClicked, setProceedClicked] = useState(false); // user clicked "Dalej" after chat finished
  const hasForwarded = useRef(false);
  const loadingStartRef = useRef<number | null>(null);
  const [desiredPension, setDesiredPension] = useState<number | null>(null);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [additionalQueue, setAdditionalQueue] = useState<
    Omit<MessageData, "id">[]
  >([]);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  // No need for dynamic theme resolution – we use static approximations.

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

  // Scroll once the summary/chart placeholder appears
  useEffect(() => {
    if (chatFinished) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [chatFinished]);

  // When both flags satisfied forward results
  useEffect(() => {
    if (
      !hasForwarded.current &&
      proceedClicked &&
      pendingResults &&
      onResultsReceived
    ) {
      const elapsed = loadingStartRef.current
        ? Date.now() - loadingStartRef.current
        : 0;
      const remaining = MIN_LOADING_TIME_MS - elapsed;
      if (remaining <= 0) {
        hasForwarded.current = true;
        onResultsReceived(pendingResults);
      } else {
        const timer = setTimeout(() => {
          if (!hasForwarded.current) {
            hasForwarded.current = true;
            onResultsReceived(pendingResults);
          }
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [proceedClicked, pendingResults, onResultsReceived]);

  const handleSendMessage = async (label?: string) => {
    const content = (label ?? userInput).toString().trim();
    if (!content) return;

    // Determine if we need to extend additionalQueue before proceeding
    let newAdditionalQueue = [...additionalQueue];
    const prevBot = messages[messages.length - 1];
    if (
      prevBot?.title?.startsWith("Obliczyć zwolnienia") &&
      label // option click path
    ) {
      if (label.toLowerCase().includes("ai")) {
        if (additionalQueue.length === 0) {
          newAdditionalQueue = AI_ADDITIONAL_MESSAGES;
          setAdditionalQueue(newAdditionalQueue);
        }
      }
    }

    const fullQueue = [...CHAT_MESSAGES, ...newAdditionalQueue];

    const newUserMessage: MessageData = {
      id: `user-${Date.now()}`,
      type: "user",
      content,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setBotPending(true);

    // Note: fullQueue computed above with potential additions

    const isLastQuestion = currentMessageIndex >= fullQueue.length;
    if (isLastQuestion) {
      // We don't want to block the "Dalej" button in summary view
      setBotPending(false);
    }
    if (isLastQuestion) {
      setChatFinished(true);
    }
    // Check if this is the last question (already calculated above)
    if (isLastQuestion) {
      // Collect all user answers
      try {
        const allMessages = [...messages, newUserMessage];
        const userAnswers = allMessages
          .filter((msg) => msg.type === "user")
          .map((msg) => msg.content);

        // Map answers to fields
        // Index 0: Wysokość emerytury (pomijamy - nie ma w formacie)
        const desired = userAnswers[0] || "";
        setDesiredPension(Number(desired));
        // Index 1: Wiek
        const wiek = userAnswers[1] || "";
        // Index 2: Płeć
        const plec = userAnswers[2] || "";
        // Index 3: Wynagrodzenie brutto
        const wynagrodzenie_brutto = userAnswers[3] || "";
        // Index 4: Rok rozpoczęcia pracy
        const rok_rozpoczecia_pracy = userAnswers[4] || "";
        // Index 5: Rok zakończenia pracy
        const rok_zakonczenia_pracy =
          Number.parseFloat(userAnswers[4]) + 25 || "";
        // Index 6: Przerwy w pracy
        const przerwy_w_pracy = userAnswers[5] || "";
        // Index 7: Liczba miesięcy przerw
        const przerwy_laczna_liczba_miesiecy = userAnswers[6] || "";

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

        // Read the streaming response and parse it
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

        // Parse the JSON response
        try {
          // The streaming response might have extra data, so we need to extract just the JSON
          // Find the last complete JSON object in the response
          const jsonMatch = fullResponse.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsedData = JSON.parse(jsonMatch[0]);
            console.log("Parsed data:", parsedData);

            // Validate that the parsed data has the required fields
            if (
              parsedData &&
              typeof parsedData === "object" &&
              "emerytura_nominalna_miesieczna_brutto" in parsedData &&
              "kapital_emerytalny" in parsedData
            ) {
              // Call the callback with the parsed data
              // Store the results; we'll pass them to the parent only after the user clicks "Dalej"
              setPendingResults(parsedData);
            } else {
              console.error(
                "Parsed data is missing required fields:",
                parsedData
              );
              // Show error message to user
              const errorMessage: MessageData = {
                id: `bot-error-${Date.now()}`,
                type: "bot",
                title: "Błąd",
                content:
                  "Przepraszamy, wystąpił błąd podczas obliczania emerytury. Spróbuj ponownie.",
              };
              setMessages((prev) => [...prev, errorMessage]);
            }
          } else {
            console.error("No JSON found in response:", fullResponse);
            // Show error message to user
            const errorMessage: MessageData = {
              id: `bot-error-${Date.now()}`,
              type: "bot",
              title: "Błąd",
              content:
                "Przepraszamy, nie udało się przetworzyć odpowiedzi. Spróbuj ponownie.",
            };
            setMessages((prev) => [...prev, errorMessage]);
          }
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          // Show error message to user
          const errorMessage: MessageData = {
            id: `bot-error-${Date.now()}`,
            type: "bot",
            title: "Błąd",
            content:
              "Przepraszamy, wystąpił błąd techniczny. Spróbuj ponownie.",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error) {
        console.error("Error sending message to API:", error);
      } finally {
        setBotPending(false);
      }
    } else {
      // Show the next static bot message
      if (currentMessageIndex < fullQueue.length) {
        const nextBotMessage = fullQueue[currentMessageIndex];
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
    }
  };
  // Handle the "Dalej" click after chat completion
  const handleProceed = () => {
    setProceedClicked(true);
    // record loading start time
    if (loadingStartRef.current === null) {
      loadingStartRef.current = Date.now();
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

  // Show loading modal once user clicked "Dalej" and until we forward the results
  const showSpinner = proceedClicked && !hasForwarded.current;

  // Progress bar state (irregular increments)
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSpinner) {
      // reset when modal hidden
      setProgress(0);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        // If we already have results pending, jump to 100
        if (hasForwarded.current) return 100;
        // random increment between 3 and 7 (aim ~6s total)
        const increment = 3 + Math.random() * 4;
        const next = Math.min(prev + increment, 92); // cap at 92% until done
        return next;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [showSpinner]);

  // Once data forwarding completes, fill progress bar quickly
  useEffect(() => {
    if (hasForwarded.current) {
      setProgress(100);
    }
  }, [hasForwarded.current]);

  const randomFact = useMemo(() => getRandomFact(), []);

  // When loading, replace chat UI with standalone progress screen
  if (showSpinner) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background/90">
        <div className="bg-background rounded-md p-6 flex flex-col max-w-80 items-center gap-4 shadow-lg min-w-[260px]">
          <Progress
            value={progress}
            className="w-64 transition-all duration-700"
          />
          <p className="text-sm text-muted-foreground text-center">
            {randomFact}
          </p>
        </div>
      </div>
    );
  }
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

          {/* Placeholder view displayed after chat is finished */}
          {chatFinished && (
            <div className="w-full h-72 rounded-md flex items-start justify-center mt-4 py-4 bg-transparent">
              <Message
                id={`bot-${Date.now()}`}
                type="bot"
                title="Podsumowanie zwolnień"
                content="Wygląda na to, że przez całe życie będziesz 14 miesięcy na urlopie lekarskim. Sprawdź, w której grupie wysokości emerytur się znajdujesz"
              />
              {desiredPension ? (
                (() => {
                  const chartData = [
                    { name: "min", value: MIN_PENSION },
                    {
                      name: "min-śr",
                      value: Math.round((MIN_PENSION + AVG_PENSION) / 2),
                    },
                    { name: "> śr", value: AVG_PENSION },
                    { name: "wys", value: HIGH_PENSION },
                    { name: "Cel", value: desiredPension },
                  ];
                  return (
                    <ChartContainer
                      config={{ bar: { color: "#3f84d2", label: "Kwota" } }}
                      className="w-full h-full"
                    >
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<CustomTooltip />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar dataKey="value" name="Kwota">
                          {chartData.map((_, idx) => (
                            <Cell
                              key={`cell-${idx}`}
                              fill={
                                idx === chartData.length - 1
                                  ? PRIMARY_HEX
                                  : SECONDARY_HEX
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  );
                })()
              ) : (
                <span className="text-sm text-muted-foreground">
                  Ładowanie danych...
                </span>
              )}
            </div>
          )}
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
          {!botPending &&
            !hasOptions &&
            (!chatFinished ? (
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
            ) : null)}
        </div>

        {/* Input Area */}
        <div className="flex justify-end gap-2 pt-4" id="chat-input-container">
          {/* Floating Next Button */}
          {!chatFinished ? (
            <Button
              onClick={() => handleSendMessage()}
              disabled={!userInput.trim() || botPending || hasOptions}
              className="absolute bottom-0 right-0"
            >
              Dalej
            </Button>
          ) : (
            <Button
              onClick={handleProceed}
              disabled={botPending}
              className="absolute bottom-0 right-0"
            >
              Dalej
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
