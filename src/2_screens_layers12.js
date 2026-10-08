/* ---------- state & periods ---------- */
const DOMS = [
  { id: "sin", n_ro: "Sinteză", n_en: "Overview", f: [] },
  {
    id: "bus",
    n_ro: "Business și produse",
    n_en: "Business & products",
    f: ["region", "line", "channel"],
  },
  { id: "dau", n_ro: "Daune", n_en: "Claims", f: ["region", "line"] },
  { id: "oam", n_ro: "Oameni", n_en: "People", f: ["region"] },
  { id: "fin", n_ro: "Financiar și investitori", n_en: "Finance & investors", f: [] },
  { id: "seg", n_ro: "Segmente", n_en: "Segments", f: ["region", "line", "channel"] },
].map(bi);
const LAYERS = [
  { n_ro: "Ce s-a întâmplat", n_en: "What happened", s_ro: "descriptiv", s_en: "descriptive" },
  { n_ro: "De ce", n_en: "Why", s_ro: "diagnostic", s_en: "diagnostic" },
  { n_ro: "Ce urmează", n_en: "What's next", s_ro: "predictiv", s_en: "predictive" },
  { n_ro: "Ce facem", n_en: "What we do", s_ro: "scenarii", s_en: "scenarios" },
].map(bi);
const S = {
  dom: "sin",
  layer: 1,
  from: 2025,
  to: 2025,
  cmp: "prev",
  region: -1,
  line: -1,
  channel: -1,
  segDim: "region",
};
const dom = () => DOMS.find((d) => d.id === S.dom);
const on = (k) => S.layer < 4 && dom().f.includes(k) && !(S.dom === "seg" && k === S.segDim);
const lbl = (a, b) => (a === b ? String(a) : `${a}–${b}`);
const P = () => ({ from: S.from, to: S.to, n: S.to - S.from + 1, lab: lbl(S.from, S.to) });
function CP() {
  if (S.cmp === "none") return null;
  const n = S.to - S.from + 1;
  if (S.cmp === "prev") {
    const f = S.from - n,
      t = S.from - 1;
    return f < Y0 ? null : { from: f, to: t, n, lab: lbl(f, t) };
  }
  const y = +S.cmp;
  return { from: y, to: y, n: 1, lab: String(y) };
}
const inR = (y, R) => R && y >= R.from && y <= R.to;
const isAll = () => S.from === Y0 && S.to === 2025;
const pw = () => (P().n > 1 ? tl("în perioada ", "over ") + P().lab : tl("în ", "in ") + P().lab);
function cmpTxt(C, ann) {
  return C
    ? `${tl("față de", "vs")} ${C.lab}${ann ? tl(" (medie anuală)", " (annual average)") : ""}`
    : "";
}
/* delta: kind pct (relative), pp (percentage points), abs (fmt function) */
function dl(cur, base, { kind = "pct", good = "up", fmt, ann = false } = {}) {
  const C = CP();
  if (!C || base == null || !isFinite(base) || cur == null) return ["", ""];
  let c = cur,
    b = base;
  if (ann) {
    c = cur / P().n;
    b = base / C.n;
  }
  let t, diff;
  if (kind === "pct") {
    diff = c / b - 1;
    t = sgnPct(diff);
  } else if (kind === "pp") {
    diff = c - b;
    t = pp(diff);
  } else {
    diff = c - b;
    t = (diff >= 0 ? "+" : "−") + fmt(Math.abs(diff));
  }
  const cls = good == null ? "" : (good === "up" ? diff >= 0 : diff <= 0) ? "good" : "bad";
  return [`${t} ${cmpTxt(C, ann && P().n !== C.n)}`, cls];
}
const ptsU = (v, d) => {
  const f = (d === 2 ? nf2 : d === 1 ? nf1 : nf0).format(v);
  return f + (isOne(f) ? tl(" punct", " point") : tl(" puncte", " points"));
};
const zileU = (v, d) => dayU(v, d);
const cagr = (a, b, n) => Math.pow(b / a, 1 / (n - 1)) - 1;

/* ---------- data helpers ---------- */
const regionOn = () => (on("region") || on("region0")) && S.region >= 0;
const uwF = (r, { useRegion = true, useLine = true, useChan = true } = {}) =>
  (!useRegion || !on("region") || S.region < 0 || r[1] === S.region) &&
  (!useLine || !on("line") || S.line < 0 || r[2] === S.line) &&
  (!useChan || !on("channel") || S.channel < 0 || r[3] === S.channel);
function uwAgg(pred) {
  const o = { gwp: 0, nep: 0, clm: 0, acq: 0, adm: 0, pifSum: 0, nw: 0, lap: 0, cfx: 0 };
  D.uw.forEach((r) => {
    if (!pred(r)) return;
    o.gwp += r[4];
    o.nep += r[5];
    o.clm += r[6];
    o.acq += r[7];
    o.adm += r[8];
    o.pifSum += r[9];
    o.nw += r[10];
    o.lap += r[11];
    o.cfx += r[12];
  });
  o.lr = o.clm / o.nep;
  o.er = (o.acq + o.adm) / o.nep;
  o.cr = o.lr + o.er;
  o.lapse = o.lap / (o.pifSum / 12);
  return o;
}
const uwR = (R, opt) => (R ? uwAgg((r) => inR(yOf(r[0]), R) && uwF(r, opt)) : null);
const uwY = (y, opt) => uwAgg((r) => yOf(r[0]) === y && uwF(r, opt));
const pifEnd = (R, opt) =>
  R ? uwAgg((r) => r[0] === (R.to - Y0) * 12 + 11 && uwF(r, opt)).pifSum : null;
const clF = (r) =>
  (!on("region") || S.region < 0 || r[1] === S.region) &&
  (!on("line") || S.line < 0 || r[2] === S.line);
function clAgg(pred) {
  const o = { n: 0, amt: 0, closed: 0, rej: 0, op: 0, ds: 0, dn: 0, fr: 0, cs: 0, csn: 0 };
  D.cl.forEach((r) => {
    if (!pred(r)) return;
    o.n += r[3];
    o.amt += r[4];
    o.closed += r[5];
    o.rej += r[6];
    o.op += r[7];
    o.ds += r[8];
    o.dn += r[9];
    o.fr += r[10];
    o.cs += r[11];
    o.csn += r[12];
  });
  o.days = o.ds / o.dn;
  o.sev = o.amt / o.n;
  o.csat = o.cs / o.csn;
  o.frate = o.fr / o.n;
  return o;
}
const clR = (R) => (R ? clAgg((r) => inR(yOf(r[0]), R) && clF(r)) : null);
const hrF = (r) => !on("region") || S.region < 0 || r[1] === S.region;
function hrAggP(yPred, pred = () => true, useF = true) {
  const o = { hs: 0, he: 0, hi: 0, vol: 0, inv: 0, ret: 0, avg: 0 };
  D.hr.forEach((r) => {
    if (!yPred(r[0]) || (useF && !hrF(r)) || !pred(r)) return;
    o.hi += r[5];
    o.vol += r[6];
    o.inv += r[7];
    o.ret += r[8];
    o.avg += (r[3] + r[4]) / 2;
  });
  o.vr = o.vol / o.avg;
  o.tr = (o.vol + o.inv + o.ret) / o.avg;
  return o;
}
const hrAgg = (y, pred) => hrAggP((z) => z === y, pred);
const hrR = (R, pred) => (R ? hrAggP((z) => inR(z, R), pred) : null);
const hcEnd = (R, pred = () => true) =>
  R ? sum(D.hr.filter((r) => r[0] === R.to && hrF(r) && pred(r)).map((r) => r[4])) : null;
function engP(yPred, pred = () => true, useF = true) {
  let w = 0,
    a = { eng: 0, enps: 0, mgr: 0, work: 0, car: 0, pay: 0, part: 0 };
  D.eng.forEach((r) => {
    if (!yPred(r[0]) || (useF && !hrF(r)) || !pred(r)) return;
    const n = r[3];
    w += n;
    a.part += r[4] * n;
    a.eng += r[5] * n;
    a.enps += r[6] * n;
    a.mgr += r[7] * n;
    a.work += r[8] * n;
    a.car += r[9] * n;
    a.pay += r[10] * n;
  });
  for (const k in a) a[k] /= w;
  return a;
}
const engAgg = (y, pred) => engP((z) => z === y, pred);
const engR = (R) => (R ? engP((z) => inR(z, R)) : null);
const kpi = (name, y) => {
  const K = D.kpi;
  for (let i = 0; i < K.year.length; i++)
    if (K.kpi[i] === name && K.year[i] === y)
      return { t: K.target[i], a: K.actual[i], dir: K.direction[i] };
};
const kpiAvg = (name, R) => {
  if (!R) return null;
  const v = [];
  for (let y = R.from; y <= R.to; y++) v.push(kpi(name, y).a);
  return sum(v) / v.length;
};
const met = (k) => (k.dir.startsWith("lower") ? k.a <= k.t : k.a >= k.t);
const finQ = (R, key) =>
  D.fin.quarter
    .map((q, i) => (inR(+q.slice(0, 4), R) ? D.fin[key][i] : null))
    .filter((x) => x != null);
const finR = (R, key, how = "sum") => {
  if (!R) return null;
  const v = finQ(R, key);
  return how === "last" ? v[v.length - 1] : how === "mean" ? sum(v) / v.length : sum(v);
};
const finYear = (y, key, how) => finR({ from: +y, to: +y }, key, how);
const roeR = (R) =>
  R
    ? finR(R, "net_income_eur") / (R.to - R.from + 1) / finR(R, "shareholders_equity_eur", "mean")
    : null;

/* ---------- charts ---------- */
let charts = [];
function pal() {
  return {
    ink: css("--ink"),
    ink2: css("--ink-2"),
    ink3: css("--ink-3"),
    line: css("--line"),
    panel: css("--panel"),
    good: css("--good"),
    bad: css("--bad"),
    warn: css("--warn"),
    accent: css("--accent"),
    soft: css("--accent-soft"),
    s: [css("--s1"), css("--s2"), css("--s3"), css("--s4"), css("--s5"), css("--s6")],
  };
}
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const bandPlugin = {
  id: "band",
  beforeDatasetsDraw(ch, args, opts) {
    if (!opts || !opts.on) return;
    const xs = ch.scales.x;
    if (!xs || xs.type !== "category") return;
    const L = ch.data.labels;
    let a = -1,
      b = -1;
    L.forEach((l, i) => {
      const y = parseInt(String(l).slice(0, 4));
      if (y >= S.from && y <= S.to) {
        if (a < 0) a = i;
        b = i;
      }
    });
    if (a < 0) return;
    const w = L.length > 1 ? xs.getPixelForValue(1) - xs.getPixelForValue(0) : xs.width;
    const { top, bottom, left, right } = ch.chartArea;
    const x0 = Math.max(left, xs.getPixelForValue(a) - w / 2),
      x1 = Math.min(right, xs.getPixelForValue(b) + w / 2);
    const c = ch.ctx;
    c.save();
    c.fillStyle = opts.color;
    c.fillRect(x0, top, x1 - x0, bottom - top);
    c.restore();
  },
};
function mk(id, cfg, band) {
  const el = document.getElementById(id);
  if (!el || !window.Chart) return;
  const P = pal();
  if (!Chart.registry.plugins.get("band")) Chart.register(bandPlugin);
  Chart.defaults.font.family = css("--sans") || "sans-serif";
  Chart.defaults.color = P.ink2;
  Chart.defaults.borderColor = P.line;
  cfg.options = cfg.options || {};
  const o = cfg.options;
  o.responsive = true;
  o.maintainAspectRatio = false;
  if (reduceMotion) o.animation = false;
  o.plugins = o.plugins || {};
  o.plugins.legend = Object.assign(
    {
      position: "bottom",
      labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, color: P.ink2 },
    },
    o.plugins.legend || {},
  );
  o.plugins.tooltip = Object.assign(
    {
      backgroundColor: P.panel,
      titleColor: P.ink,
      bodyColor: P.ink2,
      borderColor: P.line,
      borderWidth: 1,
      padding: 10,
    },
    o.plugins.tooltip || {},
  );
  o.plugins.band = { on: !!band && !isAll(), color: P.soft };
  if (o.scales)
    for (const k in o.scales) {
      const s = o.scales[k];
      s.grid = Object.assign({ color: P.line, drawTicks: false }, s.grid || {});
      s.border = { display: false };
      s.ticks = Object.assign({ color: P.ink3, padding: 6 }, s.ticks || {});
    }
  charts.push(new Chart(el, cfg));
}
const tickEur = (v) => eurK(v);
const tickPct = (v) => nf0.format(v * 100) + "%";
const inCol = (y, P1) => (y >= S.from && y <= S.to ? P1.s[0] : P1.s[0] + "66");

