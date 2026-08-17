/**
 * The workhorse: one control, three shapes.
 *
 * Most of a dashboard is this card. It replaces the pile of `tile`,
 * `mushroom-entity-card` and bubble-card buttons that a grown dashboard ends up
 * with -- four families doing one job in four visual languages.
 *
 * `state_color` is on by default and it is the only thing that decides whether
 * the chip lights up. A button that looks identical whether the lamp is on or
 * off is the most common way a smart home dashboard fails at a glance, and the
 * fix costs nothing.
 *
 * A card with no entity is legal and useful: that is a navigation button, and
 * it is how the room tiles and the floor buttons on a home view are built.
 */

import { DacCard, registerCard, registerEditor, toneValue, TONES } from "../base.js";
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

class ButtonCard extends DacCard {
  static css = /* css */ `
    :host { display: block; height: 100%; }

    .btn {
      position: relative; overflow: hidden;
      width: 100%; height: 100%; padding: 0; margin: 0;
      font: inherit; color: inherit; text-align: left; cursor: pointer;
      background: var(--dac-surface);
      border: 1px solid var(--dac-border);
      border-radius: var(--dac-radius-sm);
      box-shadow: var(--dac-shadow);
      display: flex; align-items: center; gap: 12px;
      transition: border-color 220ms ease, background 220ms ease, transform 220ms ease;
      touch-action: manipulation;
    }
    .btn:hover { border-color: var(--dac-border-hi); background: var(--dac-surface-hi); }
    .btn:active { transform: scale(.985); }

    /* On is a state, so it changes the surface, not only the icon. Kept faint:
       a row of eight lit buttons should still read as a row, not a wall. */
    :host([on]) .btn {
      background: color-mix(in srgb, var(--tone) 9%, var(--dac-surface));
      border-color: color-mix(in srgb, var(--tone) 34%, var(--dac-border));
    }

    .chip { transition: color 220ms ease, background 220ms ease, border-color 220ms ease; }
    .chip .icon, .chip ha-icon { display: block; --mdc-icon-size: 20px; }

    .txt { min-width: 0; flex: 1 1 auto; }
    .nm {
      font-size: 13.5px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st {
      margin-top: 2px; font-size: 11.5px; line-height: 1.3; color: var(--dac-ink-2);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      font-variant-numeric: tabular-nums;
    }

    /* ---- row: the default. A pill you can put six of in a column. ---- */
    :host([layout="row"]) .btn { min-height: 56px; padding: 8px 14px 8px 8px; }
    :host([layout="row"]) .chip { width: 38px; height: 38px; }
    :host([layout="row"]) .chip .icon, :host([layout="row"]) .chip ha-icon { width: 20px; height: 20px; }

    /* ---- tile: icon over label, for a grid of rooms or scenes. ---- */
    :host([layout="tile"]) .btn {
      flex-direction: column; align-items: flex-start; justify-content: space-between;
      gap: 0; padding: 14px; min-height: 96px;
    }
    :host([layout="tile"]) .chip { width: 40px; height: 40px; }
    :host([layout="tile"]) .chip .icon, :host([layout="tile"]) .chip ha-icon { width: 21px; height: 21px; }
    :host([layout="tile"]) .txt { flex: 0 0 auto; margin-top: 12px; width: 100%; }
    :host([layout="tile"]) .nm { font-size: 14px; }

    /* ---- compact: icon and name, nothing else. For a dense favourites row. ---- */
    :host([layout="compact"]) .btn {
      min-height: 44px; padding: 6px 14px 6px 6px; border-radius: var(--dac-radius-pill);
    }
    :host([layout="compact"]) .chip { width: 32px; height: 32px; border-radius: var(--dac-radius-pill); }
    :host([layout="compact"]) .chip .icon, :host([layout="compact"]) .chip ha-icon { width: 17px; height: 17px; }
    :host([layout="compact"]) .nm { font-size: 13px; }

    /* A faint wash of the identity colour, so a tile is recognisable from
       across a room before any text is legible. */
    .wash {
      position: absolute; top: -70px; right: -60px; width: 190px; height: 190px;
      border-radius: 50%; pointer-events: none; opacity: 0;
      background: radial-gradient(circle, var(--tone) 0%, transparent 70%);
      transition: opacity 260ms ease;
    }
    :host([on]) .wash { opacity: .16; }
    :host([layout="tile"]) .wash { opacity: .10; }
    :host([layout="tile"][on]) .wash { opacity: .2; }

  `;

  validate(config) {
    return {
      layout: "row",
      state_color: true,
      show_state: true,
      show_name: true,
      show_icon: true,
      ...config,
    };
  }

  watched() {
    return [this.config.entity].filter(Boolean);
  }

  /** The colour this button wears right now. */
  tone_() {
    const c = this.config;
    if (c.tone) return toneValue(c.tone);
    // No tone chosen: lamps go warm when lit, everything else takes the accent.
    // Never green -- that is reserved for status.
    if (domainOf(c.entity) === "light") return TONES.lit;
    return TONES.accent;
  }

  template() {
    const c = this.config;
    this.setAttribute("layout", ["row", "tile", "compact"].includes(c.layout) ? c.layout : "row");

    return `
      <button class="btn" type="button" style="--tone:${this.tone_()}">
        <span class="wash"></span>
        ${c.show_icon === false ? "" : `<span class="chip"></span>`}
        <span class="txt">
          ${c.show_name === false ? "" : `<span class="nm"></span>`}
          ${c.show_state === false ? "" : `<span class="st"></span>`}
        </span>
      </button>`;
  }

