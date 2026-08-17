/**
 * Een lijst entiteiten, per één, twee of drie naast elkaar.
 *
 * Dit is de kaart voor alles wat geen eigen kaart verdient: een rijtje
 * schakelaars, een handvol sensoren, de scenes van een kamer. Per twee naast
 * elkaar is het gebruikelijke geval -- twee korte namen passen naast elkaar en
 * je haalt de halve hoogte eruit.
 *
 * Elk item is zijn eigen knop, met eigen icoon, naam en kleur. Tikken schakelt,
 * vasthouden opent meer informatie, en wie iets anders wil zet er een eigen
 * actie onder. Dat is dezelfde afspraak als op de knopkaart, want twee kaarten
 * die verschillend reageren op dezelfde tik is precies het soort verschil
 * waarvoor deze familie bestaat.
 *
 * Alleen het icoon draagt de toestand. Een raster van zes oplichtende vlakken
 * is geen lijst meer maar een lichtkrant.
 */

import { DacCard, registerCard, registerEditor, rowsFor, toneValue, TONES, INCOMPLETE } from "../base.js";
import { DacEditor, sel } from "../editor/base.js";
import { resolve, defaultIcon } from "../icons.js";
import {
  attrsOf,
  bindActions,
  defaultTapAction,
  domainOf,
  isDead,
  isOn,
  isStateless,
  localizeState,
  nameOf,
  runAction,
  stateOf,
} from "../ha.js";

/** Hoogte van één regel, en waar de kaart zijn rasterrijen op berekent. */
const ITEM_H = 44;
const GAP = 6;

class EntitiesCard extends DacCard {
  static css = /* css */ `
    :host { display: block; height: 100%; }

    .card {
      height: 100%; padding: 6px 10px;
      display: flex; flex-direction: column; justify-content: center;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .grid {
      display: grid; gap: ${GAP}px;
      grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
    }

    .it {
      display: flex; align-items: center; gap: 10px;
      min-height: ${ITEM_H}px; padding: 2px 6px 2px 2px;
      background: none; border: 0; border-radius: var(--dac-radius-sm);
      font: inherit; color: inherit; text-align: left; cursor: pointer;
      transition: background 200ms ease;
    }
    .it:hover { background: var(--dac-surface); }

    .chip { width: 36px; height: 36px; flex: 0 0 auto; }
    .chip .icon, .chip ha-icon { width: 18px; height: 18px; --mdc-icon-size: 18px; }
    /* Alleen het icoon draagt de toestand -- zie de kop. */
    .it[data-on="true"] .chip {
      box-shadow: 0 0 12px -3px color-mix(in srgb, var(--tone) 55%, transparent);
    }

    .txt { min-width: 0; display: flex; flex-direction: column; }
    .nm {
      font-size: 13px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st {
      font-size: 11px; line-height: 1.25; color: var(--dac-ink-2);
      font-variant-numeric: tabular-nums;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st:empty { display: none; }

    .it.unavailable { opacity: .42; pointer-events: none; }

    /* Onder de 260px passen twee namen niet meer naast elkaar zonder te
       verminken, dus dan gaat het raster terug naar één kolom. */
    @container (max-width: 260px) {
      .grid { grid-template-columns: 1fr; }
    }
  `;

  validate(config) {
    const raw = config.items ?? config.entities ?? [];
    if (!raw.length) {
      return { ...config, [INCOMPLETE]: "Voeg minstens één entiteit toe." };
    }
    return {
      columns: 2,
      show_state: true,
      ...config,
      items: raw.map((i) => (typeof i === "string" ? { entity: i } : i)),
    };
  }

  watched() {
    return this.config.items.map((i) => i.entity);
  }

  /** De kleur van één item: wat de config zegt, anders wat eraan hangt. */
  tone_(item) {
    if (item.tone) return toneValue(item.tone);
    if (this.config.tone) return toneValue(this.config.tone);
    if (domainOf(item.entity) !== "light") return TONES.accent;
    const st = stateOf(this.hass, item.entity);
    const rgb = st?.state === "on" ? st.attributes?.rgb_color : null;
    return rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : TONES.lit;
  }

  template() {
    const c = this.config;
    if (c.bare) this.setAttribute("bare", "");
    // Een container-query heeft een container nodig; die zet ik hier zodat de
    // kolommen op de kaartbreedte reageren en niet op die van het scherm.
    this.style.containerType = "inline-size";

    const items = c.items
      .map(
        (_, i) => `
      <div class="it" role="button" tabindex="0" data-i="${i}">
        <span class="chip"></span>
        <span class="txt"><span class="nm"></span><span class="st"></span></span>
      </div>`
      )
      .join("");

    const cols = Math.min(Math.max(1, Number(c.columns) || 2), 3);
    return `<div class="card surface"><div class="grid" style="--cols:${cols}">${items}</div></div>`;
  }

  wire() {
    this.$$(".it").forEach((el) => {
      const item = this.config.items[+el.dataset.i];
      const fire = (which, fallback) =>
        runAction(this, this.hass, item, item[which] ?? fallback);

      this.teardown_.push(
        bindActions(el, {
          onTap: () => fire("tap_action", defaultTapAction(item.entity)),
          onHold: () => fire("hold_action", { action: "more-info" }),
        })
      );
    });
  }