/* ---------- UI pieces ---------- */
const card = (label, term, val, d, d2) =>
  `<div class="card"><div class="l">${label} ${term ? q(term) : ""}` +
  `</div><div class="v num">${val}</div><div class="d ${(d && d[1]) || ""}">${(d && d[0]) || "&nbsp;"}` +
  `</div>${d2 ? `<div class="d2">${d2}</div>` : ""}</div>`;
const win = (span, title, term, sub, body) =>
  `<section class="w ${span}" data-title="${esc(title)}"><h2>${title} ${term ? q(term) : ""}<button class="xb" data-explain="${esc(title)}" aria-label="${tl(`Explică fereastra ${esc(title)} în chat`, `Explain the ${esc(title)} window in the chat`)}">${tl("Explică", "Explain")}</button></h2>${sub ? `<p class="sub">${sub}</p>` : ""}${body}` +
  `</section>`;
const cv = (id, tall) =>
  `<div class="chart ${tall ? "tall" : ""}"><canvas id="${id}" role="img" aria-label="${tl("grafic", "chart")}"></canvas>` +
  `</div>`;
let noteOpen = false;
function noteInner(t) {
  const parts = t.split(
    LANG === "en" ? /(?<=[.:!?])\s+(?=[A-Z“])/ : /(?<=[.:!?])\s+(?=[A-ZĂÂÎȘȚ„])/,
  );
  const head = parts.shift(),
    rest = parts.join(" ");
  const sg = suggFor(curKey)
    .map((s) => `<button type="button" class="nsug" data-ask="${esc(s)}">${esc(s)}</button>`)
    .join("");
  return `<div class="nh"><h3>${tl("Nota analistului", "Analyst’s note")}</h3>${rest || sg ? `<button type="button" class="ntog" aria-expanded="${noteOpen}">${noteTogTxt()}</button>` : ""}</div><p class="nlead">${head}</p>${
    rest || sg
      ? `<div class="nmore" ${noteOpen ? "" : "hidden"}>${rest ? `<p>${rest}</p>` : ""}${sg ? `<div class="nexp"><span>${tl("De explorat mai departe, în chat:", "Explore further in the chat:")}</span>${sg}</div>` : ""}` +
        `</div>`
      : ""
  }`;
}
const note = (t) => `<div class="note">${noteInner(t)}</div>`;
function heat(v, lo, mid, hi, higherBad = true) {
  if (v == null || !isFinite(v)) return "";
  let t = (v - mid) / ((v > mid ? hi : lo) - mid);
  t = Math.max(-1, Math.min(1, Math.abs(t))) * (v > mid ? 1 : -1);
  const bad = higherBad ? t > 0 : t < 0;
  const a = Math.round(Math.abs(t) * 55) + 5;
  return `background:color-mix(in srgb, var(${bad ? "--bad" : "--good"}) ${a}%, transparent)`;
}
const ic = (y) => (y >= S.from && y <= S.to ? "inp" : "");
const slice = () => {
  const p = [];
  if (on("region") && S.region >= 0) p.push(NM.R[S.region]);
  if (on("line") && S.line >= 0) p.push(LANG === "en" ? NM.L[S.line] : NM.L[S.line].toLowerCase());
  if (on("channel") && S.channel >= 0)
    p.push(tl("canal " + NM.C[S.channel].toLowerCase(), NM.C[S.channel] + " channel"));
  return p.length ? p.join(", ") : tl("tot grupul", "the whole group");
};
const noCmp = () =>
  CP()
    ? ""
    : tl(
        "Alege o perioadă de comparație ca să vezi evoluția.",
        "Choose a comparison period to see the change.",
      );
const flowNote = () => (P().n > 1 ? tl("total pe perioadă", "total for the period") : "");

/* ---------- screens ---------- */
const SCR = {};
const SUGG = {
  sin1: [
    "Care sunt cele mai importante 3 concluzii de pe acest ecran?",
    "De ce ratează compania ținta la plecări voluntare?",
    "Cum a evoluat combined ratio în cei 5 ani?",
  ],
  sin2: [
    "Ce explică cea mai mare abatere față de țintă?",
    "Ce legătură e între plecări și satisfacția clienților?",
    "Care regiune a contribuit cel mai mult la creștere?",
  ],
  bus1: [
    "Care canal de vânzare crește cel mai repede?",
    "Cum diferă mixul de produse între regiuni?",
    "Ce înseamnă rata de pierdere a polițelor aici?",
  ],
  bus2: [
    "De ce pierde bani linia auto din America Latină?",
    "Cât din creștere vine din cursul valutar?",
    "Unde suntem cel mai mult sub buget?",
  ],
  dau1: [
    "Ce a produs vârfurile din rata daunei?",
    "Care sunt cauzele cele mai costisitoare?",
    "De ce diferă atât de mult severitatea între linii?",
  ],
  dau2: [
    "Cât au costat evenimentele catastrofale?",
    "De ce a crescut timpul de soluționare în Europa în 2023?",
    "Frauda a crescut sau doar e detectată mai bine?",
  ],
  oam1: [
    "Care departamente pierd cei mai mulți oameni?",
    "Ce spune sondajul despre echitatea salarială?",
    "Cât de eficientă e recrutarea?",
  ],
  oam2: [
    "Ce s-a întâmplat cu echipa de daune din Europa?",
    "Unde e cea mai mare diferență salarială de gen?",
    "Ce legătură e între engagement și plecări?",
  ],
  fin1: [
    "Cum au afectat catastrofele profitul?",
    "Este solvabilitatea confortabilă?",
    "Cum au evoluat dividendele?",
  ],
  fin2: [
    "Cât din profit vine din investiții?",
    "De ce au apărut pierderi nerealizate în 2022?",
    "Cum s-au schimbat randamentele obligațiunilor?",
  ],
};
/* suggested chat questions in English, for all 25 screens (the Romanian ones are in SUGG, spread over the screen files) */
const SUGG_EN = {
  sin1: [
    "What are the 3 most important takeaways on this screen?",
    "Why is the company missing its voluntary attrition target?",
    "How has the combined ratio developed over the 5 years?",
  ],
  sin2: [
    "What explains the largest deviation from target?",
    "How are attrition and customer satisfaction linked?",
    "Which region contributed most to growth?",
  ],
  sin3: [
    "How reliable are these forecasts?",
    "What could derail the 2026 forecast?",
    "Will we hit the combined ratio target in 2026?",
  ],
  sin4: [
    "Which lever has the biggest impact on profit?",
    "What combination would get us to an 18% ROE?",
    "Walk me through the waterfall chart",
  ],
  bus1: [
    "Which distribution channel is growing fastest?",
    "How does the product mix differ between regions?",
    "What does the lapse rate mean here?",
  ],
  bus2: [
    "Why is the Latin America motor line losing money?",
    "How much of the growth comes from exchange rates?",
    "Where are we furthest below budget?",
  ],
  bus3: [
    "Which region will grow fastest in 2026?",
    "Why is the forecast interval wider for some series?",
    "What does seasonality mean in this chart?",
  ],
  bus4: [
    "What is the optimal price increase for the selected line?",
    "How sensitive is the result to elasticity?",
    "What do we risk if we raise prices too much?",
  ],
  dau1: [
    "What caused the spikes in the loss ratio?",
    "Which claim causes are the most expensive?",
    "Why does severity differ so much between lines?",
  ],
  dau2: [
    "How much did the catastrophe events cost?",
    "Why did settlement time rise in Europe in 2023?",
    "Has fraud increased, or is it just detected better?",
  ],
  dau3: [
    "What is the difference between the attritional and the total loss ratio?",
    "How much should we allow for catastrophes in 2026?",
    "In which months are claims highest?",
  ],
  dau4: [
    "What size of catastrophe would take solvency below 150%?",
    "Is a lower reinsurance retention worth it?",
    "How much do we save from fraud detection?",
  ],
  oam1: [
    "Which departments lose the most people?",
    "What does the survey say about pay fairness?",
    "How efficient is recruitment?",
  ],
  oam2: [
    "What happened to the claims team in Europe?",
    "Where is the gender pay gap largest?",
    "How are engagement and attrition linked?",
  ],
  oam3: [
    "Which teams have the highest attrition risk in 2026?",
    "How many people do we need to hire in 2026?",
    "What is the risk score based on?",
  ],
  oam4: [
    "Is the retention programme worth it for the selected team?",
    "What effect would it have on customers?",
    "Which assumption drives the result the most?",
  ],
  fin1: [
    "How did catastrophes affect profit?",
    "Is solvency comfortable?",
    "How have dividends developed?",
  ],
  fin2: [
    "How much of the profit comes from investments?",
    "Why did unrealised losses appear in 2022?",
    "How have bond yields changed?",
  ],
  fin3: [
    "What net profit do we expect for 2026?",
    "How much of the profit depends on catastrophes?",
    "How will solvency develop?",
  ],
  fin4: [
    "Which shock would be most dangerous for solvency?",
    "Why do rising interest rates reduce capital?",
    "Which stress test does the company pass comfortably?",
  ],
  seg1: [
    "Which segment brings in the most money, and which one loses money?",
    "Why does the average premium differ so much between segments?",
    "Which segment deserves more attention?",
  ],
  seg2: [
    "What does the mix analysis say?",
    "Which quadrant is each segment in, and what does it mean?",
    "Does growth come from the strong segments or the weak ones?",
  ],
  seg3: [
    "Which segment will grow fastest in 2026?",
    "Will the portfolio mix change in 2026?",
    "Which segment has the most uncertainty?",
  ],
  seg4: [
    "Which reallocation would improve the combined ratio the most?",
    "How much premium does shrinking the weak segment cost?",
    "What are the risks of such a reallocation?",
  ],
  dat1: [
    "Which tables feed the Claims screen?",
    "Why are some figures estimates from a sample?",
    "What are the limits of the salary data?",
  ],
};
const suggFor = (k) => (LANG === "en" ? SUGG_EN[k] : SUGG[k]) || [];

