// Penyalin gambar berita untuk entry news-image-20261122.
// Gambar final sudah disiapkan di repo sebagai entry.png di sebelah
// berkas ini; tugas program hanya menyalinnya ke folder output
// agar dua run berurutan selalu menghasilkan byte yang sama persis.

import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Direktori skrip ini sendiri, dari URL modul — tidak bergantung pada
// direktori kerja proses, yang tidak dijamin sama dengan lokasi repo.
const scriptDir = fileURLToPath(new URL(".", import.meta.url));

const candidates: string[] = [join(scriptDir, "entry.png")];
const botDir = process.env.MAKEFUN_BOT_DIR;
if (botDir) {
  candidates.push(join(botDir, "entry.png"));
}

const sourcePath = candidates.find(
  (p) => existsSync(p) && statSync(p).size > 0,
);
if (!sourcePath) {
  throw new Error(
    `entry.png tidak ditemukan atau kosong; dicari di ${candidates.join(", ")}`,
  );
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const targetPath = join(outputDir, "entry.png");

// Salinan murni byte-per-byte: tidak ada stempel waktu atau metadata
// yang ditulis ulang, jadi output selalu identik antar-run.
copyFileSync(sourcePath, targetPath);

const sourceSize = statSync(sourcePath).size;
const writtenSize = statSync(targetPath).size;
if (writtenSize !== sourceSize) {
  throw new Error(
    `hasil salinan tidak utuh: sumber ${sourceSize} byte, output ${writtenSize} byte`,
  );
}
