"use client";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import useAvatar from "@/stores/useAvatar";

interface AvatarBackgroundProps {
  children: React.ReactNode;
}

const circlePositionVariants = cva(
  "fixed w-full transition-all duration-700 ease-in-out",
  {
    variants: {
      position: {
        middle: "left-1/2 bottom-[-80vh] h-[140vh] transform -translate-x-1/2",
        right: "-right-[45vw] h-[110vh] bottom-[-40vh]",
        left: "-left-[45vw] h-[110vh] bottom-[-40vh]",
      },
    },
    defaultVariants: {
      position: "middle",
    },
  }
);

const patternVariants = cva(
  "fixed w-screen inset-0 -z-10 transition-all duration-700 ease-in-out",
  {
    variants: {
      position: {
        middle: "",
        right: "ml-[25vw]",
        left: "ml-[-25vw]",
      },
    },
    defaultVariants: {
      position: "middle",
    },
  }
);

const assistantVariants = cva(
  "fixed w-full transition-all duration-700 ease-in-out",
  {
    variants: {
      position: {
        middle: "left-1/2 bottom-[-65vh] h-[140vh] transform -translate-x-1/2",
        right: "-right-[40vw] h-[110vh] bottom-[-40vh]",
        left: "-left-[40vw] h-[110vh] bottom-[-40vh]",
      },
    },
    defaultVariants: {
      position: "middle",
    },
  }
);

const getAssistantImagePath = (
  assistant: "hand-raised" | "pointing-right" | "pointing-left"
) => {
  switch (assistant) {
    case "hand-raised":
      return "/hand-raised.png";
    case "pointing-right":
      return "/pointing-right.png";
    case "pointing-left":
      return "/pointing-left.png";
    default:
      return "/hand-raised.png";
  }
};

export const AvatarBackground = ({ children }: AvatarBackgroundProps) => {
  const avatar = useAvatar();

  return (
    <div>
      <div className={cn(patternVariants({ position: avatar.avatarPosition }))}>
        <Image src="/pattern.png" alt="pattern" fill priority />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>

      <div
        className={cn(
          circlePositionVariants({ position: avatar.avatarPosition })
        )}
      >
        <Image
          src="/circle.svg"
          alt="circle"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
      <div
        className={cn(assistantVariants({ position: avatar.avatarPosition }))}
      >
        <Image
          src={getAssistantImagePath(avatar.avatarAssistant)}
          alt="assistant"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
};
