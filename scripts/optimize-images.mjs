/**
 * Compress the photo assets in /public for the web: resize to a sane
 * maximum width and re-encode as progressive JPEG (mozjpeg).
 * Overwrites a file only when the optimized version is smaller.
 *
 * Run with:  node scripts/optimize-images.mjs
 */
import sharp from "sharp";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import path from "node:path";

// Windows: libvips' cache holds input file handles open, blocking unlink.
sharp.cache(false);

const PUBLIC_DIR = new URL("../public", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const MAX_WIDTH = 1600; // largest render is the full-bleed hero
const QUALITY = 72;

const files = (await readdir(PUBLIC_DIR)).filter((f) => /\.jpe?g$/i.test(f));
let before = 0;
let after = 0;

for (const file of files) {
  const full = path.join(PUBLIC_DIR, file);
  const tmp = full + ".tmp";
  const orig = (await stat(full)).size;
  before += orig;

  await sharp(full)
    .rotate() // respect EXIF orientation before stripping metadata
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, progressive: true, mozjpeg: true })
    .toFile(tmp);

  const optimized = (await stat(tmp)).size;
  if (optimized < orig) {
    await unlink(full);
    await rename(tmp, full);
    after += optimized;
    console.log(`${file}: ${(orig / 1024).toFixed(0)} KB -> ${(optimized / 1024).toFixed(0)} KB`);
  } else {
    await unlink(tmp);
    after += orig;
    console.log(`${file}: kept original (${(orig / 1024).toFixed(0)} KB)`);
  }
}

console.log(`\nTotal: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(1)} MB`);
