/**
 * Bundle src/index.js into the single file Home Assistant loads.
 *
 * Why a build step at all, in a package that was written to avoid one: HACS
 * registers exactly one resource URL for a dashboard card. Ship the modules
 * unbundled and only the entry file is served; ship them in a zip and HACS
 * registers the zip as the module, which the browser cannot run. One file is
 * what works, and it also means there are no sub-modules left to go stale in a
 * customer's browser cache.
 *
 * The sources stay split and readable in src/. Only the artifact is joined, and
 * it carries a sourcemap so a stack trace still points at the real file.
 *
 *   node dev/build.mjs            build dist/domotiapp-cards.js
 *   node dev/build.mjs --watch    rebuild while you work
 */

import { build, context } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const entry = join(root, "src", "index.js");
const outfile = join(root, "dist", "domotiapp-cards.js");

const src = await readFile(entry, "utf8");
const version = src.match(/export const VERSION = "([^"]+)"/)?.[1];
if (!version) {
  console.error("Geen VERSION gevonden in src/index.js");
  process.exit(1);
}

const options = {
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: "esm",
  // Home Assistant's own frontend targets evergreen browsers, and every card
  // here already leans on shadow DOM, adoptedStyleSheets and color-mix. There
  // is nothing to gain by transpiling below what all of that needs anyway.
  target: "es2022",
  minify: true,
  sourcemap: true,
  legalComments: "none",
  banner: {
    js: `/*! DomotiApp Cards ${version} | MIT | https://github.com/Sven2410/domotiapp-cards */`,
  },
};

await mkdir(dirname(outfile), { recursive: true });

if (process.argv.includes("--watch")) {
  const ctx = await context(options);
  await ctx.watch();
  console.log(`kijkt mee — dist/domotiapp-cards.js (${version})`);
} else {
  const result = await build({ ...options, metafile: true });
  const bytes = Object.values(result.metafile.outputs)
    .find((o) => o.entryPoint)?.bytes;
  await writeFile(join(root, "dist", ".version"), version, "utf8");
  console.log(`dist/domotiapp-cards.js  ${version}  ${(bytes / 1024).toFixed(1)} kB`);
}
