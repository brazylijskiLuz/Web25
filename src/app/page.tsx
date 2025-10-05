"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/onboarding/title";
import { StaticChat } from "@/components/onboarding/static-chat";
import useAvatar from "@/stores/useAvatar";
import { useRouter } from "next/navigation";
import { useHideAvatarGraphics } from "@/hooks/useHideAvatarGraphics";
import useResultsData from "@/stores/useResultsData";

export default function Home() {
  const { setAvatarPosition, setAvatarAssistant, setAvatarSize } = useAvatar();
  const router = useRouter();
  useHideAvatarGraphics(450, true);
  const [isHidden, setIsHidden] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const { setResultsData } = useResultsData();

  useEffect(() => {
    setAvatarPosition("middle");
    setAvatarAssistant("hand-raised");
    setAvatarSize("large");
  }, []);

  const handleStartClick = () => {
    setIsHidden(true);
    // Po zakończeniu animacji pokaż nowy kontent i ustaw absolute
    setTimeout(() => {
      setShowNewContent(true);
      setAnimationFinished(true);
      setAvatarAssistant("pointing-right");
      setAvatarSize("medium");
    }, 800);
  };

  const handleResultsReceived = (data: any) => {
    // Zapisz dane do kontekstu
    setResultsData(data);
    // Przekieruj na stronę results
    router.push("/results");
  };

  return (
    <div className="flex flex-col items-center align-middle w-full">
      <Title
        isHidden={isHidden}
        animationFinished={animationFinished}
        onStartClick={handleStartClick}
      />

      <StaticChat
        showNewContent={showNewContent}
        onResultsReceived={handleResultsReceived}
      />
    </div>
  );
}
