/**
 * Set the version in the one place that defines it, then rebuild.
 *
 * There used to be more to this: every relative import carried a `?v=<versie>`
 * because HACS only ever busts the cache on the entry file, and a customer would
 * otherwise end up running new code wired to stale modules. Bundling made that
 * whole problem disappear -- there is one file now, and HACS's own `?hacstag=`
 * is enough to retire it.
 *
 *   node dev/bump.mjs 0.2.0
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY = join(root, "src", "index.js");
const PKG = join(root, "package.json");

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version ?? "")) {
  console.error("Gebruik: node dev/bump.mjs 0.2.0");
  process.exit(1);
}

const entry = await readFile(ENTRY, "utf8");
const current = entry.match(/export const VERSION = "([^"]+)"/)?.[1];
if (!current) {
  console.error("Geen VERSION gevonden in src/index.js");
  process.exit(1);
}

await writeFile(
  ENTRY,
  entry.replace(/export const VERSION = "[^"]+"/, `export const VERSION = "${version}"`),
  "utf8"
);

const pkg = JSON.parse(await readFile(PKG, "utf8"));
pkg.version = version;
await writeFile(PKG, JSON.stringify(pkg, null, 2) + "\n", "utf8");

execFileSync(process.execPath, [join(root, "dev", "build.mjs")], { stdio: "inherit" });

console.log(`\n${current} -> ${version}`);
console.log(`Commit dist/ mee, dan:  git tag v${version} && git push --tags`);
