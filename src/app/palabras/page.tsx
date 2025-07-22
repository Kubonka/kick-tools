"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import GameManager from "./GameManager";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Cell = { char: string; status: Status };
type Words = string[];
type Status = "white" | "gray" | "yellow" | "green";

export default function Palabras() {
  const [, setUpdate] = useState(false);
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateWrong, setAnimateWrong] = useState(false);
  const [currentAnimRow, setCurrentAnimRow] = useState<number | null>(null);
  const gm = useRef<GameManager | null>(null);

  // 👇 Ref a cada fila (no celda)
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useGSAP(
    () => {
      if (!rowRef.current) return;
      const cells = rowRef.current.querySelectorAll(".cell");

      gsap.to(cells, {
        keyframes: [
          { x: -10, duration: 0.05 },
          { x: 10, duration: 0.05 },
          { x: -8, duration: 0.05 },
          { x: 8, duration: 0.05 },
          { x: -5, duration: 0.05 },
          { x: 5, duration: 0.05 },
          { x: 0, duration: 0.05 },
        ],
        ease: "power1.inOut",
        onComplete: () => {
          // any callback logic here
          if (gm.current) {
            gm.current.solve = false;
          }
        },
      });
    },
    {
      scope: rowRef,
      dependencies: [animateWrong],
      revertOnUpdate: false,
    }
  );

  useGSAP(
    () => {
      if (!rowRef.current) return;
      const cells = rowRef.current.querySelectorAll(".cell");
      cells.forEach((el, i) => {
        const cell = gm.current?.board[gm.current.row - 1][i] as Cell;
        gsap.to(el, {
          rotateY: 90,
          duration: 0.5,
          ease: "power1.in",
          delay: i * 0.25,
          onComplete: () => {
            gsap.to(el, { rotateY: 0, duration: 0.3, ease: "power1.out" });
            if (el instanceof HTMLElement && cell) {
              el.style.backgroundColor = getColor(cell.status);
              el.textContent = cell.char.toUpperCase();
            }
            setTimeout(() => {
              if (gm.current) {
                gm.current.solve = false;
              }
            }, 1000);
          },
        });
      });
    },
    {
      scope: rowRef,
      dependencies: [animateFlip],
      revertOnUpdate: false,
    }
  );

  function handleKeyDown(event: KeyboardEvent) {
    const key = event.key;
    if (!gm.current?.gameOver) {
      if (/^[a-zA-Z]$/.test(key)) {
        gm.current?.setChar(key.toLowerCase());
      } else if (key === "Backspace") {
        gm.current?.setChar(key);
      }
    }
  }

  async function init() {
    try {
      const res = await axios.get("/api/all-words");
      if (res.data) {
        const { allWords, pool }: { allWords: Words; pool: Words } = res.data;
        gm.current = new GameManager(
          allWords,
          pool,
          () => setUpdate((prev) => !prev),
          () => {
            setCurrentAnimRow(gm.current!.row - 1); // para flip, animar fila anterior
            setAnimateFlip((prev) => !prev);
          },
          () => {
            setCurrentAnimRow(gm.current!.row); // para wrong, animar fila actual
            setAnimateWrong((prev) => !prev);
          }
        );
        gm.current.newGame();
      }
    } catch (error) {
      console.error("Error cargando palabras: ", error);
    }
  }

  function handleNewWord() {
    gm.current?.newWord();
    const cells = rowRef.current?.querySelectorAll(".cell");
    cells?.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.backgroundColor = "#ffffff";
        el.textContent = "";
      }
    });
  }

  function getColor(status: Status): string {
    switch (status) {
      case "white":
        return "#ffffff";
      case "gray":
        return "#9ca3af";
      case "yellow":
        return "#facc15";
      case "green":
        return "#22c55e";
      default:
        return "#ffffff";
    }
  }

  return (
    <div className="bg-foreground flex flex-col gap-4 w-full h-full p-8 justify-center items-center">
      <Button className="bg-primary w-48" onClick={handleNewWord}>
        Nueva Palabra
      </Button>
      {gm.current?.board.map((row, rowIndex) => (
        <div
          className="flex flex-row gap-2"
          key={rowIndex}
          ref={rowIndex === currentAnimRow ? rowRef : null}
        >
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="cell flex border-1 border-primary w-12 h-12 rounded-[8px] justify-center items-center font-bold text-2xl"
              style={{ backgroundColor: "#ffffff" }}
            >
              {cell.char.toUpperCase() || " "}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
