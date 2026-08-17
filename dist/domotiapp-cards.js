/*! DomotiApp Cards 0.1.1 | MIT | https://github.com/Sven2410/domotiapp-cards */
var W=`
  --dac-bg:            #0c0c0a;
  --dac-bg-raise:      #12120f;
  --dac-surface:       rgba(255, 255, 255, 0.038);
  --dac-surface-hi:    rgba(255, 255, 255, 0.070);
  --dac-border:        rgba(232, 228, 222, 0.10);
  --dac-border-hi:     rgba(232, 228, 222, 0.20);

  --dac-ink:           #e8e4de;
  --dac-ink-2:         rgba(232, 228, 222, 0.62);
  --dac-ink-3:         rgba(232, 228, 222, 0.38);

  --dac-accent:        #026fa1;
  --dac-accent-hi:     #198fd9;
  --dac-accent-soft:   rgba(2, 111, 161, 0.18);
  --dac-accent-glow:   rgba(25, 143, 217, 0.30);

  /* Energy streams -- validated categorical set. See the note above. */
  --dac-solar:         #dc7300;
  --dac-house:         #235efa;
  --dac-grid-in:       #129be4;
  --dac-grid-out:      #bc10c8;
  --dac-device-1:      #fd0774;
  --dac-device-2:      #039580;

  /* Status -- reserved meaning, always shipped with an icon and a label. */
  --dac-good:          #0ca30c;
  --dac-warn:          #fab219;
  --dac-bad:           #d03b3b;

  /* Light that is actually on. Warm, and distinct from --dac-warn, which means
     "let op". A lamp is not a warning. */
  --dac-lit:           #f5c451;

  --dac-radius:        20px;
  --dac-radius-sm:     12px;
  --dac-radius-pill:   999px;

  /* Home Assistant's own UI font, so the cards match the rest of HA. */
  --dac-font:          var(--ha-font-family-body,
                         var(--paper-font-body1_-_font-family,
                           Roboto, "Noto Sans", "Segoe UI", system-ui, sans-serif));

  --dac-shadow:        0 1px 0 rgba(255, 255, 255, 0.04) inset,
                       0 18px 40px -24px rgba(0, 0, 0, 0.9);

  /* One row height for every interactive card in the family, so a column of
     mixed cards lines up instead of stepping. */
  --dac-row-h:         56px;
`,ke=`
  *, *::before, *::after { box-sizing: border-box; }

  .surface {
    background: var(--dac-surface);
    border: 1px solid var(--dac-border);
    border-radius: var(--dac-radius);
    box-shadow: var(--dac-shadow);
  }

  .eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--dac-ink-3);
  }

  /* Numerals must line up as values change -- never let them jitter. */
  .tnum { font-variant-numeric: tabular-nums; font-feature-settings: "tnum" 1; }

  /* The icon chip: identity colour at low opacity, icon at full. Used by every
     card in the family, which is most of why they read as a set. */
  .chip {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: var(--dac-radius-sm);
    color: var(--tone);
    background: color-mix(in srgb, var(--tone) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--tone) 32%, transparent);
  }

  .icon { display: block; }

  /* Safari on iOS leaves a tapped element focused and draws a heavy ring around
     it that stays after the sheet it opened is closed again. Keyboard users are
     not left without: :focus-visible below still marks the element. */
  button, [role="button"] {
    -webkit-tap-highlight-color: transparent;
  }

  :focus-visible {
    outline: 2px solid var(--dac-accent-hi);
    outline-offset: 2px;
    border-radius: 8px;
  }

  .unavailable { opacity: 0.42; }

  /* Shown when a card has been added but not yet pointed at anything.
     A card that throws instead takes the whole preview down with "Ongeldige
     configuratie", which tells the installer nothing about what is missing. */
  .needs {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 18px;
    background: var(--dac-surface);
    border: 1px dashed var(--dac-border-hi);
    border-radius: var(--dac-radius);
  }
  .needs .mark {
    width: 40px; height: 40px; flex: 0 0 auto;
    display: grid; place-items: center; border-radius: var(--dac-radius-sm);
    color: var(--dac-accent-hi);
    background: color-mix(in srgb, var(--dac-accent-hi) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--dac-accent-hi) 32%, transparent);
  }
  .needs .mark .icon { width: 20px; height: 20px; }
  .needs b { display: block; font-size: 13.5px; font-weight: 600; }
  .needs span { display: block; margin-top: 2px; font-size: 12.5px; color: var(--dac-ink-2); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;function I(n){let e=new CSSStyleSheet;return e.replaceSync(n),e}var D=n=>String(n??"").split(".")[0],g=(n,e)=>e&&n?.states?.[e]||null,T=(n,e)=>g(n,e)?.attributes??{};function S(n,e,t){return t||T(n,e).friendly_name||e||""}var De=new Set(["scene","script","input_button","button","event"]),Q=n=>De.has(D(n));function Z(n){return!n||n.state==="unavailable"?!0:n.state==="unknown"?!Q(n.entity_id):!1}function $e(n){if(!n)return!1;let e=n.state;if(e==="unavailable"||e==="unknown")return!1;switch(D(n.entity_id)){case"cover":return e==="open"||e==="opening";case"alarm_control_panel":return e.startsWith("armed")||e==="triggered"||e==="arming";case"climate":case"water_heater":case"humidifier":return e!=="off";case"person":case"device_tracker":return e==="home";case"media_player":return e!=="off"&&e!=="idle"&&e!=="standby";default:return e==="on"||e==="playing"||e==="active"||e==="heat"}}function Se(n,e,t){if(!n||n.themes!==e.themes||n.language!==e.language)return!0;for(let a of t)if(a&&n.states?.[a]!==e.states?.[a])return!0;return!1}function K(n,e,t={}){n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0,cancelable:!1}))}var C=(n,e)=>K(n,"hass-more-info",{entityId:e});function ze(n){switch(D(n)){case"light":case"switch":case"fan":case"input_boolean":case"automation":case"siren":return{action:"toggle"};case"script":case"scene":case"input_button":case"button":return{action:"toggle"};default:return{action:"more-info"}}}function Te(n){switch(D(n)){case"scene":return["scene","turn_on"];case"script":return["script","turn_on"];case"input_button":return["input_button","press"];case"button":return["button","press"];case"lock":return["lock","open"];case"cover":return["cover","toggle"];case"media_player":return["media_player","media_play_pause"];default:return["homeassistant","toggle"]}}function Ee(n,e,t,a){if(!(!a||a.action==="none"))switch(a.action){case"more-info":C(n,a.entity||t.entity);break;case"toggle":{let r=a.entity||t.entity;if(!r)break;let[i,s]=Te(r);e.callService(i,s,{entity_id:r});break}case"perform-action":case"call-service":{let r=a.perform_action||a.service;if(!r)break;let[i,s]=r.split(".");e.callService(i,s,a.data??a.service_data??{},a.target);break}case"navigate":if(!a.navigation_path)break;history.pushState(null,"",a.navigation_path),K(window,"location-changed",{replace:!1});break;case"url":a.url_path&&window.open(a.url_path,a.target??"_blank");break;case"assist":K(n,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}});break;case"fire-dom-event":K(n,"ll-custom",a);break;default:break}}function N(n,{onTap:e,onHold:t,onDouble:a}){let r=null,i=!1,s=0,d=0,l=0,u=()=>{r&&clearTimeout(r),r=null},b=p=>{p.button!=null&&p.button!==0||(i=!1,d=p.clientX,l=p.clientY,u(),t&&(r=setTimeout(()=>{i=!0,navigator.vibrate?.(18),t()},500)))},h=p=>{if(u(),!i&&!(Math.hypot(p.clientX-d,p.clientY-l)>12)){if(a){let A=Date.now();if(A-s<280){s=0,a();return}s=A,setTimeout(()=>{s&&Date.now()-s>=280&&(s=0,e?.())},290);return}e?.()}},f=()=>{u(),i=!1},z=p=>{p.key!=="Enter"&&p.key!==" "||(p.preventDefault(),e?.())};return n.addEventListener("pointerdown",b),n.addEventListener("pointerup",h),n.addEventListener("pointercancel",f),n.addEventListener("pointerleave",f),n.addEventListener("keydown",z),n.addEventListener("contextmenu",p=>p.preventDefault()),()=>{u(),n.removeEventListener("pointerdown",b),n.removeEventListener("pointerup",h),n.removeEventListener("pointercancel",f),n.removeEventListener("pointerleave",f),n.removeEventListener("keydown",z)}}function j(n,e){if(!e)return"";let t=D(e.entity_id),a=e.attributes.device_class;return n.formatEntityState?.(e)??n.localize?.(`component.${t}.entity_component.${a??"_"}.state.${e.state}`)??n.localize?.(`component.${t}.entity_component._.state.${e.state}`)??e.state}function G(n,e,t){let a=Number(e);return Number.isFinite(a)?a.toLocaleString(n?.locale?.language??"nl",{minimumFractionDigits:t??0,maximumFractionDigits:t??0}):"--"}var _e=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Ce=["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],Me=(n=new Date)=>new Date(n.getFullYear(),n.getMonth(),n.getDate()),ee=(n,e)=>Math.round((Me(e)-Me(n))/864e5);function B(n){if(!n)return null;if(n instanceof Date)return Number.isNaN(+n)?null:n;let e=String(n).trim(),t=e.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);if(t)return new Date(+t[3],+t[2]-1,+t[1]);if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/),t)return new Date(+t[1],+t[2]-1,+t[3]);let a=new Date(e);return Number.isNaN(+a)?null:a}function te(n,e=new Date){if(!n)return"";let t=ee(e,n);return t<0?`${Math.abs(t)} dagen geleden`:t===0?"vandaag":t===1?"morgen":t===2?"overmorgen":t<=6?_e[n.getDay()]:`${_e[n.getDay()].slice(0,2)} ${n.getDate()} ${Ce[n.getMonth()]}`}var Oe=n=>n?`${n.getDate()} ${Ce[n.getMonth()]}`:"";var Ne=`
  :host {
    ${W}
    display: block;
    font-family: var(--dac-font);
    color: var(--dac-ink);
    -webkit-font-smoothing: antialiased;
  }
  :host([hidden]) { display: none; }
