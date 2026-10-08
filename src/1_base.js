const D = window.__DATA__;
const EN = window.__EN__ || {};
const Y0 = 2021,
  YEARS = [2021, 2022, 2023, 2024, 2025];
const yOf = (m) => Y0 + Math.floor(m / 12);

/* ---------- language ----------
   LANG is "ro" or "en". First visit: the browser's first preferred language ("ro…" → Romanian, otherwise English).
   A choice made with the RO | EN switch is kept in localStorage ("nv-lang") and wins on later visits.
   tl(ro,en) returns the text for the active language; texts sit next to each other in the code. */
const detectLang = () => {
  try {
    const v = localStorage.getItem("nv-lang");
    if (v === "ro" || v === "en") return v;
  } catch (e) {}
  const l = String(
    (navigator.languages && navigator.languages[0]) || navigator.language || "",
  ).toLowerCase();
  return l.startsWith("ro") ? "ro" : "en";
};
let LANG = detectLang();
const tl = (ro, en) => (LANG === "en" ? en : ro);
/* bi({n_ro:"…",n_en:"…"}) adds a getter n that returns the text in the active language */
const bi = (o) => {
  Object.keys(o).forEach((k) => {
    if (k.endsWith("_ro")) {
      const b = k.slice(0, -3);
      Object.defineProperty(o, b, {
        get() {
          return o[b + "_" + LANG];
        },
        enumerable: true,
      });
    }
  });
  return o;
};
const LOC = () => (LANG === "en" ? "en-GB" : "ro-RO");

