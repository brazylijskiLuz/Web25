"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/onboarding/title";
import { StaticChat } from "@/components/onboarding/static-chat";
import useAvatar from "@/stores/useAvatar";

export default function Home() {
  const { setAvatarPosition, setAvatarAssistant } = useAvatar();
  const [isHidden, setIsHidden] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.push("/results");
  }, []);

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

  return (
    <>
      <Title
        isHidden={isHidden}
        animationFinished={animationFinished}
        onStartClick={handleStartClick}
      />

      <StaticChat showNewContent={showNewContent} />
    </>
  );
}
