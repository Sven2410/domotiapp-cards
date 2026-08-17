/**
 * Lights, dimmable and not, in one card.
 *
 * The card asks the lamp what it can do rather than asking the installer.
 * `supported_color_modes` of exactly `["onoff"]` means a switch and gets a
 * switch; anything else gets a brightness slider. Making that a setting would
 * mean every dashboard has one lamp where somebody ticked the wrong box.
 *
 * The slider writes on release, not while dragging: `light.turn_on` on every
 * pixel of travel floods the bus and makes older Zigbee bulbs stutter visibly.
 * The fill follows the finger immediately, so it still feels live.
 *
 * While a finger is down, incoming states are ignored for that row. Otherwise
 * the lamp's own report of where it used to be yanks the handle back out from
 * under the drag.
 */

import { DacCard, registerCard, registerEditor, toneValue, TONES } from "../base.js?v=0.1.0";
import { DacEditor, sel, row, section, LABELS } from "../editor/base.js?v=0.1.0";
import { resolve } from "../icons.js?v=0.1.0";
import { bindActions, isDead, moreInfo, nameOf, stateOf } from "../ha.js?v=0.1.0";

const DIMMABLE = new Set(["brightness", "color_temp", "hs", "rgb", "rgbw", "rgbww", "xy", "white"]);

const isDimmable = (st) => {
  const modes = st?.attributes?.supported_color_modes ?? [];
  return modes.some((m) => DIMMABLE.has(m));
};

const pct = (brightness) => Math.max(1, Math.round(((brightness ?? 0) / 255) * 100));

