/**
 * DomotiApp Cards -- one Lovelace resource, the whole family.
 *
 * This is the source entry. What Home Assistant loads is dist/domotiapp-cards.js,
 * a single bundled file built from here by dev/build.mjs.
 *
 * The first version shipped the modules unbundled, because a package you can
 * read in the browser is a package you can debug on a customer's wall tablet.
 * HACS made that unworkable: for a dashboard card it registers exactly one
 * resource URL, and with a zip release that URL is the zip itself -- the browser
 * then tries to run a zip file as a module and not a single card registers.
 * One bundled file is what every other HACS card ships, and it also removes the
 * sub-module cache problem entirely. The sources stay split; only the artifact
 * is joined.
 *
 * Add a card by writing it in src/cards and importing it here. Registration
 * happens inside each card's own file, next to the class it registers.
 */

export const VERSION = "0.1.8";

import "./cards/header-card.js";
import "./cards/separator-card.js";
import "./cards/button-card.js";
import "./cards/light-card.js";
import "./cards/climate-card.js";
import "./cards/entities-card.js";
import "./cards/cover-card.js";
import "./cards/person-card.js";
import "./cards/waste-card.js";

// One line, once. A resource that says nothing is a resource you cannot tell
// apart from a resource that failed to load.
console.info(
  `%c DOMOTIAPP-CARDS %c ${VERSION} `,
  "background:#026fa1;color:#e8e4de;font-weight:600;border-radius:3px 0 0 3px;padding:2px 6px",
  "background:#12120f;color:#e8e4de;border-radius:0 3px 3px 0;padding:2px 6px"
);
