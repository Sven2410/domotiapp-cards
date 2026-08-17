/**
 * The visual editor behind every card in this package.
 *
 * Written against Home Assistant's own `ha-form` rather than a hand-rolled set
 * of inputs. That is what buys the entity picker with its search, the action
 * editor with every service in the house, and the theme and translations the
 * rest of the dialog uses -- for the price of describing the fields in a
 * schema. A card library that ships its own half of an entity picker is a
 * library that breaks the first time Home Assistant changes one.
 *
 * The editor lives in the light DOM. `ha-form` inherits the dialog's styles
 * from above, and a shadow root would cut it off from them.
 *
 * Two fields are ours because Home Assistant has no equivalent: the icon picker
 * (which shows the drawn set first) and the tone picker (which shows the token
 * palette rather than a free colour wheel, so a dashboard cannot drift off the
 * system one card at a time).
 */

import "./icon-picker.js";
import "./tone-picker.js";

/** Selector shorthands, so a card's schema reads as a list of fields. */
export const sel = {
  entity: (domains) => ({ entity: domains ? { domain: domains } : {} }),
  text: () => ({ text: {} }),
  multiline: () => ({ text: { multiline: true } }),
  bool: () => ({ boolean: {} }),
  number: (min, max, step = 1) => ({
    number: { min, max, step, mode: "box" },
  }),
  select: (options) => ({
    select: { mode: "dropdown", options },
  }),
  action: () => ({ ui_action: {} }),
};

/**
 * Twee velden naast elkaar.
 *
 * De lege `name` is niet decoratief: zonder die sleutel rendert ha-form het
 * raster wel maar de velden erin niet. Dat is waarom een uitklapblok met rijen
 * erin leeg opende terwijl er drie instellingen in hoorden te staan.
 */
export const row = (...schema) => ({ type: "grid", name: "", schema });

/** A collapsible block. Keeps the first screen of the editor short. */
export const section = (name, icon, schema, expanded = false) => ({
  type: "expandable",
  name,
  icon,
  expanded,
  schema,
});

export class DacEditor extends HTMLElement {
  constructor() {
    super();
    this.config_ = {};
    this.built_ = false;
  }

  setConfig(config) {
    // The card's own defaults are merged in before the form sees the config.
    //
    // Without this a setting that defaults to on renders as an unticked box:
    // the card behaves as if it is on, the editor says it is off, and ticking
    // it appears to do nothing because it was already true. Unticking is then
    // the only control that visibly works. Seeding the defaults makes the form
    // show what the card is actually doing.
    this.config_ = { ...this.defaults(), ...config };
    this.render_();
  }

  /**
   * Values the card applies when the config is silent.
   * Keep in step with the card's own `validate()`.
   */
  defaults() {
    return {};
  }

  set hass(hass) {
    this.hass_ = hass;
    if (this.form_) this.form_.hass = hass;
    for (const el of this.pickers_ ?? []) el.hass = hass;
    this.render_();
  }

  get hass() {
    return this.hass_;
  }

  connectedCallback() {
    this.render_();
  }

  /* ------------------------------------------------------- subclass API */

  /**
   * The fields, as an `ha-form` schema.
   * @returns {Array<object>}
   */
  schema() {
    return [];
  }

  /**
   * Fields this card wants drawn with our own pickers, in order, above the
   * form. Each is `{ key, kind: "icon" | "tone", label, fallback }`.
   */
  pickers() {
    return [];
  }

  /** Dutch labels for the schema keys. */
  label(schemaItem) {
    return LABELS[schemaItem.name] ?? schemaItem.name;
  }

  /** Optional helper text under a field. */
  helper() {
    return undefined;
  }

  /* ------------------------------------------------------------ internals */

