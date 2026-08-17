/**
 * Stamp the version onto every relative import, and onto VERSION itself.
 *
 * Why this exists. This package has no build step, which is worth a lot when you
 * are debugging on a customer's wall tablet -- but it means the browser fetches
 * every module separately and caches each one on its own. HACS busts the cache
 * on the entry file by appending `?hacstag=` to the resource URL, and that does
 * nothing at all for `./src/base.js` one level down. So after an update the
 * customer gets the new entry file wired to a mixture of old modules, which
 * fails in ways that look like nonsense.
 *
 * Stamping `?v=<version>` onto every relative import makes each file a new URL
 * whenever the version changes, so an update is an update everywhere.
 *
 *   node dev/bump.mjs 0.2.0     bump and stamp
 *   node dev/bump.mjs           re-stamp with the current version
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY = join(root, "domotiapp-cards.js");

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "dev" || e.name === ".git" || e.name === "node_modules") continue;
      out.push(...(await walk(p)));
    } else if (extname(e.name) === ".js") {
      out.push(p);
    }
  }
  return out;
}

const entry = await readFile(ENTRY, "utf8");
const current = entry.match(/export const VERSION = "([^"]+)"/)?.[1];
if (!current) {
  console.error("Geen VERSION gevonden in domotiapp-cards.js");
  process.exit(1);
}

const version = process.argv[2] ?? current;
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Ongeldige versie: ${version}. Verwacht bijvoorbeeld 0.2.0`);
  process.exit(1);
}

// Matches `from "./x.js"`, `from "../x.js?v=1"` and the bare `import "./x.js"`.
const IMPORT = /((?:from|import)\s+")(\.[^"]*?\.js)(?:\?v=[^"]*)?(")/g;

let touched = 0;
for (const file of await walk(root)) {
  const src = await readFile(file, "utf8");
  let next = src.replace(IMPORT, (_, a, path, b) => `${a}${path}?v=${version}${b}`);
  if (file === ENTRY) {
    next = next.replace(/export const VERSION = "[^"]+"/, `export const VERSION = "${version}"`);
  }
  if (next !== src) {
    await writeFile(file, next, "utf8");
    touched++;
    console.log(`  ${file.slice(root.length + 1)}`);
  }
}

console.log(`\n${current} -> ${version}   (${touched} bestand${touched === 1 ? "" : "en"} aangepast)`);
console.log("Vergeet hacs.json en de README niet als de versie ergens anders genoemd staat.");
