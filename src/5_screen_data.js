/* ---------- Date (despre date) ---------- */
DOMS.push(bi({ id: "dat", n_ro: "Despre date", n_en: "About the data", f: [] }));
[
  [
    "Matrice de legături",
    "Bus matrix",
    "Analiză de date",
    "Tabel care arată ce dimensiuni folosește fiecare tabel de fapte. Spune imediat ce se poate combina cu ce.",
    "● = tabelul are dimensiunea respectivă",
  ],
  [
    "Dicționar de date",
    "Data dictionary",
    "Analiză de date",
    "Lista tuturor coloanelor din date, cu tipul, unitatea și semnificația lor. Primul document pe care îl citește un analist.",
    "–",
  ],
  [
    "Eșantion",
    "Sample",
    "Analiză de date",
    "O parte din date, aleasă aleatoriu, folosită în locul întregului. Rezultatele sunt estimări, nu totaluri exacte.",
    "Aici: 25.000 de dosare de daună",
  ],
  [
    "Punct procentual",
    "Percentage point (pp)",
    "Analiză de date",
    "Diferența dintre două procente. Dacă rata daunei trece de la 70% la 72%, a crescut cu 2 puncte procentuale (2 pp), dar cu 2,9% în termeni relativi.",
    "72% − 70% = +2 pp",
  ],
  [
    "Punct (scor)",
    "Point",
    "Analiză de date",
    "Diferența dintre două scoruri care nu sunt procente, cum ar fi NPS, eNPS, engagement sau satisfacția clienților.",
    "NPS 21,1 → 24,9 = +3,8 puncte",
  ],
  [
    "Flux, stoc și rată",
    "Flow, stock and ratio",
    "Analiză de date",
    "Trei tipuri de indicatori care se agregă diferit pe o perioadă: fluxurile se adună, stocurile se iau la final, ratele se recalculează din totaluri.",
    "Prime = flux; angajați = stoc; combined ratio = rată",
  ],
].forEach((g) => {
  D.gl.push(g);
  GL[g[0]] = { t: g[0], en: g[1], dom: g[2], def: g[3], f: g[4] };
});
SUGG.dat1 = [
  "Ce tabele stau la baza ecranului Daune?",
  "De ce unele cifre sunt estimări din eșantion?",
  "Ce limite au datele despre salarii?",
];
/* the 11 tables: [name (identifier, also the Excel sheet), content ro, content en, one row = ro, one row = en, dimensions, used in ro, used in en] */
const TBL = [
  [
    "Activitate_lunara",
    "Activitatea de asigurare: prime, daune, costuri, polițe",
    "Insurance activity: premium, claims, costs, policies",
    "lună × țară × linie × canal",
    "month × country × line × channel",
    ["T", "G", "P", "C"],
    "Business, Daune, Sinteză, Segmente",
    "Business, Claims, Overview, Segments",
  ],
  [
    "Daune",
    "Dosare individuale de daună (eșantion)",
    "Individual claim files (sample)",
    "un dosar",
    "one claim file",
    ["T", "G", "P", "C"],
    "Daune",
    "Claims",
  ],
  [
    "Buget",
    "Prime bugetate și combined ratio țintă",
    "Budgeted premium and target combined ratio",
    "lună × regiune × linie",
    "month × region × line",
    ["T", "G", "P"],
    "Business",
    "Business",
  ],
  [
    "Rezultate_grup",
    "Profit, capitaluri, solvabilitate, acțiune",
    "Profit, equity, solvency, share",
    "trimestru",
    "quarter",
    ["T"],
    "Financiar, Sinteză",
    "Finance, Overview",
  ],
  [
    "Investitii",
    "Portofoliul de investiții",
    "Investment portfolio",
    "trimestru × clasă de active",
    "quarter × asset class",
    ["T"],
    "Financiar",
    "Finance",
  ],
  [
    "Angajati",
    "Toți angajații din perioada 2021–2025",
    "All employees over 2021–2025",
    "un angajat",
    "one employee",
    ["T", "G", "D"],
    "Oameni, Sinteză",
    "People, Overview",
  ],
  [
    "Recrutare",
    "Pâlnia de recrutare",
    "Recruitment funnel",
    "trimestru × departament × regiune",
    "quarter × department × region",
    ["T", "G", "D"],
    "Oameni",
    "People",
  ],
  [
    "Sondaje_angajati",
    "Sondajul anual de engagement",
    "Annual engagement survey",
    "an × departament × regiune",
    "year × department × region",
    ["T", "G", "D"],
    "Oameni",
    "People",
  ],
  [
    "Tinte_strategice",
    "Cei 10 KPI: țintă și realizat",
    "The 10 KPIs: target and actual",
    "an × indicator",
    "year × KPI",
    ["T"],
    "Sinteză",
    "Overview",
  ],
  [
    "Cursuri_valutare",
    "Cursuri lunare față de EUR",
    "Monthly exchange rates against EUR",
    "lună × monedă",
    "month × currency",
    ["T"],
    "Business (efect valutar)",
    "Business (FX effect)",
  ],
  [
    "Tari",
    "Țări, regiuni, monede",
    "Countries, regions, currencies",
    "o țară",
    "one country",
    ["G"],
    "Toate (dimensiune)",
    "All (dimension)",
  ],
];
const DIMS = [
  ["T", "Timp", "Time"],
  ["G", "Geografie", "Geography"],
  ["P", "Produs", "Product"],
  ["C", "Canal", "Channel"],
  ["D", "Departament", "Department"],
];
const IKIND = { flux: ["flux", "flow"], rată: ["rată", "ratio"], stoc: ["stoc", "stock"] };
/* indicators: [name ro, name en, kind, source table, formula ro, formula en, glossary term] */
const IND = [
  [
    "Prime brute subscrise",
    "Gross written premium",
    "flux",
    "Activitate_lunara",
    "Suma gwp_eur",
    "Sum of gwp_eur",
    "Prime brute subscrise",
  ],
  [
    "Prime nete câștigate",
    "Net earned premium",
    "flux",
    "Activitate_lunara",
    "Suma net_earned_premium_eur",
    "Sum of net_earned_premium_eur",
    "Prime nete câștigate",
  ],
  [
    "Rata daunei",
    "Loss ratio",
    "rată",
    "Activitate_lunara",
    "Σ daune / Σ NEP",
    "Σ claims / Σ NEP",
    "Rata daunei",
  ],
  [
    "Combined ratio",
    "Combined ratio",
    "rată",
    "Activitate_lunara",
    "(Σ daune + Σ achiziție + Σ administrative) / Σ NEP",
    "(Σ claims + Σ acquisition + Σ administrative) / Σ NEP",
    "Combined ratio",
  ],
  [
    "Rata de pierdere a polițelor",
    "Lapse rate",
    "rată",
    "Activitate_lunara",
    "Σ polițe pierdute / polițe active medii",
    "Σ lapsed policies / average policies in force",
    "Rata de pierdere a polițelor",
  ],
  [
    "Polițe active",
    "Policies in force",
    "stoc",
    "Activitate_lunara",
    "policies_in_force din decembrie",
    "policies_in_force in December",
    "Polițe active",
  ],
  [
    "Severitatea daunelor",
    "Claim severity",
    "rată",
    "Daune",
    "Σ sume / număr de dosare",
    "Σ amounts / number of claim files",
    "Severitatea daunelor",
  ],
  [
    "Timp de soluționare",
    "Settlement time",
    "rată",
    "Daune",
    "Media days_to_settle, doar dosarele închise",
    "Average days_to_settle, closed files only",
    "Timp de soluționare",
  ],
  [
    "Profit net",
    "Net profit",
    "flux",
    "Rezultate_grup",
    "Suma net_income_eur",
    "Sum of net_income_eur",
    "Profit net",
  ],
  [
    "ROE",
    "ROE",
    "rată",
    "Rezultate_grup",
    "Profit net anual mediu / capitaluri medii",
    "Average annual net profit / average equity",
    "Rentabilitatea capitalurilor proprii",
  ],
  [
    "Rata de solvabilitate",
    "Solvency ratio",
    "stoc",
    "Rezultate_grup",
    "Valoarea din ultimul trimestru al perioadei",
    "Value in the last quarter of the period",
    "Rata de solvabilitate",
  ],
  [
    "Număr de angajați",
    "Headcount",
    "stoc",
    "Angajati",
    "Angajați activi la 31 decembrie",
    "Active employees at 31 December",
    "Număr de angajați",
  ],
  [
    "Plecări voluntare",
    "Voluntary attrition",
    "rată",
    "Angajati",
    "Demisii / număr mediu de angajați (medie anuală)",
    "Resignations / average headcount (annual average)",
    "Plecări voluntare",
  ],
  [
    "Engagement",
    "Engagement",
    "rată",
    "Sondaje_angajati",
    "Medie ponderată cu numărul de invitați",
    "Average weighted by the number of people invited",
    "Engagement",
  ],
];
/* a data dictionary row as shown in the active language: [table, column, type, unit, description] (English texts in src/i18n_en.json) */
const dictRow = (r) => {
  if (LANG !== "en") return r;
  const e = (EN.dict || {})[r[0] + "." + r[1]];
  return [
    r[0],
    r[1],
    (EN.dictType || {})[r[2]] || r[2],
    (EN.dictFmt || {})[r[3]] || r[3],
    e || r[4],
  ];
};
SCR.dat1 = () => {
  const rowsT = sum(Object.values(D.rows));
  const tT = `<div class="tbl"><table class="lt"><thead><tr><th>${tl("Tabel", "Table")}</th><th>${tl("Ce conține", "Contents")}</th><th>${tl("Un rând înseamnă", "One row is")} ${q("Granularitate")}</th><th>${tl("Rânduri", "Rows")}</th><th>${tl("Folosit în", "Used in")}</th></tr></thead><tbody>${TBL.map(
    (t) =>
      `<tr><td><b>${t[0]}</b></td><td style="text-align:left">${tl(t[1], t[2])}</td>` +
      `<td style="text-align:left">${tl(t[3], t[4])}</td><td class="num" style="text-align:right">${nf0.format(D.rows[t[0]] || 0)}</td>` +
      `<td style="text-align:left">${tl(t[6], t[7])}</td></tr>`,
  ).join("")}</tbody></table></div>`;
  const bm = `<div class="tbl"><table><thead><tr><th>${tl("Tabel", "Table")}</th>${DIMS.map((d) => `<th style="text-align:center">${tl(d[1], d[2])}</th>`).join("")}</tr></thead><tbody>${TBL.map((t) => `<tr><td>${t[0]}</td>${DIMS.map((d) => `<td style="text-align:center;color:var(--accent)">${t[5].includes(d[0]) ? "●" : "<span style='color:var(--line-2)'>·</span>"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  const iT =
    `<div class="tbl"><table class="lt"><thead><tr><th>${tl("Indicator", "Indicator")}</th>` +
    `<th>${tl("Tip", "Type")} ${q("Flux, stoc și rată")}</th><th>${tl("Sursa", "Source")}</th>` +
    `<th>${tl("Cum se calculează", "How it is calculated")}</th></tr>` +
    `</thead><tbody>${IND.map(
      (i) =>
        `<tr><td>${tl(i[0], i[1])} ${q(i[6])}</td><td style="text-align:left">${tl(...IKIND[i[2]])}</td>` +
        `<td style="text-align:left">${i[3]}</td><td style="text-align:left;white-space:normal">${tl(i[4], i[5])}</td></tr>`,
    ).join("")}` +
    `</tbody></table></div>`;
  const tabs = [...new Set(D.dict.map((r) => r[0]))];
  const dictUI =
    `<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px"><input id="dq" type="search" placeholder="${tl("Caută o coloană, de exemplu daune sau salariu", "Search for a column, for example claims or salary")}" style="flex:1;min-width:200px;border:1px solid var(--line-2);border-radius:6px;padding:7px 10px;background:var(--panel-2)">` +
    `<select id="dt" style="border:1px solid var(--line-2);border-radius:6px;padding:7px 8px;background:var(--panel)"><option value="">${tl("Toate tabelele", "All tables")}</option>${tabs.map((t) => `<option>${t}</option>`).join("")}</select>` +
    `</div><div class="tbl" style="max-height:420px;overflow-y:auto">` +
    `<table class="lt"><thead><tr><th>${tl("Tabel", "Table")}</th>` +
    `<th>${tl("Coloană", "Column")}</th><th>${tl("Tip", "Type")}</th>` +
    `<th>${tl("Unitate", "Unit")}</th><th style="text-align:left">${tl("Descriere", "Description")}</th></tr>` +
    `</thead><tbody id="dbody"></tbody></table></div><p class="sub" id="dcount" style="margin-top:8px"></p>`;
  const li = (a) =>
    `<ul style="margin:0;padding-left:18px;line-height:1.6">${a.map((x) => `<li>${x}</li>`).join("")}</ul>`;
  const vs = tl("față de 2024", "vs 2024");
  const html = [
    `<div class="s12 cards">`,
    card(tl("Tabele", "Tables"), "Tabel de fapte", "11", [
      tl("8 de fapte, 3 de referință", "8 fact tables, 3 reference tables"),
      "",
    ]),
    card(tl("Rânduri", "Rows"), "Granularitate", nf0.format(rowsT), [
      tl("în toate tabelele", "across all tables"),
      "",
    ]),
    card(
      tl("Coloane documentate", "Documented columns"),
      "Dicționar de date",
      String(D.dict.length),
      [tl("vezi dicționarul de mai jos", "see the dictionary below"), ""],
    ),
    card(tl("Perioada", "Period"), "", "2021–2025", [
      tl("60 de luni, 20 de trimestre", "60 months, 20 quarters"),
      "",
    ]),
    card(tl("Acoperire", "Coverage"), "Linie de business", tl("11 țări", "11 countries"), [
      tl("4 regiuni, 5 linii, 4 canale", "4 regions, 5 lines, 4 channels"),
      "",
    ]),
    card(tl("Moneda", "Currency"), "Curs valutar", "EUR", [
      tl("sumele locale sunt convertite", "local amounts are converted"),
      "",
    ]),
    `</div>`,
    win(
      "s12",
      tl("Tabelele setului de date", "The tables in the dataset"),
      "Tabel de fapte",
      tl(
        "Ce conține fiecare tabel și cât de detaliat este. Granularitatea spune ce reprezintă un rând și decide ce se poate calcula din tabel",
        "What each table contains and how detailed it is. The grain tells you what one row represents and decides what can be calculated from the table",
      ),
      tT,
    ),
    win(
      "s6",
      tl("Cum se leagă tabelele", "How the tables connect"),
      "Matrice de legături",
      tl(
        "Dimensiunile comune pe care le folosește fiecare tabel. Două tabele se pot combina doar pe dimensiunile pe care le au amândouă",
        "The shared dimensions each table uses. Two tables can only be combined on the dimensions they both have",
      ),
      bm,
    ),
    win(
      "s6",
      tl("Ipoteze și simplificări", "Assumptions and simplifications"),
      "Date sintetice",
      tl(
        "Ce trebuie știut înainte de a interpreta orice cifră",
        "What to know before interpreting any figure",
      ),
      li(
        tl(
          [
            "InaVale e o companie <b>fictivă</b>; datele sunt sintetice, dar construite să respecte logica unui asigurător real.",
            "Contabilitatea de asigurări (IFRS 17) e simplificată: primele câștigate sunt o medie mobilă pe 12 luni a primelor subscrise, după 6% cedate la reasigurare.",
            "Solvabilitatea e aproximată din capitaluri și volumul de business; nu e un calcul Solvency II complet.",
            "Toate sumele sunt în EUR; valorile locale sunt convertite la cursul lunar.",
            "Catastrofele sunt marcate explicit în date: furtuna din iulie 2023, inundațiile din mai 2024, uraganul din septembrie 2024.",
          ],
          [
            "InaVale is a <b>fictional</b> company; the data is synthetic, but built to follow the logic of a real insurer.",
            "Insurance accounting (IFRS 17) is simplified: earned premium is a 12-month moving average of written premium, after 6% ceded to reinsurers.",
            "Solvency is approximated from equity and business volume; it is not a full Solvency II calculation.",
            "All amounts are in EUR; local values are converted at the monthly exchange rate.",
            "Catastrophes are flagged explicitly in the data: the storm of July 2023, the floods of May 2024 and the hurricane of September 2024.",
          ],
        ),
      ),
    ),
    win(
      "s12",
      tl("Cum se calculează indicatorii", "How the indicators are calculated"),
      "Flux, stoc și rată",
      tl(
        "Fiecare indicator, sursa lui și formula. Tipul decide cum se agregă pe o perioadă de mai mulți ani",
        "Each indicator, its source and its formula. The type decides how it is aggregated over a multi-year period",
      ),
      iT,
    ),
    win(
      "s6",
      tl("Calitatea și limitele datelor", "Data quality and limitations"),
      "Eșantion",
      tl(
        "Unde cifrele sunt estimări sau au limite",
        "Where figures are estimates or have limitations",
      ),
      li(
        tl(
          [
            "<b>Daunele individuale</b> sunt un eșantion de 25.000 de dosare: numărul, severitatea, timpul de soluționare și frauda sunt estimări. Totalul daunelor vine din tabelul Activitate_lunara, care e complet.",
            "Dosarele <b>deschise</b> la 31.12.2025 nu au încă timp de soluționare și satisfacție; sunt excluse din aceste medii.",
            "<b>Salariile</b> există doar pentru momentul plecării sau pentru 31.12.2025, nu pe fiecare an. Analiza diferenței salariale folosește doar angajații activi.",
            "Canalul <b>Bancassurance</b> nu există în SUA și Canada.",
            "Echipele mai mici de 8 angajați nu apar în hărțile termice, pentru că ratele lor ar fi prea instabile.",
          ],
          [
            "<b>Individual claims</b> are a sample of 25,000 files: the number, severity, settlement time and fraud are estimates. Total claims come from the Activitate_lunara table, which is complete.",
            "Files still <b>open</b> at 31 Dec 2025 have no settlement time or satisfaction score yet; they are excluded from these averages.",
            "<b>Salaries</b> exist only at the time of leaving or at 31 Dec 2025, not for every year. The gender pay gap analysis uses active employees only.",
            "The <b>Bancassurance</b> channel does not exist in the US and Canada.",
            "Teams with fewer than 8 employees are left out of the heatmaps, because their rates would be too unstable.",
          ],
        ),
      ),
    ),
    win(
      "s6",
      tl("Metodele din layerele 3 și 4", "Methods in layers 3 and 4"),
      "Prognoză",
      tl(
        "Cum sunt construite prognozele și scenariile",
        "How the forecasts and scenarios are built",
      ),
      li(
        tl(
          [
            "<b>Prognoza primelor</b>: regresie liniară pe logaritmul primelor lunare, după eliminarea sezonalității; interval de 80% din abaterea istorică.",
            "<b>Rata daunei</b> prevăzută = rata de bază (media 2024–2025, fără catastrofe) + încărcarea medie pentru catastrofe din 2021–2025.",
            "<b>Riscul de plecări</b>: medie ponderată a ultimilor trei ani (50/30/20%), ajustată cu engagement-ul.",
            "<b>Scenariile</b> pornesc de la planul 2026; fiecare ipoteză e un cursor vizibil, iar efectele se adună după impozitul de 25%.",
          ],
          [
            "<b>Premium forecast</b>: linear regression on the log of monthly premium, after removing seasonality; 80% interval from the historical deviation.",
            "The forecast <b>loss ratio</b> = the attritional loss ratio (2024–2025 average, excluding catastrophes) + the average 2021–2025 catastrophe load.",
            "<b>Attrition risk</b>: a weighted average of the last three years (50/30/20%), adjusted for engagement.",
            "The <b>scenarios</b> start from the 2026 plan; every assumption is a visible slider, and the effects add up after 25% tax.",
          ],
        ),
      ),
    ),
    win(
      "s12",
      tl("Cum citești variațiile de pe carduri", "How to read the changes on the cards"),
      "Punct procentual",
      tl(
        "Aceeași regulă pe tot dashboard-ul: unitatea variației depinde de tipul indicatorului",
        "The same rule across the dashboard: the unit of the change depends on the type of indicator",
      ),
      `<div class="tbl"><table class="lt"><thead><tr><th>${tl("Tipul indicatorului", "Type of indicator")}</th>` +
        `<th>${tl("Exemple", "Examples")}</th><th>${tl("Cum se scrie variația", "How the change is shown")}</th>` +
        `<th>${tl("Exemplu", "Example")}</th></tr></thead><tbody>
  <tr>` +
        `<td>${tl("Sume și numere", "Amounts and counts")}</td><td>${tl("prime, profit, polițe, angajați, dosare", "premium, profit, policies, employees, claim files")}</td>` +
        `<td>${tl("procent relativ (%)", "relative percentage (%)")}</td>` +
        `<td>${sgnPct(0.084)} ${vs}</td></tr>
  <tr><td>${tl("Indicatori exprimați în procente", "Indicators expressed as percentages")}</td>` +
        `<td>${tl("combined ratio, rata daunei, ROE, solvabilitate, plecări", "combined ratio, loss ratio, ROE, solvency, attrition")}</td>` +
        `<td>${tl("puncte procentuale (pp)", "percentage points (pp)")}</td>` +
        `<td>${pp(-0.078)} ${vs}</td></tr>
  <tr><td>${tl("Scoruri", "Scores")}</td>` +
        `<td>${tl("NPS, eNPS, engagement, satisfacție 1–5", "NPS, eNPS, engagement, satisfaction 1–5")}</td>` +
        `<td>${tl("puncte", "points")}</td><td>+${ptsU(3.8, 1)} ${vs}</td></tr>
  ` +
        `<tr><td>${tl("Durate", "Durations")}</td><td>${tl("timp de soluționare, timp de angajare", "settlement time, time to hire")}</td>` +
        `<td>${tl("zile", "days")}</td><td>−${dayU(1)} ${vs}</td></tr>
  ` +
        `<tr><td>${tl("Valori în euro pe unitate", "Euro values per unit")}</td>` +
        `<td>${tl("severitate, EPS, prețul acțiunii", "severity, EPS, share price")}</td>` +
        `<td>${tl("procent relativ (%)", "relative percentage (%)")}</td>` +
        `<td>${sgnPct(0.031)} ${vs}</td></tr></tbody></table></div>
  ` +
        `<p class="sub" style="margin-top:10px">${tl("Culoarea spune dacă variația e bună (verde) sau rea (roșu) pentru companie, nu dacă cifra crește sau scade: la combined ratio, o scădere e verde. Gri înseamnă că variația nu e nici bună, nici rea în sine, de exemplu numărul de dosare. Al doilea rând gri apare doar când e nevoie de context: pentru valorile de la o anumită dată („la sfârșitul lui 2025”) și pentru perioadele de mai mulți ani („total”, „medie anuală”).", "The colour tells you whether the change is good (green) or bad (red) for the company, not whether the figure goes up or down: for the combined ratio, a fall is green. Grey means the change is neither good nor bad in itself, for example the number of claim files. The second grey line appears only when context is needed: for values at a given date (“at the end of 2025”) and for multi-year periods (“total”, “annual average”).")}</p>`,
    ),
    win(
      "s12",
      tl("Dicționarul de date", "Data dictionary"),
      "Dicționar de date",
      tl(
        "Toate coloanele din fișierul Excel, cu explicația lor. Caută după nume sau după cuvinte din descriere",
        "Every column in the Excel file, with its explanation. Search by name or by words in the description",
      ),
      dictUI,
    ),
    note(
      tl(
        `Setul de date are 11 tabele și ${nf0.format(rowsT)} de rânduri, legate prin cinci dimensiuni comune: timp, geografie, produs, canal și departament. ` +
          `Înainte de orice analiză, un analist verifică trei lucruri: ce reprezintă un rând (granularitatea), ce tabele se pot combina (matricea de legături) și unde datele sunt estimări sau au limite. ` +
          `Toate trei sunt pe acest ecran.`,
        `The dataset has 11 tables and ${nf0.format(rowsT)} rows, connected through five shared dimensions: time, geography, product, channel and department. ` +
          `Before any analysis, an analyst checks three things: what one row represents (the grain), which tables can be combined (the bus matrix) and where the data is estimated or limited. ` +
          `All three are on this screen.`,
      ),
    ),
  ].join("");
  const after = () => {
    const qEl = document.getElementById("dq"),
      tEl = document.getElementById("dt"),
      body = document.getElementById("dbody"),
      cnt = document.getElementById("dcount");
    const draw = () => {
      const s = qEl.value.trim().toLowerCase(),
        t = tEl.value;
      const L = D.dict
        .map(dictRow)
        .filter((r) => (!t || r[0] === t) && (!s || r.join(" ").toLowerCase().includes(s)));
      body.innerHTML =
        L.map(
          (r) =>
            `<tr><td style="text-align:left">${esc(r[0])}</td><td style="text-align:left"><code>${esc(r[1])}</code></td>` +
            `<td style="text-align:left">${esc(r[2])}</td><td style="text-align:left">${esc(r[3])}</td>` +
            `<td style="text-align:left;white-space:normal">${esc(r[4])}</td></tr>`,
        ).join("") ||
        `<tr><td colspan="5" style="text-align:left;color:var(--ink-3)">${tl("Nicio coloană nu se potrivește. Încearcă alt cuvânt.", "No column matches. Try another word.")}</td></tr>`;
      cnt.textContent = tl(
        `${L.length} din ${D.dict.length} coloane`,
        `${L.length} of ${D.dict.length} columns`,
      );
    };
    qEl.oninput = draw;
    tEl.onchange = draw;
    draw();
  };
  return {
    t: tl("Despre date", "About the data"),
    p: tl(
      "Cu ce date lucrează dashboard-ul, cum se leagă, cum se calculează indicatorii și unde sunt limitele.",
      "What data the dashboard works with, how it connects, how the indicators are calculated and where the limits are.",
    ),
    html,
    after,
  };
};
