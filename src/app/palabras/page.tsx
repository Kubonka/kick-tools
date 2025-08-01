"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import GameManager from "./GameManager";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Eye, EyeClosed } from "lucide-react";
import Timer from "./Timer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
type Cell = { char: string; status: Status };
type Words = string[];
type Status = "white" | "gray" | "yellow" | "green";

export default function Palabras() {
  const [, setUpdate] = useState(false);
  const [bestStreak, setBestStreak] = useState<number | null>(null);
  const [bestTimes, setBestTimes] = useState<{ [key: string]: number }>({});
  const [showData, setShowData] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trigger, setTrigger] = useState<{
    type: "start" | "stop" | "reset";
    id: number;
  } | null>(null);
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateWrong, setAnimateWrong] = useState(false);
  const [currentAnimRow, setCurrentAnimRow] = useState<number | null>(null);
  const gm = useRef<GameManager | null>(null);

  const rowRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //! LOCAL STORAGE
  // useEffect(() => {
  //   const storedName = sessionStorage.getItem("name");
  //   if (storedName) {
  //     setName(storedName);
  //   }
  // }, []);

  // Guardar en sessionStorage cada vez que el usuario escribe
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newName = e.target.value;
  //   setName(newName);
  //   sessionStorage.setItem("name", newName);
  // };
  useEffect(() => {
    if (dialogOpen) {
      const streak = sessionStorage.getItem("streak");
      const time5 = sessionStorage.getItem("5");
      const time6 = sessionStorage.getItem("6");
      const time7 = sessionStorage.getItem("7");

      setBestStreak(streak ? parseInt(streak) : null);
      setBestTimes({
        "5": time5 ? parseInt(time5) : 0,
        "6": time6 ? parseInt(time6) : 0,
        "7": time7 ? parseInt(time7) : 0,
      });
    }
  }, [dialogOpen]);
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
                if (gm.current?.gameOver)
                  setTrigger({ type: "stop", id: Date.now() });
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
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
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

  function handleGameFinished(time: number) {
    if (gm.current?.gameWon) {
      //*time
      const wordSize = gm.current?.getBoardSize();
      const storeTime = sessionStorage.getItem(wordSize.toString());
      let bestTime = 0;
      if (storeTime) bestTime = parseInt(storeTime);
      console.log(storeTime);
      console.log(time);
      if (time < bestTime) {
        console.log("guarda");
        sessionStorage.setItem(wordSize.toString(), time.toString());
      }
      //* streak
      const storeStreak = sessionStorage.getItem("streak");
      let bestStreak = 0;
      if (storeStreak) bestStreak = parseInt(storeStreak);
      const currentStreak = gm.current?.streak as number;
      if (currentStreak > bestStreak) {
        sessionStorage.setItem("streak", currentStreak.toString());
      }
    } else {
      return;
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
            setCurrentAnimRow(gm.current!.row - 1);
            setAnimateFlip((prev) => !prev);
          },
          () => {
            setCurrentAnimRow(gm.current!.row);
            setAnimateWrong((prev) => !prev);
          }
        );
        gm.current.newGame();
        handleNewWord();
      }
    } catch (error) {
      console.error("Error cargando palabras: ", error);
    }
  }

  function handleNewWord() {
    gm.current?.newWord();
    const allCells = containerRef.current?.querySelectorAll(".cell");
    allCells?.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.backgroundColor = "#ffffff";
        el.textContent = "";
      }
    });
    setTrigger({ type: "reset", id: Date.now() });
    setTimeout(() => {
      setTrigger({ type: "start", id: Date.now() });
    }, 100);
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
    <div
      className=" flex flex-col gap-4 w-full h-full p-8 justify-center items-center"
      ref={containerRef}
    >
      <div className="flex flex-row justify-between w-[380px] items-center h-[50px]">
        <div className="flex flex-row  w-[350px] justify-between items-center">
          <div
            className={`text-2xl font-semibold cursor-default select-none w-[230px] ${
              showData ? "" : "hidden"
            }`}
          >
            {"Racha : " + (gm.current?.streak || "0")}
          </div>
          <div
            className={`flex flex-row justify-end items-center gap-4 w-[150px] pr-4 ${
              showData ? "" : "hidden"
            }`}
          >
            <Timer trigger={trigger} onTimeFinished={handleGameFinished} />
          </div>
        </div>
        <Eye
          onClick={() => setShowData(false)}
          className={`${showData ? "" : "hidden"} cursor-pointer`}
        />

        <EyeClosed
          onClick={() => setShowData(true)}
          className={`${showData ? "hidden" : ""} cursor-pointer`}
        />
      </div>
      <div className=" flex flex-row gap-4 mb-4">
        <Button
          className="bg-primary w-48  cursor-pointer"
          onClick={handleNewWord}
        >
          Nueva Palabra
        </Button>
        <Button
          variant={"secondary"}
          className="cursor-pointer"
          onClick={() => setDialogOpen(true)}
        >
          Records
        </Button>
      </div>
      {gm.current?.board.map((row, rowIndex) => (
        <div
          className="flex flex-row gap-2"
          key={rowIndex}
          ref={rowIndex === currentAnimRow ? rowRef : null}
        >
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="cell flex w-12 h-12 rounded-[8px] justify-center border-[1px] border-slate-400 items-center font-bold text-2xl cursor-default select-none"
              style={{ backgroundColor: "#ffffff" }}
            >
              {cell.char.toUpperCase() || " "}
            </div>
          ))}
        </div>
      ))}
      <div className="h-24 text-5xl align-middle font-bold mt-4 text-shadow-slate-950">
        {gm.current?.gameOver ? gm.current?.target.toUpperCase() : ""}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-blue-200 rounded-[8px] border-0">
          <DialogTitle className="hidden"></DialogTitle>
          <DialogHeader className="text-center flex justify-center items-center font-semibold text-lg ">
            RECORDS
          </DialogHeader>
          <DialogDescription>
            Mejor racha - {bestStreak ?? "—"}
          </DialogDescription>
          <DialogDescription>
            Mejor tiempo 5 letras - {formatTime(bestTimes["5"] || 0)}
          </DialogDescription>
          <DialogDescription>
            Mejor tiempo 6 letras - {formatTime(bestTimes["6"] || 0)}
          </DialogDescription>
          <DialogDescription>
            Mejor tiempo 7 letras - {formatTime(bestTimes["7"] || 0)}
          </DialogDescription>
          <DialogFooter className="flex flex-row gap-4">
            <Button
              type="submit"
              onClick={() => setDialogOpen(false)}
              className="w-full cursor-pointer"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
