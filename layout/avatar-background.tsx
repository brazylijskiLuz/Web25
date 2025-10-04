"use client";
import Image from "next/image";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import useAvatar from "@/stores/useAvatar";

interface AvatarBackgroundProps {
  children?: React.ReactNode;
  circlePosition: "middle" | "right" | "left";
  assistant: "hand-raised" | "pointing-right" | "pointing-left";
}

const circlePositionVariants = cva(
  "fixed w-full transition-all duration-700 ease-in-out",
  {
    variants: {
      position: {
        middle: "left-1/2 transform -translate-x-1/2",
        right: "-right-[35vw]",
        left: "-left-[45vw]",
        "pointing-up": "left-1/2 transform -translate-x-1/2",
      },
      size: {
        small: "h-[30vh] bottom-[-10vh]",
        medium: "h-[55vh] bottom-[-25vh]",
        large: "bottom-[-80vh] h-[140vh]",
      },
    },
    compoundVariants: [
      {
        position: "middle",
        size: "small",
        class: "h-[30vh] bottom-[-15vh]",
      },
      {
        position: "middle",
        size: "medium",
        class: "h-[75.27vh] bottom-[-34.21vh]",
      },
      {
        position: "middle",
        size: "large",
        class: "bottom-[-72vh] h-[126vh]",
      },
      {
        position: "right",
        size: "small",
        class: "h-[65vh] bottom-[-35vh] -right-[80vh]",
      },
      {
        position: "right",
        size: "medium",
        class: "h-[55vh] bottom-[-25vh]",
      },
      {
        position: "right",
        size: "large",
        class: "h-[126vh] bottom-[-72vh]",
      },
      {
        position: "left",
        size: "small",
        class: "h-[30vh] bottom-[-5vh]",
      },
      {
        position: "left",
        size: "medium",
        class: "h-[55vh] bottom-[-3vh]",
      },
      {
        position: "left",
        size: "large",
        class: "h-[70vh] bottom-[-12vh]",
      },
      {
        position: "pointing-up",
        size: "small",
        class: "h-[30vh] bottom-[-12vh]",
      },
      {
        position: "pointing-up",
        size: "medium",
        class: "h-[55vh] bottom-[-27vh]",
      },
      {
        position: "pointing-up",
        size: "large",
        class: "h-[70vh] bottom-[-42vh]",
      },
    ],
    defaultVariants: {
      position: "middle",
      size: "medium",
    },
  }
);

const patternVariants = cva(
  "fixed w-screen inset-0 -z-10 transition-all duration-700 ease-in-out",
  {
    variants: {
      position: {
        middle: "",
        right: "",
        left: "",
        "pointing-up": "",
      },
      size: {
        small: "",
        medium: "",
        large: "",
      },
    },
    compoundVariants: [
      {
        position: "middle",
        size: "small",
        class: "",
      },
      {
        position: "middle",
        size: "medium",
        class: "",
      },
      {
        position: "middle",
        size: "large",
        class: "",
      },
      {
        position: "right",
        size: "small",
        class: "ml-[35vw]",
      },
      {
        position: "right",
        size: "medium",
        class: "ml-[25vw]",
      },
      {
        position: "right",
        size: "large",
        class: "ml-[30vw]",
      },
      {
        position: "left",
        size: "small",
        class: "ml-[-20vw]",
      },
      {
        position: "left",
        size: "medium",
        class: "ml-[-25vw]",
      },
      {
        position: "left",
        size: "large",
        class: "ml-[-30vw]",
      },
      {
        position: "pointing-up",
        size: "small",
        class: "",
      },
      {
        position: "pointing-up",
        size: "medium",
        class: "",
      },
      {
        position: "pointing-up",
        size: "large",
        class: "",
      },
    ],
    defaultVariants: {
      position: "middle",
      size: "medium",
    },
  }
);

const assistantVariants = cva(
  "fixed w-full transition-all duration-700 ease-in-out",
  {
    variants: {
      position: {
        middle: "left-1/2 transform -translate-x-1/2",
        right: "-right-[25vw]",
        left: "-left-[40vw]",
        "pointing-up": "left-1/2 transform -translate-x-1/2",
      },
      size: {
        small: "h-[30vh] bottom-[-20vh] -right-[30vw]",
        medium: "h-[55vh] bottom-[-26vh]",
        large: "bottom-[-65vh] h-[140vh]",
      },
    },
    compoundVariants: [
      {
        position: "middle",
        size: "small",
        class: "h-[30vh] bottom-[-12vh]",
      },
      {
        position: "middle",
        size: "medium",
        class: "h-[93.5vh] bottom-[-44.2vh]",
      },
      {
        position: "middle",
        size: "large",
        class: "bottom-[-58.5vh] h-[126vh]",
      },
      {
        position: "right",
        size: "small",
        class: "h-[30vh] bottom-0 -right-[35vw]",
      },
      {
        position: "right",
        size: "medium",
        class: "h-[55vh] bottom-[-26vh]",
      },
      {
        position: "right",
        size: "large",
        class: "h-[126vh] bottom-[-58.5vh]",
      },
      {
        position: "left",
        size: "small",
        class: "h-[30vh] bottom-[-5vh]",
      },
      {
        position: "left",
        size: "medium",
        class: "h-[55vh] bottom-[-20vh]",
      },
      {
        position: "left",
        size: "large",
        class: "h-[70vh] bottom-[-30vh]",
      },
      {
        position: "pointing-up",
        size: "small",
        class: "h-[30vh] bottom-[-10vh]",
      },
      {
        position: "pointing-up",
        size: "medium",
        class: "h-[55vh] bottom-[-25vh]",
      },
      {
        position: "pointing-up",
        size: "large",
        class: "h-[70vh] bottom-[-35vh]",
      },
    ],
    defaultVariants: {
      position: "middle",
      size: "medium",
    },
  }
);

const getAssistantImagePath = (
  assistant: "hand-raised" | "pointing-right" | "pointing-left" | "pointing-up"
) => {
  switch (assistant) {
    case "hand-raised":
      return "/hand-raised.png";
    case "pointing-right":
      return "/pointing-right.png";
    case "pointing-left":
      return "/pointing-left.png";
    case "pointing-up":
      return "/pointing-up.png";
    default:
      return "/hand-raised.png";
  }
};

export const AvatarBackground = ({ children }: AvatarBackgroundProps) => {
  const avatar = useAvatar();

  return (
    <div>
      <div
        className={cn(
          patternVariants({
            position: avatar.avatarPosition,
            size: avatar.avatarSize,
          })
        )}
      >
        <Image src="/pattern.png" alt="pattern" fill priority />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {children}
      </div>

      <div
        className={cn(
          circlePositionVariants({
            position: avatar.avatarPosition,
            size: avatar.avatarSize,
          })
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
        className={cn(
          assistantVariants({
            position: avatar.avatarPosition,
            size: avatar.avatarSize,
          })
        )}
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
