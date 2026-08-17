/**
 * Eén lamp, op de hoogte van een Mushroom-kaart ernaast.
 *
 * De rij is horizontaal: chip, naam met percentage, en de schuif ernaast. Dat is
 * niet alleen compacter dan de schuif eronder -- het maakt de kaart precies één
 * rasterrij hoog (56px), zodat een kolom met kaarten van verschillende makelij
 * toch één kolom blijft.
 *
 * Kan de lamp kleur of kleurtemperatuur, dan komen die strips eronder en is de
 * kaart twee rijen. Ze staan er ook als de lamp uit is, gedempt en niet te
 * bedienen: verschijnen en verdwijnen zou de kaart bij elke schakeling van
 * hoogte laten springen, en in een raster met vaste rijen betekent dat een gat.
 *
 * De schuiven schrijven bij loslaten, niet tijdens het slepen: `light.turn_on`
 * op elke pixel overspoelt de bus en laat oudere Zigbee-lampen zichtbaar
 * stotteren. De vulling volgt de vinger meteen, dus het voelt wel live.
 */

import { DacCard, registerCard, registerEditor, rowsFor, INCOMPLETE } from "../base.js";
import { DacEditor, sel } from "../editor/base.js";
import { resolve } from "../icons.js";
import { bindActions, isDead, moreInfo, nameOf, stateOf } from "../ha.js";

const DIMMABLE = new Set(["brightness", "color_temp", "hs", "rgb", "rgbw", "rgbww", "xy", "white"]);
const COLOURFUL = new Set(["hs", "rgb", "rgbw", "rgbww", "xy"]);

const modesOf = (st) => st?.attributes?.supported_color_modes ?? [];
const isDimmable = (st) => modesOf(st).some((m) => DIMMABLE.has(m));
const hasColour = (st) => modesOf(st).some((m) => COLOURFUL.has(m));
const hasTemp = (st) => modesOf(st).includes("color_temp");

const pct = (brightness) => Math.max(1, Math.round(((brightness ?? 0) / 255) * 100));

class LightCard extends DacCard {
  static css = /* css */ `
    :host { display: block; height: 100%; }

    .card {
      height: 100%; min-height: 56px; padding: 7px 12px;
      display: flex; flex-direction: column; justify-content: center; gap: 7px;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    /* ---- de rij: chip, naam, schuif. Samen 40px hoog. ---- */
    .lamp { display: flex; align-items: center; gap: 11px; min-height: 40px; }

    .chip { width: 40px; height: 40px; cursor: pointer; }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    .lamp[data-on="false"] .chip {
      color: var(--dac-ink-3); background: rgba(255,255,255,.05); border-color: var(--dac-border);
    }
    /* Een brandende lamp gloeit een beetje. Dat is de enige plek in de familie
       waar een schaduw betekenis draagt in plaats van diepte. */
    .lamp[data-on="true"] .chip {
      box-shadow: 0 0 14px -2px color-mix(in srgb, var(--tone) 55%, transparent);
    }

    .txt { min-width: 0; flex: 0 1 auto; display: flex; flex-direction: column; }
    .nm {
      font-size: 13.5px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .v { font-size: 11.5px; color: var(--dac-ink-2); font-variant-numeric: tabular-nums; line-height: 1.25; }

    /* ---- schuiven ---- */
    .slider { position: relative; flex: 1 1 90px; min-width: 70px; height: 32px; }
    .slider .track {
      position: absolute; inset: 0; border-radius: 10px;
      background: var(--strip, rgba(255,255,255,.075)); overflow: hidden;
    }
    .slider .fill {
      position: absolute; inset: 0 auto 0 0; width: var(--v, 0%);
      border-radius: 10px;
      background: linear-gradient(90deg,
        color-mix(in srgb, var(--tone) 55%, transparent), var(--tone));
      transition: width 90ms linear;
    }
    .slider[data-strip] .fill { display: none; }
    .slider input {
      position: absolute; inset: 0; width: 100%; height: 100%; margin: 0;
      appearance: none; -webkit-appearance: none; background: transparent; cursor: ew-resize;
      touch-action: pan-y;
    }
    .slider input::-webkit-slider-thumb {
      -webkit-appearance: none; width: 6px; height: 32px; border-radius: 3px; border: 0;
      background: rgba(255,255,255,.9); box-shadow: 0 0 6px rgba(0,0,0,.5); cursor: ew-resize;
    }
    .slider input::-moz-range-thumb {
      width: 6px; height: 32px; border-radius: 3px; border: 0;
      background: rgba(255,255,255,.9); box-shadow: 0 0 6px rgba(0,0,0,.5); cursor: ew-resize;
    }
    .slider input:focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; border-radius: 10px; }

    /* ---- kleur en wit ---- */
    .colour { display: flex; gap: 8px; }
    .colour[hidden] { display: none; }
    .colour .slider { height: 26px; flex: 1 1 0; }
    .colour .slider .track { border-radius: 8px; }
    .colour .slider input::-webkit-slider-thumb { height: 26px; }
    .colour .slider input::-moz-range-thumb { height: 26px; }
    /* Uit is uit: de strips blijven staan zodat de hoogte niet springt, maar ze
       stellen niets voor zolang er niets brandt. */
    :host([lamp-off]) .colour { opacity: .32; pointer-events: none; }

    /* ---- aan/uit, voor lampen die alleen dat kunnen ---- */
    .toggle {
      flex: 0 0 auto; margin-left: auto; width: 52px; height: 30px; padding: 0; cursor: pointer;
      border-radius: var(--dac-radius-pill); position: relative;
      background: rgba(255,255,255,.08); border: 1px solid var(--dac-border);
      transition: background 200ms ease, border-color 200ms ease;
    }
    .toggle::after {
      content: ""; position: absolute; top: 3px; left: 3px; width: 22px; height: 22px;
      border-radius: 50%; background: var(--dac-ink-2);
      transition: transform 220ms cubic-bezier(.3,.8,.4,1), background 200ms ease;
    }
    .lamp[data-on="true"] .toggle {
      background: color-mix(in srgb, var(--tone) 28%, transparent);
      border-color: color-mix(in srgb, var(--tone) 55%, transparent);
    }
    .lamp[data-on="true"] .toggle::after { transform: translateX(22px); background: var(--dac-ink); }

    .lamp.unavailable { opacity: .42; }
    .lamp.unavailable .slider, .lamp.unavailable .toggle { pointer-events: none; }
  `;

