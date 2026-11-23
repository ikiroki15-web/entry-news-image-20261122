// Penyalin gambar berita untuk entry news-image-20261122.
// Gambar final sudah disiapkan di repo sebagai entry.png di sebelah
// berkas ini; tugas program hanya menyalinnya ke folder output
// agar dua run berurutan selalu menghasilkan byte yang sama persis.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const scriptDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();
const besideScript = join(scriptDir, "entry.png");
const inWorkingDir = join(process.cwd(), "entry.png");
const sourcePath = existsSync(besideScript) ? besideScript : inWorkingDir;
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const targetPath = join(outputDir, "entry.png");

if (!existsSync(sourcePath)) {
  throw new Error(
    `entry.png tidak ditemukan; dicari di ${besideScript} dan ${inWorkingDir}`,
  );
}

const sourceSize = statSync(sourcePath).size;
if (sourceSize === 0) {
  throw new Error(`entry.png kosong: ${sourcePath}`);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, targetPath);

const writtenSize = statSync(targetPath).size;
if (writtenSize !== sourceSize) {
  throw new Error(
    `hasil salinan tidak utuh: sumber ${sourceSize} byte, output ${writtenSize} byte`,
  );
}