SCR.sin1 = () => {
  const Pp = P(),
    C = CP(),
    y = S.to;
  const u = uwAgg((r) => inR(yOf(r[0]), Pp)),
    uc = C ? uwAgg((r) => inR(yOf(r[0]), C)) : null;
  const names = Object.keys(KPIN);
  const k = (n) => kpi(n, y);
  const metN = names.filter((n) => met(k(n))).length;
  const roe = roeR(Pp),
    roec = roeR(C),
    sol = finR(Pp, "solvency_ii_ratio", "last"),
    solc = finR(C, "solvency_ii_ratio", "last");
  const nps = kpiAvg("Customer NPS", Pp),
    npsc = kpiAvg("Customer NPS", C);
  const va = hrAggP(
      (z) => inR(z, Pp),
      () => true,
      false,
    ).vr,
    vac = C
      ? hrAggP(
          (z) => inR(z, C),
          () => true,
          false,
        ).vr
      : null;
  const g0 = uwY(Pp.from).gwp,
    g1 = uwY(Pp.to).gwp;
  const annA = tl("medie anuală", "annual average");
  const rows = names
    .map((n) => {
      const x = k(n),
        m = met(x),
        f = KPIN[n].f;
      return `<tr><td><span class="dot" style="background:var(${m ? "--good" : "--bad"})"></span>${KPIN[n].l} ${q(KPIN[n].t)}</td><td class="num">${fmtK(x.t, f)}</td><td class="${m ? "good" : "bad"}">${m ? tl("atinsă", "met") : tl("ratată", "missed")}</td>${YEARS.map(
        (yy) => {
          const z = kpi(n, yy);
          return `<td class="num ${ic(yy)}" style="color:var(${met(z) ? "--ink-2" : "--bad"})${yy === y ? ";font-weight:600" : ""}">${fmtK(z.a, f)}</td>`;
        },
      ).join("")}</tr>`;
    })
    .join("");
  const worst = names
    .map((n) => {
      const x = k(n);
      const g = (x.dir.startsWith("lower") ? x.t - x.a : x.a - x.t) / Math.abs(x.t);
      return [n, g];
    })
    .sort((a, b) => a[1] - b[1])[0];
  const worstL = LANG === "en" ? KPIN[worst[0]].l : KPIN[worst[0]].l.toLowerCase();
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Prime brute subscrise", "Gross written premium"),
      "Prime brute subscrise",
      eurK(u.gwp),
      dl(u.gwp, uc && uc.gwp, { ann: true }),
      Pp.n > 1
        ? tl(
            `total; CAGR ${sgnPct(cagr(g0, g1, Pp.n))} pe an`,
            `total; CAGR ${sgnPct(cagr(g0, g1, Pp.n))} a year`,
          )
        : "",
    ),
    card(
      "Combined ratio",
      "Combined ratio",
      pct(u.cr),
      dl(u.cr, uc && uc.cr, { kind: "pp", good: "down" }),
    ),
    card(
      "ROE",
      "Rentabilitatea capitalurilor proprii",
      pct(roe),
      dl(roe, roec, { kind: "pp" }),
      Pp.n > 1 ? annA : "",
    ),
    card(
      tl("Solvabilitate", "Solvency ratio"),
      "Rata de solvabilitate",
      pct(sol, 0),
      dl(sol, solc, { kind: "pp" }),
      tl(`la sfârșitul lui ${y}`, `at the end of ${y}`),
    ),
    card(
      tl("NPS clienți", "Customer NPS"),
      "NPS clienți",
      nf1.format(nps),
      dl(nps, npsc, { kind: "abs", fmt: (v) => ptsU(v, 1) }),
      Pp.n > 1 ? annA : "",
    ),
    card(
      tl("Plecări voluntare", "Voluntary attrition"),
      "Plecări voluntare",
      pct(va),
      dl(va, vac, { kind: "pp", good: "down" }),
      Pp.n > 1 ? annA : "",
    ),
    `</div>`,
    win(
      "s7",
      tl("Tabloul de bord strategic", "Strategic scorecard"),
      "KPI",
      tl(
        `Ținta și statusul pentru ${y}, ultimul an al perioadei; coloanele marcate sus sunt anii perioadei selectate`,
        `Target and status for ${y}, the last year of the period; the highlighted columns are the years of the selected period`,
      ),
      `<div class="tbl"><table><thead><tr><th>${tl("Indicator", "KPI")}</th>` +
        `<th>${tl("Ținta", "Target")} ${y}</th><th></th>${YEARS.map((z) => `<th class="${ic(z)}">${z}</th>`).join("")}</tr>` +
        `</thead><tbody>${rows}</tbody></table></div>`,
    ),
    win(
      "s5",
      tl("Prime brute și combined ratio", "Gross written premium and combined ratio"),
      "Combined ratio",
      tl(
        "Barele: primele pe an. Linia: combined ratio (axa din dreapta); sub 100% înseamnă profit din asigurare",
        "Bars: premium by year. Line: combined ratio (right axis); below 100% means an underwriting profit",
      ),
      cv("c1", true),
    ),
    note(
      tl(
        `${Pp.n > 1 ? `În perioada ${Pp.lab}` : `În ${y}`}, combined ratio a fost ${pct(u.cr)}${uc ? `, față de ${pct(uc.cr)} în ${C.lab}` : ""}${u.cr < 1 ? ", deci activitatea de asigurare a fost profitabilă" : ", deci activitatea de asigurare a pierdut bani"}${Pp.n > 1 ? `, iar primele au crescut în medie cu ${sgnPct(cagr(g0, g1, Pp.n))} pe an` : ""}. ` +
          `În ${y}, compania și-a atins ${metN} din cele 10 ținte strategice; cea mai mare abatere nefavorabilă este la „${worstL}”. ` +
          `Layerul „De ce” arată ce o explică.`,
        `${Pp.n > 1 ? `Over ${Pp.lab}` : `In ${y}`}, the combined ratio was ${pct(u.cr)}${uc ? `, against ${pct(uc.cr)} in ${C.lab}` : ""}${u.cr < 1 ? ", so the insurance business was profitable" : ", so the insurance business lost money"}${Pp.n > 1 ? `, and premium grew by ${sgnPct(cagr(g0, g1, Pp.n))} a year on average` : ""}. ` +
          `In ${y}, the company met ${metN} of its 10 strategic targets; the largest adverse gap is in “${worstL}”. ` +
          `The “Why” layer shows what explains it.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const us = YEARS.map((z) => uwY(z));
    mk("c1", {
      type: "bar",
      data: {
        labels: YEARS,
        datasets: [
          {
            type: "line",
            label: "Combined ratio",
            data: us.map((o) => o.cr),
            yAxisID: "y1",
            borderColor: P1.s[1],
            backgroundColor: P1.s[1],
            tension: 0.3,
            pointRadius: 4,
          },
          {
            label: tl("Prime brute", "Gross written premium"),
            data: us.map((o) => o.gwp),
            backgroundColor: YEARS.map((z) => inCol(z, P1)),
            borderRadius: 4,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { callback: tickEur } },
          y1: {
            position: "right",
            grid: { display: false },
            ticks: { callback: tickPct },
            min: 0.8,
            max: 1.05,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) =>
                c.dataset.yAxisID === "y1"
                  ? `Combined ratio: ${pct(c.raw)}`
                  : `${tl("Prime", "Premium")}: ${eurK(c.raw)}`,
            },
          },
        },
      },
    });
  };
  return {
    t: tl("Sinteza companiei", "Company overview"),
    p: tl(
      `Cum stă grupul ${pw()}${C ? `, comparat cu ${C.lab}` : ""}. Layerul următor explică abaterile.`,
      `How the group is doing ${pw()}${C ? `, compared with ${C.lab}` : ""}. The next layer explains the gaps.`,
    ),
    html,
    after,
  };
};

SCR.sin2 = () => {
  const Pp = P(),
    C = CP(),
    y = S.to;
  const names = Object.keys(KPIN);
  const gaps = names
    .map((n) => {
      const x = kpi(n, y);
      const g = (x.dir.startsWith("lower") ? x.t - x.a : x.a - x.t) / Math.abs(x.t);
      return { n, g };
    })
    .sort((a, b) => a.g - b.g);
  const regY = YEARS.map((z) =>
    NM.R.map((_, ri) => uwAgg((r) => yOf(r[0]) === z && r[1] === ri).cr),
  );
  const regP = NM.R.map((_, ri) => uwAgg((r) => inR(yOf(r[0]), Pp) && r[1] === ri).cr);
  const heatT = `<div class="tbl"><table><thead><tr><th>${tl("Regiune", "Region")}</th>${YEARS.map((z) => `<th class="${ic(z)}">${z}</th>`).join("")}<th>${Pp.lab}</th></tr></thead><tbody>${NM.R.map(
    (rn, ri) =>
      `<tr><td>${rn}</td>${YEARS.map((z, yi) => `<td class="heat ${ic(z)}" style="${heat(regY[yi][ri], 0.8, 0.95, 1.1)}">${pct(regY[yi][ri])}</td>`).join("")}` +
      `<td class="heat" style="${heat(regP[ri], 0.8, 0.95, 1.1)};font-weight:600">${pct(regP[ri])}</td></tr>`,
  ).join("")}</tbody></table></div>`;
  const eu = YEARS.map((z) => {
    const h = hrAggP(
      (v) => v === z,
      (r) => r[1] === 0 && D.D[r[2]] === "Claims",
      false,
    );
    const c = clAgg((r) => yOf(r[0]) === z && r[1] === 0);
    const e = engP(
      (v) => v === z,
      (r) => r[1] === 0 && D.D[r[2]] === "Claims",
      false,
    );
    return { z, vr: h.vr, eng: e.eng, days: c.days, cs: c.csat };
  });
  const euT =
    `<div class="tbl"><table><thead><tr><th>${tl("An", "Year")}</th>` +
    `<th>${tl("Plecări voluntare", "Voluntary attrition")} ${q("Plecări voluntare")}</th>` +
    `<th>Engagement ${q("Engagement")}</th><th>${tl("Zile de soluționare", "Settlement days")} ${q("Timp de soluționare")}</th>` +
    `<th>${tl("Satisfacția clienților", "Customer satisfaction")}</th></tr>` +
    `</thead><tbody>${eu
      .map(
        (o) =>
          `<tr><td class="${ic(o.z)}">${o.z}</td><td class="heat" style="${heat(o.vr, 0.08, 0.13, 0.3)}">${pct(o.vr)}</td>` +
          `<td class="heat" style="${heat(o.eng, 85, 74, 60, false)}">${nf1.format(o.eng)}</td>` +
          `<td class="heat" style="${heat(o.days, 20, 30, 50)}">${nf1.format(o.days)}</td>` +
          `<td class="heat" style="${heat(o.cs, 4.3, 3.9, 3.4, false)}">${nf2.format(o.cs)}</td></tr>`,
      )
      .join("")}` +
    `</tbody></table></div>`;
  const contrib = C
    ? NM.R.map(
        (_, ri) =>
          uwAgg((r) => inR(yOf(r[0]), Pp) && r[1] === ri).gwp / Pp.n -
          uwAgg((r) => inR(yOf(r[0]), C) && r[1] === ri).gwp / C.n,
      )
    : null;
  const worstReg = NM.R[regP.indexOf(Math.max(...regP))];
  const gap0 = LANG === "en" ? KPIN[gaps[0].n].l : KPIN[gaps[0].n].l.toLowerCase();
  const html = [
    win(
      "s6",
      tl("Abaterea indicatorilor față de țintă", "KPI gaps to target"),
      "Abatere",
      tl(
        `Cât de departe e fiecare KPI de țintă în ${y}, în procente din țintă. Spre dreapta = mai bine decât ținta`,
        `How far each KPI is from its target in ${y}, as a percentage of the target. To the right = better than target`,
      ),
      cv("c1", true),
    ),
    win(
      "s6",
      tl("Combined ratio pe regiuni", "Combined ratio by region"),
      "Combined ratio",
      tl(
        `Pe ani și pentru toată perioada ${Pp.lab} (ultima coloană). Verde sub 95%, roșu peste`,
        `By year and for the whole period ${Pp.lab} (last column). Green below 95%, red above`,
      ),
      heatT,
    ),
    win(
      "s6",
      tl("Cine a adus creșterea primelor", "Where premium growth came from"),
      "Prime brute subscrise",
      C
        ? tl(
            `Diferența primelor anuale medii: ${Pp.lab} față de ${C.lab}, pe regiuni`,
            `Change in average annual premium: ${Pp.lab} vs ${C.lab}, by region`,
          )
        : noCmp(),
      C ? cv("c2") : "",
    ),
    win(
      "s6",
      tl(
        "Legătura dintre oameni și clienți: echipa de daune din Europa",
        "People and customers: the Europe claims team",
      ),
      "Detaliere",
      tl(
        "Aceeași echipă văzută din trei unghiuri: HR, operațiuni și clienți",
        "The same team seen from three angles: HR, operations and customers",
      ),
      euT,
    ),
    note(
      tl(
        `Cea mai mare abatere nefavorabilă în ${y} este „${gap0}”. Pe regiuni, combined ratio cel mai ridicat ${pw()} îl are ${worstReg}. ` +
          `Tabelul echipei de daune din Europa arată de ce analiza pe mai multe domenii contează: când plecările din echipă cresc, crește și timpul de soluționare, iar satisfacția clienților scade în același an.`,
        `The largest adverse gap in ${y} is in “${gap0}”. By region, ${worstReg} has the highest combined ratio ${pw()}. ` +
          `The Europe claims team table shows why cross-domain analysis matters: when attrition in the team rises, settlement time rises too, and customer satisfaction falls in the same year.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: gaps.map((g) => KPIN[g.n].l),
        datasets: [
          {
            data: gaps.map((g) => g.g),
            backgroundColor: gaps.map((g) => (g.g >= 0 ? P1.good : P1.bad)),
            borderRadius: 3,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) =>
                tl(
                  `${c.raw >= 0 ? "Mai bine" : "Mai rău"} decât ținta cu ${pct(Math.abs(c.raw))}`,
                  `${c.raw >= 0 ? "Better" : "Worse"} than target by ${pct(Math.abs(c.raw))}`,
                ),
            },
          },
        },
        scales: { x: { ticks: { callback: tickPct } }, y: { grid: { display: false } } },
      },
    });
    if (C)
      mk("c2", {
        type: "bar",
        data: {
          labels: NM.R,
          datasets: [
            {
              data: contrib,
              backgroundColor: contrib.map((v) => (v >= 0 ? P1.s[0] : P1.bad)),
              borderRadius: 4,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (c) =>
                  `${c.raw >= 0 ? "+" : "−"}${eurK(Math.abs(c.raw))} ${tl("pe an", "a year")}`,
              },
            },
          },
          scales: { y: { ticks: { callback: tickEur } }, x: { grid: { display: false } } },
        },
      });
  };
  return {
    t: tl("De ce arată așa rezultatele", "Why the results look this way"),
    p: tl(
      "Unde sunt abaterile și ce le explică. Tabelele colorate sunt hărți termice: culoarea arată cât de bine sau rău e o valoare.",
      "Where the gaps are and what explains them. The coloured tables are heatmaps: the colour shows how good or bad a value is.",
    ),
    html,
    after,
  };
};

