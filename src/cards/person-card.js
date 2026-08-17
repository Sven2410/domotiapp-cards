/**
 * Who is home, in as little space as it takes.
 *
 * Deliberately small. This card sits at the top of a home view where it is
 * glanced at, not read: the question is "is anyone in", and that is answered by
 * a ring colour before any text is processed. A person tile the size of a
 * control is a tile that pushes the actual controls below the fold, and six of
 * them push them a screen down.
 *
 * So one card holds the whole household, and the default layout is a row of
 * chips. `rows` exists for the case where the extra line genuinely earns itself
 * -- a household spread over zones, where "op werk" matters more than "weg".
 *
 * The ring is green for home and amber for away. That is the one place in the
 * family where a status colour is used for something that is not a fault, and
 * it is defensible: home and away is exactly the good/attention split a person
 * reads it as, and it always ships with a written label underneath.
 */

import { DacCard, registerCard, registerEditor, toneValue, INCOMPLETE } from "../base.js";
import { DacEditor, sel, row, section } from "../editor/base.js";
import { icons, resolve } from "../icons.js";
import { bindActions, moreInfo, nameOf, stateOf } from "../ha.js";

/** The tracker's own words for where somebody is. */
function place(hass, st) {
  if (!st) return { label: "Onbekend", home: null };
  switch (st.state) {
    case "home":
      return { label: "Thuis", home: true };
    case "not_home":
      return { label: "Afwezig", home: false };
    case "unknown":
    case "unavailable":
      return { label: "Onbekend", home: null };
    default:
      // A named zone: "Werk", "School". Far more useful than "afwezig".
      return { label: st.state, home: false };
  }
}

class PersonCard extends DacCard {
  static css = /* css */ `
    :host { display: block; }

    .card { padding: 12px 14px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; }

    .head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 10px; }
    .head b { font-size: 14px; font-weight: 600; }
    .head .sum { margin-left: auto; font-size: 12px; color: var(--dac-ink-3); }

    /* ---- chips: the default. Six people fit on a phone. ---- */
    .chips { display: grid; gap: 8px; grid-template-columns: repeat(var(--cols, 6), minmax(0, 1fr)); }
    .chips .p {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 4px 2px; background: none; border: 0; cursor: pointer;
      font: inherit; color: inherit; border-radius: var(--dac-radius-sm);
      transition: background 200ms ease;
    }
    .chips .p:hover { background: var(--dac-surface); }
    .chips .nm {
      font-size: 11px; font-weight: 500; line-height: 1.2; text-align: center;
      max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .chips .st { font-size: 10px; color: var(--dac-ink-3); line-height: 1.2;
                 max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ---- rows: when the zone name is the point ---- */
    .rows .p {
      display: grid; grid-template-columns: auto 1fr auto; gap: 11px; align-items: center;
      width: 100%; padding: 8px 4px; background: none; border: 0; cursor: pointer;
      font: inherit; color: inherit; text-align: left;
    }
    .rows .p + .p { border-top: 1px solid var(--dac-border); }
    .rows .nm { font-size: 13.5px; font-weight: 500; }
    .rows .st { font-size: 12px; color: var(--dac-ink-2); }
    .rows .txt { min-width: 0; }
    .rows .txt .nm, .rows .txt .st { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* ---- the avatar, shared ---- */
    .av {
      position: relative; flex: 0 0 auto;
      width: var(--sz, 38px); height: var(--sz, 38px); border-radius: 50%;
      display: grid; place-items: center; overflow: hidden;
      font-size: calc(var(--sz, 38px) * 0.36); font-weight: 600; letter-spacing: .01em;
      color: var(--dac-ink); background: var(--dac-surface-hi);
      /* Ring drawn outside the avatar so a photo is never clipped by it. */
      box-shadow: 0 0 0 2px var(--dac-bg), 0 0 0 3.5px var(--tone);
    }
    .av img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .av .icon { width: 55%; height: 55%; color: var(--dac-ink-2); }
    .rows .av { --sz: 40px; }

    .batt {
      font-size: 11px; color: var(--dac-ink-3); font-variant-numeric: tabular-nums;
      display: flex; align-items: center; gap: 5px;
    }
    .batt i { width: 5px; height: 5px; border-radius: 50%; background: var(--tone); }
    .batt:empty { display: none; }

    :focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; }
  `;

  validate(config) {
    const list =
      config.persons ?? config.entities ?? (config.entity ? [config.entity] : []);
    if (!list.length) return { ...config, [INCOMPLETE]: "Kies minstens één persoon." };
    return {
      layout: "chips",
      show_state: true,
      ...config,
      persons: list.map((p) => (typeof p === "string" ? { entity: p } : p)),
    };
  }

  watched() {
    return this.config.persons.flatMap((p) => [p.entity, p.battery, p.tracker].filter(Boolean));
  }