  wire() {
    const c = this.config;
    const btn = this.$(".btn");

    const fire = (which, fallback) =>
      runAction(this, this.hass, c, c[which] ?? fallback);

    this.teardown_.push(
      bindActions(btn, {
        onTap: () => fire("tap_action", defaultTapAction(c.entity)),
        onHold: () => fire("hold_action", { action: c.entity ? "more-info" : "none" }),
        onDouble: c.double_tap_action ? () => fire("double_tap_action", { action: "none" }) : undefined,
      })
    );
  }

  paint() {
    const c = this.config;
    const st = stateOf(this.hass, c.entity);
    const on = c.state_color !== false && isOn(st);
    const dead = Boolean(c.entity) && isDead(st);

    this.toggleAttribute("on", on);
    this.$(".btn").classList.toggle("unavailable", dead);

    const chip = this.$(".chip");
    if (chip) {
      const wanted = c.icon || defaultIcon(c.entity, attrsOf(this.hass, c.entity));
      if (chip.dataset.icon !== wanted) {
        chip.dataset.icon = wanted;
        chip.innerHTML = resolve(wanted);
      }
      // Off is a real state and it should look like one: the chip goes quiet
      // rather than keeping its colour and only changing the background.
      chip.style.setProperty("--tone", on ? this.tone_() : "var(--dac-ink-3)");
    }

    this.text(".nm", nameOf(this.hass, c.entity, c.name));

    const stEl = this.$(".st");
    if (stEl) this.text(stEl, this.secondary_(st, dead));

    this.$(".btn").setAttribute(
      "aria-label",
      `${nameOf(this.hass, c.entity, c.name)}${st ? `, ${localizeState(this.hass, st)}` : ""}`
    );
  }

  /** Wat er onder de naam staat. */
  secondary_(st, dead) {
    if (dead) return "Niet bereikbaar";
    if (!st) return "";

    // A scene has no state worth printing. "Onbekend" under every scene button
    // is noise that makes a row of them look broken.
    if (isStateless(st.entity_id)) return "";

    // A dimmed lamp should say how dim, not just "aan".
    if (domainOf(st.entity_id) === "light" && st.state === "on" && st.attributes.brightness != null) {
      return `${Math.round((st.attributes.brightness / 255) * 100)}%`;
    }
    return localizeState(this.hass, st);
  }

  getCardSize() {
    return this.config?.layout === "tile" ? 2 : 1;
  }

  getGridOptions() {
    if (this.config?.layout === "tile") {
      return { columns: 6, rows: 2, min_columns: 3, min_rows: 2, max_rows: 2 };
    }
    return { columns: 12, rows: 1, min_columns: 4, min_rows: 1, max_rows: 1 };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-button-card-editor");
  }

  static getStubConfig(hass, entities) {
    const pick =
      entities?.find((e) => e.startsWith("light.")) ??
      entities?.find((e) => e.startsWith("switch.")) ??
      entities?.[0];
    return { entity: pick, layout: "row" };
  }
}

class ButtonEditor extends DacEditor {
  // Zonder deze stonden alle vinkjes uit terwijl de instelling aanstond:
  // aanzetten deed dan niets en alleen uitzetten had zichtbaar effect.
  defaults() {
    return {
      layout: "row",
      state_color: true,
      show_state: true,
      show_name: true,
      show_icon: true,
    };
  }

  pickers() {
    return [
      { key: "icon", kind: "icon", label: "Icoon", fallback: "star" },
      { key: "tone", kind: "tone", label: "Kleur" },
    ];
  }

  // Alles op één niveau. De instellingen zaten in uitklapblokken en die openden
  // leeg, omdat een ha-form-raster zonder `name` zijn velden niet tekent.
  schema() {
    return [
      { name: "entity", selector: sel.entity() },
      { name: "name", selector: sel.text() },
      {
        name: "layout",
        selector: sel.select([
          { value: "row", label: "Rij" },
          { value: "tile", label: "Tegel" },
          { value: "compact", label: "Compact" },
        ]),
      },
      { name: "show_icon", selector: sel.bool() },
      { name: "show_name", selector: sel.bool() },
      { name: "show_state", selector: sel.bool() },
      { name: "state_color", selector: sel.bool() },
      { name: "tap_action", selector: sel.action() },
      { name: "hold_action", selector: sel.action() },
      { name: "double_tap_action", selector: sel.action() },
    ];
  }

  label(s) {
    return (
      {
        entity: "Entiteit",
        name: "Naam (overschrijft die van de entiteit)",
        layout: "Vorm",
        show_icon: "Icoon tonen",
        show_name: "Naam tonen",
        show_state: "Toestand tonen",
        state_color: "Kleur volgt de toestand",
      }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "entity")
      return "Mag leeg blijven: zonder entiteit wordt dit een navigatieknop.";
    if (s.name === "tap_action")
      return "Leeg laten schakelt de entiteit, of opent meer informatie als schakelen niet kan.";
    return undefined;
  }
}

registerEditor("domotiapp-button-card-editor", ButtonEditor);
registerCard("domotiapp-button-card", ButtonCard, {
  name: "DomotiApp Knop",
  description: "Eén control als rij, tegel of compacte pil. Vervangt tile, mushroom-entity en bubble-knoppen.",
});
