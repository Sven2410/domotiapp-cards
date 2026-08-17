/**
 * The top of a dashboard: who is looking, what time it is, what it is doing
 * outside.
 *
 * Rebuilt from the original domotiapp-header with one change that matters more
 * than any styling: no width gate. The old one was hidden below 768px, which
 * meant the greeting existed on exactly the device nobody uses to check the
 * weather. Everything here reflows instead -- the chips wrap, the clock moves
 * under the temperature, and nothing is withheld from a phone.
 *
 * The clock ticks on the minute rather than the second. A second hand on a wall
 * tablet is a repaint every second, forever, for information nobody wanted.
 */

import { DacCard, registerCard, registerEditor, toneValue } from "../base.js?v=0.1.0";
import { DacEditor, sel, row, section } from "../editor/base.js?v=0.1.0";
import { icons, resolve, weatherIcon } from "../icons.js?v=0.1.0";
import { attrsOf, fmtNumber, localizeState, nameOf, stateOf } from "../ha.js?v=0.1.0";

/** What you say at this hour. */
function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 6) return "Goedenacht";
  if (h < 12) return "Goedemorgen";
  if (h < 18) return "Goedemiddag";
  return "Goedenavond";
}

const WEEKDAYS = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];
const MONTHS = ["januari", "februari", "maart", "april", "mei", "juni", "juli",
  "augustus", "september", "oktober", "november", "december"];

/** The details that can sit under the greeting, in the order they read best. */
const CHIPS = {
  humidity: { icon: "drop", tone: "water", label: "Luchtvochtigheid" },
  wind: { icon: "wind", tone: "neutral", label: "Wind" },
  uv: { icon: "uv", tone: "solar", label: "UV-index" },
  precipitation: { icon: "rain", tone: "water", label: "Neerslag" },
  sunset: { icon: "sunset", tone: "warn", label: "Zonsondergang" },
  sunrise: { icon: "sunrise", tone: "warn", label: "Zonsopkomst" },
};

const DEFAULT_CHIPS = ["humidity", "wind", "uv", "precipitation", "sunset"];

/** Compass bearing to the eight points a person would actually say. */
const bearing = (deg) => {
  if (deg == null || Number.isNaN(+deg)) return "";
  const points = ["N", "NO", "O", "ZO", "Z", "ZW", "W", "NW"];
  return points[Math.round(+deg / 45) % 8];
};

class HeaderCard extends DacCard {
  static css = /* css */ `
    :host { display: block; }

    .card { padding: 16px 18px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 4px 2px; }

    .top { display: flex; align-items: flex-start; gap: 16px; }

    .who { min-width: 0; flex: 1 1 auto; }
    .hello {
      font-size: clamp(17px, 4.4vw, 21px); font-weight: 400; letter-spacing: -.02em;
      line-height: 1.2;
    }
    .hello b { font-weight: 600; }
    .date { margin-top: 3px; font-size: 12px; color: var(--dac-ink-3); }

    .now { flex: 0 0 auto; text-align: right; line-height: 1; }
    .now .temp {
      font-size: clamp(26px, 7vw, 34px); font-weight: 300; letter-spacing: -.035em;
      font-variant-numeric: tabular-nums;
    }
    .now .temp span { font-size: .45em; color: var(--dac-ink-3); }
    .now .cond {
      display: flex; align-items: center; justify-content: flex-end; gap: 6px;
      margin-top: 6px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase;
      color: var(--dac-ink-3);
    }
    .now .cond .icon, .now .cond ha-icon { width: 15px; height: 15px; --mdc-icon-size: 15px; color: var(--tone); }

    .clock { margin-top: 8px; font-size: 13px; color: var(--dac-ink-2); font-variant-numeric: tabular-nums; }

    /* The chips wrap rather than scroll: five of them fit on two lines on the
       narrowest phone, and a wrapped row can be read at a glance where a
       scrolling one hides half of itself. */
    .chips {
      display: flex; flex-wrap: wrap; gap: 7px 14px;
      margin-top: 14px; padding-top: 12px;
      border-top: 1px solid var(--dac-border);
    }
    .chips:empty { display: none; }
    .chip2 {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--dac-ink-2); white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .chip2 .icon, .chip2 ha-icon { width: 14px; height: 14px; --mdc-icon-size: 14px; color: var(--tone); }

    /* A hairline of brand colour, the same one the Coach header wears. */
    .rule {
      height: 1px; margin-top: 14px;
      background: linear-gradient(90deg, transparent, var(--dac-accent) 22%,
                  var(--dac-accent-hi) 50%, var(--dac-accent) 78%, transparent);
      opacity: .55;
    }
  `;

