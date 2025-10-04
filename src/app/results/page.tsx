import { AlertCircle } from "lucide-react";
import { AvatarBackground } from "../../../layout/avatar-background";

const Results = () => {
  return (
    <div className="mt-20 flex">
      <div className="w-[60%]">
        <label className="text-[20px] font-semibold">Kwota rzeczywista</label>
        <h1 className="text-[108px] font-black leading-[108px] text-primary">
          12 652 zł
        </h1>
        <label className="flex items-center gap-2 mt-12">
          <p className="text-[20px] font-semibold">Kwota urealniona</p>
          <AlertCircle className="w-4 h-4" />
        </label>
        <h2 className="font-black text-[80px] text-chart-4 leading-[80px]">
          8 250 zł
        </h2>
        <div>
          <div></div>
        </div>
      </div>
      <div className="w-[40%]">
        <AvatarBackground circlePosition="right" assistant="pointing-left" />
      </div>
    </div>
  );
};

export default Results;