  validate(config) {
    const entity = config.entity ?? config.lights?.[0] ?? config.entities?.[0];
    const id = typeof entity === "string" ? entity : entity?.entity;
    if (!id) return { ...config, [INCOMPLETE]: "Kies een lamp." };
    return { show_colour: true, ...config, entity: id };
  }

  watched() {
    return [this.config.entity];
  }

  template() {
    if (this.config.bare) this.setAttribute("bare", "");
    return `
      <div class="card surface">
        <div class="lamp" data-on="false" style="--tone:var(--dac-lit)">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <span class="txt"><span class="nm"></span><span class="v tnum"></span></span>
          <span class="ctl" style="display:contents"></span>
        </div>
        <div class="colour" hidden></div>
      </div>`;
  }

  wire() {
    this.dragging_ = new Set();
    const entity = this.config.entity;

    this.teardown_.push(
      bindActions(this.$(".chip"), {
        onTap: () => this.hass.callService("light", "toggle", { entity_id: entity }),
        onHold: () => moreInfo(this, entity),
      })
    );

    const onInput = (e) => {
      const input = e.target;
      if (input.type !== "range") return;
      const kind = input.dataset.kind;
      this.dragging_.add(kind);
      const v = +input.value;
      const s = input.closest(".slider");
      if (kind === "brightness") {
        s.style.setProperty("--v", `${v}%`);
        this.text(".v", v === 0 ? "uit" : `${v}%`);
      }
    };

    const onChange = (e) => {
      const input = e.target;
      if (input.type !== "range") return;
      const kind = input.dataset.kind;
      this.dragging_.delete(kind);
      const v = +input.value;

      if (kind === "brightness") {
        if (v === 0) this.hass.callService("light", "turn_off", { entity_id: entity });
        else this.hass.callService("light", "turn_on", { entity_id: entity, brightness_pct: v });
      } else if (kind === "hue") {
        const sat = stateOf(this.hass, entity)?.attributes?.hs_color?.[1] ?? 100;
        this.hass.callService("light", "turn_on", { entity_id: entity, hs_color: [v, sat] });
      } else if (kind === "kelvin") {
        this.hass.callService("light", "turn_on", { entity_id: entity, color_temp_kelvin: v });
      }
    };

    const card = this.$(".card");
    card.addEventListener("input", onInput);
    card.addEventListener("change", onChange);
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".toggle")) return;
      this.hass.callService("light", "toggle", { entity_id: entity });
    });
  }

  paint() {
    const c = this.config;
    const st = stateOf(this.hass, c.entity);
    const dead = isDead(st);
    const on = st?.state === "on";

    const lampEl = this.$(".lamp");
    lampEl.dataset.on = String(on);
    lampEl.classList.toggle("unavailable", dead);
    this.toggleAttribute("lamp-off", !on);

    const chip = this.$(".chip");
    const wanted = c.icon || "bulb";
    if (chip.dataset.icon !== wanted) {
      chip.dataset.icon = wanted;
      chip.innerHTML = resolve(wanted, "bulb");
    }

    this.text(".nm", nameOf(this.hass, c.entity, c.name));

    // Een lamp die kleur maakt, toont die kleur. Dat is meer waard dan welk
    // label ook: je ziet wat je krijgt voordat je de kamer in loopt.
    const rgb = on ? st?.attributes?.rgb_color : null;
    lampEl.style.setProperty("--tone", rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "var(--dac-lit)");

    const ctl = this.$(".ctl");
    const kind = dead ? "none" : isDimmable(st) ? "range" : "toggle";
    if (ctl.dataset.kind !== kind) {
      ctl.dataset.kind = kind;
      ctl.innerHTML =
        kind === "range"
          ? `<span class="slider" style="--v:0%">
               <span class="track"><span class="fill"></span></span>
               <input type="range" data-kind="brightness" min="0" max="100" step="1" value="0"
                      aria-label="Helderheid" />
             </span>`
          : kind === "toggle"
            ? `<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>`
            : "";
    }

    if (kind === "range" && !this.dragging_.has("brightness")) {
      const v = on ? pct(st.attributes.brightness) : 0;
      const input = ctl.querySelector("input");
      if (this.shadowRoot.activeElement !== input) input.value = String(v);
      ctl.querySelector(".slider").style.setProperty("--v", `${v}%`);
      this.text(".v", on ? `${v}%` : "uit");
    } else if (kind === "toggle") {
      ctl.querySelector(".toggle")?.setAttribute("aria-checked", String(on));
      this.text(".v", on ? "aan" : "uit");
    } else if (kind === "none") {
      this.text(".v", "niet bereikbaar");
    }

    this.paintColour_(st);
  }

  paintColour_(st) {
    const box = this.$(".colour");
    const want = this.config.show_colour !== false && (hasColour(st) || hasTemp(st));
    box.hidden = !want;
    if (!want) return;

    const sig = `${hasColour(st) ? "c" : ""}${hasTemp(st) ? "t" : ""}`;
    if (box.dataset.sig !== sig) {
      box.dataset.sig = sig;
      const min = st.attributes.min_color_temp_kelvin ?? 2000;
      const max = st.attributes.max_color_temp_kelvin ?? 6500;
      box.innerHTML = `
        ${
          hasColour(st)
            ? `<span class="slider" data-strip title="Kleur" style="--strip:linear-gradient(90deg,
                    hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%),
                    hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))">
                 <span class="track"></span>
                 <input type="range" data-kind="hue" min="0" max="360" step="1" value="0"
                        aria-label="Kleur" />
               </span>`
            : ""
        }
        ${
          hasTemp(st)
            ? `<span class="slider" data-strip title="Kleurtemperatuur"
                    style="--strip:linear-gradient(90deg,#ffb15e,#ffd6a8,#fff5e8,#eaf1ff,#cbdcff)">
                 <span class="track"></span>
                 <input type="range" data-kind="kelvin" min="${min}" max="${max}" step="50" value="${min}"
                        aria-label="Kleurtemperatuur" />
               </span>`
            : ""
        }`;
    }

    const hue = box.querySelector('[data-kind="hue"]');
    if (hue && !this.dragging_.has("hue") && this.shadowRoot.activeElement !== hue) {
      hue.value = String(Math.round(st.attributes.hs_color?.[0] ?? 0));
    }
    const kelvin = box.querySelector('[data-kind="kelvin"]');
    if (kelvin && !this.dragging_.has("kelvin") && this.shadowRoot.activeElement !== kelvin) {
      const k = st.attributes.color_temp_kelvin;
      if (k != null) kelvin.value = String(k);
    }
  }

  /** Hoeveel rasterrijen deze lamp inneemt: één, of twee met kleurstrips. */
  rows_() {
    const st = stateOf(this.hass, this.config?.entity);
    const colour = this.config?.show_colour !== false && st && (hasColour(st) || hasTemp(st));
    return colour ? 2 : 1;
  }

  getCardSize() {
    return this.rows_();
  }

  getGridOptions() {
    const rows = this.rows_();
    return { columns: 12, rows, min_columns: 4, min_rows: rows, max_rows: rows };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-light-card-editor");
  }

  static getStubConfig(hass, entities) {
    const light = entities?.find((e) => e.startsWith("light."));
    return light ? { entity: light } : {};
  }
}