  validate(config) {
    return {
      show_clock: true,
      show_weather: true,
      show_chips: true,
      show_rule: true,
      chips: DEFAULT_CHIPS,
      ...config,
    };
  }

  watched() {
    const c = this.config;
    return [c.weather, c.sun, c.person, c.uv_entity, c.precipitation_entity].filter(Boolean);
  }

  template() {
    const c = this.config;
    if (c.bare) this.setAttribute("bare", "");

    return `
      <div class="card surface">
        <div class="top">
          <div class="who">
            <div class="hello"></div>
            <div class="date"></div>
            ${c.show_clock === false ? "" : `<div class="clock tnum"></div>`}
          </div>
          ${c.show_weather === false ? "" : `
          <div class="now">
            <div class="temp tnum"></div>
            <div class="cond"><span class="ic"></span><span class="txt"></span></div>
          </div>`}
        </div>
        ${c.show_chips === false ? "" : `<div class="chips"></div>`}
        ${c.show_rule === false ? "" : `<div class="rule"></div>`}
      </div>`;
  }

  wire() {
    // Tick on the minute, then every minute -- not every sixty seconds from
    // whenever the card happened to load, which drifts visibly against a phone's
    // own clock.
    const schedule = () => {
      const ms = 60000 - (Date.now() % 60000) + 50;
      this.timer_ = setTimeout(() => {
        this.paintClock_();
        schedule();
      }, ms);
    };
    schedule();
    this.teardown_.push(() => clearTimeout(this.timer_));
  }

