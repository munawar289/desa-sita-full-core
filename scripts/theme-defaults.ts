/**
 * Penjaga sinkronisasi nilai default tema (AC2 PRD migrasi design system).
 *
 * Kenapa ada: token tema diinjeksikan per-tenant lewat inline style `<html>`,
 * tapi `/platform` dan `/set-password` TIDAK memanggil resolusi tenant. Tanpa
 * nilai default di `@theme`, dua halaman itu kehilangan seluruh warna. Jadi
 * nilai default terpaksa tertulis dua kali: di engine dan di `globals.css`.
 *
 * Skrip ini yang membuat duplikasi itu aman — ia menulis ulang blok default
 * dari keluaran `deriveTheme(DEFAULT_THEME_SLOTS)`, dan mode periksa-nya gagal
 * kalau keduanya menyimpang.
 *
 *   node --import ./scripts/ts-loader.mjs scripts/theme-defaults.ts          → periksa
 *   node --import ./scripts/ts-loader.mjs scripts/theme-defaults.ts --write  → tulis
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { buildThemeCssVariables } from "../src/lib/theme/css.ts";
import { DEFAULT_THEME_SLOTS } from "../src/lib/theme/tokens.ts";

const CSS_PATH = fileURLToPath(new URL("../src/app/globals.css", import.meta.url));

const START = "  /* theme-default:start — DIHASILKAN scripts/theme-defaults.ts, jangan edit tangan */";
const END = "  /* theme-default:end */";

function renderBlock(): string {
  const vars = buildThemeCssVariables(DEFAULT_THEME_SLOTS);
  const lines = Object.entries(vars).map(([name, value]) => `  ${name}: ${value};`);
  return [START, ...lines, END].join("\n");
}

function replaceBlock(css: string, block: string): string {
  const start = css.indexOf(START);
  const end = css.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`Penanda blok default tidak ditemukan di ${CSS_PATH}`);
  }
  return css.slice(0, start) + block + css.slice(end + END.length);
}

const css = readFileSync(CSS_PATH, "utf8");
const block = renderBlock();
const next = replaceBlock(css, block);

if (process.argv.includes("--write")) {
  if (next === css) {
    console.log("theme-defaults: sudah sinkron, tidak ada yang ditulis.");
  } else {
    writeFileSync(CSS_PATH, next);
    console.log("theme-defaults: blok default di globals.css diperbarui.");
  }
} else if (next !== css) {
  console.error(
    "theme-defaults: nilai default di globals.css MENYIMPANG dari deriveTheme(DEFAULT_THEME_SLOTS).\n" +
      "Jalankan `npm run theme:sync` lalu periksa ulang perubahannya.",
  );
  process.exit(1);
} else {
  const count = block.split("\n").length - 2;
  console.log(`theme-defaults: ${count} token default sinkron dengan engine.`);
}
