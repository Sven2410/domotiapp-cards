/**
 * Tone picker: the token palette, not a colour wheel.
 *
 * A free colour input would let any dashboard drift off the system one card at
 * a time, and it would let somebody pick a green that means nothing. So the
 * choice is between named tones, split into two rows that mean different
 * things:
 *
 *   Identiteit -- what a thing *is*. Safe to use decoratively.
 *   Status     -- how a thing *is doing*. Reserved, and the picker says so.
 *
 * That split is the whole reason this control exists instead of `ha-form`'s
 * colour selector.
 */

import { TONES, TONE_LABELS } from "../base.js";
import { icons } from "../icons.js";
import { sheet, tokens } from "../theme.js";

const IDENTITY = ["accent", "solar", "house", "water", "magenta", "pink", "teal", "lit", "neutral"];
const STATUS = ["good", "warn", "bad"];

const css = /* css */ `
  :host { ${tokens} display: block; font-family: var(--dac-font); }
  *, *::before, *::after { box-sizing: border-box; }

  .label { font-size: 12px; font-weight: 500; margin-bottom: 6px;
           color: var(--secondary-text-color, var(--dac-ink-2)); }

  .box {
    border: 1px solid var(--divider-color, var(--dac-border));
    border-radius: 12px; padding: 12px;
    background: var(--card-background-color, var(--dac-bg-raise));
  }

  h4 { margin: 0 0 7px; font-size: 10.5px; font-weight: 600; letter-spacing: .12em;
       text-transform: uppercase; color: var(--secondary-text-color, var(--dac-ink-3)); }
  h4 + .row { margin-bottom: 14px; }
  .row:last-child { margin-bottom: 0; }

  .row { display: flex; flex-wrap: wrap; gap: 8px; }

  .sw {
    position: relative; width: 34px; height: 34px; padding: 0; cursor: pointer;
    border-radius: 10px; border: 2px solid transparent; background: var(--c);
    display: grid; place-items: center; color: #0c0c0a;
  }
  .sw .icon { width: 16px; height: 16px; opacity: 0; }
  .sw[aria-pressed="true"] { border-color: var(--primary-text-color, var(--dac-ink)); }
  .sw[aria-pressed="true"] .icon { opacity: 1; }
  .sw.auto {
    background: repeating-linear-gradient(45deg,
      rgba(127,127,127,.25) 0 5px, transparent 5px 10px);
    color: var(--primary-text-color, var(--dac-ink));
  }

  .note { margin: 10px 0 0; font-size: 11.5px; line-height: 1.45;
          color: var(--secondary-text-color, var(--dac-ink-3)); }

  .chosen { margin-top: 10px; font-size: 12px; color: var(--secondary-text-color, var(--dac-ink-2)); }
  .chosen b { color: var(--primary-text-color, var(--dac-ink)); font-weight: 500; }

  :focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; }
`;

let sheets = null;

class DacTonePicker extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    sheets = sheets ?? [sheet(css)];
    this.shadowRoot.adoptedStyleSheets = sheets;
    this.value_ = "";
    this.label = "Kleur";
  }

  set value(v) {
    this.value_ = v ?? "";
    if (this.built_) this.paint_();
  }

  get value() {
    return this.value_;
  }

  connectedCallback() {
    if (this.built_) return;
    this.built_ = true;
    this.build_();
  }

  swatch(key) {
    return `<button type="button" class="sw" data-tone="${key}" style="--c:${TONES[key]}"
      title="${TONE_LABELS[key]}" aria-label="${TONE_LABELS[key]}" aria-pressed="false">${icons.check}</button>`;
  }

  build_() {
    this.shadowRoot.innerHTML = `
      <div class="label"></div>
      <div class="box">
        <h4>Identiteit</h4>
        <div class="row">
          <button type="button" class="sw auto" data-tone="" title="Automatisch"
            aria-label="Automatisch" aria-pressed="false">${icons.check}</button>
          ${IDENTITY.map((k) => this.swatch(k)).join("")}
        </div>
        <h4>Status</h4>
        <div class="row">${STATUS.map((k) => this.swatch(k)).join("")}</div>
        <p class="note">
          Statuskleuren betekenen iets: goed, let op, kritiek. Gebruik ze niet om
          een kaart mooier te maken &mdash; dan zegt rood straks niets meer.
        </p>
        <div class="chosen"></div>
      </div>`;

    this.shadowRoot.querySelectorAll(".sw").forEach((b) =>
      b.addEventListener("click", () => this.emit_(b.dataset.tone))
    );

    this.paint_();
  }

  paint_() {
    if (!this.shadowRoot.firstElementChild) return;
    this.$(".label").textContent = this.label ?? "Kleur";
    this.shadowRoot
      .querySelectorAll(".sw")
      .forEach((b) => b.setAttribute("aria-pressed", String((b.dataset.tone || "") === this.value_)));
    this.$(".chosen").innerHTML = this.value_
      ? `Gekozen: <b>${TONE_LABELS[this.value_] ?? this.value_}</b>`
      : `Gekozen: <b>Automatisch</b> &mdash; de kaart kiest op domein en toestand.`;
  }

  emit_(value) {
    this.value_ = value ?? "";
    this.paint_();
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: this.value_ },
        bubbles: true,
        composed: true,
      })
    );
  }

  $(s) {
    return this.shadowRoot.querySelector(s);
  }
}

if (!customElements.get("dac-tone-picker")) {
  customElements.define("dac-tone-picker", DacTonePicker);
}
