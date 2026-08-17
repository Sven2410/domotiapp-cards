# DomotiApp Cards

Een eigen kaartenfamilie voor Home Assistant, in de vormtaal van DomotiApp Coach.
Bedoeld om er een heel dashboard mee te bouwen — bij jezelf en bij klanten — zonder
dat je zes verschillende HACS-pakketten naast elkaar zet die elk hun eigen radius,
iconenset en kleurlogica meebrengen.

Alle kaarten hebben een **visuele editor** met een icoonkiezer en een kleurkiezer,
dus je hoeft geen YAML te schrijven om een dashboard op te bouwen.

---

## De kaarten

| Kaart | Waarvoor |
|---|---|
| `custom:domotiapp-header-card` | Begroeting, klok en weer bovenaan een dashboard |
| `custom:domotiapp-separator-card` | Sectiekop met icoon en vervagende lijn |
| `custom:domotiapp-button-card` | Eén control als rij, tegel of compacte pil |
| `custom:domotiapp-light-card` | Dimbare én schakelbare lampen |
| `custom:domotiapp-cover-card` | Rolluiken en zonneschermen |
| `custom:domotiapp-person-card` | Wie er thuis is, compact |
| `custom:domotiapp-waste-card` | Afvalkalender met dagteller |

---

## Installatie

### Via HACS

1. HACS → menu rechtsboven → **Aangepaste repositories**
2. `https://github.com/Sven2410/domotiapp-cards`, categorie **Dashboard** (Lovelace)
3. Installeren. HACS zet de resource zelf klaar op
   `/hacsfiles/domotiapp-cards/domotiapp-cards.js`.

### Handmatig

Kopieer **alleen** `dist/domotiapp-cards.js` naar `config/www/`, en voeg toe
onder **Instellingen → Dashboards → Bronnen**:

```
/local/domotiapp-cards.js     type: JavaScript Module
```

Ververs daarna hard (Ctrl+F5). In de console hoor je één regel te zien:
`DOMOTIAPP-CARDS 0.1.1`. Zie je die niet, dan is de resource niet geladen.

---

## Bouwen

De bronnen staan gesplitst in `src/`; wat Home Assistant laadt is één gebundeld
bestand in `dist/`.

```bash
npm install
npm run build        # dist/domotiapp-cards.js
npm run watch        # opnieuw bouwen terwijl je werkt
```

`dist/` wordt bewust meegecommit, zodat een handmatige installatie ook zonder
release werkt. De workflow weigert een release als `dist/` achterloopt op `src/`.

Versie bijwerken:

```bash
node dev/bump.mjs 0.2.0     # zet VERSION, package.json en bouwt opnieuw
git commit -am "0.2.0" && git tag v0.2.0 && git push --tags
```

De workflow controleert dat de tag en `VERSION` overeenkomen, bouwt, en hangt
het bestand aan de release.

### Waarom er toch een buildstap is

De eerste versie had er geen: de browser haalde de losse modules zelf op, zodat
wat er draaide letterlijk hetzelfde was als wat er in de repository stond. Dat
scheelt tijd als je op een wandtablet bij een klant moet zoeken waar iets misgaat.

HACS maakte dat onwerkbaar. Voor een dashboardkaart registreert het precies één
resource-URL, en bij een zip-release is dat de zip zélf — de browser probeert dan
een zipbestand als module te draaien en er registreert geen enkele kaart. Eén
gebundeld bestand is wat elke andere HACS-kaart uitlevert, en het lost meteen een
tweede probleem op: er zijn geen submodules meer die in de browsercache van een
klant kunnen verouderen. De bronnen blijven gesplitst; alleen het artefact is
samengevoegd, met een sourcemap zodat een stacktrace nog naar het echte bestand
wijst.

---

## De vormtaal

De tokens komen ongewijzigd uit `domotiapp-coach/frontend/src/theme.js`. Dat is de
bron; `src/theme.js` is een kopie die niet mag afdrijven.

**Accent** `#026fa1` / `#198fd9` · **Ground** `#0c0c0a` · **Inkt** `#e8e4de` ·
radius 20 / 12 / pill.

Twee regels die het systeem bij elkaar houden:

1. **Rood en groen zijn gereserveerd voor status.** Ze zitten bewust niet in de
   identiteitskleuren. Een rolluik met een groen icoon leest als "in orde" in
   plaats van als "rolluik". De kleurkiezer scheidt de twee groepen daarom
   zichtbaar, met die uitleg erbij.
2. **Het getal draagt nooit de kleur.** Identiteit zit in de icoonchip, niet in
   de cijfers. Dat houdt een rij kaarten leesbaar voor kleurenblinde ogen.

### Iconen