  paintClock_() {
    const now = new Date();
    const name =
      this.config.name ??
      (this.config.person ? nameOf(this.hass, this.config.person, null) : null) ??
      this.hass?.user?.name ??
      "";

    const hello = this.config.greeting ?? greeting(now);
    this.$(".hello").innerHTML = name ? `${hello}, <b>${name}</b>` : hello;

    this.text(
      ".date",
      `${WEEKDAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`
    );

    const clock = this.$(".clock");
    if (clock) {
      this.text(
        clock,
        now.toLocaleTimeString(this.hass?.locale?.language ?? "nl", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }

  paint() {
    this.paintClock_();

    const c = this.config;
    const w = stateOf(this.hass, c.weather);
    const wa = attrsOf(this.hass, c.weather);

    const now = this.$(".now");
    if (now && w) {
      const icon = weatherIcon(w.state);
      now.style.setProperty("--tone", toneValue(c.tone, "water"));

      // The unit rides tight against the number, at a smaller size. A gap
      // before the degree sign reads as a rendering fault rather than as style.
      const unit = this.hass?.config?.unit_system?.temperature ?? "°C";
      this.$(".temp").innerHTML =
        wa.temperature != null
          ? `${fmtNumber(this.hass, wa.temperature, 0)}<span>${unit}</span>`
          : "--";

      const ic = now.querySelector(".ic");
      if (ic.dataset.icon !== icon) {
        ic.dataset.icon = icon;
        ic.innerHTML = resolve(icon, "cloud");
      }
      this.text(now.querySelector(".txt"), localizeState(this.hass, w));
    }

    const chips = this.$(".chips");
    if (!chips) return;

    const wanted = (c.chips ?? DEFAULT_CHIPS)
      .map((key) => this.chip_(key, wa))
      .filter(Boolean);

    const sig = wanted.map((x) => `${x.key}${x.value}`).join("|");
    if (chips.dataset.sig === sig) return;
    chips.dataset.sig = sig;

    chips.innerHTML = wanted
      .map(
        (x) =>
          `<span class="chip2" style="--tone:${toneValue(CHIPS[x.key].tone)}" title="${CHIPS[x.key].label}">
             ${icons[CHIPS[x.key].icon]}${x.value}
           </span>`
      )
      .join("");
  }

  /** One chip's value, or null when this house has nothing to say about it. */
  chip_(key, wa) {
    const c = this.config;
    switch (key) {
      case "humidity":
        return wa.humidity != null ? { key, value: `${Math.round(wa.humidity)}%` } : null;

      case "wind": {
        if (wa.wind_speed == null) return null;
        const unit = this.hass?.config?.unit_system?.wind_speed ?? "km/h";
        const dir = bearing(wa.wind_bearing);
        return { key, value: `${fmtNumber(this.hass, wa.wind_speed, 0)} ${unit}${dir ? ` ${dir}` : ""}` };
      }

      case "uv": {
        // Not every weather integration carries UV, so a second entity may be
        // pointed at one that does.
        const uv = wa.uv_index ?? attrsOf(this.hass, c.uv_entity).uv_index ??
          (c.uv_entity ? Number(stateOf(this.hass, c.uv_entity)?.state) : null);
        return uv != null && !Number.isNaN(+uv)
          ? { key, value: `UV ${fmtNumber(this.hass, uv, 1)}` }
          : null;
      }

      case "precipitation": {
        const p = c.precipitation_entity
          ? Number(stateOf(this.hass, c.precipitation_entity)?.state)
          : wa.precipitation;
        return p != null && !Number.isNaN(+p)
          ? { key, value: `${fmtNumber(this.hass, p, 1)} mm` }
          : null;
      }

      case "sunset":
      case "sunrise": {
        const sun = stateOf(this.hass, c.sun);
        const iso = sun?.attributes?.[key === "sunset" ? "next_setting" : "next_rising"];
        if (!iso) return null;
        const d = new Date(iso);
        if (Number.isNaN(+d)) return null;
        return {
          key,
          value: d.toLocaleTimeString(this.hass?.locale?.language ?? "nl", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }

      default:
        return null;
    }
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { columns: "full", rows: 4, min_rows: 3 };
  }

  static getConfigElement() {
    return document.createElement("domotiapp-header-card-editor");
  }

  static getStubConfig(hass) {
    const weather = Object.keys(hass?.states ?? {}).find((e) => e.startsWith("weather."));
    return { weather, sun: "sun.sun", chips: DEFAULT_CHIPS };
  }
}

class HeaderEditor extends DacEditor {
  pickers() {
    return [{ key: "tone", kind: "tone", label: "Kleur weericoon" }];
  }

  schema() {
    return [
      row(
        { name: "weather", selector: sel.entity("weather") },
        { name: "sun", selector: sel.entity("sun") }
      ),
      row(
        { name: "person", selector: sel.entity(["person"]) },
        { name: "name", selector: sel.text() }
      ),
      { name: "greeting", selector: sel.text() },
      section("Weerdetails", "mdi:weather-partly-cloudy", [
        {
          name: "chips",
          selector: {
            select: {
              multiple: true,
              mode: "list",
              options: Object.entries(CHIPS).map(([value, v]) => ({ value, label: v.label })),
            },
          },
        },
        { name: "uv_entity", selector: sel.entity("sensor") },
        { name: "precipitation_entity", selector: sel.entity("sensor") },
      ]),
      section("Weergave", "mdi:eye", [
        row(
          { name: "show_clock", selector: sel.bool() },
          { name: "show_weather", selector: sel.bool() }
        ),
        row(
          { name: "show_chips", selector: sel.bool() },
          { name: "show_rule", selector: sel.bool() }
        ),
        { name: "bare", selector: sel.bool() },
      ]),
    ];
  }

  label(s) {
    return (
      {
        chips: "Welke details",
        uv_entity: "UV uit aparte sensor",
        precipitation_entity: "Neerslag uit aparte sensor",
        greeting: "Eigen begroeting",
        show_rule: "Accentlijn tonen",
        bare: "Zonder kaartrand",
        name: "Vaste naam",
      }[s.name] ?? super.label(s)
    );
  }

  helper(s) {
    if (s.name === "greeting")
      return "Leeg laten voor Goedemorgen / Goedemiddag / Goedenavond op de klok.";
    if (s.name === "person")
      return "Leeg laten om de naam van de ingelogde gebruiker te tonen.";
    if (s.name === "uv_entity")
      return "Alleen nodig als je weerintegratie zelf geen UV meelevert.";
    return undefined;
  }
}

registerEditor("domotiapp-header-card-editor", HeaderEditor);
registerCard("domotiapp-header-card", HeaderCard, {
  name: "DomotiApp Header",
  description: "Begroeting, klok en weer. Werkt ook op een telefoon.",
});
