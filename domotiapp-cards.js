/**
 * DomotiApp Cards -- one Lovelace resource, the whole family.
 *
 * No build step on purpose. Home Assistant serves this file as a module and the
 * browser fetches the imports below itself, so what runs in the browser is the
 * same text that sits in the repository. That matters for a package an
 * installer has to debug on a customer's wall tablet at half past five.
 *
 * Add a card by writing it in src/cards and importing it here. Registration
 * happens inside each card's own file, next to the class it registers.
 */

export const VERSION = "0.1.0";

import "./src/cards/header-card.js?v=0.1.0";
import "./src/cards/separator-card.js?v=0.1.0";
import "./src/cards/button-card.js?v=0.1.0";
import "./src/cards/light-card.js?v=0.1.0";
import "./src/cards/cover-card.js?v=0.1.0";
import "./src/cards/person-card.js?v=0.1.0";
import "./src/cards/waste-card.js?v=0.1.0";

// One line, once. A resource that says nothing is a resource you cannot tell
// apart from a resource that failed to load.
console.info(
  `%c DOMOTIAPP-CARDS %c ${VERSION} `,
  "background:#026fa1;color:#e8e4de;font-weight:600;border-radius:3px 0 0 3px;padding:2px 6px",
  "background:#12120f;color:#e8e4de;border-radius:0 3px 3px 0;padding:2px 6px"
);
