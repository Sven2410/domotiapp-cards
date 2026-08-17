/**
 * Het werkpaard: één control, drie vormen.
 *
 * Het meeste van een dashboard is deze kaart. Hij vervangt de stapel `tile`,
 * `mushroom-entity-card` en bubble-knoppen waar een gegroeid dashboard mee
 * eindigt -- vier families die één klus doen in vier vormtalen.
 *
 * Het icoon en de kaart zijn twee knoppen. Op het icoon tikken schakelt de
 * entiteit, op de kaart tikken doet wat jij instelt -- meestal navigeren naar
 * een pop-up. Dat is hoe een ruimtetegel werkt: het lampje aan zonder de kamer
 * te openen, of de kamer openen zonder het lampje aan te doen.
 *
 * Alleen het icoon licht op als er iets aanstaat. Het hele vlak laten oplichten
 * was te veel: een kolom van acht aanstaande knoppen werd een muur in plaats van
 * een rij.
 *
 * De kleur volgt wat er hangt. Een lamp draagt zijn eigen kleur, want die weet
 * je pas als hij brandt; al het andere krijgt het accent. Een keuze "kleur volgt
 * toestand" stond hier ook, maar dat is geen keuze -- een knop die er hetzelfde
 * uitziet of het apparaat nu aan of uit staat, is een kapotte knop.
 *
 * Een kaart zonder entiteit mag en is nuttig: dat is een navigatieknop.
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

    /* Alleen het icoon draagt de toestand. Zie de kop. */
    .chip {
      cursor: pointer;
      transition: color 220ms ease, background 220ms ease,
                  border-color 220ms ease, box-shadow 220ms ease;
    }
    :host([on]) .chip {
      box-shadow: 0 0 14px -2px color-mix(in srgb, var(--tone) 55%, transparent);
    }
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

    /* Een vleug identiteitskleur op een tegel, zodat je hem van een afstand
       herkent voordat de tekst leesbaar is. Alleen op de tegelvorm: in een rij
       zou het net het oplichten worden dat er juist uit moest. */
    .wash {
      position: absolute; top: -70px; right: -60px; width: 190px; height: 190px;
      border-radius: 50%; pointer-events: none; opacity: 0;
      background: radial-gradient(circle, var(--tone) 0%, transparent 70%);
      transition: opacity 260ms ease;
    }
    :host([layout="tile"]) .wash { opacity: .10; }
    :host([layout="tile"][on]) .wash { opacity: .2; }

  `;

  validate(config) {
    return {
      layout: "row",
      show_state: true,
      show_name: true,
      show_icon: true,
      ...config,
    };
  }

  watched() {
    return [this.config.entity].filter(Boolean);
  }

  /**
   * De kleur die deze knop nu draagt.
   *
   * Een lamp draagt de kleur die hij maakt -- daar hangt hij tenslotte voor. Een
   * lichtgroep zonder eigen kleur, en alles wat geen lamp is, krijgt het accent.
   */
  tone_() {
    const c = this.config;
    if (c.tone) return toneValue(c.tone);
    if (domainOf(c.entity) !== "light") return TONES.accent;

    const st = stateOf(this.hass, c.entity);
    const rgb = st?.state === "on" ? st.attributes?.rgb_color : null;
    if (rgb) return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    return TONES.lit;
  }

  template() {
    const c = this.config;
    this.setAttribute("layout", ["row", "tile", "compact"].includes(c.layout) ? c.layout : "row");

    return `
      <div class="btn" role="button" tabindex="0" style="--tone:${this.tone_()}">
        <span class="wash"></span>
        ${c.show_icon === false ? "" : `<span class="chip" role="button" tabindex="0"></span>`}
        <span class="txt">
          ${c.show_name === false ? "" : `<span class="nm"></span>`}
          ${c.show_state === false ? "" : `<span class="st"></span>`}
        </span>
      </div>`;
  }

  wire() {
    const c = this.config;
    const fire = (which, fallback) => runAction(this, this.hass, c, c[which] ?? fallback);

    this.teardown_.push(
      bindActions(this.$(".btn"), {
        onTap: () => fire("tap_action", defaultTapAction(c.entity)),
        onHold: () => fire("hold_action", { action: c.entity ? "more-info" : "none" }),
        onDouble: c.double_tap_action
          ? () => fire("double_tap_action", { action: "none" })
          : undefined,
      })
    );

    // Het icoon is een eigen knop. Standaard schakelt hij de entiteit, zodat een
    // ruimtetegel met een lichtgroep meteen doet wat je verwacht.
    const chip = this.$(".chip");
    if (!chip) return;
    this.teardown_.push(
      bindActions(chip, {
        onTap: (e) => fire("icon_tap_action", defaultTapAction(c.entity)),
        onHold: () => fire("icon_hold_action", { action: c.entity ? "more-info" : "none" }),
      })
    );
    // Anders telt een tik op het icoon ook als een tik op de kaart.
    chip.addEventListener("click", (e) => e.stopPropagation());
    chip.addEventListener("pointerdown", (e) => e.stopPropagation());
  }

  paint() {
    const c = this.config;
    const st = stateOf(this.hass, c.entity);
    const on = isOn(st);
    const dead = Boolean(c.entity) && isDead(st);

    this.toggleAttribute("on", on);
    this.$(".btn").classList.toggle("unavailable", dead);

    // De kleur van de kaart volgt de lamp, dus die moet elke keer opnieuw.
    this.$(".btn").style.setProperty("--tone", this.tone_());

    const chip = this.$(".chip");
    if (chip) {
      const wanted = c.icon || defaultIcon(c.entity, attrsOf(this.hass, c.entity));
      if (chip.dataset.icon !== wanted) {
        chip.dataset.icon = wanted;
        chip.innerHTML = resolve(wanted);
      }
      // Uit is een echte toestand en hoort er ook zo uit te zien: de chip wordt
      // stil in plaats van zijn kleur te houden.
      chip.style.setProperty("--tone", on ? this.tone_() : "var(--dac-ink-3)");
      chip.setAttribute(
        "aria-label",
        c.entity ? `${nameOf(this.hass, c.entity, c.name)} schakelen` : "Icoon"
      );
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
    return { layout: "row", show_state: true, show_name: true, show_icon: true };
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
      { name: "icon_tap_action", selector: sel.action() },
      { name: "icon_hold_action", selector: sel.action() },
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
        icon_tap_action: "Tikken op het icoon",
        icon_hold_action: "Vasthouden op het icoon",
        tap_action: "Tikken op de kaart",
        hold_action: "Vasthouden op de kaart",
        double_tap_action: "Dubbeltikken op de kaart",
      }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "entity")
      return "Mag leeg blijven: zonder entiteit wordt dit een navigatieknop.";
    if (s.name === "icon_tap_action")
      return "Leeg laten schakelt de entiteit. Handig: het icoon schakelt de lichtgroep, de kaart navigeert naar de ruimte.";
    if (s.name === "tap_action")
      return "Wat er gebeurt als je naast het icoon tikt, bijvoorbeeld navigeren naar een pop-up.";
    return undefined;
  }
}

registerEditor("domotiapp-button-card-editor", ButtonEditor);
registerCard("domotiapp-button-card", ButtonCard, {
  name: "DomotiApp Knop",
  description: "Eén control als rij, tegel of compacte pil. Vervangt tile, mushroom-entity en bubble-knoppen.",
});