/* display names of the data categories (the data itself keeps the English values) */
const CAT = {
  ro: {
    R: ["Europa", "America de Nord", "Asia-Pacific", "America Latină"],
    L: ["Auto", "Locuințe și bunuri", "Viață", "Sănătate", "Riscuri comerciale"],
    C: ["Agenți", "Brokeri", "Online direct", "Bancassurance"],
    D: {
      "Actuarial & Risk": "Actuariat și risc",
      Claims: "Daune",
      "Customer Service": "Relații clienți",
      "Executive & Strategy": "Conducere și strategie",
      Finance: "Financiar",
      HR: "Resurse umane",
      "IT & Digital": "IT și digital",
      "Legal & Compliance": "Juridic și conformitate",
      Operations: "Operațiuni",
      "Sales & Distribution": "Vânzări și distribuție",
      Underwriting: "Subscriere",
    },
    cause: {
      Burglary: "Spargere",
      "Business interruption": "Întreruperea activității",
      Collision: "Coliziune",
      "Critical illness": "Boală gravă",
      Cyber: "Atac cibernetic",
      Death: "Deces",
      Dental: "Stomatologie",
      Disability: "Invaliditate",
      Fire: "Incendiu",
      Glass: "Geamuri",
      Hospitalisation: "Spitalizare",
      Liability: "Răspundere civilă",
      "Marine cargo": "Transport maritim",
      Maternity: "Maternitate",
      Maturity: "Ajungere la termen",
      Outpatient: "Ambulatoriu",
      Pharmacy: "Medicamente",
      "Property damage": "Daune materiale",
      Storm: "Furtună",
      Subsidence: "Tasarea terenului",
      Theft: "Furt",
      "Third-party injury": "Vătămare terți",
      "Water damage": "Inundație din conducte",
    },
    reason: {
      "Better pay elsewhere": "Salariu mai bun în altă parte",
      "Career change": "Schimbare de carieră",
      "Career growth": "Dezvoltare profesională",
      "Manager relationship": "Relația cu managerul",
      Misconduct: "Abatere disciplinară",
      Performance: "Performanță",
      Relocation: "Mutare",
      Restructuring: "Restructurare",
      Retirement: "Pensionare",
      "Workload / burnout": "Volum de muncă / epuizare",
    },
    asset: {
      "Government bonds": "Obligațiuni de stat",
      "Corporate bonds": "Obligațiuni corporative",
      Equities: "Acțiuni",
      "Real estate": "Imobiliare",
      "Cash & money market": "Numerar și piață monetară",
    },
    cat: {
      "Storm Aurel (Central Europe)": "Furtuna Aurel (Europa Centrală)",
      "Hurricane Delphine (US Gulf Coast)": "Uraganul Delphine (Golful Mexic, SUA)",
      "Floods (Southern Brazil)": "Inundații (sudul Braziliei)",
    },
  },
  en: {
    R: ["Europe", "North America", "Asia-Pacific", "Latin America"],
    L: ["Motor", "Property", "Life", "Health", "Commercial"],
    C: ["Agents", "Brokers", "Direct online", "Bancassurance"],
    D: {
      "Actuarial & Risk": "Actuarial & Risk",
      Claims: "Claims",
      "Customer Service": "Customer Service",
      "Executive & Strategy": "Executive & Strategy",
      Finance: "Finance",
      HR: "HR",
      "IT & Digital": "IT & Digital",
      "Legal & Compliance": "Legal & Compliance",
      Operations: "Operations",
      "Sales & Distribution": "Sales & Distribution",
      Underwriting: "Underwriting",
    },
    cause: {
      Burglary: "Burglary",
      "Business interruption": "Business interruption",
      Collision: "Collision",
      "Critical illness": "Critical illness",
      Cyber: "Cyber",
      Death: "Death",
      Dental: "Dental",
      Disability: "Disability",
      Fire: "Fire",
      Glass: "Glass",
      Hospitalisation: "Hospitalisation",
      Liability: "Liability",
      "Marine cargo": "Marine cargo",
      Maternity: "Maternity",
      Maturity: "Maturity",
      Outpatient: "Outpatient",
      Pharmacy: "Pharmacy",
      "Property damage": "Property damage",
      Storm: "Storm",
      Subsidence: "Subsidence",
      Theft: "Theft",
      "Third-party injury": "Third-party injury",
      "Water damage": "Escape of water",
    },
    reason: {
      "Better pay elsewhere": "Better pay elsewhere",
      "Career change": "Career change",
      "Career growth": "Career growth",
      "Manager relationship": "Manager relationship",
      Misconduct: "Misconduct",
      Performance: "Performance",
      Relocation: "Relocation",
      Restructuring: "Restructuring",
      Retirement: "Retirement",
      "Workload / burnout": "Workload / burnout",
    },
    asset: {
      "Government bonds": "Government bonds",
      "Corporate bonds": "Corporate bonds",
      Equities: "Equities",
      "Real estate": "Real estate",
      "Cash & money market": "Cash & money market",
    },
    cat: {
      "Storm Aurel (Central Europe)": "Storm Aurel (Central Europe)",
      "Hurricane Delphine (US Gulf Coast)": "Hurricane Delphine (US Gulf Coast)",
      "Floods (Southern Brazil)": "Floods (Southern Brazil)",
    },
  },
};
let NM = CAT[LANG];
/* the 10 strategic KPIs: l = label (ro/en), t = glossary term (internal key), f = format */
const KPIN = {
  "Combined ratio": { ro: "Combined ratio", en: "Combined ratio", t: "Combined ratio", f: "pct" },
  "GWP growth": {
    ro: "Creșterea primelor brute",
    en: "GWP growth",
    t: "Prime brute subscrise",
    f: "pct",
  },
  "Return on equity": { ro: "ROE", en: "ROE", t: "Rentabilitatea capitalurilor proprii", f: "pct" },
  "Solvency II ratio (year-end)": {
    ro: "Rata de solvabilitate",
    en: "Solvency ratio",
    t: "Rata de solvabilitate",
    f: "pct0",
  },
  "Digital share of new policies": {
    ro: "Cota online din polițele noi",
    en: "Digital share of new policies",
    t: "Canal de distribuție",
    f: "pct",
  },
  "Customer NPS": { ro: "NPS clienți", en: "Customer NPS", t: "NPS clienți", f: "n1" },
  "Median claim settlement (days)": {
    ro: "Timp median de soluționare",
    en: "Median claim settlement time",
    t: "Timp de soluționare",
    f: "days",
  },
  "Employee engagement (0-100)": {
    ro: "Engagement angajați",
    en: "Employee engagement",
    t: "Engagement",
    f: "n1",
  },
  "Voluntary attrition": {
    ro: "Plecări voluntare",
    en: "Voluntary attrition",
    t: "Plecări voluntare",
    f: "pct",
  },
  "Women in senior leadership (L5+)": {
    ro: "Femei în conducere (L5+)",
    en: "Women in senior leadership (L5+)",
    t: "Diferență salarială de gen",
    f: "pct",
  },
};
Object.values(KPIN).forEach((k) =>
  Object.defineProperty(k, "l", {
    get() {
      return k[LANG];
    },
  }),
);

