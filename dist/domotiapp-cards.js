/*! DomotiApp Cards 0.1.5 | MIT | https://github.com/Sven2410/domotiapp-cards */
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
`,$e=`
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
`;function H(a){let e=new CSSStyleSheet;return e.replaceSync(a),e}var A=a=>String(a??"").split(".")[0],m=(a,e)=>e&&a?.states?.[e]||null,z=(a,e)=>m(a,e)?.attributes??{};function k(a,e,t){return t||z(a,e).friendly_name||e||""}var qe=new Set(["scene","script","input_button","button","event"]),J=a=>qe.has(A(a));function W(a){return!a||a.state==="unavailable"?!0:a.state==="unknown"?!J(a.entity_id):!1}function ze(a){if(!a)return!1;let e=a.state;if(e==="unavailable"||e==="unknown")return!1;switch(A(a.entity_id)){case"cover":return e==="open"||e==="opening";case"alarm_control_panel":return e.startsWith("armed")||e==="triggered"||e==="arming";case"climate":case"water_heater":case"humidifier":return e!=="off";case"person":case"device_tracker":return e==="home";case"media_player":return e!=="off"&&e!=="idle"&&e!=="standby";default:return e==="on"||e==="playing"||e==="active"||e==="heat"}}function Ce(a,e,t){if(!a||a.themes!==e.themes||a.language!==e.language)return!0;for(let n of t)if(n&&a.states?.[n]!==e.states?.[n])return!0;return!1}function B(a,e,t={}){a.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0,cancelable:!1}))}var D=(a,e)=>B(a,"hass-more-info",{entityId:e});function Q(a){switch(A(a)){case"light":case"switch":case"fan":case"input_boolean":case"automation":case"siren":return{action:"toggle"};case"script":case"scene":case"input_button":case"button":return{action:"toggle"};default:return{action:"more-info"}}}function Pe(a){switch(A(a)){case"scene":return["scene","turn_on"];case"script":return["script","turn_on"];case"input_button":return["input_button","press"];case"button":return["button","press"];case"lock":return["lock","open"];case"cover":return["cover","toggle"];case"media_player":return["media_player","media_play_pause"];default:return["homeassistant","toggle"]}}function Oe(a,e,t,n){if(!(!n||n.action==="none"))switch(n.action){case"more-info":D(a,n.entity||t.entity);break;case"toggle":{let i=n.entity||t.entity;if(!i)break;let[r,s]=Pe(i);e.callService(r,s,{entity_id:i});break}case"perform-action":case"call-service":{let i=n.perform_action||n.service;if(!i)break;let[r,s]=i.split(".");e.callService(r,s,n.data??n.service_data??{},n.target);break}case"navigate":if(!n.navigation_path)break;history.pushState(null,"",n.navigation_path),B(window,"location-changed",{replace:!1});break;case"url":n.url_path&&window.open(n.url_path,n.target??"_blank");break;case"assist":B(a,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}});break;case"fire-dom-event":B(a,"ll-custom",n);break;default:break}}function C(a,{onTap:e,onHold:t,onDouble:n}){let s=0,c=0,l=null,d=g=>{g.button!=null&&g.button!==0||(s=Date.now())},u=()=>{let g=s?Date.now()-s:0;if(s=0,t&&g>=500){navigator.vibrate?.(18),t();return}if(!n){e?.();return}if(c++,c===1){l=setTimeout(()=>{c=0,e?.()},260);return}clearTimeout(l),c=0,n()};return a.addEventListener("pointerdown",d),a.addEventListener("click",u),a.addEventListener("contextmenu",g=>g.preventDefault()),()=>{clearTimeout(l),a.removeEventListener("pointerdown",d),a.removeEventListener("click",u)}}function j(a,e){if(!e)return"";let t=A(e.entity_id),n=e.attributes.device_class;return a.formatEntityState?.(e)??a.localize?.(`component.${t}.entity_component.${n??"_"}.state.${e.state}`)??a.localize?.(`component.${t}.entity_component._.state.${e.state}`)??e.state}function T(a,e,t){let n=Number(e);return Number.isFinite(n)?n.toLocaleString(a?.locale?.language??"nl",{minimumFractionDigits:t??0,maximumFractionDigits:t??0}):"--"}var Se=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Le=["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],Ee=(a=new Date)=>new Date(a.getFullYear(),a.getMonth(),a.getDate()),ee=(a,e)=>Math.round((Ee(e)-Ee(a))/864e5);function K(a){if(!a)return null;if(a instanceof Date)return Number.isNaN(+a)?null:a;let e=String(a).trim(),t=e.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);if(t)return new Date(+t[3],+t[2]-1,+t[1]);if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/),t)return new Date(+t[1],+t[2]-1,+t[3]);let n=new Date(e);return Number.isNaN(+n)?null:n}function te(a,e=new Date){if(!a)return"";let t=ee(e,a);return t<0?`${Math.abs(t)} dagen geleden`:t===0?"vandaag":t===1?"morgen":t===2?"overmorgen":t<=6?Se[a.getDay()]:`${Se[a.getDay()].slice(0,2)} ${a.getDate()} ${Le[a.getMonth()]}`}var Ae=a=>a?`${a.getDate()} ${Le[a.getMonth()]}`:"";var Re=`
  :host {
    ${I}
    display: block;
    font-family: var(--dac-font);
    color: var(--dac-ink);
    -webkit-font-smoothing: antialiased;
  }
  :host([hidden]) { display: none; }
