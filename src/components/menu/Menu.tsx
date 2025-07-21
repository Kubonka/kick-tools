"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function Menu() {
  //!IMPLEMENTAR NAV BAR
  const router = useRouter();
  const [title, setTitle] = useState("");
  return (
    <div className="flex flex-row justify-around m-2">
      <Label className="w-[90%] text-center text-foreground font-bold text-[26px]">
        {title}
      </Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full bg-primary w-10 h-10" size="icon">
            <MenuIcon strokeWidth={2} size={24} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-[270px] border-2 border-primary mr-10 bg-slate-900 p-4 mt-2">
          <DropdownMenuLabel className="text-[16px] font-bold text-center">
            MENU
          </DropdownMenuLabel>
          <Separator className="h-[1px] bg-muted-foreground mb-1" />
          <DropdownMenuItem
            onClick={() => {
              router.push("/");
              setTitle("ASD");
            }}
            className="text-[16px] font-semibold cursor-pointer"
          >
            Home
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/palabras");
              setTitle("PALABRAS");
            }}
            className="text-[16px] font-semibold cursor-pointer"
          >
            Palabras
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              router.push("/settings");
              setTitle("SETTINGS");
            }}
            className="text-[16px] font-semibold cursor-pointer"
          >
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Menu;
