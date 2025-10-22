import fs from "fs";
import path from "path";

export async function loadPersona(mode = "solace") {
  const filePath = path.join(process.cwd(), "app", "persona", `${mode}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}
