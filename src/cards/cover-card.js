/**
 * Rolluiken, zonneschermen and anything else on a cover entity.
 *
 * Built for the common Dutch case first: a motor that takes open, stop and
 * close and reports nothing back. Home Assistant shows those as `unknown`
 * forever, and a card that insists on drawing a position slider for them is
 * showing a number nobody has. So the default is three buttons, and the state
 * line says plainly that the motor does not report back rather than pretending.
 *
 * Position is offered when, and only when, the entity actually advertises
 * SET_POSITION. Same principle as the light card: ask the device, not the
 * installer. A customer who later fits a shutter that does report back gets the
 * slider without touching the dashboard.
 *
 * Tilt gets the same treatment, because a venetian blind with tilt and no
 * position is a real and awkward combination.
 */

import { DacCard, registerCard, registerEditor, toneValue } from "../base.js?v=0.1.0";
import { DacEditor, sel, row, section } from "../editor/base.js?v=0.1.0";
import { icons, resolve, defaultIcon } from "../icons.js?v=0.1.0";
import { attrsOf, bindActions, isUnavailable, moreInfo, nameOf, stateOf } from "../ha.js?v=0.1.0";

const F = { OPEN: 1, CLOSE: 2, SET_POSITION: 4, STOP: 8, SET_TILT: 128 };
const can = (st, bit) => Boolean((st?.attributes?.supported_features ?? 0) & bit);

class CoverCard extends DacCard {
  static css = /* css */ `
    :host { display: block; }

    .card { padding: 6px 14px 10px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .head { display: flex; align-items: baseline; gap: 10px; padding: 10px 0 4px; }
    .head b { font-size: 14px; font-weight: 600; }
    .head .sum { margin-left: auto; font-size: 12px; color: var(--dac-ink-3); }

    .cv {
      display: grid; grid-template-columns: 42px 1fr auto; gap: 12px; align-items: center;
      padding: 11px 0; min-height: var(--dac-row-h);
    }
    .cv + .cv, .group { border-top: 1px solid var(--dac-border); }
    .group { padding-top: 11px; margin-top: 4px; }

    .chip { width: 42px; height: 42px; cursor: pointer;
            background: color-mix(in srgb, var(--tone) 13%, transparent);
            border-color: color-mix(in srgb, var(--tone) 30%, transparent); }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    .cv[data-state="closed"] .chip { color: var(--dac-ink-3); background: rgba(255,255,255,.05); border-color: var(--dac-border); }

    .txt { min-width: 0; }
    .nm { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .st { margin-top: 2px; font-size: 11.5px; color: var(--dac-ink-2); font-variant-numeric: tabular-nums; }

    /* ---- open / stop / dicht ---- */
    .keys {
      display: inline-flex; gap: 2px; padding: 3px; flex: 0 0 auto;
      background: rgba(255,255,255,.05); border: 1px solid var(--dac-border);
      border-radius: var(--dac-radius-pill);
    }
    .keys button {
      width: 38px; height: 34px; display: grid; place-items: center; padding: 0; cursor: pointer;
      border: 0; background: transparent; color: var(--dac-ink-2);
      border-radius: var(--dac-radius-pill);
      transition: background 180ms ease, color 180ms ease;
    }
    .keys button:hover { color: var(--dac-ink); background: rgba(255,255,255,.08); }
    .keys button:active { background: rgba(255,255,255,.14); }
    .keys button .icon { width: 18px; height: 18px; }
    .keys button:disabled { opacity: .3; cursor: default; }

    /* Only marked when the motor actually reports where it is. With an
       assumed-state cover nothing is highlighted, because nothing is known. */
    .keys button[aria-pressed="true"] {
      background: color-mix(in srgb, var(--tone) 24%, transparent);
      color: var(--dac-ink);
    }

    /* ---- position, when the entity has it ---- */
    .pos { grid-column: 1 / -1; margin-top: 2px; }
    .slider { position: relative; height: 26px; }
    .slider .track { position: absolute; inset: 9px 0; border-radius: var(--dac-radius-pill);
                     background: rgba(255,255,255,.075); overflow: hidden; }
    .slider .fill { position: absolute; inset: 0 auto 0 0; width: var(--v,0%);
                    border-radius: var(--dac-radius-pill);
                    background: linear-gradient(90deg, color-mix(in srgb, var(--tone) 45%, transparent), var(--tone));
                    transition: width 90ms linear; }
    .slider input { position: absolute; inset: -6px 0; width: 100%; height: 38px; margin: 0;
                    appearance: none; -webkit-appearance: none; background: transparent;
                    cursor: ew-resize; touch-action: pan-y; }
    .slider input::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 26px;
      border-radius: 6px; border: 0; background: var(--dac-ink); box-shadow: 0 2px 8px rgba(0,0,0,.6); }
    .slider input::-moz-range-thumb { width: 16px; height: 26px; border-radius: 6px; border: 0;
      background: var(--dac-ink); box-shadow: 0 2px 8px rgba(0,0,0,.6); }

    .cv.unavailable { opacity: .42; pointer-events: none; }

    @media (max-width: 380px) {
      .keys button { width: 34px; }
    }
  `;

