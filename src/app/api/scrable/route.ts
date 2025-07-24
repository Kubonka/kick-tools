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

export async function GET() {
  try {
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