SCR.bus1 = () => {
  const Pp = P(),
    C = CP();
  const u = uwR(Pp),
    uc = uwR(C);
  const pe = pifEnd(Pp),
    pec = pifEnd(C);
  const g0 = uwY(Pp.from).gwp,
    g1 = uwY(Pp.to).gwp;
  const mil = tl(" mil.", "m");
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Prime brute subscrise", "Gross written premium"),
      "Prime brute subscrise",
      eurK(u.gwp),
      dl(u.gwp, uc && uc.gwp, { ann: true }),
      Pp.n > 1
        ? tl(
            `total; CAGR ${sgnPct(cagr(g0, g1, Pp.n))} pe an`,
            `total; CAGR ${sgnPct(cagr(g0, g1, Pp.n))} a year`,
          )
        : "",
    ),
    card(
      tl("Prime nete câștigate", "Net earned premium"),
      "Prime nete câștigate",
      eurK(u.nep),
      dl(u.nep, uc && uc.nep, { ann: true }),
      flowNote(),
    ),
    card(
      tl("Polițe active", "Policies in force"),
      "Polițe active",
      nf1.format(pe / 1e6) + mil,
      dl(pe, pec),
      tl(`la 31 decembrie ${Pp.to}`, `at 31 December ${Pp.to}`),
    ),
    card(
      tl("Polițe noi", "New policies"),
      "Polițe active",
      nf1.format(u.nw / 1e6) + mil,
      dl(u.nw, uc && uc.nw, { ann: true }),
      flowNote(),
    ),
    card(
      tl("Rata de pierdere a polițelor", "Lapse rate"),
      "Rata de pierdere a polițelor",
      pct(u.lapse),
      dl(u.lapse, uc && uc.lapse, { kind: "pp", good: "down" }),
      Pp.n > 1 ? tl("medie anuală", "annual average") : "",
    ),
    card(
      "Combined ratio",
      "Combined ratio",
      pct(u.cr),
      dl(u.cr, uc && uc.cr, { kind: "pp", good: "down" }),
    ),
    `</div>`,
    win(
      "s8",
      tl("Prime brute lunare, pe regiuni", "Monthly gross written premium by region"),
      "Prime brute subscrise",
      tl(
        `Toți cei 5 ani, ${slice()}; zona colorată e perioada selectată. Vârfurile din ianuarie vin din reînnoirile anuale`,
        `All 5 years, ${slice()}; the shaded area is the selected period. The January peaks come from annual renewals`,
      ),
      cv("c1", true),
    ),
    win(
      "s4",
      tl("Mixul pe linii de business", "Mix by line of business"),
      "Linie de business",
      tl(`Cota din primele brute ${pw()}`, `Share of gross written premium ${pw()}`),
      cv("c2", true),
    ),
    win(
      "s6",
      tl("Canalele de vânzare în polițele noi", "Distribution channels in new policies"),
      "Canal de distribuție",
      tl(
        "Cota fiecărui canal din polițele noi, pe ani",
        "Each channel's share of new policies, by year",
      ),
      cv("c3"),
    ),
    win(
      "s6",
      tl("Prime brute pe regiuni, anual", "Gross written premium by region, annual"),
      "Prime brute subscrise",
      tl("Comparație an la an", "Year-on-year comparison"),
      cv("c4"),
    ),
    note(
      tl(
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${slice()} a subscris prime de ${eurK(u.gwp)}${uc ? `; media anuală e ${sgnPct(u.gwp / Pp.n / (uc.gwp / C.n) - 1)} față de ${C.lab}` : ""}${Pp.n > 1 ? `, cu o creștere anuală compusă de ${sgnPct(cagr(g0, g1, Pp.n))}` : ""}. ` +
          `Rata de pierdere a polițelor a fost ${pct(u.lapse)}. Canalul online crește constant în vânzările noi, ceea ce reduce costurile de achiziție, dar și loialitatea: clienții online renunță mai des la polițe.`,
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${slice()} wrote ${eurK(u.gwp)} of premium${uc ? `; the annual average is ${sgnPct(u.gwp / Pp.n / (uc.gwp / C.n) - 1)} vs ${C.lab}` : ""}${Pp.n > 1 ? `, with compound annual growth of ${sgnPct(cagr(g0, g1, Pp.n))}` : ""}. ` +
          `The lapse rate was ${pct(u.lapse)}. The online channel keeps gaining share of new sales, which lowers acquisition costs but also loyalty: online customers lapse their policies more often.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const regs = on("region") && S.region >= 0 ? [S.region] : [0, 1, 2, 3];
    mk(
      "c1",
      {
        type: "line",
        data: {
          labels: D.months,
          datasets: regs.map((ri) => ({
            label: NM.R[ri],
            data: D.months.map((_, mi) => uwAgg((r) => r[0] === mi && r[1] === ri && uwF(r)).gwp),
            borderColor: P1.s[ri],
            backgroundColor: P1.s[ri],
            pointRadius: 0,
            borderWidth: 1.8,
            tension: 0.25,
          })),
        },
        options: {
          interaction: { mode: "index", intersect: false },
          scales: {
            y: { ticks: { callback: tickEur } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${eurK(c.raw)}` } },
          },
        },
      },
      true,
    );
    const lines = NM.L.map(
      (_, li) => uwAgg((r) => inR(yOf(r[0]), Pp) && r[2] === li && uwF(r)).gwp,
    );
    mk("c2", {
      type: "doughnut",
      data: {
        labels: NM.L,
        datasets: [
          { data: lines, backgroundColor: P1.s.slice(0, 5), borderColor: P1.panel, borderWidth: 2 },
        ],
      },
      options: {
        cutout: "62%",
        plugins: {
          tooltip: { callbacks: { label: (c) => `${c.label}: ${pct(c.raw / sum(lines))}` } },
        },
      },
    });
    const ch = YEARS.map((z) =>
      NM.C.map(
        (_, ci) => uwAgg((r) => yOf(r[0]) === z && r[3] === ci && uwF(r, { useChan: false })).nw,
      ),
    );
    mk(
      "c3",
      {
        type: "bar",
        data: {
          labels: YEARS,
          datasets: NM.C.map((cn, ci) => ({
            label: cn,
            data: ch.map((a) => a[ci] / sum(a)),
            backgroundColor: P1.s[ci],
            borderRadius: 2,
          })),
        },
        options: {
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, max: 1, ticks: { callback: tickPct } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } },
          },
        },
      },
      true,
    );
    mk(
      "c4",
      {
        type: "bar",
        data: {
          labels: YEARS,
          datasets: regs.map((ri) => ({
            label: NM.R[ri],
            data: YEARS.map((z) => uwAgg((r) => yOf(r[0]) === z && r[1] === ri && uwF(r)).gwp),
            backgroundColor: P1.s[ri],
            borderRadius: 3,
          })),
        },
        options: {
          scales: { y: { ticks: { callback: tickEur } }, x: { grid: { display: false } } },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${eurK(c.raw)}` } },
          },
        },
      },
      true,
    );
  };
  return {
    t: tl("Business și produse", "Business & products"),
    p: tl(
      `Cât vinde compania, unde, ce și prin ce canale, ${pw()}${C ? `, comparat cu ${C.lab}` : ""}.`,
      `How much the company sells, where, what and through which channels, ${pw()}${C ? `, compared with ${C.lab}` : ""}.`,
    ),
    html,
    after,
  };
};

SCR.bus2 = () => {
  const Pp = P();
  const bA = (ri, li) => {
    let b = 0;
    D.bud.forEach((r) => {
      if (inR(yOf(r[0]), Pp) && r[1] === ri && r[2] === li) b += r[3];
    });
    return b;
  };
  const cells = [];
  NM.R.forEach((_, ri) =>
    NM.L.forEach((_, li) => {
      if (on("region") && S.region >= 0 && ri !== S.region) return;
      if (on("line") && S.line >= 0 && li !== S.line) return;
      const a = uwAgg((r) => inR(yOf(r[0]), Pp) && r[1] === ri && r[2] === li);
      cells.push({ ri, li, a: a.gwp, b: bA(ri, li), cr: a.cr });
    }),
  );
  const tA = sum(cells.map((c) => c.a)),
    tB = sum(cells.map((c) => c.b));
  const crM = NM.R.map((_, ri) =>
    NM.L.map(
      (_, li) =>
        uwAgg(
          (r) =>
            inR(yOf(r[0]), Pp) &&
            r[1] === ri &&
            r[2] === li &&
            uwF(r, { useRegion: false, useLine: false }),
        ).cr,
    ),
  );
  const hm = `<div class="tbl"><table><thead><tr><th>${tl("Regiune", "Region")}</th>${NM.L.map((l) => `<th>${l}</th>`).join("")}</tr></thead><tbody>${NM.R.map((rn, ri) => `<tr><td>${rn}</td>${NM.L.map((_, li) => `<td class="heat" style="${heat(crM[ri][li], 0.8, 0.95, 1.15)}">${pct(crM[ri][li])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  let worst = { v: 0 };
  NM.R.forEach((rn, ri) =>
    NM.L.forEach((ln, li) => {
      if (crM[ri][li] > worst.v) worst = { v: crM[ri][li], rn, ln };
    }),
  );
  const fxY = YEARS.map((z) => {
    const o = uwAgg((r) => yOf(r[0]) === z && uwF(r));
    return { z, rep: o.gwp, cfx: o.cfx };
  });
  const fp = uwR(Pp);
  const html = [
    win(
      "s6",
      tl("Buget vs. realizat", "Budget vs actual"),
      "Buget vs. realizat",
      tl(
        `Abaterea primelor realizate față de buget ${pw()}, pe regiune și linie`,
        `Actual premium vs budget ${pw()}, by region and line`,
      ),
      cv("c1", true),
    ),
    win(
      "s6",
      tl("Efectul cursului valutar", "Exchange-rate effect"),
      "Efect valutar",
      tl(
        "Primele raportate în EUR comparate cu aceleași prime la cursurile din 2021. Diferența e efectul valutar, nu business",
        "Premium reported in EUR compared with the same premium at 2021 exchange rates. The difference is the FX effect, not business",
      ),
      cv("c2", true),
    ),
    win(
      "s7",
      tl("Unde se câștigă și unde se pierd bani", "Where money is made and lost"),
      "Combined ratio",
      tl(
        `Combined ratio pe regiune × linie de business ${pw()}. Peste 100% (roșu) înseamnă pierdere din asigurare`,
        `Combined ratio by region × line of business ${pw()}. Above 100% (red) means an underwriting loss`,
      ),
      hm,
    ),
    win(
      "s5",
      tl("Din ce e compus combined ratio", "What makes up the combined ratio"),
      "Rata cheltuielilor",
      tl(
        `Rata daunei și a cheltuielilor pe linii, ${Pp.lab}`,
        `Loss ratio and expense ratio by line, ${Pp.lab}`,
      ),
      cv("c3", true),
    ),
    note(
      tl(
        `Față de buget, primele din ${slice()} sunt ${tA >= tB ? "peste" : "sub"} plan cu ${sgnPct(tA / tB - 1)} ${pw()}. ` +
          `Efectul valutar a ${fp.gwp >= fp.cfx ? "adăugat" : "scăzut"} ${eurK(Math.abs(fp.gwp - fp.cfx))} la primele raportate, față de cursurile din 2021: o parte din „creștere” sau „scădere” vine doar din cursuri. ` +
          `Cel mai slab punct al portofoliului este ${worst.ln.toLowerCase()} în ${worst.rn}, cu un combined ratio de ${pct(worst.v)}: o linie care vinde mult, dar pierde bani pe fiecare poliță, e un semnal clasic de preț prea mic.`,
        `Against budget, premium for ${slice()} is ${tA >= tB ? "above" : "below"} plan by ${sgnPct(tA / tB - 1)} ${pw()}. ` +
          `Exchange rates ${fp.gwp >= fp.cfx ? "added" : "took away"} ${eurK(Math.abs(fp.gwp - fp.cfx))} ${fp.gwp >= fp.cfx ? "to" : "from"} reported premium compared with 2021 rates: part of the “growth” or “decline” is purely currency. ` +
          `The weakest spot in the portfolio is ${worst.ln} in ${worst.rn}, with a combined ratio of ${pct(worst.v)}: a line that sells a lot but loses money on every policy is a classic sign of underpricing.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const cs = cells.slice().sort((a, b) => a.a / a.b - b.a / b.b);
    const SR = tl(
        ["Europa", "Am. Nord", "Asia-Pac.", "Am. Latină"],
        ["Europe", "N. America", "Asia-Pac.", "Lat. America"],
      ),
      SL = tl(
        ["Auto", "Locuințe", "Viață", "Sănătate", "Comercial"],
        ["Motor", "Property", "Life", "Health", "Commercial"],
      ),
      nar = window.innerWidth < 700;
    mk("c1", {
      type: "bar",
      data: {
        labels: cs.map((c) =>
          nar ? `${SR[c.ri]} · ${SL[c.li]}` : `${NM.R[c.ri]} · ${NM.L[c.li]}`,
        ),
        datasets: [
          {
            data: cs.map((c) => c.a / c.b - 1),
            backgroundColor: cs.map((c) => (c.a >= c.b ? P1.good : P1.bad)),
            borderRadius: 2,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => {
                const x = cs[c.dataIndex];
                return tl(
                  `Realizat ${eurK(x.a)} vs buget ${eurK(x.b)} (${sgnPct(c.raw)})`,
                  `Actual ${eurK(x.a)} vs budget ${eurK(x.b)} (${sgnPct(c.raw)})`,
                );
              },
            },
          },
        },
        scales: {
          x: { ticks: { callback: tickPct } },
          y: { grid: { display: false }, ticks: { font: { size: 10 }, autoSkip: false } },
        },
      },
    });
    mk(
      "c2",
      {
        type: "bar",
        data: {
          labels: YEARS,
          datasets: [
            {
              label: tl("Raportat în EUR", "Reported in EUR"),
              data: fxY.map((o) => o.rep),
              backgroundColor: P1.s[0],
              borderRadius: 3,
            },
            {
              label: tl("La cursurile din 2021", "At 2021 exchange rates"),
              data: fxY.map((o) => o.cfx),
              backgroundColor: P1.s[5],
              borderRadius: 3,
            },
          ],
        },
        options: {
          scales: { y: { ticks: { callback: tickEur } }, x: { grid: { display: false } } },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${eurK(c.raw)}` } },
          },
        },
      },
      true,
    );
    const ls = NM.L.map((_, li) =>
      uwAgg((r) => inR(yOf(r[0]), Pp) && r[2] === li && uwF(r, { useLine: false })),
    );
    mk("c3", {
      type: "bar",
      data: {
        labels: NM.L,
        datasets: [
          {
            label: tl("Rata daunei", "Loss ratio"),
            data: ls.map((o) => o.lr),
            backgroundColor: P1.s[0],
          },
          {
            label: tl("Costuri de achiziție", "Acquisition costs"),
            data: ls.map((o) => o.acq / o.nep),
            backgroundColor: P1.s[1],
          },
          {
            label: tl("Cheltuieli administrative", "Administrative expenses"),
            data: ls.map((o) => o.adm / o.nep),
            backgroundColor: P1.s[5],
          },
        ],
      },
      options: {
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { stacked: true, ticks: { callback: tickPct } },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label}: ${pct(c.raw)}`,
              footer: (it) => `Combined ratio: ${pct(sum(it.map((i) => i.raw)))}`,
            },
          },
        },
      },
    });
  };
  return {
    t: tl("De ce arată așa business-ul", "Why the business looks this way"),
    p: tl(
      "Plan vs. realitate, efectul cursurilor și profitabilitatea fiecărei combinații regiune–produs.",
      "Plan vs actual, the exchange-rate effect and the profitability of every region–product combination.",
    ),
    html,
    after,
  };
};

SCR.dau1 = () => {
  const Pp = P(),
    C = CP();
  const u = uwR(Pp, { useChan: false }),
    uc = uwR(C, { useChan: false });
  const c = clR(Pp),
    cc = clR(C);
  const causes = {};
  D.cc.forEach((r) => {
    if (!inR(r[0], Pp)) return;
    if (on("region") && S.region >= 0 && r[1] !== S.region) return;
    if (on("line") && S.line >= 0 && r[2] !== S.line) return;
    causes[r[3]] = (causes[r[3]] || 0) + r[5];
  });
  const top = Object.entries(causes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const eur0 = (v) => tl(nf0.format(v) + " €", "€" + nf0.format(v));
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Daune întâmplate", "Incurred claims"),
      "Daune întâmplate",
      eurK(u.clm),
      dl(u.clm, uc && uc.clm, { ann: true, good: "down" }),
      flowNote(),
    ),
    card(
      tl("Rata daunei", "Loss ratio"),
      "Rata daunei",
      pct(u.lr),
      dl(u.lr, uc && uc.lr, { kind: "pp", good: "down" }),
    ),
    card(
      tl("Dosare de daună (eșantion)", "Claim files (sample)"),
      "Frecvența daunelor",
      nf0.format(c.n),
      dl(c.n, cc && cc.n, { ann: true, good: null }),
      flowNote(),
    ),
    card(
      tl("Severitate medie", "Average severity"),
      "Severitatea daunelor",
      eur0(c.sev * 1000),
      dl(c.sev, cc && cc.sev, { good: "down" }),
    ),
    card(
      tl("Timp mediu de soluționare", "Average settlement time"),
      "Timp de soluționare",
      nf1.format(c.days) + tl(" zile", " days"),
      dl(c.days, cc && cc.days, { kind: "abs", fmt: (v) => zileU(v, 1), good: "down" }),
    ),
    card(
      tl("Satisfacția clienților", "Customer satisfaction"),
      "NPS clienți",
      nf2.format(c.csat) + " / 5",
      dl(c.csat, cc && cc.csat, { kind: "abs", fmt: (v) => ptsU(v, 2) }),
    ),
    `</div>`,
    win(
      "s8",
      tl("Rata daunei, lunar", "Monthly loss ratio"),
      "Rata daunei",
      tl(
        `${slice()}; triunghiurile marchează evenimentele catastrofale, zona colorată e perioada selectată`,
        `${slice()}; the triangles mark catastrophe events, the shaded area is the selected period`,
      ),
      cv("c1", true),
    ),
    win(
      "s4",
      tl("Principalele cauze", "Main claim causes"),
      "Daune întâmplate",
      tl(
        `Cauzele cu cele mai mari sume ${pw()} (eșantion)`,
        `Causes with the largest amounts ${pw()} (sample)`,
      ),
      cv("c2", true),
    ),
    win(
      "s6",
      tl("Severitatea medie pe linii", "Average severity by line"),
      "Severitatea daunelor",
      tl(`Valoarea medie a unei daune ${pw()}`, `Average cost of a claim ${pw()}`),
      cv("c3"),
    ),
    win(
      "s6",
      tl("Stadiul dosarelor", "Claim file status"),
      "Rezerve de daune",
      tl(
        `Dosarele anunțate ${pw()}, după stadiu la 31.12.2025`,
        `Claims reported ${pw()}, by status at 31 Dec 2025`,
      ),
      cv("c4"),
    ),
    note(
      tl(
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${slice()} a avut o rată a daunei de ${pct(u.lr)}${uc ? `, față de ${pct(uc.lr)} în ${C.lab}` : ""}. ` +
          `O daună costă în medie ${nf0.format(c.sev * 1000)} € și se soluționează în ${nf1.format(c.days)} zile. ` +
          `Vârfurile din graficul lunar corespund aproape toate unor evenimente catastrofale: câteva zile de vreme extremă pot mânca profitul unui trimestru întreg.`,
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${slice()} had a loss ratio of ${pct(u.lr)}${uc ? `, against ${pct(uc.lr)} in ${C.lab}` : ""}. ` +
          `The average claim costs €${nf0.format(c.sev * 1000)} and takes ${nf1.format(c.days)} days to settle. ` +
          `Almost every spike in the monthly chart matches a catastrophe event: a few days of extreme weather can wipe out a whole quarter's profit.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const lr = D.months.map((_, mi) => uwAgg((r) => r[0] === mi && uwF(r, { useChan: false })).lr);
    const catPts = D.cat.map(([m, n]) => ({ x: D.months[m], y: lr[m], n }));
    mk(
      "c1",
      {
        type: "line",
        data: {
          labels: D.months,
          datasets: [
            {
              label: tl("Rata daunei", "Loss ratio"),
              data: lr,
              borderColor: P1.s[0],
              backgroundColor: P1.s[0],
              pointRadius: 0,
              borderWidth: 1.8,
              tension: 0.25,
            },
            {
              label: tl("Eveniment catastrofal", "Catastrophe event"),
              type: "scatter",
              data: catPts,
              backgroundColor: P1.bad,
              pointStyle: "triangle",
              pointRadius: 8,
            },
          ],
        },
        options: {
          scales: {
            y: { ticks: { callback: tickPct } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (c) =>
                  c.raw && c.raw.n
                    ? `${NM.cat[c.raw.n] || c.raw.n}: ${pct(c.raw.y)}`
                    : `${tl("Rata daunei", "Loss ratio")}: ${pct(c.raw)}`,
              },
            },
          },
        },
      },
      true,
    );
    mk("c2", {
      type: "bar",
      data: {
        labels: top.map((t) => NM.cause[D.causes[t[0]]]),
        datasets: [{ data: top.map((t) => t[1]), backgroundColor: P1.s[0], borderRadius: 3 }],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => eurK(c.raw) } },
        },
        scales: {
          x: { ticks: { callback: tickEur, maxTicksLimit: 4 } },
          y: { grid: { display: false } },
        },
      },
    });
    const sv = NM.L.map(
      (_, li) =>
        clAgg(
          (r) =>
            inR(yOf(r[0]), Pp) &&
            r[2] === li &&
            (!on("region") || S.region < 0 || r[1] === S.region),
        ).sev * 1000,
    );
    mk("c3", {
      type: "bar",
      data: {
        labels: NM.L,
        datasets: [
          {
            data: sv,
            backgroundColor: NM.L.map((_, li) =>
              on("line") && S.line >= 0 && li !== S.line ? P1.s[5] + "55" : P1.s[2],
            ),
            borderRadius: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => eur0(c.raw) } },
        },
        scales: {
          y: {
            type: "logarithmic",
            ticks: {
              callback: (v) => ([1000, 2000, 5000, 10000, 20000, 50000].includes(v) ? eur0(v) : ""),
            },
          },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        },
      },
    });
    mk("c4", {
      type: "doughnut",
      data: {
        labels: tl(
          ["Închise și plătite", "Deschise", "Respinse"],
          ["Closed and paid", "Open", "Rejected"],
        ),
        datasets: [
          {
            data: [c.closed, c.op, c.rej],
            backgroundColor: [P1.good, P1.warn, P1.bad],
            borderColor: P1.panel,
            borderWidth: 2,
          },
        ],
      },
      options: {
        cutout: "62%",
        plugins: {
          tooltip: {
            callbacks: { label: (x) => `${x.label}: ${nf0.format(x.raw)} (${pct(x.raw / c.n)})` },
          },
        },
      },
    });
  };
  return {
    t: tl("Daune", "Claims"),
    p: tl(
      `Cât plătește compania, pentru ce și cât de repede, ${pw()}${C ? `, comparat cu ${C.lab}` : ""}.`,
      `How much the company pays out, for what and how quickly, ${pw()}${C ? `, compared with ${C.lab}` : ""}.`,
    ),
    html,
    after,
  };
};

