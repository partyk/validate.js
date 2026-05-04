#!/usr/bin/env node
/**
 * build.js — vytvoří dist/ soubory z src/validate.js
 *
 * Generuje:
 *   dist/validate.js      — CommonJS (UMD, nezminifikovaný)
 *   dist/validate.esm.js  — ES Module
 */

const fs   = require("fs");
const path = require("path");

const src     = path.join(__dirname, "../src/validate.js");
const distDir = path.join(__dirname, "../dist");

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

const source = fs.readFileSync(src, "utf8");

// ── 1. CJS / UMD (beze změny — already UMD) ──────────────────────────────
fs.writeFileSync(path.join(distDir, "validate.js"), source, "utf8");
console.log("✓ dist/validate.js");

// ── 2. ESM wrapper ────────────────────────────────────────────────────────
// Extrahujeme factory funkci a exportujeme ji jako default export
const esmHeader = `/**
 * validate.js — ES Module build
 * @version ${getVersion()}
 * @license MIT
 */
`;

// Obalíme do ESM — extrahujeme vnitřní factory a vyexportujeme
const esmSource = esmHeader + `
let _validate;

(function (root, factory) {
  _validate = factory();
  // Na window nepřidáváme — ESM prostředí
})(typeof window !== "undefined" ? window : global, function () {
${extractFactory(source)}
});

export default _validate;
export const { addMethod, addLocale, setLocale, locales, methods, messages, defaults } = _validate;
`;

fs.writeFileSync(path.join(distDir, "validate.esm.js"), esmSource, "utf8");
console.log("✓ dist/validate.esm.js");

// ── 3. Zkopírujeme locales do dist/locales ────────────────────────────────
const localesSrc  = path.join(__dirname, "../locales");
const localesDist = path.join(distDir, "locales");
if (!fs.existsSync(localesDist)) fs.mkdirSync(localesDist);

fs.readdirSync(localesSrc).forEach((file) => {
  if (file.endsWith(".js")) {
    fs.copyFileSync(
      path.join(localesSrc, file),
      path.join(localesDist, file)
    );
    console.log(`✓ dist/locales/${file}`);
  }
});

console.log("\n✅ Build hotový — spusť `npm run minify` pro minifikaci.");

// ─────────────────────────────────────────────────────────────────────────
function getVersion() {
  try {
    const pkg = require("../package.json");
    return pkg.version;
  } catch { return "1.0.0"; }
}

function extractFactory(umdSource) {
  // Extrahujeme obsah factory funkce (vše mezi `function () {` a posledním `}`)
  const match = umdSource.match(/\}\)\(typeof window[\s\S]+?, function \(\) \{([\s\S]+)\}\);?\s*$/);
  if (match) return match[1];
  // fallback — vrátíme celý zdroják
  return umdSource;
}