  validate(config) {
    const list = config.covers ?? config.entities ?? (config.entity ? [config.entity] : []);
    if (!list.length) throw new Error("domotiapp-cover-card: kies minstens één rolluik.");
    return {
      group: list.length > 1,
      ...config,
      covers: list.map((c) => (typeof c === "string" ? { entity: c } : c)),
    };
  }

  watched() {
    return this.config.covers.map((c) => c.entity);
  }

  keysHtml(withStop) {
    return `
      <div class="keys">
        <button type="button" data-act="open" aria-label="Open" aria-pressed="false">${icons.arrowUp}</button>
        ${withStop ? `<button type="button" data-act="stop" aria-label="Stop">${icons.stop}</button>` : ""}
        <button type="button" data-act="close" aria-label="Dicht" aria-pressed="false">${icons.arrowDown}</button>
      </div>`;
  }

  template() {
    const c = this.config;
    if (c.bare) this.setAttribute("bare", "");

    const rows = c.covers
      .map(
        (cv, i) => `
      <div class="cv" data-i="${i}" data-state="unknown" style="--tone:${toneValue(cv.tone ?? c.tone, "solar")}">
        <button class="chip" type="button" aria-label="Meer info"></button>
        <div class="txt"><div class="nm"></div><div class="st"></div></div>
        ${this.keysHtml(c.show_stop !== false)}
        <div class="pos" hidden></div>
      </div>`
      )
      .join("");

    const group =
      c.group && c.covers.length > 1
        ? `<div class="cv group" data-i="all" style="--tone:${toneValue(c.tone, "solar")}">
             <span class="chip" style="cursor:default">${icons.shutterOpen}</span>
             <div class="txt"><div class="nm">Alles</div><div class="st"></div></div>
             ${this.keysHtml(c.show_stop !== false)}
           </div>`
        : "";

    const head =
      c.title || c.show_summary
        ? `<div class="head">${c.title ? `<b>${c.title}</b>` : ""}<span class="sum"></span></div>`
        : "";

    return `<div class="card surface">${head}${rows}${group}</div>`;
  }

  entitiesFor(i) {
    return i === "all"
      ? this.config.covers.map((c) => c.entity)
      : [this.config.covers[+i].entity];
  }

  wire() {
    this.dragging_ = new Set();

    this.$$(".cv").forEach((cvEl) => {
      const i = cvEl.dataset.i;

      cvEl.querySelectorAll(".keys button").forEach((btn) => {
        btn.addEventListener("click", () => {
          const map = { open: "open_cover", stop: "stop_cover", close: "close_cover" };
          this.hass.callService("cover", map[btn.dataset.act], {
            entity_id: this.entitiesFor(i),
          });
        });
      });

      if (i === "all") return;

      const entity = this.config.covers[+i].entity;
      this.teardown_.push(
        bindActions(cvEl.querySelector(".chip"), {
          onTap: () => moreInfo(this, entity),
          onHold: () => moreInfo(this, entity),
        })
      );

      const pos = cvEl.querySelector(".pos");
      pos.addEventListener("input", (e) => {
        if (e.target.type !== "range") return;
        this.dragging_.add(i);
        const v = +e.target.value;
        pos.querySelector(".slider").style.setProperty("--v", `${v}%`);
        cvEl.querySelector(".st").textContent = `${v}% open`;
      });
      pos.addEventListener("change", (e) => {
        if (e.target.type !== "range") return;
        this.dragging_.delete(i);
        this.hass.callService("cover", "set_cover_position", {
          entity_id: entity,
          position: +e.target.value,
        });
      });
    });
  }

