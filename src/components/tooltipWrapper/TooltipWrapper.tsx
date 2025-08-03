import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Label } from "../ui/label";
type Props = {
  description: string;
  children: React.ReactNode;
};
function TooltipWrapper({ description, children }: Props) {
  return (
    <div>
      <Tooltip delayDuration={800}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-primary rounded-[8px] p-4 text-white font-semibold">
          <Label style={{ whiteSpace: "pre-line" }}>{description}</Label>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

export default TooltipWrapper;
