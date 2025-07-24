"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import axios from "axios";

type Dict = {
  [key: string]: string[];
};
export default function Scrable() {
  const dict = useRef<Dict | null>(null);
  const final = useRef<string[]>([]);
  const inputsRef = useRef<HTMLDivElement | null>(null);
  // const [inputs, setInputs] = useState<string[]>([
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  //   "",
  // ]);

  useEffect(() => {
    init();
  }, []);

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

  function handleInputChange(/*e: React.ChangeEvent<HTMLInputElement>*/) {}
  function procesarCombinacion(word: string) {
    const ordWord = word.split("").sort().join("");
    const arr = dict.current;

    if (arr && arr[ordWord]) {
      arr[ordWord].forEach((str) => {
        final.current.push(str);
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
    procesarCombinacion: (word: string) => void
  ) {
    const letraCount: Record<string, number> = {};
    for (const letra of letras) {
      letraCount[letra] = (letraCount[letra] || 0) + 1;
    }

    function backtrack(path: string[], nivel: number) {
      console.log("...");
      if (path.length >= minLen && path.length <= maxLen) {
        procesarCombinacion(path.join(""));
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
        <Button
          onClick={() =>
            generarPermutacionesScrabble(
              ["p", "e", "u", "t", "r", "a"],
              5,
              8,
              procesarCombinacion
            )
          }
        >
          Buscar
        </Button>
        <Button onClick={() => console.log(final.current)}>mostrar</Button>
      </div>
      <div>RESULTADOS</div>
    </div>
  );
}