  template() {
    const c = this.config;
    if (c.bare) this.setAttribute("bare", "");
    const rows = c.layout === "rows";

    const items = c.persons
      .map(
        (p, i) => `
      <button class="p" type="button" data-i="${i}" style="--tone:var(--dac-ink-3)">
        <span class="av"><span class="ph"></span></span>
        ${
          rows
            ? `<span class="txt"><span class="nm"></span><span class="st"></span></span>
               <span class="batt"></span>`
            : `<span class="nm"></span>${c.show_state === false ? "" : `<span class="st"></span>`}`
        }
      </button>`
      )
      .join("");

    const head =
      c.title || c.show_summary
        ? `<div class="head">${c.title ? `<b>${c.title}</b>` : ""}<span class="sum"></span></div>`
        : "";

    const cols = c.columns ?? Math.min(c.persons.length, 6);

    return `
      <div class="card surface">
        ${head}
        <div class="${rows ? "rows" : "chips"}" style="--cols:${cols}">${items}</div>
      </div>`;
  }

  wire() {
    this.$$(".p").forEach((el) => {
      const cfg = this.config.persons[+el.dataset.i];
      this.teardown_.push(
        bindActions(el, {
          onTap: () => moreInfo(this, cfg.entity),
          onHold: () => moreInfo(this, cfg.entity),
        })
      );
    });
  }

  paint() {
    let home = 0;

    this.$$(".p").forEach((el) => {
      const cfg = this.config.persons[+el.dataset.i];
      const st = stateOf(this.hass, cfg.entity);
      const where = place(this.hass, st);
      if (where.home) home++;

      const tone =
        cfg.tone
          ? toneValue(cfg.tone)
          : where.home === true
            ? "var(--dac-good)"
            : where.home === false
              ? "var(--dac-warn)"
              : "var(--dac-ink-3)";
      el.style.setProperty("--tone", tone);

      const name = nameOf(this.hass, cfg.entity, cfg.name);
      this.text(el.querySelector(".nm"), name);

      const stEl = el.querySelector(".st");
      if (stEl) this.text(stEl, where.label);

      // Photo when the person has one, initial when they do not, and a drawn
      // figure when there is not even a name yet.
      const ph = el.querySelector(".ph");
      const pic = st?.attributes?.entity_picture;
      const wanted = pic ? `img:${pic}` : name ? `ini:${name[0]}` : "icon";
      if (ph.dataset.kind !== wanted) {
        ph.dataset.kind = wanted;
        ph.innerHTML = pic
          ? `<img src="${pic}" alt="" loading="lazy" />`
          : name
            ? name[0].toUpperCase()
            : icons.person;
      }

      const batt = el.querySelector(".batt");
      if (batt) {
        const b = cfg.battery ? stateOf(this.hass, cfg.battery) : null;
        batt.innerHTML = b && !Number.isNaN(+b.state) ? `<i></i>${Math.round(+b.state)}%` : "";
      }

      el.setAttribute("aria-label", `${name}, ${where.label}`);
    });

    const sum = this.$(".sum");
    if (sum) {
      sum.textContent =
        home === 0 ? "niemand thuis" : `${home} van ${this.config.persons.length} thuis`;
    }
  }

  getCardSize() {
    return this.config.layout === "rows" ? this.config.persons.length : 2;
  }

  getGridOptions() {
    if (this.config.layout === "rows") {
      return { columns: 12, rows: this.config.persons.length * 2 + 1, min_columns: 6 };
    }
    return { columns: "full", rows: 3, min_columns: 6, min_rows: 2 };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-person-card-editor");
  }

  static getStubConfig(hass) {
    const persons = Object.keys(hass?.states ?? {})
      .filter((e) => e.startsWith("person."))
      .slice(0, 6);
    return { persons, layout: "chips" };
  }
}

class PersonEditor extends DacEditor {
  pickers() {
    return [{ key: "tone", kind: "tone", label: "Vaste kleur (leeg = thuis/afwezig)" }];
  }

  schema() {
    return [
      { name: "persons", selector: { entity: { domain: ["person", "device_tracker"], multiple: true } } },
      row(
        { name: "title", selector: sel.text() },
        {
          name: "layout",
          selector: sel.select([
            { value: "chips", label: "Chips (compact)" },
            { value: "rows", label: "Rijen" },
          ]),
        }
      ),
      section("Weergave", "mdi:eye", [
        row(
          { name: "show_state", selector: sel.bool() },
          { name: "show_summary", selector: sel.bool() }
        ),
        { name: "columns", selector: sel.number(2, 8) },
        { name: "bare", selector: sel.bool() },
      ]),
    ];
  }

  label(s) {
    return (
      {
        persons: "Personen",
        show_state: "Thuis/afwezig tonen",
        show_summary: "Aantal thuis tonen",
        columns: "Kolommen",
        bare: "Zonder kaartrand",
      }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "columns")
      return "Leeg laten laat de kaart het aantal personen volgen, tot zes op een rij.";
    return undefined;
  }
}

registerEditor("domotiapp-person-card-editor", PersonEditor);
registerCard("domotiapp-person-card", PersonCard, {
  name: "DomotiApp Personen",
  description: "Wie er thuis is, compact. Het hele huishouden in één kaart.",
});