/* ---------- number formats (Romanian: 11,6 mld € · 87,7% · English: €11.6bn · 87.7%) ---------- */
let nf1, nf0, nf2;
function setFormats() {
  nf1 = new Intl.NumberFormat(LOC(), { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  nf0 = new Intl.NumberFormat(LOC(), { maximumFractionDigits: 0 });
  nf2 = new Intl.NumberFormat(LOC(), { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}
setFormats();
/* amounts are stored in thousands of EUR */
const eurK = (k) => {
  const s = k < 0 ? "−" : "";
  const a = Math.abs(k);
  if (LANG === "en") {
    if (a === 0) return "€0";
    if (a >= 1e6) return s + "€" + nf1.format(a / 1e6) + "bn";
    if (a >= 1e3) return s + "€" + nf0.format(a / 1e3) + "m";
    return s + "€" + nf0.format(a) + "k";
  }
  if (a >= 1e6) return s + nf1.format(a / 1e6) + " mld €";
  if (a >= 1e3) return s + nf0.format(a / 1e3) + " mil €";
  return s + nf0.format(a) + " mii €";
};
const eurKd = (k) => {
  const a = Math.abs(k);
  if (LANG === "en") {
    const s = k < 0 ? "−" : "";
    if (a >= 1e6) return s + "€" + nf2.format(a / 1e6) + "bn";
    if (a >= 1e3) return s + "€" + nf1.format(a / 1e3) + "m";
    return s + "€" + nf0.format(a) + "k";
  }
  if (a >= 1e6) return nf2.format(k / 1e6) + " mld €";
  if (a >= 1e3) return nf1.format(k / 1e3) + " mil €";
  return nf0.format(k) + " mii €";
};
/* a formatted number with the euro sign in the right place: "12,34 €" / "€12.34" */
const eurS = (s) => (LANG === "en" ? "€" + s : s + " €");
const pct = (x, d = 1) => (x == null || !isFinite(x) ? "–" : (d ? nf1 : nf0).format(x * 100) + "%");
const pp = (x) => (x >= 0 ? "+" : "−") + nf1.format(Math.abs(x * 100)) + " pp";
const sgnPct = (x) => (x >= 0 ? "+" : "−") + nf1.format(Math.abs(x * 100)) + "%";
const isOne = (f) => f === "1" || f === "1,0" || f === "1.0";
const dayU = (v, d = 0) => {
  const f = (d === 1 ? nf1 : nf0).format(v);
  return f + (isOne(f) ? tl(" zi", " day") : tl(" zile", " days"));
};
const fmtK = (v, f) =>
  f === "pct" ? pct(v) : f === "pct0" ? pct(v, 0) : f === "days" ? dayU(v) : nf1.format(v);
/* quarters are stored as 2025-Q3; Romanian shows 2025-T3 */
const qLab = (s) => (LANG === "en" ? String(s) : String(s).replace(/-Q(\d)/, "-T$1"));
const MONTHS = () =>
  tl(
    ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug", "sep", "oct", "nov", "dec"],
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  );
const sum = (a) => a.reduce((s, x) => s + x, 0);
const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
  );

/* ---------- glossary ----------
   GL is keyed by the Romanian term (an internal id used by q("…") all over the screens).
   English texts come from src/i18n_en.json (window.__EN__.gl, keyed by the same Romanian term). */
const GL = {};
D.gl.forEach(([t, en, dom, def, f]) => (GL[t] = { t, en, dom, def, f }));
const glDomName = (d) => (LANG === "en" ? (EN.glDom || {})[d] || d : d);
/* the glossary entry as shown in the active language: name, secondary name, domain, definition, formula/example */
const glShow = (g) => {
  if (LANG !== "en") return { name: g.t, alt: g.en, dom: g.dom, def: g.def, f: g.f };
  const e = (EN.gl || {})[g.t] || {};
  return {
    name: e.t || g.en,
    alt: "",
    dom: glDomName(g.dom),
    def: e.def || g.def,
    f: e.f != null ? e.f : g.f,
  };
};
let screenTerms = new Set();
const q = (t) => {
  if (!GL[t]) {
    console.warn("missing glossary term", t);
    return "";
  }
  screenTerms.add(t);
  return `<button class="q" data-term="${esc(t)}" aria-label="${tl("Ce înseamnă", "What does it mean")}: ${esc(glShow(GL[t]).name)}" aria-expanded="false">?</button>`;
};