SCR.dau2 = () => {
  const Pp = P();
  const qs = [];
  for (let i = 0; i < 20; i++) qs.push(`${Y0 + Math.floor(i / 4)}-${tl("T", "Q")}${(i % 4) + 1}`);
  const lf = (r) => !on("line") || S.line < 0 || r[2] === S.line;
  const qAgg = (qi, pred) => clAgg((r) => Math.floor(r[0] / 3) === qi && pred(r) && lf(r));
  const catRows = D.cat.map(([m, n]) => {
    const rgn = n.includes("Europe") ? 0 : n.includes("US") ? 1 : 3;
    const mm = uwAgg((r) => r[0] === m && r[1] === rgn && lf(r));
    const same = [0, 1, 2, 3, 4]
      .map((k) => (m % 12) + 12 * k)
      .filter((x) => x !== m)
      .map((x) => uwAgg((r) => r[0] === x && r[1] === rgn && lf(r)).lr);
    const base = sum(same) / same.length;
    return { n, m, rgn, lr: mm.lr, base, extra: (mm.lr - base) * mm.nep };
  });
  const cT =
    `<div class="tbl"><table><thead><tr><th>${tl("Eveniment", "Event")}</th>` +
    `<th>${tl("Luna", "Month")}</th><th>${tl("Regiune", "Region")}</th>` +
    `<th>${tl("Rata daunei în lună", "Loss ratio in the month")}</th>` +
    `<th>${tl("Aceeași lună, alți ani", "Same month, other years")}</th>` +
    `<th>${tl("Cost suplimentar estimat", "Estimated extra cost")}</th></tr>` +
    `</thead><tbody>${catRows
      .map(
        (o) =>
          `<tr><td class="${ic(yOf(o.m))}">${NM.cat[o.n]}</td><td>${D.months[o.m]}</td>` +
          `<td>${NM.R[o.rgn]}</td><td class="heat" style="${heat(o.lr, 0.5, 0.75, 1.2)}">${pct(o.lr)}</td>` +
          `<td>${pct(o.base)}</td><td class="num">${eurK(o.extra)}</td></tr>`,
      )
      .join("")}` +
    `</tbody></table></div>`;
  const bk = ["0–15", "16–30", "31–45", "46–60", "61–90", tl("peste 90", "over 90")];
  const cbA = bk.map((_, bi) => {
    let n = 0,
      s = 0;
    D.cb.forEach((r) => {
      if (inR(r[0], Pp) && r[2] === bi && (!on("region") || S.region < 0 || r[1] === S.region)) {
        n += r[3];
        s += r[4];
      }
    });
    return n ? s / n : null;
  });
  const euQ = qs.map((_, qi) => qAgg(qi, (r) => r[1] === 0)),
    rsQ = qs.map((_, qi) => qAgg(qi, (r) => r[1] !== 0));
  const peak = euQ.reduce((b, o, i) => (o.days > b.v ? { v: o.days, i } : b), { v: 0, i: 0 });
  const frE = euQ.map((o) => o.frate),
    frEarly = sum(frE.slice(0, 12)) / 12,
    frLate = sum(frE.slice(13, 20)) / 7;
  const rest = tl("Restul lumii", "Rest of the world");
  const html = [
    win(
      "s12",
      tl("Evenimentele catastrofale și costul lor", "Catastrophe events and their cost"),
      "Eveniment catastrofal",
      tl(
        "Rata daunei din regiunea afectată în luna evenimentului, comparată cu aceeași lună din ceilalți ani",
        "Loss ratio in the affected region in the month of the event, compared with the same month in the other years",
      ),
      cT,
    ),
    win(
      "s6",
      tl(
        "Timpul de soluționare: Europa față de restul lumii",
        "Settlement time: Europe vs the rest of the world",
      ),
      "Timp de soluționare",
      tl(
        "Zile medii, pe trimestre; zona colorată e perioada selectată",
        "Average days, by quarter; the shaded area is the selected period",
      ),
      cv("c1"),
    ),
    win(
      "s6",
      tl("Frauda suspectată", "Suspected fraud"),
      "Fraudă suspectată",
      tl(
        "Procentul dosarelor marcate ca suspecte, pe trimestre",
        "Share of claim files flagged as suspicious, by quarter",
      ),
      cv("c2"),
    ),
    win(
      "s12",
      tl(
        "Satisfacția clienților după timpul de soluționare",
        "Customer satisfaction by settlement time",
      ),
      "Timp de soluționare",
      tl(
        `Scorul mediu de satisfacție (1–5) în funcție de câte zile a durat soluționarea, ${Pp.lab}`,
        `Average satisfaction score (1–5) by how many days settlement took, ${Pp.lab}`,
      ),
      cv("c3"),
    ),
    note(
      tl(
        `Cele trei evenimente catastrofale au adus împreună un cost suplimentar estimat de ${eurK(sum(catRows.map((o) => o.extra)))}. ` +
          `În Europa, timpul de soluționare a atins un maxim de ${nf1.format(peak.v)} zile în ${qs[peak.i]}, mult peste restul lumii, iar satisfacția clienților scade vizibil pe măsură ce dosarul durează mai mult. ` +
          `Explicația nu e în daune, ci în oameni: vezi domeniul Oameni, echipa de daune din Europa. ` +
          `Frauda detectată în Europa a crescut de la ${pct(frEarly)} la ${pct(frLate)} din dosare după 2024: nu pentru că fraudează mai mulți clienți, ci pentru că un instrument nou o detectează mai bine.`,
        `Together, the three catastrophe events added an estimated extra cost of ${eurK(sum(catRows.map((o) => o.extra)))}. ` +
          `In Europe, settlement time peaked at ${nf1.format(peak.v)} days in ${qs[peak.i]}, well above the rest of the world, and customer satisfaction drops visibly the longer a claim takes. ` +
          `The explanation lies not in the claims but in the people: see the People domain, Europe claims team. ` +
          `Detected fraud in Europe rose from ${pct(frEarly)} to ${pct(frLate)} of files after 2024: not because more customers commit fraud, but because a new tool detects it better.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const dz = tl(" z", " d");
    mk(
      "c1",
      {
        type: "line",
        data: {
          labels: qs,
          datasets: [
            {
              label: NM.R[0],
              data: euQ.map((o) => o.days),
              borderColor: P1.s[4],
              backgroundColor: P1.s[4],
              tension: 0.3,
              pointRadius: 2,
            },
            {
              label: rest,
              data: rsQ.map((o) => o.days),
              borderColor: P1.s[5],
              backgroundColor: P1.s[5],
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        },
        options: {
          scales: {
            y: { ticks: { callback: (v) => v + dz } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (c) => `${c.dataset.label}: ${nf1.format(c.raw)}${tl(" zile", " days")}`,
              },
            },
          },
        },
      },
      true,
    );
    mk(
      "c2",
      {
        type: "line",
        data: {
          labels: qs,
          datasets: [
            {
              label: NM.R[0],
              data: euQ.map((o) => o.frate),
              borderColor: P1.s[4],
              backgroundColor: P1.s[4],
              tension: 0.3,
              pointRadius: 2,
            },
            {
              label: rest,
              data: rsQ.map((o) => o.frate),
              borderColor: P1.s[5],
              backgroundColor: P1.s[5],
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        },
        options: {
          scales: {
            y: { ticks: { callback: tickPct } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } },
          },
        },
      },
      true,
    );
    mk("c3", {
      type: "bar",
      data: {
        labels: bk.map((b) => b + tl(" zile", " days")),
        datasets: [
          {
            data: cbA,
            backgroundColor: cbA.map((v) => (v >= 4 ? P1.good : v >= 3.5 ? P1.warn : P1.bad)),
            borderRadius: 4,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => `${tl("Satisfacție", "Satisfaction")}: ${nf2.format(c.raw)} / 5`,
            },
          },
        },
        scales: { y: { min: 1, max: 5 }, x: { grid: { display: false } } },
      },
    });
  };
  return {
    t: tl("De ce arată așa daunele", "Why claims look this way"),
    p: tl(
      "Catastrofe, viteza de soluționare, frauda și efectul lor asupra clienților.",
      "Catastrophes, settlement speed, fraud and their effect on customers.",
    ),
    html,
    after,
  };
};

SCR.oam1 = () => {
  const Pp = P(),
    C = CP();
  const h = hrR(Pp),
    hc = hrR(C);
  const e = engR(Pp),
    ec = engR(C);
  const he = hcEnd(Pp),
    hec = hcEnd(C);
  const R = D.rec.filter((r) => inR(r[0], Pp) && hrF(r));
  const rs = (i) => sum(R.map((r) => r[i]));
  const ttf = rs(9) / rs(8);
  const Rc = C ? D.rec.filter((r) => inR(r[0], C) && hrF(r)) : null;
  const ttfc = Rc ? sum(Rc.map((r) => r[9])) / sum(Rc.map((r) => r[8])) : null;
  const byD = D.D.map((dn, di) => ({
    dn,
    v: sum(D.hr.filter((r) => r[0] === Pp.to && r[2] === di && hrF(r)).map((r) => r[4])),
  })).sort((a, b) => b.v - a.v);
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Angajați la final de perioadă", "Headcount at period end"),
      "Număr de angajați",
      nf0.format(he),
      dl(he, hec),
      tl(`la 31 decembrie ${Pp.to}`, `at 31 December ${Pp.to}`),
    ),
    card(
      tl("Angajări", "Hires"),
      "Pâlnie de recrutare",
      nf0.format(h.hi),
      dl(h.hi, hc && hc.hi, { ann: true, good: null }),
      flowNote(),
    ),
    card(
      tl("Plecări voluntare", "Voluntary attrition"),
      "Plecări voluntare",
      pct(h.vr),
      dl(h.vr, hc && hc.vr, { kind: "pp", good: "down" }),
      Pp.n > 1 ? tl("medie anuală", "annual average") : "",
    ),
    card(
      "Engagement",
      "Engagement",
      nf1.format(e.eng),
      dl(e.eng, ec && ec.eng, { kind: "abs", fmt: (v) => ptsU(v, 1) }),
    ),
    card(
      "eNPS",
      "eNPS",
      nf0.format(e.enps),
      dl(e.enps, ec && ec.enps, { kind: "abs", fmt: (v) => ptsU(v, 0) }),
    ),
    card(
      tl("Timp mediu de angajare", "Average time to hire"),
      "Timp de angajare",
      nf0.format(ttf) + tl(" zile", " days"),
      dl(ttf, ttfc, { kind: "abs", fmt: (v) => zileU(v, 0), good: "down" }),
    ),
    `</div>`,
    win(
      "s6",
      tl("Angajați pe departamente", "Headcount by department"),
      "Număr de angajați",
      tl(
        `La 31 decembrie ${Pp.to}, ${on("region") && S.region >= 0 ? NM.R[S.region] : "toate regiunile"}`,
        `At 31 December ${Pp.to}, ${on("region") && S.region >= 0 ? NM.R[S.region] : "all regions"}`,
      ),
      cv("c1", true),
    ),
    win(
      "s6",
      tl("Plecări pe ani, după tip", "Leavers by year and type"),
      "Rata plecărilor",
      tl(
        "Voluntare, involuntare și pensionări, ca procent din numărul mediu de angajați",
        "Voluntary, involuntary and retirements, as a percentage of average headcount",
      ),
      cv("c2", true),
    ),
    win(
      "s6",
      tl("Pâlnia de recrutare", "Recruitment funnel"),
      "Pâlnie de recrutare",
      tl(
        `Câți candidați au rămas la fiecare etapă ${pw()}`,
        `How many candidates remained at each stage ${pw()}`,
      ),
      cv("c3"),
    ),
    win(
      "s6",
      tl("Ce spun angajații", "What employees say"),
      "Engagement",
      tl(
        `Scorurile din sondaj ${pw()}, pe teme (0–100)`,
        `Survey scores ${pw()}, by theme (0–100)`,
      ),
      cv("c4"),
    ),
    note(
      tl(
        `La finalul lui ${Pp.to}, compania avea ${nf0.format(he)} de angajați. ` +
          `Rata plecărilor voluntare a fost ${pct(h.vr)}${Pp.n > 1 ? " pe an, în medie" : ""}${hc ? `, față de ${pct(hc.vr)} în ${C.lab}` : ""}, iar engagement-ul a ajuns la ${nf1.format(e.eng)} din 100. ` +
          `În sondaj, tema cu cel mai mic scor este echitatea salarială: un semnal care merită urmărit împreună cu analiza diferenței salariale din layerul „De ce”.`,
        `At the end of ${Pp.to}, the company had ${nf0.format(he)} employees. ` +
          `Voluntary attrition was ${pct(h.vr)}${Pp.n > 1 ? " a year on average" : ""}${hc ? `, against ${pct(hc.vr)} in ${C.lab}` : ""}, and engagement reached ${nf1.format(e.eng)} out of 100. ` +
          `In the survey, the lowest-scoring theme is pay fairness: a signal worth tracking together with the gender pay gap analysis in the “Why” layer.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: byD.map((o) => NM.D[o.dn]),
        datasets: [{ data: byD.map((o) => o.v), backgroundColor: P1.s[0], borderRadius: 3 }],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => nf0.format(c.raw) + tl(" angajați", " employees") },
          },
        },
        scales: { y: { grid: { display: false } }, x: {} },
      },
    });
    const hs = YEARS.map((z) => hrAgg(z));
    mk(
      "c2",
      {
        type: "bar",
        data: {
          labels: YEARS,
          datasets: [
            {
              label: tl("Voluntare", "Voluntary"),
              data: hs.map((o) => o.vol / o.avg),
              backgroundColor: P1.s[4],
            },
            {
              label: tl("Involuntare", "Involuntary"),
              data: hs.map((o) => o.inv / o.avg),
              backgroundColor: P1.s[1],
            },
            {
              label: tl("Pensionări", "Retirements"),
              data: hs.map((o) => o.ret / o.avg),
              backgroundColor: P1.s[5],
            },
          ],
        },
        options: {
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, ticks: { callback: tickPct } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } },
          },
        },
      },
      true,
    );
    const fn = [rs(3), rs(4), rs(5), rs(6), rs(8)];
    mk("c3", {
      type: "bar",
      data: {
        labels: tl(
          ["Candidaturi", "Preselecție", "Interviuri", "Oferte", "Angajări"],
          ["Applications", "Screening", "Interviews", "Offers", "Hires"],
        ),
        datasets: [
          {
            data: fn,
            backgroundColor: [P1.s[5], P1.s[5], P1.s[0], P1.s[0], P1.s[2]],
            borderRadius: 3,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) =>
                tl(
                  `${nf0.format(c.raw)} (${pct(c.raw / fn[0])} din candidaturi)`,
                  `${nf0.format(c.raw)} (${pct(c.raw / fn[0])} of applications)`,
                ),
            },
          },
        },
        scales: {
          x: {
            type: "logarithmic",
            ticks: {
              callback: (v) =>
                [100, 1000, 10000, 100000, 1000000].includes(v) ? nf0.format(v) : "",
            },
          },
          y: { grid: { display: false } },
        },
      },
    });
    mk("c4", {
      type: "bar",
      data: {
        labels: tl(
          [
            "Engagement",
            "Sprijinul managerului",
            "Carieră",
            "Volum de muncă",
            "Echitate salarială",
          ],
          ["Engagement", "Manager support", "Career", "Workload", "Pay fairness"],
        ),
        datasets: [
          {
            data: [e.eng, e.mgr, e.car, e.work, e.pay],
            backgroundColor: [P1.s[0], P1.s[2], P1.s[2], P1.s[2], P1.s[1]],
            borderRadius: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => nf1.format(c.raw) } },
        },
        scales: {
          y: { min: 40, max: 90 },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
        },
      },
    });
  };
  return {
    t: tl("Oameni", "People"),
    p: tl(
      `Câți suntem, câți vin, câți pleacă și ce spun angajații, ${pw()}${C ? `, comparat cu ${C.lab}` : ""}.`,
      `How many we are, how many join, how many leave and what employees say, ${pw()}${C ? `, compared with ${C.lab}` : ""}.`,
    ),
    html,
    after,
  };
};

