"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function Scrable() {
  const inputsRef = useRef<HTMLDivElement | null>(null);
  const [inputs, setInputs] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {}
  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className="flex flex-row gap-2  w-full justify-center items-center"
        ref={inputsRef}
      >
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
          onChange={handleInputChange}
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
        <input
          className="locked w-18 h-18 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold bg-white"
          type="text"
        />
      </div>
      <div>
        <input type="text" />
        <Button>Buscar</Button>
      </div>
      <div>RESULTADOS</div>
    </div>
  );
}