  async render_() {
    if (!this.hass_ || !this.config_) return;
    if (this.built_) {
      this.sync_();
      return;
    }
    this.built_ = true;

    // The dialog defines these before it opens an editor, but a card previewed
    // straight after a page load can get here first.
    await customElements.whenDefined("ha-form");

    this.replaceChildren();
    this.pickers_ = [];

    const pickerDefs = this.pickers();
    if (pickerDefs.length) {
      const wrap = document.createElement("div");
      wrap.style.cssText = "display:flex;flex-direction:column;gap:12px;margin-bottom:16px";
      for (const def of pickerDefs) {
        const el = document.createElement(
          def.kind === "tone" ? "dac-tone-picker" : "dac-icon-picker"
        );
        el.label = def.label;
        el.fallback = def.fallback;
        if (def.auto === false) el.auto = false;
        if (def.statuses === false) el.statuses = false;
        el.hass = this.hass_;
        el.value = this.config_[def.key];
        el.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          this.patch_({ [def.key]: e.detail.value });
        });
        this.pickers_.push(el);
        el.dataset.key = def.key;
        wrap.appendChild(el);
      }
      this.appendChild(wrap);
    }

    const form = document.createElement("ha-form");
    form.hass = this.hass_;
    form.data = this.config_;
    form.schema = this.schema();
    form.computeLabel = (s) => this.label(s);
    form.computeHelper = (s) => this.helper(s);
    form.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      this.patch_(e.detail.value, true);
    });
    this.form_ = form;
    this.appendChild(form);
  }

  sync_() {
    if (this.form_) {
      this.form_.hass = this.hass_;
      // Het schema kan van de config afhangen -- een naamveld per gekozen
      // persoon, een kleurkeuze per gekozen sensor. Alleen `data` bijwerken
      // laat die velden nooit verschijnen.
      this.form_.schema = this.schema();
      this.form_.data = this.config_;
    }
    for (const el of this.pickers_ ?? []) {
      el.hass = this.hass_;
      el.value = this.config_[el.dataset.key];
    }
  }

  /**
   * Merge a change and tell the dashboard.
   *
   * `replace` is set when the whole form reports back, because ha-form removes
   * a key by omitting it -- clearing a field would otherwise be impossible.
   * Empty strings are dropped either way, so a config does not fill up with
   * keys holding nothing.
   */
  patch_(patch, replace = false) {
    const next = replace ? { ...patch } : { ...this.config_, ...patch };
    if (this.config_.type) next.type = this.config_.type;

    for (const [k, v] of Object.entries(next)) {
      if (v === "" || v === undefined || v === null) delete next[k];
    }

    this.config_ = next;
    this.sync_();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.serialize(next) },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Turn the form's own shape back into the config that gets written to YAML.
   *
   * `ha-form` works on a flat object, but a config is sometimes a list of
   * objects -- a person with a name of their own, a fraction with its colour.
   * A card that needs that expands the list into flat fields in `setConfig` and
   * folds it back here, so the dashboard never sees the editor's scaffolding.
   */
  serialize(config) {
    return config;
  }
}

/**
 * Labels shared across the family.
 *
 * Written the way an installer would say them out loud, not the way the key is
 * spelled: a customer reads "Vasthouden", never "hold_action".
 */
export const LABELS = {
  entity: "Entiteit",
  entities: "Entiteiten",
  name: "Naam",
  icon: "Icoon",
  tone: "Kleur",
  secondary: "Tweede regel",
  layout: "Vorm",
  tap_action: "Tikken",
  hold_action: "Vasthouden",
  double_tap_action: "Dubbeltikken",
  show_state: "Toestand tonen",
  show_name: "Naam tonen",
  show_icon: "Icoon tonen",
  fill: "Vullen",
  collapsible: "Inklapbaar",
  title: "Titel",
  subtitle: "Ondertitel",
  weather: "Weerentiteit",
  sun: "Zon-entiteit",
  person: "Persoon",
  persons: "Personen",
  covers: "Rolluiken",
  lights: "Lampen",
  sensors: "Sensoren",
  greeting: "Begroeting",
  show_clock: "Klok tonen",
  show_weather: "Weer tonen",
  show_chips: "Weerdetails tonen",
  compact: "Compact",
  columns: "Kolommen",
  group: "Groepsregel tonen",
  invert: "Open en dicht omdraaien",
  label: "Label",
  color: "Kleur",
  date_format: "Datumnotatie",
};