SCR.oam2 = () => {
  const Pp = P();
  const regs = on("region") && S.region >= 0 ? [S.region] : [0, 1, 2, 3];
  const cell = (ri, di) => {
    const o = hrAggP(
      (z) => inR(z, Pp),
      (r) => r[1] === ri && r[2] === di,
      false,
    );
    return o.avg / Pp.n < 8 ? null : o.vr;
  };
  const hm =
    `<div class="tbl"><table><thead><tr><th>${tl("Departament", "Department")}</th>${regs.map((ri) => `<th>${NM.R[ri]}</th>`).join("")}</tr>` +
    `</thead><tbody>${D.D.map(
      (dn, di) =>
        `<tr><td>${NM.D[dn]}</td>${regs
          .map((ri) => {
            const v = cell(ri, di);
            return `<td class="heat" style="${heat(v, 0.05, 0.13, 0.3)}">${v == null ? "–" : pct(v)}</td>`;
          })
          .join("")}</tr>`,
    ).join("")}` +
    `</tbody></table></div>`;
  let hot = { v: 0 };
  regs.forEach((ri) =>
    D.D.forEach((dn, di) => {
      const v = cell(ri, di);
      if (v > hot.v) hot = { v, ri, dn };
    }),
  );
  const rsn = {};
  D.exr.forEach((r) => {
    if (inR(r[0], Pp) && hrF(r)) {
      rsn[r[3]] = (rsn[r[3]] || 0) + r[4];
    }
  });
  const rsE = Object.entries(rsn).sort((a, b) => b[1] - a[1]);
  const pts = [];
  regs.forEach((ri) =>
    D.D.forEach((dn, di) => {
      const h = hrAggP(
        (z) => inR(z, Pp),
        (r) => r[1] === ri && r[2] === di,
        false,
      );
      if (h.avg / Pp.n < 15) return;
      const e = engP(
        (z) => inR(z, Pp),
        (r) => r[1] === ri && r[2] === di,
        false,
      );
      pts.push({ x: e.eng, y: h.vr, l: `${NM.D[dn]}, ${NM.R[ri]}`, n: h.avg / Pp.n });
    }),
  );
  const pay = D.LV.map((_, li) =>
    [0, 1].map((gi) => {
      let n = 0,
        s = 0;
      D.pay.forEach((r) => {
        if (r[2] === li && r[3] === gi && (!on("region") || S.region < 0 || r[0] === S.region)) {
          n += r[4];
          s += r[5];
        }
      });
      return n ? s / n : null;
    }),
  );
  const fem = YEARS.map((z) => {
    let f = 0,
      t = 0;
    D.hlg.forEach((r) => {
      if (r[0] === z && r[2] >= 4 && (!on("region") || S.region < 0 || r[1] === S.region)) {
        t += r[4];
        if (r[3] === 0) f += r[4];
      }
    });
    return f / t;
  });
  const gapSen = (pay[4][1] - pay[4][0]) / pay[4][1];
  const html = [
    win(
      "s7",
      tl("Unde pleacă oamenii", "Where people leave"),
      "Plecări voluntare",
      tl(
        `Rata plecărilor voluntare pe departament și regiune ${pw()}${Pp.n > 1 ? " (medie anuală)" : ""}. ` +
          `Roșu = peste media companiei`,
        `Voluntary attrition rate by department and region ${pw()}${Pp.n > 1 ? " (annual average)" : ""}. ` +
          `Red = above the company average`,
      ),
      hm,
    ),
    win(
      "s5",
      tl("De ce pleacă", "Why they leave"),
      "Plecări voluntare",
      tl(`Motivele declarate ale demisiilor ${pw()}`, `Stated reasons for resignations ${pw()}`),
      cv("c1", true),
    ),
    win(
      "s6",
      tl("Engagement și plecări", "Engagement and attrition"),
      "Engagement",
      tl(
        `Fiecare punct e un departament dintr-o regiune (${Pp.lab}). Mărimea punctului = numărul de angajați`,
        `Each dot is a department in one region (${Pp.lab}). Dot size = headcount`,
      ),
      cv("c2", true),
    ),
    win(
      "s6",
      tl("Salariul mediu pe nivel: femei și bărbați", "Average salary by level: women and men"),
      "Diferență salarială de gen",
      tl(
        "Angajații activi la 31.12.2025, salariu de bază anual (datele salariale există doar pentru acest moment)",
        "Active employees at 31 Dec 2025, annual base salary (salary data exists only for this point in time)",
      ),
      cv("c3", true),
    ),
    win(
      "s12",
      tl(
        "Femei în funcții de conducere (L5 și peste)",
        "Women in senior leadership (L5 and above)",
      ),
      "Diferență salarială de gen",
      tl(
        "Ponderea femeilor la nivelurile L5, L6 și executiv, la final de an",
        "Share of women at levels L5, L6 and executive, at year end",
      ),
      cv("c4"),
    ),
    note(
      tl(
        `Cel mai fierbinte punct ${pw()} este echipa „${NM.D[hot.dn].toLowerCase()}” din ${NM.R[hot.ri]}, cu ${pct(hot.v)} plecări voluntare${Pp.n > 1 ? " pe an" : ""}. ` +
          `Principalul motiv declarat al demisiilor este „${NM.reason[D.reasons[rsE[0][0]]].toLowerCase()}”. ` +
          `Graficul cu puncte arată regula generală: unde engagement-ul e mic, plecările sunt mari. ` +
          `La nivelul L5, femeile câștigă în medie cu ${pct(gapSen)} mai puțin decât bărbații, iar ponderea lor în conducere a ajuns la ${pct(fem[4])} în 2025.`,
        `The hottest spot ${pw()} is the ${NM.D[hot.dn]} team in ${NM.R[hot.ri]}, with ${pct(hot.v)} voluntary attrition${Pp.n > 1 ? " a year" : ""}. ` +
          `The main stated reason for resigning is “${NM.reason[D.reasons[rsE[0][0]]].toLowerCase()}”. ` +
          `The scatter chart shows the general rule: where engagement is low, attrition is high. ` +
          `At level L5, women earn on average ${pct(gapSen)} less than men, and their share of senior leadership reached ${pct(fem[4])} in 2025.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: rsE.map((r) => NM.reason[D.reasons[r[0]]]),
        datasets: [{ data: rsE.map((r) => r[1]), backgroundColor: P1.s[4], borderRadius: 3 }],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (c) => nf0.format(c.raw) + tl(" demisii", " resignations") },
          },
        },
        scales: { y: { grid: { display: false } } },
      },
    });
    mk("c2", {
      type: "bubble",
      data: {
        datasets: [
          {
            data: pts.map((p) => ({
              x: p.x,
              y: p.y,
              r: Math.max(3, Math.sqrt(p.n) / 2.2),
              l: p.l,
            })),
            backgroundColor: P1.s[0] + "88",
            borderColor: P1.s[0],
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) =>
                tl(
                  `${c.raw.l}: engagement ${nf1.format(c.raw.x)}, plecări ${pct(c.raw.y)}`,
                  `${c.raw.l}: engagement ${nf1.format(c.raw.x)}, attrition ${pct(c.raw.y)}`,
                ),
            },
          },
        },
        scales: {
          x: { title: { display: true, text: "Engagement (0–100)", color: P1.ink3 } },
          y: {
            title: {
              display: true,
              text: tl("Plecări voluntare", "Voluntary attrition"),
              color: P1.ink3,
            },
            ticks: { callback: tickPct },
          },
        },
      },
    });
    mk("c3", {
      type: "bar",
      data: {
        labels: D.LV,
        datasets: [
          {
            label: tl("Femei", "Women"),
            data: pay.map((g) => g[0]),
            backgroundColor: P1.s[3],
            borderRadius: 3,
          },
          {
            label: tl("Bărbați", "Men"),
            data: pay.map((g) => g[1]),
            backgroundColor: P1.s[5],
            borderRadius: 3,
          },
        ],
      },
      options: {
        scales: {
          y: {
            ticks: {
              callback: (v) =>
                tl(nf0.format(v / 1000) + " mii €", "€" + nf0.format(v / 1000) + "k"),
            },
          },
          x: { grid: { display: false } },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label}: ${eurS(nf0.format(c.raw))}`,
              footer: (it) => {
                const g = pay[it[0].dataIndex];
                return g[0] && g[1]
                  ? `${tl("Diferență", "Gap")}: ${pct((g[1] - g[0]) / g[1])}`
                  : "";
              },
            },
          },
        },
      },
    });
    mk(
      "c4",
      {
        type: "line",
        data: {
          labels: YEARS,
          datasets: [
            {
              label: tl("Femei în L5+", "Women in L5+"),
              data: fem,
              borderColor: P1.s[3],
              backgroundColor: P1.s[3],
              tension: 0.3,
              pointRadius: 4,
            },
            {
              label: tl("Ținta companiei", "Company target"),
              data: YEARS.map((z) => kpi("Women in senior leadership (L5+)", z).t),
              borderColor: P1.ink3,
              borderDash: [5, 4],
              pointRadius: 0,
            },
          ],
        },
        options: {
          scales: {
            y: { ticks: { callback: tickPct }, suggestedMin: 0.25, suggestedMax: 0.45 },
            x: { grid: { display: false } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } },
          },
        },
      },
      true,
    );
  };
  return {
    t: tl("De ce arată așa echipele", "Why the teams look this way"),
    p: tl(
      "Unde și de ce pleacă oamenii, legătura cu engagement-ul și echitatea salarială.",
      "Where and why people leave, the link with engagement, and pay equity.",
    ),
    html,
    after,
  };
};

