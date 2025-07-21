// //import { NextResponse, NextRequest } from "next/server";
// import axios from "axios";
// //import { filt } from "./string_filtrado";
// import * as fs from "fs";
// import path from "path";
// //import palabras2 from "./palabras2.json";
// import { PrismaClient } from "@prisma/client";
// import * as readline from "readline";
// import { filt2 } from "./string_filtrado2";
// import finalWords2 from "./finalWords2.json";

// type Word = {
//   name: string;
//   difficulty: number;
// };

// type EnrichedWord = { name: string; logFreq: number };
// // Ejemplo de uso:
// //const inputFile = path.resolve(__dirname, "palabras.txt");
// //const outputFile = path.resolve(__dirname, "palabras.json");
// const prisma = new PrismaClient();

// async function importarPalabrasDesdeTxt(rutaArchivo: string) {
//   const archivo = fs.createReadStream(rutaArchivo);
//   const rl = readline.createInterface({
//     input: archivo,
//     crlfDelay: Infinity,
//   });
//   let count = 0;
//   for await (const linea of rl) {
//     // Salteamos líneas vacías
//     if (!linea.trim()) continue;

//     // Ejemplo de línea: "1.	de	9,999,518 	 65545.55"
//     const partes = linea.split(/\t+/); // separa por tabulaciones múltiples

//     if (partes.length < 4) continue;

//     const texto = partes[1].trim();
//     const frecuenciaAbsStr = partes[2].replace(/,/g, "");
//     const frecuenciaNormStr = partes[3].replace(",", "."); // reemplaza coma por punto si hace falta

//     const frecuenciaAbsoluta = parseInt(frecuenciaAbsStr);
//     const frecuenciaNorm = parseFloat(frecuenciaNormStr);

//     if (isNaN(frecuenciaAbsoluta) || isNaN(frecuenciaNorm)) continue;

//     try {
//       await prisma.palabra.upsert({
//         where: { texto },
//         update: { frecuenciaAbsoluta, frecuenciaNorm },
//         create: { texto, frecuenciaAbsoluta, frecuenciaNorm },
//       });
//     } catch (err) {
//       console.error(`❌ Error al insertar "${texto}":`, err);
//     }
//     count++;
//     if (count % 1000 === 0) {
//       console.log(`🔄 Procesadas ${count} palabras...`);
//     }
//   }
//   console.log("✅ Importación completa.");
// }
// type catWords = {
//   easy: string[];
//   medium: string[];
//   hard: string[];
// };
// export async function GET() {
//   try {
//     // const result: catWords = { easy: [], medium: [], hard: [] };
//     // result.easy = finalWords2
//     //   .filter((w) => w.difficulty === 1 || w.difficulty === 2)
//     //   .map((w) => w.name);
//     // result.medium = finalWords2
//     //   .filter((w) => w.difficulty === 3 || w.difficulty === 4)
//     //   .map((w) => w.name);
//     // result.hard = finalWords2
//     //   .filter((w) => w.difficulty === 5 || w.difficulty === 6)
//     //   .map((w) => w.name);
//     const palabras: {
//       texto: string;
//       frecuenciaAbsoluta: number;
//       frecuenciaNorm: number;
//     }[] = await prisma.$queryRaw`
//   SELECT * FROM "Palabra"
//   WHERE LENGTH(texto) IN (5, 6, 7)
// `;
//     console.log(palabras[3].frecuenciaAbsoluta);

//     const pool = palabras
//       .filter((p) => p.frecuenciaAbsoluta > 500)
//       .map((p) => p.texto);

//     console.log(pool[2]);
//     console.log(pool.length);
//     const final = palabras.map((p) => p.texto);
//     const outputPath = path.join(
//       process.cwd(),
//       "src/app/api/procesar-palabras/pool.json"
//     );
//     const jsonOutput = JSON.stringify(pool, null, 2); // bonito con indentación
//     fs.writeFileSync(outputPath, jsonOutput, "utf-8");
//     const outputPath2 = path.join(
//       process.cwd(),
//       "src/app/api/procesar-palabras/allWords.json"
//     );
//     const jsonOutput2 = JSON.stringify(final, null, 2); // bonito con indentación
//     fs.writeFileSync(outputPath2, jsonOutput2, "utf-8");
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
// export async function POST(/*req: Request*/) {
//   try {
//     // const newPalabras = palabras2.filter((p) => {
//     //   if (p.includes("-") || p.includes(" ")) return false;
//     //   else return true;
//     // });
//     // const outputPath = path.join(
//     //   process.cwd(),
//     //   "src/app/api/procesar-palabras/palabras3.json"
//     // );
//     // const jsonOutput = JSON.stringify(newPalabras, null, 2); // bonito con indentación
//     //fs.writeFileSync(outputPath, jsonOutput, "utf-8");

