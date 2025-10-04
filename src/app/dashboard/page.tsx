"use client";

import { useEffect } from "react";
import useAvatar from "@/stores/useAvatar";
import { Info } from "lucide-react";

const Dashboard = () => {
  const { setAvatarPosition, setAvatarAssistant, setAvatarSize } = useAvatar();

  useEffect(() => {
    setAvatarPosition("right");
    setAvatarSize("small");
    setAvatarAssistant("pointing-up");
  }, []);

  return (
    <div className="flex w-full mt-14">
      <div className="w-[60%] h-screen">
        <h1 className="w-full text-[36px] font-bold">
          Twój panel <span className="text-primary">emerytalny</span>
        </h1>
        <div className="w-full rounded-2xl p-6 h-full bg-white shadow-2x mt-10">
          <h2 className="items-center flex font-bold text-[24px] ">
            Ścieżka życia <Info className="w-4 h-4 ml-2 " />
          </h2>
        </div>
      </div>
      <div className="w-[40%]">Chat</div>
    </div>
  );
};

export default Dashboard;
