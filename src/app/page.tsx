"use client";
import { Button } from "@/components/ui/button";
import { AvatarBackground } from "../../layout/avatar-background";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/results");
  }, []);

  return (
    <AvatarBackground circlePosition="right" assistant="pointing-left">
      <Button>test</Button>
    </AvatarBackground>
  );
}