  paint() {
    this.$$(".it").forEach((el) => {
      const item = this.config.items[+el.dataset.i];
      const st = stateOf(this.hass, item.entity);
      const on = isOn(st);
      const dead = isDead(st);

      el.dataset.on = String(on);
      el.classList.toggle("unavailable", dead);

      const tone = this.tone_(item);
      el.style.setProperty("--tone", tone);

      const chip = el.querySelector(".chip");
      const wanted = item.icon || defaultIcon(item.entity, attrsOf(this.hass, item.entity));
      if (chip.dataset.icon !== wanted) {
        chip.dataset.icon = wanted;
        chip.innerHTML = resolve(wanted);
      }
      chip.style.setProperty("--tone", on ? tone : "var(--dac-ink-3)");

      const name = nameOf(this.hass, item.entity, item.name);
      this.text(el.querySelector(".nm"), name);

      const stEl = el.querySelector(".st");
      if (this.config.show_state === false) {
        stEl.textContent = "";
      } else if (dead) {
        stEl.textContent = "Niet bereikbaar";
      } else if (!st || isStateless(st.entity_id)) {
        stEl.textContent = "";
      } else if (domainOf(st.entity_id) === "light" && on && st.attributes.brightness != null) {
        stEl.textContent = `${Math.round((st.attributes.brightness / 255) * 100)}%`;
      } else {
        const unit = st.attributes.unit_of_measurement;
        stEl.textContent = unit ? `${st.state} ${unit}` : localizeState(this.hass, st);
      }

      el.setAttribute("aria-label", `${name}${st ? `, ${localizeState(this.hass, st)}` : ""}`);
    });
  }

  lines_() {
    const cols = Math.min(Math.max(1, Number(this.config?.columns) || 2), 3);
    return Math.ceil((this.config?.items?.length ?? 1) / cols);
  }

  getCardSize() {
    return this.lines_();
  }

  getGridOptions() {
    const lines = this.lines_();
    const rows = rowsFor(12 + lines * ITEM_H + (lines - 1) * GAP);
    return { columns: 12, rows, min_columns: 4, min_rows: rows, max_rows: rows };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-entities-card-editor");
  }

  static getStubConfig(hass, entities) {
    return { entities: (entities ?? []).slice(0, 2), columns: 2 };
  }
}

/**
 * De editor werkt plat, de config houdt een lijst met objecten.
 *
 * `ha-form` kent geen herhalende rij, dus krijgt elke gekozen entiteit een eigen
 * naamveld, en een eigen icoon- en kleurkiezer daarboven. `serialize` vouwt dat
 * terug naar `items: [{ entity, name, icon, tone }]`, zodat de steiger nooit in
 * de YAML belandt.
 */
class EntitiesEditor extends DacEditor {
  defaults() {
    return { columns: 2, show_state: true };
  }

  setConfig(config) {
    const flat = { ...config };
    const list = (config.items ?? config.entities ?? []).map((i) =>
      typeof i === "string" ? { entity: i } : i
    );
    flat.entities = list.map((i) => i.entity);
    delete flat.items;
    for (const i of list) {
      if (i.name) flat[`naam:${i.entity}`] = i.name;
      if (i.icon) flat[`icoon:${i.entity}`] = i.icon;
      if (i.tone) flat[`kleur:${i.entity}`] = i.tone;
    }
    super.setConfig(flat);
  }

  serialize(config) {
    const out = { ...config };
    const ids = out.entities ?? [];
    out.items = ids.map((id) => {
      const item = { entity: id };
      if (out[`naam:${id}`]) item.name = out[`naam:${id}`];
      if (out[`icoon:${id}`]) item.icon = out[`icoon:${id}`];
      if (out[`kleur:${id}`]) item.tone = out[`kleur:${id}`];
      return item;
    });
    delete out.entities;
    for (const k of Object.keys(out)) {
      if (/^(naam|icoon|kleur):/.test(k)) delete out[k];
    }
    return out;
  }

  /** Een icoon- en kleurkiezer per gekozen entiteit. */
  pickers() {
    const ids = (this.config_?.entities ?? []).filter((x) => typeof x === "string");
    return ids.flatMap((id) => [
      { key: `icoon:${id}`, kind: "icon", label: `Icoon voor ${this.short_(id)}`, fallback: "star" },
      { key: `kleur:${id}`, kind: "tone", label: `Kleur voor ${this.short_(id)}` },
    ]);
  }

  short_(id) {
    return this.hass?.states?.[id]?.attributes?.friendly_name ?? id;
  }

  schema() {
    const ids = (this.config_?.entities ?? []).filter((x) => typeof x === "string");
    return [
      { name: "entities", selector: { entity: { multiple: true } } },
      {
        name: "columns",
        selector: sel.select([
          { value: 1, label: "1 per rij" },
          { value: 2, label: "2 naast elkaar" },
          { value: 3, label: "3 naast elkaar" },
        ]),
      },
      { name: "show_state", selector: sel.bool() },
      ...ids.map((id) => ({ name: `naam:${id}`, selector: sel.text() })),
    ];
  }

  label(s) {
    if (s.name.startsWith("naam:")) return `Naam voor ${this.short_(s.name.slice(5))}`;
    return (
      { entities: "Entiteiten", columns: "Kolommen", show_state: "Toestand tonen" }[s.name] ??
      super.label(s)
    );
  }

  helper(s) {
    if (s.name === "entities")
      return "Per entiteit kun je hieronder een eigen icoon, kleur en naam zetten.";
    if (s.name === "columns")
      return "Onder de 260 pixels valt de kaart vanzelf terug op één kolom.";
    return undefined;
  }
}

registerEditor("domotiapp-entities-card-editor", EntitiesEditor);
registerCard("domotiapp-entities-card", EntitiesCard, {
  name: "DomotiApp Entiteiten",
  description: "Een lijst entiteiten, per één, twee of drie naast elkaar.",
});