  paint() {
    let open = 0;
    let known = 0;

    this.$$(".cv").forEach((cvEl) => {
      const i = cvEl.dataset.i;
      if (i === "all") return;

      const cfg = this.config.covers[+i];
      const st = stateOf(this.hass, cfg.entity);
      const attrs = attrsOf(this.hass, cfg.entity);
      const dead = !st || st.state === "unavailable";
      const state = st?.state ?? "unknown";

      cvEl.dataset.state = state;
      cvEl.classList.toggle("unavailable", dead);

      const chip = cvEl.querySelector(".chip");
      const wanted = cfg.icon ?? this.config.icon ?? defaultIcon(cfg.entity, attrs);
      if (chip.dataset.icon !== wanted) {
        chip.dataset.icon = wanted;
        chip.innerHTML = resolve(wanted, "shutter");
      }

      cvEl.querySelector(".nm").textContent = nameOf(this.hass, cfg.entity, cfg.name);

      // "Open" is countable whenever the cover says anything at all -- a
      // position, or a plain open/closed. Counting only the ones with a
      // position is how a card ends up claiming "1 van 1 open" next to four
      // visible rolluiken.
      const hasPos = can(st, F.SET_POSITION) && attrs.current_position != null;
      if (hasPos) {
        known++;
        if (attrs.current_position > 0) open++;
      } else if (state === "open" || state === "closed") {
        known++;
        if (state === "open") open++;
      }

      // The state line. When the motor reports nothing this says so once, in
      // words, instead of showing "Onbekend" and leaving the customer to guess
      // whether something is broken.
      const stEl = cvEl.querySelector(".st");
      if (!this.dragging_.has(i)) {
        stEl.textContent = dead
          ? "Niet bereikbaar"
          : state === "opening"
            ? "Gaat open"
            : state === "closing"
              ? "Gaat dicht"
              : hasPos
                ? `${attrs.current_position}% open`
                : state === "open"
                  ? "Open"
                  : state === "closed"
                    ? "Dicht"
                    : "Geen terugkoppeling";
      }

      // Buttons are only marked when the position is actually known.
      const keys = cvEl.querySelectorAll(".keys button");
      keys.forEach((b) => {
        if (b.dataset.act === "stop") return;
        const isOpenBtn = b.dataset.act === "open";
        const pressed =
          !hasPos && (state === "open" || state === "closed")
            ? (isOpenBtn && state === "open") || (!isOpenBtn && state === "closed")
            : hasPos
              ? (isOpenBtn && attrs.current_position === 100) ||
                (!isOpenBtn && attrs.current_position === 0)
              : false;
        b.setAttribute("aria-pressed", String(pressed));
        b.disabled = dead || (isOpenBtn ? !can(st, F.OPEN) : !can(st, F.CLOSE));
      });

      const stopBtn = cvEl.querySelector('[data-act="stop"]');
      if (stopBtn) stopBtn.disabled = dead || !can(st, F.STOP);

      const pos = cvEl.querySelector(".pos");
      const wantPos = hasPos && this.config.show_position !== false;
      pos.hidden = !wantPos;
      if (wantPos) {
        if (!pos.dataset.built) {
          pos.dataset.built = "1";
          pos.innerHTML = `
            <div class="slider" style="--v:0%">
              <span class="track"><span class="fill"></span></span>
              <input type="range" min="0" max="100" step="1" value="0" aria-label="Positie" />
            </div>`;
        }
        if (!this.dragging_.has(i)) {
          const v = attrs.current_position ?? 0;
          const input = pos.querySelector("input");
          if (document.activeElement !== input) input.value = String(v);
          pos.querySelector(".slider").style.setProperty("--v", `${v}%`);
        }
      }
    });

    const sum = this.$(".sum");
    if (sum) {
      const total = this.config.covers.length;
      sum.textContent = !known
        ? `${total} stuks`
        : known < total
          ? `${open} van ${known} bekend open`
          : `${open} van ${total} open`;
    }

    const groupSt = this.$('.cv[data-i="all"] .st');
    if (groupSt) groupSt.textContent = `${this.config.covers.length} tegelijk bedienen`;
  }

  getCardSize() {
    return 1 + this.config.covers.length;
  }

  getGridOptions() {
    const rows = this.config.covers.length * 2 + (this.config.group ? 2 : 0) + 1;
    return { columns: 12, rows, min_columns: 6, min_rows: 3 };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-cover-card-editor");
  }

  static getStubConfig(hass, entities) {
    const cover = entities?.find((e) => e.startsWith("cover."));
    return { covers: cover ? [cover] : [], title: "Rolluiken" };
  }
}

class CoverEditor extends DacEditor {
  pickers() {
    return [
      { key: "icon", kind: "icon", label: "Icoon (voor alle rolluiken)", fallback: "shutter" },
      { key: "tone", kind: "tone", label: "Kleur" },
    ];
  }

  schema() {
    return [
      { name: "covers", selector: { entity: { domain: "cover", multiple: true } } },
      { name: "title", selector: sel.text() },
      section("Weergave", "mdi:eye", [
        row(
          { name: "show_stop", selector: sel.bool() },
          { name: "group", selector: sel.bool() }
        ),
        row(
          { name: "show_position", selector: sel.bool() },
          { name: "show_summary", selector: sel.bool() }
        ),
        { name: "bare", selector: sel.bool() },
      ]),
    ];
  }

  label(s) {
    return (
      {
        covers: "Rolluiken",
        show_stop: "Stopknop tonen",
        group: "Alles-tegelijk-regel",
        show_position: "Schuif tonen als het kan",
        show_summary: "Samenvatting tonen",
        bare: "Zonder kaartrand",
      }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "show_position")
      return "De schuif verschijnt alleen bij motoren die hun stand terugmelden. Doen ze dat niet, dan blijven het open, stop en dicht.";
    return undefined;
  }
}

registerEditor("domotiapp-cover-card-editor", CoverEditor);
registerCard("domotiapp-cover-card", CoverCard, {
  name: "DomotiApp Rolluiken",
  description: "Open, stop en dicht. Een positieschuif alleen bij motoren die terugmelden.",
});