SCR.fin1 = () => {
  const Pp = P(),
    C = CP();
  const ni = finR(Pp, "net_income_eur"),
    nic = finR(C, "net_income_eur"),
    eps = finR(Pp, "eps_eur"),
    epsc = finR(C, "eps_eur"),
    dps = finR(Pp, "dps_eur"),
    dpsc = finR(C, "dps_eur");
  const roe = roeR(Pp),
    roec = roeR(C),
    sol = finR(Pp, "solvency_ii_ratio", "last"),
    solc = finR(C, "solvency_ii_ratio", "last"),
    px = finR(Pp, "share_price_eur_end", "last"),
    pxc = finR(C, "share_price_eur_end", "last");
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Profit net", "Net profit"),
      "Profit net",
      eurK(ni / 1000),
      dl(ni, nic, { ann: true }),
      flowNote(),
    ),
    card(
      tl("Profit pe acțiune", "Earnings per share"),
      "Profit pe acțiune",
      eurS(nf2.format(eps)),
      dl(eps, epsc, { ann: true }),
      flowNote(),
    ),
    card(
      tl("Dividend pe acțiune", "Dividend per share"),
      "Dividend pe acțiune",
      eurS(nf2.format(dps)),
      dl(dps, dpsc, { ann: true }),
      Pp.n > 1
        ? tl("total pe perioadă", "total for the period")
        : tl("plătit în trimestrul 2", "paid in Q2"),
    ),
    card(
      "ROE",
      "Rentabilitatea capitalurilor proprii",
      pct(roe),
      dl(roe, roec, { kind: "pp" }),
      Pp.n > 1 ? tl("medie anuală", "annual average") : "",
    ),
    card(
      tl("Solvabilitate", "Solvency ratio"),
      "Rata de solvabilitate",
      pct(sol, 0),
      dl(sol, solc, { kind: "pp" }),
      tl(
        `la sfârșitul lui ${Pp.to}; minim legal 100%`,
        `at the end of ${Pp.to}; regulatory minimum 100%`,
      ),
    ),
    card(
      tl("Prețul acțiunii", "Share price"),
      "Capitalizare bursieră",
      eurS(nf2.format(px)),
      dl(px, pxc),
      tl(`la sfârșitul lui ${Pp.to}`, `at the end of ${Pp.to}`),
    ),
    `</div>`,
    win(
      "s6",
      tl("Profit net pe trimestre", "Net profit by quarter"),
      "Profit net",
      tl(
        "Trimestrele roșii au fost lovite de evenimente catastrofale; zona colorată e perioada selectată",
        "The red quarters were hit by catastrophe events; the shaded area is the selected period",
      ),
      cv("c1"),
    ),
    win(
      "s6",
      tl("Prețul acțiunii", "Share price"),
      "Capitalizare bursieră",
      tl("Preț la sfârșitul fiecărui trimestru", "Price at the end of each quarter"),
      cv("c2"),
    ),
    win(
      "s6",
      tl("Rata de solvabilitate", "Solvency ratio"),
      "Solvency II",
      tl(
        "Linia punctată: pragul intern de 150%. Sub 100% compania nu ar mai avea voie să funcționeze normal",
        "Dashed line: the internal threshold of 150%. Below 100% the company would no longer be allowed to operate normally",
      ),
      cv("c3"),
    ),
    win(
      "s6",
      tl("Profit și dividend pe acțiune", "Earnings and dividend per share"),
      "Dividend pe acțiune",
      tl("Anual, în euro pe acțiune", "Annual, in euros per share"),
      cv("c4"),
    ),
    note(
      tl(
        `${pw()[0].toUpperCase() + pw().slice(1)}, grupul a raportat un profit net de ${eurK(ni / 1000)}${Pp.n > 1 ? " în total" : ""}${C ? `; media anuală e ${sgnPct(ni / Pp.n / (nic / C.n) - 1)} față de ${C.lab}` : ""}. ` +
          `Rentabilitatea capitalurilor proprii a fost ${pct(roe)}${Pp.n > 1 ? " pe an, în medie" : ""}, iar solvabilitatea de ${pct(sol, 0)} la finalul lui ${Pp.to} arată o companie bine capitalizată, cu spațiu pentru dividende și răscumpărări de acțiuni.`,
        `${pw()[0].toUpperCase() + pw().slice(1)}, the group reported a net profit of ${eurK(ni / 1000)}${Pp.n > 1 ? " in total" : ""}${C ? `; the annual average is ${sgnPct(ni / Pp.n / (nic / C.n) - 1)} vs ${C.lab}` : ""}. ` +
          `Return on equity was ${pct(roe)}${Pp.n > 1 ? " a year on average" : ""}, and a solvency ratio of ${pct(sol, 0)} at the end of ${Pp.to} points to a well-capitalised company with room for dividends and share buybacks.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const Q = D.fin.quarter;
    mk(
      "c1",
      {
        type: "bar",
        data: {
          labels: Q,
          datasets: [
            {
              data: D.fin.net_income_eur.map((v) => v / 1000),
              backgroundColor: Q.map((q) =>
                q === "2023-Q3" || q === "2024-Q3" ? P1.bad : inCol(+q.slice(0, 4), P1),
              ),
              borderRadius: 3,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => eurK(c.raw) } },
          },
          scales: {
            y: { ticks: { callback: tickEur } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
        },
      },
      true,
    );
    mk(
      "c2",
      {
        type: "line",
        data: {
          labels: Q,
          datasets: [
            {
              data: D.fin.share_price_eur_end,
              borderColor: P1.s[0],
              backgroundColor: P1.s[0],
              tension: 0.3,
              pointRadius: 2,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => eurS(nf2.format(c.raw)) } },
          },
          scales: {
            y: { ticks: { callback: (v) => tl(v + " €", "€" + v) } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
        },
      },
      true,
    );
    mk(
      "c3",
      {
        type: "line",
        data: {
          labels: Q,
          datasets: [
            {
              label: tl("Solvabilitate", "Solvency ratio"),
              data: D.fin.solvency_ii_ratio,
              borderColor: P1.s[2],
              backgroundColor: P1.s[2],
              tension: 0.3,
              pointRadius: 2,
            },
            {
              label: tl("Prag intern 150%", "Internal threshold 150%"),
              data: Q.map(() => 1.5),
              borderColor: P1.warn,
              borderDash: [5, 4],
              pointRadius: 0,
            },
            {
              label: tl("Minim legal 100%", "Regulatory minimum 100%"),
              data: Q.map(() => 1),
              borderColor: P1.bad,
              borderDash: [2, 3],
              pointRadius: 0,
            },
          ],
        },
        options: {
          scales: {
            y: { min: 0.8, ticks: { callback: tickPct } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw, 0)}` } },
          },
        },
      },
      true,
    );
    mk(
      "c4",
      {
        type: "bar",
        data: {
          labels: YEARS,
          datasets: [
            {
              label: tl("Profit pe acțiune", "Earnings per share"),
              data: YEARS.map((z) => finYear(z, "eps_eur")),
              backgroundColor: P1.s[0],
              borderRadius: 3,
            },
            {
              label: tl("Dividend pe acțiune", "Dividend per share"),
              data: YEARS.map((z) => finYear(z, "dps_eur")),
              backgroundColor: P1.s[1],
              borderRadius: 3,
            },
          ],
        },
        options: {
          scales: {
            y: { ticks: { callback: (v) => tl(v + " €", "€" + v) } },
            x: { grid: { display: false } },
          },
          plugins: {
            tooltip: {
              callbacks: { label: (c) => `${c.dataset.label}: ${eurS(nf2.format(c.raw))}` },
            },
          },
        },
      },
      true,
    );
  };
  return {
    t: tl("Financiar și investitori", "Finance & investors"),
    p: tl(
      `Profitul, randamentul pentru acționari și siguranța financiară a grupului, ${pw()}${C ? `, comparat cu ${C.lab}` : ""}.`,
      `Profit, shareholder returns and the group's financial strength, ${pw()}${C ? `, compared with ${C.lab}` : ""}.`,
    ),
    html,
    after,
  };
};