//     //const inputPath = path.join(
//     //  process.cwd(),
//     //  "src/app/api/procesar-palabras/CREA_total.TXT"
//     //);
//     //await importarPalabrasDesdeTxt(inputPath);
//     //!
//     // let count = 0;
//     // const words: Word[] = [];
//     // for (let i = 0; i < filt2.length; i++) {
//     //   const ele = filt2[i];
//     //   const newWord: Word = { name: ele, difficulty: 0 };
//     //   //*buscar ele en db
//     //   const foundPalabra = await prisma.palabra.findUnique({
//     //     where: { texto: ele },
//     //   });
//     //   //*si esta sacar -> el valor de frecuencia normalizada, convertirala a difiultad y asignarla a difficulty
//     //   if (foundPalabra) {
//     //     newWord.difficulty = calcularNivelLog(foundPalabra.frecuenciaNorm);
//     //   }
//     //   //*pushear a words la nueva palabra
//     //   words.push(newWord);
//     //   count++;
//     //   if (count % 1000 === 0) {
//     //     console.log(`🔄 Procesadas ${count} palabras...`);
//     //   }
//     // }
//     // console.log("✅ Palabras procesadas.");
//     // const outputPath = path.join(
//     //   process.cwd(),
//     //   "src/app/api/procesar-palabras/finalWords1.json"
//     // );
//     // const jsonOutput = JSON.stringify(words, null, 2); // bonito con indentación
//     // fs.writeFileSync(outputPath, jsonOutput, "utf-8");
//     // return Response.json({ success: true, msg: "Job done" }, { status: 200 });
//     //!
//     let count = 0;
//     const enrichedWords: EnrichedWord[] = [];

//     for (let i = 0; i < filt2.length; i++) {
//       const ele = filt2[i];

//       const foundPalabra = await prisma.palabra.findUnique({
//         where: { texto: ele },
//       });

//       if (foundPalabra && foundPalabra.frecuenciaNorm > 0) {
//         const logFreq = Math.log(foundPalabra.frecuenciaNorm);
//         enrichedWords.push({ name: ele, logFreq });
//       }

//       count++;
//       if (count % 1000 === 0) {
//         console.log(`🔄 Procesadas ${count} palabras...`);
//       }
//     }

//     console.log("✅ Palabras encontradas en DB:", enrichedWords.length);

//     // Ordenar de mayor a menor frecuencia
//     enrichedWords.sort((a, b) => b.logFreq - a.logFreq);

//     // Asignar dificultad por percentil (1 = más frecuente, 6 = más rara)
//     const total = enrichedWords.length;
//     const chunkSize = Math.floor(total / 6);

//     const finalWords: Word[] = enrichedWords.map((w, i) => {
//       const nivel = Math.min(Math.floor(i / chunkSize) + 1, 6);
//       return { name: w.name, difficulty: nivel };
//     });

//     // Guardar en archivo
//     const outputPath = path.join(
//       process.cwd(),
//       "src/app/api/procesar-palabras/finalWords_percentil.json"
//     );
//     const jsonOutput = JSON.stringify(finalWords, null, 2);
//     fs.writeFileSync(outputPath, jsonOutput, "utf-8");

//     return Response.json({ success: true, msg: "Job done" }, { status: 200 });
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

// function asignarNivelPorPercentil(
//   palabras: {
//     texto: string;
//     frecuenciaAbsoluta: number;
//     frecuenciaNorm: number;
//   }[]
// ): { texto: string; nivel: number }[] {
//   // Usamos log(frecuencia) para ordenar
//   const ordenadas = palabras
//     .map((p) => ({ ...p, logFreq: Math.log(p.frecuencia || 1) }))
//     .sort((a, b) => b.logFreq - a.logFreq); // descendente

//   const total = ordenadas.length;
//   const chunkSize = Math.floor(total / 6);

