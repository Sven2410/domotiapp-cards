/*! DomotiApp Cards 0.1.7 | MIT | https://github.com/Sven2410/domotiapp-cards */
var P=`
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
`,Ne=`
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
`;function q(i){let e=new CSSStyleSheet;return e.replaceSync(i),e}var L=i=>String(i??"").split(".")[0],f=(i,e)=>e&&i?.states?.[e]||null,w=(i,e)=>f(i,e)?.attributes??{};function M(i,e,t){return t||w(i,e).friendly_name||e||""}var Ye=new Set(["scene","script","input_button","button","event"]),B=i=>Ye.has(L(i));function D(i){return!i||i.state==="unavailable"?!0:i.state==="unknown"?!B(i.entity_id):!1}function Y(i){if(!i)return!1;let e=i.state;if(e==="unavailable"||e==="unknown")return!1;switch(L(i.entity_id)){case"cover":return e==="open"||e==="opening";case"alarm_control_panel":return e.startsWith("armed")||e==="triggered"||e==="arming";case"climate":case"water_heater":case"humidifier":return e!=="off";case"person":case"device_tracker":return e==="home";case"media_player":return e!=="off"&&e!=="idle"&&e!=="standby";default:return e==="on"||e==="playing"||e==="active"||e==="heat"}}function He(i,e,t){if(!i||i.themes!==e.themes||i.language!==e.language)return!0;for(let n of t)if(n&&i.states?.[n]!==e.states?.[n])return!0;return!1}function X(i,e,t={}){i.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0,cancelable:!1}))}var I=(i,e)=>X(i,"hass-more-info",{entityId:e});function J(i){switch(L(i)){case"light":case"switch":case"fan":case"input_boolean":case"automation":case"siren":return{action:"toggle"};case"script":case"scene":case"input_button":case"button":return{action:"toggle"};default:return{action:"more-info"}}}function Je(i){switch(L(i)){case"scene":return["scene","turn_on"];case"script":return["script","turn_on"];case"input_button":return["input_button","press"];case"button":return["button","press"];case"lock":return["lock","open"];case"cover":return["cover","toggle"];case"media_player":return["media_player","media_play_pause"];default:return["homeassistant","toggle"]}}function Q(i,e,t,n){if(!(!n||n.action==="none"))switch(n.action){case"more-info":I(i,n.entity||t.entity);break;case"toggle":{let a=n.entity||t.entity;if(!a)break;let[r,o]=Je(a);e.callService(r,o,{entity_id:a});break}case"perform-action":case"call-service":{let a=n.perform_action||n.service;if(!a)break;let[r,o]=a.split(".");e.callService(r,o,n.data??n.service_data??{},n.target);break}case"navigate":if(!n.navigation_path)break;history.pushState(null,"",n.navigation_path),X(window,"location-changed",{replace:!1});break;case"url":n.url_path&&window.open(n.url_path,n.target??"_blank");break;case"assist":X(i,"show-dialog",{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}});break;case"fire-dom-event":X(i,"ll-custom",n);break;default:break}}function z(i,{onTap:e,onHold:t,onDouble:n}){let o=0,c=0,l=null,p=d=>{d.button!=null&&d.button!==0||(o=Date.now())},h=()=>{let d=o?Date.now()-o:0;if(o=0,t&&d>=500){navigator.vibrate?.(18),t();return}if(!n){e?.();return}if(c++,c===1){l=setTimeout(()=>{c=0,e?.()},260);return}clearTimeout(l),c=0,n()};return i.addEventListener("pointerdown",p),i.addEventListener("click",h),i.addEventListener("contextmenu",d=>d.preventDefault()),()=>{clearTimeout(l),i.removeEventListener("pointerdown",p),i.removeEventListener("click",h)}}function T(i,e){if(!e)return"";let t=L(e.entity_id),n=e.attributes.device_class;return i.formatEntityState?.(e)??i.localize?.(`component.${t}.entity_component.${n??"_"}.state.${e.state}`)??i.localize?.(`component.${t}.entity_component._.state.${e.state}`)??e.state}function j(i,e,t){let n=Number(e);return Number.isFinite(n)?n.toLocaleString(i?.locale?.language??"nl",{minimumFractionDigits:t??0,maximumFractionDigits:t??0}):"--"}var De=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],Pe=["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec"],Ie=(i=new Date)=>new Date(i.getFullYear(),i.getMonth(),i.getDate()),ae=(i,e)=>Math.round((Ie(e)-Ie(i))/864e5);function K(i){if(!i)return null;if(i instanceof Date)return Number.isNaN(+i)?null:i;let e=String(i).trim(),t=e.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/);if(t)return new Date(+t[3],+t[2]-1,+t[1]);if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/),t)return new Date(+t[1],+t[2]-1,+t[3]);let n=new Date(e);return Number.isNaN(+n)?null:n}function re(i,e=new Date){if(!i)return"";let t=ae(e,i);return t<0?`${Math.abs(t)} dagen geleden`:t===0?"vandaag":t===1?"morgen":t===2?"overmorgen":t<=6?De[i.getDay()]:`${De[i.getDay()].slice(0,2)} ${i.getDate()} ${Pe[i.getMonth()]}`}var qe=i=>i?`${i.getDate()} ${Pe[i.getMonth()]}`:"";var Qe=`
  :host {
    ${P}
    display: block;
    font-family: var(--dac-font);
    color: var(--dac-ink);
    -webkit-font-smoothing: antialiased;
  }
  :host([hidden]) { display: none; }
`,A={accent:"var(--dac-accent-hi)",solar:"var(--dac-solar)",house:"var(--dac-house)",water:"var(--dac-grid-in)",magenta:"var(--dac-grid-out)",pink:"var(--dac-device-1)",teal:"var(--dac-device-2)",lit:"var(--dac-lit)",good:"var(--dac-good)",warn:"var(--dac-warn)",bad:"var(--dac-bad)",neutral:"var(--dac-ink-3)"},R={accent:"Accent",solar:"Oranje",house:"Blauw",water:"Lichtblauw",magenta:"Magenta",pink:"Roze",teal:"Groenblauw",lit:"Lampgeel",good:"Goed",warn:"Let op",bad:"Kritiek",neutral:"Neutraal"},$=(i,e="accent")=>A[i]??(i&&/[#(]|^var/.test(i)?i:A[e]),C=Symbol("incomplete"),et=i=>`
  <div class="needs">
    <span class="mark"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6"/>
      <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>
    </svg></span>
    <span><b>Nog niets gekozen</b><span>${i}</span></span>
  </div>`,tt=56,Re=8,H=i=>Math.max(1,Math.ceil((i+Re)/(tt+Re))),v=class extends HTMLElement{static css="";static get styleSheets_(){return Object.hasOwn(this,"sheets_")||(this.sheets_=[q(Qe+Ne+this.css)]),this.sheets_}constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=new.target.styleSheets_,this.built_=!1,this.wired_=!1,this.teardown_=[]}setConfig(e){let t=this.validate(e??{});this.config=t,this.built_&&(this.destroy_(),this.shadowRoot.replaceChildren(),this.built_=!1,this.wired_=!1),this.isConnected&&this.build_()}set hass(e){let t=this.hass_;if(this.hass_=e,!!this.config){if(!this.built_){this.build_();return}this.config[C]||He(t,e,this.watched())&&this.paint()}}get hass(){return this.hass_}connectedCallback(){if(this.config){if(!this.built_){this.build_();return}this.config[C]||this.wired_||(this.wire(),this.wired_=!0,this.hass_&&this.paint())}}disconnectedCallback(){this.destroy_(),this.wired_=!1}validate(e){return e}watched(){return this.config?.entity?[this.config.entity]:[]}template(){return""}wire(){}paint(){}build_(){let e=document.createElement("template"),t=this.config?.[C];e.innerHTML=t?et(t):this.template(),this.shadowRoot.appendChild(e.content),this.built_=!0,!t&&(this.wire(),this.wired_=!0,this.hass_&&this.paint())}destroy_(){for(let e of this.teardown_)try{e()}catch{}this.teardown_=[]}on(e,t,n,a){e&&(e.addEventListener(t,n,a),this.teardown_.push(()=>e.removeEventListener(t,n,a)))}$(e){return this.shadowRoot.querySelector(e)}$$(e){return[...this.shadowRoot.querySelectorAll(e)]}text(e,t){let n=typeof e=="string"?this.$(e):e;n&&n.textContent!==String(t)&&(n.textContent=t)}getCardSize(){return 1}};function y(i,e,{name:t,description:n,preview:a=!0}={}){customElements.get(i)||(customElements.define(i,e),window.customCards=window.customCards??[],window.customCards.push({type:i,name:t??i,description:n??"",preview:a,documentationURL:"https://github.com/Sven2410/domotiapp-cards"}))}function S(i,e){customElements.get(i)||customElements.define(i,e)}var s=(i,e="none")=>`<svg class="icon" viewBox="0 0 24 24" fill="${e}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${i}</svg>`,b={house:s(`<path d="M3.2 11.3 12 4.1l8.8 7.2"/>
    <path d="M5.4 12.9V20a.9.9 0 0 0 .9.9h11.4a.9.9 0 0 0 .9-.9v-7.1"/>
    <path d="M9.8 20.9v-5.2h4.4v5.2"/>`),floorB:s(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M9.4 17.8V14h2.4a1.9 1.9 0 0 1 0 3.8Z"/>`),floor1:s(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.6 15.2 12 14v3.9"/>`),floor2:s(`<path d="M3.4 10.6 12 4.2l8.6 6.4"/>
    <path d="M5.6 12.2v7.6a.9.9 0 0 0 .9.9h11a.9.9 0 0 0 .9-.9v-7.6"/>
    <path d="M10.4 14.8a1.6 1.6 0 0 1 3.1.5c0 1.4-3.1 1.8-3.1 3.5h3.2"/>`),garage:s(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M8.2 20.4v-5.6h7.6v5.6M8.2 17.6h7.6"/>`),garageOpen:s(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M7.6 14.4h8.8M7.6 12.4h8.8"/>`),garageClosed:s(`<path d="M3.4 10.8 12 5.2l8.6 5.6"/>
    <path d="M5.4 20.4v-9.1h13.2v9.1"/>
    <path d="M7.6 13.2h8.8M7.6 15.4h8.8M7.6 17.6h8.8M7.6 19.8h8.8"/>`),shutter:s(`<path d="M3.6 4.2h16.8M5.2 4.2v13.4M18.8 4.2v13.4"/>
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
    <path d="M9.6 9.6a2.4 2.4 0 1 1 3.2 2.3c-.5.2-.8.7-.8 1.2v.6M12 16.6v.1"/>`)};function x(i,e="question"){return i?b[i]?b[i]:i.includes(":")?`<ha-icon class="icon" icon="${i}"></ha-icon>`:b[e]??b.question:b[e]??b.question}function G(i,e={}){switch(String(i??"").split(".")[0]){case"light":return"bulb";case"switch":return"switchOn";case"cover":return e.device_class==="awning"||e.device_class==="blind"?"awning":"shutter";case"person":case"device_tracker":return"person";case"climate":return"thermo";case"binary_sensor":return e.device_class==="smoke"?"smoke":"shield";case"alarm_control_panel":return"shield";case"scene":case"script":case"input_button":case"button":return"star";case"weather":return"cloudSun";default:return"question"}}function Ve(i){switch(i){case"sunny":case"clear-night":return"sun";case"partlycloudy":return"cloudSun";case"cloudy":return"cloud";case"rainy":case"pouring":case"hail":case"lightning":case"lightning-rainy":return"rain";case"snowy":case"snowy-rainy":return"snow";case"fog":return"fog";case"windy":case"windy-variant":return"wind";default:return"cloud"}}var nt=[["Woning",["house","floorB","floor1","floor2","garage","door","window","grid"]],["Rolluiken",["shutter","shutterOpen","awning","garageOpen","garageClosed","arrowUp","arrowDown","stop"]],["Licht en stroom",["bulb","bulbGroup","switchOn","power","plug","bolt","battery"]],["Personen",["person","people","away"]],["Apparaten",["tv","speaker","camera","car","washer","dishwasher","printer","fan","airco","radio"]],["Afval",["bin","binWheeled","calendar"]],["Weer",["sun","cloud","cloudSun","rain","snow","fog","wind","drop","uv","sunrise","sunset","thermo"]],["Status",["shield","lock","lockOpen","key","wifi","smoke","warning","check","close","clock","gaugeArrow"]],["Overig",["star","moon","leaf","cog","dots","plus","minus","chevronRight","chevronDown","question"]]],it=`
  :host { ${P} display: block; font-family: var(--dac-font); }
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
`,oe=null,se=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),oe=oe??[q(it)],this.shadowRoot.adoptedStyleSheets=oe,this.value_="",this.label="Icoon",this.fallback="question",this.auto=!0}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        <button type="button" class="current" aria-expanded="false">
          <span class="preview"></span>
          <span class="who"><b></b><small></small></span>
          <span class="caret">${b.chevronDown}</span>
        </button>
        <div class="panel">
          ${nt.map(([t,n])=>`
            <div class="group">
              <h4>${t}</h4>
              <div class="grid">
                ${n.map(a=>`<button type="button" class="opt" data-icon="${a}" title="${a}" aria-pressed="false">${b[a]??""}</button>`).join("")}
              </div>
            </div>`).join("")}
          <div class="mdi">
            <label for="mdi">Of Home Assistant-icoon</label>
            <input id="mdi" type="text" placeholder="mdi:washing-machine" spellcheck="false" />
            <button type="button" class="clear">Wissen</button>
          </div>
        </div>
      </div>`,this.$(".current").addEventListener("click",()=>{let t=this.toggleAttribute("open");this.$(".current").setAttribute("aria-expanded",String(t))}),this.shadowRoot.querySelectorAll(".opt").forEach(t=>t.addEventListener("click",()=>this.emit_(t.dataset.icon)));let e=this.$("#mdi");e.addEventListener("change",()=>this.emit_(e.value.trim())),this.$(".clear").addEventListener("click",()=>this.emit_("")),this.paint_()}paint_(){if(!this.shadowRoot.firstElementChild)return;this.$(".label").textContent=this.label??"Icoon";let e=this.value_,t=e||this.fallback||"question";this.$(".preview").innerHTML=x(t,this.fallback),this.$(".who b").textContent=e||(this.auto?"Automatisch":"Kies een icoon"),this.$(".who small").textContent=e?e.includes(":")?"Home Assistant-icoon":"DomotiApp-icoon":this.auto?"Past zich aan de entiteit aan":"Nog niets gekozen",this.shadowRoot.querySelectorAll(".opt").forEach(r=>r.setAttribute("aria-pressed",String(r.dataset.icon===e)));let n=this.$("#mdi");if(this.shadowRoot.activeElement===n)return;let a=e&&e.includes(":")?e:"";n.value!==a&&(n.value=a)}emit_(e){this.value_=e,this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-icon-picker")||customElements.define("dac-icon-picker",se);var at=["accent","solar","house","water","magenta","pink","teal","lit","neutral"],rt=["good","warn","bad"],ot=`
  :host { ${P} display: block; font-family: var(--dac-font); }
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
`,ce=null,le=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),ce=ce??[q(ot)],this.shadowRoot.adoptedStyleSheets=ce,this.value_="",this.label="Kleur",this.statuses=!1}set value(e){this.value_=e??"",this.built_&&this.paint_()}get value(){return this.value_}connectedCallback(){this.built_||(this.built_=!0,this.build_())}swatch(e){return`<button type="button" class="sw" data-tone="${e}" style="--c:${A[e]}"
      title="${R[e]}" aria-label="${R[e]}" aria-pressed="false">${b.check}</button>`}build_(){this.shadowRoot.innerHTML=`
      <div class="label"></div>
      <div class="box">
        ${this.statuses?"<h4>Identiteit</h4>":""}
        <div class="row">
          <button type="button" class="sw auto" data-tone="" title="Automatisch"
            aria-label="Automatisch" aria-pressed="false">${b.check}</button>
          ${at.map(e=>this.swatch(e)).join("")}
        </div>
        ${this.statuses?`<h4>Status</h4>
               <div class="row">${rt.map(e=>this.swatch(e)).join("")}</div>
               <p class="note">
                 Statuskleuren betekenen iets: goed, let op, kritiek. Gebruik ze niet om
                 een kaart mooier te maken &mdash; dan zegt rood straks niets meer.
               </p>`:""}
        <div class="chosen"></div>
      </div>`,this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.addEventListener("click",()=>this.emit_(e.dataset.tone))),this.paint_()}paint_(){this.shadowRoot.firstElementChild&&(this.$(".label").textContent=this.label??"Kleur",this.shadowRoot.querySelectorAll(".sw").forEach(e=>e.setAttribute("aria-pressed",String((e.dataset.tone||"")===this.value_))),this.$(".chosen").innerHTML=this.value_?`Gekozen: <b>${R[this.value_]??this.value_}</b>`:"Gekozen: <b>Automatisch</b> &mdash; de kaart kiest op domein en toestand.")}emit_(e){this.value_=e??"",this.paint_(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value_},bubbles:!0,composed:!0}))}$(e){return this.shadowRoot.querySelector(e)}};customElements.get("dac-tone-picker")||customElements.define("dac-tone-picker",le);var m={entity:i=>({entity:i?{domain:i}:{}}),text:()=>({text:{}}),multiline:()=>({text:{multiline:!0}}),bool:()=>({boolean:{}}),number:(i,e,t=1)=>({number:{min:i,max:e,step:t,mode:"box"}}),select:i=>({select:{mode:"dropdown",options:i}}),action:(i="more-info")=>({ui_action:{default_action:i}})},de=(...i)=>({type:"grid",name:"",schema:i});var _=class extends HTMLElement{constructor(){super(),this.config_={},this.built_=!1}setConfig(e){this.config_={...this.defaults(),...e},this.render_()}defaults(){return{}}set hass(e){this.hass_=e,this.form_&&(this.form_.hass=e);for(let t of this.pickers_??[])t.hass=e;this.render_()}get hass(){return this.hass_}connectedCallback(){this.render_()}schema(){return[]}pickers(){return[]}label(e){return he[e.name]??e.name}helper(){}async render_(){if(!this.hass_||!this.config_)return;if(this.built_){this.sync_();return}this.built_=!0,await customElements.whenDefined("ha-form"),this.replaceChildren(),this.pickers_=[];let e=this.pickers();if(this.pickerSig_=e.map(n=>n.key).join("|"),e.length){let n=document.createElement("div");n.style.cssText="display:flex;flex-direction:column;gap:12px;margin-bottom:16px";for(let a of e){let r=document.createElement(a.kind==="tone"?"dac-tone-picker":"dac-icon-picker");r.label=a.label,r.fallback=a.fallback,a.auto===!1&&(r.auto=!1),a.statuses===!1&&(r.statuses=!1),r.hass=this.hass_,r.value=this.config_[a.key],r.addEventListener("value-changed",o=>{o.stopPropagation(),this.patch_({[a.key]:o.detail.value})}),this.pickers_.push(r),r.dataset.key=a.key,n.appendChild(r)}this.appendChild(n)}let t=document.createElement("ha-form");t.hass=this.hass_,t.data=this.config_,t.schema=this.schema(),t.computeLabel=n=>this.label(n),t.computeHelper=n=>this.helper(n),t.addEventListener("value-changed",n=>{n.stopPropagation(),this.patch_(n.detail.value,!0)}),this.form_=t,this.appendChild(t)}sync_(){let e=this.pickers().map(t=>t.key).join("|");if(this.pickerSig_!==void 0&&this.pickerSig_!==e){this.built_=!1,this.form_=null,this.render_();return}this.form_&&(this.form_.hass=this.hass_,this.form_.schema=this.schema(),this.form_.data=this.config_);for(let t of this.pickers_??[])t.hass=this.hass_,t.value=this.config_[t.dataset.key]}patch_(e,t=!1){let n=t?{...e}:{...this.config_,...e};this.config_.type&&(n.type=this.config_.type);for(let[a,r]of Object.entries(n))(r===""||r===void 0||r===null)&&delete n[a];this.config_=n,this.sync_(),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.serialize(n)},bubbles:!0,composed:!0}))}serialize(e){return e}},he={entity:"Entiteit",entities:"Entiteiten",name:"Naam",icon:"Icoon",tone:"Kleur",secondary:"Tweede regel",layout:"Vorm",tap_action:"Tikken",hold_action:"Vasthouden",double_tap_action:"Dubbeltikken",show_state:"Toestand tonen",show_name:"Naam tonen",show_icon:"Icoon tonen",fill:"Vullen",collapsible:"Inklapbaar",title:"Titel",subtitle:"Ondertitel",weather:"Weerentiteit",sun:"Zon-entiteit",person:"Persoon",persons:"Personen",covers:"Rolluiken",lights:"Lampen",sensors:"Sensoren",greeting:"Begroeting",show_clock:"Klok tonen",show_weather:"Weer tonen",show_chips:"Weerdetails tonen",compact:"Compact",columns:"Kolommen",group:"Groepsregel tonen",invert:"Open en dicht omdraaien",label:"Label",color:"Kleur",date_format:"Datumnotatie"};function st(i=new Date){let e=i.getHours();return e<6?"Goedenacht":e<12?"Goedemorgen":e<18?"Goedemiddag":"Goedenavond"}var ct=["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],lt=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"],pe={humidity:{icon:"drop",tone:"water",label:"Luchtvochtigheid"},wind:{icon:"wind",tone:"neutral",label:"Wind"},uv:{icon:"uv",tone:"solar",label:"UV-index"},precipitation:{icon:"rain",tone:"water",label:"Neerslag"},pressure:{icon:"gaugeArrow",tone:"neutral",label:"Luchtdruk"},sunrise:{icon:"sunrise",tone:"warn",label:"Zonsopkomst"},sunset:{icon:"sunset",tone:"warn",label:"Zonsondergang"}},dt=["humidity","wind","uv","precipitation","sunset"],ht=i=>i==null||Number.isNaN(+i)?"":["N","NO","O","ZO","Z","ZW","W","NW"][Math.round(+i/45)%8],ue=class extends v{static css=`
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
      </div>`}wire(){let e=()=>{let n=6e4-Date.now()%6e4+50;this.timer_=setTimeout(()=>{this.paintClock_(),e()},n)};e(),this.teardown_.push(()=>clearTimeout(this.timer_));let t=Number(this.config.hide_below)||0;if(t>0){let n=matchMedia(`(max-width: ${t-1}px)`),a=()=>this.toggleAttribute("narrow",n.matches);a(),n.addEventListener("change",a),this.teardown_.push(()=>n.removeEventListener("change",a))}}paintClock_(){let e=new Date,t=this.config.name??this.hass?.user?.name??"",n=st(e);this.$(".hello").innerHTML=t?`${n}, <b>${t}</b>`:n,this.text(".date",`${ct[e.getDay()]} ${e.getDate()} ${lt[e.getMonth()]}`);let a=this.$(".clock");a&&this.text(a,e.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"}))}paint(){this.paintClock_();let e=this.config,t=f(this.hass,e.weather),n=w(this.hass,e.weather),a=this.$(".now");if(a&&t){let l=Ve(t.state);a.style.setProperty("--wtone",$(e.tone,"water"));let p=this.hass?.config?.unit_system?.temperature??"\xB0C";this.$(".temp").innerHTML=n.temperature!=null?`${j(this.hass,n.temperature,0)}<span>${p}</span>`:"--";let h=a.querySelector(".ic");h.dataset.icon!==l&&(h.dataset.icon=l,h.innerHTML=x(l,"cloud")),this.text(a.querySelector(".cond"),T(this.hass,t))}let r=this.$(".chips");if(!r)return;let o=dt.map(l=>this.chip_(l,n)).filter(Boolean),c=o.map(l=>`${l.key}${l.value}`).join("|");r.dataset.sig!==c&&(r.dataset.sig=c,r.innerHTML=o.map(l=>`<span class="chip2" style="--tone:${$(pe[l.key].tone)}" title="${pe[l.key].label}">
             ${b[pe[l.key].icon]??""}${l.value}
           </span>`).join(""))}chip_(e,t){let n=this.config;switch(e){case"humidity":return t.humidity!=null?{key:e,value:`${Math.round(t.humidity)}%`}:null;case"wind":{if(t.wind_speed==null)return null;let a=this.hass?.config?.unit_system?.wind_speed??"km/h",r=ht(t.wind_bearing);return{key:e,value:`${j(this.hass,t.wind_speed,0)} ${a}${r?` ${r}`:""}`}}case"uv":{let r=w(this.hass,n.weather_uv).uv_index??t.uv_index??(n.weather_uv?Number(f(this.hass,n.weather_uv)?.state):null);return r!=null&&!Number.isNaN(+r)?{key:e,value:`UV ${j(this.hass,r,1)}`}:null}case"precipitation":{let a=f(this.hass,n.precipitation_entity);if(a){let r=Number(a.state);if(Number.isNaN(r))return null;let o=a.attributes.unit_of_measurement??"mm";return{key:e,value:`${j(this.hass,r,1)} ${o}`}}return t.precipitation!=null&&!Number.isNaN(+t.precipitation)?{key:e,value:`${j(this.hass,t.precipitation,1)} mm`}:null}case"pressure":return t.pressure!=null?{key:e,value:`${j(this.hass,t.pressure,0)} ${t.pressure_unit??"hPa"}`}:null;case"sunset":case"sunrise":{let r=f(this.hass,n.sun)?.attributes?.[e==="sunset"?"next_setting":"next_rising"];if(!r)return null;let o=new Date(r);return Number.isNaN(+o)?null:{key:e,value:o.toLocaleTimeString(this.hass?.locale?.language??"nl",{hour:"2-digit",minute:"2-digit"})}}default:return null}}getCardSize(){return 2}getGridOptions(){return{columns:"full",rows:2,min_rows:2,max_rows:2}}static getConfigElement(){return document.createElement("domotiapp-header-card-editor")}static getStubConfig(e){return{weather:Object.keys(e?.states??{}).find(n=>n.startsWith("weather.")),sun:"sun.sun"}}},me=class extends _{defaults(){return{show_clock:!0,show_weather:!0,show_chips:!0,show_rule:!0,hide_below:768}}pickers(){return[{key:"tone",kind:"tone",label:"Kleur weericoon"}]}schema(){return[de({name:"weather",selector:m.entity("weather")},{name:"weather_uv",selector:{entity:{domain:["weather","sensor"]}}}),de({name:"sun",selector:m.entity("sun")},{name:"precipitation_entity",selector:m.entity("sensor")}),{name:"name",selector:m.text()},{name:"hide_below",selector:m.number(0,1400,8)}]}label(e){return{weather:"Weer (temperatuur, wind)",weather_uv:"Tweede weerbron (UV-index)",precipitation_entity:"Neerslagsensor",show_rule:"Accentlijn tonen",hide_below:"Verbergen onder breedte (px)",bare:"Zonder kaartrand",name:"Naam"}[e.name]??super.label(e)}helper(e){if(e.name==="weather_uv")return"Alleen voor de UV-index. Handig als je hoofdbron die niet meelevert.";if(e.name==="precipitation_entity")return"Een sensor in mm of mm/h, bijvoorbeeld neerslagintensiteit of regen laatste uur.";if(e.name==="hide_below")return"768 verbergt de header op telefoons en houdt hem op tablets en desktops. 0 zet het uit.";if(e.name==="name")return"Leeg laten voor de naam van de ingelogde gebruiker."}};S("domotiapp-header-card-editor",me);y("domotiapp-header-card",ue,{name:"DomotiApp Header",description:"Smalle strip met begroeting, weer en klok. Verbergt zichzelf op telefoons."});var ge=class extends v{static css=`
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
        ${t?`<span class="chip">${x(e.icon,"star")}</span>`:""}
        <h3></h3>
        ${e.line===!1?"":'<span class="rule"></span>'}
        <span class="sub"><span class="si"></span><span class="sv"></span></span>
      </div>`}paint(){this.text("h3",this.config.name??"");let e=this.$(".sub");if(!e)return;let t=f(this.hass,this.config.secondary_entity),n=e.querySelector(".si"),a=e.querySelector(".sv");if(!t){a.textContent="",n.innerHTML="";return}let r=this.config.secondary_icon??"";n.dataset.icon!==r&&(n.dataset.icon=r,n.innerHTML=r?x(r):"");let o=t.attributes.unit_of_measurement;a.textContent=o?`${t.state} ${o}`:t.attributes.current_temperature!=null?`${t.attributes.current_temperature} \xB0C`:T(this.hass,t)}getCardSize(){return 1}getGridOptions(){return{columns:"full",rows:1,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-separator-card-editor")}static getStubConfig(){return{name:"Nieuwe sectie",icon:"house",tone:"accent"}}},fe=class extends _{defaults(){return{line:!0,tone:"accent"}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon links",fallback:"star",auto:!1},{key:"tone",kind:"tone",label:he.tone},{key:"secondary_icon",kind:"icon",label:"Icoon bij de waarde rechts",auto:!1}]}schema(){return[{name:"name",selector:m.text()},{name:"line",selector:m.bool()},{name:"secondary_entity",selector:m.entity()}]}label(e){return{line:"Lijn tonen",secondary_entity:"Waarde rechts (optioneel)"}[e.name]??super.label(e)}helper(e){if(e.name==="secondary_entity")return"Toont de toestand van deze entiteit rechts van de lijn, bijvoorbeeld een temperatuur of een aantal."}};S("domotiapp-separator-card-editor",fe);y("domotiapp-separator-card",ge,{name:"DomotiApp Separator",description:"Sectiekop met icoon en vervagende lijn."});var be=class extends v{static css=`
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

    /* Onder elkaar, niet achter elkaar. Dit waren inline-spans in een gewone
       blokcontainer, en dan lopen naam en toestand op \xE9\xE9n regel door -- wat
       precies het verschil was met de licht-, klimaat- en entiteitenkaart. */
    .txt { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; }
    .nm {
      font-size: 13.5px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st {
      font-size: 11.5px; line-height: 1.25; color: var(--dac-ink-2);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      font-variant-numeric: tabular-nums;
    }

    /* ---- row: the default. A pill you can put six of in a column. ---- */
    :host([layout="row"]) .btn { min-height: 56px; padding: 7px 12px; gap: 11px; }
    :host([layout="row"]) .chip { width: 40px; height: 40px; }
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

  `;validate(e){return{layout:"row",show_state:!0,show_name:!0,show_icon:!0,...e}}watched(){return[this.config.entity].filter(Boolean)}tone_(){let e=this.config;if(e.tone)return $(e.tone);if(L(e.entity)!=="light")return A.accent;let t=f(this.hass,e.entity),n=t?.state==="on"?t.attributes?.rgb_color:null;return n?`rgb(${n[0]},${n[1]},${n[2]})`:A.lit}template(){let e=this.config;return this.setAttribute("layout",["row","tile","compact"].includes(e.layout)?e.layout:"row"),`
      <div class="btn" role="button" tabindex="0" style="--tone:${this.tone_()}">
        <span class="wash"></span>
        ${e.show_icon===!1?"":'<span class="chip" role="button" tabindex="0"></span>'}
        <span class="txt">
          ${e.show_name===!1?"":'<span class="nm"></span>'}
          ${e.show_state===!1?"":'<span class="st"></span>'}
        </span>
      </div>`}wire(){let e=this.config,t=(a,r)=>Q(this,this.hass,e,e[a]??r);this.teardown_.push(z(this.$(".btn"),{onTap:()=>t("tap_action",{action:e.entity?"more-info":"none"}),onHold:()=>t("hold_action",{action:e.entity?"more-info":"none"}),onDouble:e.double_tap_action?()=>t("double_tap_action",{action:"none"}):void 0}));let n=this.$(".chip");n&&(this.teardown_.push(z(n,{onTap:a=>t("icon_tap_action",J(e.entity)),onHold:()=>t("icon_hold_action",{action:e.entity?"more-info":"none"})})),this.on(n,"click",a=>a.stopPropagation()),this.on(n,"pointerdown",a=>a.stopPropagation()))}paint(){let e=this.config,t=f(this.hass,e.entity),n=Y(t),a=!!e.entity&&D(t);this.toggleAttribute("on",n),this.$(".btn").classList.toggle("unavailable",a),this.$(".btn").style.setProperty("--tone",this.tone_());let r=this.$(".chip");if(r){let c=e.icon||G(e.entity,w(this.hass,e.entity));r.dataset.icon!==c&&(r.dataset.icon=c,r.innerHTML=x(c)),r.style.setProperty("--tone",n?this.tone_():"var(--dac-ink-3)"),r.setAttribute("aria-label",e.entity?`${M(this.hass,e.entity,e.name)} schakelen`:"Icoon")}this.text(".nm",M(this.hass,e.entity,e.name));let o=this.$(".st");o&&this.text(o,this.secondary_(t,a)),this.$(".btn").setAttribute("aria-label",`${M(this.hass,e.entity,e.name)}${t?`, ${T(this.hass,t)}`:""}`)}secondary_(e,t){return t?"Niet bereikbaar":!e||B(e.entity_id)?"":L(e.entity_id)==="light"&&e.state==="on"&&e.attributes.brightness!=null?`${Math.round(e.attributes.brightness/255*100)}%`:T(this.hass,e)}getCardSize(){return this.config?.layout==="tile"?2:1}getGridOptions(){return this.config?.layout==="tile"?{columns:6,rows:2,min_columns:3,min_rows:2,max_rows:2}:{columns:12,rows:1,min_columns:4,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-button-card-editor")}static getStubConfig(e,t){return{entity:t?.find(a=>a.startsWith("light."))??t?.find(a=>a.startsWith("switch."))??t?.[0],layout:"row"}}},ve=class extends _{defaults(){return{layout:"row",show_state:!0,show_name:!0,show_icon:!0,icon_tap_action:{action:"toggle"},tap_action:{action:"more-info"}}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon",fallback:"star"},{key:"tone",kind:"tone",label:"Kleur"}]}schema(){return[{name:"entity",selector:m.entity()},{name:"name",selector:m.text()},{name:"layout",selector:m.select([{value:"row",label:"Rij"},{value:"tile",label:"Tegel"},{value:"compact",label:"Compact"}])},{name:"show_icon",selector:m.bool()},{name:"show_name",selector:m.bool()},{name:"show_state",selector:m.bool()},{name:"icon_tap_action",selector:m.action("toggle")},{name:"icon_hold_action",selector:m.action("more-info")},{name:"tap_action",selector:m.action("more-info")},{name:"hold_action",selector:m.action("more-info")},{name:"double_tap_action",selector:m.action("none")}]}label(e){return{entity:"Entiteit",name:"Naam (overschrijft die van de entiteit)",layout:"Vorm",show_icon:"Icoon tonen",show_name:"Naam tonen",show_state:"Toestand tonen",icon_tap_action:"Tikken op het icoon",icon_hold_action:"Vasthouden op het icoon",tap_action:"Tikken op de kaart",hold_action:"Vasthouden op de kaart",double_tap_action:"Dubbeltikken op de kaart"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"Mag leeg blijven: zonder entiteit wordt dit een navigatieknop.";if(e.name==="icon_tap_action")return"Handig: het icoon schakelt de lichtgroep, de kaart navigeert naar de ruimte.";if(e.name==="tap_action")return"Wat er gebeurt als je naast het icoon tikt, bijvoorbeeld navigeren naar een pop-up."}};S("domotiapp-button-card-editor",ve);y("domotiapp-button-card",be,{name:"DomotiApp Knop",description:"E\xE9n control als rij, tegel of compacte pil. Vervangt tile, mushroom-entity en bubble-knoppen."});var xe=(i,e,t)=>Math.min(t,Math.max(e,i));function ee(i,e){let t=e.min??0,n=e.max??100,a=e.step??1,r=!1,o=u=>{let N=i.getBoundingClientRect();if(!N.width)return t;let E=xe((u-N.left)/N.width,0,1),O=t+E*(n-t);return xe(Math.round(O/a)*a,t,n)},c=u=>{try{i.setPointerCapture?.(u)}catch{}},l=u=>{try{i.hasPointerCapture?.(u)&&i.releasePointerCapture(u)}catch{}},p=u=>{e.disabled?.()||u.button!=null&&u.button!==0||(r=!0,c(u.pointerId),i.classList.add("dragging"),e.onInput(o(u.clientX)),u.preventDefault())},h=u=>{r&&(e.onInput(o(u.clientX)),u.preventDefault())},d=u=>{r&&(r=!1,l(u.pointerId),i.classList.remove("dragging"),e.onCommit(o(u.clientX)))},g=u=>{r&&(r=!1,l(u?.pointerId),i.classList.remove("dragging"),e.onInput(e.value()))},k=u=>{if(e.disabled?.())return;let N=(n-t)/10,E={ArrowLeft:-a,ArrowDown:-a,ArrowRight:a,ArrowUp:a,PageDown:-N,PageUp:N,Home:-1/0,End:1/0};if(!(u.key in E))return;u.preventDefault();let O=e.value(),Z=xe(E[u.key]===-1/0?t:E[u.key]===1/0?n:O+E[u.key],t,n);e.onInput(Z),e.onCommit(Z)};return i.addEventListener("pointerdown",p),i.addEventListener("pointermove",h),i.addEventListener("pointerup",d),i.addEventListener("pointercancel",g),i.addEventListener("keydown",k),()=>{i.removeEventListener("pointerdown",p),i.removeEventListener("pointermove",h),i.removeEventListener("pointerup",d),i.removeEventListener("pointercancel",g),i.removeEventListener("keydown",k)}}var V=(i="")=>`
  <div class="slider ${i}" role="slider" tabindex="0"
       aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
    <div class="track"><div class="fill"></div></div>
    <div class="thumb"></div>
  </div>`,te=`
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
`;var pt=new Set(["brightness","color_temp","hs","rgb","rgbw","rgbww","xy","white"]),ut=new Set(["hs","rgb","rgbw","rgbww","xy"]),_e=i=>i?.attributes?.supported_color_modes??[],mt=i=>_e(i).some(e=>pt.has(e)),ne=i=>_e(i).some(e=>ut.has(e)),ie=i=>_e(i).includes("color_temp"),We=i=>Math.max(1,Math.round((i??0)/255*100)),we=class extends v{static css=`
    :host { display: block; }

    .card {
      min-height: 56px; padding: 7px 12px;
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

    ${te}

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
  `;validate(e){let t=e.entity??e.lights?.[0]??e.entities?.[0],n=typeof t=="string"?t:t?.entity;return n?{show_colour:!0,...e,entity:n}:{...e,[C]:"Kies een lamp."}}watched(){return[this.config.entity]}template(){return this.config.bare&&this.setAttribute("bare",""),`
      <div class="card surface">
        <div class="lamp" data-on="false" style="--tone:var(--dac-lit)">
          <button class="chip" type="button" aria-label="Aan of uit"></button>
          <span class="txt"><span class="nm"></span><span class="v tnum"></span></span>
          <span class="ctl" style="display:contents"></span>
        </div>
        <div class="colour" hidden></div>
      </div>`}wire(){let e=this.config.entity;this.teardown_.push(z(this.$(".chip"),{onTap:()=>this.hass.callService("light","toggle",{entity_id:e}),onHold:()=>I(this,e)})),this.on(this.$(".card"),"click",t=>{t.target.closest(".toggle")&&this.hass.callService("light","toggle",{entity_id:e})}),this.sliders_=new Map}attach_(e,t,n){if(!e||this.sliders_.has(t))return;let a=ee(e,n);this.sliders_.set(t,a),this.teardown_.push(a)}setSlider_(e,t,n=0,a=100){if(!e)return;let r=a>n?(t-n)/(a-n)*100:0;e.style.setProperty("--v",`${r}%`),e.setAttribute("aria-valuemin",String(n)),e.setAttribute("aria-valuemax",String(a)),e.setAttribute("aria-valuenow",String(t))}paint(){let e=this.config,t=f(this.hass,e.entity),n=D(t),a=t?.state==="on",r=this.$(".lamp");r.dataset.on=String(a),r.classList.toggle("unavailable",n);let o=this.$(".chip"),c=e.icon||"bulb";o.dataset.icon!==c&&(o.dataset.icon=c,o.innerHTML=x(c,"bulb")),this.text(".nm",M(this.hass,e.entity,e.name));let l=a?t?.attributes?.rgb_color:null;r.style.setProperty("--tone",l?`rgb(${l[0]},${l[1]},${l[2]})`:"var(--dac-lit)");let p=this.$(".ctl"),h=n?"none":mt(t)?"range":"toggle";if(p.dataset.kind!==h&&(p.dataset.kind=h,p.innerHTML=h==="range"?V("brightness"):h==="toggle"?'<button class="toggle" type="button" role="switch" aria-checked="false" aria-label="Aan of uit"></button>':"",this.sliders_.delete("brightness")),h==="range"){let d=p.querySelector(".slider");if(this.attach_(d,"brightness",{value:()=>t?.state==="on"?We(f(this.hass,e.entity)?.attributes?.brightness):0,onInput:g=>{this.setSlider_(d,g),this.text(".v",g===0?"Uit":`${g}%`)},onCommit:g=>{g===0?this.hass.callService("light","turn_off",{entity_id:e.entity}):this.hass.callService("light","turn_on",{entity_id:e.entity,brightness_pct:g})},disabled:()=>D(f(this.hass,e.entity))}),!d.classList.contains("dragging")){let g=a?We(t.attributes.brightness):0;this.setSlider_(d,g),this.text(".v",a?`${g}%`:"Uit")}}else h==="toggle"?(p.querySelector(".toggle")?.setAttribute("aria-checked",String(a)),this.text(".v",a?"Aan":"Uit")):this.text(".v","Niet bereikbaar");this.paintColour_(t,a)}paintColour_(e,t){let n=this.$(".colour"),a=this.config.show_colour!==!1&&(ne(e)||ie(e));if(n.hidden=!(a&&t),!a)return;let r=`${ne(e)?"c":""}${ie(e)?"t":""}`;if(n.dataset.sig!==r){n.dataset.sig=r,n.innerHTML=(ne(e)?`<span data-kind="hue" style="display:contents">${V("hue")}</span>`:"")+(ie(e)?`<span data-kind="kelvin" style="display:contents">${V("kelvin")}</span>`:"");let p=n.querySelector(".slider.hue");p&&(p.dataset.strip="",p.style.setProperty("--strip","linear-gradient(90deg, hsl(0 90% 55%), hsl(60 90% 55%), hsl(120 90% 55%), hsl(180 90% 55%), hsl(240 90% 55%), hsl(300 90% 55%), hsl(360 90% 55%))"),p.setAttribute("aria-label","Kleur"));let h=n.querySelector(".slider.kelvin");h&&(h.dataset.strip="",h.style.setProperty("--strip","linear-gradient(90deg,#ffb15e,#ffd6a8,#fff5e8,#eaf1ff,#cbdcff)"),h.setAttribute("aria-label","Kleurtemperatuur")),this.sliders_.delete("hue"),this.sliders_.delete("kelvin")}if(!t)return;let o=this.config.entity,c=n.querySelector(".slider.hue");c&&(this.attach_(c,"hue",{min:0,max:360,value:()=>f(this.hass,o)?.attributes?.hs_color?.[0]??0,onInput:p=>this.setSlider_(c,p,0,360),onCommit:p=>{let h=f(this.hass,o)?.attributes?.hs_color?.[1]??100;this.hass.callService("light","turn_on",{entity_id:o,hs_color:[p,h]})}}),c.classList.contains("dragging")||this.setSlider_(c,Math.round(e.attributes.hs_color?.[0]??0),0,360));let l=n.querySelector(".slider.kelvin");if(l){let p=e.attributes.min_color_temp_kelvin??2e3,h=e.attributes.max_color_temp_kelvin??6500;if(this.attach_(l,"kelvin",{min:p,max:h,step:50,value:()=>f(this.hass,o)?.attributes?.color_temp_kelvin??p,onInput:d=>this.setSlider_(l,d,p,h),onCommit:d=>this.hass.callService("light","turn_on",{entity_id:o,color_temp_kelvin:d})}),!l.classList.contains("dragging")){let d=e.attributes.color_temp_kelvin;d!=null&&this.setSlider_(l,d,p,h)}}}getCardSize(){let e=f(this.hass,this.config?.entity);return e?.state==="on"&&(ne(e)||ie(e))?2:1}getGridOptions(){return{columns:12,rows:"auto",min_columns:4,min_rows:1}}static getConfigElement(){return document.createElement("domotiapp-light-card-editor")}static getStubConfig(e,t){let n=t?.find(a=>a.startsWith("light."));return n?{entity:n}:{}}},ye=class extends _{defaults(){return{show_colour:!0}}pickers(){return[{key:"icon",kind:"icon",label:"Icoon",fallback:"bulb"}]}schema(){return[{name:"entity",selector:m.entity("light")},{name:"name",selector:m.text()},{name:"show_colour",selector:m.bool()}]}label(e){return{entity:"Lamp",name:"Naam (overschrijft die van de lamp)",show_colour:"Kleurstrips tonen"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"E\xE9n lamp per kaart. Dimbaar krijgt een schuif, alleen schakelbaar een tuimelaar.";if(e.name==="show_colour")return"Kleur en kleurtemperatuur verschijnen zodra de lamp aan is. De kaart is dan twee rijen hoog."}};S("domotiapp-light-card-editor",ye);y("domotiapp-light-card",we,{name:"DomotiApp Verlichting",description:"E\xE9n lamp op \xE9\xE9n rasterrij: dimmen, kleur en kleurtemperatuur."});function Be(i){if(!i)return null;let e=Number(i.state);return Number.isFinite(e)?e:null}function gt(i){let e=i?.attributes?.hvac_action;return e||(i?.state==="off"?"off":i?.state==="cool"?"cooling":i?.state==="heat"?"idle":null)}var ke={heating:"var(--dac-solar)",cooling:"var(--dac-grid-in)",drying:"var(--dac-grid-in)",fan:"var(--dac-grid-in)"},Ke={heating:"Verwarmt",cooling:"Koelt",drying:"Ontvochtigt",fan:"Ventileert",idle:"Uit",off:"Uit"},Me=class extends v{static css=`
    :host { display: block; height: 100%; }

    .card {
      height: 100%; min-height: 56px; padding: 7px 12px;
      display: flex; align-items: center; gap: 11px;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .chip {
      width: 40px; height: 40px; flex: 0 0 auto; cursor: pointer;
      transition: color 220ms ease, background 220ms ease,
                  border-color 220ms ease, box-shadow 220ms ease;
    }
    .chip .icon, .chip ha-icon { width: 20px; height: 20px; --mdc-icon-size: 20px; }
    /* Alleen als er echt iets gebeurt gloeit het icoon. "Aan maar niets aan het
       doen" is de normale toestand van een thermostaat en hoort stil te zijn. */
    :host([busy]) .chip {
      box-shadow: 0 0 14px -2px color-mix(in srgb, var(--tone) 55%, transparent);
    }

    .txt { min-width: 0; flex: 1 1 auto; display: flex; flex-direction: column; }
    .nm {
      font-size: 13.5px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .read {
      display: flex; align-items: center; gap: 7px;
      font-size: 11.5px; line-height: 1.25; color: var(--dac-ink-2);
      font-variant-numeric: tabular-nums;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .read .sep { color: var(--dac-ink-3); }
    .read .hum { display: inline-flex; align-items: center; gap: 4px; }
    .read .hum .icon { width: 12px; height: 12px; color: var(--dac-grid-in); }
    .read .hum:empty { display: none; }

    /* Zonder thermostaat is de meting het onderwerp, dus die mag groter. */
    :host([readout]) .read { font-size: 15px; color: var(--dac-ink); }
    :host([readout]) .read .hum .icon { width: 14px; height: 14px; }

    /* ---- stelknop ---- */
    .set {
      flex: 0 0 auto; display: inline-flex; align-items: center; gap: 2px; padding: 3px;
      background: rgba(255,255,255,.05); border: 1px solid var(--dac-border);
      border-radius: var(--dac-radius-pill);
    }
    .set button {
      width: 32px; height: 32px; display: grid; place-items: center; padding: 0; cursor: pointer;
      border: 0; background: transparent; color: var(--dac-ink-2);
      border-radius: var(--dac-radius-pill);
      transition: background 180ms ease, color 180ms ease;
    }
    .set button:hover { color: var(--dac-ink); background: rgba(255,255,255,.08); }
    .set button:active { background: rgba(255,255,255,.14); }
    .set button:disabled { opacity: .3; cursor: default; }
    .set button .icon { width: 16px; height: 16px; }
    .set .target {
      min-width: 44px; text-align: center;
      font-size: 14.5px; font-weight: 500; letter-spacing: -.01em;
      font-variant-numeric: tabular-nums; color: var(--dac-ink);
    }
    /* Terwijl je tikt loopt het getal voor op de ketel. Dat mag je zien. */
    .set .target.pending { color: var(--tone); }

    :host([dead]) .card { opacity: .42; }
    :host([dead]) .set { pointer-events: none; }
  `;validate(e){return e.entity||e.temperature||e.humidity?{...e}:{...e,[C]:"Kies een thermostaat, of een temperatuursensor."}}watched(){let e=this.config;return[e.entity,e.temperature,e.humidity].filter(Boolean)}step_(){let e=w(this.hass,this.config.entity);return Number(this.config.step??e.target_temp_step)||.5}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),e.entity||this.setAttribute("readout",""),`
      <div class="card surface">
        <button class="chip" type="button" aria-label="Meer info"></button>
        <div class="txt">
          <div class="nm"></div>
          <div class="read">
            <span class="temp"></span>
            <span class="sep"></span>
            <span class="hum"></span>
          </div>
        </div>
        ${e.entity?`<div class="set">
                 <button type="button" data-d="-1" aria-label="Lager">${b.minus}</button>
                 <span class="target tnum"></span>
                 <button type="button" data-d="1" aria-label="Hoger">${b.plus}</button>
               </div>`:""}
      </div>`}wire(){let e=this.config;this.teardown_.push(()=>clearTimeout(this.sendTimer_)),this.teardown_.push(z(this.$(".chip"),{onTap:()=>I(this,e.entity||e.temperature||e.humidity)}));let t=this.$(".set");t&&t.querySelectorAll("button").forEach(n=>this.on(n,"click",()=>this.nudge_(Number(n.dataset.d))))}nudge_(e){let t=this.config,n=w(this.hass,t.entity),a=this.step_(),r=Number(n.min_temp??5),o=Number(n.max_temp??35),c=this.pending_??Number(n.temperature);if(!Number.isFinite(c))return;let l=Math.min(o,Math.max(r,Math.round((c+e*a)/a)*a));this.pending_=l,this.paintTarget_(),clearTimeout(this.sendTimer_),this.sendTimer_=setTimeout(()=>{this.sendTimer_=null,this.hass.callService("climate","set_temperature",{entity_id:t.entity,temperature:this.pending_}),setTimeout(()=>{this.pending_=null,this.paint()},1500)},450)}paintTarget_(){let e=this.$(".target");if(!e)return;let t=w(this.hass,this.config.entity),n=this.pending_??Number(t.temperature);e.classList.toggle("pending",this.pending_!=null),e.textContent=Number.isFinite(n)?`${j(this.hass,n,n%1?1:0)}\xB0`:"--"}paint(){let e=this.config,t=e.entity?f(this.hass,e.entity):null,n=e.entity?D(t):!1;this.toggleAttribute("dead",n);let a=gt(t),r=e.tone?$(e.tone):ke[a]??"var(--dac-ink-3)";this.$(".card").style.setProperty("--tone",r),this.toggleAttribute("busy",!!ke[a]);let o=this.$(".chip"),c=e.icon||"thermo";o.dataset.icon!==c&&(o.dataset.icon=c,o.innerHTML=x(c,"thermo")),o.style.setProperty("--tone",ke[a]?r:"var(--dac-ink-3)"),this.text(".nm",M(this.hass,e.entity||e.temperature||e.humidity,e.name));let l=e.temperature?Be(f(this.hass,e.temperature)):Number(w(this.hass,e.entity).current_temperature),p=this.hass?.config?.unit_system?.temperature??"\xB0C";this.text(".temp",Number.isFinite(l)?`${j(this.hass,l,1)} ${p}`:"--");let h=e.humidity?Be(f(this.hass,e.humidity)):null,d=this.$(".hum");d.innerHTML=h==null?"":`${b.drop}${j(this.hass,h,0)}%`,this.text(".sep",h==null?"":"\xB7"),e.entity&&!e.humidity&&Ke[a]&&a!=="idle"&&(this.text(".sep","\xB7"),d.textContent=Ke[a]),this.paintTarget_();let g=this.$(".set");if(g){let k=w(this.hass,e.entity),u=this.pending_??Number(k.temperature);g.querySelector('[data-d="-1"]').disabled=n||u<=Number(k.min_temp??5),g.querySelector('[data-d="1"]').disabled=n||u>=Number(k.max_temp??35)}}getCardSize(){return 1}getGridOptions(){return{columns:12,rows:1,min_columns:4,min_rows:1,max_rows:1}}static getConfigElement(){return document.createElement("domotiapp-climate-card-editor")}static getStubConfig(e,t){let n=t?.find(a=>a.startsWith("climate."));return n?{entity:n}:{}}},$e=class extends _{pickers(){return[{key:"icon",kind:"icon",label:"Icoon",fallback:"thermo"},{key:"tone",kind:"tone",label:"Vaste kleur (leeg = volgt de ketel)"}]}schema(){return[{name:"entity",selector:m.entity("climate")},{name:"temperature",selector:{entity:{domain:"sensor",device_class:"temperature"}}},{name:"humidity",selector:{entity:{domain:"sensor",device_class:"humidity"}}},{name:"name",selector:m.text()},{name:"step",selector:m.number(.1,5,.1)}]}label(e){return{entity:"Thermostaat (optioneel)",temperature:"Temperatuursensor (optioneel)",humidity:"Vochtigheidssensor (optioneel)",name:"Naam",step:"Stap van de knoppen"}[e.name]??super.label(e)}helper(e){if(e.name==="entity")return"Leeg laten voor een kaart die alleen meet. Met thermostaat komen de stelknoppen erbij.";if(e.name==="temperature")return"Wint van de meting van de thermostaat zelf. Handig als er een betere sensor in de kamer hangt.";if(e.name==="step")return"Leeg laten volgt de thermostaat, en anders een halve graad."}};S("domotiapp-climate-card-editor",$e);y("domotiapp-climate-card",Me,{name:"DomotiApp Klimaat",description:"Thermostaat, losse temperatuur- en vochtsensor, of allebei."});var Ge=i=>Math.min(Math.max(1,Number(i)||2),3),Ue=i=>typeof i=="string"?{entity:i}:{...i};function ft(i){if(Array.isArray(i.rows)&&i.rows.length)return i.rows.map(t=>({columns:Ge(t.columns),items:(t.items??t.entities??[]).map(Ue)}));let e=(i.items??i.entities??[]).map(Ue);return e.length?[{columns:Ge(i.columns),items:e}]:[]}var bt=`
  .dac-ed { display: flex; flex-direction: column; gap: 14px; }
  .dac-ed .rij {
    border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden;
    background: var(--card-background-color);
  }
  .dac-ed .kop {
    display: flex; align-items: center; gap: 10px; padding: 8px 10px 8px 14px;
    border-bottom: 1px solid var(--divider-color);
  }
  .dac-ed .kop b { font-size: 13px; font-weight: 600; flex: 1 1 auto; }
  .dac-ed .kolommen { display: inline-flex; gap: 2px; padding: 3px;
    background: rgba(127,127,127,.12); border-radius: 999px; }
  .dac-ed .kolommen button {
    min-width: 30px; height: 26px; padding: 0 8px; cursor: pointer;
    border: 0; background: transparent; border-radius: 999px;
    font: inherit; font-size: 12px; color: var(--secondary-text-color);
  }
  .dac-ed .kolommen button[aria-pressed="true"] {
    background: var(--primary-color); color: var(--text-primary-color, #fff); font-weight: 600;
  }
  .dac-ed .weg {
    width: 30px; height: 30px; display: grid; place-items: center; cursor: pointer;
    border: 0; background: transparent; border-radius: 999px;
    color: var(--secondary-text-color); font-size: 17px; line-height: 1;
  }
  .dac-ed .weg:hover { background: rgba(127,127,127,.16); color: var(--error-color, #d03b3b); }
  .dac-ed .body { padding: 10px 14px 14px; }

  .dac-ed details {
    border-top: 1px solid var(--divider-color); margin-top: 8px; padding-top: 6px;
  }
  .dac-ed details > summary {
    cursor: pointer; list-style: none; padding: 6px 2px;
    font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 8px;
  }
  .dac-ed details > summary::-webkit-details-marker { display: none; }
  .dac-ed details > summary::before {
    content: "\u203A"; display: inline-block; transition: transform 180ms ease;
    color: var(--secondary-text-color); font-size: 16px;
  }
  .dac-ed details[open] > summary::before { transform: rotate(90deg); }
  .dac-ed details > summary small { color: var(--secondary-text-color); font-weight: 400; }
  .dac-ed .itemvelden { padding: 4px 0 10px 16px; display: flex; flex-direction: column; gap: 10px; }

  .dac-ed .toevoegen {
    padding: 10px 14px; cursor: pointer; font: inherit; font-size: 13px; font-weight: 500;
    border: 1px dashed var(--divider-color); border-radius: 12px;
    background: transparent; color: var(--primary-color);
  }
  .dac-ed .toevoegen:hover { background: rgba(127,127,127,.08); }
`,Se=class extends HTMLElement{constructor(){super(),this.rows_=[],this.rest_={}}setConfig(e){this.rest_={...e},delete this.rest_.rows,delete this.rest_.items,delete this.rest_.entities,delete this.rest_.columns,this.rows_=ft(e),this.rows_.length||(this.rows_=[{columns:2,items:[]}]),this.build_()}set hass(e){this.hass_=e;for(let t of this.querySelectorAll("ha-form, dac-icon-picker, dac-tone-picker"))t.hass=e;this.gebouwd_||this.build_()}get hass(){return this.hass_}connectedCallback(){this.gebouwd_||this.build_()}async build_(){if(!this.hass_||!this.rows_)return;await customElements.whenDefined("ha-form"),this.gebouwd_=!0,this.replaceChildren();let e=document.createElement("style");e.textContent=bt;let t=document.createElement("div");t.className="dac-ed",this.append(e,t),this.rows_.forEach((a,r)=>t.appendChild(this.rijBlok_(a,r)));let n=document.createElement("button");n.type="button",n.className="toevoegen",n.textContent="+  Rij toevoegen",n.addEventListener("click",()=>{this.rows_.push({columns:2,items:[]}),this.emit_(),this.build_()}),t.appendChild(n)}rijBlok_(e,t){let n=document.createElement("div");n.className="rij";let a=document.createElement("div");a.className="kop";let r=document.createElement("b");r.textContent=`Rij ${t+1}`;let o=document.createElement("div");o.className="kolommen";for(let h of[1,2,3]){let d=document.createElement("button");d.type="button",d.textContent=String(h),d.title=`${h} per rij`,d.setAttribute("aria-pressed",String(e.columns===h)),d.addEventListener("click",()=>{e.columns=h,o.querySelectorAll("button").forEach(g=>g.setAttribute("aria-pressed",String(g.textContent===String(h)))),this.emit_()}),o.appendChild(d)}let c=document.createElement("button");c.type="button",c.className="weg",c.title="Rij verwijderen",c.textContent="\u2715",c.addEventListener("click",()=>{this.rows_.splice(t,1),this.rows_.length||(this.rows_=[{columns:2,items:[]}]),this.emit_(),this.build_()}),a.append(r,o,c);let l=document.createElement("div");l.className="body";let p=document.createElement("ha-form");return p.hass=this.hass_,p.data={entities:e.items.map(h=>h.entity)},p.schema=[{name:"entities",selector:{entity:{multiple:!0}}}],p.computeLabel=()=>"Entiteiten in deze rij",p.addEventListener("value-changed",h=>{h.stopPropagation();let d=h.detail.value.entities??[],g=new Map(e.items.map(k=>[k.entity,k]));e.items=d.map(k=>g.get(k)??{entity:k}),this.emit_(),this.build_()}),l.appendChild(p),e.items.forEach((h,d)=>l.appendChild(this.itemBlok_(e,h,d))),n.append(a,l),n}itemBlok_(e,t,n){let a=t.name||this.hass_?.states?.[t.entity]?.attributes?.friendly_name||t.entity,r=document.createElement("details"),o=document.createElement("summary");o.innerHTML=`${a} <small>${t.entity}</small>`,r.appendChild(o);let c=document.createElement("div");c.className="itemvelden";let l=document.createElement("dac-icon-picker");l.label="Icoon",l.hass=this.hass_,l.value=t.icon??"",l.addEventListener("value-changed",d=>{d.stopPropagation(),d.detail.value?t.icon=d.detail.value:delete t.icon,this.emit_()});let p=document.createElement("dac-tone-picker");p.label="Kleur",p.hass=this.hass_,p.value=t.tone??"",p.addEventListener("value-changed",d=>{d.stopPropagation(),d.detail.value?t.tone=d.detail.value:delete t.tone,this.emit_()});let h=document.createElement("ha-form");return h.hass=this.hass_,h.data={name:t.name??"",show_state:t.show_state??!0,tap_action:t.tap_action,hold_action:t.hold_action},h.schema=[{name:"name",selector:{text:{}}},{name:"show_state",selector:{boolean:{}}},{name:"tap_action",selector:{ui_action:{default_action:"toggle"}}},{name:"hold_action",selector:{ui_action:{default_action:"more-info"}}}],h.computeLabel=d=>({name:"Naam",show_state:"Toestand tonen",tap_action:"Tikken",hold_action:"Vasthouden"})[d.name]??d.name,h.addEventListener("value-changed",d=>{d.stopPropagation();let g=d.detail.value;g.name?t.name=g.name:delete t.name,g.show_state===!1?t.show_state=!1:delete t.show_state,g.tap_action?t.tap_action=g.tap_action:delete t.tap_action,g.hold_action?t.hold_action=g.hold_action:delete t.hold_action,this.emit_(),o.innerHTML=`${t.name||a} <small>${t.entity}</small>`}),c.append(l,p,h),r.appendChild(c),r}emit_(){let e=this.rows_.map(t=>({columns:t.columns,items:t.items.filter(n=>n.entity)})).filter(t=>t.items.length);this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:{...this.rest_,rows:e}},bubbles:!0,composed:!0}))}};customElements.get("domotiapp-entities-card-editor")||customElements.define("domotiapp-entities-card-editor",Se);var Fe=44,Ee=6,Ze=i=>typeof i=="string"?{entity:i}:{...i};function vt(i){if(Array.isArray(i.rows)&&i.rows.length)return i.rows.map(t=>({columns:Math.min(Math.max(1,Number(t.columns)||2),3),items:(t.items??t.entities??[]).map(Ze)}));let e=(i.items??i.entities??[]).map(Ze);return e.length?[{columns:Math.min(Math.max(1,Number(i.columns)||2),3),items:e}]:[]}var Ce=class extends v{static css=`
    :host { display: block; height: 100%; }

    /* 5px boven en onder plus 44px per regel plus de rand van 2 komt precies op
       56 uit: \xE9\xE9n rasterrij, dezelfde hoogte als een Mushroom-kaart ernaast. */
    .card {
      height: 100%; min-height: 56px; padding: 5px 10px;
      display: flex; flex-direction: column; justify-content: center; gap: ${Ee}px;
    }
    :host([bare]) .card { background: none; border: 0; box-shadow: none; padding: 0; border-radius: 0; }

    .row {
      display: grid; gap: ${Ee}px;
      grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
    }

    .it {
      display: flex; align-items: center; gap: 10px;
      min-height: ${Fe}px; padding: 2px 6px 2px 2px;
      background: none; border: 0; border-radius: var(--dac-radius-sm);
      font: inherit; color: inherit; text-align: left; cursor: pointer;
      transition: background 200ms ease;
    }
    .it:hover { background: var(--dac-surface); }

    .chip { width: 36px; height: 36px; flex: 0 0 auto; overflow: hidden; }
    .chip .icon, .chip ha-icon { width: 18px; height: 18px; --mdc-icon-size: 18px; }
    .it[data-on="true"] .chip {
      box-shadow: 0 0 12px -3px color-mix(in srgb, var(--tone) 55%, transparent);
    }

    /* Een eigen afbeelding vult de chip helemaal: een clublogo in een hoekje
       van 18 pixels is geen logo meer. De rand blijft, zodat de vorm klopt met
       de iconen ernaast. */
    .chip.pic { background: rgba(255,255,255,.06); border-color: var(--dac-border); }
    .chip img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .txt { min-width: 0; display: flex; flex-direction: column; }
    .nm {
      font-size: 13px; font-weight: 500; line-height: 1.25;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st {
      font-size: 11px; line-height: 1.25; color: var(--dac-ink-2);
      font-variant-numeric: tabular-nums;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .st:empty { display: none; }

    .it.unavailable { opacity: .42; pointer-events: none; }

    /* Onder de 260px passen twee namen niet meer naast elkaar zonder te
       verminken, dus dan gaat elke rij terug naar \xE9\xE9n kolom. */
    @container (max-width: 260px) {
      .row { grid-template-columns: 1fr; }
    }
  `;validate(e){let t=vt(e);return t.some(n=>n.items.length)?{show_state:!0,...e,rows:t}:{...e,[C]:"Voeg een rij toe en kies daar entiteiten in."}}watched(){return this.config.rows.flatMap(e=>e.items.map(t=>t.entity))}item_(e,t){return this.config.rows[+e]?.items[+t]}tone_(e){if(e.tone)return $(e.tone);if(this.config.tone)return $(this.config.tone);if(L(e.entity)!=="light")return A.accent;let t=f(this.hass,e.entity),n=t?.state==="on"?t.attributes?.rgb_color:null;return n?`rgb(${n[0]},${n[1]},${n[2]})`:A.lit}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),this.style.containerType="inline-size",`<div class="card surface">${e.rows.map((n,a)=>`
      <div class="row" style="--cols:${n.columns}">
        ${n.items.map((r,o)=>`
          <div class="it" role="button" tabindex="0" data-r="${a}" data-i="${o}">
            <span class="chip"></span>
            <span class="txt"><span class="nm"></span><span class="st"></span></span>
          </div>`).join("")}
      </div>`).join("")}</div>`}wire(){this.$$(".it").forEach(e=>{let t=this.item_(e.dataset.r,e.dataset.i);if(!t)return;let n=(a,r)=>Q(this,this.hass,t,t[a]??r);this.teardown_.push(z(e,{onTap:()=>n("tap_action",J(t.entity)),onHold:()=>n("hold_action",{action:"more-info"})}))})}paint(){this.$$(".it").forEach(e=>{let t=this.item_(e.dataset.r,e.dataset.i);if(!t)return;let n=f(this.hass,t.entity),a=Y(n),r=D(n);e.dataset.on=String(a),e.classList.toggle("unavailable",r);let o=this.tone_(t);e.style.setProperty("--tone",o);let c=e.querySelector(".chip"),l=t.icon?null:n?.attributes?.entity_picture,p=t.icon||(l?`pic:${l}`:G(t.entity,w(this.hass,t.entity)));c.dataset.icon!==p&&(c.dataset.icon=p,c.classList.toggle("pic",!!l),c.innerHTML=l?`<img src="${l}" alt="" loading="lazy" />`:x(t.icon||G(t.entity,w(this.hass,t.entity)))),c.style.setProperty("--tone",l?"var(--dac-ink-3)":a?o:"var(--dac-ink-3)");let h=M(this.hass,t.entity,t.name);this.text(e.querySelector(".nm"),h);let d=e.querySelector(".st");if((t.show_state??this.config.show_state)===!1)d.textContent="";else if(r)d.textContent="Niet bereikbaar";else if(!n||B(n.entity_id))d.textContent="";else if(L(n.entity_id)==="light"&&a&&n.attributes.brightness!=null)d.textContent=`${Math.round(n.attributes.brightness/255*100)}%`;else{let k=n.attributes.unit_of_measurement;d.textContent=k?`${n.state} ${k}`:T(this.hass,n)}e.setAttribute("aria-label",`${h}${n?`, ${T(this.hass,n)}`:""}`)})}lines_(){return(this.config?.rows??[]).reduce((e,t)=>e+Math.ceil((t.items.length||1)/t.columns),0)}getCardSize(){return Math.max(1,this.lines_())}getGridOptions(){let e=Math.max(1,this.lines_()),t=H(12+e*Fe+(e-1)*Ee);return{columns:12,rows:t,min_columns:4,min_rows:t,max_rows:t}}static getConfigElement(){return document.createElement("domotiapp-entities-card-editor")}static getStubConfig(e,t){return{rows:[{columns:2,items:(t??[]).slice(0,2).map(n=>({entity:n}))}]}}};y("domotiapp-entities-card",Ce,{name:"DomotiApp Entiteiten",description:"Rijen entiteiten, elk met een eigen kolomindeling."});var U={OPEN:1,CLOSE:2,SET_POSITION:4,STOP:8},F=(i,e)=>!!((i?.attributes?.supported_features??0)&e),xt=(i={})=>{switch(i.device_class){case"garage":return{open:"garageOpen",closed:"garageClosed"};case"awning":case"blind":return{open:"awning",closed:"awning"};default:return{open:"shutterOpen",closed:"shutter"}}},ze=class extends v{static css=`
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
    ${te}

    .cv.unavailable { opacity: .42; pointer-events: none; }

    @media (max-width: 380px) { .keys button { width: 34px; } }
  `;validate(e){let t=e.covers??e.entities??(e.entity?[e.entity]:[]);return t.length?{...e,covers:t.map(n=>typeof n=="string"?{entity:n}:n)}:{...e,[C]:"Kies minstens \xE9\xE9n rolluik of zonnescherm."}}watched(){return this.config.covers.map(e=>e.entity)}keysHtml(e){return`
      <div class="keys">
        <button type="button" data-act="open" aria-label="Open">${b.arrowUp}</button>
        ${e?`<button type="button" data-act="stop" aria-label="Stop">${b.stop}</button>`:""}
        <button type="button" data-act="close" aria-label="Dicht">${b.arrowDown}</button>
      </div>`}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`<div class="card surface">${e.covers.map((n,a)=>`
      <div class="cv" data-i="${a}" data-shown="closed" style="--tone:${$(n.tone??e.tone,"solar")}">
        <button class="chip" type="button" aria-label="Meer info"></button>
        <div class="txt"><div class="nm"></div><div class="st"></div></div>
        ${this.keysHtml(e.show_stop!==!1)}
        <div class="pos" hidden></div>
      </div>`).join("")}</div>`}wire(){this.dragging_=new Set,this.bound_=new Set,this.assumed_=new Map,this.$$(".cv").forEach(e=>{let t=e.dataset.i;e.querySelectorAll(".keys button").forEach(a=>{this.on(a,"click",()=>{let r=a.dataset.act,o={open:"open_cover",stop:"stop_cover",close:"close_cover"};this.hass.callService("cover",o[r],{entity_id:this.config.covers[+t].entity}),r!=="stop"&&(this.assumed_.set(t,r==="open"?"open":"closed"),this.paint())})});let n=this.config.covers[+t].entity;this.teardown_.push(z(e.querySelector(".chip"),{onTap:()=>I(this,n)}))})}paint(){this.$$(".cv").forEach(e=>{let t=e.dataset.i,n=this.config.covers[+t],a=f(this.hass,n.entity),r=w(this.hass,n.entity),o=!a||a.state==="unavailable",c=a?.state??"unknown";e.classList.toggle("unavailable",o),e.querySelector(".nm").textContent=M(this.hass,n.entity,n.name);let l=F(a,U.SET_POSITION)&&r.current_position!=null,p=l?r.current_position>0?"open":"closed":c==="open"||c==="closed"?c:this.assumed_.get(t)??"closed";e.dataset.shown=p;let h=xt(r),d=(p==="open"?n.icon_open:n.icon_closed)??(p==="open"?this.config.icon_open:this.config.icon_closed)??n.icon??h[p],g=e.querySelector(".chip");g.dataset.icon!==d&&(g.dataset.icon=d,g.innerHTML=x(d,h[p]));let k=e.querySelector(".st");this.dragging_.has(t)||(k.textContent=o?"Niet bereikbaar":c==="opening"?"Gaat open":c==="closing"?"Gaat dicht":l?`${r.current_position}% open`:c==="open"?"Open":c==="closed"?"Dicht":""),e.querySelectorAll(".keys button").forEach(E=>{if(E.dataset.act==="stop"){E.disabled=o||!F(a,U.STOP);return}let O=E.dataset.act==="open";E.disabled=o||(O?!F(a,U.OPEN):!F(a,U.CLOSE))});let u=e.querySelector(".pos"),N=l&&this.config.show_position!==!1;if(u.hidden=!N,N){if(u.dataset.built||(u.dataset.built="1",u.innerHTML=V("position"),u.querySelector(".slider").setAttribute("aria-label","Positie")),!this.bound_.has(t)){this.bound_.add(t);let O=u.querySelector(".slider"),Z=W=>{O.style.setProperty("--v",`${W}%`),O.setAttribute("aria-valuenow",String(W)),e.querySelector(".st").textContent=`${W}% open`};this.teardown_.push(ee(O,{value:()=>w(this.hass,n.entity).current_position??0,onInput:Z,onCommit:W=>this.hass.callService("cover","set_cover_position",{entity_id:n.entity,position:W})}))}let E=u.querySelector(".slider");if(!E.classList.contains("dragging")){let O=r.current_position??0;E.style.setProperty("--v",`${O}%`),E.setAttribute("aria-valuenow",String(O))}}})}rows_(){let e=this.config?.covers??[],t=e.some(n=>F(f(this.hass,n.entity),U.SET_POSITION));return H(12+Math.max(1,e.length)*42+(t?30:0))}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:12,rows:e,min_columns:6,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-cover-card-editor")}static getStubConfig(e,t){let n=t?.find(a=>a.startsWith("cover."));return{covers:n?[n]:[]}}},Oe=class extends _{defaults(){return{show_stop:!0,show_position:!0}}pickers(){return[{key:"icon_open",kind:"icon",label:"Icoon als het open staat",fallback:"shutterOpen"},{key:"icon_closed",kind:"icon",label:"Icoon als het dicht is",fallback:"shutter"},{key:"tone",kind:"tone",label:"Kleur"}]}schema(){return[{name:"covers",selector:{entity:{domain:"cover",multiple:!0}}},{name:"show_stop",selector:m.bool()}]}label(e){return{covers:"Rolluiken",show_stop:"Stopknop tonen"}[e.name]??super.label(e)}helper(e){if(e.name==="covers")return"Melden ze hun stand terug, dan komt er vanzelf een schuif bij. Zo niet, dan blijven het open, stop en dicht, en volgt het icoon de knop die je indrukt."}};S("domotiapp-cover-card-editor",Oe);y("domotiapp-cover-card",ze,{name:"DomotiApp Rolluiken",description:"Open, stop en dicht, met een eigen icoon voor open en dicht."});function wt(i){if(!i)return{label:"Onbekend",home:null};switch(i.state){case"home":return{label:"Thuis",home:!0};case"not_home":return{label:"Afwezig",home:!1};case"unknown":case"unavailable":return{label:"Onbekend",home:null};default:return{label:i.state,home:!1}}}var Ae=class extends v{static css=`
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
  `;validate(e){let t=e.persons??e.entities??(e.entity?[e.entity]:[]);return t.length?{...e,persons:t.map(n=>typeof n=="string"?{entity:n}:n)}:{...e,[C]:"Kies minstens \xE9\xE9n persoon."}}watched(){return this.config.persons.map(e=>e.entity)}template(){let e=this.config;e.bare&&this.setAttribute("bare","");let t=e.columns??Math.min(e.persons.length,6),n=e.persons.map((a,r)=>`
      <button class="p" type="button" data-i="${r}" style="--tone:var(--dac-ink-3)">
        <span class="av"><span class="ph"></span></span>
        <span class="nm"></span>
        <span class="st"></span>
      </button>`).join("");return`<div class="card surface"><div class="chips" style="--cols:${t}">${n}</div></div>`}wire(){this.$$(".p").forEach(e=>{let t=this.config.persons[+e.dataset.i];this.teardown_.push(z(e,{onTap:()=>I(this,t.entity)}))})}paint(){this.$$(".p").forEach(e=>{let t=this.config.persons[+e.dataset.i],n=f(this.hass,t.entity),a=wt(n);e.style.setProperty("--tone",a.home===!0?"var(--dac-good)":a.home===!1?"var(--dac-bad)":"var(--dac-warn)");let r=M(this.hass,t.entity,t.name);this.text(e.querySelector(".nm"),r),this.text(e.querySelector(".st"),a.label);let o=e.querySelector(".ph"),c=n?.attributes?.entity_picture,l=c?`img:${c}`:r?`ini:${r[0]}`:"icon";o.dataset.kind!==l&&(o.dataset.kind=l,o.innerHTML=c?`<img src="${c}" alt="" loading="lazy" />`:r?r[0].toUpperCase():b.person),e.setAttribute("aria-label",`${r}, ${a.label}`)})}rows_(){let e=this.config?.columns??Math.min(this.config?.persons?.length??1,6),t=Math.ceil((this.config?.persons?.length??1)/e);return H(20+t*74+(t-1)*6)}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:"full",rows:e,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-person-card-editor")}static getStubConfig(e){return{persons:Object.keys(e?.states??{}).filter(n=>n.startsWith("person.")).slice(0,6)}}},Le=class extends _{setConfig(e){let t={...e},n=(e.persons??[]).map(a=>typeof a=="string"?{entity:a}:a);t.persons=n.map(a=>a.entity);for(let a of n)a.name&&(t[`naam:${a.entity}`]=a.name);super.setConfig(t)}serialize(e){let t={...e},n=t.persons??[];t.persons=n.map(a=>{let r=t[`naam:${a}`];return r?{entity:a,name:r}:a});for(let a of Object.keys(t))a.startsWith("naam:")&&delete t[a];return t}schema(){let e=(this.config_?.persons??[]).filter(t=>typeof t=="string");return[{name:"persons",selector:{entity:{domain:["person","device_tracker"],multiple:!0}}},...e.map(t=>({name:`naam:${t}`,selector:m.text()}))]}label(e){if(e.name==="persons")return"Personen";if(e.name.startsWith("naam:")){let t=e.name.slice(5);return`Naam voor ${this.hass?.states?.[t]?.attributes?.friendly_name??t}`}return super.label(e)}helper(e){if(e.name==="persons")return"Thuis is groen, weg is rood, geen melding is oranje. Per persoon kun je hieronder een eigen naam zetten."}};S("domotiapp-person-card-editor",Le);y("domotiapp-person-card",Ae,{name:"DomotiApp Personen",description:"Wie er thuis is, compact. Het hele huishouden in \xE9\xE9n kaart."});var yt=[[/gft|groente|tuin|organi/i,"teal","binWheeled"],[/pmd|plastic|verpakking/i,"solar","binWheeled"],[/papier|karton/i,"water","binWheeled"],[/rest|grijs/i,"neutral","binWheeled"],[/textiel|kleding/i,"pink","bin"],[/glas/i,"magenta","bin"],[/kerstboom|snoei|takken/i,"teal","bin"]];function _t(i){for(let[e,t,n]of yt)if(e.test(i))return{tone:t,icon:n};return{tone:"accent",icon:"bin"}}var Xe=i=>String(i??"").replace(/^(afvalbeheer|afvalwijzer|mijnafvalwijzer)\s*/i,"").replace(/\s*(mijnafvalwijzer)\s*/i," ").trim(),je=class extends v{static css=`
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
  `;validate(e){let t=e.sensors??e.entities??(e.entity?[e.entity]:[]);return t.length?{show_hero:!0,show_list:!0,...e,sensors:t.map(n=>typeof n=="string"?{entity:n}:n)}:{...e,[C]:"Kies minstens \xE9\xE9n afvalsensor waarvan de toestand een datum is."}}watched(){return this.config.sensors.map(e=>e.entity)}read_(){let e=new Date;return this.config.sensors.map(t=>{let n=f(this.hass,t.entity);if(!n)return null;let a=K(n.state)??K(n.attributes.date)??K(n.attributes.next_date);if(!a)return null;let r=t.label??Xe(M(this.hass,t.entity,t.name)),o=_t(t.label??t.entity+r),c=this.config.tones?.[t.entity];return{label:r,date:a,days:ae(e,a),tone:$(c??t.tone??o.tone),icon:t.icon??o.icon}}).filter(t=>t&&t.days>=0).sort((t,n)=>t.date-n.date)}template(){let e=this.config;return e.bare&&this.setAttribute("bare",""),`
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
      </div>`}paint(){let e=this.read_(),t=this.$(".hero"),n=this.$(".list"),a=this.$(".empty");if(a.hidden=e.length>0,t&&(t.hidden=e.length===0,e.length)){let r=e[0];t.style.setProperty("--tone",r.tone),this.setAttribute("urgency",r.days===0?"today":r.days===1?"tomorrow":"later");let o=t.querySelector(".bin");o.dataset.icon!==r.icon&&(o.dataset.icon=r.icon,o.innerHTML=x(r.icon,"bin")),this.text(t.querySelector(".eyebrow"),re(r.date)),this.text(t.querySelector(".big"),r.label),this.text(t.querySelector(".n"),r.days===0?"nu":String(r.days)),this.text(t.querySelector(".u"),r.days===0?"aan de weg":r.days===1?"dag":"dagen")}if(n){let r=this.config.show_hero===!1?e:e.slice(1),o=r.map(c=>`${c.label}${+c.date}`).join("|");if(n.dataset.sig===o)return;n.dataset.sig=o,n.innerHTML=r.map(c=>{let l=re(c.date),p=c.days<=6?`<small>${qe(c.date)}</small>`:"";return`
        <div class="r" style="--tone:${c.tone}">
          <i></i><span>${c.label}</span>
          <span class="d">${l}${p}</span>
        </div>`}).join("")}}rows_(){let e=this.config?.sensors?.length??1;return this.config?.show_list===!1?1:this.config?.show_hero===!1?Math.max(1,H(20+e*33)):Math.max(2,e)}getCardSize(){return this.rows_()}getGridOptions(){let e=this.rows_();return{columns:12,rows:e,min_columns:6,min_rows:e,max_rows:e}}static getConfigElement(){return document.createElement("domotiapp-waste-card-editor")}static getStubConfig(e){return{sensors:Object.keys(e?.states??{}).filter(n=>/afval|waste|trash|garbage|ophaal/i.test(n)&&n.startsWith("sensor.")).filter(n=>K(e.states[n]?.state)).slice(0,6),title:"Afvalkalender"}}},Te=class extends _{defaults(){return{show_hero:!0,show_list:!0}}setConfig(e){let t={...e};for(let[n,a]of Object.entries(e.tones??{}))t[`kleur:${n}`]=a;delete t.tones,super.setConfig(t)}serialize(e){let t={...e},n={};for(let a of Object.keys(t))a.startsWith("kleur:")&&(t[a]&&(n[a.slice(6)]=t[a]),delete t[a]);return Object.keys(n).length?t.tones=n:delete t.tones,t}schema(){let e=this.config_?.sensors??[],t=Object.keys(A).map(n=>({value:n,label:R[n]??n}));return[{name:"sensors",selector:{entity:{domain:"sensor",multiple:!0}}},...e.map(n=>typeof n=="string"?n:n.entity).filter(Boolean).map(n=>({name:`kleur:${n}`,selector:m.select(t)}))]}label(e){if(e.name.startsWith("kleur:")){let t=e.name.slice(6),n=this.hass?.states?.[t]?.attributes?.friendly_name??t;return`Kleur voor ${Xe(n)||n}`}return{sensors:"Afvalsensoren",show_hero:"Eerstvolgende uitlichten",show_list:"Overige data tonen",bare:"Zonder kaartrand"}[e.name]??super.label(e)}helper(e){if(e.name==="sensors")return"Sensoren waarvan de toestand een datum is, bijvoorbeeld 18-08-2026. De kaart sorteert zelf; laat een kleur leeg om de bakkleur op de naam te laten kiezen."}};S("domotiapp-waste-card-editor",Te);y("domotiapp-waste-card",je,{name:"DomotiApp Afvalkalender",description:"Eerstvolgende ophaling als hero, de rest eronder. Kleur per fractie."});var kt="0.1.7";console.info(`%c DOMOTIAPP-CARDS %c ${kt} `,"background:#026fa1;color:#e8e4de;font-weight:600;border-radius:3px 0 0 3px;padding:2px 6px","background:#12120f;color:#e8e4de;border-radius:0 3px 3px 0;padding:2px 6px");export{kt as VERSION};
//# sourceMappingURL=domotiapp-cards.js.map
