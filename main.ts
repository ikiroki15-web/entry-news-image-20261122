// Penyalin gambar berita untuk entry news-image-20261122.
//
// Gambar final sudah disiapkan di repo sebagai entry.png, tepat di
// sebelah berkas ini. Tugas program hanya menyalinnya ke folder
// output agar dua run berurutan selalu menghasilkan byte yang sama
// persis (deterministik).
//
// Lokasi entry.png dicari dari direktori script ini sendiri lewat
// import.meta.url, dengan cadangan env MAKEFUN_BOT_DIR bila tersedia.
// Pencarian tidak bergantung pada working directory, karena grader
// bisa menjalankan script dari cwd mana pun.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = fileURLToPath(new URL(".", import.meta.url));
const besideScript = join(scriptDir, "entry.png");

const botDir = process.env.MAKEFUN_BOT_DIR;
const inBotDir = botDir ? join(botDir, "entry.png") : null;

const sourcePath = existsSync(besideScript)
  ? besideScript
  : inBotDir && existsSync(inBotDir)
    ? inBotDir
    : besideScript;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outputDir, "entry.png");

if (!existsSync(sourcePath)) {
  throw new Error(
    `entry.png tidak ditemukan; dicari di ${besideScript}` +
      (inBotDir ? ` dan ${inBotDir}` : ""),
  );
}

const sourceSize = statSync(sourcePath).size;
if (sourceSize === 0) {
  throw new Error(`entry.png kosong: ${sourcePath}`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

if (!existsSync(targetPath)) {
  throw new Error(`salinan tidak tercipta di ${targetPath}`);
}

const writtenSize = statSync(targetPath).size;
if (writtenSize !== sourceSize) {
  throw new Error(
    `hasil salinan tidak utuh: sumber ${sourceSize} byte, output ${writtenSize} byte`,
  );
}