//   return ordenadas.map((p, i) => {
//     const nivel = Math.floor(i / chunkSize) + 1;
//     return {
//       texto: p.texto,
//       nivel: Math.min(nivel, 6), // por si sobra alguna palabra
//     };
//   });
// }
// function calcularNivelLog(frecuencia: number): number {
//   const minFreq = 1;
//   const maxFreq = 1500;
//   const steps = 6;

//   // Protegemos contra valores inválidos
//   if (frecuencia <= 0) return steps;

//   const logMin = Math.log(minFreq);
//   const logMax = Math.log(maxFreq);
//   const logVal = Math.log(frecuencia);

//   const porcentaje = (logMax - logVal) / (logMax - logMin);
//   const nivel = Math.floor(porcentaje * steps) + 1;

//   return Math.min(Math.max(nivel, 1), steps);
// }
// // /**
// //  * Convierte un archivo .txt con una palabra por línea a un archivo .json con array de strings.
// //  * @param inputPath Ruta del archivo .txt de entrada
// //  * @param outputPath Ruta del archivo .json de salida
// //  */
// // function processTxtToJson(inputPath: string, outputPath: string): void {
// //   try {
// //     /*const inputPath = path.join(
// //       process.cwd(),
// //       "src/app/api/procesar-palabras/palabras.txt"
// //     );
// //     const outputPath = path.join(
// //       process.cwd(),
// //       "src/app/api/procesar-palabras/palabras.json"
// //     );
// //     console.log("ASD---", __dirname, inputPath);
// //     processTxtToJson(inputPath, outputPath);*/
// //     const rawText = fs.readFileSync(inputPath, "utf-8");
// //     const words = rawText
// //       .split("\n")
// //       .map((line) => line.trim())
// //       .filter((word) => word.length > 0); // elimina líneas vacías

// //     const jsonOutput = JSON.stringify(words, null, 2); // bonito con indentación

// //     fs.writeFileSync(outputPath, jsonOutput, "utf-8");
// //     console.log(`✅ Archivo JSON generado correctamente en: ${outputPath}`);
// //   } catch (error) {
// //     console.error("❌ Error al procesar el archivo:", error);
// //   }
// // }

// //import lemario from "../../../lib/db/lemario.json";
// // type DatamuseEntry = {
// //   word: string;
// //   tags?: string[];
// // };
// // function filtrarPorLongitud(palabras: string[]): string[] {
// //   return palabras.filter(
// //     (palabra) => palabra.length >= 5 && palabra.length <= 11
// //   );
// // }
// // function filtrarPalabrasValidas(data: DatamuseEntry[]): string[] {
// //   const palabrasFiltradas = data
// //     .filter(
// //       (entry) =>
// //         entry.tags &&
// //         (entry.tags.includes("n") ||
// //           entry.tags.includes("adj") ||
// //           entry.tags.includes("v"))
// //     )
// //     .map((entry) => entry.word);

// //   return palabrasFiltradas;
// // }

