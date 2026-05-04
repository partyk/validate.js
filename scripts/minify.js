#!/usr/bin/env node
/**
 * minify.js — minifikuje dist/ soubory pomocí terser
 *
 * Vyžaduje: npm install --save-dev terser
 *
 * Generuje:
 *   dist/validate.min.js      — minifikovaný UMD
 *   dist/validate.esm.min.js  — minifikovaný ESM
 *   dist/locales/*.min.js     — minifikované locale soubory
 */

const fs    = require("fs");
const path  = require("path");
const { minify } = require("terser");

const distDir = path.join(__dirname, "../dist");

const terserOptions = {
  compress: {
    passes: 2,
    drop_console: false,
    drop_debugger: true,
  },
  mangle: true,
  format: {
    comments: /^!/,   // zachová licenční komentáře začínající !
  },
};

async function minifyFile(inputPath, outputPath) {
  const source = fs.readFileSync(inputPath, "utf8");
  // Přidáme licenční komentář na začátek
  const withBanner = `/*! validate.js | MIT License | https://github.com/partyk/validate.js */\n` + source;
  const result = await minify(withBanner, terserOptions);
  fs.writeFileSync(outputPath, result.code, "utf8");
  const origSize = (source.length / 1024).toFixed(1);
  const minSize  = (result.code.length / 1024).toFixed(1);
  console.log(`✓ ${path.basename(outputPath)}  ${origSize}kb → ${minSize}kb`);
}

async function run() {
  const files = [
    ["validate.js",      "validate.min.js"],
    ["validate.esm.js",  "validate.esm.min.js"],
  ];

  for (const [input, output] of files) {
    const inputPath  = path.join(distDir, input);
    const outputPath = path.join(distDir, output);
    if (fs.existsSync(inputPath)) {
      await minifyFile(inputPath, outputPath);
    } else {
      console.warn(`⚠ Soubor nenalezen: ${input} — spusť nejdřív npm run build`);
    }
  }

  // Minifikace locales
  const localesDir = path.join(distDir, "locales");
  if (fs.existsSync(localesDir)) {
    const localeFiles = fs.readdirSync(localesDir).filter(
      (f) => f.endsWith(".js") && !f.endsWith(".min.js")
    );
    for (const file of localeFiles) {
      await minifyFile(
        path.join(localesDir, file),
        path.join(localesDir, file.replace(".js", ".min.js"))
      );
    }
  }

  console.log("\n✅ Minifikace hotová.");
}

run().catch((err) => {
  console.error("Chyba při minifikaci:", err.message);
  process.exit(1);
});