`,O={accent:"var(--dac-accent-hi)",solar:"var(--dac-solar)",house:"var(--dac-house)",water:"var(--dac-grid-in)",magenta:"var(--dac-grid-out)",pink:"var(--dac-device-1)",teal:"var(--dac-device-2)",lit:"var(--dac-lit)",good:"var(--dac-good)",warn:"var(--dac-warn)",bad:"var(--dac-bad)",neutral:"var(--dac-ink-3)"},U={accent:"Accent",solar:"Oranje",house:"Blauw",water:"Lichtblauw",magenta:"Magenta",pink:"Roze",teal:"Groenblauw",lit:"Lampgeel",good:"Goed",warn:"Let op",bad:"Kritiek",neutral:"Neutraal"},w=(n,e="accent")=>O[n]??(n&&/[#(]|^var/.test(n)?n:O[e]),E=Symbol("incomplete"),je=n=>`
  <div class="needs">
    <span class="mark"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6"/>
      <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>
    </svg></span>
    <span><b>Nog niets gekozen</b><span>${n}</span></span>
  </div>`,x=class extends HTMLElement{static css="";static get styleSheets_(){return Object.hasOwn(this,"sheets_")||(this.sheets_=[I(Ne+ke+this.css)]),this.sheets_}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=new.target.styleSheets_,this.built_=!1,this.teardown_=[]}setConfig(e){let t=this.validate(e??{});this.config=t,this.built_&&(this.destroy_(),this.shadowRoot.replaceChildren(),this.built_=!1),this.isConnected&&this.build_()}set hass(e){let t=this.hass_;if(this.hass_=e,!!this.config){if(!this.built_){this.build_();return}this.config[E]||Se(t,e,this.watched())&&this.paint()}}get hass(){return this.hass_}connectedCallback(){this.config&&!this.built_&&this.build_()}disconnectedCallback(){this.destroy_()}validate(e){return e}watched(){return this.config?.entity?[this.config.entity]:[]}template(){return""}wire(){}paint(){}build_(){let e=document.createElement("template"),t=this.config?.[E];e.innerHTML=t?je(t):this.template(),this.shadowRoot.appendChild(e.content),this.built_=!0,!t&&(this.wire(),this.hass_&&this.paint())}destroy_(){for(let e of this.teardown_)try{e()}catch{}this.teardown_=[]}$(e){return this.shadowRoot.querySelector(e)}$$(e){return[...this.shadowRoot.querySelectorAll(e)]}text(e,t){let a=typeof e=="string"?this.$(e):e;a&&a.textContent!==String(t)&&(a.textContent=t)}getCardSize(){return 1}};function k(n,e,{name:t,description:a,preview:r=!0}={}){customElements.get(n)||(customElements.define(n,e),window.customCards=window.customCards??[],window.customCards.push({type:n,name:t??n,description:a??"",preview:r,documentationURL:"https://github.com/Sven2410/domotiapp-cards"}))}function _(n,e){customElements.get(n)||customElements.define(n,e)}var o=(n,e="none")=>`<svg class="icon" viewBox="0 0 24 24" fill="${e}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${n}</svg>`,m={house:o(`<path d="M3.2 11.3 12 4.1l8.8 7.2"/>
    <path d="M5.4 12.9V20a.9.9 0 0 0 .9.9h11.4a.9.9 0 0 0 .9-.9v-7.1"/>
    <path d="M9.8 20.9v-5.2h4.4v5.2"/>`),floorB:o(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M9.4 17.8V14h2.4a1.9 1.9 0 0 1 0 3.8Z"/>`),floor1:o(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.6 15.2 12 14v3.9"/>`),floor2:o(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.4 14.8a1.6 1.6 0 0 1 3.1.5c0 1.4-3.1 1.8-3.1 3.5h3.2"/>`),garage:o(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M8.2 20.4v-5.6h7.6v5.6M8.2 17.6h7.6"/>`),shutter:o(`<path d="M3.6 4.2h16.8M5.2 4.2v13.4M18.8 4.2v13.4"/>
    <path d="M5.2 7.6h13.6M5.2 11h13.6M5.2 14.4h13.6M5.2 17.6h13.6"/>`),shutterOpen:o(`<path d="M3.6 4.2h16.8M5.2 4.2v15.6M18.8 4.2v15.6"/>
    <path d="M5.2 6.6h13.6M5.2 8.6h13.6"/>`),awning:o(`<path d="M2.8 11.4 6.2 5h11.6l3.4 6.4z"/>
    <path d="M2.8 11.4c1.5 1.7 3 1.7 4.5 0s3-1.7 4.5 0 3 1.7 4.5 0 3-1.7 4.5 0"/>
    <path d="M12 14.6v4.8"/>`),arrowUp:o('<path d="M12 19.4V5M6.4 10.6 12 5l5.6 5.6"/>'),arrowDown:o('<path d="M12 4.6V19M17.6 13.4 12 19l-5.6-5.6"/>'),stop:o('<rect x="6.4" y="6.4" width="11.2" height="11.2" rx="1.8"/>'),bulb:o(`<path d="M9.4 18.4h5.2M10.4 21.2h3.2"/>
    <path d="M12 2.9a6.2 6.2 0 0 0-3.6 11.2c.5.4.8 1 .8 1.7v.4h5.6v-.4c0-.7.3-1.3.8-1.7A6.2 6.2 0 0 0 12 2.9Z"/>`),bulbGroup:o(`<path d="M7.6 15.6h4M8.2 17.8h2.8"/>
    <path d="M9.6 3.4a4.8 4.8 0 0 0-2.8 8.7c.4.3.6.8.6 1.3v.5h4.4v-.5c0-.5.2-1 .6-1.3a4.8 4.8 0 0 0-2.8-8.7Z"/>
    <path d="M16 8.4a4.4 4.4 0 0 1 2.4 8c-.3.3-.5.7-.5 1.1v.4h-3.8"/>
    <path d="M15.4 20.6h2.4"/>`),switchOn:o(`<rect x="2.8" y="7.4" width="18.4" height="9.2" rx="4.6"/>
    <circle cx="16.6" cy="12" r="2.6" fill="currentColor" stroke="none"/>`),person:o(`<circle cx="12" cy="7.6" r="3.6"/>
    <path d="M4.8 20.4v-1.2a5 5 0 0 1 5-5h4.4a5 5 0 0 1 5 5v1.2"/>`),people:o(`<circle cx="9.4" cy="8.2" r="3.2"/>
    <path d="M3.4 20v-1a4.6 4.6 0 0 1 4.6-4.6h2.8A4.6 4.6 0 0 1 15.4 19v1"/>
    <path d="M16.2 5.3a3.2 3.2 0 0 1 0 5.9"/>
    <path d="M17.6 14.6a4.6 4.6 0 0 1 3 4.3V20"/>`),away:o(`<circle cx="10.4" cy="7.6" r="3.4"/>
    <path d="M3.6 20.4v-1.2a4.8 4.8 0 0 1 4.8-4.8h2.6"/>
    <path d="M14.6 17.4h6M18 14.8l2.6 2.6-2.6 2.6"/>`),bin:o(`<path d="M3.6 6.8h16.8"/>
    <path d="M9.4 6.8V4.6a.9.9 0 0 1 .9-.9h3.4a.9.9 0 0 1 .9.9v2.2"/>
    <path d="m5.9 6.8 1 12.5a1 1 0 0 0 1 .9h8.2a1 1 0 0 0 1-.9l1-12.5"/>
    <path d="M10.2 10.6v5.8M13.8 10.6v5.8"/>`),binWheeled:o(`<path d="M5.6 7.4h12.8l-1 10.6a1 1 0 0 1-1 .9H7.6a1 1 0 0 1-1-.9z"/>
    <path d="M4.4 7.4h15.2M9.6 7.4V5.2h4.8v2.2"/>
    <circle cx="8.6" cy="20.4" r="1.3"/><circle cx="15.4" cy="20.4" r="1.3"/>`),calendar:o(`<rect x="3.6" y="5.4" width="16.8" height="15" rx="2"/>
    <path d="M3.6 10h16.8M8.4 3.4v3.6M15.6 3.4v3.6"/>`),sun:o(`<circle cx="12" cy="12" r="4.1"/>
    <path d="M12 2.4v2.3M12 19.3v2.3M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.3M19.3 12h2.3M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>`),cloud:o('<path d="M7.2 18.4a4.2 4.2 0 0 1-.5-8.4 5.6 5.6 0 0 1 10.8-1.2 3.9 3.9 0 0 1 .6 7.7z"/>'),cloudSun:o(`<path d="M6.8 8.2a3.4 3.4 0 1 1 4.6 3.2"/>
    <path d="M5 4.6 6.1 5.7M3.2 9.2h1.6M9.4 4.6 8.3 5.7M6.8 1.9v1.5"/>
    <path d="M9.4 19.6a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10 1 3.6 3.6 0 0 1 .5 6.8z"/>`),rain:o(`<path d="M7.4 15.4a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10-1.1 3.6 3.6 0 0 1 .6 7.1"/>
    <path d="M9 18.2 8.2 20.6M12.4 18.2l-.8 2.4M15.8 18.2l-.8 2.4"/>`),snow:o(`<path d="M7.4 14.6a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10-1.1 3.6 3.6 0 0 1 .6 7.1"/>
    <path d="M9 17.6v3M7.6 18.4l2.8 1.4M10.4 18.4l-2.8 1.4"/>
    <path d="M15 17.6v3M13.6 18.4l2.8 1.4M16.4 18.4l-2.8 1.4"/>`),fog:o(`<path d="M7.4 12.6a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10-1.1 3.6 3.6 0 0 1 .6 7.1"/>
    <path d="M4.4 16h15.2M6.4 19.4h11.2"/>`),wind:o(`<path d="M3.4 8.4h9.4a2.7 2.7 0 1 0-2.7-2.7"/>
    <path d="M3.4 12.6h13.2a2.7 2.7 0 1 1-2.7 2.7"/>
    <path d="M3.4 16.8h6.2a2.5 2.5 0 1 1-2.5 2.5"/>`),drop:o('<path d="M12 3.4s5.6 6.1 5.6 9.8a5.6 5.6 0 0 1-11.2 0C6.4 9.5 12 3.4 12 3.4Z"/>'),uv:o(`<circle cx="12" cy="11.4" r="3.4"/>
    <path d="M12 3.6v1.8M12 17.4v1.6M4.6 11.4h1.8M17.6 11.4h1.8M6.6 6l1.3 1.3M16.1 15.5l1.3 1.3M6.6 16.8l1.3-1.3M16.1 7.3l1.3-1.3"/>
    <path d="M8.4 21.4h7.2"/>`),sunset:o(`<path d="M3.4 19.6h17.2M6.6 16.2a5.4 5.4 0 0 1 10.8 0"/>
    <path d="M12 3.2v3.4M5.2 6.6l1.8 1.8M18.8 6.6 17 8.4"/>`),sunrise:o(`<path d="M3.4 19.6h17.2M6.6 16.2a5.4 5.4 0 0 1 10.8 0"/>
    <path d="M12 8.2V3.4M9.4 5.8 12 3.2l2.6 2.6"/>`),thermo:o(`<path d="M14.2 14.6V5.6a2.2 2.2 0 1 0-4.4 0v9a4.2 4.2 0 1 0 4.4 0Z"/>
    <path d="M12 9.4v5.8"/>`),shield:o(`<path d="M12 3.2 4.8 5.9v5.5c0 4.4 3 8 7.2 9.4 4.2-1.4 7.2-5 7.2-9.4V5.9z"/>
    <path d="m9.1 12 2 2 3.8-4"/>`),bolt:o('<path d="M13.4 2.6 5.2 13.6h5.6L10.4 21.4l8.4-11.2h-5.6z"/>'),wifi:o(`<path d="M4.2 9.2a11.4 11.4 0 0 1 15.6 0"/>
    <path d="M7.4 12.6a6.9 6.9 0 0 1 9.2 0"/>
    <path d="M10.4 15.9a2.6 2.6 0 0 1 3.2 0"/>
    <circle cx="12" cy="19" r="1.1"/>`),smoke:o(`<path d="M6.4 15.4a3.3 3.3 0 0 1 .5-6.5 4.8 4.8 0 0 1 9.3-.6 3.5 3.5 0 0 1 1.6 7.1z"/>
    <path d="M5.8 19h3.2M11.2 19h3.2M16.6 19h1.8"/>`),star:o('<path d="m12 3.6 2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.4l-5 2.6.9-5.6-4-3.9 5.6-.8z"/>'),moon:o('<path d="M20.4 14.3A8.6 8.6 0 0 1 9.7 3.6a8.8 8.8 0 1 0 10.7 10.7Z"/>'),radio:o(`<rect x="2.8" y="8.4" width="18.4" height="11.4" rx="2"/>
    <path d="m7.4 8.4 9.8-4.2"/>
    <circle cx="15.8" cy="14.1" r="2.9"/>
    <path d="M6.2 12.2h4.4M6.2 16h4.4"/>`),leaf:o(`<path d="M4.6 19.6c-1.4-7.6 3.4-14 14.9-15.2 1.1 8.4-3.3 15.3-14.9 15.2Z"/>
    <path d="M4.2 20.4c2.6-4.6 6-7.6 10.4-9.6"/>`),cog:o(`<circle cx="12" cy="12" r="3.1"/>
    <path d="M12 3.4v2.2M12 18.4v2.2M20.6 12h-2.2M5.6 12H3.4M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5 5.9 5.9"/>`),grid:o(`<rect x="3.6" y="3.6" width="7.2" height="7.2" rx="1.8"/>
    <rect x="13.2" y="3.6" width="7.2" height="7.2" rx="1.8"/>
    <rect x="3.6" y="13.2" width="7.2" height="7.2" rx="1.8"/>
    <rect x="13.2" y="13.2" width="7.2" height="7.2" rx="1.8"/>`),door:o(`<path d="M5.4 20.6h13.2"/>
    <path d="M6.8 20.6V4.6a.9.9 0 0 1 .9-.9h8.6a.9.9 0 0 1 .9.9v16"/>
    <circle cx="14.4" cy="12.4" r="1"/>`),window:o(`<rect x="4.2" y="3.8" width="15.6" height="16.4" rx="1.6"/>
    <path d="M12 3.8v16.4M4.2 12h15.6"/>`),lock:o(`<rect x="4.8" y="10.4" width="14.4" height="9.8" rx="2"/>
    <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/>
    <circle cx="12" cy="15.3" r="1.2"/>`),lockOpen:o(`<rect x="4.8" y="10.4" width="14.4" height="9.8" rx="2"/>
    <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.4-1.1"/>
    <circle cx="12" cy="15.3" r="1.2"/>`),fan:o(`<circle cx="12" cy="12" r="1.9"/>
    <path d="M12 10.1c0-3 .6-6.4 3-6.4 1.7 0 2.4 2.6-.4 4.6"/>
    <path d="M13.9 12c3 0 6.4.6 6.4 3 0 1.7-2.6 2.4-4.6-.4"/>
    <path d="M12 13.9c0 3-.6 6.4-3 6.4-1.7 0-2.4-2.6.4-4.6"/>
    <path d="M10.1 12c-3 0-6.4-.6-6.4-3 0-1.7 2.6-2.4 4.6.4"/>`),airco:o(`<rect x="3.4" y="4.6" width="17.2" height="8.2" rx="2"/>
    <path d="M6.6 9.6h10.8"/>
    <path d="M7.4 16.2c1.6 0 1.6 2.2 3.2 2.2M13.4 16.2c1.6 0 1.6 2.2 3.2 2.2"/>`),tv:o(`<rect x="2.8" y="4.4" width="18.4" height="12.2" rx="1.8"/>
    <path d="M8.4 20.2h7.2M12 16.6v3.6"/>`),speaker:o(`<rect x="5.6" y="2.8" width="12.8" height="18.4" rx="2"/>
    <circle cx="12" cy="15" r="3.2"/><circle cx="12" cy="6.8" r="1.2"/>`),camera:o(`<path d="M3.4 8.6A1.6 1.6 0 0 1 5 7h8a1.6 1.6 0 0 1 1.6 1.6v6.8A1.6 1.6 0 0 1 13 17H5a1.6 1.6 0 0 1-1.6-1.6z"/>
    <path d="m14.6 11 6-3v8l-6-3z"/>`),car:o(`<path d="M4.2 15.4h15.6"/>
    <path d="M6.2 15.4v2.4a.9.9 0 0 1-.9.9h-.7a.9.9 0 0 1-.9-.9v-2.4M20.3 15.4v2.4a.9.9 0 0 1-.9.9h-.7a.9.9 0 0 1-.9-.9v-2.4"/>
    <path d="M3.8 15.4v-3.2l2-4.6a1.3 1.3 0 0 1 1.2-.8h10a1.3 1.3 0 0 1 1.2.8l2 4.6v3.2z"/>
    <circle cx="7.4" cy="12.5" r=".95"/><circle cx="16.6" cy="12.5" r=".95"/>`),plug:o(`<path d="M9 3.4v5.2M15 3.4v5.2"/>
    <path d="M6.4 8.6h11.2v2.2a5.6 5.6 0 0 1-11.2 0z"/>
    <path d="M12 16.4v4.2"/>`),battery:o(`<rect x="2.8" y="7.4" width="16.4" height="9.2" rx="2"/>
    <path d="M21.2 10.6v2.8"/>
    <rect x="5.2" y="9.8" width="6" height="4.4" rx="1" fill="currentColor" stroke="none"/>`),clock:o('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 1.9"/>'),washer:o(`<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2"/>
    <circle cx="12" cy="14" r="4.4"/>
    <path d="M4.2 7.4h15.6M15.4 5.1h1.6"/>`),dishwasher:o(`<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2"/>
    <path d="M4.2 7.8h15.6M7.2 5.3h2.4"/>
    <path d="M9 11.4c1 1.4 1 2.8 0 4.2M12 11.4c1 1.4 1 2.8 0 4.2M15 11.4c1 1.4 1 2.8 0 4.2"/>`),printer:o(`<path d="M7 9V4.6a.6.6 0 0 1 .6-.6h8.8a.6.6 0 0 1 .6.6V9"/>
    <rect x="3.6" y="9" width="16.8" height="7.2" rx="1.8"/>
    <path d="M7 15.4h10v4a.6.6 0 0 1-.6.6H7.6a.6.6 0 0 1-.6-.6z"/>`),key:o(`<circle cx="7.8" cy="12" r="3.8"/>
    <path d="M11.6 12h8.6M17.4 12v3M20.2 12v2.2"/>`),power:o(`<path d="M12 3.6v8"/>
    <path d="M17.4 6.6a7.6 7.6 0 1 1-10.8 0"/>`),plus:o('<path d="M12 5.2v13.6M5.2 12h13.6"/>'),minus:o('<path d="M5.2 12h13.6"/>'),chevronRight:o('<path d="m9.4 6.2 5.6 5.8-5.6 5.8"/>'),chevronDown:o('<path d="m6.2 9.4 5.8 5.6 5.8-5.6"/>'),close:o('<path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/>'),check:o('<path d="m5.2 12.6 4.4 4.4 9.2-10"/>'),dots:o('<circle cx="5.4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.6" cy="12" r="1.5"/>'),warning:o('<path d="M12 4.2 2.8 20h18.4z"/><path d="M12 10v4.4M12 17.4v.1"/>'),question:o(`<circle cx="12" cy="12" r="8.6"/>
    <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>`)};function M(n,e="question"){return n?m[n]?m[n]:n.includes(":")?`<ha-icon class="icon" icon="${n}"></ha-icon>`:m[e]??m.question:m[e]??m.question}function F(n,e={}){switch(String(n??"").split(".")[0]){case"light":return"bulb";case"switch":return"switchOn";case"cover":return e.device_class==="awning"||e.device_class==="blind"?"awning":"shutter";case"person":case"device_tracker":return"person";case"climate":return"thermo";case"binary_sensor":return e.device_class==="smoke"?"smoke":"shield";case"alarm_control_panel":return"shield";case"scene":case"script":case"input_button":case"button":return"star";case"weather":return"cloudSun";default:return"question"}}function Ae(n){switch(n){case"sunny":case"clear-night":return"sun";case"partlycloudy":return"cloudSun";case"cloudy":return"cloud";case"rainy":case"pouring":case"hail":case"lightning":case"lightning-rainy":return"rain";case"snowy":case"snowy-rainy":return"snow";case"fog":return"fog";case"windy":case"windy-variant":return"wind";default:return"cloud"}}var qe=[["Woning",["house","floorB","floor1","floor2","garage","door","window","grid"]],["Rolluiken",["shutter","shutterOpen","awning","arrowUp","arrowDown","stop"]],["Licht en stroom",["bulb","bulbGroup","switchOn","power","plug","bolt","battery"]],["Personen",["person","people","away"]],["Apparaten",["tv","speaker","camera","car","washer","dishwasher","printer","fan","airco","radio"]],["Afval",["bin","binWheeled","calendar"]],["Weer",["sun","cloud","cloudSun","rain","snow","fog","wind","drop","uv","sunrise","sunset","thermo"]],["Status",["shield","lock","lockOpen","key","wifi","smoke","warning","check","close","clock"]],["Overig",["star","moon","leaf","cog","dots","plus","minus","chevronRight","chevronDown","question"]]],He=`
  :host { ${W} display: block; font-family: var(--dac-font); }
  *, *::before, *::after { box-sizing: border-box; }

  .label {
    font-size: 12px; font-weight: 500; margin-bottom: 6px;
    color: var(--secondary-text-color, var(--dac-ink-2));
  }

  .box {
    border: 1px solid var(--divider-color, var(--dac-border));
    border-radius: 12px; overflow: hidden;
    background: var(--card-background-color, var(--dac-bg-raise));
  }

  .current {
    display: flex; align-items: center; gap: 12px; padding: 10px 12px;
    cursor: pointer; background: none; border: 0; width: 100%; text-align: left;
    font: inherit; color: var(--primary-text-color, var(--dac-ink));
  }
  .current:hover { background: rgba(127,127,127,0.08); }
  .current .preview {
    width: 38px; height: 38px; display: grid; place-items: center; border-radius: 11px;
    color: var(--dac-accent-hi);
    background: color-mix(in srgb, var(--dac-accent-hi) 14%, transparent);
    border: 1px solid color-mix(in srgb, var(--dac-accent-hi) 32%, transparent);
  }
  .current .preview .icon, .current .preview ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
  .current .who { min-width: 0; }
  .current .who b { display: block; font-size: 13.5px; font-weight: 500; }
  .current .who small { font-size: 11.5px; color: var(--secondary-text-color, var(--dac-ink-3)); }
  .current .caret { margin-left: auto; color: var(--secondary-text-color, var(--dac-ink-3)); }
  .current .caret .icon { width: 18px; height: 18px; transition: transform 220ms ease; }
  :host([open]) .current .caret .icon { transform: rotate(180deg); }

  .panel { display: none; border-top: 1px solid var(--divider-color, var(--dac-border)); padding: 10px 12px 12px; }
  :host([open]) .panel { display: block; }

  .group + .group { margin-top: 12px; }
  .group h4 {
    margin: 0 0 6px; font-size: 10.5px; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; color: var(--secondary-text-color, var(--dac-ink-3));
  }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 6px; }

  .opt {
    aspect-ratio: 1; display: grid; place-items: center; cursor: pointer;
    border-radius: 10px; border: 1px solid transparent; background: rgba(127,127,127,0.08);
    color: var(--primary-text-color, var(--dac-ink)); padding: 0;
    transition: border-color 160ms ease, background 160ms ease;
  }
  .opt:hover { background: rgba(127,127,127,0.16); }
  .opt[aria-pressed="true"] {
    border-color: var(--dac-accent-hi);
    background: color-mix(in srgb, var(--dac-accent-hi) 18%, transparent);
    color: var(--dac-accent-hi);
  }
  .opt .icon { width: 19px; height: 19px; }

  .mdi { display: flex; align-items: center; gap: 8px; margin-top: 14px; }
  .mdi label { font-size: 11.5px; color: var(--secondary-text-color, var(--dac-ink-3)); white-space: nowrap; }
  .mdi input {
    flex: 1 1 auto; min-width: 0; font: inherit; font-size: 13px;
    padding: 8px 10px; border-radius: 8px;
    border: 1px solid var(--divider-color, var(--dac-border));
    background: transparent; color: var(--primary-text-color, var(--dac-ink));
  }
  .mdi input:focus { outline: 2px solid var(--dac-accent-hi); outline-offset: 1px; }
  .mdi button {
    font: inherit; font-size: 12px; padding: 8px 12px; border-radius: 8px; cursor: pointer;
    border: 1px solid var(--divider-color, var(--dac-border));
    background: transparent; color: var(--secondary-text-color, var(--dac-ink-2));
  }
  .mdi button:hover { color: var(--primary-text-color, var(--dac-ink)); }

  :focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; }
`,ae=null,ne=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),ae=ae??[I(He)],this.shadowRoot.adoptedStyleSheets=ae,this.value_="",this.label="Icoon",this.fallback="question"}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        <button type="button" class="current" aria-expanded="false">
          <span class="preview"></span>
          <span class="who"><b></b><small></small></span>
          <span class="caret">${m.chevronDown}</span>
        </button>
        <div class="panel">
          ${qe.map(([t,a])=>`
            <div class="group">
              <h4>${t}</h4>
              <div class="grid">
                ${a.map(r=>`<button type="button" class="opt" data-icon="${r}" title="${r}" aria-pressed="false">${m[r]??""}</button>`).join("")}
              </div>
            </div>`).join("")}
          <div class="mdi">
            <label for="mdi">Of Home Assistant-icoon</label>
            <input id="mdi" type="text" placeholder="mdi:washing-machine" spellcheck="false" />
            <button type="button" class="clear">Wissen</button>
          </div>
        </div>
      </div>`,this.$(".current").addEventListener("click",()=>{let t=this.toggleAttribute("open");this.$(".current").setAttribute("aria-expanded",String(t))}),this.shadowRoot.querySelectorAll(".opt").forEach(t=>t.addEventListener("click",()=>this.emit_(t.dataset.icon)));let e=this.$("#mdi");e.addEventListener("change",()=>this.emit_(e.value.trim())),this.$(".clear").addEventListener("click",()=>this.emit_("")),this.paint_()}paint_(){if(!this.shadowRoot.firstElementChild)return;this.$(".label").textContent=this.label??"Icoon";let e=this.value_,t=e||this.fallback||"question";this.$(".preview").innerHTML=M(t,this.fallback),this.$(".who b").textContent=e||"Automatisch",this.$(".who small").textContent=e?e.includes(":")?"Home Assistant-icoon":"DomotiApp-icoon":"Past zich aan de entiteit aan",this.shadowRoot.querySelectorAll(".opt").forEach(i=>i.setAttribute("aria-pressed",String(i.dataset.icon===e)));let a=this.$("#mdi"),r=e&&e.includes(":")?e:"";a.value!==r&&(a.value=r)}emit_(e){this.value_=e,this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-icon-picker")||customElements.define("dac-icon-picker",ne);var Ve=["accent","solar","house","water","magenta","pink","teal","lit","neutral"],We=["good","warn","bad"],Ie=`
  :host { ${W} display: block; font-family: var(--dac-font); }
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
`,ie=null,re=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),ie=ie??[I(Ie)],this.shadowRoot.adoptedStyleSheets=ie,this.value_="",this.label="Kleur"}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}swatch(e){return`<button type="button" class="sw" data-tone="${e}" style="--c:${O[e]}"
      title="${U[e]}" aria-label="${U[e]}" aria-pressed="false">${m.check}</button>`}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        <h4>Identiteit</h4>
        <div class="row">
          <button type="button" class="sw auto" data-tone="" title="Automatisch"
            aria-label="Automatisch" aria-pressed="false">${m.check}</button>
          ${Ve.map(e=>this.swatch(e)).join("")}
        </div>
        <h4>Status</h4>
        <div class="row">${We.map(e=>this.swatch(e)).join("")}</div>
        <p class="note">
          Statuskleuren betekenen iets: goed, let op, kritiek. Gebruik ze niet om
          een kaart mooier te maken &mdash; dan zegt rood straks niets meer.
        </p>
        <div class="chosen"></div>
      </div>`,this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.addEventListener("click",()=>this.emit_(e.dataset.tone))),this.paint_()}paint_(){this.shadowRoot.firstElementChild&&(this.$(".label").textContent=this.label??"Kleur",this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.setAttribute("aria-pressed",String((e.dataset.tone||"")===this.value_))),this.$(".chosen").innerHTML=this.value_?`Gekozen: <b>${U[this.value_]??this.value_}</b>`:"Gekozen: <b>Automatisch</b> &mdash; de kaart kiest op domein en toestand.")}emit_(e){this.value_=e??"",this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value_},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-tone-picker")||customElements.define("dac-tone-picker",re);var c={entity:n=>({entity:n?{domain:n}:{}}),text:()=>({text:{}}),multiline:()=>({text:{multiline:!0}}),bool:()=>({boolean:{}}),number:(n,e,t=1)=>({number:{min:n,max:e,step:t,mode:"box"}}),select:n=>({select:{mode:"dropdown",options:n}}),action:()=>({ui_action:{}})},v=(...n)=>({type:"grid",schema:n}),$=(n,e,t,a=!1)=>({type:"expandable",name:n,icon:e,expanded:a,schema:t}),y=class extends HTMLElement{constructor(){super(),this.config_={},this.built_=!1}setConfig(e){this.config_={...e},this.render_()}set hass(e){this.hass_=e,this.form_&&(this.form_.hass=e);for(let t of this.pickers_??[])t.hass=e;this.render_()}get hass(){return this.hass_}connectedCallback(){this.render_()}schema(){return[]}pickers(){return[]}label(e){return H[e.name]??e.name}helper(){}async render_(){if(!this.hass_||!this.config_)return;if(this.built_){this.sync_();return}this.built_=!0,await customElements.whenDefined("ha-form"),this.replaceChildren(),this.pickers_=[];let e=this.pickers();if(e.length){let a=document.createElement("div");a.style.cssText="display:flex;flex-direction:column;gap:12px;margin-bottom:16px";for(let r of e){let i=document.createElement(r.kind==="tone"?"dac-tone-picker":"dac-icon-picker");i.label=r.label,i.fallback=r.fallback,i.hass=this.hass_,i.value=this.config_[r.key],i.addEventListener("value-changed",s=>{s.stopPropagation(),this.patch_({[r.key]:s.detail.value})}),this.pickers_.push(i),i.dataset.key=r.key,a.appendChild(i)}this.appendChild(a)}let t=document.createElement("ha-form");t.hass=this.hass_,t.data=this.config_,t.schema=this.schema(),t.computeLabel=a=>this.label(a),t.computeHelper=a=>this.helper(a),t.addEventListener("value-changed",a=>{a.stopPropagation(),this.patch_(a.detail.value,!0)}),this.form_=t,this.appendChild(t)}sync_(){this.form_&&(this.form_.hass=this.hass_,this.form_.data=this.config_);for(let e of this.pickers_??[])e.hass=this.hass_,e.value=this.config_[e.dataset.key]}patch_(e,t=!1){let a=t?{...e}:{...this.config_,...e};this.config_.type&&(a.type=this.config_.type);for(let[r,i]of Object.entries(a))(i===""||i===void 0||i===null)&&delete a[r];this.config_=a,this.sync_(),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a},bubbles:!0,composed:!0}))}},H={entity:"Entiteit",entities:"Entiteiten",name:"Naam",icon:"Icoon",tone:"Kleur",secondary:"Tweede regel",layout:"Vorm",tap_action:"Tikken",hold_action:"Vasthouden",double_tap_action:"Dubbeltikken",show_state:"Toestand tonen",show_name:"Naam tonen",show_icon:"Icoon tonen",state_color:"Kleur volgt toestand",fill:"Vullen",collapsible:"Inklapbaar",title:"Titel",subtitle:"Ondertitel",weather:"Weerentiteit",sun:"Zon-entiteit",person:"Persoon",persons:"Personen",covers:"Rolluiken",lights:"Lampen",sensors:"Sensoren",greeting:"Begroeting",show_clock:"Klok tonen",show_weather:"Weer tonen",show_chips:"Weerdetails tonen",compact:"Compact",columns:"Kolommen",group:"Groepsregel tonen",invert:"Open en dicht omdraaien",label:"Label",color:"Kleur",date_format:"Datumnotatie"};function Re(n=new Date){let e=n.getHours();return e<6?"Goedenacht":e<12?"Goedemorgen":e<18?"Goedemiddag":"Goedenavond"}var Pe=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Ge=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],Y={humidity:{icon:"drop",tone:"water",label:"Luchtvochtigheid"},wind:{icon:"wind",tone:"neutral",label:"Wind"},uv:{icon:"uv",tone:"solar",label:"UV-index"},precipitation:{icon:"rain",tone:"water",label:"Neerslag"},sunset:{icon:"sunset",tone:"warn",label:"Zonsondergang"},sunrise:{icon:"sunrise",tone:"warn",label:"Zonsopkomst"}},oe=["humidity","wind","uv","precipitation","sunset"],Be=n=>n==null||Number.isNaN(+n)?"":["N","NO","O","ZO","Z","ZW","W","NW"][Math.round(+n/45)%8],se=class extends x{static css=`
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
  `;validate(e){return{show_clock:!0,show_weather:!0,show_chips:!0,show_rule:!0,chips:oe,...e}}watched(){let e=this.config;return[e.weather,e.sun,e.person,e.uv_entity,e.precipitation_entity].filter(Boolean)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`
      <div class="card surface">
        <div class="top">
          <div class="who">
            <div class="hello"></div>
            <div class="date"></div>
            ${e.show_clock===!1?"":'<div class="clock tnum"></div>'}
          </div>
          ${e.show_weather===!1?"":`
          <div class="now">
            <div class="temp tnum"></div>
            <div class="cond"><span class="ic"></span><span class="txt"></span></div>
          </div>`}
        </div>
        ${e.show_chips===!1?"":'<div class="chips"></div>'}
        ${e.show_rule===!1?"":'<div class="rule"></div>'}
      </div>`}wire(){let e=()=>{let t=6e4-Date.now()%6e4+50;this.timer_=setTimeout(()=>{this.paintClock_(),e()},t)};e(),this.teardown_.push(()=>clearTimeout(this.timer_))}paintClock_(){let e=new Date,t=this.config.name??(this.config.person?S(this.hass,this.config.person,null):null)??this.hass?.user?.name??"",a=this.config.greeting??Re(e);this.$(".hello").innerHTML=t?`${a}, <b>${t}</b>`:a,this.text(".date",`${Pe[e.getDay()]} ${e.getDate()} ${Ge[e.getMonth()]}`);let r=this.$(".clock");r&&this.text(r,e.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"}))}paint(){this.paintClock_();let e=this.config,t=g(this.hass,e.weather),a=T(this.hass,e.weather),r=this.$(".now");if(r&&t){let l=Ae(t.state);r.style.setProperty("--tone",w(e.tone,"water"));let u=this.hass?.config?.unit_system?.temperature??"\xB0C";this.$(".temp").innerHTML=a.temperature!=null?`${G(this.hass,a.temperature,0)}<span>${u}</span>`:"--";let b=r.querySelector(".ic");b.dataset.icon!==l&&(b.dataset.icon=l,b.innerHTML=M(l,"cloud")),this.text(r.querySelector(".txt"),j(this.hass,t))}let i=this.$(".chips");if(!i)return;let s=(e.chips??oe).map(l=>this.chip_(l,a)).filter(Boolean),d=s.map(l=>`${l.key}${l.value}`).join("|");i.dataset.sig!==d&&(i.dataset.sig=d,i.innerHTML=s.map(l=>`<span class="chip2" style="--tone:${w(Y[l.key].tone)}" title="${Y[l.key].label}">
             ${m[Y[l.key].icon]}${l.value}
           </span>`).join(""))}chip_(e,t){let a=this.config;switch(e){case"humidity":return t.humidity!=null?{key:e,value:`${Math.round(t.humidity)}%`}:null;case"wind":{if(t.wind_speed==null)return null;let r=this.hass?.config?.unit_system?.wind_speed??"km/h",i=Be(t.wind_bearing);return{key:e,value:`${G(this.hass,t.wind_speed,0)} ${r}${i?` ${i}`:""}`}}case"uv":{let r=t.uv_index??T(this.hass,a.uv_entity).uv_index??(a.uv_entity?Number(g(this.hass,a.uv_entity)?.state):null);return r!=null&&!Number.isNaN(+r)?{key:e,value:`UV ${G(this.hass,r,1)}`}:null}case"precipitation":{let r=a.precipitation_entity?Number(g(this.hass,a.precipitation_entity)?.state):t.precipitation;return r!=null&&!Number.isNaN(+r)?{key:e,value:`${G(this.hass,r,1)} mm`}:null}case"sunset":case"sunrise":{let i=g(this.hass,a.sun)?.attributes?.[e==="sunset"?"next_setting":"next_rising"];if(!i)return null;let s=new Date(i);return Number.isNaN(+s)?null:{key:e,value:s.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"})}}default:return null}}getCardSize(){return 3}getGridOptions(){return{columns:"full",rows:4,min_rows:3}}static getConfigElement(){return document.createElement("domotiapp-header-card-editor")}static getStubConfig(e){return{weather:Object.keys(e?.states??{}).find(a=>a.startsWith("weather.")),sun:"sun.sun",chips:oe}}},ce=class extends y{pickers(){return[{key:"tone",kind:"tone",label:"Kleur weericoon"}]}schema(){return[v({name:"weather",selector:c.entity("weather")},{name:"sun",selector:c.entity("sun")}),v({name:"person",selector:c.entity(["person"])},{name:"name",selector:c.text()}),{name:"greeting",selector:c.text()},$("Weerdetails","mdi:weather-partly-cloudy",[{name:"chips",selector:{select:{multiple:!0,mode:"list",options:Object.entries(Y).map(([e,t])=>({value:e,label:t.label}))}}},{name:"uv_entity",selector:c.entity("sensor")},{name:"precipitation_entity",selector:c.entity("sensor")}]),$("Weergave","mdi:eye",[v({name:"show_clock",selector:c.bool()},{name:"show_weather",selector:c.bool()}),v({name:"show_chips",selector:c.bool()},{name:"show_rule",selector:c.bool()}),{name:"bare",selector:c.bool()}])]}label(e){return{chips:"Welke details",uv_entity:"UV uit aparte sensor",precipitation_entity:"Neerslag uit aparte sensor",greeting:"Eigen begroeting",show_rule:"Accentlijn tonen",bare:"Zonder kaartrand",name:"Vaste naam"}[e.name]??super.label(e)}helper(e){if(e.name==="greeting")return"Leeg laten voor Goedemorgen / Goedemiddag / Goedenavond op de klok.";if(e.name==="person")return"Leeg laten om de naam van de ingelogde gebruiker te tonen.";if(e.name==="uv_entity")return"Alleen nodig als je weerintegratie zelf geen UV meelevert."}};_("domotiapp-header-card-editor",ce);k("domotiapp-header-card",se,{name:"DomotiApp Header",description:"Begroeting, klok en weer. Werkt ook op een telefoon."});var le=class extends x{static css=`
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
  `;validate(e){return{icon:"",tone:"accent",line:!0,...e}}watched(){return this.config.secondary_entity?[this.config.secondary_entity]:[]}template(){let e=this.config,t=e.icon!==null&&e.icon!==!1;return t||this.setAttribute("no-icon",""),`
      <div class="sep" style="--tone:${w(e.tone)}">
        ${t?`<span class="chip">${M(e.icon,"star")}</span>`:""}
        <h3></h3>
        ${e.line===!1?"":'<span class="rule"></span>'}
        <span class="sub"></span>
      </div>`}paint(){this.text("h3",this.config.name??"");let e=this.$(".sub");if(!e)return;let t=g(this.hass,this.config.secondary_entity);if(!t){e.textContent="";return}let a=t.attributes.unit_of_measurement;e.textContent=a?`${t.state} ${a}`:t.attributes.current_temperature!=null?`${t.attributes.current_temperature} \xB0C`:j(this.hass,t)}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:1,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-separator-card-editor")}static getStubConfig(){return{name:"Nieuwe sectie",icon:"house",tone:"accent"}}},de=class extends y{pickers(){return[{key:"icon",kind:"icon",label:H.icon,fallback:"star"},{key:"tone",kind:"tone",label:H.tone}]}schema(){return[{name:"name",selector:c.text()},{name:"line",selector:c.bool()},{name:"secondary_entity",selector:c.entity()}]}label(e){return{line:"Lijn tonen",secondary_entity:"Waarde rechts (optioneel)"}[e.name]??super.label(e)}helper(e){if(e.name==="secondary_entity")return"Toont de toestand van deze entiteit rechts van de lijn, bijvoorbeeld een temperatuur of een aantal."}};_("domotiapp-separator-card-editor",de);k("domotiapp-separator-card",le,{name:"DomotiApp Separator",description:"Sectiekop met icoon en vervagende lijn."});var pe=class extends x{static css=`
    :host { display: block; }

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
    :host([layout="row"]) .btn { min-height: var(--dac-row-h); padding: 9px 14px 9px 9px; }
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

    .badge {
      position: absolute; top: 8px; right: 8px;
      font-size: 10px; font-weight: 600; letter-spacing: .04em;
      padding: 2px 7px; border-radius: var(--dac-radius-pill);
      color: var(--dac-ink);
      background: color-mix(in srgb, var(--tone) 26%, transparent);
      border: 1px solid color-mix(in srgb, var(--tone) 50%, transparent);
    }
    .badge:empty { display: none; }
  `;validate(e){return{layout:"row",state_color:!0,show_state:!0,show_name:!0,show_icon:!0,...e}}watched(){return[this.config.entity,this.config.secondary_entity].filter(Boolean)}tone_(){let e=this.config;return e.tone?w(e.tone):D(e.entity)==="light"?O.lit:O.accent}template(){let e=this.config;return this.setAttribute("layout",["row","tile","compact"].includes(e.layout)?e.layout:"row"),`
      <button class="btn" type="button" style="--tone:${this.tone_()}">
        <span class="wash"></span>
        ${e.show_icon===!1?"":'<span class="chip"></span>'}
        <span class="txt">
          ${e.show_name===!1?"":'<span class="nm"></span>'}
          ${e.show_state===!1?"":'<span class="st"></span>'}
        </span>
        <span class="badge"></span>
      </button>`}wire(){let e=this.config,t=this.$(".btn"),a=(r,i)=>Ee(this,this.hass,e,e[r]??i);this.teardown_.push(N(t,{onTap:()=>a("tap_action",ze(e.entity)),onHold:()=>a("hold_action",{action:e.entity?"more-info":"none"}),onDouble:e.double_tap_action?()=>a("double_tap_action",{action:"none"}):void 0}))}paint(){let e=this.config,t=g(this.hass,e.entity),a=e.state_color!==!1&&$e(t),r=!!e.entity&&Z(t);this.toggleAttribute("on",a),this.$(".btn").classList.toggle("unavailable",r);let i=this.$(".chip");if(i){let l=e.icon||F(e.entity,T(this.hass,e.entity));i.dataset.icon!==l&&(i.dataset.icon=l,i.innerHTML=M(l)),i.style.setProperty("--tone",a?this.tone_():"var(--dac-ink-3)")}this.text(".nm",S(this.hass,e.entity,e.name));let s=this.$(".st");s&&this.text(s,this.secondary_(t,r));let d=this.$(".badge");d&&this.text(d,e.badge??""),this.$(".btn").setAttribute("aria-label",`${S(this.hass,e.entity,e.name)}${t?`, ${j(this.hass,t)}`:""}`)}secondary_(e,t){let a=this.config;if(t)return"Niet bereikbaar";if(a.secondary_entity){let r=g(this.hass,a.secondary_entity);if(!r)return"";let i=r.attributes.unit_of_measurement;return i?`${r.state} ${i}`:j(this.hass,r)}return a.secondary?a.secondary:!e||Q(e.entity_id)?"":D(e.entity_id)==="light"&&e.state==="on"&&e.attributes.brightness!=null?`${Math.round(e.attributes.brightness/255*100)}%`:j(this.hass,e)}getCardSize(){return this.config?.layout==="tile"?2:1}getGridOptions(){return this.config?.layout==="tile"?{columns:6,rows:2,min_columns:3,min_rows:2}:{columns:12,rows:1,min_columns:4,min_rows:1}}static getConfigElement(){return document.createElement("domotiapp-button-card-editor")}static getStubConfig(e,t){return{entity:t?.find(r=>r.startsWith("light."))??t?.find(r=>r.startsWith("switch."))??t?.[0],layout:"row"}}},he=class extends y{pickers(){return[{key:"icon",kind:"icon",label:H.icon,fallback:"star"},{key:"tone",kind:"tone",label:H.tone}]}schema(){return[{name:"entity",selector:c.entity()},v({name:"name",selector:c.text()},{name:"layout",selector:c.select([{value:"row",label:"Rij"},{value:"tile",label:"Tegel"},{value:"compact",label:"Compact"}])}),$("Weergave","mdi:eye",[v({name:"show_icon",selector:c.bool()},{name:"show_name",selector:c.bool()}),v({name:"show_state",selector:c.bool()},{name:"state_color",selector:c.bool()}),{name:"secondary",selector:c.text()},{name:"secondary_entity",selector:c.entity()},{name:"badge",selector:c.text()}]),$("Acties","mdi:gesture-tap",[{name:"tap_action",selector:c.action()},{name:"hold_action",selector:c.action()},{name:"double_tap_action",selector:c.action()}])]}label(e){return{secondary:"Vaste tweede regel",secondary_entity:"Tweede regel uit entiteit",badge:"Hoekje rechtsboven"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"Mag leeg blijven: zonder entiteit wordt dit een navigatieknop.";if(e.name==="state_color")return"Uit betekent dat de knop er hetzelfde uitziet of het apparaat nu aan of uit staat."}};_("domotiapp-button-card-editor",he);k("domotiapp-button-card",pe,{name:"DomotiApp Knop",description:"E\xE9n control als rij, tegel of compacte pil. Vervangt tile, mushroom-entity en bubble-knoppen."});var Ke=new Set(["brightness","color_temp","hs","rgb","rgbw","rgbww","xy","white"]),Ze=n=>(n?.attributes?.supported_color_modes??[]).some(t=>Ke.has(t)),Ue=n=>Math.max(1,Math.round((n??0)/255*100)),ue=class extends x{static css=`
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
  `;validate(e){let t=e.lights??e.entities??(e.entity?[e.entity]:[]);return t.length?{...e,lights:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[E]:"Kies minstens \xE9\xE9n lamp."}}watched(){return this.config.lights.map(e=>e.entity)}toneFor(e){return w(e.tone??this.config.tone,"lit")??O.lit}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.lights.map((r,i)=>{let s=this.toneFor(r);return`
        <div class="lamp" data-i="${i}" data-on="false" style="--tone:${s}">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <div>
            <div class="top"><span class="nm"></span><span class="v tnum"></span></div>
            <div class="ctl"></div>
          </div>
        </div>`}).join("");return`<div class="card surface">${e.title||e.show_summary!==!1?`<div class="head">${e.title?`<b>${e.title}</b>`:""}<span class="sum"></span></div>`:""}${t}</div>`}wire(){this.dragging_=new Set,this.$$(".lamp").forEach(e=>{let t=+e.dataset.i,a=this.config.lights[t].entity;this.teardown_.push(N(e.querySelector(".chip"),{onTap:()=>this.hass.callService("light","toggle",{entity_id:a}),onHold:()=>C(this,a)})),e.querySelector(".ctl").addEventListener("input",r=>{let i=r.target;if(i.type!=="range")return;this.dragging_.add(t);let s=+i.value;e.querySelector(".fill").style.setProperty("--v",`${s}%`),e.querySelector(".v").textContent=s===0?"uit":`${s}%`}),e.querySelector(".ctl").addEventListener("change",r=>{let i=r.target;if(i.type!=="range")return;this.dragging_.delete(t);let s=+i.value;s===0?this.hass.callService("light","turn_off",{entity_id:a}):this.hass.callService("light","turn_on",{entity_id:a,brightness_pct:s})}),e.querySelector(".ctl").addEventListener("click",r=>{r.target.closest(".toggle")&&this.hass.callService("light","toggle",{entity_id:a})})})}paint(){let e=0;this.$$(".lamp").forEach(a=>{let r=+a.dataset.i,i=this.config.lights[r],s=g(this.hass,i.entity),d=Z(s),l=s?.state==="on";l&&e++,a.dataset.on=String(l),a.classList.toggle("unavailable",d);let u=a.querySelector(".chip"),b=i.icon??this.config.icon??"bulb";u.dataset.icon!==b&&(u.dataset.icon=b,u.innerHTML=M(b,"bulb")),a.querySelector(".nm").textContent=S(this.hass,i.entity,i.name);let h=l?s?.attributes?.rgb_color:null;a.style.setProperty("--tone",h?`rgb(${h[0]},${h[1]},${h[2]})`:this.toneFor(i));let f=a.querySelector(".ctl"),z=Ze(s),p=d?"none":z?"range":"toggle";f.dataset.kind!==p&&(f.dataset.kind=p,f.innerHTML=p==="range"?`<div class="slider" style="--v:0%">
                 <span class="track"><span class="fill"></span></span>
                 <input type="range" min="0" max="100" step="1" value="0" aria-label="Helderheid" />
               </div>`:p==="toggle"?'<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>':"");let A=a.querySelector(".v");if(p==="range"){if(this.dragging_.has(r))return;let R=l?Ue(s.attributes.brightness):0,P=f.querySelector("input");document.activeElement!==P&&(P.value=String(R)),f.querySelector(".slider").style.setProperty("--v",`${R}%`),f.querySelector(".fill").style.setProperty("--v",`${R}%`),A.textContent=d?"":l?`${R}%`:"uit"}else p==="toggle"?(f.querySelector(".toggle")?.setAttribute("aria-checked",String(l)),A.textContent=l?"aan":"uit"):A.textContent="niet bereikbaar"});let t=this.$(".sum");if(t){let a=this.config.lights.length;t.textContent=e===0?"alles uit":`${e} van ${a} aan`}}getCardSize(){return 1+this.config.lights.length}getGridOptions(){return{columns:12,rows:this.config.lights.length*2+(this.config.title,1),min_columns:6,min_rows:3}}static getConfigElement(){return document.createElement("domotiapp-light-card-editor")}static getStubConfig(e,t){let a=t?.find(r=>r.startsWith("light."));return{lights:a?[a]:[],title:"Verlichting"}}},me=class extends y{pickers(){return[{key:"icon",kind:"icon",label:"Icoon (voor alle lampen)",fallback:"bulb"},{key:"tone",kind:"tone",label:"Kleur als de lamp niet zelf kleurt"}]}schema(){return[{name:"lights",selector:{entity:{domain:"light",multiple:!0}}},{name:"title",selector:c.text()},$("Weergave","mdi:eye",[v({name:"show_summary",selector:c.bool()},{name:"bare",selector:c.bool()})])]}label(e){return{lights:"Lampen",show_summary:"Aantal aan tonen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="lights")return"Dimbare lampen krijgen een schuif, schakelbare een tuimelaar. De kaart kijkt dat zelf op.";if(e.name==="bare")return"Zet de rand en achtergrond uit, zodat de kaart in een andere kaart past."}};_("domotiapp-light-card-editor",me);k("domotiapp-light-card",ue,{name:"DomotiApp Verlichting",description:"Dimbare en schakelbare lampen in \xE9\xE9n kaart, met kleurweergave voor RGB."});var X={OPEN:1,CLOSE:2,SET_POSITION:4,STOP:8,SET_TILT:128},J=(n,e)=>!!((n?.attributes?.supported_features??0)&e),ge=class extends x{static css=`
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
  `;validate(e){let t=e.covers??e.entities??(e.entity?[e.entity]:[]);return t.length?{group:t.length>1,...e,covers:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[E]:"Kies minstens \xE9\xE9n rolluik of zonnescherm."}}watched(){return this.config.covers.map(e=>e.entity)}keysHtml(e){return`
      <div class="keys">
        <button type="button" data-act="open" aria-label="Open" aria-pressed="false">${m.arrowUp}</button>
        ${e?`<button type="button" data-act="stop" aria-label="Stop">${m.stop}</button>`:""}
        <button type="button" data-act="close" aria-label="Dicht" aria-pressed="false">${m.arrowDown}</button>
      </div>`}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.covers.map((i,s)=>`
      <div class="cv" data-i="${s}" data-state="unknown" style="--tone:${w(i.tone??e.tone,"solar")}">
        <button class="chip" type="button" aria-label="Meer info"></button>
        <div class="txt"><div class="nm"></div><div class="st"></div></div>
        ${this.keysHtml(e.show_stop!==!1)}
        <div class="pos" hidden></div>
      </div>`).join(""),a=e.group&&e.covers.length>1?`<div class="cv group" data-i="all" style="--tone:${w(e.tone,"solar")}">
             <span class="chip" style="cursor:default">${m.shutterOpen}</span>
             <div class="txt"><div class="nm">Alles</div><div class="st"></div></div>
             ${this.keysHtml(e.show_stop!==!1)}
           </div>`:"";return`<div class="card surface">${e.title||e.show_summary?`<div class="head">${e.title?`<b>${e.title}</b>`:""}<span class="sum"></span></div>`:""}${t}${a}</div>`}entitiesFor(e){return e==="all"?this.config.covers.map(t=>t.entity):[this.config.covers[+e].entity]}wire(){this.dragging_=new Set,this.$$(".cv").forEach(e=>{let t=e.dataset.i;if(e.querySelectorAll(".keys button").forEach(i=>{i.addEventListener("click",()=>{let s={open:"open_cover",stop:"stop_cover",close:"close_cover"};this.hass.callService("cover",s[i.dataset.act],{entity_id:this.entitiesFor(t)})})}),t==="all")return;let a=this.config.covers[+t].entity;this.teardown_.push(N(e.querySelector(".chip"),{onTap:()=>C(this,a),onHold:()=>C(this,a)}));let r=e.querySelector(".pos");r.addEventListener("input",i=>{if(i.target.type!=="range")return;this.dragging_.add(t);let s=+i.target.value;r.querySelector(".slider").style.setProperty("--v",`${s}%`),e.querySelector(".st").textContent=`${s}% open`}),r.addEventListener("change",i=>{i.target.type==="range"&&(this.dragging_.delete(t),this.hass.callService("cover","set_cover_position",{entity_id:a,position:+i.target.value}))})})}paint(){let e=0,t=0;this.$$(".cv").forEach(i=>{let s=i.dataset.i;if(s==="all")return;let d=this.config.covers[+s],l=g(this.hass,d.entity),u=T(this.hass,d.entity),b=!l||l.state==="unavailable",h=l?.state??"unknown";i.dataset.state=h,i.classList.toggle("unavailable",b);let f=i.querySelector(".chip"),z=d.icon??this.config.icon??F(d.entity,u);f.dataset.icon!==z&&(f.dataset.icon=z,f.innerHTML=M(z,"shutter")),i.querySelector(".nm").textContent=S(this.hass,d.entity,d.name);let p=J(l,X.SET_POSITION)&&u.current_position!=null;p?(t++,u.current_position>0&&e++):(h==="open"||h==="closed")&&(t++,h==="open"&&e++);let A=i.querySelector(".st");this.dragging_.has(s)||(A.textContent=b?"Niet bereikbaar":h==="opening"?"Gaat open":h==="closing"?"Gaat dicht":p?`${u.current_position}% open`:h==="open"?"Open":h==="closed"?"Dicht":"Geen terugkoppeling"),i.querySelectorAll(".keys button").forEach(q=>{if(q.dataset.act==="stop")return;let L=q.dataset.act==="open",Le=!p&&(h==="open"||h==="closed")?L&&h==="open"||!L&&h==="closed":p?L&&u.current_position===100||!L&&u.current_position===0:!1;q.setAttribute("aria-pressed",String(Le)),q.disabled=b||(L?!J(l,X.OPEN):!J(l,X.CLOSE))});let P=i.querySelector('[data-act="stop"]');P&&(P.disabled=b||!J(l,X.STOP));let V=i.querySelector(".pos"),ye=p&&this.config.show_position!==!1;if(V.hidden=!ye,ye&&(V.dataset.built||(V.dataset.built="1",V.innerHTML=`
            <div class="slider" style="--v:0%">
              <span class="track"><span class="fill"></span></span>
              <input type="range" min="0" max="100" step="1" value="0" aria-label="Positie" />
            </div>`),!this.dragging_.has(s))){let q=u.current_position??0,L=V.querySelector("input");document.activeElement!==L&&(L.value=String(q)),V.querySelector(".slider").style.setProperty("--v",`${q}%`)}});let a=this.$(".sum");if(a){let i=this.config.covers.length;a.textContent=t?t<i?`${e} van ${t} bekend open`:`${e} van ${i} open`:`${i} stuks`}let r=this.$('.cv[data-i="all"] .st');r&&(r.textContent=`${this.config.covers.length} tegelijk bedienen`)}getCardSize(){return 1+this.config.covers.length}getGridOptions(){return{columns:12,rows:this.config.covers.length*2+(this.config.group?2:0)+1,min_columns:6,min_rows:3}}static getConfigElement(){return document.createElement("domotiapp-cover-card-editor")}static getStubConfig(e,t){let a=t?.find(r=>r.startsWith("cover."));return{covers:a?[a]:[],title:"Rolluiken"}}},be=class extends y{pickers(){return[{key:"icon",kind:"icon",label:"Icoon (voor alle rolluiken)",fallback:"shutter"},{key:"tone",kind:"tone",label:"Kleur"}]}schema(){return[{name:"covers",selector:{entity:{domain:"cover",multiple:!0}}},{name:"title",selector:c.text()},$("Weergave","mdi:eye",[v({name:"show_stop",selector:c.bool()},{name:"group",selector:c.bool()}),v({name:"show_position",selector:c.bool()},{name:"show_summary",selector:c.bool()}),{name:"bare",selector:c.bool()}])]}label(e){return{covers:"Rolluiken",show_stop:"Stopknop tonen",group:"Alles-tegelijk-regel",show_position:"Schuif tonen als het kan",show_summary:"Samenvatting tonen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="show_position")return"De schuif verschijnt alleen bij motoren die hun stand terugmelden. Doen ze dat niet, dan blijven het open, stop en dicht."}};_("domotiapp-cover-card-editor",be);k("domotiapp-cover-card",ge,{name:"DomotiApp Rolluiken",description:"Open, stop en dicht. Een positieschuif alleen bij motoren die terugmelden."});function Fe(n,e){if(!e)return{label:"Onbekend",home:null};switch(e.state){case"home":return{label:"Thuis",home:!0};case"not_home":return{label:"Afwezig",home:!1};case"unknown":case"unavailable":return{label:"Onbekend",home:null};default:return{label:e.state,home:!1}}}var fe=class extends x{static css=`
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
  `;validate(e){let t=e.persons??e.entities??(e.entity?[e.entity]:[]);return t.length?{layout:"chips",show_state:!0,...e,persons:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[E]:"Kies minstens \xE9\xE9n persoon."}}watched(){return this.config.persons.flatMap(e=>[e.entity,e.battery,e.tracker].filter(Boolean))}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.layout==="rows",a=e.persons.map((s,d)=>`
      <button class="p" type="button" data-i="${d}" style="--tone:var(--dac-ink-3)">
        <span class="av"><span class="ph"></span></span>
        ${t?`<span class="txt"><span class="nm"></span><span class="st"></span></span>
               <span class="batt"></span>`:`<span class="nm"></span>${e.show_state===!1?"":'<span class="st"></span>'}`}
      </button>`).join(""),r=e.title||e.show_summary?`<div class="head">${e.title?`<b>${e.title}</b>`:""}<span class="sum"></span></div>`:"",i=e.columns??Math.min(e.persons.length,6);return`
      <div class="card surface">
        ${r}
        <div class="${t?"rows":"chips"}" style="--cols:${i}">${a}</div>
      </div>`}wire(){this.$$(".p").forEach(e=>{let t=this.config.persons[+e.dataset.i];this.teardown_.push(N(e,{onTap:()=>C(this,t.entity),onHold:()=>C(this,t.entity)}))})}paint(){let e=0;this.$$(".p").forEach(a=>{let r=this.config.persons[+a.dataset.i],i=g(this.hass,r.entity),s=Fe(this.hass,i);s.home&&e++;let d=r.tone?w(r.tone):s.home===!0?"var(--dac-good)":s.home===!1?"var(--dac-warn)":"var(--dac-ink-3)";a.style.setProperty("--tone",d);let l=S(this.hass,r.entity,r.name);this.text(a.querySelector(".nm"),l);let u=a.querySelector(".st");u&&this.text(u,s.label);let b=a.querySelector(".ph"),h=i?.attributes?.entity_picture,f=h?`img:${h}`:l?`ini:${l[0]}`:"icon";b.dataset.kind!==f&&(b.dataset.kind=f,b.innerHTML=h?`<img src="${h}" alt="" loading="lazy" />`:l?l[0].toUpperCase():m.person);let z=a.querySelector(".batt");if(z){let p=r.battery?g(this.hass,r.battery):null;z.innerHTML=p&&!Number.isNaN(+p.state)?`<i></i>${Math.round(+p.state)}%`:""}a.setAttribute("aria-label",`${l}, ${s.label}`)});let t=this.$(".sum");t&&(t.textContent=e===0?"niemand thuis":`${e} van ${this.config.persons.length} thuis`)}getCardSize(){return this.config.layout==="rows"?this.config.persons.length:2}getGridOptions(){return this.config.layout==="rows"?{columns:12,rows:this.config.persons.length*2+1,min_columns:6}:{columns:"full",rows:3,min_columns:6,min_rows:2}}static getConfigElement(){return document.createElement("domotiapp-person-card-editor")}static getStubConfig(e){return{persons:Object.keys(e?.states??{}).filter(a=>a.startsWith("person.")).slice(0,6),layout:"chips"}}},ve=class extends y{pickers(){return[{key:"tone",kind:"tone",label:"Vaste kleur (leeg = thuis/afwezig)"}]}schema(){return[{name:"persons",selector:{entity:{domain:["person","device_tracker"],multiple:!0}}},v({name:"title",selector:c.text()},{name:"layout",selector:c.select([{value:"chips",label:"Chips (compact)"},{value:"rows",label:"Rijen"}])}),$("Weergave","mdi:eye",[v({name:"show_state",selector:c.bool()},{name:"show_summary",selector:c.bool()}),{name:"columns",selector:c.number(2,8)},{name:"bare",selector:c.bool()}])]}label(e){return{persons:"Personen",show_state:"Thuis/afwezig tonen",show_summary:"Aantal thuis tonen",columns:"Kolommen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="columns")return"Leeg laten laat de kaart het aantal personen volgen, tot zes op een rij."}};_("domotiapp-person-card-editor",ve);k("domotiapp-person-card",fe,{name:"DomotiApp Personen",description:"Wie er thuis is, compact. Het hele huishouden in \xE9\xE9n kaart."});var Ye=[[/gft|groente|tuin|organi/i,"teal","binWheeled"],[/pmd|plastic|verpakking/i,"solar","binWheeled"],[/papier|karton/i,"water","binWheeled"],[/rest|grijs/i,"neutral","binWheeled"],[/textiel|kleding/i,"pink","bin"],[/glas/i,"magenta","bin"],[/kerstboom|snoei|takken/i,"teal","bin"]];function Xe(n){for(let[e,t,a]of Ye)if(e.test(n))return{tone:t,icon:a};return{tone:"accent",icon:"bin"}}var Je=n=>String(n??"").replace(/^(afvalbeheer|afvalwijzer|mijnafvalwijzer)\s*/i,"").replace(/\s*(mijnafvalwijzer)\s*/i," ").trim(),xe=class extends x{static css=`
    :host { display: block; }

    .card { padding: 14px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; }

    .head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
    .head b { font-size: 14px; font-weight: 600; }
    .head:empty { display: none; }

    /* ---- hero ---- */
    .hero {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; border-radius: var(--dac-radius-sm);
      background: color-mix(in srgb, var(--tone) 11%, transparent);
      border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent);
    }
    .hero .bin {
      width: 46px; height: 46px; flex: 0 0 auto; display: grid; place-items: center;
      border-radius: var(--dac-radius-sm); color: var(--tone);
      background: color-mix(in srgb, var(--tone) 18%, transparent);
    }
    .hero .bin .icon, .hero .bin ha-icon { width: 24px; height: 24px; --mdc-icon-size: 24px; }
    .hero .what { min-width: 0; }
    .hero .big {
      font-size: 21px; font-weight: 500; letter-spacing: -.02em; line-height: 1.15;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .hero .when { margin-left: auto; text-align: right; flex: 0 0 auto; }
    .hero .when .n { font-size: 21px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }

    /* Today and tomorrow are the only two states that need to shout. */
    :host([urgency="today"]) .hero { animation: pulse 2.6s ease-in-out infinite; }
    @keyframes pulse {
      0%, 100% { border-color: color-mix(in srgb, var(--tone) 34%, transparent); }
      50%      { border-color: color-mix(in srgb, var(--tone) 72%, transparent); }
    }

    /* ---- list ---- */
    .list { margin-top: 12px; }
    .r {
      display: grid; grid-template-columns: 10px 1fr auto; gap: 12px; align-items: center;
      padding: 9px 2px; font-size: 13px;
    }
    .r + .r { border-top: 1px solid var(--dac-border); }
    .r i { width: 10px; height: 10px; border-radius: 3px; background: var(--tone); }
    .r .d { color: var(--dac-ink-2); font-variant-numeric: tabular-nums; text-align: right; }
    .r .d small { color: var(--dac-ink-3); margin-left: 6px; }

    .empty { padding: 18px 2px; font-size: 13px; color: var(--dac-ink-3); }
  `;validate(e){let t=e.sensors??e.entities??(e.entity?[e.entity]:[]);return t.length?{show_hero:!0,show_list:!0,...e,sensors:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[E]:"Kies minstens \xE9\xE9n afvalsensor waarvan de toestand een datum is."}}watched(){return this.config.sensors.map(e=>e.entity)}read_(){let e=new Date;return this.config.sensors.map(t=>{let a=g(this.hass,t.entity);if(!a)return null;let r=B(a.state)??B(a.attributes.date)??B(a.attributes.next_date);if(!r)return null;let i=t.label??Je(S(this.hass,t.entity,t.name)),s=Xe(t.label??t.entity+i);return{label:i,date:r,days:ee(e,r),tone:w(t.tone??s.tone),icon:t.icon??s.icon}}).filter(t=>t&&t.days>=0).sort((t,a)=>t.date-a.date)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`
      <div class="card surface">
        ${e.title?`<div class="head"><b>${e.title}</b></div>`:""}
        ${e.show_hero===!1?"":`<div class="hero" hidden>
          <span class="bin"></span>
          <span class="what">
            <span class="eyebrow"></span>
            <span class="big"></span>
          </span>
          <span class="when"><span class="n tnum"></span><span class="eyebrow u"></span></span>
        </div>`}
        ${e.show_list===!1?"":'<div class="list"></div>'}
        <div class="empty" hidden>Geen ophaaldata gevonden. Controleer of de gekozen sensoren een datum als toestand hebben.</div>
      </div>`}paint(){let e=this.read_(),t=this.$(".hero"),a=this.$(".list"),r=this.$(".empty");if(r.hidden=e.length>0,t&&(t.hidden=e.length===0,e.length)){let i=e[0];t.style.setProperty("--tone",i.tone),this.setAttribute("urgency",i.days===0?"today":i.days===1?"tomorrow":"later");let s=t.querySelector(".bin");s.dataset.icon!==i.icon&&(s.dataset.icon=i.icon,s.innerHTML=M(i.icon,"bin")),this.text(t.querySelector(".eyebrow"),te(i.date)),this.text(t.querySelector(".big"),i.label),this.text(t.querySelector(".n"),i.days===0?"nu":String(i.days)),this.text(t.querySelector(".u"),i.days===0?"aan de weg":i.days===1?"dag":"dagen")}if(a){let i=this.config.show_hero===!1?e:e.slice(1),s=i.map(d=>`${d.label}${+d.date}`).join("|");if(a.dataset.sig===s)return;a.dataset.sig=s,a.innerHTML=i.map(d=>{let l=te(d.date),u=d.days<=6?`<small>${Oe(d.date)}</small>`:"";return`
        <div class="r" style="--tone:${d.tone}">
          <i></i><span>${d.label}</span>
          <span class="d">${l}${u}</span>
        </div>`}).join("")}}getCardSize(){return 2+this.config.sensors.length}getGridOptions(){return{columns:12,rows:this.config.sensors.length*2+3,min_columns:6,min_rows:4}}static getConfigElement(){return document.createElement("domotiapp-waste-card-editor")}static getStubConfig(e){return{sensors:Object.keys(e?.states??{}).filter(a=>/afval|waste|trash|garbage|ophaal/i.test(a)&&a.startsWith("sensor.")).filter(a=>B(e.states[a]?.state)).slice(0,6),title:"Afvalkalender"}}},we=class extends y{schema(){return[{name:"sensors",selector:{entity:{domain:"sensor",multiple:!0}}},{name:"title",selector:c.text()},$("Weergave","mdi:eye",[v({name:"show_hero",selector:c.bool()},{name:"show_list",selector:c.bool()}),{name:"bare",selector:c.bool()}])]}label(e){return{sensors:"Afvalsensoren",show_hero:"Eerstvolgende uitlichten",show_list:"Overige data tonen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="sensors")return"Sensoren waarvan de toestand een datum is, bijvoorbeeld 18-08-2026. De kaart sorteert zelf en kiest de bakkleur op de naam."}};_("domotiapp-waste-card-editor",we);k("domotiapp-waste-card",xe,{name:"DomotiApp Afvalkalender",description:"Eerstvolgende ophaling als hero, de rest eronder. Kleur per fractie."});var Qe="0.1.1";console.info(`%c DOMOTIAPP-CARDS %c ${Qe} `,"background:#026fa1;color:#e8e4de;font-weight:600;border-radius:3px 0 0 3px;padding:2px 6px","background:#12120f;color:#e8e4de;border-radius:0 3px 3px 0;padding:2px 6px");export{Qe as VERSION};
//# sourceMappingURL=domotiapp-cards.js.map
