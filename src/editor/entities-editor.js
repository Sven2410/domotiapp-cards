/**
 * De editor van de entiteitenkaart: rijen, en per entiteit alles erop.
 *
 * Dit is de enige editor in de familie die niet één `ha-form` is, en dat is geen
 * luxe. De config is genest -- rijen met items met eigen instellingen -- en
 * `ha-form` kent geen herhalende rij. De andere kaarten omzeilen dat met platte
 * sleutels (`naam:light.x`), maar dat werkt alleen zolang er één lijst is. Bij
 * twee rijen die dezelfde entiteit mogen bevatten loopt die truc vast.
 *
 * Dus staat hier een eigen opbouw, met per rij en per item een klein `ha-form`
 * voor de velden waar Home Assistant het beter weet: de entiteitkiezer met zijn
 * zoekfunctie, en de actie-editor met elke service in huis. Wat wij zelf beter
 * kunnen -- de icoonkiezer met de getekende set -- staat ernaast.
 *
 * De opbouw wordt alleen herbouwd als de structuur verandert. Bij elke andere
 * wijziging krijgen de bestaande formulieren nieuwe data, want herbouwen tijdens
 * het typen haalt de cursor uit het veld.
 */

import "./icon-picker.js";
import "./tone-picker.js";

const clampCols = (n) => Math.min(Math.max(1, Number(n) || 2), 3);
const asItem = (i) => (typeof i === "string" ? { entity: i } : { ...i });

/** Dezelfde normalisatie als de kaart, zodat oude configs hier ook openen. */
function toRows(config) {
  if (Array.isArray(config.rows) && config.rows.length) {
    return config.rows.map((r) => ({
      columns: clampCols(r.columns),
      items: (r.items ?? r.entities ?? []).map(asItem),
    }));
  }
  const flat = (config.items ?? config.entities ?? []).map(asItem);
  return flat.length ? [{ columns: clampCols(config.columns), items: flat }] : [];
}

const CSS = `
  .dac-ed { display: flex; flex-direction: column; gap: 14px; }
  .dac-ed .rij {
    border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden;
    background: var(--card-background-color);
  }
  .dac-ed .kop {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px 8px 14px;
    border-bottom: 1px solid var(--divider-color);
  }
  .dac-ed .kop b { font-size: 13px; font-weight: 600; flex: 1 1 auto; }
  .dac-ed .kolommen { display: inline-flex; gap: 2px; padding: 3px;
    background: rgba(127,127,127,.12); border-radius: 999px; }
  .dac-ed .kolommen button {
    min-width: 30px; height: 26px; padding: 0 8px; cursor: pointer;
    border: 0; background: transparent; border-radius: 999px;
    font: inherit; font-size: 12px; color: var(--secondary-text-color);
  }
  .dac-ed .kolommen button[aria-pressed="true"] {
    background: var(--primary-color); color: var(--text-primary-color, #fff); font-weight: 600;
  }
  .dac-ed .weg {
    width: 30px; height: 30px; display: grid; place-items: center; cursor: pointer;
    border: 0; background: transparent; border-radius: 999px;
    color: var(--secondary-text-color); font-size: 17px; line-height: 1;
  }
  .dac-ed .weg:hover { background: rgba(127,127,127,.16); color: var(--error-color, #d03b3b); }
  .dac-ed .body { padding: 10px 14px 14px; }

  .dac-ed details {
    border-top: 1px solid var(--divider-color); margin-top: 8px; padding-top: 6px;
  }
  .dac-ed details > summary {
    cursor: pointer; list-style: none; padding: 6px 2px;
    font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px;
  }
  .dac-ed details > summary::-webkit-details-marker { display: none; }
  .dac-ed details > summary::before {
    content: "›"; display: inline-block; transition: transform 180ms ease;
    color: var(--secondary-text-color); font-size: 16px;
  }
  .dac-ed details[open] > summary::before { transform: rotate(90deg); }
  .dac-ed details > summary small { color: var(--secondary-text-color); font-weight: 400; }
  .dac-ed .itemvelden { padding: 4px 0 10px 16px; display: flex; flex-direction: column; gap: 10px; }

  .dac-ed .toevoegen {
    padding: 10px 14px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 500;
    border: 1px dashed var(--divider-color); border-radius: 12px;
    background: transparent; color: var(--primary-color);
  }
  .dac-ed .toevoegen:hover { background: rgba(127,127,127,.08); }
`;

class EntitiesEditor extends HTMLElement {
  constructor() {
    super();
    this.rows_ = [];
    this.rest_ = {};
  }

  setConfig(config) {
    this.rest_ = { ...config };
    delete this.rest_.rows;
    delete this.rest_.items;
    delete this.rest_.entities;
    delete this.rest_.columns;
    this.rows_ = toRows(config);
    if (!this.rows_.length) this.rows_ = [{ columns: 2, items: [] }];
    this.build_();
  }

  set hass(hass) {
    this.hass_ = hass;
    // Alleen doorgeven, niet herbouwen: HA duwt hier een nieuw hass-object
    // doorheen bij elke toestandswijziging in huis, en herbouwen tijdens het
    // typen haalt de cursor uit het veld.
    for (const el of this.querySelectorAll("ha-form, dac-icon-picker, dac-tone-picker")) {
      el.hass = hass;
    }
    if (!this.gebouwd_) this.build_();
  }

  get hass() {
    return this.hass_;
  }

  connectedCallback() {
    if (!this.gebouwd_) this.build_();
  }

  /* ------------------------------------------------------------ opbouw */