class LightEditor extends DacEditor {
  defaults() {
    return { show_colour: true };
  }

  // Geen kleurkiezer: een brandende lamp draagt zijn eigen kleur, en uit is
  // gedempt. Daar valt niets aan te kiezen dat de kaart beter maakt.
  pickers() {
    return [{ key: "icon", kind: "icon", label: "Icoon", fallback: "bulb" }];
  }

  schema() {
    return [
      { name: "entity", selector: sel.entity("light") },
      { name: "name", selector: sel.text() },
      { name: "show_colour", selector: sel.bool() },
    ];
  }

  label(s) {
    return (
      { entity: "Lamp", name: "Naam (overschrijft die van de lamp)",
        show_colour: "Kleurstrips tonen" }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "entity")
      return "Eén lamp per kaart. Dimbaar krijgt een schuif, alleen schakelbaar een tuimelaar.";
    if (s.name === "show_colour")
      return "Kleur en kleurtemperatuur, als de lamp ze kan. De kaart wordt dan twee rijen hoog.";
    return undefined;
  }
}

registerEditor("domotiapp-light-card-editor", LightEditor);
registerCard("domotiapp-light-card", LightCard, {
  name: "DomotiApp Verlichting",
  description: "Eén lamp op één rasterrij: dimmen, kleur en kleurtemperatuur.",
});