`,O={accent:"var(--dac-accent-hi)",solar:"var(--dac-solar)",house:"var(--dac-house)",water:"var(--dac-grid-in)",magenta:"var(--dac-grid-out)",pink:"var(--dac-device-1)",teal:"var(--dac-device-2)",lit:"var(--dac-lit)",good:"var(--dac-good)",warn:"var(--dac-warn)",bad:"var(--dac-bad)",neutral:"var(--dac-ink-3)"},q={accent:"Accent",solar:"Oranje",house:"Blauw",water:"Lichtblauw",magenta:"Magenta",pink:"Roze",teal:"Groenblauw",lit:"Lampgeel",good:"Goed",warn:"Let op",bad:"Kritiek",neutral:"Neutraal"},$=(a,e="accent")=>O[a]??(a&&/[#(]|^var/.test(a)?a:O[e]),S=Symbol("incomplete"),Ve=a=>`
  <div class="needs">
    <span class="mark"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6"/>
      <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>
    </svg></span>
    <span><b>Nog niets gekozen</b><span>${a}</span></span>
  </div>`,We=56,De=8,P=a=>Math.max(1,Math.ceil((a+De)/(We+De))),b=class extends HTMLElement{static css="";static get styleSheets_(){return Object.hasOwn(this,"sheets_")||(this.sheets_=[H(Re+$e+this.css)]),this.sheets_}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=new.target.styleSheets_,this.built_=!1,this.wired_=!1,this.teardown_=[]}setConfig(e){let t=this.validate(e??{});this.config=t,this.built_&&(this.destroy_(),this.shadowRoot.replaceChildren(),this.built_=!1,this.wired_=!1),this.isConnected&&this.build_()}set hass(e){let t=this.hass_;if(this.hass_=e,!!this.config){if(!this.built_){this.build_();return}this.config[S]||Ce(t,e,this.watched())&&this.paint()}}get hass(){return this.hass_}connectedCallback(){if(this.config){if(!this.built_){this.build_();return}this.wired_||(this.wire(),this.wired_=!0,this.hass_&&this.paint())}}disconnectedCallback(){this.destroy_(),this.wired_=!1}validate(e){return e}watched(){return this.config?.entity?[this.config.entity]:[]}template(){return""}wire(){}paint(){}build_(){let e=document.createElement("template"),t=this.config?.[S];e.innerHTML=t?Ve(t):this.template(),this.shadowRoot.appendChild(e.content),this.built_=!0,!t&&(this.wire(),this.wired_=!0,this.hass_&&this.paint())}destroy_(){for(let e of this.teardown_)try{e()}catch{}this.teardown_=[]}$(e){return this.shadowRoot.querySelector(e)}$$(e){return[...this.shadowRoot.querySelectorAll(e)]}text(e,t){let n=typeof e=="string"?this.$(e):e;n&&n.textContent!==String(t)&&(n.textContent=t)}getCardSize(){return 1}};function x(a,e,{name:t,description:n,preview:i=!0}={}){customElements.get(a)||(customElements.define(a,e),window.customCards=window.customCards??[],window.customCards.push({type:a,name:t??a,description:n??"",preview:i,documentationURL:"https://github.com/Sven2410/domotiapp-cards"}))}function y(a,e){customElements.get(a)||customElements.define(a,e)}var o=(a,e="none")=>`<svg class="icon" viewBox="0 0 24 24" fill="${e}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${a}</svg>`,f={house:o(`<path d="M3.2 11.3 12 4.1l8.8 7.2"/>
    <path d="M5.4 12.9V20a.9.9 0 0 0 .9.9h11.4a.9.9 0 0 0 .9-.9v-7.1"/>
    <path d="M9.8 20.9v-5.2h4.4v5.2"/>`),floorB:o(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M9.4 17.8V14h2.4a1.9 1.9 0 0 1 0 3.8Z"/>`),floor1:o(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.6 15.2 12 14v3.9"/>`),floor2:o(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.4 14.8a1.6 1.6 0 0 1 3.1.5c0 1.4-3.1 1.8-3.1 3.5h3.2"/>`),garage:o(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M8.2 20.4v-5.6h7.6v5.6M8.2 17.6h7.6"/>`),garageOpen:o(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M7.6 14.4h8.8M7.6 12.4h8.8"/>`),garageClosed:o(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M7.6 13.2h8.8M7.6 15.4h8.8M7.6 17.6h8.8M7.6 19.8h8.8"/>`),shutter:o(`<path d="M3.6 4.2h16.8M5.2 4.2v13.4M18.8 4.2v13.4"/>
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
    <rect x="5.2" y="9.8" width="6" height="4.4" rx="1" fill="currentColor" stroke="none"/>`),gaugeArrow:o(`<path d="M4.2 17.4a8.4 8.4 0 1 1 15.6 0"/>
    <path d="m12 13.6 3.6-3.8"/><circle cx="12" cy="14.8" r="1.3"/>`),clock:o('<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.2 1.9"/>'),washer:o(`<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2"/>
    <circle cx="12" cy="14" r="4.4"/>
    <path d="M4.2 7.4h15.6M15.4 5.1h1.6"/>`),dishwasher:o(`<rect x="4.2" y="2.8" width="15.6" height="18.4" rx="2"/>
    <path d="M4.2 7.8h15.6M7.2 5.3h2.4"/>
    <path d="M9 11.4c1 1.4 1 2.8 0 4.2M12 11.4c1 1.4 1 2.8 0 4.2M15 11.4c1 1.4 1 2.8 0 4.2"/>`),printer:o(`<path d="M7 9V4.6a.6.6 0 0 1 .6-.6h8.8a.6.6 0 0 1 .6.6V9"/>
    <rect x="3.6" y="9" width="16.8" height="7.2" rx="1.8"/>
    <path d="M7 15.4h10v4a.6.6 0 0 1-.6.6H7.6a.6.6 0 0 1-.6-.6z"/>`),key:o(`<circle cx="7.8" cy="12" r="3.8"/>
    <path d="M11.6 12h8.6M17.4 12v3M20.2 12v2.2"/>`),power:o(`<path d="M12 3.6v8"/>
    <path d="M17.4 6.6a7.6 7.6 0 1 1-10.8 0"/>`),plus:o('<path d="M12 5.2v13.6M5.2 12h13.6"/>'),minus:o('<path d="M5.2 12h13.6"/>'),chevronRight:o('<path d="m9.4 6.2 5.6 5.8-5.6 5.8"/>'),chevronDown:o('<path d="m6.2 9.4 5.8 5.6 5.8-5.6"/>'),close:o('<path d="M6.4 6.4 17.6 17.6M17.6 6.4 6.4 17.6"/>'),check:o('<path d="m5.2 12.6 4.4 4.4 9.2-10"/>'),dots:o('<circle cx="5.4" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.6" cy="12" r="1.5"/>'),warning:o('<path d="M12 4.2 2.8 20h18.4z"/><path d="M12 10v4.4M12 17.4v.1"/>'),question:o(`<circle cx="12" cy="12" r="8.6"/>
    <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>`)};function w(a,e="question"){return a?f[a]?f[a]:a.includes(":")?`<ha-icon class="icon" icon="${a}"></ha-icon>`:f[e]??f.question:f[e]??f.question}function je(a,e={}){switch(String(a??"").split(".")[0]){case"light":return"bulb";case"switch":return"switchOn";case"cover":return e.device_class==="awning"||e.device_class==="blind"?"awning":"shutter";case"person":case"device_tracker":return"person";case"climate":return"thermo";case"binary_sensor":return e.device_class==="smoke"?"smoke":"shield";case"alarm_control_panel":return"shield";case"scene":case"script":case"input_button":case"button":return"star";case"weather":return"cloudSun";default:return"question"}}function Te(a){switch(a){case"sunny":case"clear-night":return"sun";case"partlycloudy":return"cloudSun";case"cloudy":return"cloud";case"rainy":case"pouring":case"hail":case"lightning":case"lightning-rainy":return"rain";case"snowy":case"snowy-rainy":return"snow";case"fog":return"fog";case"windy":case"windy-variant":return"wind";default:return"cloud"}}var Ke=[["Woning",["house","floorB","floor1","floor2","garage","door","window","grid"]],["Rolluiken",["shutter","shutterOpen","awning","garageOpen","garageClosed","arrowUp","arrowDown","stop"]],["Licht en stroom",["bulb","bulbGroup","switchOn","power","plug","bolt","battery"]],["Personen",["person","people","away"]],["Apparaten",["tv","speaker","camera","car","washer","dishwasher","printer","fan","airco","radio"]],["Afval",["bin","binWheeled","calendar"]],["Weer",["sun","cloud","cloudSun","rain","snow","fog","wind","drop","uv","sunrise","sunset","thermo"]],["Status",["shield","lock","lockOpen","key","wifi","smoke","warning","check","close","clock","gaugeArrow"]],["Overig",["star","moon","leaf","cog","dots","plus","minus","chevronRight","chevronDown","question"]]],Ge=`
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
`,ne=null,ae=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),ne=ne??[H(Ge)],this.shadowRoot.adoptedStyleSheets=ne,this.value_="",this.label="Icoon",this.fallback="question",this.auto=!0}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        <button type="button" class="current" aria-expanded="false">
          <span class="preview"></span>
          <span class="who"><b></b><small></small></span>
          <span class="caret">${f.chevronDown}</span>
        </button>
        <div class="panel">
          ${Ke.map(([t,n])=>`
            <div class="group">
              <h4>${t}</h4>
              <div class="grid">
                ${n.map(i=>`<button type="button" class="opt" data-icon="${i}" title="${i}" aria-pressed="false">${f[i]??""}</button>`).join("")}
              </div>
            </div>`).join("")}
          <div class="mdi">
            <label for="mdi">Of Home Assistant-icoon</label>
            <input id="mdi" type="text" placeholder="mdi:washing-machine" spellcheck="false" />
            <button type="button" class="clear">Wissen</button>
          </div>
        </div>
      </div>`,this.$(".current").addEventListener("click",()=>{let t=this.toggleAttribute("open");this.$(".current").setAttribute("aria-expanded",String(t))}),this.shadowRoot.querySelectorAll(".opt").forEach(t=>t.addEventListener("click",()=>this.emit_(t.dataset.icon)));let e=this.$("#mdi");e.addEventListener("change",()=>this.emit_(e.value.trim())),this.$(".clear").addEventListener("click",()=>this.emit_("")),this.paint_()}paint_(){if(!this.shadowRoot.firstElementChild)return;this.$(".label").textContent=this.label??"Icoon";let e=this.value_,t=e||this.fallback||"question";this.$(".preview").innerHTML=w(t,this.fallback),this.$(".who b").textContent=e||(this.auto?"Automatisch":"Kies een icoon"),this.$(".who small").textContent=e?e.includes(":")?"Home Assistant-icoon":"DomotiApp-icoon":this.auto?"Past zich aan de entiteit aan":"Nog niets gekozen",this.shadowRoot.querySelectorAll(".opt").forEach(r=>r.setAttribute("aria-pressed",String(r.dataset.icon===e)));let n=this.$("#mdi");if(this.shadowRoot.activeElement===n)return;let i=e&&e.includes(":")?e:"";n.value!==i&&(n.value=i)}emit_(e){this.value_=e,this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-icon-picker")||customElements.define("dac-icon-picker",ae);var Ue=["accent","solar","house","water","magenta","pink","teal","lit","neutral"],Be=["good","warn","bad"],Ze=`
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
`,ie=null,re=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),ie=ie??[H(Ze)],this.shadowRoot.adoptedStyleSheets=ie,this.value_="",this.label="Kleur",this.statuses=!1}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}swatch(e){return`<button type="button" class="sw" data-tone="${e}" style="--c:${O[e]}"
      title="${q[e]}" aria-label="${q[e]}" aria-pressed="false">${f.check}</button>`}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        ${this.statuses?"<h4>Identiteit</h4>":""}
        <div class="row">
          <button type="button" class="sw auto" data-tone="" title="Automatisch"
            aria-label="Automatisch" aria-pressed="false">${f.check}</button>
          ${Ue.map(e=>this.swatch(e)).join("")}
        </div>
        ${this.statuses?`<h4>Status</h4>
               <div class="row">${Be.map(e=>this.swatch(e)).join("")}</div>
               <p class="note">
                 Statuskleuren betekenen iets: goed, let op, kritiek. Gebruik ze niet om
                 een kaart mooier te maken &mdash; dan zegt rood straks niets meer.
               </p>`:""}
        <div class="chosen"></div>
      </div>`,this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.addEventListener("click",()=>this.emit_(e.dataset.tone))),this.paint_()}paint_(){this.shadowRoot.firstElementChild&&(this.$(".label").textContent=this.label??"Kleur",this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.setAttribute("aria-pressed",String((e.dataset.tone||"")===this.value_))),this.$(".chosen").innerHTML=this.value_?`Gekozen: <b>${q[this.value_]??this.value_}</b>`:"Gekozen: <b>Automatisch</b> &mdash; de kaart kiest op domein en toestand.")}emit_(e){this.value_=e??"",this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value_},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-tone-picker")||customElements.define("dac-tone-picker",re);var p={entity:a=>({entity:a?{domain:a}:{}}),text:()=>({text:{}}),multiline:()=>({text:{multiline:!0}}),bool:()=>({boolean:{}}),number:(a,e,t=1)=>({number:{min:a,max:e,step:t,mode:"box"}}),select:a=>({select:{mode:"dropdown",options:a}}),action:()=>({ui_action:{}})},oe=(...a)=>({type:"grid",name:"",schema:a});var v=class extends HTMLElement{constructor(){super(),this.config_={},this.built_=!1}setConfig(e){this.config_={...this.defaults(),...e},this.render_()}defaults(){return{}}set hass(e){this.hass_=e,this.form_&&(this.form_.hass=e);for(let t of this.pickers_??[])t.hass=e;this.render_()}get hass(){return this.hass_}connectedCallback(){this.render_()}schema(){return[]}pickers(){return[]}label(e){return se[e.name]??e.name}helper(){}async render_(){if(!this.hass_||!this.config_)return;if(this.built_){this.sync_();return}this.built_=!0,await customElements.whenDefined("ha-form"),this.replaceChildren(),this.pickers_=[];let e=this.pickers();if(e.length){let n=document.createElement("div");n.style.cssText="display:flex;flex-direction:column;gap:12px;margin-bottom:16px";for(let i of e){let r=document.createElement(i.kind==="tone"?"dac-tone-picker":"dac-icon-picker");r.label=i.label,r.fallback=i.fallback,i.auto===!1&&(r.auto=!1),i.statuses===!1&&(r.statuses=!1),r.hass=this.hass_,r.value=this.config_[i.key],r.addEventListener("value-changed",s=>{s.stopPropagation(),this.patch_({[i.key]:s.detail.value})}),this.pickers_.push(r),r.dataset.key=i.key,n.appendChild(r)}this.appendChild(n)}let t=document.createElement("ha-form");t.hass=this.hass_,t.data=this.config_,t.schema=this.schema(),t.computeLabel=n=>this.label(n),t.computeHelper=n=>this.helper(n),t.addEventListener("value-changed",n=>{n.stopPropagation(),this.patch_(n.detail.value,!0)}),this.form_=t,this.appendChild(t)}sync_(){this.form_&&(this.form_.hass=this.hass_,this.form_.schema=this.schema(),this.form_.data=this.config_);for(let e of this.pickers_??[])e.hass=this.hass_,e.value=this.config_[e.dataset.key]}patch_(e,t=!1){let n=t?{...e}:{...this.config_,...e};this.config_.type&&(n.type=this.config_.type);for(let[i,r]of Object.entries(n))(r===""||r===void 0||r===null)&&delete n[i];this.config_=n,this.sync_(),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.serialize(n)},bubbles:!0,composed:!0}))}serialize(e){return e}},se={entity:"Entiteit",entities:"Entiteiten",name:"Naam",icon:"Icoon",tone:"Kleur",secondary:"Tweede regel",layout:"Vorm",tap_action:"Tikken",hold_action:"Vasthouden",double_tap_action:"Dubbeltikken",show_state:"Toestand tonen",show_name:"Naam tonen",show_icon:"Icoon tonen",fill:"Vullen",collapsible:"Inklapbaar",title:"Titel",subtitle:"Ondertitel",weather:"Weerentiteit",sun:"Zon-entiteit",person:"Persoon",persons:"Personen",covers:"Rolluiken",lights:"Lampen",sensors:"Sensoren",greeting:"Begroeting",show_clock:"Klok tonen",show_weather:"Weer tonen",show_chips:"Weerdetails tonen",compact:"Compact",columns:"Kolommen",group:"Groepsregel tonen",invert:"Open en dicht omdraaien",label:"Label",color:"Kleur",date_format:"Datumnotatie"};function Fe(a=new Date){let e=a.getHours();return e<6?"Goedenacht":e<12?"Goedemorgen":e<18?"Goedemiddag":"Goedenavond"}var Xe=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Ye=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],ce={humidity:{icon:"drop",tone:"water",label:"Luchtvochtigheid"},wind:{icon:"wind",tone:"neutral",label:"Wind"},uv:{icon:"uv",tone:"solar",label:"UV-index"},precipitation:{icon:"rain",tone:"water",label:"Neerslag"},pressure:{icon:"gaugeArrow",tone:"neutral",label:"Luchtdruk"},sunrise:{icon:"sunrise",tone:"warn",label:"Zonsopkomst"},sunset:{icon:"sunset",tone:"warn",label:"Zonsondergang"}},Je=["humidity","wind","uv","precipitation","sunset"],Qe=a=>a==null||Number.isNaN(+a)?"":["N","NO","O","ZO","Z","ZW","W","NW"][Math.round(+a/45)%8],le=class extends b{static css=`
    :host { display: block; height: 100%; }
    /* Onder het afkappunt bestaat de kaart niet -- ook geen lege ruimte, want
       in een sections-view laat een verborgen kaart anders zijn gat staan. */
    :host([narrow]) { display: none; }

    .strip {
      height: 100%; min-height: 96px;
      display: grid; grid-template-columns: 1fr auto; align-items: center;
      gap: 6px 18px;
      padding: 10px 16px;
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

    .who { min-width: 0; grid-column: 1; grid-row: 1; }
    .hello {
      font-size: 15.5px; font-weight: 400; letter-spacing: -.01em; line-height: 1.2;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .hello b { font-weight: 600; }
    .date { margin-top: 2px; font-size: 11.5px; color: var(--dac-ink-3); white-space: nowrap; }

    /* De weerdetails krijgen de ruimte die overblijft en schuiven horizontaal
       weg als die op is, in plaats van de strip twee regels hoog te maken. */
    /* De weerdetails krijgen de hele tweede regel voor zich, dus ze passen.
       Mocht het toch krap worden, dan valt er een hele chip weg en nooit een
       halve waarde -- "20:5" leest als een storing, niet als een hint. */
    .chips {
      grid-column: 1; grid-row: 2; min-width: 0;
      display: flex; align-items: center; flex-wrap: nowrap; gap: 18px;
      overflow: hidden;
    }
    .chips:empty { display: none; }
    .chip2 {
      display: inline-flex; align-items: center; gap: 6px; flex: 0 0 auto;
      font-size: 12.5px; color: var(--dac-ink-2); white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }
    .chip2 .icon, .chip2 ha-icon { width: 15px; height: 15px; --mdc-icon-size: 15px; color: var(--tone); }

    .now { grid-column: 2; grid-row: 1; display: flex; align-items: center; gap: 9px; justify-self: end; }
    .now .ic { display: flex; color: var(--wtone); }
    .now .ic .icon, .now .ic ha-icon { width: 22px; height: 22px; --mdc-icon-size: 22px; }
    .now .temp { font-size: 21px; font-weight: 300; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
        /* Het gradenteken als superscript, met lucht ertussen. Strak tegen het
       cijfer aan gezet leest het als een rendermisser. */
    .now .temp span {
      font-size: .5em; margin-left: 3px; vertical-align: .5em;
      color: var(--dac-ink-3); letter-spacing: .01em;
    }
    .now .cond {
      font-size: 10.5px; letter-spacing: .09em; text-transform: uppercase;
      color: var(--dac-ink-3); white-space: nowrap;
    }

    .clock {
      grid-column: 2; grid-row: 2; justify-self: end;
      font-size: 19px; font-weight: 400; letter-spacing: -.01em;
      font-variant-numeric: tabular-nums;
    }

    @media (max-width: 620px) {
      .now .cond { display: none; }
      .chips { gap: 12px; }
    }
  `;validate(e){return{show_clock:!0,show_weather:!0,show_chips:!0,show_rule:!0,hide_below:768,...e}}watched(){let e=this.config;return[e.weather,e.weather_uv,e.sun,e.precipitation_entity].filter(Boolean)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),e.show_rule===!1&&this.setAttribute("no-rule",""),`
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
      </div>`}wire(){let e=()=>{let n=6e4-Date.now()%6e4+50;this.timer_=setTimeout(()=>{this.paintClock_(),e()},n)};e(),this.teardown_.push(()=>clearTimeout(this.timer_));let t=Number(this.config.hide_below)||0;if(t>0){let n=matchMedia(`(max-width: ${t-1}px)`),i=()=>this.toggleAttribute("narrow",n.matches);i(),n.addEventListener("change",i),this.teardown_.push(()=>n.removeEventListener("change",i))}}paintClock_(){let e=new Date,t=this.config.name??this.hass?.user?.name??"",n=Fe(e);this.$(".hello").innerHTML=t?`${n}, <b>${t}</b>`:n,this.text(".date",`${Xe[e.getDay()]} ${e.getDate()} ${Ye[e.getMonth()]}`);let i=this.$(".clock");i&&this.text(i,e.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"}))}paint(){this.paintClock_();let e=this.config,t=m(this.hass,e.weather),n=z(this.hass,e.weather),i=this.$(".now");if(i&&t){let l=Te(t.state);i.style.setProperty("--wtone",$(e.tone,"water"));let d=this.hass?.config?.unit_system?.temperature??"\xB0C";this.$(".temp").innerHTML=n.temperature!=null?`${T(this.hass,n.temperature,0)}<span>${d}</span>`:"--";let u=i.querySelector(".ic");u.dataset.icon!==l&&(u.dataset.icon=l,u.innerHTML=w(l,"cloud")),this.text(i.querySelector(".cond"),j(this.hass,t))}let r=this.$(".chips");if(!r)return;let s=Je.map(l=>this.chip_(l,n)).filter(Boolean),c=s.map(l=>`${l.key}${l.value}`).join("|");r.dataset.sig!==c&&(r.dataset.sig=c,r.innerHTML=s.map(l=>`<span class="chip2" style="--tone:${$(ce[l.key].tone)}" title="${ce[l.key].label}">
             ${f[ce[l.key].icon]??""}${l.value}
           </span>`).join(""))}chip_(e,t){let n=this.config;switch(e){case"humidity":return t.humidity!=null?{key:e,value:`${Math.round(t.humidity)}%`}:null;case"wind":{if(t.wind_speed==null)return null;let i=this.hass?.config?.unit_system?.wind_speed??"km/h",r=Qe(t.wind_bearing);return{key:e,value:`${T(this.hass,t.wind_speed,0)} ${i}${r?` ${r}`:""}`}}case"uv":{let r=z(this.hass,n.weather_uv).uv_index??t.uv_index??(n.weather_uv?Number(m(this.hass,n.weather_uv)?.state):null);return r!=null&&!Number.isNaN(+r)?{key:e,value:`UV ${T(this.hass,r,1)}`}:null}case"precipitation":{let i=m(this.hass,n.precipitation_entity);if(i){let r=Number(i.state);if(Number.isNaN(r))return null;let s=i.attributes.unit_of_measurement??"mm";return{key:e,value:`${T(this.hass,r,1)} ${s}`}}return t.precipitation!=null&&!Number.isNaN(+t.precipitation)?{key:e,value:`${T(this.hass,t.precipitation,1)} mm`}:null}case"pressure":return t.pressure!=null?{key:e,value:`${T(this.hass,t.pressure,0)} ${t.pressure_unit??"hPa"}`}:null;case"sunset":case"sunrise":{let r=m(this.hass,n.sun)?.attributes?.[e==="sunset"?"next_setting":"next_rising"];if(!r)return null;let s=new Date(r);return Number.isNaN(+s)?null:{key:e,value:s.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"})}}default:return null}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:2,min_rows:2,max_rows:2}}static getConfigElement(){return document.createElement("domotiapp-header-card-editor")}static getStubConfig(e){return{weather:Object.keys(e?.states??{}).find(n=>n.startsWith("weather.")),sun:"sun.sun"}}},de=class extends v{defaults(){return{show_clock:!0,show_weather:!0,show_chips:!0,show_rule:!0,hide_below:768}}pickers(){return[{key:"tone",kind:"tone",label:"Kleur weericoon"}]}schema(){return[oe({name:"weather",selector:p.entity("weather")},{name:"weather_uv",selector:{entity:{domain:["weather","sensor"]}}}),oe({name:"sun",selector:p.entity("sun")},{name:"precipitation_entity",selector:p.entity("sensor")}),{name:"name",selector:p.text()},{name:"hide_below",selector:p.number(0,1400,8)}]}label(e){return{weather:"Weer (temperatuur, wind)",weather_uv:"Tweede weerbron (UV-index)",precipitation_entity:"Neerslagsensor",show_rule:"Accentlijn tonen",hide_below:"Verbergen onder breedte (px)",bare:"Zonder kaartrand",name:"Naam"}[e.name]??super.label(e)}helper(e){if(e.name==="weather_uv")return"Alleen voor de UV-index. Handig als je hoofdbron die niet meelevert.";if(e.name==="precipitation_entity")return"Een sensor in mm of mm/h, bijvoorbeeld neerslagintensiteit of regen laatste uur.";if(e.name==="hide_below")return"768 verbergt de header op telefoons en houdt hem op tablets en desktops. 0 zet het uit.";if(e.name==="name")return"Leeg laten voor de naam van de ingelogde gebruiker."}};y("domotiapp-header-card-editor",de);x("domotiapp-header-card",le,{name:"DomotiApp Header",description:"Smalle strip met begroeting, weer en klok. Verbergt zichzelf op telefoons."});var he=class extends b{static css=`
    :host { display: block; height: 100%; }

    .sep {
      display: flex; align-items: center; gap: 10px;
      height: 100%; min-height: 34px;
    }

    .chip { width: 30px; height: 30px; }
    .chip .icon, .chip ha-icon { width: 16px; height: 16px; --mdc-icon-size: 16px; }

    /* De naam wordt getoond zoals hij is ingetypt. Er stond hier
       text-transform: uppercase, en dan geeft het toetsenbord "Woonkamer" en
       het scherm "WOONKAMER" -- een kaart hoort niet te corrigeren wat iemand
       schrijft. */
    h3 {
      margin: 0; min-width: 0;
      font-size: 14px; font-weight: 600; letter-spacing: -.01em;
      color: var(--dac-ink);
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
      <div class="sep" style="--tone:${$(e.tone)}">
        ${t?`<span class="chip">${w(e.icon,"star")}</span>`:""}
        <h3></h3>
        ${e.line===!1?"":'<span class="rule"></span>'}
        <span class="sub"><span class="si"></span><span class="sv"></span></span>
      </div>`}paint(){this.text("h3",this.config.name??"");let e=this.$(".sub");if(!e)return;let t=m(this.hass,this.config.secondary_entity),n=e.querySelector(".si"),i=e.querySelector(".sv");if(!t){i.textContent="",n.innerHTML="";return}let r=this.config.secondary_icon??"";n.dataset.icon!==r&&(n.dataset.icon=r,n.innerHTML=r?w(r):"");let s=t.attributes.unit_of_measurement;i.textContent=s?`${t.state} ${s}`:t.attributes.current_temperature!=null?`${t.attributes.current_temperature} \xB0C`:j(this.hass,t)}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:1,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-separator-card-editor")}static getStubConfig(){return{name:"Nieuwe sectie",icon:"house",tone:"accent"}}},pe=class extends v{defaults(){return{line:!0,tone:"accent"}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon links",fallback:"star",auto:!1},{key:"tone",kind:"tone",label:se.tone},{key:"secondary_icon",kind:"icon",label:"Icoon bij de waarde rechts",auto:!1}]}schema(){return[{name:"name",selector:p.text()},{name:"line",selector:p.bool()},{name:"secondary_entity",selector:p.entity()}]}label(e){return{line:"Lijn tonen",secondary_entity:"Waarde rechts (optioneel)"}[e.name]??super.label(e)}helper(e){if(e.name==="secondary_entity")return"Toont de toestand van deze entiteit rechts van de lijn, bijvoorbeeld een temperatuur of een aantal."}};y("domotiapp-separator-card-editor",pe);x("domotiapp-separator-card",he,{name:"DomotiApp Separator",description:"Sectiekop met icoon en vervagende lijn."});var ue=class extends b{static css=`
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

  `;validate(e){return{layout:"row",show_state:!0,show_name:!0,show_icon:!0,...e}}watched(){return[this.config.entity].filter(Boolean)}tone_(){let e=this.config;if(e.tone)return $(e.tone);if(A(e.entity)!=="light")return O.accent;let t=m(this.hass,e.entity),n=t?.state==="on"?t.attributes?.rgb_color:null;return n?`rgb(${n[0]},${n[1]},${n[2]})`:O.lit}template(){let e=this.config;return this.setAttribute("layout",["row","tile","compact"].includes(e.layout)?e.layout:"row"),`
      <div class="btn" role="button" tabindex="0" style="--tone:${this.tone_()}">
        <span class="wash"></span>
        ${e.show_icon===!1?"":'<span class="chip" role="button" tabindex="0"></span>'}
        <span class="txt">
          ${e.show_name===!1?"":'<span class="nm"></span>'}
          ${e.show_state===!1?"":'<span class="st"></span>'}
        </span>
      </div>`}wire(){let e=this.config,t=(i,r)=>Oe(this,this.hass,e,e[i]??r);this.teardown_.push(C(this.$(".btn"),{onTap:()=>t("tap_action",Q(e.entity)),onHold:()=>t("hold_action",{action:e.entity?"more-info":"none"}),onDouble:e.double_tap_action?()=>t("double_tap_action",{action:"none"}):void 0}));let n=this.$(".chip");n&&(this.teardown_.push(C(n,{onTap:i=>t("icon_tap_action",Q(e.entity)),onHold:()=>t("icon_hold_action",{action:e.entity?"more-info":"none"})})),n.addEventListener("click",i=>i.stopPropagation()),n.addEventListener("pointerdown",i=>i.stopPropagation()))}paint(){let e=this.config,t=m(this.hass,e.entity),n=ze(t),i=!!e.entity&&W(t);this.toggleAttribute("on",n),this.$(".btn").classList.toggle("unavailable",i),this.$(".btn").style.setProperty("--tone",this.tone_());let r=this.$(".chip");if(r){let c=e.icon||je(e.entity,z(this.hass,e.entity));r.dataset.icon!==c&&(r.dataset.icon=c,r.innerHTML=w(c)),r.style.setProperty("--tone",n?this.tone_():"var(--dac-ink-3)"),r.setAttribute("aria-label",e.entity?`${k(this.hass,e.entity,e.name)} schakelen`:"Icoon")}this.text(".nm",k(this.hass,e.entity,e.name));let s=this.$(".st");s&&this.text(s,this.secondary_(t,i)),this.$(".btn").setAttribute("aria-label",`${k(this.hass,e.entity,e.name)}${t?`, ${j(this.hass,t)}`:""}`)}secondary_(e,t){return t?"Niet bereikbaar":!e||J(e.entity_id)?"":A(e.entity_id)==="light"&&e.state==="on"&&e.attributes.brightness!=null?`${Math.round(e.attributes.brightness/255*100)}%`:j(this.hass,e)}getCardSize(){return this.config?.layout==="tile"?2:1}getGridOptions(){return this.config?.layout==="tile"?{columns:6,rows:2,min_columns:3,min_rows:2,max_rows:2}:{columns:12,rows:1,min_columns:4,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-button-card-editor")}static getStubConfig(e,t){return{entity:t?.find(i=>i.startsWith("light."))??t?.find(i=>i.startsWith("switch."))??t?.[0],layout:"row"}}},me=class extends v{defaults(){return{layout:"row",show_state:!0,show_name:!0,show_icon:!0}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon",fallback:"star"},{key:"tone",kind:"tone",label:"Kleur"}]}schema(){return[{name:"entity",selector:p.entity()},{name:"name",selector:p.text()},{name:"layout",selector:p.select([{value:"row",label:"Rij"},{value:"tile",label:"Tegel"},{value:"compact",label:"Compact"}])},{name:"show_icon",selector:p.bool()},{name:"show_name",selector:p.bool()},{name:"show_state",selector:p.bool()},{name:"icon_tap_action",selector:p.action()},{name:"icon_hold_action",selector:p.action()},{name:"tap_action",selector:p.action()},{name:"hold_action",selector:p.action()},{name:"double_tap_action",selector:p.action()}]}label(e){return{entity:"Entiteit",name:"Naam (overschrijft die van de entiteit)",layout:"Vorm",show_icon:"Icoon tonen",show_name:"Naam tonen",show_state:"Toestand tonen",icon_tap_action:"Tikken op het icoon",icon_hold_action:"Vasthouden op het icoon",tap_action:"Tikken op de kaart",hold_action:"Vasthouden op de kaart",double_tap_action:"Dubbeltikken op de kaart"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"Mag leeg blijven: zonder entiteit wordt dit een navigatieknop.";if(e.name==="icon_tap_action")return"Leeg laten schakelt de entiteit. Handig: het icoon schakelt de lichtgroep, de kaart navigeert naar de ruimte.";if(e.name==="tap_action")return"Wat er gebeurt als je naast het icoon tikt, bijvoorbeeld navigeren naar een pop-up."}};y("domotiapp-button-card-editor",me);x("domotiapp-button-card",ue,{name:"DomotiApp Knop",description:"E\xE9n control als rij, tegel of compacte pil. Vervangt tile, mushroom-entity en bubble-knoppen."});var ge=(a,e,t)=>Math.min(t,Math.max(e,a));function Z(a,e){let t=e.min??0,n=e.max??100,i=e.step??1,r=!1,s=h=>{let L=a.getBoundingClientRect();if(!L.width)return t;let _=ge((h-L.left)/L.width,0,1),N=t+_*(n-t);return ge(Math.round(N/i)*i,t,n)},c=h=>{e.disabled?.()||h.button!=null&&h.button!==0||(r=!0,a.setPointerCapture?.(h.pointerId),a.classList.add("dragging"),e.onInput(s(h.clientX)),h.preventDefault())},l=h=>{r&&(e.onInput(s(h.clientX)),h.preventDefault())},d=h=>{r&&(r=!1,a.releasePointerCapture?.(h.pointerId),a.classList.remove("dragging"),e.onCommit(s(h.clientX)))},u=()=>{r&&(r=!1,a.classList.remove("dragging"),e.onInput(e.value()))},g=h=>{if(e.disabled?.())return;let L=(n-t)/10,_={ArrowLeft:-i,ArrowDown:-i,ArrowRight:i,ArrowUp:i,PageDown:-L,PageUp:L,Home:-1/0,End:1/0};if(!(h.key in _))return;h.preventDefault();let N=e.value(),M=ge(_[h.key]===-1/0?t:_[h.key]===1/0?n:N+_[h.key],t,n);e.onInput(M),e.onCommit(M)};return a.addEventListener("pointerdown",c),a.addEventListener("pointermove",l),a.addEventListener("pointerup",d),a.addEventListener("pointercancel",u),a.addEventListener("keydown",g),()=>{a.removeEventListener("pointerdown",c),a.removeEventListener("pointermove",l),a.removeEventListener("pointerup",d),a.removeEventListener("pointercancel",u),a.removeEventListener("keydown",g)}}var R=(a="")=>`
  <div class="slider ${a}" role="slider" tabindex="0"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
    <div class="track"><div class="fill"></div></div>
    <div class="thumb"></div>
  </div>`,F=`
  .slider {
    position: relative; flex: 1 1 90px; min-width: 70px; height: 36px;
    cursor: ew-resize; touch-action: none; -webkit-tap-highlight-color: transparent;
    display: flex; align-items: center;
  }
  .slider .track {
    position: absolute; inset: 0; border-radius: 10px;
    background: var(--strip, rgba(255,255,255,.075)); overflow: hidden;
  }
  .slider .fill {
    position: absolute; inset: 0 auto 0 0; width: var(--v, 0%);
    background: linear-gradient(90deg,
      color-mix(in srgb, var(--tone) 55%, transparent), var(--tone));
    transition: width 90ms linear;
  }
  .slider.dragging .fill { transition: none; }

  /* De greep is een dikke witte balk. Hij wijst alleen aan waar je staat --
     pakken kan overal, dus hij hoeft niet groot genoeg te zijn om te raken. */
  .slider .thumb {
    position: absolute; top: 5px; bottom: 5px; left: var(--v, 0%);
    width: 5px; margin-left: -2.5px; border-radius: 3px;
    background: rgba(255,255,255,.95); box-shadow: 0 0 6px rgba(0,0,0,.55);
    pointer-events: none; transition: left 90ms linear;
  }
  .slider.dragging .thumb { transition: none; }
  .slider[data-strip] .fill { display: none; }
  .slider:focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; border-radius: 10px; }
`;var et=new Set(["brightness","color_temp","hs","rgb","rgbw","rgbww","xy","white"]),tt=new Set(["hs","rgb","rgbw","rgbww","xy"]),ve=a=>a?.attributes?.supported_color_modes??[],nt=a=>ve(a).some(e=>et.has(e)),X=a=>ve(a).some(e=>tt.has(e)),Y=a=>ve(a).includes("color_temp"),Ne=a=>Math.max(1,Math.round((a??0)/255*100)),fe=class extends b{static css=`
    :host { display: block; height: 100%; }

    .card {
      height: 100%; min-height: 56px; padding: 7px 12px;
      display: flex; flex-direction: column; justify-content: center; gap: 7px;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .lamp { display: flex; align-items: center; gap: 11px; min-height: 40px; }

    .chip { width: 40px; height: 40px; cursor: pointer; }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    .lamp[data-on="false"] .chip {
      color: var(--dac-ink-3); background: rgba(255,255,255,.05); border-color: var(--dac-border);
    }
    /* Een brandende lamp gloeit een beetje. Dat is de enige plek in de familie
       waar een schaduw betekenis draagt in plaats van diepte. */
    .lamp[data-on="true"] .chip {
      box-shadow: 0 0 14px -2px color-mix(in srgb, var(--tone) 55%, transparent);
    }

    .txt { min-width: 0; flex: 0 1 auto; display: flex; flex-direction: column; }
    .nm {
      font-size: 13.5px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .v { font-size: 11.5px; color: var(--dac-ink-2); font-variant-numeric: tabular-nums; line-height: 1.25; }

    ${F}

    .colour { display: flex; gap: 8px; }
    .colour[hidden] { display: none; }
    .colour .slider { height: 30px; flex: 1 1 0; }
    .colour .slider .track { border-radius: 8px; }
    .colour .slider .thumb { top: 4px; bottom: 4px; width: 6px; margin-left: -3px; }

    /* ---- aan/uit, voor lampen die alleen dat kunnen ---- */
    .toggle {
      flex: 0 0 auto; margin-left: auto; width: 52px; height: 30px; padding: 0; cursor: pointer;
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

    .lamp.unavailable { opacity: .42; }
    .lamp.unavailable .slider, .lamp.unavailable .toggle { pointer-events: none; }
  `;validate(e){let t=e.entity??e.lights?.[0]??e.entities?.[0],n=typeof t=="string"?t:t?.entity;return n?{show_colour:!0,...e,entity:n}:{...e,[S]:"Kies een lamp."}}watched(){return[this.config.entity]}template(){return this.config.bare&&this.setAttribute("bare",""),`
      <div class="card surface">
        <div class="lamp" data-on="false" style="--tone:var(--dac-lit)">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <span class="txt"><span class="nm"></span><span class="v tnum"></span></span>
          <span class="ctl" style="display:contents"></span>
        </div>
        <div class="colour" hidden></div>
      </div>`}wire(){let e=this.config.entity;this.teardown_.push(C(this.$(".chip"),{onTap:()=>this.hass.callService("light","toggle",{entity_id:e}),onHold:()=>D(this,e)})),this.$(".card").addEventListener("click",t=>{t.target.closest(".toggle")&&this.hass.callService("light","toggle",{entity_id:e})}),this.sliders_=new Map}attach_(e,t,n){if(!e||this.sliders_.has(t))return;let i=Z(e,n);this.sliders_.set(t,i),this.teardown_.push(i)}setSlider_(e,t,n=0,i=100){if(!e)return;let r=i>n?(t-n)/(i-n)*100:0;e.style.setProperty("--v",`${r}%`),e.setAttribute("aria-valuemin",String(n)),e.setAttribute("aria-valuemax",String(i)),e.setAttribute("aria-valuenow",String(t))}paint(){let e=this.config,t=m(this.hass,e.entity),n=W(t),i=t?.state==="on",r=this.$(".lamp");r.dataset.on=String(i),r.classList.toggle("unavailable",n);let s=this.$(".chip"),c=e.icon||"bulb";s.dataset.icon!==c&&(s.dataset.icon=c,s.innerHTML=w(c,"bulb")),this.text(".nm",k(this.hass,e.entity,e.name));let l=i?t?.attributes?.rgb_color:null;r.style.setProperty("--tone",l?`rgb(${l[0]},${l[1]},${l[2]})`:"var(--dac-lit)");let d=this.$(".ctl"),u=n?"none":nt(t)?"range":"toggle";if(d.dataset.kind!==u&&(d.dataset.kind=u,d.innerHTML=u==="range"?R("brightness"):u==="toggle"?'<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>':"",this.sliders_.delete("brightness")),u==="range"){let g=d.querySelector(".slider");if(this.attach_(g,"brightness",{value:()=>t?.state==="on"?Ne(m(this.hass,e.entity)?.attributes?.brightness):0,onInput:h=>{this.setSlider_(g,h),this.text(".v",h===0?"Uit":`${h}%`)},onCommit:h=>{h===0?this.hass.callService("light","turn_off",{entity_id:e.entity}):this.hass.callService("light","turn_on",{entity_id:e.entity,brightness_pct:h})},disabled:()=>W(m(this.hass,e.entity))}),!g.classList.contains("dragging")){let h=i?Ne(t.attributes.brightness):0;this.setSlider_(g,h),this.text(".v",i?`${h}%`:"Uit")}}else u==="toggle"?(d.querySelector(".toggle")?.setAttribute("aria-checked",String(i)),this.text(".v",i?"Aan":"Uit")):this.text(".v","Niet bereikbaar");this.paintColour_(t,i)}paintColour_(e,t){let n=this.$(".colour"),i=this.config.show_colour!==!1&&(X(e)||Y(e));if(n.hidden=!(i&&t),!i)return;let r=`${X(e)?"c":""}${Y(e)?"t":""}`;if(n.dataset.sig!==r){n.dataset.sig=r,n.innerHTML=(X(e)?`<span data-kind="hue" style="display:contents">${R("hue")}</span>`:"")+(Y(e)?`<span data-kind="kelvin" style="display:contents">${R("kelvin")}</span>`:"");let d=n.querySelector(".slider.hue");d&&(d.dataset.strip="",d.style.setProperty("--strip","linear-gradient(90deg, hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%), hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))"),d.setAttribute("aria-label","Kleur"));let u=n.querySelector(".slider.kelvin");u&&(u.dataset.strip="",u.style.setProperty("--strip","linear-gradient(90deg,#ffb15e,#ffd6a8,#fff5e8,#eaf1ff,#cbdcff)"),u.setAttribute("aria-label","Kleurtemperatuur")),this.sliders_.delete("hue"),this.sliders_.delete("kelvin")}if(!t)return;let s=this.config.entity,c=n.querySelector(".slider.hue");c&&(this.attach_(c,"hue",{min:0,max:360,value:()=>m(this.hass,s)?.attributes?.hs_color?.[0]??0,onInput:d=>this.setSlider_(c,d,0,360),onCommit:d=>{let u=m(this.hass,s)?.attributes?.hs_color?.[1]??100;this.hass.callService("light","turn_on",{entity_id:s,hs_color:[d,u]})}}),c.classList.contains("dragging")||this.setSlider_(c,Math.round(e.attributes.hs_color?.[0]??0),0,360));let l=n.querySelector(".slider.kelvin");if(l){let d=e.attributes.min_color_temp_kelvin??2e3,u=e.attributes.max_color_temp_kelvin??6500;if(this.attach_(l,"kelvin",{min:d,max:u,step:50,value:()=>m(this.hass,s)?.attributes?.color_temp_kelvin??d,onInput:g=>this.setSlider_(l,g,d,u),onCommit:g=>this.hass.callService("light","turn_on",{entity_id:s,color_temp_kelvin:g})}),!l.classList.contains("dragging")){let g=e.attributes.color_temp_kelvin;g!=null&&this.setSlider_(l,g,d,u)}}}rows_(){let e=m(this.hass,this.config?.entity);return this.config?.show_colour!==!1&&e&&(X(e)||Y(e))?2:1}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:12,rows:e,min_columns:4,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-light-card-editor")}static getStubConfig(e,t){let n=t?.find(i=>i.startsWith("light."));return n?{entity:n}:{}}},be=class extends v{defaults(){return{show_colour:!0}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon",fallback:"bulb"}]}schema(){return[{name:"entity",selector:p.entity("light")},{name:"name",selector:p.text()},{name:"show_colour",selector:p.bool()}]}label(e){return{entity:"Lamp",name:"Naam (overschrijft die van de lamp)",show_colour:"Kleurstrips tonen"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"E\xE9n lamp per kaart. Dimbaar krijgt een schuif, alleen schakelbaar een tuimelaar.";if(e.name==="show_colour")return"Kleur en kleurtemperatuur verschijnen zodra de lamp aan is. De kaart is dan twee rijen hoog."}};y("domotiapp-light-card-editor",be);x("domotiapp-light-card",fe,{name:"DomotiApp Verlichting",description:"E\xE9n lamp op \xE9\xE9n rasterrij: dimmen, kleur en kleurtemperatuur."});var G={OPEN:1,CLOSE:2,SET_POSITION:4,STOP:8},U=(a,e)=>!!((a?.attributes?.supported_features??0)&e),at=(a={})=>{switch(a.device_class){case"garage":return{open:"garageOpen",closed:"garageClosed"};case"awning":case"blind":return{open:"awning",closed:"awning"};default:return{open:"shutterOpen",closed:"shutter"}}},we=class extends b{static css=`
    :host { display: block; height: 100%; }

    .card {
      height: 100%; padding: 6px 12px;
      display: flex; flex-direction: column; justify-content: center;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .cv {
      display: grid; grid-template-columns: 40px 1fr auto; gap: 11px; align-items: center;
      flex: 1 1 auto; min-height: 40px;
    }
    .cv + .cv { border-top: 1px solid var(--dac-border); }

    .chip {
      width: 40px; height: 40px; cursor: pointer;
      transition: color 220ms ease, background 220ms ease,
                  border-color 220ms ease, box-shadow 220ms ease;
    }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    /* Open licht op, dicht is een rusttoestand. De toestand zit in het icoon en
       niet in een gemarkeerde knop: een opgelichte pijl-omlaag leest als "deze
       knop staat aan", en een knop staat nergens aan. */
    .cv[data-shown="open"] .chip {
      color: var(--tone);
      background: color-mix(in srgb, var(--tone) 16%, transparent);
      border-color: color-mix(in srgb, var(--tone) 38%, transparent);
      box-shadow: 0 0 14px -3px color-mix(in srgb, var(--tone) 60%, transparent);
    }
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
      width: 36px; height: 32px; display: grid; place-items: center; padding: 0; cursor: pointer;
      border: 0; background: transparent; color: var(--dac-ink-2);
      border-radius: var(--dac-radius-pill);
      transition: background 180ms ease, color 180ms ease;
    }
    .keys button:hover { color: var(--dac-ink); background: rgba(255,255,255,.08); }
    .keys button:active { background: rgba(255,255,255,.14); }
    .keys button .icon { width: 18px; height: 18px; }
    .keys button:disabled { opacity: .3; cursor: default; }

    /* ---- positie, alleen bij motoren die terugmelden ---- */
    .pos { grid-column: 1 / -1; margin: 2px 0 4px; display: flex; }
    .pos[hidden] { display: none; }
    ${F}

    .cv.unavailable { opacity: .42; pointer-events: none; }

    @media (max-width: 380px) { .keys button { width: 34px; } }
  `;validate(e){let t=e.covers??e.entities??(e.entity?[e.entity]:[]);return t.length?{...e,covers:t.map(n=>typeof n=="string"?{entity:n}:n)}:{...e,[S]:"Kies minstens \xE9\xE9n rolluik of zonnescherm."}}watched(){return this.config.covers.map(e=>e.entity)}keysHtml(e){return`
      <div class="keys">
        <button type="button" data-act="open" aria-label="Open">${f.arrowUp}</button>
        ${e?`<button type="button" data-act="stop" aria-label="Stop">${f.stop}</button>`:""}
        <button type="button" data-act="close" aria-label="Dicht">${f.arrowDown}</button>
      </div>`}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`<div class="card surface">${e.covers.map((n,i)=>`
      <div class="cv" data-i="${i}" data-shown="closed" style="--tone:${$(n.tone??e.tone,"solar")}">
        <button class="chip" type="button" aria-label="Meer info"></button>
        <div class="txt"><div class="nm"></div><div class="st"></div></div>
        ${this.keysHtml(e.show_stop!==!1)}
        <div class="pos" hidden></div>
      </div>`).join("")}</div>`}wire(){this.dragging_=new Set,this.assumed_=new Map,this.$$(".cv").forEach(e=>{let t=e.dataset.i;e.querySelectorAll(".keys button").forEach(i=>{i.addEventListener("click",()=>{let r=i.dataset.act,s={open:"open_cover",stop:"stop_cover",close:"close_cover"};this.hass.callService("cover",s[r],{entity_id:this.config.covers[+t].entity}),r!=="stop"&&(this.assumed_.set(t,r==="open"?"open":"closed"),this.paint())})});let n=this.config.covers[+t].entity;this.teardown_.push(C(e.querySelector(".chip"),{onTap:()=>D(this,n)}))})}paint(){this.$$(".cv").forEach(e=>{let t=e.dataset.i,n=this.config.covers[+t],i=m(this.hass,n.entity),r=z(this.hass,n.entity),s=!i||i.state==="unavailable",c=i?.state??"unknown";e.classList.toggle("unavailable",s),e.querySelector(".nm").textContent=k(this.hass,n.entity,n.name);let l=U(i,G.SET_POSITION)&&r.current_position!=null,d=l?r.current_position>0?"open":"closed":c==="open"||c==="closed"?c:this.assumed_.get(t)??"closed";e.dataset.shown=d;let u=at(r),g=(d==="open"?n.icon_open:n.icon_closed)??(d==="open"?this.config.icon_open:this.config.icon_closed)??n.icon??u[d],h=e.querySelector(".chip");h.dataset.icon!==g&&(h.dataset.icon=g,h.innerHTML=w(g,u[d]));let L=e.querySelector(".st");this.dragging_.has(t)||(L.textContent=s?"Niet bereikbaar":c==="opening"?"Gaat open":c==="closing"?"Gaat dicht":l?`${r.current_position}% open`:c==="open"?"Open":c==="closed"?"Dicht":""),e.querySelectorAll(".keys button").forEach(M=>{if(M.dataset.act==="stop"){M.disabled=s||!U(i,G.STOP);return}let E=M.dataset.act==="open";M.disabled=s||(E?!U(i,G.OPEN):!U(i,G.CLOSE))});let _=e.querySelector(".pos"),N=l&&this.config.show_position!==!1;if(_.hidden=!N,N){if(!_.dataset.built){_.dataset.built="1",_.innerHTML=R("position");let E=_.querySelector(".slider");E.setAttribute("aria-label","Positie");let He=V=>{E.style.setProperty("--v",`${V}%`),E.setAttribute("aria-valuenow",String(V)),e.querySelector(".st").textContent=`${V}% open`};this.teardown_.push(Z(E,{value:()=>z(this.hass,n.entity).current_position??0,onInput:He,onCommit:V=>this.hass.callService("cover","set_cover_position",{entity_id:n.entity,position:V})}))}let M=_.querySelector(".slider");if(!M.classList.contains("dragging")){let E=r.current_position??0;M.style.setProperty("--v",`${E}%`),M.setAttribute("aria-valuenow",String(E))}}})}rows_(){let e=this.config?.covers??[],t=e.some(n=>U(m(this.hass,n.entity),G.SET_POSITION));return P(12+Math.max(1,e.length)*42+(t?30:0))}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:12,rows:e,min_columns:6,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-cover-card-editor")}static getStubConfig(e,t){let n=t?.find(i=>i.startsWith("cover."));return{covers:n?[n]:[]}}},xe=class extends v{defaults(){return{show_stop:!0,show_position:!0}}pickers(){return[{key:"icon_open",kind:"icon",label:"Icoon als het open staat",fallback:"shutterOpen"},{key:"icon_closed",kind:"icon",label:"Icoon als het dicht is",fallback:"shutter"},{key:"tone",kind:"tone",label:"Kleur"}]}schema(){return[{name:"covers",selector:{entity:{domain:"cover",multiple:!0}}},{name:"show_stop",selector:p.bool()}]}label(e){return{covers:"Rolluiken",show_stop:"Stopknop tonen"}[e.name]??super.label(e)}helper(e){if(e.name==="covers")return"Melden ze hun stand terug, dan komt er vanzelf een schuif bij. Zo niet, dan blijven het open, stop en dicht, en volgt het icoon de knop die je indrukt."}};y("domotiapp-cover-card-editor",xe);x("domotiapp-cover-card",we,{name:"DomotiApp Rolluiken",description:"Open, stop en dicht, met een eigen icoon voor open en dicht."});function it(a){if(!a)return{label:"Onbekend",home:null};switch(a.state){case"home":return{label:"Thuis",home:!0};case"not_home":return{label:"Afwezig",home:!1};case"unknown":case"unavailable":return{label:"Onbekend",home:null};default:return{label:a.state,home:!1}}}var ye=class extends b{static css=`
    :host { display: block; height: 100%; }

    .card {
      height: 100%; padding: 10px 12px;
      display: flex; flex-direction: column; justify-content: center;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; }

    .chips {
      display: grid; gap: 6px;
      grid-template-columns: repeat(var(--cols, 6), minmax(0, 1fr));
    }
    .p {
      display: flex; flex-direction: column; align-items: center; gap: 5px;
      padding: 3px 2px; background: none; border: 0; cursor: pointer;
      font: inherit; color: inherit; border-radius: var(--dac-radius-sm);
      transition: background 200ms ease;
    }
    .p:hover { background: var(--dac-surface); }
    .nm {
      font-size: 11px; font-weight: 500; line-height: 1.15; text-align: center;
      max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st {
      font-size: 10px; color: var(--dac-ink-3); line-height: 1.15;
      max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .av {
      position: relative; flex: 0 0 auto;
      width: 38px; height: 38px; border-radius: 50%;
      display: grid; place-items: center; overflow: hidden;
      font-size: 14px; font-weight: 600;
      color: var(--dac-ink); background: var(--dac-surface-hi);
      /* Ring buiten de avatar getekend, zodat een foto er nooit door bijgesneden wordt. */
      box-shadow: 0 0 0 2px var(--dac-bg), 0 0 0 3.5px var(--tone);
    }
    .av img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .av .icon { width: 55%; height: 55%; color: var(--dac-ink-2); }

    :focus-visible { outline: 2px solid var(--dac-accent-hi); outline-offset: 2px; }
  `;validate(e){let t=e.persons??e.entities??(e.entity?[e.entity]:[]);return t.length?{...e,persons:t.map(n=>typeof n=="string"?{entity:n}:n)}:{...e,[S]:"Kies minstens \xE9\xE9n persoon."}}watched(){return this.config.persons.map(e=>e.entity)}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.columns??Math.min(e.persons.length,6),n=e.persons.map((i,r)=>`
      <button class="p" type="button" data-i="${r}" style="--tone:var(--dac-ink-3)">
        <span class="av"><span class="ph"></span></span>
        <span class="nm"></span>
        <span class="st"></span>
      </button>`).join("");return`<div class="card surface"><div class="chips" style="--cols:${t}">${n}</div></div>`}wire(){this.$$(".p").forEach(e=>{let t=this.config.persons[+e.dataset.i];this.teardown_.push(C(e,{onTap:()=>D(this,t.entity)}))})}paint(){this.$$(".p").forEach(e=>{let t=this.config.persons[+e.dataset.i],n=m(this.hass,t.entity),i=it(n);e.style.setProperty("--tone",i.home===!0?"var(--dac-good)":i.home===!1?"var(--dac-bad)":"var(--dac-warn)");let r=k(this.hass,t.entity,t.name);this.text(e.querySelector(".nm"),r),this.text(e.querySelector(".st"),i.label);let s=e.querySelector(".ph"),c=n?.attributes?.entity_picture,l=c?`img:${c}`:r?`ini:${r[0]}`:"icon";s.dataset.kind!==l&&(s.dataset.kind=l,s.innerHTML=c?`<img src="${c}" alt="" loading="lazy" />`:r?r[0].toUpperCase():f.person),e.setAttribute("aria-label",`${r}, ${i.label}`)})}rows_(){let e=this.config?.columns??Math.min(this.config?.persons?.length??1,6),t=Math.ceil((this.config?.persons?.length??1)/e);return P(20+t*74+(t-1)*6)}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:"full",rows:e,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-person-card-editor")}static getStubConfig(e){return{persons:Object.keys(e?.states??{}).filter(n=>n.startsWith("person.")).slice(0,6)}}},_e=class extends v{setConfig(e){let t={...e},n=(e.persons??[]).map(i=>typeof i=="string"?{entity:i}:i);t.persons=n.map(i=>i.entity);for(let i of n)i.name&&(t[`naam:${i.entity}`]=i.name);super.setConfig(t)}serialize(e){let t={...e},n=t.persons??[];t.persons=n.map(i=>{let r=t[`naam:${i}`];return r?{entity:i,name:r}:i});for(let i of Object.keys(t))i.startsWith("naam:")&&delete t[i];return t}schema(){let e=(this.config_?.persons??[]).filter(t=>typeof t=="string");return[{name:"persons",selector:{entity:{domain:["person","device_tracker"],multiple:!0}}},...e.map(t=>({name:`naam:${t}`,selector:p.text()}))]}label(e){if(e.name==="persons")return"Personen";if(e.name.startsWith("naam:")){let t=e.name.slice(5);return`Naam voor ${this.hass?.states?.[t]?.attributes?.friendly_name??t}`}return super.label(e)}helper(e){if(e.name==="persons")return"Thuis is groen, weg is rood, geen melding is oranje. Per persoon kun je hieronder een eigen naam zetten."}};y("domotiapp-person-card-editor",_e);x("domotiapp-person-card",ye,{name:"DomotiApp Personen",description:"Wie er thuis is, compact. Het hele huishouden in \xE9\xE9n kaart."});var rt=[[/gft|groente|tuin|organi/i,"teal","binWheeled"],[/pmd|plastic|verpakking/i,"solar","binWheeled"],[/papier|karton/i,"water","binWheeled"],[/rest|grijs/i,"neutral","binWheeled"],[/textiel|kleding/i,"pink","bin"],[/glas/i,"magenta","bin"],[/kerstboom|snoei|takken/i,"teal","bin"]];function ot(a){for(let[e,t,n]of rt)if(e.test(a))return{tone:t,icon:n};return{tone:"accent",icon:"bin"}}var Ie=a=>String(a??"").replace(/^(afvalbeheer|afvalwijzer|mijnafvalwijzer)\s*/i,"").replace(/\s*(mijnafvalwijzer)\s*/i," ").trim(),ke=class extends b{static css=`
    :host { display: block; height: 100%; }

    .card {
      height: 100%; padding: 10px 12px;
      display: flex; flex-direction: column; gap: 8px;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; }

    /* ---- hero ---- */
    .hero {
      display: flex; align-items: center; gap: 12px; flex: 0 0 auto;
      min-height: 56px; padding: 8px 12px; border-radius: var(--dac-radius-sm);
      background: color-mix(in srgb, var(--tone) 11%, transparent);
      border: 1px solid color-mix(in srgb, var(--tone) 34%, transparent);
    }
    .hero .bin {
      width: 40px; height: 40px; flex: 0 0 auto; display: grid; place-items: center;
      border-radius: var(--dac-radius-sm); color: var(--tone);
      background: color-mix(in srgb, var(--tone) 18%, transparent);
    }
    .hero .bin .icon, .hero .bin ha-icon { width: 21px; height: 21px; --mdc-icon-size: 21px; }
    .hero .what { min-width: 0; }
    .hero .big {
      font-size: 18px; font-weight: 500; letter-spacing: -.02em; line-height: 1.15;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .hero .when {
      margin-left: auto; text-align: right; flex: 0 0 auto;
      display: flex; align-items: baseline; gap: 5px;
    }
    .hero .when .n { font-size: 18px; font-weight: 500; letter-spacing: -.02em; font-variant-numeric: tabular-nums; }

    /* Today and tomorrow are the only two states that need to shout. */
    :host([urgency="today"]) .hero { animation: pulse 2.6s ease-in-out infinite; }
    @keyframes pulse {
      0%, 100% { border-color: color-mix(in srgb, var(--tone) 34%, transparent); }
      50%      { border-color: color-mix(in srgb, var(--tone) 72%, transparent); }
    }

    /* ---- list ---- */
    .list { flex: 1 1 auto; display: flex; flex-direction: column; }
    .r {
      display: grid; grid-template-columns: 10px 1fr auto; gap: 12px; align-items: center;
      flex: 1 1 auto; min-height: 32px; padding: 0 2px; font-size: 13px;
    }
    .r + .r { border-top: 1px solid var(--dac-border); }
    .r i { width: 10px; height: 10px; border-radius: 3px; background: var(--tone); }
    .r .d { color: var(--dac-ink-2); font-variant-numeric: tabular-nums; text-align: right; }
    .r .d small { color: var(--dac-ink-3); margin-left: 6px; }

    .empty { padding: 18px 2px; font-size: 13px; color: var(--dac-ink-3); }
  `;validate(e){let t=e.sensors??e.entities??(e.entity?[e.entity]:[]);return t.length?{show_hero:!0,show_list:!0,...e,sensors:t.map(n=>typeof n=="string"?{entity:n}:n)}:{...e,[S]:"Kies minstens \xE9\xE9n afvalsensor waarvan de toestand een datum is."}}watched(){return this.config.sensors.map(e=>e.entity)}read_(){let e=new Date;return this.config.sensors.map(t=>{let n=m(this.hass,t.entity);if(!n)return null;let i=K(n.state)??K(n.attributes.date)??K(n.attributes.next_date);if(!i)return null;let r=t.label??Ie(k(this.hass,t.entity,t.name)),s=ot(t.label??t.entity+r),c=this.config.tones?.[t.entity];return{label:r,date:i,days:ee(e,i),tone:$(c??t.tone??s.tone),icon:t.icon??s.icon}}).filter(t=>t&&t.days>=0).sort((t,n)=>t.date-n.date)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`
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
      </div>`}paint(){let e=this.read_(),t=this.$(".hero"),n=this.$(".list"),i=this.$(".empty");if(i.hidden=e.length>0,t&&(t.hidden=e.length===0,e.length)){let r=e[0];t.style.setProperty("--tone",r.tone),this.setAttribute("urgency",r.days===0?"today":r.days===1?"tomorrow":"later");let s=t.querySelector(".bin");s.dataset.icon!==r.icon&&(s.dataset.icon=r.icon,s.innerHTML=w(r.icon,"bin")),this.text(t.querySelector(".eyebrow"),te(r.date)),this.text(t.querySelector(".big"),r.label),this.text(t.querySelector(".n"),r.days===0?"nu":String(r.days)),this.text(t.querySelector(".u"),r.days===0?"aan de weg":r.days===1?"dag":"dagen")}if(n){let r=this.config.show_hero===!1?e:e.slice(1),s=r.map(c=>`${c.label}${+c.date}`).join("|");if(n.dataset.sig===s)return;n.dataset.sig=s,n.innerHTML=r.map(c=>{let l=te(c.date),d=c.days<=6?`<small>${Ae(c.date)}</small>`:"";return`
        <div class="r" style="--tone:${c.tone}">
          <i></i><span>${c.label}</span>
          <span class="d">${l}${d}</span>
        </div>`}).join("")}}rows_(){let e=this.config?.sensors?.length??1;return this.config?.show_list===!1?1:this.config?.show_hero===!1?Math.max(1,P(20+e*33)):Math.max(2,e)}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:12,rows:e,min_columns:6,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-waste-card-editor")}static getStubConfig(e){return{sensors:Object.keys(e?.states??{}).filter(n=>/afval|waste|trash|garbage|ophaal/i.test(n)&&n.startsWith("sensor.")).filter(n=>K(e.states[n]?.state)).slice(0,6),title:"Afvalkalender"}}},Me=class extends v{defaults(){return{show_hero:!0,show_list:!0}}setConfig(e){let t={...e};for(let[n,i]of Object.entries(e.tones??{}))t[`kleur:${n}`]=i;delete t.tones,super.setConfig(t)}serialize(e){let t={...e},n={};for(let i of Object.keys(t))i.startsWith("kleur:")&&(t[i]&&(n[i.slice(6)]=t[i]),delete t[i]);return Object.keys(n).length?t.tones=n:delete t.tones,t}schema(){let e=this.config_?.sensors??[],t=Object.keys(O).map(n=>({value:n,label:q[n]??n}));return[{name:"sensors",selector:{entity:{domain:"sensor",multiple:!0}}},...e.map(n=>typeof n=="string"?n:n.entity).filter(Boolean).map(n=>({name:`kleur:${n}`,selector:p.select(t)}))]}label(e){if(e.name.startsWith("kleur:")){let t=e.name.slice(6),n=this.hass?.states?.[t]?.attributes?.friendly_name??t;return`Kleur voor ${Ie(n)||n}`}return{sensors:"Afvalsensoren",show_hero:"Eerstvolgende uitlichten",show_list:"Overige data tonen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="sensors")return"Sensoren waarvan de toestand een datum is, bijvoorbeeld 18-08-2026. De kaart sorteert zelf; laat een kleur leeg om de bakkleur op de naam te laten kiezen."}};y("domotiapp-waste-card-editor",Me);x("domotiapp-waste-card",ke,{name:"DomotiApp Afvalkalender",description:"Eerstvolgende ophaling als hero, de rest eronder. Kleur per fractie."});var st="0.1.5";console.info(`%c DOMOTIAPP-CARDS %c ${st} `,"background:#026fa1;color:#e8e4de;font-weight:600;border-radius:3px 0 0 3px;padding:2px 6px","background:#12120f;color:#e8e4de;border-radius:0 3px 3px 0;padding:2px 6px");export{st as VERSION};
//# sourceMappingURL=domotiapp-cards.js.map
