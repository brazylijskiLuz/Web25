"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/onboarding/title";
import { StaticChat } from "@/components/onboarding/static-chat";
import { Results } from "@/components/onboarding/results";
import useAvatar from "@/stores/useAvatar";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setAvatarPosition, setAvatarAssistant } = useAvatar();
  const [isHidden, setIsHidden] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);

  useEffect(() => {
    setAvatarPosition("middle");
    setAvatarAssistant("hand-raised");
  }, []);

  const handleStartClick = () => {
    setIsHidden(true);
    // Po zakończeniu animacji pokaż nowy kontent i ustaw absolute
    setTimeout(() => {
      setShowNewContent(true);
      setAnimationFinished(true);
      setAvatarAssistant("pointing-right");
    }, 800);
  };

  const handleResultsReceived = (data: any) => {
    setResultsData(data);
    setAvatarPosition("left");
    setAvatarAssistant("pointing-left");
  };

  return (
    <>
      {!resultsData && (
        <>
          <Title
            isHidden={isHidden}
            animationFinished={animationFinished}
            onStartClick={handleStartClick}
          />

          <StaticChat
            showNewContent={showNewContent}
            onResultsReceived={handleResultsReceived}
          />
        </>
      )}

      {resultsData && <Results data={resultsData} />}
    </>
  );
}
