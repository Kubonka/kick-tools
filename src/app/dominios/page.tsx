"use client";
import React, { useState } from "react";
import rawDomains from "./dominios.json";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AutoFillHelper from "./AutofillHelper";
export type Domain = {
  dominio: string;
  nombrePais: string;
};

function Dominios() {
  const [mode, setMode] = useState(0);
  const [domain, setDomain] = useState<[string, string]>(() => {
    const rnd = Math.floor(Math.random() * rawDomains.length);
    const d = rawDomains[rnd];
    return [d.dominio, d.nombrePais];
  });
  const [value, setValue] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerBorder, setAnswerBorder] = useState<"none" | "green" | "red">(
    "none"
  );
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  function anim(status: boolean, answer: string) {
    setAnswer(answer);
    if (status) setAnswerBorder("green");
    else setAnswerBorder("red");
    setTimeout(() => {
      setAnswer("");
      setAnswerBorder("none");
      rollDomain();
    }, 2000);
  }

  const handleTabPressed = (nombrePais: string) => {
    setValue(nombrePais);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === 1) {
      if (domain[0] === value) {
        anim(true, "");
        setStreak((prev) => {
          const next = prev + 1;
          setBestStreak((best) => Math.max(best, next));
          return next;
        });
      } else {
        anim(false, domain[0]);
        setStreak(0);
      }
    } else {
      if (domain[1].toLowerCase() === value.toLowerCase()) {
        anim(true, "");
        setStreak((prev) => {
          const next = prev + 1;
          setBestStreak((best) => Math.max(best, next));
          return next;
        });
      } else {
        anim(false, domain[1]);
        setStreak(0);
      }
    }
  };

  function rollDomain() {
    const rnd = Math.floor(Math.random() * rawDomains.length);
    const d = rawDomains[rnd];
    setDomain([d.dominio, d.nombrePais]);
  }

  return (
    <div className="flex flex-col gap-8 h-full w-full items-center justify-start p-4">
      <div className="flex flex-row gap-8">
        <Button
          onClick={() => {
            setMode(0);
            rollDomain();
            setStreak(0);
            setBestStreak(0);
          }}
          className="cursor-pointer w-32"
        >
          Adivinar Pais
        </Button>
        <Button
          onClick={() => {
            setMode(1);
            rollDomain();
            setStreak(0);
            setBestStreak(0);
          }}
          className="cursor-pointer w-32"
        >
          Adivinar Dominio
        </Button>
        <div className=" flex flex-col items-start justify-center">
          <Label className="text-xl">{`Racha  : ${streak}`}</Label>
          <Label className="text-xl">{`Mejor Racha  : ${bestStreak}`}</Label>
        </div>
      </div>
      <Label
        className={`text-4xl h-8 transition-opacity duration-300 ${
          answer ? "opacity-100" : "opacity-0"
        }`}
      >
        {answer}
      </Label>
      {mode === 0 ? (
        <div className="flex flex-col w-[400px] gap-4 h-full items-center justify-center">
          <Label className="text-3xl">{domain[mode]}</Label>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center justify-center flex-row gap-4"
          >
            <div className="relative flex w-full flex-col">
              <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ingresa el país"
                className={`
    transition-all duration-300
    ${answerBorder === "green" && "border-2 border-green-500"}
    ${answerBorder === "red" && "border-2 border-red-500"}
    ${answerBorder === "none" && "border-1 border-primary"}
  `}
              />
              <AutoFillHelper search={value} onTabPressed={handleTabPressed} />
            </div>
            <Button type="submit" className="cursor-pointer">
              Enviar
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col w-[400px] gap-4 h-full items-center justify-center">
          <Label className="text-3xl"> {domain[mode]}</Label>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center justify-center flex-row gap-4"
          >
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ingresa el dominio"
              className={`
    transition-all duration-300
    ${answerBorder === "green" && "border-2 border-green-500"}
    ${answerBorder === "red" && "border-2 border-red-500"}
    ${answerBorder === "none" && "border-1 border-primary"}
  `}
            />

            <Button type="submit" className="cursor-pointer">
              Enviar
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Dominios;
