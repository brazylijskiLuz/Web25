import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TitleProps {
  isHidden: boolean;
  animationFinished: boolean;
  onStartClick: () => void;
}

export const Title = ({
  isHidden,
  animationFinished,
  onStartClick,
}: TitleProps) => {
  return (
    <div
      className={cn(
        animationFinished && "absolute",
        "mt-20 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out",
        isHidden ? "-translate-y-[30vh] opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <h1 className="text-4xl font-extrabold max-w-96 text-center">
        Poznaj swój przyszły plan{" "}
        <span className="text-primary">emerytalny</span>.
      </h1>
      <Button className="mt-14" onClick={onStartClick}>
        Rozpocznij
      </Button>
    </div>
  );
};
