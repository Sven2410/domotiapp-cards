/**
 * A section title with a rule that fades out.
 *
 * The smallest card in the family and the one that does the most for how a
 * dashboard reads: it is what turns a column of controls into groups a person
 * can scan. Deliberately not a card surface -- a separator that sits in its own
 * box would add a second frame around every group.
 *
 * The rule fades rather than running edge to edge, because a hard line reads as
 * a divider between two equal things, and this is a heading for what follows.
 */

import { DacCard, registerCard, registerEditor, toneValue } from "../base.js";
import { DacEditor, sel, LABELS } from "../editor/base.js";
import { resolve } from "../icons.js";
import { localizeState, stateOf } from "../ha.js";

class SeparatorCard extends DacCard {
  static css = /* css */ `
    :host { display: block; }

    .sep {
      display: flex; align-items: center; gap: 10px;
      min-height: 34px;
      padding: var(--pad-y, 2px) 0;
    }

    .chip { width: 30px; height: 30px; }
    .chip .icon, .chip ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }

    h3 {
      margin: 0; min-width: 0;
      font-size: 13px; font-weight: 600; letter-spacing: .1em;
      text-transform: uppercase; color: var(--dac-ink-2);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .rule {
      flex: 1 1 auto; height: 1px; min-width: 12px;
      background: linear-gradient(90deg,
        color-mix(in srgb, var(--tone) 45%, transparent), transparent);
    }

    .sub {
      flex: 0 0 auto; font-size: 12px; color: var(--dac-ink-3);
      font-variant-numeric: tabular-nums;
    }

    /* Without an icon the title should still start where the icons above and
       below it start, or the column develops a wobble. */
    :host([no-icon]) .sep { padding-left: 2px; }
  `;

  validate(config) {
    return { icon: "", tone: "accent", line: true, ...config };
  }

  watched() {
    return this.config.secondary_entity ? [this.config.secondary_entity] : [];
  }

  template() {
    const c = this.config;
    const showIcon = c.icon !== null && c.icon !== false;
    if (!showIcon) this.setAttribute("no-icon", "");

    return `
      <div class="sep" style="--tone:${toneValue(c.tone)}">
        ${showIcon ? `<span class="chip">${resolve(c.icon, "star")}</span>` : ""}
        <h3></h3>
        ${c.line === false ? "" : `<span class="rule"></span>`}
        <span class="sub"></span>
      </div>`;
  }

  paint() {
    this.text("h3", this.config.name ?? "");

    const sub = this.$(".sub");
    if (!sub) return;

    const st = stateOf(this.hass, this.config.secondary_entity);
    if (!st) {
      sub.textContent = "";
      return;
    }

    // A sensor is its number and its unit. Anything else is a state, and it
    // gets Home Assistant's own translation rather than the raw string --
    // "heat" is not a word a customer should read on their wall.
    const unit = st.attributes.unit_of_measurement;
    sub.textContent = unit
      ? `${st.state} ${unit}`
      : st.attributes.current_temperature != null
        ? `${st.attributes.current_temperature} °C`
        : localizeState(this.hass, st);
  }

  getCardSize() {
    return 1;
  }

  getGridOptions() {
    return { columns: "full", rows: 1, min_rows: 1, max_rows: 1 };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-separator-card-editor");
  }

  static getStubConfig() {
    return { name: "Nieuwe sectie", icon: "house", tone: "accent" };
  }
}

class SeparatorEditor extends DacEditor {
  pickers() {
    return [
      { key: "icon", kind: "icon", label: LABELS.icon, fallback: "star" },
      { key: "tone", kind: "tone", label: LABELS.tone },
    ];
  }

  schema() {
    return [
      { name: "name", selector: sel.text() },
      { name: "line", selector: sel.bool() },
      { name: "secondary_entity", selector: sel.entity() },
    ];
  }

  label(s) {
    return (
      { line: "Lijn tonen", secondary_entity: "Waarde rechts (optioneel)" }[s.name] ??
      super.label(s)
    );
  }

  helper(s) {
    if (s.name === "secondary_entity")
      return "Toont de toestand van deze entiteit rechts van de lijn, bijvoorbeeld een temperatuur of een aantal.";
    return undefined;
  }
}

registerEditor("domotiapp-separator-card-editor", SeparatorEditor);
registerCard("domotiapp-separator-card", SeparatorCard, {
  name: "DomotiApp Separator",
  description: "Sectiekop met icoon en vervagende lijn.",
});
