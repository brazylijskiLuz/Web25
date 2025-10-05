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
  userData?: any;
  resultsData?: any;
}

export function ChatPanel({ messages, onSendMessage, userData, resultsData }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [internalMessages, setInternalMessages] = useState<Message[]>(messages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  };

  // Initialize internal messages with external messages only once
  useEffect(() => {
    if (messages.length > 0 && internalMessages.length === 0) {
      setInternalMessages(messages);
    }
  }, [messages, internalMessages.length]);

  // Handle new messages from external source (like button clicks)
  useEffect(() => {
    if (messages.length > internalMessages.length) {
      const newMessages = messages.slice(internalMessages.length);
      const updatedMessages = [...internalMessages, ...newMessages];
      setInternalMessages(updatedMessages);
      
      // Check if the last new message is from user - if so, trigger API call
      const lastNewMessage = newMessages[newMessages.length - 1];
      if (lastNewMessage?.isUser && !isLoading) {
        // Trigger AI response for the new user message
        handleApiCall(updatedMessages);
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const lastMessage = internalMessages[internalMessages.length - 1];
    if (lastMessage?.isUser) {
      scrollToBottom();
    }
  }, [internalMessages]);

  const handleApiCall = async (messagesToSend: Message[]) => {
    setIsLoading(true);

    try {
      console.log("📡 Calling dashboard-chat API...");
      
      // Prepare messages for API (convert to OpenAI format)
      const apiMessages = messagesToSend.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.title + (msg.description ? `\n${msg.description}` : '')
      }));

      console.log("📦 API messages:", apiMessages);
      console.log("📊 User data:", userData);
      console.log("📊 Results data:", resultsData);

      const response = await fetch('/api/dashboard-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          userData: userData,
          resultsData: resultsData
        }),
      });

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("❌ API Error:", errorData);
        throw new Error(`API call failed: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      // Add AI message placeholder with loading state
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        title: "Pracuję nad Twoim zapytaniem...",
        description: "",
        isUser: false,
      };

      setInternalMessages(prev => [...prev, aiMessage]);
      scrollToBottom(); // Scroll to show loading message

      let aiResponseText = "";
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiResponseText += chunk;

        // Update AI message with streamed content (replace loading message only when we have actual content)
        setInternalMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessage.id 
              ? { ...msg, title: aiResponseText.trim() ? aiResponseText : "Pracuję nad Twoim zapytaniem..." }
              : msg
          )
        );

        // Auto-scroll during AI response
        scrollToBottom();
      }

      console.log("✅ AI response complete:", aiResponseText);

    } catch (error) {
      console.error("💥 Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        title: "Przepraszam, wystąpił błąd podczas komunikacji z AI.",
        description: "Spróbuj ponownie za chwilę.",
        isUser: false,
      };

      setInternalMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    console.log("🚀 Sending message:", inputValue);
    
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      title: inputValue,
      description: "",
      isUser: true,
    };

    const updatedMessages = [...internalMessages, userMessage];
    setInternalMessages(updatedMessages);

    setInputValue("");
    
    // Call API with the updated messages
    await handleApiCall(updatedMessages);
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
        {internalMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
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
          internalMessages.map((message) => (
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
          placeholder={isLoading ? "AI odpowiada..." : "Zadaj pytanie o emeryturę..."}
          className="flex-1"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleSend}
          className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputValue.trim() || isLoading}
          aria-label="Wyślij wiadomość"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
