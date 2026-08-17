/*! DomotiApp Cards 0.1.2 | MIT | https://github.com/Sven2410/domotiapp-cards */
var I=`
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
`,ye=`
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
`;function R(n){let e=new CSSStyleSheet;return e.replaceSync(n),e}var O=n=>String(n??"").split(".")[0],u=(n,e)=>e&&n?.states?.[e]||null,L=(n,e)=>u(n,e)?.attributes??{};function _(n,e,t){return t||L(n,e).friendly_name||e||""}var Te=new Set(["scene","script","input_button","button","event"]),Y=n=>Te.has(O(n));function G(n){return!n||n.state==="unavailable"?!0:n.state==="unknown"?!Y(n.entity_id):!1}function Me(n){if(!n)return!1;let e=n.state;if(e==="unavailable"||e==="unknown")return!1;switch(O(n.entity_id)){case"cover":return e==="open"||e==="opening";case"alarm_control_panel":return e.startsWith("armed")||e==="triggered"||e==="arming";case"climate":case"water_heater":case"humidifier":return e!=="off";case"person":case"device_tracker":return e==="home";case"media_player":return e!=="off"&&e!=="idle"&&e!=="standby";default:return e==="on"||e==="playing"||e==="active"||e==="heat"}}function $e(n,e,t){if(!n||n.themes!==e.themes||n.language!==e.language)return!0;for(let a of t)if(a&&n.states?.[a]!==e.states?.[a])return!0;return!1}function W(n,e,t={}){n.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0,cancelable:!1}))}var A=(n,e)=>W(n,"hass-more-info",{entityId:e});function Se(n){switch(O(n)){case"light":case"switch":case"fan":case"input_boolean":case"automation":case"siren":return{action:"toggle"};case"script":case"scene":case"input_button":case"button":return{action:"toggle"};default:return{action:"more-info"}}}function De(n){switch(O(n)){case"scene":return["scene","turn_on"];case"script":return["script","turn_on"];case"input_button":return["input_button","press"];case"button":return["button","press"];case"lock":return["lock","open"];case"cover":return["cover","toggle"];case"media_player":return["media_player","media_play_pause"];default:return["homeassistant","toggle"]}}function ze(n,e,t,a){if(!(!a||a.action==="none"))switch(a.action){case"more-info":A(n,a.entity||t.entity);break;case"toggle":{let r=a.entity||t.entity;if(!r)break;let[i,o]=De(r);e.callService(i,o,{entity_id:r});break}case"perform-action":case"call-service":{let r=a.perform_action||a.service;if(!r)break;let[i,o]=r.split(".");e.callService(i,o,a.data??a.service_data??{},a.target);break}case"navigate":if(!a.navigation_path)break;history.pushState(null,"",a.navigation_path),W(window,"location-changed",{replace:!1});break;case"url":a.url_path&&window.open(a.url_path,a.target??"_blank");break;case"assist":W(n,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}});break;case"fire-dom-event":W(n,"ll-custom",a);break;default:break}}function T(n,{onTap:e,onHold:t,onDouble:a}){let r=null,i=!1,o=0,l=null,c=()=>{r&&clearTimeout(r),r=null},h=g=>{g.button!=null&&g.button!==0||(i=!1,c(),t&&(r=setTimeout(()=>{i=!0,navigator.vibrate?.(18),t()},500)))},p=()=>{if(i){i=!1;return}if(!a){e?.();return}if(o++,o===1){l=setTimeout(()=>{o=0,e?.()},260);return}clearTimeout(l),o=0,a()},b=()=>{c()};return n.addEventListener("pointerdown",h),n.addEventListener("pointerup",b),n.addEventListener("pointercancel",b),n.addEventListener("pointerleave",b),n.addEventListener("click",p),n.addEventListener("contextmenu",g=>g.preventDefault()),()=>{c(),clearTimeout(l),n.removeEventListener("pointerdown",h),n.removeEventListener("pointerup",b),n.removeEventListener("pointercancel",b),n.removeEventListener("pointerleave",b),n.removeEventListener("click",p)}}function D(n,e){if(!e)return"";let t=O(e.entity_id),a=e.attributes.device_class;return n.formatEntityState?.(e)??n.localize?.(`component.${t}.entity_component.${a??"_"}.state.${e.state}`)??n.localize?.(`component.${t}.entity_component._.state.${e.state}`)??e.state}function j(n,e,t){let a=Number(e);return Number.isFinite(a)?a.toLocaleString(n?.locale?.language??"nl",{minimumFractionDigits:t??0,maximumFractionDigits:t??0}):"--"}var ke=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Ee=["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],_e=(n=new Date)=>new Date(n.getFullYear(),n.getMonth(),n.getDate()),X=(n,e)=>Math.round((_e(e)-_e(n))/864e5);function P(n){if(!n)return null;if(n instanceof Date)return Number.isNaN(+n)?null:n;let e=String(n).trim(),t=e.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);if(t)return new Date(+t[3],+t[2]-1,+t[1]);if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/),t)return new Date(+t[1],+t[2]-1,+t[3]);let a=new Date(e);return Number.isNaN(+a)?null:a}function J(n,e=new Date){if(!n)return"";let t=X(e,n);return t<0?`${Math.abs(t)} dagen geleden`:t===0?"vandaag":t===1?"morgen":t===2?"overmorgen":t<=6?ke[n.getDay()]:`${ke[n.getDay()].slice(0,2)} ${n.getDate()} ${Ee[n.getMonth()]}`}var Ce=n=>n?`${n.getDate()} ${Ee[n.getMonth()]}`:"";var je=`
  :host {
    ${I}
    display: block;
    font-family: var(--dac-font);
    color: var(--dac-ink);
    -webkit-font-smoothing: antialiased;
  }
  :host([hidden]) { display: none; }
`,N={accent:"var(--dac-accent-hi)",solar:"var(--dac-solar)",house:"var(--dac-house)",water:"var(--dac-grid-in)",magenta:"var(--dac-grid-out)",pink:"var(--dac-device-1)",teal:"var(--dac-device-2)",lit:"var(--dac-lit)",good:"var(--dac-good)",warn:"var(--dac-warn)",bad:"var(--dac-bad)",neutral:"var(--dac-ink-3)"},K={accent:"Accent",solar:"Oranje",house:"Blauw",water:"Lichtblauw",magenta:"Magenta",pink:"Roze",teal:"Groenblauw",lit:"Lampgeel",good:"Goed",warn:"Let op",bad:"Kritiek",neutral:"Neutraal"},M=(n,e="accent")=>N[n]??(n&&/[#(]|^var/.test(n)?n:N[e]),S=Symbol("incomplete"),Ne=n=>`
  <div class="needs">
    <span class="mark"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6"/>
      <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>
    </svg></span>
    <span><b>Nog niets gekozen</b><span>${n}</span></span>
  </div>`,f=class extends HTMLElement{static css="";static get styleSheets_(){return Object.hasOwn(this,"sheets_")||(this.sheets_=[R(je+ye+this.css)]),this.sheets_}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=new.target.styleSheets_,this.built_=!1,this.teardown_=[]}setConfig(e){let t=this.validate(e??{});this.config=t,this.built_&&(this.destroy_(),this.shadowRoot.replaceChildren(),this.built_=!1),this.isConnected&&this.build_()}set hass(e){let t=this.hass_;if(this.hass_=e,!!this.config){if(!this.built_){this.build_();return}this.config[S]||$e(t,e,this.watched())&&this.paint()}}get hass(){return this.hass_}connectedCallback(){this.config&&!this.built_&&this.build_()}disconnectedCallback(){this.destroy_()}validate(e){return e}watched(){return this.config?.entity?[this.config.entity]:[]}template(){return""}wire(){}paint(){}build_(){let e=document.createElement("template"),t=this.config?.[S];e.innerHTML=t?Ne(t):this.template(),this.shadowRoot.appendChild(e.content),this.built_=!0,!t&&(this.wire(),this.hass_&&this.paint())}destroy_(){for(let e of this.teardown_)try{e()}catch{}this.teardown_=[]}$(e){return this.shadowRoot.querySelector(e)}$$(e){return[...this.shadowRoot.querySelectorAll(e)]}text(e,t){let a=typeof e=="string"?this.$(e):e;a&&a.textContent!==String(t)&&(a.textContent=t)}getCardSize(){return 1}};function y(n,e,{name:t,description:a,preview:r=!0}={}){customElements.get(n)||(customElements.define(n,e),window.customCards=window.customCards??[],window.customCards.push({type:n,name:t??n,description:a??"",preview:r,documentationURL:"https://github.com/Sven2410/domotiapp-cards"}))}function k(n,e){customElements.get(n)||customElements.define(n,e)}var s=(n,e="none")=>`<svg class="icon" viewBox="0 0 24 24" fill="${e}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${n}</svg>`,m={house:s(`<path d="M3.2 11.3 12 4.1l8.8 7.2"/>
    <path d="M5.4 12.9V20a.9.9 0 0 0 .9.9h11.4a.9.9 0 0 0 .9-.9v-7.1"/>
    <path d="M9.8 20.9v-5.2h4.4v5.2"/>`),floorB:s(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M9.4 17.8V14h2.4a1.9 1.9 0 0 1 0 3.8Z"/>`),floor1:s(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.6 15.2 12 14v3.9"/>`),floor2:s(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.4 14.8a1.6 1.6 0 0 1 3.1.5c0 1.4-3.1 1.8-3.1 3.5h3.2"/>`),garage:s(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M8.2 20.4v-5.6h7.6v5.6M8.2 17.6h7.6"/>`),shutter:s(`<path d="M3.6 4.2h16.8M5.2 4.2v13.4M18.8 4.2v13.4"/>
    <path d="M5.2 7.6h13.6M5.2 11h13.6M5.2 14.4h13.6M5.2 17.6h13.6"/>`),shutterOpen:s(`<path d="M3.6 4.2h16.8M5.2 4.2v15.6M18.8 4.2v15.6"/>
    <path d="M5.2 6.6h13.6M5.2 8.6h13.6"/>`),awning:s(`<path d="M2.8 11.4 6.2 5h11.6l3.4 6.4z"/>
    <path d="M2.8 11.4c1.5 1.7 3 1.7 4.5 0s3-1.7 4.5 0 3 1.7 4.5 0 3-1.7 4.5 0"/>
    <path d="M12 14.6v4.8"/>`),arrowUp:s('<path d="M12 19.4V5M6.4 10.6 12 5l5.6 5.6"/>'),arrowDown:s('<path d="M12 4.6V19M17.6 13.4 12 19l-5.6-5.6"/>'),stop:s('<rect x="6.4" y="6.4" width="11.2" height="11.2" rx="1.8"/>'),bulb:s(`<path d="M9.4 18.4h5.2M10.4 21.2h3.2"/>
    <path d="M12 2.9a6.2 6.2 0 0 0-3.6 11.2c.5.4.8 1 .8 1.7v.4h5.6v-.4c0-.7.3-1.3.8-1.7A6.2 6.2 0 0 0 12 2.9Z"/>`),bulbGroup:s(`<path d="M7.6 15.6h4M8.2 17.8h2.8"/>
    <path d="M9.6 3.4a4.8 4.8 0 0 0-2.8 8.7c.4.3.6.8.6 1.3v.5h4.4v-.5c0-.5.2-1 .6-1.3a4.8 4.8 0 0 0-2.8-8.7Z"/>
    <path d="M16 8.4a4.4 4.4 0 0 1 2.4 8c-.3.3-.5.7-.5 1.1v.4h-3.8"/>
    <path d="M15.4 20.6h2.4"/>`),switchOn:s(`<rect x="2.8" y="7.4" width="18.4" height="9.2" rx="4.6"/>
    <circle cx="16.6" cy="12" r="2.6" fill="currentColor" stroke="none"/>`),person:s(`<circle cx="12" cy="7.6" r="3.6"/>
    <path d="M4.8 20.4v-1.2a5 5 0 0 1 5-5h4.4a5 5 0 0 1 5 5v1.2"/>`),people:s(`<circle cx="9.4" cy="8.2" r="3.2"/>
    <path d="M3.4 20v-1a4.6 4.6 0 0 1 4.6-4.6h2.8A4.6 4.6 0 0 1 15.4 19v1"/>
    <path d="M16.2 5.3a3.2 3.2 0 0 1 0 5.9"/>
    <path d="M17.6 14.6a4.6 4.6 0 0 1 3 4.3V20"/>`),away:s(`<circle cx="10.4" cy="7.6" r="3.4"/>
    <path d="M3.6 20.4v-1.2a4.8 4.8 0 0 1 4.8-4.8h2.6"/>
    <path d="M14.6 17.4h6M18 14.8l2.6 2.6-2.6 2.6"/>`),bin:s(`<path d="M3.6 6.8h16.8"/>
    <path d="M9.4 6.8V4.6a.9.9 0 0 1 .9-.9h3.4a.9.9 0 0 1 .9.9v2.2"/>
    <path d="m5.9 6.8 1 12.5a1 1 0 0 0 1 .9h8.2a1 1 0 0 0 1-.9l1-12.5"/>
    <path d="M10.2 10.6v5.8M13.8 10.6v5.8"/>`),binWheeled:s(`<path d="M5.6 7.4h12.8l-1 10.6a1 1 0 0 1-1 .9H7.6a1 1 0 0 1-1-.9z"/>
    <path d="M4.4 7.4h15.2M9.6 7.4V5.2h4.8v2.2"/>
    <circle cx="8.6" cy="20.4" r="1.3"/><circle cx="15.4" cy="20.4" r="1.3"/>`),calendar:s(`<rect x="3.6" y="5.4" width="16.8" height="15" rx="2"/>
    <path d="M3.6 10h16.8M8.4 3.4v3.6M15.6 3.4v3.6"/>`),sun:s(`<circle cx="12" cy="12" r="4.1"/>
    <path d="M12 2.4v2.3M12 19.3v2.3M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.3M19.3 12h2.3M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"/>`),cloud:s('<path d="M7.2 18.4a4.2 4.2 0 0 1-.5-8.4 5.6 5.6 0 0 1 10.8-1.2 3.9 3.9 0 0 1 .6 7.7z"/>'),cloudSun:s(`<path d="M6.8 8.2a3.4 3.4 0 1 1 4.6 3.2"/>
    <path d="M5 4.6 6.1 5.7M3.2 9.2h1.6M9.4 4.6 8.3 5.7M6.8 1.9v1.5"/>
    <path d="M9.4 19.6a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10 1 3.6 3.6 0 0 1 .5 6.8z"/>`),rain:s(`<path d="M7.4 15.4a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10-1.1 3.6 3.6 0 0 1 .6 7.1"/>
    <path d="M9 18.2 8.2 20.6M12.4 18.2l-.8 2.4M15.8 18.2l-.8 2.4"/>`),snow:s(`<path d="M7.4 14.6a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10-1.1 3.6 3.6 0 0 1 .6 7.1"/>
    <path d="M9 17.6v3M7.6 18.4l2.8 1.4M10.4 18.4l-2.8 1.4"/>
    <path d="M15 17.6v3M13.6 18.4l2.8 1.4M16.4 18.4l-2.8 1.4"/>`),fog:s(`<path d="M7.4 12.6a3.9 3.9 0 0 1-.5-7.8 5.2 5.2 0 0 1 10-1.1 3.6 3.6 0 0 1 .6 7.1"/>
    <path d="M4.4 16h15.2M6.4 19.4h11.2"/>`),wind:s(`<path d="M3.4 8.4h9.4a2.7 2.7 0 1 0-2.7-2.7"/>
    <path d="M3.4 12.6h13.2a2.7 2.7 0 1 1-2.7 2.7"/>
    <path d="M3.4 16.8h6.2a2.5 2.5 0 1 1-2.5 2.5"/>`),drop:s('<path d="M12 3.4s5.6 6.1 5.6 9.8a5.6 5.6 0 0 1-11.2 0C6.4 9.5 12 3.4 12 3.4Z"/>'),uv:s(`<circle cx="12" cy="11.4" r="3.4"/>
    <path d="M12 3.6v1.8M12 17.4v1.6M4.6 11.4h1.8M17.6 11.4h1.8M6.6 6l1.3 1.3M16.1 15.5l1.3 1.3M6.6 16.8l1.3-1.3M16.1 7.3l1.3-1.3"/>
    <path d="M8.4 21.4h7.2"/>`),sunset:s(`<path d="M3.4 19.6h17.2M6.6 16.2a5.4 5.4 0 0 1 10.8 0"/>
    <path d="M12 3.2v3.4M5.2 6.6l1.8 1.8M18.8 6.6 17 8.4"/>`),sunrise:s(`<path d="M3.4 19.6h17.2M6.6 16.2a5.4 5.4 0 0 1 10.8 0"/>
    <path d="M12 8.2V3.4M9.4 5.8 12 3.2l2.6 2.6"/>`),thermo:s(`<path d="M14.2 14.6V5.6a2.2 2.2 0 1 0-4.4 0v9a4.2 4.2 0 1 0 4.4 0Z"/>
    <path d="M12 9.4v5.8"/>`),shield:s(`<path d="M12 3.2 4.8 5.9v5.5c0 4.4 3 8 7.2 9.4 4.2-1.4 7.2-5 7.2-9.4V5.9z"/>
    <path d="m9.1 12 2 2 3.8-4"/>`),bolt:s('<path d="M13.4 2.6 5.2 13.6h5.6L10.4 21.4l8.4-11.2h-5.6z"/>'),wifi:s(`<path d="M4.2 9.2a11.4 11.4 0 0 1 15.6 0"/>
    <path d="M7.4 12.6a6.9 6.9 0 0 1 9.2 0"/>
    <path d="M10.4 15.9a2.6 2.6 0 0 1 3.2 0"/>
    <circle cx="12" cy="19" r="1.1"/>`),smoke:s(`<path d="M6.4 15.4a3.3 3.3 0 0 1 .5-6.5 4.8 4.8 0 0 1 9.3-.6 3.5 3.5 0 0 1 1.6 7.1z"/>
    <path d="M5.8 19h3.2M11.2 19h3.2M16.6 19h1.8"/>`),star:s('<path d="m12 3.6 2.5 5.1 5.6.8-4 3.9.9 5.6L12 16.4l-5 2.6.9-5.6-4-3.9 5.6-.8z"/>'),moon:s('<path d="M20.4 14.3A8.6 8.6 0 0 1 9.7 3.6a8.8 8.8 0 1 0 10.7 10.7Z"/>'),radio:s(`<rect x="2.8" y="8.4" width="18.4" height="11.4" rx="2"/>
    <path d="m7.4 8.4 9.8-4.2"/>
    <circle cx="15.8" cy="14.1" r="2.9"/>
    <path d="M6.2 12.2h4.4M6.2 16h4.4"/>`),leaf:s(`<path d="M4.6 19.6c-1.4-7.6 3.4-14 14.9-15.2 1.1 8.4-3.3 15.3-14.9 15.2Z"/>
    <path d="M4.2 20.4c2.6-4.6 6-7.6 10.4-9.6"/>`),cog:s(`<circle cx="12" cy="12" r="3.1"/>
    <path d="M12 3.4v2.2M12 18.4v2.2M20.6 12h-2.2M5.6 12H3.4M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5 5.9 5.9"/>`),grid:s(`<rect x="3.6" y="3.6" width="7.2" height="7.2" rx="1.8"/>
    <rect x="13.2" y="3.6" width="7.2" height="7.2" rx="1.8"/>
    <rect x="3.6" y="13.2" width="7.2" height="7.2" rx="1.8"/>
    <rect x="13.2" y="13.2" width="7.2" height="7.2" rx="1.8"/>`),door:s(`<path d="M5.4 20.6h13.2"/>
    <path d="M6.8 20.6V4.6a.9.9 0 0 1 .9-.9h8.6a.9.9 0 0 1 .9.9v16"/>
    <circle cx="14.4" cy="12.4" r="1"/>`),window:s(`<rect x="4.2" y="3.8" width="15.6" height="16.4" rx="1.6"/>
    <path d="M12 3.8v16.4M4.2 12h15.6"/>`),lock:s(`<rect x="4.8" y="10.4" width="14.4" height="9.8" rx="2"/>
    <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6"/>
    <circle cx="12" cy="15.3" r="1.2"/>`),lockOpen:s(`<rect x="4.8" y="10.4" width="14.4" height="9.8" rx="2"/>
    <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.4-1.1"/>
    <circle cx="12" cy="15.3" r="1.2"/>`),fan:s(`<circle cx="12" cy="12" r="1.9"/>
    <path d="M12 10.1c0-3 .6-6.4 3-6.4 1.7 0 2.4 2.6-.4 4.6"/>
    <path d="M13.9 12c3 0 6.4.6 6.4 3 0 1.7-2.6 2.4-4.6-.4"/>
    <path d="M12 13.9c0 3-.6 6.4-3 6.4-1.7 0-2.4-2.6.4-4.6"/>
    <path d="M10.1 12c-3 0-6.4-.6-6.4-3 0-1.7 2.6-2.4 4.6.4"/>`),airco:s(`<rect x="3.4" y="4.6" width="17.2" height="8.2" rx="2"/>
    <path d="M6.6 9.6h10.8"/>
    <path d="M7.4 16.2c1.6 0 1.6 2.2 3.2 2.2M13.4 16.2c1.6 0 1.6 2.2 3.2 2.2"/>`),tv:s(`<rect x="2.8" y="4.4" width="18.4" height="12.2" rx="1.8"/>
    <path d="M8.4 20.2h7.2M12 16.6v3.6"/>`),speaker:s(`<rect x="5.6" y="2.8" width="12.8" height="18.4" rx="2"/>
    <circle cx="12" cy="15" r="3.2"/><circle cx="12" cy="6.8" r="1.2"/>`),camera:s(`<path d="M3.4 8.6A1.6 1.6 0 0 1 5 7h8a1.6 1.6 0 0 1 1.6 1.6v6.8A1.6 1.6 0 0 1 13 17H5a1.6 1.6 0 0 1-1.6-1.6z"/>
    <path d="m14.6 11 6-3v8l-6-3z"/>`),car:s(`<path d="M4.2 15.4h15.6"/>
    <path d="M6.2 15.4v2.4a.9.9 0 0 1-.9.9h-.7a.9.9 0 0 1-.9-.9v-2.4M20.3 15.4v2.4a.9.9 0 0 1-.9.9h-.7a.9.9 0 0 1-.9-.9v-2.4"/>
    <path d="M3.8 15.4v-3.2l2-4.6a1.3 1.3 0 0 1 1.2-.8h10a1.3 1.3 0 0 1 1.2.8l2 4.6v3.2z"/>
    <circle cx="7.4" cy="12.5" r=".95"/><circle cx="16.6" cy="12.5" r=".95"/>`),plug:s(`<path d="M9 3.4v5.2M15 3.4v5.2"/>
    <path d="M6.4 8.6h11.2v2.2a5.6 5.6 0 0 1-11.2 0z"/>
    <path d="M12 16.4v4.2"/>`),battery:s(`<rect x="2.8" y="7.4" width="16.4" height="9.2" rx="2"/>
    <path d="M21.2 10.6v2.8"/>
    <rect x="5.2" y="9.8" width="6" height="4.4" rx="1" fill="currentColor" stroke="none"/>`),gaugeArrow:s(`<path d="M4.2 17.4a8.4 8.4 0 1 1 15.6 0"/>
    <path d="m12 13.6 3.6-3.8"/><circle cx="12" cy="14.8" r="1.3"/>`),clock:s('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 1.9"/>'),washer:s(`<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2"/>
    <circle cx="12" cy="14" r="4.4"/>
    <path d="M4.2 7.4h15.6M15.4 5.1h1.6"/>`),dishwasher:s(`<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2"/>
    <path d="M4.2 7.8h15.6M7.2 5.3h2.4"/>
    <path d="M9 11.4c1 1.4 1 2.8 0 4.2M12 11.4c1 1.4 1 2.8 0 4.2M15 11.4c1 1.4 1 2.8 0 4.2"/>`),printer:s(`<path d="M7 9V4.6a.6.6 0 0 1 .6-.6h8.8a.6.6 0 0 1 .6.6V9"/>
    <rect x="3.6" y="9" width="16.8" height="7.2" rx="1.8"/>
    <path d="M7 15.4h10v4a.6.6 0 0 1-.6.6H7.6a.6.6 0 0 1-.6-.6z"/>`),key:s(`<circle cx="7.8" cy="12" r="3.8"/>
    <path d="M11.6 12h8.6M17.4 12v3M20.2 12v2.2"/>`),power:s(`<path d="M12 3.6v8"/>
    <path d="M17.4 6.6a7.6 7.6 0 1 1-10.8 0"/>`),plus:s('<path d="M12 5.2v13.6M5.2 12h13.6"/>'),minus:s('<path d="M5.2 12h13.6"/>'),chevronRight:s('<path d="m9.4 6.2 5.6 5.8-5.6 5.8"/>'),chevronDown:s('<path d="m6.2 9.4 5.8 5.6 5.8-5.6"/>'),close:s('<path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/>'),check:s('<path d="m5.2 12.6 4.4 4.4 9.2-10"/>'),dots:s('<circle cx="5.4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.6" cy="12" r="1.5"/>'),warning:s('<path d="M12 4.2 2.8 20h18.4z"/><path d="M12 10v4.4M12 17.4v.1"/>'),question:s(`<circle cx="12" cy="12" r="8.6"/>
    <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>`)};function w(n,e="question"){return n?m[n]?m[n]:n.includes(":")?`<ha-icon class="icon" icon="${n}"></ha-icon>`:m[e]??m.question:m[e]??m.question}function Oe(n,e={}){switch(String(n??"").split(".")[0]){case"light":return"bulb";case"switch":return"switchOn";case"cover":return e.device_class==="awning"||e.device_class==="blind"?"awning":"shutter";case"person":case"device_tracker":return"person";case"climate":return"thermo";case"binary_sensor":return e.device_class==="smoke"?"smoke":"shield";case"alarm_control_panel":return"shield";case"scene":case"script":case"input_button":case"button":return"star";case"weather":return"cloudSun";default:return"question"}}function Le(n){switch(n){case"sunny":case"clear-night":return"sun";case"partlycloudy":return"cloudSun";case"cloudy":return"cloud";case"rainy":case"pouring":case"hail":case"lightning":case"lightning-rainy":return"rain";case"snowy":case"snowy-rainy":return"snow";case"fog":return"fog";case"windy":case"windy-variant":return"wind";default:return"cloud"}}var qe=[["Woning",["house","floorB","floor1","floor2","garage","door","window","grid"]],["Rolluiken",["shutter","shutterOpen","awning","arrowUp","arrowDown","stop"]],["Licht en stroom",["bulb","bulbGroup","switchOn","power","plug","bolt","battery"]],["Personen",["person","people","away"]],["Apparaten",["tv","speaker","camera","car","washer","dishwasher","printer","fan","airco","radio"]],["Afval",["bin","binWheeled","calendar"]],["Weer",["sun","cloud","cloudSun","rain","snow","fog","wind","drop","uv","sunrise","sunset","thermo"]],["Status",["shield","lock","lockOpen","key","wifi","smoke","warning","check","close","clock","gaugeArrow"]],["Overig",["star","moon","leaf","cog","dots","plus","minus","chevronRight","chevronDown","question"]]],He=`
  :host { ${I} display: block; font-family: var(--dac-font); }
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
`,Q=null,ee=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),Q=Q??[R(He)],this.shadowRoot.adoptedStyleSheets=Q,this.value_="",this.label="Icoon",this.fallback="question"}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}build_(){this.shadowRoot.innerHTML=`
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
      </div>`,this.$(".current").addEventListener("click",()=>{let t=this.toggleAttribute("open");this.$(".current").setAttribute("aria-expanded",String(t))}),this.shadowRoot.querySelectorAll(".opt").forEach(t=>t.addEventListener("click",()=>this.emit_(t.dataset.icon)));let e=this.$("#mdi");e.addEventListener("change",()=>this.emit_(e.value.trim())),this.$(".clear").addEventListener("click",()=>this.emit_("")),this.paint_()}paint_(){if(!this.shadowRoot.firstElementChild)return;this.$(".label").textContent=this.label??"Icoon";let e=this.value_,t=e||this.fallback||"question";this.$(".preview").innerHTML=w(t,this.fallback),this.$(".who b").textContent=e||"Automatisch",this.$(".who small").textContent=e?e.includes(":")?"Home Assistant-icoon":"DomotiApp-icoon":"Past zich aan de entiteit aan",this.shadowRoot.querySelectorAll(".opt").forEach(i=>i.setAttribute("aria-pressed",String(i.dataset.icon===e)));let a=this.$("#mdi");if(this.shadowRoot.activeElement===a)return;let r=e&&e.includes(":")?e:"";a.value!==r&&(a.value=r)}emit_(e){this.value_=e,this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-icon-picker")||customElements.define("dac-icon-picker",ee);var Ie=["accent","solar","house","water","magenta","pink","teal","lit","neutral"],Re=["good","warn","bad"],Ve=`
  :host { ${I} display: block; font-family: var(--dac-font); }
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
`,te=null,ae=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),te=te??[R(Ve)],this.shadowRoot.adoptedStyleSheets=te,this.value_="",this.label="Kleur"}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}swatch(e){return`<button type="button" class="sw" data-tone="${e}" style="--c:${N[e]}"
      title="${K[e]}" aria-label="${K[e]}" aria-pressed="false">${m.check}</button>`}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        <h4>Identiteit</h4>
        <div class="row">
          <button type="button" class="sw auto" data-tone="" title="Automatisch"
            aria-label="Automatisch" aria-pressed="false">${m.check}</button>
          ${Ie.map(e=>this.swatch(e)).join("")}
        </div>
        <h4>Status</h4>
        <div class="row">${Re.map(e=>this.swatch(e)).join("")}</div>
        <p class="note">
          Statuskleuren betekenen iets: goed, let op, kritiek. Gebruik ze niet om
          een kaart mooier te maken &mdash; dan zegt rood straks niets meer.
        </p>
        <div class="chosen"></div>
      </div>`,this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.addEventListener("click",()=>this.emit_(e.dataset.tone))),this.paint_()}paint_(){this.shadowRoot.firstElementChild&&(this.$(".label").textContent=this.label??"Kleur",this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.setAttribute("aria-pressed",String((e.dataset.tone||"")===this.value_))),this.$(".chosen").innerHTML=this.value_?`Gekozen: <b>${K[this.value_]??this.value_}</b>`:"Gekozen: <b>Automatisch</b> &mdash; de kaart kiest op domein en toestand.")}emit_(e){this.value_=e??"",this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value_},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-tone-picker")||customElements.define("dac-tone-picker",ae);var d={entity:n=>({entity:n?{domain:n}:{}}),text:()=>({text:{}}),multiline:()=>({text:{multiline:!0}}),bool:()=>({boolean:{}}),number:(n,e,t=1)=>({number:{min:n,max:e,step:t,mode:"box"}}),select:n=>({select:{mode:"dropdown",options:n}}),action:()=>({ui_action:{}})},x=(...n)=>({type:"grid",schema:n}),q=(n,e,t,a=!1)=>({type:"expandable",name:n,icon:e,expanded:a,schema:t}),v=class extends HTMLElement{constructor(){super(),this.config_={},this.built_=!1}setConfig(e){this.config_={...this.defaults(),...e},this.render_()}defaults(){return{}}set hass(e){this.hass_=e,this.form_&&(this.form_.hass=e);for(let t of this.pickers_??[])t.hass=e;this.render_()}get hass(){return this.hass_}connectedCallback(){this.render_()}schema(){return[]}pickers(){return[]}label(e){return V[e.name]??e.name}helper(){}async render_(){if(!this.hass_||!this.config_)return;if(this.built_){this.sync_();return}this.built_=!0,await customElements.whenDefined("ha-form"),this.replaceChildren(),this.pickers_=[];let e=this.pickers();if(e.length){let a=document.createElement("div");a.style.cssText="display:flex;flex-direction:column;gap:12px;margin-bottom:16px";for(let r of e){let i=document.createElement(r.kind==="tone"?"dac-tone-picker":"dac-icon-picker");i.label=r.label,i.fallback=r.fallback,i.hass=this.hass_,i.value=this.config_[r.key],i.addEventListener("value-changed",o=>{o.stopPropagation(),this.patch_({[r.key]:o.detail.value})}),this.pickers_.push(i),i.dataset.key=r.key,a.appendChild(i)}this.appendChild(a)}let t=document.createElement("ha-form");t.hass=this.hass_,t.data=this.config_,t.schema=this.schema(),t.computeLabel=a=>this.label(a),t.computeHelper=a=>this.helper(a),t.addEventListener("value-changed",a=>{a.stopPropagation(),this.patch_(a.detail.value,!0)}),this.form_=t,this.appendChild(t)}sync_(){this.form_&&(this.form_.hass=this.hass_,this.form_.data=this.config_);for(let e of this.pickers_??[])e.hass=this.hass_,e.value=this.config_[e.dataset.key]}patch_(e,t=!1){let a=t?{...e}:{...this.config_,...e};this.config_.type&&(a.type=this.config_.type);for(let[r,i]of Object.entries(a))(i===""||i===void 0||i===null)&&delete a[r];this.config_=a,this.sync_(),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:a},bubbles:!0,composed:!0}))}},V={entity:"Entiteit",entities:"Entiteiten",name:"Naam",icon:"Icoon",tone:"Kleur",secondary:"Tweede regel",layout:"Vorm",tap_action:"Tikken",hold_action:"Vasthouden",double_tap_action:"Dubbeltikken",show_state:"Toestand tonen",show_name:"Naam tonen",show_icon:"Icoon tonen",state_color:"Kleur volgt toestand",fill:"Vullen",collapsible:"Inklapbaar",title:"Titel",subtitle:"Ondertitel",weather:"Weerentiteit",sun:"Zon-entiteit",person:"Persoon",persons:"Personen",covers:"Rolluiken",lights:"Lampen",sensors:"Sensoren",greeting:"Begroeting",show_clock:"Klok tonen",show_weather:"Weer tonen",show_chips:"Weerdetails tonen",compact:"Compact",columns:"Kolommen",group:"Groepsregel tonen",invert:"Open en dicht omdraaien",label:"Label",color:"Kleur",date_format:"Datumnotatie"};function Pe(n=new Date){let e=n.getHours();return e<6?"Goedenacht":e<12?"Goedemorgen":e<18?"Goedemiddag":"Goedenavond"}var We=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Ge=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],B={humidity:{icon:"drop",tone:"water",label:"Luchtvochtigheid"},wind:{icon:"wind",tone:"neutral",label:"Wind"},uv:{icon:"uv",tone:"solar",label:"UV-index"},precipitation:{icon:"rain",tone:"water",label:"Neerslag"},pressure:{icon:"gaugeArrow",tone:"neutral",label:"Luchtdruk"},sunrise:{icon:"sunrise",tone:"warn",label:"Zonsopkomst"},sunset:{icon:"sunset",tone:"warn",label:"Zonsondergang"}},U=["humidity","wind","uv","precipitation","sunset"],Ke=n=>n==null||Number.isNaN(+n)?"":["N","NO","O","ZO","Z","ZW","W","NW"][Math.round(+n/45)%8],ne=class extends f{static css=`
    :host { display: block; }
    /* Onder het afkappunt bestaat de kaart niet -- ook geen lege ruimte, want
       in een sections-view laat een verborgen kaart anders zijn gat staan. */
    :host([narrow]) { display: none; }

    .strip {
      /* Wrappen in plaats van de details wegduwen. In een smalle kolom zou een
         niet-wrappende strip de weerchips tot nul breedte knijpen en het masker
         zou ze dan onzichtbaar maken -- weg zonder dat iets kapot lijkt, wat de
         vervelendste soort verdwijning is. */
      display: flex; align-items: center; flex-wrap: wrap; gap: 10px 18px;
      padding: 10px 16px;
      min-height: 52px;
      background: var(--dac-surface);
      border: 1px solid var(--dac-border);
      border-radius: var(--dac-radius);
      box-shadow: var(--dac-shadow);
      position: relative; overflow: hidden;
    }
    :host([bare]) .strip { background: none; border: 0; box-shadow: none; padding: 6px 2px; }

    /* Haarlijn accent onderlangs, dezelfde die de Coach-kop draagt. */
    .strip::after {
      content: ""; position: absolute; inset: auto 0 0 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--dac-accent) 22%,
                  var(--dac-accent-hi) 50%, var(--dac-accent) 78%, transparent);
      opacity: .55;
    }
    :host([no-rule]) .strip::after { display: none; }

    .who { flex: 0 0 auto; min-width: 0; order: 1; }
    .hello { font-size: 14.5px; font-weight: 400; letter-spacing: -.01em; line-height: 1.2; white-space: nowrap; }
    .hello b { font-weight: 600; }
    .date { margin-top: 1px; font-size: 11px; color: var(--dac-ink-3); white-space: nowrap; }

    /* De weerdetails krijgen de ruimte die overblijft en schuiven horizontaal
       weg als die op is, in plaats van de strip twee regels hoog te maken. */
    .chips {
      flex: 1 1 260px; min-width: 0; order: 3;
      display: flex; align-items: center; gap: 16px;
      overflow-x: auto; scrollbar-width: none;
      -webkit-mask-image: linear-gradient(90deg, #000 0 92%, transparent 100%);
      mask-image: linear-gradient(90deg, #000 0 92%, transparent 100%);
    }
    .chips::-webkit-scrollbar { display: none; }
    .chips:empty { display: none; }
    .chip2 {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto;
      font-size: 12px; color: var(--dac-ink-2); white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .chip2 .icon, .chip2 ha-icon { width: 14px; height: 14px; --mdc-icon-size: 14px; color: var(--tone); }

    .now { flex: 0 0 auto; order: 2; display: flex; align-items: center; gap: 9px; margin-left: auto; }
    .now .ic { display: flex; color: var(--wtone); }
    .now .ic .icon, .now .ic ha-icon { width: 22px; height: 22px; --mdc-icon-size: 22px; }
    .now .temp { font-size: 21px; font-weight: 300; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
    .now .temp span { font-size: .55em; color: var(--dac-ink-3); }
    .now .cond {
      font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase;
      color: var(--dac-ink-3); white-space: nowrap;
    }

    .clock {
      flex: 0 0 auto; order: 4; margin-left: auto;
      padding-left: 16px; border-left: 1px solid var(--dac-border);
      font-size: 18px; font-weight: 400; letter-spacing: -.01em;
      font-variant-numeric: tabular-nums;
    }

    @media (max-width: 900px) {
      .strip { gap: 12px; }
      .now .cond { display: none; }
    }
  `;validate(e){return{show_clock:!0,show_weather:!0,show_chips:!0,show_rule:!0,hide_below:768,chips:U,...e}}watched(){let e=this.config;return[e.weather,e.weather_uv,e.sun,e.person,e.precipitation_entity].filter(Boolean)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),e.show_rule===!1&&this.setAttribute("no-rule",""),`
      <div class="strip">
        <div class="who">
          <div class="hello"></div>
          <div class="date"></div>
        </div>
        ${e.show_chips===!1?"":'<div class="chips"></div>'}
        ${e.show_weather===!1?"":`
        <div class="now">
          <span class="ic"></span>
          <span>
            <span class="temp tnum"></span>
            <span class="cond"></span>
          </span>
        </div>`}
        ${e.show_clock===!1?"":'<div class="clock tnum"></div>'}
      </div>`}wire(){let e=()=>{let a=6e4-Date.now()%6e4+50;this.timer_=setTimeout(()=>{this.paintClock_(),e()},a)};e(),this.teardown_.push(()=>clearTimeout(this.timer_));let t=Number(this.config.hide_below)||0;if(t>0){let a=matchMedia(`(max-width: ${t-1}px)`),r=()=>this.toggleAttribute("narrow",a.matches);r(),a.addEventListener("change",r),this.teardown_.push(()=>a.removeEventListener("change",r))}}paintClock_(){let e=new Date,t=this.config.name??(this.config.person?_(this.hass,this.config.person,null):null)??this.hass?.user?.name??"",a=this.config.greeting??Pe(e);this.$(".hello").innerHTML=t?`${a}, <b>${t}</b>`:a,this.text(".date",`${We[e.getDay()]} ${e.getDate()} ${Ge[e.getMonth()]}`);let r=this.$(".clock");r&&this.text(r,e.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"}))}paint(){this.paintClock_();let e=this.config,t=u(this.hass,e.weather),a=L(this.hass,e.weather),r=this.$(".now");if(r&&t){let c=Le(t.state);r.style.setProperty("--wtone",M(e.tone,"water"));let h=this.hass?.config?.unit_system?.temperature??"\xB0C";this.$(".temp").innerHTML=a.temperature!=null?`${j(this.hass,a.temperature,0)}<span>${h}</span>`:"--";let p=r.querySelector(".ic");p.dataset.icon!==c&&(p.dataset.icon=c,p.innerHTML=w(c,"cloud")),this.text(r.querySelector(".cond"),D(this.hass,t))}let i=this.$(".chips");if(!i)return;let o=(e.chips??U).map(c=>this.chip_(c,a)).filter(Boolean),l=o.map(c=>`${c.key}${c.value}`).join("|");i.dataset.sig!==l&&(i.dataset.sig=l,i.innerHTML=o.map(c=>`<span class="chip2" style="--tone:${M(B[c.key].tone)}" title="${B[c.key].label}">
             ${m[B[c.key].icon]??""}${c.value}
           </span>`).join(""))}chip_(e,t){let a=this.config;switch(e){case"humidity":return t.humidity!=null?{key:e,value:`${Math.round(t.humidity)}%`}:null;case"wind":{if(t.wind_speed==null)return null;let r=this.hass?.config?.unit_system?.wind_speed??"km/h",i=Ke(t.wind_bearing);return{key:e,value:`${j(this.hass,t.wind_speed,0)} ${r}${i?` ${i}`:""}`}}case"uv":{let i=L(this.hass,a.weather_uv).uv_index??t.uv_index??(a.weather_uv?Number(u(this.hass,a.weather_uv)?.state):null);return i!=null&&!Number.isNaN(+i)?{key:e,value:`UV ${j(this.hass,i,1)}`}:null}case"precipitation":{let r=u(this.hass,a.precipitation_entity);if(r){let i=Number(r.state);if(Number.isNaN(i))return null;let o=r.attributes.unit_of_measurement??"mm";return{key:e,value:`${j(this.hass,i,1)} ${o}`}}return t.precipitation!=null&&!Number.isNaN(+t.precipitation)?{key:e,value:`${j(this.hass,t.precipitation,1)} mm`}:null}case"pressure":return t.pressure!=null?{key:e,value:`${j(this.hass,t.pressure,0)} ${t.pressure_unit??"hPa"}`}:null;case"sunset":case"sunrise":{let i=u(this.hass,a.sun)?.attributes?.[e==="sunset"?"next_setting":"next_rising"];if(!i)return null;let o=new Date(i);return Number.isNaN(+o)?null:{key:e,value:o.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"})}}default:return null}}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:"auto"}}static getConfigElement(){return document.createElement("domotiapp-header-card-editor")}static getStubConfig(e){return{weather:Object.keys(e?.states??{}).find(a=>a.startsWith("weather.")),sun:"sun.sun",chips:U}}},re=class extends v{defaults(){return{show_clock:!0,show_weather:!0,show_chips:!0,show_rule:!0,hide_below:768,chips:U}}pickers(){return[{key:"tone",kind:"tone",label:"Kleur weericoon"}]}schema(){return[x({name:"weather",selector:d.entity("weather")},{name:"weather_uv",selector:{entity:{domain:["weather","sensor"]}}}),x({name:"sun",selector:d.entity("sun")},{name:"precipitation_entity",selector:d.entity("sensor")}),x({name:"person",selector:d.entity(["person"])},{name:"name",selector:d.text()}),{name:"greeting",selector:d.text()},{name:"chips",selector:{select:{multiple:!0,mode:"list",options:Object.entries(B).map(([e,t])=>({value:e,label:t.label}))}}},q("Weergave","mdi:eye",[{name:"hide_below",selector:d.number(0,1400,8)},x({name:"show_clock",selector:d.bool()},{name:"show_weather",selector:d.bool()}),x({name:"show_chips",selector:d.bool()},{name:"show_rule",selector:d.bool()}),{name:"bare",selector:d.bool()}])]}label(e){return{weather:"Weer (temperatuur, wind)",weather_uv:"Tweede weerbron (UV-index)",precipitation_entity:"Neerslagsensor",chips:"Welke details",greeting:"Eigen begroeting",show_rule:"Accentlijn tonen",hide_below:"Verbergen onder breedte (px)",bare:"Zonder kaartrand",name:"Vaste naam"}[e.name]??super.label(e)}helper(e){if(e.name==="weather_uv")return"Alleen voor de UV-index. Handig als je hoofdbron die niet meelevert.";if(e.name==="precipitation_entity")return"Een sensor in mm of mm/h, bijvoorbeeld neerslagintensiteit of regen laatste uur.";if(e.name==="hide_below")return"768 verbergt de header op telefoons en houdt hem op tablets en desktops. 0 zet het uit.";if(e.name==="greeting")return"Leeg laten voor Goedemorgen / Goedemiddag / Goedenavond op de klok.";if(e.name==="person")return"Leeg laten om de naam van de ingelogde gebruiker te tonen."}};k("domotiapp-header-card-editor",re);y("domotiapp-header-card",ne,{name:"DomotiApp Header",description:"Smalle strip met begroeting, weer en klok. Verbergt zichzelf op telefoons."});var ie=class extends f{static css=`
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
      flex: 0 0 auto; display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: var(--dac-ink-2);
      font-variant-numeric: tabular-nums;
    }
    .sub:empty { display: none; }
    .sub .si { display: flex; color: var(--tone); }
    .sub .si:empty { display: none; }
    .sub .si .icon, .sub .si ha-icon { width: 14px; height: 14px; --mdc-icon-size: 14px; }

    /* Without an icon the title should still start where the icons above and
       below it start, or the column develops a wobble. */
    :host([no-icon]) .sep { padding-left: 2px; }
  `;validate(e){return{icon:"",tone:"accent",line:!0,...e}}watched(){return this.config.secondary_entity?[this.config.secondary_entity]:[]}template(){let e=this.config,t=e.icon!==null&&e.icon!==!1;return t||this.setAttribute("no-icon",""),`
      <div class="sep" style="--tone:${M(e.tone)}">
        ${t?`<span class="chip">${w(e.icon,"star")}</span>`:""}
        <h3></h3>
        ${e.line===!1?"":'<span class="rule"></span>'}
        <span class="sub"><span class="si"></span><span class="sv"></span></span>
      </div>`}paint(){this.text("h3",this.config.name??"");let e=this.$(".sub");if(!e)return;let t=u(this.hass,this.config.secondary_entity),a=e.querySelector(".si"),r=e.querySelector(".sv");if(!t){r.textContent="",a.innerHTML="";return}let i=this.config.secondary_icon??"";a.dataset.icon!==i&&(a.dataset.icon=i,a.innerHTML=i?w(i):"");let o=t.attributes.unit_of_measurement;r.textContent=o?`${t.state} ${o}`:t.attributes.current_temperature!=null?`${t.attributes.current_temperature} \xB0C`:D(this.hass,t)}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:1,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-separator-card-editor")}static getStubConfig(){return{name:"Nieuwe sectie",icon:"house",tone:"accent"}}},oe=class extends v{defaults(){return{line:!0,tone:"accent"}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon links",fallback:"star"},{key:"tone",kind:"tone",label:V.tone},{key:"secondary_icon",kind:"icon",label:"Icoon bij de waarde rechts",fallback:"question"}]}schema(){return[{name:"name",selector:d.text()},{name:"line",selector:d.bool()},{name:"secondary_entity",selector:d.entity()}]}label(e){return{line:"Lijn tonen",secondary_entity:"Waarde rechts (optioneel)"}[e.name]??super.label(e)}helper(e){if(e.name==="secondary_entity")return"Toont de toestand van deze entiteit rechts van de lijn, bijvoorbeeld een temperatuur of een aantal."}};k("domotiapp-separator-card-editor",oe);y("domotiapp-separator-card",ie,{name:"DomotiApp Separator",description:"Sectiekop met icoon en vervagende lijn."});var se=class extends f{static css=`
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
  `;validate(e){return{layout:"row",state_color:!0,show_state:!0,show_name:!0,show_icon:!0,...e}}watched(){return[this.config.entity,this.config.secondary_entity].filter(Boolean)}tone_(){let e=this.config;return e.tone?M(e.tone):O(e.entity)==="light"?N.lit:N.accent}template(){let e=this.config;return this.setAttribute("layout",["row","tile","compact"].includes(e.layout)?e.layout:"row"),`
      <button class="btn" type="button" style="--tone:${this.tone_()}">
        <span class="wash"></span>
        ${e.show_icon===!1?"":'<span class="chip"></span>'}
        <span class="txt">
          ${e.show_name===!1?"":'<span class="nm"></span>'}
          ${e.show_state===!1?"":'<span class="st"></span>'}
        </span>
        <span class="badge"></span>
      </button>`}wire(){let e=this.config,t=this.$(".btn"),a=(r,i)=>ze(this,this.hass,e,e[r]??i);this.teardown_.push(T(t,{onTap:()=>a("tap_action",Se(e.entity)),onHold:()=>a("hold_action",{action:e.entity?"more-info":"none"}),onDouble:e.double_tap_action?()=>a("double_tap_action",{action:"none"}):void 0}))}paint(){let e=this.config,t=u(this.hass,e.entity),a=e.state_color!==!1&&Me(t),r=!!e.entity&&G(t);this.toggleAttribute("on",a),this.$(".btn").classList.toggle("unavailable",r);let i=this.$(".chip");if(i){let c=e.icon||Oe(e.entity,L(this.hass,e.entity));i.dataset.icon!==c&&(i.dataset.icon=c,i.innerHTML=w(c)),i.style.setProperty("--tone",a?this.tone_():"var(--dac-ink-3)")}this.text(".nm",_(this.hass,e.entity,e.name));let o=this.$(".st");o&&this.text(o,this.secondary_(t,r));let l=this.$(".badge");l&&this.text(l,e.badge??""),this.$(".btn").setAttribute("aria-label",`${_(this.hass,e.entity,e.name)}${t?`, ${D(this.hass,t)}`:""}`)}secondary_(e,t){let a=this.config;if(t)return"Niet bereikbaar";if(a.secondary_entity){let r=u(this.hass,a.secondary_entity);if(!r)return"";let i=r.attributes.unit_of_measurement;return i?`${r.state} ${i}`:D(this.hass,r)}return a.secondary?a.secondary:!e||Y(e.entity_id)?"":O(e.entity_id)==="light"&&e.state==="on"&&e.attributes.brightness!=null?`${Math.round(e.attributes.brightness/255*100)}%`:D(this.hass,e)}getCardSize(){return this.config?.layout==="tile"?2:1}getGridOptions(){return this.config?.layout==="tile"?{columns:6,rows:2,min_columns:3,min_rows:2}:{columns:12,rows:1,min_columns:4,min_rows:1}}static getConfigElement(){return document.createElement("domotiapp-button-card-editor")}static getStubConfig(e,t){return{entity:t?.find(r=>r.startsWith("light."))??t?.find(r=>r.startsWith("switch."))??t?.[0],layout:"row"}}},ce=class extends v{pickers(){return[{key:"icon",kind:"icon",label:V.icon,fallback:"star"},{key:"tone",kind:"tone",label:V.tone}]}schema(){return[{name:"entity",selector:d.entity()},x({name:"name",selector:d.text()},{name:"layout",selector:d.select([{value:"row",label:"Rij"},{value:"tile",label:"Tegel"},{value:"compact",label:"Compact"}])}),q("Weergave","mdi:eye",[x({name:"show_icon",selector:d.bool()},{name:"show_name",selector:d.bool()}),x({name:"show_state",selector:d.bool()},{name:"state_color",selector:d.bool()}),{name:"secondary",selector:d.text()},{name:"secondary_entity",selector:d.entity()},{name:"badge",selector:d.text()}]),q("Acties","mdi:gesture-tap",[{name:"tap_action",selector:d.action()},{name:"hold_action",selector:d.action()},{name:"double_tap_action",selector:d.action()}])]}label(e){return{secondary:"Vaste tweede regel",secondary_entity:"Tweede regel uit entiteit",badge:"Hoekje rechtsboven"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"Mag leeg blijven: zonder entiteit wordt dit een navigatieknop.";if(e.name==="state_color")return"Uit betekent dat de knop er hetzelfde uitziet of het apparaat nu aan of uit staat."}};k("domotiapp-button-card-editor",ce);y("domotiapp-button-card",se,{name:"DomotiApp Knop",description:"E\xE9n control als rij, tegel of compacte pil. Vervangt tile, mushroom-entity en bubble-knoppen."});var Be=new Set(["brightness","color_temp","hs","rgb","rgbw","rgbww","xy","white"]),Ue=new Set(["hs","rgb","rgbw","rgbww","xy"]),ue=n=>n?.attributes?.supported_color_modes??[],Ze=n=>ue(n).some(e=>Be.has(e)),le=n=>ue(n).some(e=>Ue.has(e)),de=n=>ue(n).includes("color_temp"),Fe=n=>Math.max(1,Math.round((n??0)/255*100)),pe=class extends f{static css=`
    :host { display: block; }

    .card { padding: 10px 14px 12px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .lamp {
      /* Bovenaan uitlijnen, niet centreren: zodra de kleurstrips erbij komen
         zou een gecentreerd icoon halverwege de kaart gaan zweven, los van de
         naam waar het bij hoort. */
      display: grid; grid-template-columns: 42px 1fr; gap: 12px; align-items: start;
      padding: 4px 0;
    }
    .lamp + .lamp { border-top: 1px solid var(--dac-border); margin-top: 8px; padding-top: 12px; }

    .chip {
      width: 42px; height: 42px; margin-top: -2px; cursor: pointer;
      background: color-mix(in srgb, var(--tone) 13%, transparent);
      border-color: color-mix(in srgb, var(--tone) 30%, transparent);
      transition: color 200ms ease, background 200ms ease, border-color 200ms ease;
    }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    .lamp[data-on="false"] .chip {
      color: var(--dac-ink-3); background: rgba(255,255,255,.05); border-color: var(--dac-border);
    }
    /* Een brandende lamp gloeit een beetje. Dat is de enige plek in de familie
       waar een schaduw betekenis draagt in plaats van diepte. */
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

    /* ---- schuiven ---- */
    .slider { position: relative; height: 26px; margin-top: 7px; }
    .slider .track {
      position: absolute; inset: 9px 0; border-radius: var(--dac-radius-pill);
      background: var(--strip, rgba(255,255,255,.075)); overflow: hidden;
    }
    .slider .fill {
      position: absolute; inset: 0 auto 0 0; width: var(--v, 0%);
      border-radius: var(--dac-radius-pill);
      background: linear-gradient(90deg,
        color-mix(in srgb, var(--tone) 45%, transparent), var(--tone));
      transition: width 90ms linear;
    }
    /* Een kleurenstrip is de schaal zelf -- daar hoort geen vulling overheen. */
    .slider[data-strip] .fill { display: none; }
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
    .slider[data-strip] input::-webkit-slider-thumb {
      width: 14px; border: 2px solid var(--dac-bg); box-shadow: 0 0 0 1px rgba(255,255,255,.6);
    }
    .slider[data-strip] input::-moz-range-thumb {
      width: 14px; border: 2px solid var(--dac-bg); box-shadow: 0 0 0 1px rgba(255,255,255,.6);
    }
    .slider input:focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; border-radius: 10px; }

    .colour { margin-top: 2px; }
    .colour[hidden] { display: none; }
    .colour .lbl {
      margin-top: 10px; font-size: 10.5px; font-weight: 600; letter-spacing: .12em;
      text-transform: uppercase; color: var(--dac-ink-3);
    }

    /* ---- aan/uit, voor lampen die alleen dat kunnen ---- */
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
  `;validate(e){let t=e.lights??e.entities??(e.entity?[e.entity]:[]);return t.length?{show_colour:!0,...e,lights:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[S]:"Kies een lamp."}}watched(){return this.config.lights.map(e=>e.entity)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`<div class="card surface">${e.lights.map((a,r)=>`
        <div class="lamp" data-i="${r}" data-on="false" style="--tone:var(--dac-lit)">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <div>
            <div class="top"><span class="nm"></span><span class="v tnum"></span></div>
            <div class="ctl"></div>
            <div class="colour" hidden></div>
          </div>
        </div>`).join("")}</div>`}wire(){this.dragging_=new Set,this.$$(".lamp").forEach(e=>{let t=+e.dataset.i,a=this.config.lights[t].entity;this.teardown_.push(T(e.querySelector(".chip"),{onTap:()=>this.hass.callService("light","toggle",{entity_id:a}),onHold:()=>A(this,a)}));let r=o=>{let l=o.target;if(l.type!=="range")return;let c=l.dataset.kind;this.dragging_.add(`${t}:${c}`);let h=+l.value;l.closest(".slider").style.setProperty("--v",`${h}%`),c==="brightness"&&(e.querySelector(".v").textContent=h===0?"uit":`${h}%`)},i=o=>{let l=o.target;if(l.type!=="range")return;let c=l.dataset.kind;this.dragging_.delete(`${t}:${c}`);let h=+l.value;if(c==="brightness"){h===0?this.hass.callService("light","turn_off",{entity_id:a}):this.hass.callService("light","turn_on",{entity_id:a,brightness_pct:h});return}if(c==="hue"){let p=u(this.hass,a)?.attributes?.hs_color?.[1]??100;this.hass.callService("light","turn_on",{entity_id:a,hs_color:[h,p]});return}c==="kelvin"&&this.hass.callService("light","turn_on",{entity_id:a,color_temp_kelvin:h})};for(let o of[e.querySelector(".ctl"),e.querySelector(".colour")])o.addEventListener("input",r),o.addEventListener("change",i),o.addEventListener("click",l=>{l.target.closest(".toggle")&&this.hass.callService("light","toggle",{entity_id:a})})})}paint(){this.$$(".lamp").forEach(e=>{let t=+e.dataset.i,a=this.config.lights[t],r=u(this.hass,a.entity),i=G(r),o=r?.state==="on";e.dataset.on=String(o),e.classList.toggle("unavailable",i);let l=e.querySelector(".chip"),c=a.icon??this.config.icon??"bulb";l.dataset.icon!==c&&(l.dataset.icon=c,l.innerHTML=w(c,"bulb")),e.querySelector(".nm").textContent=_(this.hass,a.entity,a.name);let h=o?r?.attributes?.rgb_color:null;e.style.setProperty("--tone",h?`rgb(${h[0]},${h[1]},${h[2]})`:"var(--dac-lit)");let p=e.querySelector(".ctl"),b=Ze(r),g=i?"none":b?"range":"toggle";p.dataset.kind!==g&&(p.dataset.kind=g,p.innerHTML=g==="range"?`<div class="slider" style="--v:0%">
                 <span class="track"><span class="fill"></span></span>
                 <input type="range" data-kind="brightness" min="0" max="100" step="1" value="0"
                        aria-label="Helderheid" />
               </div>`:g==="toggle"?'<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>':"");let $=e.querySelector(".v");if(g==="range"&&!this.dragging_.has(`${t}:brightness`)){let z=o?Fe(r.attributes.brightness):0,E=p.querySelector("input");this.shadowRoot.activeElement!==E&&(E.value=String(z)),p.querySelector(".slider").style.setProperty("--v",`${z}%`),$.textContent=o?`${z}%`:"uit"}else g==="toggle"?(p.querySelector(".toggle")?.setAttribute("aria-checked",String(o)),$.textContent=o?"aan":"uit"):g==="none"&&($.textContent="niet bereikbaar");this.paintColour_(e,r,o,t)})}paintColour_(e,t,a,r){let i=e.querySelector(".colour"),o=a&&this.config.show_colour!==!1&&(le(t)||de(t));if(i.hidden=!o,!o)return;let l=`${le(t)?"c":""}${de(t)?"t":""}`;if(i.dataset.sig!==l){i.dataset.sig=l;let p=t.attributes.min_color_temp_kelvin??2e3,b=t.attributes.max_color_temp_kelvin??6500;i.innerHTML=`
        ${le(t)?`<div class="lbl">Kleur</div>
               <div class="slider" data-strip style="--strip:linear-gradient(90deg,
                    hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%),
                    hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))">
                 <span class="track"></span>
                 <input type="range" data-kind="hue" min="0" max="360" step="1" value="0"
                        aria-label="Kleur" />
               </div>`:""}
        ${de(t)?`<div class="lbl">Wit</div>
               <div class="slider" data-strip style="--strip:linear-gradient(90deg,#ffb15e,#ffd6a8,#fff5e8,#eaf1ff,#cbdcff)">
                 <span class="track"></span>
                 <input type="range" data-kind="kelvin" min="${p}" max="${b}" step="50" value="${p}"
                        aria-label="Kleurtemperatuur" />
               </div>`:""}`}let c=i.querySelector('[data-kind="hue"]');c&&!this.dragging_.has(`${r}:hue`)&&this.shadowRoot.activeElement!==c&&(c.value=String(Math.round(t.attributes.hs_color?.[0]??0)));let h=i.querySelector('[data-kind="kelvin"]');if(h&&!this.dragging_.has(`${r}:kelvin`)&&this.shadowRoot.activeElement!==h){let p=t.attributes.color_temp_kelvin;p!=null&&(h.value=String(p))}}getCardSize(){return this.config.lights?.length??1}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}static getConfigElement(){return document.createElement("domotiapp-light-card-editor")}static getStubConfig(e,t){let a=t?.find(r=>r.startsWith("light."));return a?{entity:a}:{}}},he=class extends v{defaults(){return{show_colour:!0}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon",fallback:"bulb"}]}schema(){return[{name:"entity",selector:d.entity("light")},{name:"name",selector:d.text()},{name:"show_colour",selector:d.bool()}]}label(e){return{entity:"Lamp",show_colour:"Kleurstrips tonen als de lamp aan is"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"E\xE9n lamp per kaart. Dimbaar krijgt een schuif, alleen schakelbaar een tuimelaar; kleur en kleurtemperatuur komen erbij als de lamp ze kan."}};k("domotiapp-light-card-editor",he);y("domotiapp-light-card",pe,{name:"DomotiApp Verlichting",description:"E\xE9n lamp: dimmen, kleur en kleurtemperatuur, precies wat de lamp kan."});var Z={OPEN:1,CLOSE:2,SET_POSITION:4,STOP:8},F=(n,e)=>!!((n?.attributes?.supported_features??0)&e),Ye=(n={})=>n.device_class==="awning"||n.device_class==="blind"?{open:"awning",closed:"awning"}:{open:"shutterOpen",closed:"shutter"},me=class extends f{static css=`
    :host { display: block; }

    .card { padding: 8px 14px; }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .head { display: flex; align-items: baseline; padding: 8px 0 2px; }
    .head b { font-size: 14px; font-weight: 600; }

    .cv {
      display: grid; grid-template-columns: 42px 1fr auto; gap: 12px; align-items: center;
      padding: 10px 0; min-height: var(--dac-row-h);
    }
    .cv + .cv, .group { border-top: 1px solid var(--dac-border); }

    .chip {
      width: 42px; height: 42px; cursor: pointer;
      background: color-mix(in srgb, var(--tone) 13%, transparent);
      border-color: color-mix(in srgb, var(--tone) 30%, transparent);
      transition: color 220ms ease, background 220ms ease, border-color 220ms ease;
    }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    /* Dicht is een rusttoestand en hoort er ook zo uit te zien. */
    .cv[data-shown="closed"] .chip {
      color: var(--dac-ink-3); background: rgba(255,255,255,.05); border-color: var(--dac-border);
    }

    .txt { min-width: 0; }
    .nm { font-size: 13.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .st { margin-top: 2px; font-size: 11.5px; color: var(--dac-ink-2); font-variant-numeric: tabular-nums; }
    .st:empty { display: none; }

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
    .keys button[aria-pressed="true"] {
      background: color-mix(in srgb, var(--tone) 24%, transparent);
      color: var(--dac-ink);
    }

    /* ---- positie, alleen bij motoren die terugmelden ---- */
    .pos { grid-column: 1 / -1; margin: 2px 0 4px; }
    .pos[hidden] { display: none; }
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

    @media (max-width: 380px) { .keys button { width: 34px; } }
  `;validate(e){let t=e.covers??e.entities??(e.entity?[e.entity]:[]);return t.length?{group:t.length>1,...e,covers:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[S]:"Kies minstens \xE9\xE9n rolluik of zonnescherm."}}watched(){return this.config.covers.map(e=>e.entity)}keysHtml(e){return`
      <div class="keys">
        <button type="button" data-act="open" aria-label="Open" aria-pressed="false">${m.arrowUp}</button>
        ${e?`<button type="button" data-act="stop" aria-label="Stop">${m.stop}</button>`:""}
        <button type="button" data-act="close" aria-label="Dicht" aria-pressed="false">${m.arrowDown}</button>
      </div>`}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.covers.map((r,i)=>`
      <div class="cv" data-i="${i}" data-shown="open" style="--tone:${M(r.tone??e.tone,"solar")}">
        <button class="chip" type="button" aria-label="Meer info"></button>
        <div class="txt"><div class="nm"></div><div class="st"></div></div>
        ${this.keysHtml(e.show_stop!==!1)}
        <div class="pos" hidden></div>
      </div>`).join(""),a=e.group&&e.covers.length>1?`<div class="cv group" data-i="all" style="--tone:${M(e.tone,"solar")}">
             <span class="chip" style="cursor:default">${m.shutterOpen}</span>
             <div class="txt"><div class="nm">Alles</div></div>
             ${this.keysHtml(e.show_stop!==!1)}
           </div>`:"";return`<div class="card surface">${e.title?`<div class="head"><b>${e.title}</b></div>`:""}${t}${a}</div>`}entitiesFor(e){return e==="all"?this.config.covers.map(t=>t.entity):[this.config.covers[+e].entity]}wire(){this.dragging_=new Set,this.assumed_=new Map,this.$$(".cv").forEach(e=>{let t=e.dataset.i;if(e.querySelectorAll(".keys button").forEach(i=>{i.addEventListener("click",()=>{let o=i.dataset.act,l={open:"open_cover",stop:"stop_cover",close:"close_cover"};if(this.hass.callService("cover",l[o],{entity_id:this.entitiesFor(t)}),o==="stop")return;let c=o==="open"?"open":"closed";t==="all"?this.config.covers.forEach((h,p)=>this.assumed_.set(String(p),c)):this.assumed_.set(t,c),this.paint()})}),t==="all")return;let a=this.config.covers[+t].entity;this.teardown_.push(T(e.querySelector(".chip"),{onTap:()=>A(this,a)}));let r=e.querySelector(".pos");r.addEventListener("input",i=>{if(i.target.type!=="range")return;this.dragging_.add(t);let o=+i.target.value;r.querySelector(".slider").style.setProperty("--v",`${o}%`),e.querySelector(".st").textContent=`${o}% open`}),r.addEventListener("change",i=>{i.target.type==="range"&&(this.dragging_.delete(t),this.hass.callService("cover","set_cover_position",{entity_id:a,position:+i.target.value}))})})}paint(){this.$$(".cv").forEach(e=>{let t=e.dataset.i;if(t==="all")return;let a=this.config.covers[+t],r=u(this.hass,a.entity),i=L(this.hass,a.entity),o=!r||r.state==="unavailable",l=r?.state??"unknown";e.classList.toggle("unavailable",o),e.querySelector(".nm").textContent=_(this.hass,a.entity,a.name);let c=F(r,Z.SET_POSITION)&&i.current_position!=null,h=c||l==="open"||l==="closed",p=c?i.current_position>0?"open":"closed":l==="open"||l==="closed"?l:this.assumed_.get(t)??"open";e.dataset.shown=p;let b=Ye(i),g=(p==="open"?a.icon_open:a.icon_closed)??(p==="open"?this.config.icon_open:this.config.icon_closed)??a.icon??b[p],$=e.querySelector(".chip");$.dataset.icon!==g&&($.dataset.icon=g,$.innerHTML=w(g,b[p]));let z=e.querySelector(".st");this.dragging_.has(t)||(z.textContent=o?"Niet bereikbaar":l==="opening"?"Gaat open":l==="closing"?"Gaat dicht":c?`${i.current_position}% open`:l==="open"?"Open":l==="closed"?"Dicht":""),e.querySelectorAll(".keys button").forEach(C=>{if(C.dataset.act==="stop"){C.disabled=o||!F(r,Z.STOP);return}let H=C.dataset.act==="open",Ae=h&&(H&&p==="open"||!H&&p==="closed");C.setAttribute("aria-pressed",String(Ae)),C.disabled=o||(H?!F(r,Z.OPEN):!F(r,Z.CLOSE))});let E=e.querySelector(".pos"),we=c&&this.config.show_position!==!1;if(E.hidden=!we,we&&(E.dataset.built||(E.dataset.built="1",E.innerHTML=`
            <div class="slider" style="--v:0%">
              <span class="track"><span class="fill"></span></span>
              <input type="range" min="0" max="100" step="1" value="0" aria-label="Positie" />
            </div>`),!this.dragging_.has(t))){let C=i.current_position??0,H=E.querySelector("input");this.shadowRoot.activeElement!==H&&(H.value=String(C)),E.querySelector(".slider").style.setProperty("--v",`${C}%`)}})}getCardSize(){return this.config.covers?.length??1}getGridOptions(){return{columns:12,rows:"auto",min_columns:6}}static getConfigElement(){return document.createElement("domotiapp-cover-card-editor")}static getStubConfig(e,t){let a=t?.find(r=>r.startsWith("cover."));return{covers:a?[a]:[]}}},ge=class extends v{defaults(){return{show_stop:!0,show_position:!0}}pickers(){return[{key:"icon_open",kind:"icon",label:"Icoon als het open staat",fallback:"shutterOpen"},{key:"icon_closed",kind:"icon",label:"Icoon als het dicht is",fallback:"shutter"},{key:"tone",kind:"tone",label:"Kleur"}]}schema(){return[{name:"covers",selector:{entity:{domain:"cover",multiple:!0}}},{name:"title",selector:d.text()},x({name:"show_stop",selector:d.bool()},{name:"group",selector:d.bool()})]}label(e){return{covers:"Rolluiken",show_stop:"Stopknop tonen",group:"Alles-tegelijk-regel"}[e.name]??super.label(e)}helper(e){if(e.name==="covers")return"Melden ze hun stand terug, dan komt er vanzelf een schuif bij. Zo niet, dan blijven het open, stop en dicht, en volgt het icoon de knop die je indrukt."}};k("domotiapp-cover-card-editor",ge);y("domotiapp-cover-card",me,{name:"DomotiApp Rolluiken",description:"Open, stop en dicht, met een eigen icoon voor open en dicht."});function Xe(n,e){if(!e)return{label:"Onbekend",home:null};switch(e.state){case"home":return{label:"Thuis",home:!0};case"not_home":return{label:"Afwezig",home:!1};case"unknown":case"unavailable":return{label:"Onbekend",home:null};default:return{label:e.state,home:!1}}}var be=class extends f{static css=`
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
  `;validate(e){let t=e.persons??e.entities??(e.entity?[e.entity]:[]);return t.length?{layout:"chips",show_state:!0,...e,persons:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[S]:"Kies minstens \xE9\xE9n persoon."}}watched(){return this.config.persons.flatMap(e=>[e.entity,e.battery,e.tracker].filter(Boolean))}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.layout==="rows",a=e.persons.map((o,l)=>`
      <button class="p" type="button" data-i="${l}" style="--tone:var(--dac-ink-3)">
        <span class="av"><span class="ph"></span></span>
        ${t?`<span class="txt"><span class="nm"></span><span class="st"></span></span>
               <span class="batt"></span>`:`<span class="nm"></span>${e.show_state===!1?"":'<span class="st"></span>'}`}
      </button>`).join(""),r=e.title||e.show_summary?`<div class="head">${e.title?`<b>${e.title}</b>`:""}<span class="sum"></span></div>`:"",i=e.columns??Math.min(e.persons.length,6);return`
      <div class="card surface">
        ${r}
        <div class="${t?"rows":"chips"}" style="--cols:${i}">${a}</div>
      </div>`}wire(){this.$$(".p").forEach(e=>{let t=this.config.persons[+e.dataset.i];this.teardown_.push(T(e,{onTap:()=>A(this,t.entity),onHold:()=>A(this,t.entity)}))})}paint(){let e=0;this.$$(".p").forEach(a=>{let r=this.config.persons[+a.dataset.i],i=u(this.hass,r.entity),o=Xe(this.hass,i);o.home&&e++;let l=o.home===!0?"var(--dac-good)":o.home===!1?"var(--dac-bad)":"var(--dac-warn)";a.style.setProperty("--tone",l);let c=_(this.hass,r.entity,r.name);this.text(a.querySelector(".nm"),c);let h=a.querySelector(".st");h&&this.text(h,o.label);let p=a.querySelector(".ph"),b=i?.attributes?.entity_picture,g=b?`img:${b}`:c?`ini:${c[0]}`:"icon";p.dataset.kind!==g&&(p.dataset.kind=g,p.innerHTML=b?`<img src="${b}" alt="" loading="lazy" />`:c?c[0].toUpperCase():m.person);let $=a.querySelector(".batt");if($){let z=r.battery?u(this.hass,r.battery):null;$.innerHTML=z&&!Number.isNaN(+z.state)?`<i></i>${Math.round(+z.state)}%`:""}a.setAttribute("aria-label",`${c}, ${o.label}`)});let t=this.$(".sum");t&&(t.textContent=e===0?"niemand thuis":`${e} van ${this.config.persons.length} thuis`)}getCardSize(){return this.config.layout==="rows"?this.config.persons.length:2}getGridOptions(){return this.config.layout==="rows"?{columns:12,rows:this.config.persons.length*2+1,min_columns:6}:{columns:"full",rows:3,min_columns:6,min_rows:2}}static getConfigElement(){return document.createElement("domotiapp-person-card-editor")}static getStubConfig(e){return{persons:Object.keys(e?.states??{}).filter(a=>a.startsWith("person.")).slice(0,6),layout:"chips"}}},fe=class extends v{defaults(){return{layout:"chips",show_state:!0}}schema(){return[{name:"persons",selector:{entity:{domain:["person","device_tracker"],multiple:!0}}},x({name:"title",selector:d.text()},{name:"layout",selector:d.select([{value:"chips",label:"Chips (compact)"},{value:"rows",label:"Rijen"}])})]}label(e){return{persons:"Personen"}[e.name]??super.label(e)}helper(e){if(e.name==="persons")return"Thuis is groen, weg is rood, geen melding is oranje."}};k("domotiapp-person-card-editor",fe);y("domotiapp-person-card",be,{name:"DomotiApp Personen",description:"Wie er thuis is, compact. Het hele huishouden in \xE9\xE9n kaart."});var Je=[[/gft|groente|tuin|organi/i,"teal","binWheeled"],[/pmd|plastic|verpakking/i,"solar","binWheeled"],[/papier|karton/i,"water","binWheeled"],[/rest|grijs/i,"neutral","binWheeled"],[/textiel|kleding/i,"pink","bin"],[/glas/i,"magenta","bin"],[/kerstboom|snoei|takken/i,"teal","bin"]];function Qe(n){for(let[e,t,a]of Je)if(e.test(n))return{tone:t,icon:a};return{tone:"accent",icon:"bin"}}var et=n=>String(n??"").replace(/^(afvalbeheer|afvalwijzer|mijnafvalwijzer)\s*/i,"").replace(/\s*(mijnafvalwijzer)\s*/i," ").trim(),ve=class extends f{static css=`
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
  `;validate(e){let t=e.sensors??e.entities??(e.entity?[e.entity]:[]);return t.length?{show_hero:!0,show_list:!0,...e,sensors:t.map(a=>typeof a=="string"?{entity:a}:a)}:{...e,[S]:"Kies minstens \xE9\xE9n afvalsensor waarvan de toestand een datum is."}}watched(){return this.config.sensors.map(e=>e.entity)}read_(){let e=new Date;return this.config.sensors.map(t=>{let a=u(this.hass,t.entity);if(!a)return null;let r=P(a.state)??P(a.attributes.date)??P(a.attributes.next_date);if(!r)return null;let i=t.label??et(_(this.hass,t.entity,t.name)),o=Qe(t.label??t.entity+i);return{label:i,date:r,days:X(e,r),tone:M(t.tone??o.tone),icon:t.icon??o.icon}}).filter(t=>t&&t.days>=0).sort((t,a)=>t.date-a.date)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`
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
      </div>`}paint(){let e=this.read_(),t=this.$(".hero"),a=this.$(".list"),r=this.$(".empty");if(r.hidden=e.length>0,t&&(t.hidden=e.length===0,e.length)){let i=e[0];t.style.setProperty("--tone",i.tone),this.setAttribute("urgency",i.days===0?"today":i.days===1?"tomorrow":"later");let o=t.querySelector(".bin");o.dataset.icon!==i.icon&&(o.dataset.icon=i.icon,o.innerHTML=w(i.icon,"bin")),this.text(t.querySelector(".eyebrow"),J(i.date)),this.text(t.querySelector(".big"),i.label),this.text(t.querySelector(".n"),i.days===0?"nu":String(i.days)),this.text(t.querySelector(".u"),i.days===0?"aan de weg":i.days===1?"dag":"dagen")}if(a){let i=this.config.show_hero===!1?e:e.slice(1),o=i.map(l=>`${l.label}${+l.date}`).join("|");if(a.dataset.sig===o)return;a.dataset.sig=o,a.innerHTML=i.map(l=>{let c=J(l.date),h=l.days<=6?`<small>${Ce(l.date)}</small>`:"";return`
        <div class="r" style="--tone:${l.tone}">
          <i></i><span>${l.label}</span>
          <span class="d">${c}${h}</span>
        </div>`}).join("")}}getCardSize(){return 2+this.config.sensors.length}getGridOptions(){return{columns:12,rows:this.config.sensors.length*2+3,min_columns:6,min_rows:4}}static getConfigElement(){return document.createElement("domotiapp-waste-card-editor")}static getStubConfig(e){return{sensors:Object.keys(e?.states??{}).filter(a=>/afval|waste|trash|garbage|ophaal/i.test(a)&&a.startsWith("sensor.")).filter(a=>P(e.states[a]?.state)).slice(0,6),title:"Afvalkalender"}}},xe=class extends v{schema(){return[{name:"sensors",selector:{entity:{domain:"sensor",multiple:!0}}},{name:"title",selector:d.text()},q("Weergave","mdi:eye",[x({name:"show_hero",selector:d.bool()},{name:"show_list",selector:d.bool()}),{name:"bare",selector:d.bool()}])]}label(e){return{sensors:"Afvalsensoren",show_hero:"Eerstvolgende uitlichten",show_list:"Overige data tonen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="sensors")return"Sensoren waarvan de toestand een datum is, bijvoorbeeld 18-08-2026. De kaart sorteert zelf en kiest de bakkleur op de naam."}};k("domotiapp-waste-card-editor",xe);y("domotiapp-waste-card",ve,{name:"DomotiApp Afvalkalender",description:"Eerstvolgende ophaling als hero, de rest eronder. Kleur per fractie."});var tt="0.1.2";console.info(`%c DOMOTIAPP-CARDS %c ${tt} `,"background:#026fa1;color:#e8e4de;font-weight:600;border-radius:3px 0 0 3px;padding:2px 6px","background:#12120f;color:#e8e4de;border-radius:0 3px 3px 0;padding:2px 6px");export{tt as VERSION};
//# sourceMappingURL=domotiapp-cards.js.map
