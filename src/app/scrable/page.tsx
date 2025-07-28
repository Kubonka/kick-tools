"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import axios from "axios";

type Dict = {
  [key: string]: string[];
};
type Cell = {
  status: Status;
  char: string;
  value: number;
};
type ResultWord = {
  word: string;
  value: number;
};
type Status = "BLANK" | "LOCKED" | "2L" | "3L" | "2P" | "3P";
export default function Scrable() {
  const dict = useRef<Dict | null>(null);
  const [working, setWorking] = useState(false);
  const [givenChars, setGivenChars] = useState("");
  const inputsRef = useRef<HTMLDivElement | null>(null);
  const [cells, setCells] = useState<Cell[]>(
    Array.from({ length: 15 }, () => ({ status: "BLANK", char: "", value: 0 }))
  );
  const [result, setResult] = useState<ResultWord[]>([]);
  useEffect(() => {
    init();
  }, []);
  // async function generate(allChars: string[], maxLen: number) {
  //   try {
  //     const res = await axios.put("/api/scrable", {
  //       dict: dict.current,
  //       allChars,
  //       maxLen,
  //     });
  //     if (res.data) {
  //       return res.data;
  //     }
  //   } catch (error) {
  //     console.error("Error generando palabras: ", error);
  //   }
  // }
  async function init() {
    try {
      const res = await axios.get("/api/scrable");
      if (res.data) {
        dict.current = res.data;
      }
    } catch (error) {
      console.error("Error cargando palabras: ", error);
    }
  }

  // function procesarCombinacion(word: string) {
  //   const ordWord = word.split("").sort().join("");
  //   const arr = dict.current;

  //   if (arr && arr[ordWord]) {
  //     arr[ordWord].forEach((str) => {
  //       final.current.push(str);
  //     });
  //   }
  // }
  // /**
  //  * Genera todas las permutaciones posibles de longitud variable (de minLen a maxLen)
  //  * usando las letras disponibles, y llama a procesarCombinacion por cada una.
  //  *
  //  * @param letras Array de letras disponibles (puede contener repetidas).
  //  * @param minLen Longitud mínima de palabra.
  //  * @param maxLen Longitud máxima de palabra.
  //  * @param procesarCombinacion Función que recibe cada palabra generada.
  //  */
  // function generarPermutacionesScrabble(
  //   letras: string[],
  //   minLen: number,
  //   maxLen: number,
  //   procesarCombinacion: (word: string) => void
  // ) {
  //   const letraCount: Record<string, number> = {};
  //   for (const letra of letras) {
  //     letraCount[letra] = (letraCount[letra] || 0) + 1;
  //   }

  //   function backtrack(path: string[], nivel: number) {
  //     if (path.length >= minLen && path.length <= maxLen) {
  //       procesarCombinacion(path.join(""));
  //     }
  //     if (path.length === maxLen) return;

  //     for (const letra in letraCount) {
  //       if (letraCount[letra] > 0) {
  //         path.push(letra);
  //         letraCount[letra]--;

  //         backtrack(path, nivel + 1);

  //         letraCount[letra]++;
  //         path.pop();
  //       }
  //     }
  //   }
  //   backtrack([], 0);
  // }

  //! control de cells
  const setBgColor = useCallback(
    (index: number): string => {
      switch (cells[index].status) {
        case "2L":
          return "bg-blue-600";
        case "3L":
          return "bg-green-500";
        case "2P":
          return "bg-orange-400";
        case "3P":
          return "bg-red-500";
        case "LOCKED":
          return "bg-slate-700";
        default:
          return "bg-white";
      }
    },
    [cells]
  );
  // const setBgColor = (index: number): string => {
  //   switch (cells[index].status) {
  //     case "2L":
  //       return "bg-blue-600";
  //     case "3L":
  //       return "bg-green-500";
  //     case "2P":
  //       return "bg-orange-400";
  //     case "3P":
  //       return "bg-red-500";
  //     case "LOCKED":
  //       return "bg-slate-700";
  //     default:
  //       return "bg-white";
  //       break;
  //   }
  // };

  const updateCell = React.useCallback((idx: number, patch: Partial<Cell>) => {
    setCells((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch };
      return next;
    });
  }, []);

  // const handleCharChange = useCallback(
  //   (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = e.target.value;
  //     const char = value.slice(-1).toUpperCase();
  //     setCells((prev) => {
  //       const next = [...prev];
  //       next[idx] = { ...next[idx], char };
  //       return next;
  //     });
  //   },
  //   []
  // );
  const handleCharChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const char = value.slice(-1).toUpperCase();
      updateCell(idx, { char });
    };
  const handleStatusChange = useCallback(
    (idx: number) => (value: string) => {
      const v = value as Status;
      setCells((prev) => {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          status: v,
          char: v === "BLANK" ? next[idx].char : "",
        };
        return next;
      });
    },
    []
  );
  // const handleStatusChange = (idx: number) => (value: string) => {
  //   const v = value as Status;

  //   setCells((prev) => {
  //     const next = [...prev];
  //     next[idx] = {
  //       ...next[idx],
  //       status: v,
  //       char: v === "BLANK" ? next[idx].char : "",
  //     };
  //     return next;
  //   });
  // };
  function handleReset() {
    setCells(cells.map(() => ({ char: "", status: "BLANK", value: 0 })));
    setResult([]);
    setGivenChars("");
    setWorking(false);
  }
  // const memoizedResults = useMemo(() => {
  //   return (
  //     <>
  //       <ResultsColumn result={result} start={0} end={10} />
  //       <ResultsColumn result={result} start={10} end={20} />
  //     </>
  //   );
  // }, [result]);
  //! PREPARAR INPUT
  const getLockedIndices = useCallback((): [number, number] => {
    let lock1 = -1;
    let lock2 = -1;
    for (let i = 0; i < Math.floor(cells.length / 2); i++) {
      if (cells[i].status === "LOCKED") {
        lock1 = i + 1;
        break;
      }
    }
    for (let i = cells.length - 1; i > Math.floor(cells.length / 2); i--) {
      if (cells[i].status === "LOCKED") {
        lock2 = i;
        break;
      }
    }
    return [lock1, lock2];
  }, [cells]);
  const getMaxLen = useCallback((): number => {
    const [lock1, lock2] = getLockedIndices();
    if (lock1 === -1 && lock2 === -1) return cells.length;
    if (lock1 === -1 && lock2 !== -1) return lock2 + 1;
    if (lock1 !== -1 && lock2 === -1) return cells.length - lock1;
    return lock2 - lock1;
  }, [cells, getLockedIndices]);
  const handleSearch = useCallback(async () => {
    if (working) return;
    setWorking(true);
    try {
      const allChars: string[] = [
        ...cells.filter((c) => c.char).map((c) => c.char.toLowerCase()),
        ...givenChars.toLowerCase().split(""),
      ];
      const maxLen = getMaxLen();
      const final: string[] = [];

      if (dict.current) {
        generarPermutacionesScrabble(
          allChars,
          2,
          maxLen,
          procesarCombinacion,
          dict.current,
          final
        );
        const final2 = [...new Set(final)];
        const validatedWords: ResultWord[] = [];
        if (final2.length) {
          validateWords(final2, validatedWords);
          validatedWords.sort((a, b) => b.value - a.value);
          setResult(validatedWords);
        } else {
          setResult([]);
        }
      }
    } finally {
      setWorking(false);
    }
  }, [working, cells, givenChars, getMaxLen]);
  // async function handleSearch() {
  //   //todo agarra el array cells y prepara un array apto de letras que contenga las de cells y las de
  //   const allChars: string[] = [];
  //   cells.forEach((c) => {
  //     if (c.char) {
  //       allChars.push(c.char.toLowerCase());
  //     }
  //   });
  //   givenChars.split("").forEach((c) => allChars.push(c.toLowerCase()));
  //   const maxLen = getMaxLen();
  //   const final: string[] = [];
  //   if (dict.current) {
  //     generarPermutacionesScrabble(
  //       allChars,
  //       2,
  //       maxLen,
  //       procesarCombinacion,
  //       dict.current,
  //       final
  //     );
  //     const final2 = [...new Set(final.flat(Infinity))];

  //     //const responseArr = await generate(allChars, maxLen);
  //     //console.log("responseArr", responseArr);
  //     const validatedWords: ResultWord[] = [];
  //     if (final2.length) {
  //       validateWords(final2, validatedWords);
  //       validatedWords.sort((a, b) => b.value - a.value);
  //       setResult(validatedWords);
  //     } else {
  //       setResult([]);
  //     }
  //   }
  // }
  function procesarCombinacion(word: string, dict: Dict, final: string[]) {
    const ordWord = word.split("").sort().join("");
    const arr = dict;

    if (arr && arr[ordWord]) {
      arr[ordWord].forEach((str) => {
        final.push(str);
      });
    }
  }
  /**
   * Genera todas las permutaciones posibles de longitud variable (de minLen a maxLen)
   * usando las letras disponibles, y llama a procesarCombinacion por cada una.
   *
   * @param letras Array de letras disponibles (puede contener repetidas).
   * @param minLen Longitud mínima de palabra.
   * @param maxLen Longitud máxima de palabra.
   * @param procesarCombinacion Función que recibe cada palabra generada.
   */
  function generarPermutacionesScrabble(
    letras: string[],
    minLen: number,
    maxLen: number,
    procesarCombinacion: (word: string, dict: Dict, final: string[]) => void,
    dict: Dict,
    final: string[]
  ) {
    const letraCount: Record<string, number> = {};
    for (const letra of letras) {
      letraCount[letra] = (letraCount[letra] || 0) + 1;
    }

    function backtrack(path: string[], nivel: number) {
      if (path.length >= minLen && path.length <= maxLen) {
        procesarCombinacion(path.join(""), dict, final);
      }
      if (path.length === maxLen) return;

      for (const letra in letraCount) {
        if (letraCount[letra] > 0) {
          path.push(letra);
          letraCount[letra]--;

          backtrack(path, nivel + 1);

          letraCount[letra]++;
          path.pop();
        }
      }
    }
    backtrack([], 0);
  }

  function validateWords(arr: string[], validated: ResultWord[]) {
    const [lock1, lock2] = getLockedIndices();
    const start = lock1 === -1 ? 0 : lock1;
    const end = lock2 === -1 ? cells.length : lock2;
    const original = copyCells(start, end);
    const copy: string[] = new Array(end - start);

    const cellsCharsLength = original.reduce(
      (total, curr) => (curr.char != "" ? total + 1 : total),
      0
    );

    arr.forEach((realWord) => {
      //*clear copy
      copy.forEach((c, i, arr) => (arr[i] = ""));
      //*seteo word en copy
      for (let i = 0; i < copy.length; i++) {
        if (realWord[i]) copy[i] = realWord[i];
        else copy[i] = "";
      }

      let solvable = true;
      while (solvable) {
        let correctPlacement = true;
        let idx = 0;
        for (let i = 0; i < cellsCharsLength; i++) {
          //*busco next index de char
          idx = findNextCharIndex(idx, original);
          if (original[idx].char != "") {
            //*si coincide -> continue

            if (original[idx].char === copy[idx]) {
              idx++;
              continue;
            }
            //*sino correctPlacement = false -> break
            correctPlacement = false;
            break;
          } else {
            continue;
          }
        }
        //*check placement bool value
        if (correctPlacement) {
          //*SI -> calculo valor y pusheo
          const resultWord: ResultWord = {
            word: realWord,
            value: calculateValue(copy, original),
          };
          validated.push(resultWord);
          solvable = false;
        } else {
          if (canShift(copy)) {
            //*NO -> Si puedo shiftear -> Shifteo derecha el array copy
            shiftRight(copy);
          } else {
            //*      Si no puedo shiftear -> solvable = false
            solvable = false;
          }
        }
      }
    });
  }
  function calculateValue(copy: string[], original: Cell[]): number {
    const wordMultiplier = calculateWordMultiplier(copy, original);
    const wordValue = calculateWordValue(copy, original);
    const value = wordMultiplier * wordValue;
    return value;
  }
  function calculateWordMultiplier(copy: string[], original: Cell[]) {
    let total = 0;
    for (let i = 0; i < copy.length; i++) {
      const char = copy[i];
      if (char != "") {
        total += getWordMultiplier(original, i);
      }
    }
    return total === 0 ? 1 : total;
  }
  function getWordMultiplier(original: Cell[], idx: number) {
    if (original[idx].status === "2P") {
      return 2;
    } else if (original[idx].status === "3P") {
      return 3;
    } else return 0;
  }
  function calculateWordValue(copy: string[], original: Cell[]) {
    let total = 0;
    for (let i = 0; i < copy.length; i++) {
      const char = copy[i];
      if (char != "") {
        const charValue = getCharValue(char);
        total += charValue * getCharMultiplier(original, i);
      }
    }
    return total;
  }
  function getCharMultiplier(original: Cell[], idx: number) {
    if (original[idx].status === "2L") {
      return 2;
    } else if (original[idx].status === "3L") {
      return 3;
    } else return 1;
  }
  function getCharValue(char: string): number {
    const LETTER_VALUES: Record<string, number> = {
      A: 1,
      E: 1,
      O: 1,
      S: 1,
      I: 1,
      U: 1,
      N: 1,
      L: 1,
      R: 1,
      T: 1,
      D: 2,
      G: 2,
      B: 3,
      C: 3,
      M: 3,
      P: 3,
      F: 4,
      H: 4,
      V: 4,
      Y: 4,
      Q: 5,
      K: 5,
      W: 5,
      J: 8,
      Ñ: 8,
      X: 8,
      Z: 10,
    };
    if (!char) return 0;
    const c = char.toUpperCase();
    return LETTER_VALUES[c] ?? 0;
  }
  function canShift(copy: string[]): boolean {
    if (copy[copy.length - 1] === "") return true;
    return false;
  }
  function shiftRight(copy: string[]) {
    for (let i = copy.length - 1; i > 0; i--) {
      copy[i] = copy[i - 1];
    }
    copy[0] = "";
  }
  function findNextCharIndex(idx: number, arr: Cell[]): number {
    for (let i = idx; i < arr.length; i++) {
      const cell = arr[i];
      if (cell.char != "") return i;
    }
    return -1;
  }
  function copyCells(start: number, end: number) {
    const copy: Cell[] = [];
    for (let i = start; i < end; i++) {
      const cell: Cell = {
        char: cells[i].char.toLowerCase(),
        status: cells[i].status,
        value: cells[i].value,
      };
      copy.push(cell);
    }
    return copy;
  }

  // function getLockedIndices() {
  //   let lock1 = 0;
  //   let lock2 = 0;

  //   for (let i = 0; i < Math.floor(cells.length / 2); i++) {
  //     if (cells[i].status === "LOCKED") {
  //       lock1 = i + 1;
  //       break;
  //     }
  //     lock1 = -1;
  //   }
  //   for (let i = cells.length - 1; i > Math.floor(cells.length / 2); i--) {
  //     if (cells[i].status === "LOCKED") {
  //       lock2 = i;
  //       break;
  //     }
  //     lock2 = -1;
  //   }
  //   return [lock1, lock2];
  // }

  // const getMaxLen = (): number => {
  //   const [lock1, lock2] = getLockedIndices();
  //   if (lock1 === -1 && lock2 === -1) {
  //     return cells.length; //!maximo posible
  //   } else if (lock1 === -1 && lock2 != -1) {
  //     return lock2 + 1;
  //   } else if (lock1 != -1 && lock2 === -1) {
  //     return cells.length - lock1;
  //   } else return lock2 - lock1;
  // };
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <div
        className="flex flex-row gap-4  w-full justify-center items-center"
        ref={inputsRef}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className="cell flex flex-col justify-center items-center gap-2"
            id={`cell${i}`}
          >
            <input
              className={`w-20 h-20 border-[1px] border-primary text-center rounded-[10px] text-4xl font-bold  ${setBgColor(
                i
              )}`}
              type="text"
              value={cell.char}
              onChange={handleCharChange(i)}
              disabled={cell.status !== "BLANK"}
              maxLength={2}
            />

            <RadioGroup
              value={cell.status}
              onValueChange={handleStatusChange(i)}
              className="flex flex-col justify-center items-start"
            >
              <RadioRow i={i} value="BLANK" label="NORMAL" />
              <div className="flex flex-row gap-2">
                <RadioRow i={i} value="2L" label="2L" />
                <RadioRow i={i} value="3L" label="3L" />
              </div>
              <div className="flex flex-row gap-2">
                <RadioRow i={i} value="2P" label="2P" />
                <RadioRow i={i} value="3P" label="3P" />
              </div>
              <RadioRow i={i} value="LOCKED" label="LOCK" />
            </RadioGroup>
          </div>
        ))}
      </div>
      <input
        className="w-[600px] h-[72px] text-4xl align-middle font-bold text-center tracking-[0.5em] bg-white rounded-[8px] border-[1px] border-primary"
        type="text"
        value={givenChars}
        onChange={(e) => setGivenChars(e.target.value.toUpperCase())}
        maxLength={7}
      />
      <div className=" flex flex-row gap-8">
        <Button
          className="w-[200px] cursor-pointer"
          onClick={async () => {
            if (!working) {
              setWorking(true);
              await handleSearch();
              setWorking(false);
            }
          }}
          disabled={working}
        >
          Buscar
        </Button>
        <Button
          variant={"secondary"}
          onClick={handleReset}
          className="cursor-pointer"
        >
          Reiniciar
        </Button>
      </div>
      <div className="flex flex-row gap-32">
        <div>
          {result.length ? (
            <div className="flex flex-col">
              {result.map((resultWord, i) => {
                if (i < 10) {
                  return (
                    <div
                      key={i}
                      className="flex flex-row justify-between items-center gap-4"
                    >
                      <p className="text-2xl font-semibold">
                        {resultWord.word.toUpperCase()}
                      </p>
                      <p className="text-2xl font-semibold">{`${resultWord.value} pts`}</p>
                    </div>
                  );
                } else return null;
              })}
            </div>
          ) : (
            <div className="text-2xl font-semibold">SIN RESULTADOS</div>
          )}
        </div>
        <div>
          {result.length ? (
            <div className="flex flex-col">
              {result.map((resultWord, i) => {
                if (i >= 10 && i < 20) {
                  return (
                    <div
                      key={i}
                      className="flex flex-row justify-between items-center gap-4"
                    >
                      <p className="text-2xl font-semibold">
                        {resultWord.word.toUpperCase()}
                      </p>
                      <p className="text-2xl font-semibold">{`${resultWord.value} pts`}</p>
                    </div>
                  );
                } else return null;
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
function RadioRow({
  i,
  value,
  label,
}: {
  i: number;
  value: Status;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <RadioGroupItem
        value={value}
        id={`cell-${i}-${value}`}
        className={`border-[1px] ${setBorderColor(label)}  cursor-pointer`}
      />
      <Label htmlFor={`cell-${i}-${value}`} className="font-semibold">
        {label}
      </Label>
    </div>
  );
}
const setBorderColor = (label: string): string => {
  switch (label) {
    case "2L":
      return "border-blue-600";
    case "3L":
      return "border-green-500";
    case "2P":
      return "border-orange-400";
    case "3P":
      return "border-red-500";
    case "LOCK":
      return "border-slate-700";
    default:
      return "border-white";
  }
};
