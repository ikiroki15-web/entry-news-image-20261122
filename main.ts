import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The finished news image sits next to this script; the harness expects a
// byte-for-byte copy of it inside the output directory.
const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourceImage = join(scriptDir, "entry.png");

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetImage = join(outputDir, "entry.png");

if (!existsSync(sourceImage)) {
  throw new Error(`entry.png is missing beside main.ts (looked in ${scriptDir})`);
}

const sourceSize = statSync(sourceImage).size;
if (sourceSize === 0) {
  throw new Error("entry.png beside main.ts is empty; refusing to copy it");
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourceImage, targetImage);

console.log(`copied entry.png (${sourceSize} bytes) -> ${targetImage}`);
