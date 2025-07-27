import path from "path";
import fs from "fs";
type Dict = Record<string, string[]>;
export async function GET() {
  try {
    const filePath1 = path.join(
      process.cwd(),
      "src/app/api/helper/CREA_total.TXT"
    );

    const fileContents1 = fs.readFileSync(filePath1, "utf8");

    // Separar por líneas
    const lines = fileContents1.split(/\r?\n/);

    const words = lines.flatMap((line) => {
      // Ejemplo de línea:
      // "248416.	sistematizamos 	        5	     0.03"
      // Capturamos la palabra y el último valor
      const m = line.match(/^\s*\d+\.\s*([^\s\t]+).*?([\d.,]+)\s*$/);
      if (!m) return [];

      const palabra = m[1];
      const ultimoValor = parseFloat(m[2].replace(",", "."));

      // Excluir si el último valor es <= 0.03
      if (ultimoValor <= 0.03) return [];

      return [palabra];
    });

    // Filtrar palabras con length > 1
    const resultado = words.filter((w) => w.length > 1);

    const outputPath = path.join(
      process.cwd(),
      "src/app/api/helper/crea_filtrado.json"
    );

    const jsonOutput = JSON.stringify(resultado, null, 2);
    fs.writeFileSync(outputPath, jsonOutput, "utf-8");

    // const lines = fileContents1.split(/\r?\n/);

    // // Regex: toma "palabra" después de "número." y espacios/tabs
    // // Ej: "1.   de  9,999,518   65545.55"  -> "de"
    // const words = lines.flatMap((line) => {
    //   const m = line.match(/^\s*\d+\.\s*([^\s\t]+)\s+/);
    //   return m ? [m[1]] : [];
    // });

    // // Filtrar las palabras con length > 1
    // //const resultado = words.filter((w) => w.length > 1);

    // // (Opcional) eliminar duplicados:
    // const resultado = Array.from(new Set(words.filter((w) => w.length > 1)));

    // const outputPath = path.join(
    //   process.cwd(),
    //   "src/app/api/helper/crea_filtrado.json"
    // );

    // const jsonOutput = JSON.stringify(resultado, null, 2);
    // fs.writeFileSync(outputPath, jsonOutput, "utf-8");

    return Response.json({ status: "DONE", count: resultado.length });
  } catch (error) {
    console.log(error);
    return Response.json("{}");
  }
}
export async function POST() {
  const helperDir = path.join(process.cwd(), "src/app/api/helper");
  try {
    const palabras3Path = path.join(helperDir, "palabras3.json");
    const creaPath = path.join(helperDir, "crea_filtrado.json");
    const outPath = path.join(helperDir, "dict.json");

    const palabras3: string[] = JSON.parse(
      fs.readFileSync(palabras3Path, "utf8")
    );
    const crea: string[] = JSON.parse(fs.readFileSync(creaPath, "utf8"));

    // Normalizamos, limpiamos y deduplicamos
    const lemario = Array.from(
      new Set(
        [...palabras3, ...crea].map((w) =>
          w.normalize("NFC").toLowerCase().trim()
        )
      )
    );

    const dict: Dict = {};
    let count = 0;

    for (const word of lemario) {
      if (word.length >= 2 && word.length <= 12) {
        const signature = word
          .split("")
          .sort((a, b) => a.localeCompare(b))
          .join("");
        if (!dict[signature]) dict[signature] = [];
        // evitar duplicados dentro del mismo signature
        if (!dict[signature].includes(word)) {
          dict[signature].push(word);
        }
      }
      count++;
      if (count % 100 === 0) {
        console.log(`${count} palabras procesadas de ${lemario.length}`);
      }
    }

    // Ordenamos claves y los arrays internos
    const sortedDict: Dict = Object.fromEntries(
      Object.entries(dict)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([sig, arr]) => [
          sig,
          Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b)),
        ])
    );

    fs.writeFileSync(outPath, JSON.stringify(sortedDict, null, 2), "utf-8");

    return Response.json({
      status: "DONE",
      signatures: Object.keys(sortedDict).length,
      totalWordsInput: lemario.length,
    });
  } catch (error) {
    console.log(error);
    return Response.json("{}");
  }
}