  async build_() {
    if (!this.hass_ || !this.rows_) return;
    await customElements.whenDefined("ha-form");
    this.gebouwd_ = true;
    this.replaceChildren();

    const style = document.createElement("style");
    style.textContent = CSS;
    const wrap = document.createElement("div");
    wrap.className = "dac-ed";
    this.append(style, wrap);

    this.rows_.forEach((row, r) => wrap.appendChild(this.rijBlok_(row, r)));

    const knop = document.createElement("button");
    knop.type = "button";
    knop.className = "toevoegen";
    knop.textContent = "+  Rij toevoegen";
    knop.addEventListener("click", () => {
      this.rows_.push({ columns: 2, items: [] });
      this.emit_();
      this.build_();
    });
    wrap.appendChild(knop);
  }

  rijBlok_(row, r) {
    const blok = document.createElement("div");
    blok.className = "rij";

    // ---- kop: nummer, kolommen, verwijderen ----
    const kop = document.createElement("div");
    kop.className = "kop";
    const titel = document.createElement("b");
    titel.textContent = `Rij ${r + 1}`;
    const kol = document.createElement("div");
    kol.className = "kolommen";
    for (const n of [1, 2, 3]) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = String(n);
      b.title = `${n} per rij`;
      b.setAttribute("aria-pressed", String(row.columns === n));
      b.addEventListener("click", () => {
        row.columns = n;
        kol.querySelectorAll("button").forEach((x) =>
          x.setAttribute("aria-pressed", String(x.textContent === String(n)))
        );
        this.emit_();
      });
      kol.appendChild(b);
    }
    const weg = document.createElement("button");
    weg.type = "button";
    weg.className = "weg";
    weg.title = "Rij verwijderen";
    weg.textContent = "✕";
    weg.addEventListener("click", () => {
      this.rows_.splice(r, 1);
      if (!this.rows_.length) this.rows_ = [{ columns: 2, items: [] }];
      this.emit_();
      this.build_();
    });
    kop.append(titel, kol, weg);

    // ---- body: entiteiten van deze rij, en per entiteit de details ----
    const body = document.createElement("div");
    body.className = "body";

    const lijst = document.createElement("ha-form");
    lijst.hass = this.hass_;
    lijst.data = { entities: row.items.map((i) => i.entity) };
    lijst.schema = [{ name: "entities", selector: { entity: { multiple: true } } }];
    lijst.computeLabel = () => "Entiteiten in deze rij";
    lijst.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const ids = e.detail.value.entities ?? [];
      // Bestaande instellingen behouden bij herschikken of toevoegen.
      const oud = new Map(row.items.map((i) => [i.entity, i]));
      row.items = ids.map((id) => oud.get(id) ?? { entity: id });
      this.emit_();
      this.build_();
    });
    body.appendChild(lijst);

    row.items.forEach((item, i) => body.appendChild(this.itemBlok_(row, item, i)));

    blok.append(kop, body);
    return blok;
  }

  itemBlok_(row, item, i) {
    const naam =
      item.name ||
      this.hass_?.states?.[item.entity]?.attributes?.friendly_name ||
      item.entity;

    const det = document.createElement("details");
    const sum = document.createElement("summary");
    sum.innerHTML = `${naam} <small>${item.entity}</small>`;
    det.appendChild(sum);

    const velden = document.createElement("div");
    velden.className = "itemvelden";

    const icoon = document.createElement("dac-icon-picker");
    icoon.label = "Icoon";
    icoon.hass = this.hass_;
    icoon.value = item.icon ?? "";
    icoon.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      if (e.detail.value) item.icon = e.detail.value;
      else delete item.icon;
      this.emit_();
    });

    const kleur = document.createElement("dac-tone-picker");
    kleur.label = "Kleur";
    kleur.hass = this.hass_;
    kleur.value = item.tone ?? "";
    kleur.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      if (e.detail.value) item.tone = e.detail.value;
      else delete item.tone;
      this.emit_();
    });

    const form = document.createElement("ha-form");
    form.hass = this.hass_;
    form.data = {
      name: item.name ?? "",
      show_state: item.show_state ?? true,
      tap_action: item.tap_action,
      hold_action: item.hold_action,
    };
    form.schema = [
      { name: "name", selector: { text: {} } },
      { name: "show_state", selector: { boolean: {} } },
      { name: "tap_action", selector: { ui_action: { default_action: "toggle" } } },
      { name: "hold_action", selector: { ui_action: { default_action: "more-info" } } },
    ];
    form.computeLabel = (s) =>
      ({
        name: "Naam",
        show_state: "Toestand tonen",
        tap_action: "Tikken",
        hold_action: "Vasthouden",
      })[s.name] ?? s.name;
    form.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const v = e.detail.value;
      if (v.name) item.name = v.name;
      else delete item.name;
      // `false` moet blijven staan, alleen de standaard mag weg.
      if (v.show_state === false) item.show_state = false;
      else delete item.show_state;
      if (v.tap_action) item.tap_action = v.tap_action;
      else delete item.tap_action;
      if (v.hold_action) item.hold_action = v.hold_action;
      else delete item.hold_action;
      this.emit_();
      sum.innerHTML = `${item.name || naam} <small>${item.entity}</small>`;
    });

    velden.append(icoon, kleur, form);
    det.appendChild(velden);
    return det;
  }

  /* ------------------------------------------------------------ uitvoer */

  emit_() {
    const rows = this.rows_
      .map((r) => ({ columns: r.columns, items: r.items.filter((i) => i.entity) }))
      .filter((r) => r.items.length);

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this.rest_, rows } },
        bubbles: true,
        composed: true,
      })
    );
  }
}

if (!customElements.get("domotiapp-entities-card-editor")) {
  customElements.define("domotiapp-entities-card-editor", EntitiesEditor);
}