class LightCard extends DacCard {
  static css = /* css */ `
    :host { display: block; }

    .card { padding: 6px 14px; }
    :host([bare]) .card {
      background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0;
    }

    .head { display: flex; align-items: baseline; gap: 10px; padding: 10px 0 4px; }
    .head b { font-size: 14px; font-weight: 600; }
    .head .sum { margin-left: auto; font-size: 12px; color: var(--dac-ink-3); font-variant-numeric: tabular-nums; }
    .head:empty { display: none; }

    .lamp {
      display: grid; grid-template-columns: 42px 1fr; gap: 12px; align-items: center;
      padding: 11px 0; min-height: var(--dac-row-h);
    }
    .lamp + .lamp { border-top: 1px solid var(--dac-border); }

    .chip {
      width: 42px; height: 42px; cursor: pointer;
      background: color-mix(in srgb, var(--tone) 13%, transparent);
      border-color: color-mix(in srgb, var(--tone) 30%, transparent);
      transition: color 200ms ease, background 200ms ease, border-color 200ms ease;
    }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    .lamp[data-on="false"] .chip {
      color: var(--dac-ink-3);
      background: rgba(255,255,255,.05);
      border-color: var(--dac-border);
    }
    /* A lit lamp glows a little. It is the one place in the family where a
       shadow carries meaning rather than depth. */
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

    /* ---- brightness ---- */
    .slider { position: relative; height: 26px; margin-top: 7px; }
    .slider .track {
      position: absolute; inset: 9px 0; border-radius: var(--dac-radius-pill);
      background: rgba(255,255,255,.075); overflow: hidden;
    }
    .slider .fill {
      position: absolute; inset: 0 auto 0 0; width: var(--v, 0%);
      border-radius: var(--dac-radius-pill);
      background: linear-gradient(90deg,
        color-mix(in srgb, var(--tone) 45%, transparent), var(--tone));
      transition: width 90ms linear;
    }
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
    .slider input:focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; border-radius: 10px; }

    /* ---- on/off, for lamps that only do that ---- */
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
    if (!list.length) {
      throw new Error("domotiapp-light-card: kies minstens één lamp.");
    }
    return {
      ...config,
      lights: list.map((l) => (typeof l === "string" ? { entity: l } : l)),
    };
  }

  watched() {
    return this.config.lights.map((l) => l.entity);
  }

  toneFor(light) {
    return toneValue(light.tone ?? this.config.tone, "lit") ?? TONES.lit;
  }

  template() {
    const c = this.config;
    if (c.bare) this.setAttribute("bare", "");

    const rows = c.lights
      .map((l, i) => {
        const tone = this.toneFor(l);
        return `
        <div class="lamp" data-i="${i}" data-on="false" style="--tone:${tone}">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <div>
            <div class="top"><span class="nm"></span><span class="v tnum"></span></div>
            <div class="ctl"></div>
          </div>
        </div>`;
      })
      .join("");

    const head =
      c.title || c.show_summary !== false
        ? `<div class="head">${c.title ? `<b>${c.title}</b>` : ""}<span class="sum"></span></div>`
        : "";

    return `<div class="card surface">${head}${rows}</div>`;
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

      // The control itself is built on first paint, once we know what the lamp
      // can do -- `supported_color_modes` is not there before the first state.
      lampEl.querySelector(".ctl").addEventListener("input", (e) => {
        const input = e.target;
        if (input.type !== "range") return;
        this.dragging_.add(i);
        const v = +input.value;
        lampEl.querySelector(".fill").style.setProperty("--v", `${v}%`);
        lampEl.querySelector(".v").textContent = v === 0 ? "uit" : `${v}%`;
      });

      lampEl.querySelector(".ctl").addEventListener("change", (e) => {
        const input = e.target;
        if (input.type !== "range") return;
        this.dragging_.delete(i);
        const v = +input.value;
        if (v === 0) {
          this.hass.callService("light", "turn_off", { entity_id: entity });
        } else {
          this.hass.callService("light", "turn_on", {
            entity_id: entity,
            brightness_pct: v,
          });
        }
      });

      lampEl.querySelector(".ctl").addEventListener("click", (e) => {
        const t = e.target.closest(".toggle");
        if (!t) return;
        this.hass.callService("light", "toggle", { entity_id: entity });
      });
    });
  }

  paint() {
    let onCount = 0;

    this.$$(".lamp").forEach((lampEl) => {
      const i = +lampEl.dataset.i;
      const cfg = this.config.lights[i];
      const st = stateOf(this.hass, cfg.entity);
      const dead = isDead(st);
      const on = st?.state === "on";
      if (on) onCount++;

      lampEl.dataset.on = String(on);
      lampEl.classList.toggle("unavailable", dead);

      const chip = lampEl.querySelector(".chip");
      const wanted = cfg.icon ?? this.config.icon ?? "bulb";
      if (chip.dataset.icon !== wanted) {
        chip.dataset.icon = wanted;
        chip.innerHTML = resolve(wanted, "bulb");
      }

      lampEl.querySelector(".nm").textContent = nameOf(this.hass, cfg.entity, cfg.name);

      // An RGB lamp shows the colour it is actually making. That is worth more
      // than any label: you see what you will get before you walk into the room.
      const rgb = on ? st?.attributes?.rgb_color : null;
      lampEl.style.setProperty(
        "--tone",
        rgb ? `rgb(${rgb[0]},${rgb[1]},${rgb[2]})` : this.toneFor(cfg)
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
                 <input type="range" min="0" max="100" step="1" value="0" aria-label="Helderheid" />
               </div>`
            : kind === "toggle"
              ? `<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>`
              : "";
      }

      const vEl = lampEl.querySelector(".v");

      if (kind === "range") {
        if (this.dragging_.has(i)) return;
        const v = on ? pct(st.attributes.brightness) : 0;
        const input = ctl.querySelector("input");
        if (document.activeElement !== input) input.value = String(v);
        ctl.querySelector(".slider").style.setProperty("--v", `${v}%`);
        ctl.querySelector(".fill").style.setProperty("--v", `${v}%`);
        vEl.textContent = dead ? "" : on ? `${v}%` : "uit";
      } else if (kind === "toggle") {
        ctl.querySelector(".toggle")?.setAttribute("aria-checked", String(on));
        vEl.textContent = on ? "aan" : "uit";
      } else {
        vEl.textContent = "niet bereikbaar";
      }
    });

    const sum = this.$(".sum");
    if (sum) {
      const total = this.config.lights.length;
      sum.textContent = onCount === 0 ? "alles uit" : `${onCount} van ${total} aan`;
    }
  }

  getCardSize() {
    return 1 + this.config.lights.length;
  }

  getGridOptions() {
    const rows = this.config.lights.length * 2 + (this.config.title ? 1 : 1);
    return { columns: 12, rows, min_columns: 6, min_rows: 3 };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-light-card-editor");
  }

  static getStubConfig(hass, entities) {
    const light = entities?.find((e) => e.startsWith("light."));
    return { lights: light ? [light] : [], title: "Verlichting" };
  }
}

class LightEditor extends DacEditor {
  pickers() {
    return [
      { key: "icon", kind: "icon", label: "Icoon (voor alle lampen)", fallback: "bulb" },
      { key: "tone", kind: "tone", label: "Kleur als de lamp niet zelf kleurt" },
    ];
  }

  schema() {
    return [
      { name: "lights", selector: { entity: { domain: "light", multiple: true } } },
      { name: "title", selector: sel.text() },
      section("Weergave", "mdi:eye", [
        row(
          { name: "show_summary", selector: sel.bool() },
          { name: "bare", selector: sel.bool() }
        ),
      ]),
    ];
  }

  label(s) {
    return (
      {
        lights: "Lampen",
        show_summary: "Aantal aan tonen",
        bare: "Zonder kaartrand",
      }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "lights")
      return "Dimbare lampen krijgen een schuif, schakelbare een tuimelaar. De kaart kijkt dat zelf op.";
    if (s.name === "bare")
      return "Zet de rand en achtergrond uit, zodat de kaart in een andere kaart past.";
    return undefined;
  }
}

registerEditor("domotiapp-light-card-editor", LightEditor);
registerCard("domotiapp-light-card", LightCard, {
  name: "DomotiApp Verlichting",
  description: "Dimbare en schakelbare lampen in één kaart, met kleurweergave voor RGB.",
});
