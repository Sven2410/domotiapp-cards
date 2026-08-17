/**
 * Eén lamp, met alles wat die lamp kan.
 *
 * De kaart vraagt de lamp wat hij kan in plaats van de installateur.
 * `supported_color_modes` van precies `["onoff"]` krijgt een tuimelaar, al het
 * andere een helderheidsschuif. Kan hij kleur of kleurtemperatuur, dan komen die
 * strips erbij -- maar alleen zolang de lamp aan staat, want kleur kiezen voor
 * een lamp die uit is regelt niets en vult wel het halve scherm.
 *
 * De schuiven schrijven bij loslaten, niet tijdens het slepen: `light.turn_on`
 * op elke pixel overspoelt de bus en laat oudere Zigbee-lampen zichtbaar
 * stotteren. De vulling volgt de vinger meteen, dus het voelt wel live.
 *
 * Zolang een vinger op een schuif staat worden binnenkomende toestanden voor die
 * schuif genegeerd, anders trekt de lamp de knop onder je hand vandaan terug
 * naar waar hij stond.
 */

import { DacCard, registerCard, registerEditor, INCOMPLETE } from "../base.js";
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
    :host { display: block; }

    .card { padding: 10px 14px 12px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .lamp {
      /* Bovenaan uitlijnen, niet centreren: zodra de kleurstrips erbij komen
         zou een gecentreerd icoon halverwege de kaart gaan zweven, los van de
         naam waar het bij hoort. */
      display: grid; grid-template-columns: 42px 1fr; gap: 12px; align-items: start;
      padding: 4px 0;
    }
    .lamp + .lamp { border-top: 1px solid var(--dac-border); margin-top: 8px; padding-top: 12px; }

    .chip {
      width: 42px; height: 42px; margin-top: -2px; cursor: pointer;
      background: color-mix(in srgb, var(--tone) 13%, transparent);
      border-color: color-mix(in srgb, var(--tone) 30%, transparent);
      transition: color 200ms ease, background 200ms ease, border-color 200ms ease;
    }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    .lamp[data-on="false"] .chip {
      color: var(--dac-ink-3); background: rgba(255,255,255,.05); border-color: var(--dac-border);
    }
    /* Een brandende lamp gloeit een beetje. Dat is de enige plek in de familie
       waar een schaduw betekenis draagt in plaats van diepte. */
    .lamp[data-on="true"] .chip {
      box-shadow: 0 0 14px -2px color-mix(in srgb, var(--tone) 55%, transparent);
    }

    .top { display: flex; align-items: baseline; gap: 8px; }
    .top .nm {
      font-size: 13.5px; font-weight: 500; min-width: 0;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .top .v {
      margin-left: auto; flex: 0 0 auto; font-size: 12.5px; color: var(--dac-ink-2);
      font-variant-numeric: tabular-nums;
    }

    /* ---- schuiven ---- */
    .slider { position: relative; height: 26px; margin-top: 7px; }
    .slider .track {
      position: absolute; inset: 9px 0; border-radius: var(--dac-radius-pill);
      background: var(--strip, rgba(255,255,255,.075)); overflow: hidden;
    }
    .slider .fill {
      position: absolute; inset: 0 auto 0 0; width: var(--v, 0%);
      border-radius: var(--dac-radius-pill);
      background: linear-gradient(90deg,
        color-mix(in srgb, var(--tone) 45%, transparent), var(--tone));
      transition: width 90ms linear;
    }
    /* Een kleurenstrip is de schaal zelf -- daar hoort geen vulling overheen. */
    .slider[data-strip] .fill { display: none; }
    .slider input {
      position: absolute; inset: -6px 0; width: 100%; height: 38px; margin: 0;
      appearance: none; -webkit-appearance: none; background: transparent; cursor: ew-resize;
      touch-action: pan-y;
    }
    .slider input::-webkit-slider-thumb {
      -webkit-appearance: none; width: 16px; height: 26px; border-radius: 6px; border: 0;
      background: var(--dac-ink); box-shadow: 0 2px 8px rgba(0,0,0,.6); cursor: ew-resize;
    }
    .slider input::-moz-range-thumb {
      width: 16px; height: 26px; border-radius: 6px; border: 0;
      background: var(--dac-ink); box-shadow: 0 2px 8px rgba(0,0,0,.6); cursor: ew-resize;
    }
    .slider[data-strip] input::-webkit-slider-thumb {
      width: 14px; border: 2px solid var(--dac-bg); box-shadow: 0 0 0 1px rgba(255,255,255,.6);
    }
    .slider[data-strip] input::-moz-range-thumb {
      width: 14px; border: 2px solid var(--dac-bg); box-shadow: 0 0 0 1px rgba(255,255,255,.6);
    }
    .slider input:focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; border-radius: 10px; }

    .colour { margin-top: 2px; }
    .colour[hidden] { display: none; }
    .colour .lbl {
      margin-top: 10px; font-size: 10.5px; font-weight: 600; letter-spacing: .12em;
      text-transform: uppercase; color: var(--dac-ink-3);
    }

    /* ---- aan/uit, voor lampen die alleen dat kunnen ---- */
    .toggle {
      margin-top: 7px; width: 52px; height: 30px; padding: 0; cursor: pointer;
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

    .lamp.unavailable { opacity: .42; pointer-events: none; }
  `;

  validate(config) {
    const list = config.lights ?? config.entities ?? (config.entity ? [config.entity] : []);
    if (!list.length) return { ...config, [INCOMPLETE]: "Kies een lamp." };
    return {
      show_colour: true,
      ...config,
      lights: list.map((l) => (typeof l === "string" ? { entity: l } : l)),
    };
  }

  watched() {
    return this.config.lights.map((l) => l.entity);
  }

  template() {
    const c = this.config;
    if (c.bare) this.setAttribute("bare", "");

    const rows = c.lights
      .map(
        (l, i) => `
        <div class="lamp" data-i="${i}" data-on="false" style="--tone:var(--dac-lit)">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <div>
            <div class="top"><span class="nm"></span><span class="v tnum"></span></div>
            <div class="ctl"></div>
            <div class="colour" hidden></div>
          </div>
        </div>`
      )
      .join("");

    return `<div class="card surface">${rows}</div>`;
  }

  wire() {
    this.dragging_ = new Set();

    this.$$(".lamp").forEach((lampEl) => {
      const i = +lampEl.dataset.i;
      const entity = this.config.lights[i].entity;

      this.teardown_.push(
        bindActions(lampEl.querySelector(".chip"), {
          onTap: () => this.hass.callService("light", "toggle", { entity_id: entity }),
          onHold: () => moreInfo(this, entity),
        })
      );

      const onInput = (e) => {
        const input = e.target;
        if (input.type !== "range") return;
        const kind = input.dataset.kind;
        this.dragging_.add(`${i}:${kind}`);
        const v = +input.value;
        input.closest(".slider").style.setProperty("--v", `${v}%`);
        if (kind === "brightness") {
          lampEl.querySelector(".v").textContent = v === 0 ? "uit" : `${v}%`;
        }
      };

      const onChange = (e) => {
        const input = e.target;
        if (input.type !== "range") return;
        const kind = input.dataset.kind;
        this.dragging_.delete(`${i}:${kind}`);
        const v = +input.value;

        if (kind === "brightness") {
          if (v === 0) this.hass.callService("light", "turn_off", { entity_id: entity });
          else this.hass.callService("light", "turn_on", { entity_id: entity, brightness_pct: v });
          return;
        }
        if (kind === "hue") {
          const sat = stateOf(this.hass, entity)?.attributes?.hs_color?.[1] ?? 100;
          this.hass.callService("light", "turn_on", { entity_id: entity, hs_color: [v, sat] });
          return;
        }
        if (kind === "kelvin") {
          this.hass.callService("light", "turn_on", { entity_id: entity, color_temp_kelvin: v });
        }
      };

      for (const host of [lampEl.querySelector(".ctl"), lampEl.querySelector(".colour")]) {
        host.addEventListener("input", onInput);
        host.addEventListener("change", onChange);
        host.addEventListener("click", (e) => {
          if (!e.target.closest(".toggle")) return;
          this.hass.callService("light", "toggle", { entity_id: entity });
        });
      }
    });
  }

  paint() {
    this.$$(".lamp").forEach((lampEl) => {
      const i = +lampEl.dataset.i;
      const cfg = this.config.lights[i];
      const st = stateOf(this.hass, cfg.entity);
      const dead = isDead(st);
      const on = st?.state === "on";

      lampEl.dataset.on = String(on);
      lampEl.classList.toggle("unavailable", dead);

      const chip = lampEl.querySelector(".chip");
      const wanted = cfg.icon ?? this.config.icon ?? "bulb";
      if (chip.dataset.icon !== wanted) {
        chip.dataset.icon = wanted;
        chip.innerHTML = resolve(wanted, "bulb");
      }

      lampEl.querySelector(".nm").textContent = nameOf(this.hass, cfg.entity, cfg.name);

      // Een lamp die kleur maakt, toont die kleur. Dat is meer waard dan welk
      // label ook: je ziet wat je krijgt voordat je de kamer in loopt.
      const rgb = on ? st?.attributes?.rgb_color : null;
      lampEl.style.setProperty(
        "--tone",
        rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : "var(--dac-lit)"
      );

      const ctl = lampEl.querySelector(".ctl");
      const dim = isDimmable(st);
      const kind = dead ? "none" : dim ? "range" : "toggle";

      if (ctl.dataset.kind !== kind) {
        ctl.dataset.kind = kind;
        ctl.innerHTML =
          kind === "range"
            ? `<div class="slider" style="--v:0%">
                 <span class="track"><span class="fill"></span></span>
                 <input type="range" data-kind="brightness" min="0" max="100" step="1" value="0"
                        aria-label="Helderheid" />
               </div>`
            : kind === "toggle"
              ? `<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>`
              : "";
      }

      const vEl = lampEl.querySelector(".v");

      if (kind === "range" && !this.dragging_.has(`${i}:brightness`)) {
        const v = on ? pct(st.attributes.brightness) : 0;
        const input = ctl.querySelector("input");
        if (this.shadowRoot.activeElement !== input) input.value = String(v);
        ctl.querySelector(".slider").style.setProperty("--v", `${v}%`);
        vEl.textContent = on ? `${v}%` : "uit";
      } else if (kind === "toggle") {
        ctl.querySelector(".toggle")?.setAttribute("aria-checked", String(on));
        vEl.textContent = on ? "aan" : "uit";
      } else if (kind === "none") {
        vEl.textContent = "niet bereikbaar";
      }

      this.paintColour_(lampEl, st, on, i);
    });
  }

  /** De kleurstrips: alleen wat de lamp kan, en alleen terwijl hij brandt. */
  paintColour_(lampEl, st, on, i) {
    const box = lampEl.querySelector(".colour");
    const want = on && this.config.show_colour !== false && (hasColour(st) || hasTemp(st));
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
            ? `<div class="lbl">Kleur</div>
               <div class="slider" data-strip style="--strip:linear-gradient(90deg,
                    hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%),
                    hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))">
                 <span class="track"></span>
                 <input type="range" data-kind="hue" min="0" max="360" step="1" value="0"
                        aria-label="Kleur" />
               </div>`
            : ""
        }
        ${
          hasTemp(st)
            ? `<div class="lbl">Wit</div>
               <div class="slider" data-strip style="--strip:linear-gradient(90deg,#ffb15e,#ffd6a8,#fff5e8,#eaf1ff,#cbdcff)">
                 <span class="track"></span>
                 <input type="range" data-kind="kelvin" min="${min}" max="${max}" step="50" value="${min}"
                        aria-label="Kleurtemperatuur" />
               </div>`
            : ""
        }`;
    }

    const hue = box.querySelector('[data-kind="hue"]');
    if (hue && !this.dragging_.has(`${i}:hue`) && this.shadowRoot.activeElement !== hue) {
      hue.value = String(Math.round(st.attributes.hs_color?.[0] ?? 0));
    }
    const kelvin = box.querySelector('[data-kind="kelvin"]');
    if (kelvin && !this.dragging_.has(`${i}:kelvin`) && this.shadowRoot.activeElement !== kelvin) {
      const k = st.attributes.color_temp_kelvin;
      if (k != null) kelvin.value = String(k);
    }
  }

  getCardSize() {
    return this.config.lights?.length ?? 1;
  }

  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
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
      { entity: "Lamp", show_colour: "Kleurstrips tonen als de lamp aan is" }[s.name] ??
      super.label(s)
    );
  }

  helper(s) {
    if (s.name === "entity")
      return "Eén lamp per kaart. Dimbaar krijgt een schuif, alleen schakelbaar een tuimelaar; kleur en kleurtemperatuur komen erbij als de lamp ze kan.";
    return undefined;
  }
}

registerEditor("domotiapp-light-card-editor", LightEditor);
registerCard("domotiapp-light-card", LightCard, {
  name: "DomotiApp Verlichting",
  description: "Eén lamp: dimmen, kleur en kleurtemperatuur, precies wat de lamp kan.",
});
