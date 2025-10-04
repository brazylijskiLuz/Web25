"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AvatarBackground } from "../../layout/avatar-background";
import { useState } from "react";
import { Title } from "@/components/onboarding/title";
import { StaticChat } from "@/components/onboarding/static-chat";

export default function Home() {
  const [isHidden, setIsHidden] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.push("/results");
  }, []);

  const handleStartClick = () => {
    setIsHidden(true);
    // Po zakończeniu animacji pokaż nowy kontent i ustaw absolute
    setTimeout(() => {
      setShowNewContent(true);
      setAnimationFinished(true);
    }, 800);
  };

  return (
    <AvatarBackground circlePosition="middle" assistant="hand-raised">
      <Title
        isHidden={isHidden}
        animationFinished={animationFinished}
        onStartClick={handleStartClick}
      />

      <StaticChat showNewContent={showNewContent} />
    </AvatarBackground>
  );
}