SCR.fin2 = () => {
  const Pp = P();
  const uwr = YEARS.map((z) => finYear(z, "underwriting_result_eur") / 1000),
    inc = YEARS.map((z) => finYear(z, "investment_income_eur") / 1000),
    oth = YEARS.map((z) => (finYear(z, "other_expenses_eur") - finYear(z, "tax_eur")) / 1000);
  const I = D.inv;
  const lastQ = `${Pp.to}-Q4`;
  const mix = Object.keys(NM.asset).map((a) => {
    let v = 0;
    I.quarter.forEach((q, i) => {
      if (q === lastQ && I.asset_class[i] === a) v = I.market_value_eur[i];
    });
    return v;
  });
  const Q = [...new Set(I.quarter)];
  const yl = (a) =>
    Q.map((q) => {
      let m = 0,
        n = 0;
      I.quarter.forEach((qq, i) => {
        if (qq === q && I.asset_class[i] === a) {
          m = I.market_value_eur[i];
          n = I.investment_income_eur[i];
        }
      });
      return (n * 4) / m;
    });
  const unr = Q.map((q) => {
    let s = 0;
    I.quarter.forEach((qq, i) => {
      if (qq === q) s += I.unrealised_gain_loss_eur[i];
    });
    return s / 1000;
  });
  const pu = finR(Pp, "underwriting_result_eur"),
    pi = finR(Pp, "investment_income_eur");
  const shareInv = pi / (pu + pi);
  const unr22 = sum(unr.slice(4, 8));
  const html = [
    win(
      "s7",
      tl("Din ce se compune profitul", "What makes up profit"),
      "Rezultat tehnic",
      tl(
        "Rezultatul tehnic (din asigurare) și veniturile din investiții, minus alte cheltuieli și impozit",
        "The underwriting result (from insurance) and investment income, less other expenses and tax",
      ),
      cv("c1", true),
    ),
    win(
      "s5",
      tl("Portofoliul de investiții", "Investment portfolio"),
      "Clasă de active",
      tl(`Structura la sfârșitul lui ${Pp.to}`, `Allocation at the end of ${Pp.to}`),
      cv("c2", true),
    ),
    win(
      "s6",
      tl("Randamentul pe clase de active", "Yield by asset class"),
      "Randament",
      tl(
        "Venitul anualizat raportat la valoarea de piață, pe trimestre",
        "Annualised income relative to market value, by quarter",
      ),
      cv("c3"),
    ),
    win(
      "s6",
      tl("Câștiguri și pierderi nerealizate", "Unrealised gains and losses"),
      "Câștig/pierdere nerealizată",
      tl(
        "Modificarea valorii portofoliului, pe trimestre",
        "Change in portfolio value, by quarter",
      ),
      cv("c4"),
    ),
    note(
      tl(
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${pct(shareInv, 0)} din profitul operațional a venit din investiții, iar restul din activitatea de asigurare. ` +
          `Anul 2022 arată de ce contează ambele surse: creșterea dobânzilor a scăzut valoarea obligațiunilor, cu pierderi nerealizate de ${eurK(Math.abs(unr22))} în acel an, dar a ridicat randamentele, care au susținut apoi profitul din 2023–2025.`,
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${pct(shareInv, 0)} of operating profit came from investments and the rest from insurance. ` +
          `The year 2022 shows why both sources matter: rising interest rates cut the value of bonds, with unrealised losses of ${eurK(Math.abs(unr22))} that year, but lifted yields, which then supported profit in 2023–2025.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk(
      "c1",
      {
        type: "bar",
        data: {
          labels: YEARS,
          datasets: [
            {
              label: tl("Rezultat tehnic", "Underwriting result"),
              data: uwr,
              backgroundColor: P1.s[0],
            },
            {
              label: tl("Venituri din investiții", "Investment income"),
              data: inc,
              backgroundColor: P1.s[2],
            },
            {
              label: tl("Alte cheltuieli și impozit", "Other expenses and tax"),
              data: oth,
              backgroundColor: P1.s[5],
            },
          ],
        },
        options: {
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, ticks: { callback: tickEur } },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (c) => `${c.dataset.label}: ${eurK(c.raw)}`,
                footer: (it) =>
                  `${tl("Profit net", "Net profit")}: ${eurK(sum(it.map((i) => i.raw)))}`,
              },
            },
          },
        },
      },
      true,
    );
    mk("c2", {
      type: "doughnut",
      data: {
        labels: Object.values(NM.asset),
        datasets: [
          { data: mix, backgroundColor: P1.s.slice(0, 5), borderColor: P1.panel, borderWidth: 2 },
        ],
      },
      options: {
        cutout: "62%",
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.label}: ${pct(c.raw / sum(mix))} (${eurK(c.raw / 1000)})`,
            },
          },
        },
      },
    });
    mk(
      "c3",
      {
        type: "line",
        data: {
          labels: Q,
          datasets: Object.keys(NM.asset).map((a, i) => ({
            label: NM.asset[a],
            data: yl(a),
            borderColor: P1.s[i],
            backgroundColor: P1.s[i],
            tension: 0.3,
            pointRadius: 0,
            borderWidth: 1.8,
          })),
        },
        options: {
          interaction: { mode: "index", intersect: false },
          scales: {
            y: { ticks: { callback: (v) => nf1.format(v * 100) + "%" } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
          plugins: {
            tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } },
          },
        },
      },
      true,
    );
    mk(
      "c4",
      {
        type: "bar",
        data: {
          labels: Q,
          datasets: [
            {
              data: unr,
              backgroundColor: unr.map((v) => (v >= 0 ? P1.good : P1.bad)),
              borderRadius: 3,
            },
          ],
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => eurK(c.raw) } },
          },
          scales: {
            y: { ticks: { callback: tickEur } },
            x: { grid: { display: false }, ticks: { maxTicksLimit: 10 } },
          },
        },
      },
      true,
    );
  };
  return {
    t: tl("De ce arată așa profitul", "Why profit looks this way"),
    p: tl(
      "Cele două motoare ale profitului unui asigurător: asigurarea și investițiile.",
      "The two engines of an insurer's profit: underwriting and investments.",
    ),
    html,
    after,
  };
};