Zelf getekend, in `src/icons.js`: 24×24, `stroke-width: 1.6`, `currentColor`.
Geen MDI-afhankelijkheid, geen webfont, geen netwerkverzoek. De icoonkiezer toont
die set eerst; daaronder kun je alsnog elk `mdi:`-icoon typen voor de lange staart
(een 3D-printer, een warmtepomp). Dat is bewust één stap verder weg: twee
lijndiktes op één scherm is het snelste dat een set laat ophouden een set te zijn.

Teken je er zelf een bij, houd dan 1.6 aan en zet 'm ook in de groepenlijst
bovenin `src/editor/icon-picker.js`, anders is hij alleen bereikbaar door de naam
te typen.

---

## Wat de kaarten zelf uitzoeken

Deze kaarten vragen het apparaat wat het kan, niet de installateur. Dat scheelt
instellingen én het scheelt dashboards waar bij één apparaat het verkeerde vinkje
staat.

- **Verlichting** leest `supported_color_modes`. Precies `["onoff"]` krijgt een
  tuimelaar, al het andere een helderheidsschuif. Een RGB-lamp kleurt zijn eigen
  vulling, zodat je ziet wat je krijgt voordat je de kamer in loopt.
- **Rolluiken** lezen `supported_features`. De positieschuif verschijnt alleen bij
  motoren die hun stand terugmelden (`SET_POSITION`). Doen ze dat niet — de meeste
  Nederlandse rolluikmotoren — dan zijn het open, stop en dicht, en zegt de kaart
  *"Geen terugkoppeling"* in plaats van `Onbekend`. Er wordt dan ook geen knop
  gemarkeerd als actief, want er is niets bekend om te markeren.
- **Afval** sorteert zelf op datum en kiest de bakkleur op de naam van de sensor.
  Datums worden met een eigen parser gelezen: `18-08-2026` leest JavaScript als een
  Amerikaanse maand-dag, wat stil de verkeerde dag geeft of `NaN`.
- **Knoppen** weten dat een scene, script of `input_button` geen toestand heeft.
  Die worden niet grijs met "Niet bereikbaar" omdat ze nog nooit gedraaid hebben.

---

## Voorbeeld

```yaml
type: sections
sections:
  - type: grid
    cards:
      - type: custom:domotiapp-header-card
        weather: weather.buienradar
        sun: sun.sun
        chips: [humidity, wind, uv, precipitation, sunset]

      - type: custom:domotiapp-separator-card
        name: Thuis
        icon: people
        tone: accent

      - type: custom:domotiapp-person-card
        persons:
          - person.sven
          - person.lieke
          - person.rinette
        show_summary: true

      - type: custom:domotiapp-separator-card
        name: Rolluiken
        icon: shutter
        tone: solar

      - type: custom:domotiapp-cover-card
        title: Woonkamer
        covers:
          - cover.wk_achter
          - cover.wk_balkon
          - cover.zonnescherm_woonkamer
        group: true

      - type: custom:domotiapp-light-card
        title: Slaapkamer
        lights:
          - light.ledstrip_sven
          - light.spots_sven

      - type: custom:domotiapp-waste-card
        sensors:
          - sensor.mijnafvalwijzer_pmd
          - sensor.mijnafvalwijzer_gft
          - sensor.mijnafvalwijzer_papier
          - sensor.mijnafvalwijzer_restafval
```

Een navigatietegel zonder entiteit — zo bouw je een ruimte-raster:

```yaml
- type: custom:domotiapp-button-card
  name: Begane grond
  icon: floorB
  tone: house
  layout: tile
  tap_action:
    action: navigate
    navigation_path: "#beganegrond"
```

---

## Werkbank

`dev/preview.html` toont alle kaarten met een nagemaakte `hass`. Service-aanroepen
gaan naar een logboek onderin in plaats van naar een echt huis, dus je kunt klikken
en slepen zonder dat er ergens een rolluik beweegt.

```bash
python -m http.server 8877
# open http://127.0.0.1:8877/dev/preview.html
```

De editors zitten er niet in: die leunen op Home Assistant's eigen `ha-form` en
werken dus alleen binnen HA.

---

## Een kaart toevoegen

1. Schrijf `src/cards/mijn-card.js`, met `DacCard` als basis.
2. Registreer onderin het bestand zelf, naast de klasse: `registerCard(...)`.
3. Importeer 'm in `domotiapp-cards.js`.

`DacCard` splitst rendering bewust in tweeën: `template()` bouwt de DOM één keer,
`paint()` schrijft er waarden in bij elke relevante wijziging. Home Assistant duwt
bij élke toestandswijziging in huis een nieuw `hass`-object naar élke kaart —
duizenden per uur. `watched()` bepaalt waar jouw kaart wakker van wordt; de rest
wordt genegeerd. Bouw nooit `innerHTML` opnieuw op in `paint()`: dat gooit focus,
een half afgemaakte sleepbeweging en de scrollpositie weg.

---

## Licentie

MIT
