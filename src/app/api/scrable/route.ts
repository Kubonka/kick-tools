import axios from "axios";
import path from "path";
import fs from "fs";

//import { PrismaClient } from "@prisma/client";
//const prisma = new PrismaClient();
// export async function POST() {
//   try {
//     const palabras: {
//       texto: string;
//       frecuenciaAbsoluta: number;
//       frecuenciaNorm: number;
//     }[] = await prisma.$queryRaw`
//       SELECT * FROM "Palabra"
//       WHERE LENGTH(texto) IN (5, 6, 7, 8)
//     `;
//     const pool = palabras
//       .filter((p) => p.frecuenciaAbsoluta > 400)
//       .map((p) => p.texto);
//     const outputPath = path.join(
//       process.cwd(),
//       "src/app/api/scrable/scrableWords.json"
//     );
//     const jsonOutput = JSON.stringify(pool, null, 2); // bonito con indentación
//     fs.writeFileSync(outputPath, jsonOutput, "utf-8");
//     return Response.json({ success: true, msg: "OK" }, { status: 200 });
//   } catch (err: unknown) {
//     if (axios.isAxiosError(err)) {
//       console.error("[PROCESS ERROR]", err.response?.data || err.message);
//       return Response.json(
//         { success: false, error: err.response?.data || err.message },
//         { status: 500 }
//       );
//     }
//     return Response.json({ success: false, error: err }, { status: 500 });
//   }
// }

export async function POST() {
  try {
    //cargar el archivo txt del lemario sacarle las filtrar las que son de 4 13
    const filePath1 = path.join(
      process.cwd(),
      "src/app/api/scrable/palabras3.json"
    );
    const fileContents1 = fs.readFileSync(filePath1, "utf8");
    const data1: string[] = JSON.parse(fileContents1);
    //!filtrar
    const lemario = data1.filter((word) => word.length > 3 && word.length < 13);
    console.log("filtered.length", lemario.length);
    //*aplico algo
    const dict: Record<string, string[]> = {};
    let count = 0;
    for (const word of lemario) {
      if (word.length >= 5 && word.length <= 7) {
        const signature = word.split("").sort().join("");
        if (!dict[signature]) dict[signature] = [];
        dict[signature].push(word);
      }
      count++;
      if (count % 100 === 0) {
        console.log(count + " palabras procesadas de ");
      }
    }
    const outputPath = path.join(
      process.cwd(),
      "src/app/api/scrable/dict.json"
    );
    const jsonOutput = JSON.stringify(dict, null, 2); // bonito con indentación
    fs.writeFileSync(outputPath, jsonOutput, "utf-8");
    return Response.json("DONE");
    //! --
    // const dict: Record<string, string[]> = {};
    // const filePath1 = path.join(
    //   process.cwd(),
    //   "src/app/api/scrable/scrableWords.json"
    // );

    // const fileContents1 = fs.readFileSync(filePath1, "utf8");
    // const lemario: string[] = JSON.parse(fileContents1);

    // let count = 0;
    // for (const word of lemario) {
    //   if (word.length >= 5 && word.length <= 7) {
    //     const signature = word.split("").sort().join("");
    //     if (!dict[signature]) dict[signature] = [];
    //     dict[signature].push(word);
    //   }
    //   count++;
    //   if (count % 100 === 0) {
    //     console.log(count + " palabras procesadas de " + lemario.length);
    //   }
    // }
    // const outputPath = path.join(
    //   process.cwd(),
    //   "src/app/api/scrable/dict.json"
    // );
    // const jsonOutput = JSON.stringify(dict, null, 2); // bonito con indentación
    // fs.writeFileSync(outputPath, jsonOutput, "utf-8");
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("[PROCESS ERROR]", err.response?.data || err.message);
      return Response.json(
        { success: false, error: err.response?.data || err.message },
        { status: 500 }
      );
    }
    return Response.json({ success: false, error: err }, { status: 500 });
  }
}
export async function GET() {
  try {
    const filePath1 = path.join(process.cwd(), "src/app/api/scrable/dict.json");
    const fileContents1 = fs.readFileSync(filePath1, "utf8");
    const data1 = JSON.parse(fileContents1);

    return Response.json(data1);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("[PROCESS ERROR]", err.response?.data || err.message);
      return Response.json(
        { success: false, error: err.response?.data || err.message },
        { status: 500 }
      );
    }
    return Response.json({ success: false, error: err }, { status: 500 });
  }
}
type PutBody = {
  dict: Dict;
  allChars: string[];
  maxLen: number;
};
type Dict = {
  [key: string]: string[];
};
// type Cell = {
//   status: Status;
//   char: string;
// };
export async function PUT(req: Request) {
  try {
    const { allChars, maxLen, dict }: PutBody = await req.json();
    const final: string[] = [];
    generarPermutacionesScrabble(
      allChars,
      2,
      maxLen,
      procesarCombinacion,
      dict,
      final
    );
    const final2 = [...new Set(final.flat(Infinity))];
    return Response.json(final2);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("[PROCESS ERROR]", err.response?.data || err.message);
      return Response.json(
        { success: false, error: err.response?.data || err.message },
        { status: 500 }
      );
    }
    return Response.json({ success: false, error: err }, { status: 500 });
  }
}

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
