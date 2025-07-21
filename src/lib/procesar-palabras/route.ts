import axios from "axios";
import path from "path";
import fs from "fs";
export async function GET() {
  try {
    const filePath1 = path.join(
      process.cwd(),
      "src/app/api/all-words/pool.json"
    );
    const filePath2 = path.join(
      process.cwd(),
      "src/app/api/all-words/allWords.json"
    );
    const fileContents1 = fs.readFileSync(filePath1, "utf8");
    const fileContents2 = fs.readFileSync(filePath2, "utf8");
    const data1 = JSON.parse(fileContents1);
    const data2 = JSON.parse(fileContents2);
    return Response.json({ pool: data1, allWords: data2 });
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