// // async function filtrarLemario() {
// //   //todo prompteo al LLM
// //   // console.log("lemario.length", lemario.length);
// //   // const promptExample =
// //   //   "visitantes,vestir,vencidos,vitalidad,velar,variar,vigilar,vecina,valdivia,verbales,vecindad,venden,visitó,vistos,vizcaya,varían,virginia,virtual,viable,vendedores,variado,velas,vergara,verbos,vasallos,valiosos,venecia,varela,vengo,viceversa,viabilidad,violentos,verla,vietnam,venas,vacíos,variada,víveres";
// //   // const response = await axios.post("http://localhost:11434/api/generate", {
// //   //   model: "llama3.2:latest", //model: 'deepseek-r1:1.5b',
// //   //   prompt: `Objetivo : Dado un string de palabras separadas por coma "," ( ejemplo : albert,martinez,perro,casa ) , colocar un asterisco "*" al principio de cada palabra que cumpla los siguientes requisitos :
// //   //       a) si la palabra es un verbo , sustantivo o adjetivo NO debe llevar asterisco * al principio
// //   //       b) la palabra es un nombre propio
// //   //       c) la palabra es un apellido
// //   //       d) la palabra es un pais o lugar
// //   //       e) la palabra es en un idioma no español
// //   //       f) el requisito a) tiene prioridad sobre los demás requisitos
// //   //       Ejemplo : "correr,alberto,alonso,perfecto,well,dibujo,croisant,alemania,sabía,lima,tucumán"
// //   //       Ejemplo de Razonamiento : correr no cumple ningun requisito no lleva nada.
// //   //                      alberto cumple el requisito b) por lo tanto va con * al principio
// //   //                      alonso cumple el requisito c) por lo tanto va con * al principio
// //   //                      croisant cumple el requisito e) por lo tanto va con * al principio
// //   //                      well cumple el requisito e) por lo tanto va con * al principio
// //   //                      alemania cumple el requisito d) por lo tanto va con * al principio
// //   //                      sabía es un verbo por lo tanto NO lleva * cunple el requisito a)
// //   //                      lima es un lugar cumple el requisito d) tambien cumple con el requisito a) ya que es un sustantivo pero por el requisito f) tiene prioridad NO lleva * al principio de la palabra
// //   //                      alemania cumple el requisito c) por lo tanto va con * al principio
// //   //                      tucumán cumple el requisito c) por lo tanto va con * al principio
// //   //       Respuesta Final: "correr,*alberto,*alonso,perfecto,*well,dibujo,*croisant,*alemania,sabía,lima,*tucumán"
// //   //       ------
// //   //       Prompt : ${promptExample}
// //   //       `,
// //   //   stream: false,
// //   //   system_prompt:
// //   //     "Eres un experto en categorizar y filtrar palabras del lenguaje español y solo respondes a tus objetivos sin dar ningun tipo de explicación.",
// //   // });
// //   // const data = response.data as any;
// //   // return data.response;
// //   //   const promptExample =
// //   //     "visitantes,vestir,vencidos,vitalidad,velar,variar,vigilar,vecina,valdivia,verbales,vecindad,venden,visitó,vistos,vizcaya,varían,virginia";
// //   //   const response = await axios.post("http://localhost:11434/api/generate", {
// //   //     model: "llama3.1:8b",
// //   //     prompt: `
// //   // Dado un string con palabras separadas por comas, devolvé exactamente el mismo string pero con un asterisco * al principio de cada palabra que cumpla alguna de estas condiciones:
// //   // - La palabra es un nombre propio, apellido, país, lugar o idioma no español.
// //   // Sin embargo, si la palabra es un verbo, sustantivo o adjetivo, **no debe llevar asterisco**, incluso si cumple las otras condiciones.
// //   // Ejemplo:
// //   // Entrada: correr,alberto,alonso,perfecto,well,dibujo,croisant,alemania,sabía,lima,tucumán
// //   // Salida: correr,*alberto,*alonso,perfecto,*well,dibujo,*croisant,*alemania,sabía,lima,*tucumán
// //   // Entrada: ${promptExample}
// //   // Salida:`,
// //   //     stream: false,
// //   //     system_prompt:
// //   //       "Eres un experto lingüista que responde únicamente con el string corregido, sin dar explicaciones ni código.",
// //   //   });
// //   //   const data = response.data as any;
// //   //   return data.response;
// // }

// // export async function POST(/*req: Request*/) {
// //   try {
// //     console.log(filt.length);
// //     const palabras: string[] = filt.split(",").map((p) => p.trim());
// //     console.log(palabras.length);
// //     const final: string[] = palabras.filter((p) => p[0] !== "*");

// //     //! cargar todas las palabras
// //     // const body = await req.json();
// //     // const letra: string = body.letra;
// //     // console.log(letra);
// //     // // tiene que tener la propiedad tags - > y dentro de los tags tiene que tener "n" o "adj" o "v" y no tiene que tener "adv"
// //     // const res = await axios.get(
// //     //   `https://api.datamuse.com/words?sp=${letra}*&v=es&max=10000&md=ps`
// //     // );
// //     // const filtradas = filtrarPalabrasValidas(res.data);
// //     // const acortadas = filtrarPorLongitud(filtradas);
// //     // return Response.json({ success: true, data: acortadas });
// //     //! filtrar con llm los nombres propios, los apellidos, los paises o lugares , las palabras en otros idiomas que no sean español
// //     //const res = await filtrarLemario();
// //     return Response.json({ success: true, data: final });
// //   } catch (err: unknown) {
// //     if (axios.isAxiosError(err)) {
// //       console.error("[PROCESS ERROR]", err.response?.data || err.message);
// //       return Response.json(
// //         { success: false, error: err.response?.data || err.message },
// //         { status: 500 }
// //       );
// //     }
// //     return Response.json(
// //       { success: false, error: "Unexpected error" },
// //       { status: 500 }
// //     );
// //   }
// // }
