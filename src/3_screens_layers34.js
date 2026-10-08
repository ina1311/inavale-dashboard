/* ---------- extra glossary for layers 3–4 ---------- */
[
  [
    "Prognoză",
    "Forecast",
    "Analiză de date",
    "Estimarea valorii viitoare a unui indicator pe baza istoricului și a unor ipoteze. O prognoză bună vine întotdeauna cu un interval, nu cu o singură cifră.",
    "Aici: tendință + sezonalitate, calculate pe 2021–2025",
  ],
  [
    "Interval de prognoză",
    "Prediction interval",
    "Analiză de date",
    "Zona în care se așteaptă să cadă valoarea viitoare cu o anumită probabilitate. Un interval de 80% înseamnă că, în 8 cazuri din 10, rezultatul real va fi în interior.",
    "Cu cât istoria e mai zgomotoasă, cu atât intervalul e mai larg",
  ],
  [
    "Tendință",
    "Trend",
    "Analiză de date",
    "Direcția generală de evoluție a unei serii, după ce se elimină variațiile de sezon și zgomotul.",
    "Aici: creșterea medie lunară, estimată prin regresie liniară",
  ],
  [
    "Sezonalitate",
    "Seasonality",
    "Analiză de date",
    "Tipar care se repetă în fiecare an în aceleași luni, de exemplu vârful de prime din ianuarie, când se reînnoiesc polițele firmelor.",
    "Indice sezonier = abaterea medie a lunii față de media anului",
  ],
  [
    "Rata daunei de bază",
    "Attritional loss ratio",
    "Daune",
    "Rata daunei fără evenimentele catastrofale. Arată „normalul” portofoliului și e mult mai previzibilă decât rata totală.",
    "(Daune − cost catastrofe) / NEP",
  ],
  [
    "Încărcare pentru catastrofe",
    "Catastrophe load",
    "Daune",
    "Suma pe care un asigurător o prevede în plan pentru catastrofe, chiar dacă nu știe când vor avea loc. Se calculează din media multianuală a costurilor.",
    "Cost mediu anual al catastrofelor / NEP",
  ],
  [
    "Scenariu",
    "Scenario",
    "Analiză de date",
    "O combinație de ipoteze despre viitor („ce-ar fi dacă”) și efectul lor calculat asupra indicatorilor.",
    "Scenariu = bază + efectul fiecărei pârghii",
  ],
  [
    "Ipoteză",
    "Assumption",
    "Analiză de date",
    "O valoare aleasă de analist, nu măsurată, pe care se sprijină un calcul. Ipotezele trebuie să fie vizibile și ușor de schimbat.",
    "Aici: toate cursoarele din layerul „Ce facem”",
  ],
  [
    "Elasticitatea cererii",
    "Price elasticity",
    "Asigurări – business",
    "Cât de mult scade volumul vânzărilor când crește prețul. O elasticitate de 0,6 înseamnă că la +10% preț pierzi circa 6% din polițe.",
    "Variația volumului / variația prețului",
  ],
  [
    "Test de stres",
    "Stress test",
    "Risc și reglementare",
    "Simularea unui șoc sever (prăbușirea bursei, creșterea dobânzilor, o catastrofă) pentru a vedea dacă firma rămâne solvabilă.",
    "–",
  ],
  [
    "Retenție la reasigurare",
    "Reinsurance retention",
    "Risc și reglementare",
    "Partea dintr-o daună mare pe care asigurătorul o păstrează. Peste acest prag, până la o limită, plătește reasigurătorul.",
    "Daună netă = min(daună, retenție) + surplusul peste limita contractului",
  ],
  [
    "Durată",
    "Duration",
    "Investiții",
    "Sensibilitatea prețului unei obligațiuni la dobânzi. La o durată de 6 ani, o creștere a dobânzilor cu 1 punct procentual scade valoarea cu circa 6%.",
    "Δ valoare ≈ −durată × Δ dobândă",
  ],
  [
    "Cost de înlocuire",
    "Replacement cost",
    "Resurse umane",
    "Cât costă înlocuirea unui angajat care pleacă: recrutare, instruire, productivitate pierdută. Estimările uzuale sunt între 30% și 100% din salariul anual.",
    "Plecări × salariu mediu × procentul de înlocuire",
  ],
  [
    "Rentabilitatea investiției",
    "Return on investment (ROI)",
    "Financiar",
    "Câștigul net al unei acțiuni raportat la costul ei.",
    "(Beneficiu − cost) / cost",
  ],
].forEach((g) => {
  D.gl.push(g);
  GL[g[0]] = { t: g[0], en: g[1], dom: g[2], def: g[3], f: g[4] };
});
Object.assign(SUGG, {
  sin3: [
    "Cât de sigure sunt aceste prognoze?",
    "Ce ar putea strica prognoza pentru 2026?",
    "Vom atinge ținta de combined ratio în 2026?",
  ],
  sin4: [
    "Care pârghie are cel mai mare efect asupra profitului?",
    "Ce combinație ne-ar duce la un ROE de 18%?",
    "Explică-mi graficul în cascadă",
  ],
  bus3: [
    "Care regiune va crește cel mai repede în 2026?",
    "De ce e intervalul de prognoză mai larg la unele serii?",
    "Ce înseamnă sezonalitatea în acest grafic?",
  ],
  bus4: [
    "Care e scumpirea optimă pentru linia selectată?",
    "Cât de sensibil e rezultatul la elasticitate?",
    "Ce riscăm dacă scumpim prea mult?",
  ],
  dau3: [
    "Care e diferența dintre rata daunei de bază și cea totală?",
    "Cât ar trebui să prevedem pentru catastrofe în 2026?",
    "În ce luni sunt daunele cele mai mari?",
  ],
  dau4: [
    "Ce mărime de catastrofă ne-ar coborî sub 150% solvabilitate?",
    "Merită o retenție mai mică la reasigurare?",
    "Cât economisim din detectarea fraudei?",
  ],
  oam3: [
    "Care echipe au cel mai mare risc de plecări în 2026?",
    "Câți oameni trebuie să angajăm în 2026?",
    "Pe ce se bazează scorul de risc?",
  ],
  oam4: [
    "Merită programul de retenție pentru echipa selectată?",
    "Ce efect ar avea asupra clienților?",
    "Ce ipoteză influențează cel mai mult rezultatul?",
  ],
  fin3: [
    "Ce profit net estimăm pentru 2026?",
    "Ce parte din profit depinde de catastrofe?",
    "Cum va evolua solvabilitatea?",
  ],
  fin4: [
    "Ce șoc ar fi cel mai periculos pentru solvabilitate?",
    "De ce creșterea dobânzilor scade capitalul?",
    "Ce test de stres trece compania fără probleme?",
  ],
});

/* ---------- forecasting ---------- */
const Z80 = 1.2816;
function fcM(y) {
  const n = y.length,
    L = y.map((v) => Math.log(Math.max(v, 1)));
  const s = Array(12).fill(0);
  for (let k = 0; k < n / 12; k++) {
    const m = sum(L.slice(12 * k, 12 * k + 12)) / 12;
    for (let j = 0; j < 12; j++) s[j] += (L[12 * k + j] - m) / (n / 12);
  }
  const z = L.map((v, t) => v - s[t % 12]);
  const tb = (n - 1) / 2,
    zb = sum(z) / n;
  let sxy = 0,
    sxx = 0;
  z.forEach((v, t) => {
    sxy += (t - tb) * (v - zb);
    sxx += (t - tb) ** 2;
  });
  const b = sxy / sxx,
    a = zb - b * tb;
  const sd = Math.sqrt(sum(z.map((v, t) => (v - a - b * t) ** 2)) / (n - 2));
  const f = [],
    lo = [],
    hi = [];
  for (let t = n; t < n + 12; t++) {
    const mu = a + b * t + s[t % 12],
      e = Z80 * sd * Math.sqrt(1 + 1 / n + (t - tb) ** 2 / sxx);
    f.push(Math.exp(mu));
    lo.push(Math.exp(mu - e));
    hi.push(Math.exp(mu + e));
  }
  const p = sum(f),
    ea = Z80 * sd * Math.sqrt(1 / 12 + (n + 5.5 - tb) ** 2 / sxx);
  return { f, lo, hi, s, b, sd, y: { p, lo: p * Math.exp(-ea), hi: p * Math.exp(ea) } };
}
function linFc(ys) {
  const n = ys.length,
    xb = (n - 1) / 2,
    yb = sum(ys) / n;
  let sxy = 0,
    sxx = 0;
  ys.forEach((v, i) => {
    sxy += (i - xb) * (v - yb);
    sxx += (i - xb) ** 2;
  });
  const b = sxy / sxx,
    a = yb - b * xb;
  const sd = Math.sqrt(sum(ys.map((v, i) => (v - a - b * i) ** 2)) / Math.max(1, n - 2));
  const e = Z80 * sd * Math.sqrt(1 + 1 / n + (n - xb) ** 2 / sxx);
  return { p: a + b * n, lo: a + b * n - e, hi: a + b * n + e, b };
}
function catCost(pred = () => true) {
  const out = {};
  YEARS.forEach((y) => (out[y] = 0));
  D.cat.forEach(([m, n]) => {
    const rgn = n.includes("Europe") ? 0 : n.includes("US") ? 1 : 3;
    const f = (r) => r[1] === rgn && pred(r);
    const mm = uwAgg((r) => r[0] === m && f(r));
    if (!mm.nep) return;
    const same = [0, 1, 2, 3, 4]
      .map((k) => (m % 12) + 12 * k)
      .filter((x) => x !== m)
      .map((x) => uwAgg((r) => r[0] === x && f(r)).lr);
    const base = sum(same) / same.length;
    out[yOf(m)] += Math.max(0, (mm.lr - base) * mm.nep);
  });
  return out;
}
/* one shared base plan for 2026 (group level, or a filtered slice) */
function plan(pred = () => true) {
  const ser = D.months.map((_, mi) => uwAgg((r) => r[0] === mi && pred(r)));
  const g = fcM(ser.map((o) => o.gwp)),
    nepR =
      ser.slice(48).reduce((s, o) => s + o.nep, 0) / ser.slice(48).reduce((s, o) => s + o.gwp, 0);
  const yr = YEARS.map((y) => uwAgg((r) => yOf(r[0]) === y && pred(r)));
  const cc = catCost(pred);
  const baseLR = YEARS.map((y, i) => (yr[i].clm - cc[y]) / yr[i].nep);
  const lrB = (baseLR[3] + baseLR[4]) / 2;
  const lrSd = Math.max(
    0.01,
    Math.sqrt(sum(baseLR.slice(2).map((v) => (v - sum(baseLR.slice(2)) / 3) ** 2)) / 2),
  );
  const erF = linFc(yr.map((o) => o.er));
  const nep = g.y.p * nepR * 1.02;
  const catAvg = sum(Object.values(cc)) / 5,
    catMax = Math.max(...Object.values(cc));
  const cl = lrB + catAvg / nep,
    cr = cl + erF.p;
  return {
    ser,
    g,
    nep,
    nepR,
    yr,
    cc,
    baseLR,
    lrB,
    lrSd,
    er: erF.p,
    catAvg,
    catMax,
    catLoad: catAvg / nep,
    lr: cl,
    cr,
    crLo: cr - Z80 * lrSd,
    crHi: cr + Z80 * lrSd,
  };
}
let _plan = null;
const groupPlan = () => _plan || (_plan = plan());
function finPlan(p) {
  const inv25 = finYear(2025, "investment_income_eur") / 1000,
    eq25 = finYear(2025, "shareholders_equity_eur", "last") / 1000,
    ni25 = finYear(2025, "net_income_eur") / 1000,
    sol25 = finYear(2025, "solvency_ii_ratio", "last");
  const inv = inv25 * 1.05,
    oth = -p.nep * 0.012;
  const pbt = (cr) => p.nep * (1 - cr) + inv + oth;
  const ni = (cr) => {
    const x = pbt(cr);
    return x - Math.max(0, x) * 0.25;
  };
  const div = ni25 * 0.55,
    eq = (cr) => eq25 + ni(cr) - div,
    nepG = p.nep / (finYear(2025, "net_earned_premium_eur") / 1000);
  const sol = (cr) => (sol25 * (eq(cr) / eq25)) / (0.8 + 0.2 * nepG);
  return {
    inv,
    oth,
    ni,
    eq,
    sol,
    eq25,
    ni25,
    sol25,
    div,
    shares: D.fin.shares_outstanding[19],
    roe: (cr) => ni(cr) / ((eq25 + eq(cr)) / 2),
  };
}
const rangeTxt = (p, lo, hi, f) =>
  `${f(p)} <span style="font-size:13px;color:var(--ink-3);font-weight:400">(${f(lo)} – ${f(hi)})</span>`;
const sl = (key, label, min, max, step, fmt, term) => {
  const v = S.sc[key];
  return `<label style="display:block;margin:10px 0"><span style="display:flex;justify-content:space-between;font-size:13px;color:var(--ink-2)"><span>${label} ${term ? q(term) : ""}</span><b class="num" id="v-${key}">${fmt(v)}</b></span><input type="range" data-sc="${key}" data-in="${esc(label)}" data-shown="${esc(fmt(v))}" min="${min}" max="${max}" step="${step}" value="${v}" style="width:100%"></label>`;
};
const selIn = (key, label, opts) =>
  `<label style="display:block;margin:10px 0;font-size:13px;color:var(--ink-2)">${label}` +
  `<select data-sc="${key}" data-in="${esc(label)}" data-shown="${esc(opts[S.sc[key]])}" style="display:block;width:100%;margin-top:4px;border:1px solid var(--line-2);border-radius:6px;padding:6px 8px;background:var(--panel)">${opts.map((o, i) => `<option value="${i}" ${+S.sc[key] === i ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`;
function syncSl(fmts) {
  for (const k in fmts) {
    const el = document.getElementById("v-" + k);
    const v = fmts[k](S.sc[k]);
    if (el) el.textContent = v;
    const inp = document.querySelector(`[data-sc="${k}"]`);
    if (inp) inp.dataset.shown = v;
  }
}
S.sc = {
  price: 8,
  elast: 0.6,
  sreg: 3,
  sline: 0,
  catL: 600,
  catR: 0,
  ret: 150,
  fraud: 20,
  team: 1,
  treg: 0,
  tgt: 8,
  repl: 50,
  prog: 600,
  eqd: 20,
  rate: 100,
  dur: 6,
  catF: 0,
  syield: 0,
  scPrice: 0,
  scCat: 0,
  scAtt: 0,
  scYield: 0,
  scAsia: 0,
};
const pctS = (v) => (v > 0 ? "+" : "") + nf0.format(v) + "%",
  milS = (v) => tl(nf0.format(v) + " mil €", "€" + nf0.format(v) + "m"),
  ppS = (v) => (v > 0 ? "+" : "") + nf1.format(v) + " pp",
  bpS = (v) => (v > 0 ? "+" : "") + nf0.format(v) + tl(" pb", " bp");

/* ---------- layer 3: Ce urmează / What's next ---------- */
SCR.sin3 = () => {
  const p = groupPlan(),
    F = finPlan(p);
  const y25 = p.yr[4];
  const hc25 = sum(D.hr.filter((r) => r[0] === 2025).map((r) => r[4])),
    hcF = linFc(YEARS.map((y) => sum(D.hr.filter((r) => r[0] === y).map((r) => r[4]))));
  const va = YEARS.map(
      (y) =>
        hrAggP(
          (z) => z === y,
          () => true,
          false,
        ).vr,
    ),
    vaF = linFc(va.slice(1));
  const v25 = tl("față de 2025", "vs 2025");
  const rows = [
    [
      tl("Prime brute subscrise", "Gross written premium"),
      eurK(y25.gwp),
      rangeTxt(p.g.y.p, p.g.y.lo, p.g.y.hi, eurK),
      "Prime brute subscrise",
    ],
    ["Combined ratio", pct(y25.cr), rangeTxt(p.cr, p.crLo, p.crHi, pct), "Combined ratio"],
    [
      tl("Profit net", "Net profit"),
      eurK(F.ni25),
      rangeTxt(F.ni(p.cr), F.ni(p.crHi), F.ni(p.crLo), eurK),
      "Profit net",
    ],
    [
      "ROE",
      pct(roeR({ from: 2025, to: 2025 })),
      rangeTxt(F.roe(p.cr), F.roe(p.crHi), F.roe(p.crLo), pct),
      "Rentabilitatea capitalurilor proprii",
    ],
    [
      tl("Solvabilitate (final de an)", "Solvency ratio (year end)"),
      pct(F.sol25, 0),
      rangeTxt(F.sol(p.cr), F.sol(p.crHi), F.sol(p.crLo), (v) => pct(v, 0)),
      "Rata de solvabilitate",
    ],
    [
      tl("Angajați (final de an)", "Headcount (year end)"),
      nf0.format(hc25),
      rangeTxt(hcF.p, hcF.lo, hcF.hi, (v) => nf0.format(v)),
      "Număr de angajați",
    ],
    [
      tl("Plecări voluntare", "Voluntary attrition"),
      pct(va[4]),
      rangeTxt(vaF.p, vaF.lo, vaF.hi, pct),
      "Plecări voluntare",
    ],
  ];
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Prime brute 2026", "GWP 2026"),
      "Prognoză",
      eurK(p.g.y.p),
      [`${sgnPct(p.g.y.p / y25.gwp - 1)} ${v25}`, "good"],
      `${tl("interval 80%", "80% interval")}: ${eurK(p.g.y.lo)} – ${eurK(p.g.y.hi)}`,
    ),
    card(
      "Combined ratio 2026",
      "Combined ratio",
      pct(p.cr),
      [`${pp(p.cr - y25.cr)} ${v25}`, p.cr <= y25.cr ? "good" : "bad"],
      `${pct(p.crLo)} – ${pct(p.crHi)}`,
    ),
    card(
      tl("Profit net 2026", "Net profit 2026"),
      "Profit net",
      eurK(F.ni(p.cr)),
      [`${sgnPct(F.ni(p.cr) / F.ni25 - 1)} ${v25}`, F.ni(p.cr) >= F.ni25 ? "good" : "bad"],
      `${eurK(F.ni(p.crHi))} – ${eurK(F.ni(p.crLo))}`,
    ),
    card(
      tl("Solvabilitate 2026", "Solvency ratio 2026"),
      "Rata de solvabilitate",
      pct(F.sol(p.cr), 0),
      [tl("prag intern 150%", "internal threshold 150%"), F.sol(p.cr) >= 1.5 ? "good" : "bad"],
    ),
    `</div>`,
    win(
      "s7",
      tl("Prognoza indicatorilor-cheie pentru 2026", "2026 forecast for the key indicators"),
      "Interval de prognoză",
      tl(
        "Valoarea cea mai probabilă și, în paranteză, intervalul în care rezultatul real ar trebui să cadă în 8 cazuri din 10",
        "The most likely value and, in brackets, the range the actual result should fall within in 8 cases out of 10",
      ),
      `<div class="tbl"><table><thead><tr><th>${tl("Indicator", "Indicator")}</th>` +
        `<th>${tl("2025 realizat", "2025 actual")}</th><th>${tl("2026 prognoză", "2026 forecast")}</th></tr>` +
        `</thead><tbody>${rows.map((r) => `<tr><td>${r[0]} ${q(r[3])}</td><td class="num">${r[1]}</td><td class="num"><b>${r[2]}</b></td></tr>`).join("")}` +
        `</tbody></table></div>`,
    ),
    win(
      "s5",
      tl("Primele brute: istoric și prognoză", "Gross written premium: history and forecast"),
      "Prognoză",
      tl(
        "Barele 2021–2025 sunt realizate; bara 2026 arată intervalul de 80%, iar punctul, valoarea cea mai probabilă",
        "The 2021–2025 bars are actuals; the 2026 bar shows the 80% interval and the dot the most likely value",
      ),
      cv("c1", true),
    ),
    note(
      tl(
        `Pe baza tendinței din ultimii cinci ani, primele ar urma să crească în 2026 cu aproximativ ${sgnPct(p.g.y.p / y25.gwp - 1)}, la ${eurK(p.g.y.p)}. ` +
          `Combined ratio estimat e de ${pct(p.cr)}, dar include o „încărcare pentru catastrofe” de ${pct(p.catLoad)}: nu știm dacă 2026 va aduce o furtună, dar planul trebuie să o prevadă. ` +
          `Un an fără catastrofe ar duce combined ratio spre ${pct(p.cr - p.catLoad)}, iar unul ca 2024 ar putea să-l împingă peste ${pct(p.lrB + p.catMax / p.nep + p.er)}. ` +
          `Prognoza nu e o promisiune: e punctul de plecare pentru scenariile din layerul „Ce facem”.`,
        `Based on the trend of the last five years, premium should grow by about ${sgnPct(p.g.y.p / y25.gwp - 1)} in 2026, to ${eurK(p.g.y.p)}. ` +
          `The expected combined ratio is ${pct(p.cr)}, but it includes a “catastrophe load” of ${pct(p.catLoad)}: we don't know whether 2026 will bring a storm, but the plan has to allow for one. ` +
          `A year without catastrophes would take the combined ratio towards ${pct(p.cr - p.catLoad)}, while a year like 2024 could push it above ${pct(p.lrB + p.catMax / p.nep + p.er)}. ` +
          `The forecast is not a promise: it is the starting point for the scenarios in the “What we do” layer.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: [...YEARS, 2026],
        datasets: [
          {
            type: "line",
            label: tl("Valoare probabilă 2026", "Most likely value 2026"),
            data: [null, null, null, null, null, p.g.y.p],
            borderColor: P1.ink,
            backgroundColor: P1.ink,
            pointRadius: 5,
            showLine: false,
          },
          {
            label: tl("Prime brute", "Gross written premium"),
            data: [...p.yr.map((o) => o.gwp), [p.g.y.lo, p.g.y.hi]],
            backgroundColor: [...YEARS.map(() => P1.s[0]), P1.s[0] + "55"],
            borderColor: [...YEARS.map(() => P1.s[0]), P1.s[0]],
            borderWidth: [0, 0, 0, 0, 0, 1.5],
            borderRadius: 4,
          },
        ],
      },
      options: {
        scales: { y: { min: 6e6, ticks: { callback: tickEur } }, x: { grid: { display: false } } },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) =>
                Array.isArray(c.raw)
                  ? `${tl("Interval 80%", "80% interval")}: ${eurK(c.raw[0])} – ${eurK(c.raw[1])}`
                  : `${c.dataset.label}: ${eurK(c.raw)}`,
            },
          },
        },
      },
    });
  };
  return {
    t: tl("Ce urmează: 2026", "What's next: 2026"),
    p: tl(
      "Prognoze pe baza istoriei 2021–2025. Fiecare cifră vine cu un interval, pentru că viitorul nu se poate cunoaște exact.",
      "Forecasts based on the 2021–2025 history. Every figure comes with an interval, because the future cannot be known exactly.",
    ),
    html,
    after,
  };
};

SCR.bus3 = () => {
  const pr = (r) => uwF(r);
  const p = plan(pr);
  const y25 = p.yr[4];
  const regs = on("region") && S.region >= 0 ? [S.region] : [0, 1, 2, 3];
  const v25 = tl("față de 2025", "vs 2025");
  const rp = regs.map((ri) => {
    const x = plan((r) => r[1] === ri && uwF(r, { useRegion: false }));
    return { ri, a: x.yr[4].gwp, p: x.g.y.p, lo: x.g.y.lo, hi: x.g.y.hi };
  });
  const onl = YEARS.map((z) => {
    const t = uwAgg((r) => yOf(r[0]) === z && uwF(r, { useChan: false })).nw;
    return uwAgg((r) => yOf(r[0]) === z && r[3] === 2 && uwF(r, { useChan: false })).nw / t;
  });
  const onF = linFc(onl);
  const mons = [
    ...D.months,
    ...Array.from({ length: 12 }, (_, i) => `2026-${String(i + 1).padStart(2, "0")}`),
  ];
  const lowK = tl("jos", "lower");
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Prime brute 2026", "GWP 2026"),
      "Prognoză",
      eurK(p.g.y.p),
      [`${sgnPct(p.g.y.p / y25.gwp - 1)} ${v25}`, p.g.y.p >= y25.gwp ? "good" : "bad"],
      `${tl("interval 80%", "80% interval")}: ${eurK(p.g.y.lo)} – ${eurK(p.g.y.hi)}`,
    ),
    card(
      tl("Creștere anuală de tendință", "Annual trend growth"),
      "Tendință",
      sgnPct(Math.exp(p.g.b * 12) - 1),
      [tl("estimată din 60 de luni", "estimated from 60 months"), ""],
    ),
    card(
      tl("Cota online 2026 (polițe noi)", "Online share 2026 (new policies)"),
      "Canal de distribuție",
      pct(onF.p),
      [`${pp(onF.p - onl[4])} ${v25}`, ""],
      `${pct(onF.lo)} – ${pct(onF.hi)}`,
    ),
    card(
      "Combined ratio 2026",
      "Combined ratio",
      pct(p.cr),
      [`${pp(p.cr - y25.cr)} ${v25}`, p.cr <= y25.cr ? "good" : "bad"],
      `${pct(p.crLo)} – ${pct(p.crHi)}`,
    ),
    `</div>`,
    win(
      "s8",
      tl(
        "Prime brute lunare: istoric și prognoză 2026",
        "Monthly gross written premium: history and 2026 forecast",
      ),
      "Sezonalitate",
      tl(
        `${slice()}. Linia punctată e prognoza; zona din jur, intervalul de 80%. ` +
          `Vârfurile de ianuarie se repetă pentru că modelul a învățat sezonalitatea`,
        `${slice()}. The dashed line is the forecast; the band around it, the 80% interval. ` +
          `The January peaks repeat because the model has learned the seasonality`,
      ),
      cv("c1", true),
    ),
    win(
      "s4",
      tl("Tiparul sezonier", "Seasonal pattern"),
      "Sezonalitate",
      tl(
        "Cât de sus sau de jos e fiecare lună față de media anului",
        "How far above or below the annual average each month sits",
      ),
      cv("c2", true),
    ),
    win(
      "s12",
      tl("Prognoza pe regiuni", "Forecast by region"),
      "Interval de prognoză",
      tl(
        "Primele 2025 și intervalul estimat pentru 2026",
        "2025 premium and the estimated range for 2026",
      ),
      `<div class="tbl"><table><thead><tr><th>${tl("Regiune", "Region")}</th><th>${tl("2025 realizat", "2025 actual")}</th><th>${tl("2026 probabil", "2026 most likely")}</th><th>${tl("Interval 80%", "80% interval")}</th><th>${tl("Creștere", "Growth")}</th></tr></thead><tbody>${rp
        .map(
          (o) =>
            `<tr><td>${NM.R[o.ri]}</td><td class="num">${eurK(o.a)}</td><td class="num"><b>${eurK(o.p)}</b></td>` +
            `<td class="num">${eurK(o.lo)} – ${eurK(o.hi)}</td><td class="num ${o.p >= o.a ? "good" : "bad"}">${sgnPct(o.p / o.a - 1)}</td></tr>`,
        )
        .join("")}</tbody></table></div>`,
    ),
    note(
      tl(
        `Modelul separă seria în două componente: o tendință, adică o creștere de circa ${sgnPct(Math.exp(p.g.b * 12) - 1)} pe an pentru ${slice()}, și un tipar sezonier care se repetă în fiecare an. ` +
          `Pentru 2026 rezultă ${eurK(p.g.y.p)}, cu un interval de 80% între ${eurK(p.g.y.lo)} și ${eurK(p.g.y.hi)}. ` +
          `Canalul online ar ajunge la ${pct(onF.p)} din polițele noi, dacă tendința continuă. ` +
          `Atenție: un model de tendință presupune că viitorul seamănă cu trecutul; o scumpire sau o criză economică l-ar invalida, iar asta se testează în layerul „Ce facem”.`,
        `The model splits the series into two components: a trend, that is growth of about ${sgnPct(Math.exp(p.g.b * 12) - 1)} a year for ${slice()}, and a seasonal pattern that repeats every year. ` +
          `For 2026 this gives ${eurK(p.g.y.p)}, with an 80% interval between ${eurK(p.g.y.lo)} and ${eurK(p.g.y.hi)}. ` +
          `The online channel would reach ${pct(onF.p)} of new policies if the trend continues. ` +
          `A word of caution: a trend model assumes the future looks like the past; a price increase or an economic crisis would invalidate it, and that is what the “What we do” layer tests.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const hist = p.ser.map((o) => o.gwp);
    mk("c1", {
      type: "line",
      data: {
        labels: mons,
        datasets: [
          {
            label: tl("Realizat", "Actual"),
            data: [...hist, ...Array(12).fill(null)],
            borderColor: P1.s[0],
            backgroundColor: P1.s[0],
            pointRadius: 0,
            borderWidth: 1.8,
            tension: 0.25,
          },
          {
            label: tl("Interval 80%", "80% interval"),
            data: [...Array(59).fill(null), hist[59], ...p.g.hi],
            borderColor: "transparent",
            pointRadius: 0,
            fill: "+1",
            backgroundColor: P1.s[0] + "33",
          },
          {
            label: lowK,
            data: [...Array(59).fill(null), hist[59], ...p.g.lo],
            borderColor: "transparent",
            pointRadius: 0,
            fill: false,
          },
          {
            label: tl("Prognoză", "Forecast"),
            data: [...Array(59).fill(null), hist[59], ...p.g.f],
            borderColor: P1.s[0],
            borderDash: [5, 4],
            pointRadius: 0,
            borderWidth: 1.8,
            tension: 0.25,
          },
        ],
      },
      options: {
        interaction: { mode: "index", intersect: false },
        scales: {
          y: { ticks: { callback: tickEur } },
          x: { grid: { display: false }, ticks: { maxTicksLimit: 12 } },
        },
        plugins: {
          legend: { labels: { filter: (i) => i.text !== lowK } },
          tooltip: {
            callbacks: {
              label: (c) => (c.raw == null ? null : `${c.dataset.label}: ${eurK(c.raw)}`),
            },
          },
        },
      },
    });
    mk("c2", {
      type: "bar",
      data: {
        labels: MONTHS(),
        datasets: [
          {
            data: p.g.s.map((v) => Math.exp(v) - 1),
            backgroundColor: p.g.s.map((v) => (v >= 0 ? P1.s[0] : P1.s[5])),
            borderRadius: 3,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) =>
                `${sgnPct(c.raw)} ${tl("față de media anului", "vs the annual average")}`,
            },
          },
        },
        scales: { y: { ticks: { callback: tickPct } }, x: { grid: { display: false } } },
      },
    });
  };
  return {
    t: tl("Ce urmează pentru business", "What's next for the business"),
    p: tl(
      "Prognoza primelor pe 2026: tendință, sezonalitate și incertitudine.",
      "The 2026 premium forecast: trend, seasonality and uncertainty.",
    ),
    html,
    after,
  };
};

SCR.dau3 = () => {
  const pr = (r) => uwF(r, { useChan: false });
  const p = plan(pr);
  const y25 = p.yr[4];
  const mo = Array(12)
    .fill(0)
    .map((_, j) => {
      const v = [0, 1, 2, 3, 4]
        .map((k) => j + 12 * k)
        .filter((m) => !D.cat.some((c) => c[0] === m))
        .map((m) => uwAgg((r) => r[0] === m && pr(r)).lr);
      return sum(v) / v.length;
    });
  const cT =
    `<div class="tbl"><table><thead><tr><th>${tl("An", "Year")}</th>${YEARS.map((y) => `<th>${y}</th>`).join("")}` +
    `<th>${tl("Medie", "Average")}</th><th>${tl("Prevăzut 2026", "Planned 2026")}</th></tr>` +
    `</thead><tbody><tr><td>${tl("Cost catastrofe", "Catastrophe cost")}</td>${YEARS.map((y) => `<td class="num">${eurK(p.cc[y])}</td>`).join("")}` +
    `<td class="num">${eurK(p.catAvg)}</td><td class="num"><b>${eurK(p.catAvg)}</b></td></tr>` +
    `<tr><td>${tl("Rata daunei de bază", "Attritional loss ratio")} ${q("Rata daunei de bază")}</td>${p.baseLR.map((v) => `<td class="num">${pct(v)}</td>`).join("")}` +
    `<td></td><td class="num"><b>${pct(p.lrB)}</b></td></tr><tr><td>${tl("Rata daunei totală", "Total loss ratio")}</td>${p.yr.map((o) => `<td class="num">${pct(o.lr)}</td>`).join("")}` +
    `<td></td><td class="num"><b>${pct(p.lr)}</b></td></tr></tbody>` +
    `</table></div>`;
  const bad = tl("an rău", "bad year");
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Rata daunei de bază 2026", "Attritional loss ratio 2026"),
      "Rata daunei de bază",
      pct(p.lrB),
      [tl("media 2024–2025, fără catastrofe", "2024–2025 average, excluding catastrophes"), ""],
      `${pct(p.lrB - Z80 * p.lrSd)} – ${pct(p.lrB + Z80 * p.lrSd)}`,
    ),
    card(
      tl("Încărcare pentru catastrofe", "Catastrophe load"),
      "Încărcare pentru catastrofe",
      pct(p.catLoad),
      [tl("media anuală 2021–2025", "2021–2025 annual average"), ""],
      `${bad}: ${pct(p.catMax / p.nep)}`,
    ),
    card(tl("Rata daunei totală 2026", "Total loss ratio 2026"), "Rata daunei", pct(p.lr), [
      `${pp(p.lr - y25.lr)} ${tl("față de 2025", "vs 2025")}`,
      p.lr <= y25.lr ? "good" : "bad",
    ]),
    card(
      tl("Buget catastrofe 2026", "Catastrophe budget 2026"),
      "Eveniment catastrofal",
      eurK(p.catAvg),
      [tl("valoare medie", "average value"), ""],
      `${bad}: ${eurK(p.catMax)}`,
    ),
    `</div>`,
    win(
      "s7",
      tl("Rata daunei: de bază și catastrofe", "Loss ratio: attritional and catastrophe"),
      "Rata daunei de bază",
      tl(
        `${slice()}. Bara întunecată: daunele „normale”; bara deschisă: catastrofele. ` +
          `Pentru 2026, catastrofele sunt media multianuală`,
        `${slice()}. Dark bar: “normal” claims; light bar: catastrophes. For 2026, catastrophes are the multi-year average`,
      ),
      cv("c1", true),
    ),
    win(
      "s5",
      tl("În ce luni sunt daunele mai mari", "Which months have higher claims"),
      "Sezonalitate",
      tl(
        "Rata daunei medie pe lună, fără lunile cu catastrofe",
        "Average loss ratio by month, excluding catastrophe months",
      ),
      cv("c2", true),
    ),
    win(
      "s12",
      tl("De unde vine prognoza", "Where the forecast comes from"),
      "Prognoză",
      tl(
        "Cum se construiește rata daunei prevăzută pentru 2026",
        "How the planned 2026 loss ratio is built",
      ),
      cT,
    ),
    note(
      tl(
        `O prognoză profesionistă a daunelor nu extrapolează rata totală, pentru că aceasta sare mult din cauza catastrofelor. ` +
          `Separă două componente: rata de bază (${pct(p.lrB)} pentru ${slice()}), care e stabilă și se poate prognoza, și încărcarea pentru catastrofe (${pct(p.catLoad)}), care e o medie multianuală: nu știm când vine furtuna, dar știm cam cât costă în medie. ` +
          `Împreună dau ${pct(p.lr)}. Diferența dintre un an obișnuit și un an rău, de ${eurK(p.catMax - p.catAvg)}, e exact riscul pentru care există reasigurarea.`,
        `A professional claims forecast does not extrapolate the total loss ratio, because it jumps around with catastrophes. ` +
          `It separates two components: the attritional loss ratio (${pct(p.lrB)} for ${slice()}), which is stable and can be forecast, and the catastrophe load (${pct(p.catLoad)}), which is a multi-year average: we don't know when the storm will hit, but we know roughly what it costs on average. ` +
          `Together they give ${pct(p.lr)}. The gap between a normal year and a bad one, ${eurK(p.catMax - p.catAvg)}, is exactly the risk that reinsurance exists for.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: [...YEARS, tl("2026 (plan)", "2026 (plan)")],
        datasets: [
          {
            label: tl("Rata de bază", "Attritional"),
            data: [...p.baseLR, p.lrB],
            backgroundColor: P1.s[0],
          },
          {
            label: tl("Catastrofe", "Catastrophes"),
            data: [...YEARS.map((y, i) => p.cc[y] / p.yr[i].nep), p.catLoad],
            backgroundColor: P1.bad + "aa",
          },
        ],
      },
      options: {
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, min: 0, ticks: { callback: tickPct } },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => `${c.dataset.label}: ${pct(c.raw)}`,
              footer: (it) => `Total: ${pct(sum(it.map((i) => i.raw)))}`,
            },
          },
        },
      },
    });
    mk("c2", {
      type: "bar",
      data: {
        labels: MONTHS(),
        datasets: [{ data: mo, backgroundColor: P1.s[2], borderRadius: 3 }],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => pct(c.raw) } },
        },
        scales: {
          y: { min: Math.floor(Math.min(...mo) * 20 - 1) / 20, ticks: { callback: tickPct } },
          x: { grid: { display: false } },
        },
      },
    });
  };
  return {
    t: tl("Ce urmează pentru daune", "What's next for claims"),
    p: tl(
      "Rata daunei așteptată în 2026, separată în partea previzibilă și riscul de catastrofe.",
      "The expected 2026 loss ratio, split into the predictable part and the catastrophe risk.",
    ),
    html,
    after,
  };
};

SCR.oam3 = () => {
  const regs = on("region") && S.region >= 0 ? [S.region] : [0, 1, 2, 3];
  const T = [];
  regs.forEach((ri) =>
    D.D.forEach((dn, di) => {
      const r3 = [2023, 2024, 2025].map((y) => {
        const o = hrAggP(
          (z) => z === y,
          (r) => r[1] === ri && r[2] === di,
          false,
        );
        return o.avg ? o.vr : 0;
      });
      const hc = sum(
        D.hr.filter((r) => r[0] === 2025 && r[1] === ri && r[2] === di).map((r) => r[4]),
      );
      if (hc < 20) return;
      const e = engP(
        (z) => z === 2025,
        (r) => r[1] === ri && r[2] === di,
        false,
      ).eng;
      const base = 0.5 * r3[2] + 0.3 * r3[1] + 0.2 * r3[0];
      const pred = Math.max(0.02, base + (74 - e) * 0.004);
      const risk = Math.min(100, Math.round((pred / 0.3) * 100));
      T.push({ ri, dn, hc, e, pred, risk, exp: hc * pred });
    }),
  );
  T.sort((a, b) => b.risk - a.risk);
  const tot = sum(T.map((t) => t.exp)),
    hc25 = sum(T.map((t) => t.hc));
  const hcY = YEARS.map((y) => sum(D.hr.filter((r) => r[0] === y && hrF(r)).map((r) => r[4])));
  const hF = linFc(hcY);
  const need = tot + (hF.p - hc25);
  const byD = D.D.map((dn) => ({
    dn,
    v: sum(T.filter((t) => t.dn === dn).map((t) => t.exp)),
  })).sort((a, b) => b.v - a.v);
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Plecări voluntare estimate 2026", "Expected voluntary leavers 2026"),
      "Prognoză",
      nf0.format(tot),
      [tl(`${pct(tot / hc25)} din angajați`, `${pct(tot / hc25)} of headcount`), ""],
    ),
    card(
      tl("Angajați la final de 2026", "Headcount at end of 2026"),
      "Număr de angajați",
      nf0.format(hF.p),
      [`${sgnPct(hF.p / hcY[4] - 1)} ${tl("față de 2025", "vs 2025")}`, ""],
      `${nf0.format(hF.lo)} – ${nf0.format(hF.hi)}`,
    ),
    card(
      tl("Necesar de angajări 2026", "Hiring need 2026"),
      "Pâlnie de recrutare",
      nf0.format(need),
      [tl("înlocuiri + creștere", "replacements + growth"), ""],
    ),
    card(
      tl("Echipe cu risc ridicat", "High-risk teams"),
      "Plecări voluntare",
      nf0.format(T.filter((t) => t.risk >= 60).length),
      [tl("scor de risc ≥ 60", "risk score ≥ 60"), ""],
    ),
    `</div>`,
    win(
      "s7",
      tl("Unde e riscul de plecări în 2026", "Where the 2026 attrition risk is"),
      "Plecări voluntare",
      tl(
        "Echipele cu cel mai mare risc, după istoricul plecărilor din 2023–2025 și engagement-ul din 2025",
        "The teams with the highest risk, based on 2023–2025 attrition history and 2025 engagement",
      ),
      `<div class="tbl"><table><thead><tr><th>${tl("Echipă", "Team")}</th>` +
        `<th>${tl("Angajați", "Headcount")}</th><th>Engagement 2025</th>` +
        `<th>${tl("Rată estimată 2026", "Expected rate 2026")}</th><th>${tl("Plecări estimate", "Expected leavers")}</th>` +
        `<th>${tl("Scor de risc", "Risk score")}</th></tr></thead><tbody>${T.slice(0, 10)
          .map(
            (t) =>
              `<tr><td>${NM.D[t.dn]}, ${NM.R[t.ri]}</td><td class="num">${nf0.format(t.hc)}</td>` +
              `<td class="num">${nf1.format(t.e)}</td><td class="heat" style="${heat(t.pred, 0.05, 0.13, 0.3)}">${pct(t.pred)}</td>` +
              `<td class="num">${nf0.format(t.exp)}</td><td class="num"><b>${t.risk}</b></td></tr>`,
          )
          .join("")}` +
        `</tbody></table></div>`,
    ),
    win(
      "s5",
      tl("Plecări estimate pe departamente", "Expected leavers by department"),
      "Prognoză",
      tl("Numărul de demisii așteptate în 2026", "Number of resignations expected in 2026"),
      cv("c1", true),
    ),
    note(
      tl(
        `Pentru 2026 estimăm în jur de ${nf0.format(tot)} de plecări voluntare ${on("region") && S.region >= 0 ? "în " + NM.R[S.region] : "în grup"}, ceea ce, împreună cu creșterea echipelor, înseamnă un necesar de circa ${nf0.format(need)} de angajări. ` +
          `Estimarea ponderează mai mult anii recenți (50% 2025, 30% 2024, 20% 2023) și ajustează pentru engagement: fiecare punct sub 74 adaugă 0,4 pp la risc. ` +
          `Scorul e o regulă simplă, transparentă, nu un model statistic sofisticat; în practică, echipele de HR l-ar valida cu managerii.`,
        `For 2026 we expect around ${nf0.format(tot)} voluntary leavers ${on("region") && S.region >= 0 ? "in " + NM.R[S.region] : "across the group"}, which, together with team growth, means a hiring need of about ${nf0.format(need)}. ` +
          `The estimate gives more weight to recent years (50% 2025, 30% 2024, 20% 2023) and adjusts for engagement: every point below 74 adds 0.4 pp to the risk. ` +
          `The score is a simple, transparent rule, not a sophisticated statistical model; in practice, HR teams would validate it with line managers.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: byD.map((o) => NM.D[o.dn]),
        datasets: [{ data: byD.map((o) => o.v), backgroundColor: P1.s[4], borderRadius: 3 }],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => nf0.format(c.raw) + tl(" plecări estimate", " expected leavers"),
            },
          },
        },
        scales: { y: { grid: { display: false } } },
      },
    });
  };
  return {
    t: tl("Ce urmează pentru oameni", "What's next for people"),
    p: tl(
      "Riscul de plecări și necesarul de angajări pentru 2026.",
      "Attrition risk and hiring needs for 2026.",
    ),
    html,
    after,
  };
};

SCR.fin3 = () => {
  const p = groupPlan(),
    F = finPlan(p);
  const niB = F.ni(p.cr),
    niNoCat = F.ni(p.cr - p.catLoad),
    niBad = F.ni(p.lrB + p.catMax / p.nep + p.er);
  const epsB = (niB * 1000) / F.shares,
    divB = (niB * 0.55 * 1000) / F.shares;
  const html = [
    `<div class="s12 cards">`,
    card(
      tl("Profit net 2026", "Net profit 2026"),
      "Profit net",
      eurKd(niB),
      [
        `${sgnPct(niB / F.ni25 - 1)} ${tl("față de 2025", "vs 2025")}`,
        niB >= F.ni25 ? "good" : "bad",
      ],
      `${eurKd(F.ni(p.crHi))} – ${eurKd(F.ni(p.crLo))}`,
    ),
    card(
      tl("Profit pe acțiune 2026", "Earnings per share 2026"),
      "Profit pe acțiune",
      eurS(nf2.format(epsB)),
      [tl("la numărul actual de acțiuni", "at the current share count"), ""],
    ),
    card(
      tl("Dividend posibil (plătit în 2027)", "Potential dividend (paid in 2027)"),
      "Dividend pe acțiune",
      eurS(nf2.format(divB)),
      [tl("55% din profit", "55% of profit"), ""],
    ),
    card(
      tl("Solvabilitate final 2026", "Solvency ratio end-2026"),
      "Rata de solvabilitate",
      pct(F.sol(p.cr), 0),
      [tl("prag intern 150%", "internal threshold 150%"), F.sol(p.cr) >= 1.5 ? "good" : "bad"],
      `${pct(F.sol(p.crHi), 0)} – ${pct(F.sol(p.crLo), 0)}`,
    ),
    `</div>`,
    win(
      "s7",
      tl("Trei variante pentru profitul din 2026", "Three outcomes for 2026 profit"),
      "Scenariu",
      tl(
        "Fără catastrofe, cu catastrofe medii (planul) și cu un an rău ca 2024",
        "No catastrophes, average catastrophes (the plan) and a bad year like 2024",
      ),
      cv("c1", true),
    ),
    win(
      "s5",
      tl("Cum se construiește profitul prevăzut", "How the planned profit is built"),
      "Rezultat tehnic",
      tl(
        "Componentele planului de profit pentru 2026",
        "The building blocks of the 2026 profit plan",
      ),
      `<div class="tbl"><table><tbody>
  <tr><td>${tl("Prime nete câștigate", "Net earned premium")} ${q("Prime nete câștigate")}</td>` +
        `<td class="num">${eurK(p.nep)}</td></tr>
  <tr><td>${tl("− Daune (bază + catastrofe) și cheltuieli", "− Claims (attritional + catastrophe) and expenses")}: ${pct(p.cr)} ${q("Combined ratio")}</td>` +
        `<td class="num">−${eurK(p.nep * p.cr)}</td></tr>
  <tr><td>${tl("= Rezultat tehnic", "= Underwriting result")} ${q("Rezultat tehnic")}</td>` +
        `<td class="num">${eurK(p.nep * (1 - p.cr))}</td></tr>
  <tr>` +
        `<td>${tl("+ Venituri din investiții (+5%)", "+ Investment income (+5%)")}</td>` +
        `<td class="num">${eurK(F.inv)}</td></tr>
  <tr><td>${tl("− Alte cheltuieli", "− Other expenses")}</td>` +
        `<td class="num">−${eurK(-F.oth)}</td></tr>
  <tr><td>${tl("− Impozit (25%)", "− Tax (25%)")}</td>` +
        `<td class="num">−${eurK((p.nep * (1 - p.cr) + F.inv + F.oth) * 0.25)}</td></tr>
  ` +
        `<tr><td><b>${tl("= Profit net", "= Net profit")}</b></td><td class="num"><b>${eurKd(niB)}</b></td></tr>` +
        `</tbody></table></div>`,
    ),
    note(
      tl(
        `Planul de profit pentru 2026 e de aproximativ ${eurKd(niB)}. ` +
          `Diferența dintre varianta fără catastrofe (${eurK(niNoCat)}) și un an rău (${eurK(niBad)}) e de ${eurK(niNoCat - niBad)}: aproape tot riscul profitului vine din vreme, nu din business. ` +
          `Investițiile aduc o parte stabilă, de circa ${eurK(F.inv)}. ` +
          `Solvabilitatea ar rămâne în jur de ${pct(F.sol(p.cr), 0)}, confortabil peste pragul intern de 150%.`,
        `The 2026 profit plan is about ${eurKd(niB)}. The gap between the no-catastrophe outcome (${eurK(niNoCat)}) and a bad year (${eurK(niBad)}) is ${eurK(niNoCat - niBad)}: almost all of the profit risk comes from the weather, not from the business. ` +
          `Investments provide a stable contribution of about ${eurK(F.inv)}. ` +
          `The solvency ratio would stay around ${pct(F.sol(p.cr), 0)}, comfortably above the internal threshold of 150%.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: tl(
          ["Fără catastrofe", "Plan (catastrofe medii)", "An rău (ca 2024)"],
          ["No catastrophes", "Plan (average catastrophes)", "Bad year (like 2024)"],
        ),
        datasets: [
          {
            data: [niNoCat, niB, niBad],
            backgroundColor: [P1.good, P1.s[0], P1.bad],
            borderRadius: 4,
          },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => eurK(c.raw) } },
        },
        scales: { y: { ticks: { callback: tickEur } }, x: { grid: { display: false } } },
      },
    });
  };
  return {
    t: tl("Ce urmează pentru profit", "What's next for profit"),
    p: tl(
      "Planul financiar pentru 2026 și cât de mult depinde de catastrofe.",
      "The 2026 financial plan and how much it depends on catastrophes.",
    ),
    html,
    after,
  };
};

/* ---------- layer 4: Ce facem / What we do (scenarios) ---------- */
const winC = (title, term, sub, body) =>
  win("s4 ctrl", title, term, sub, `<div class="sls">${body}</div>`);
function upd(id, html) {
  const el = document.getElementById(id);
  if (el) {
    el.innerHTML = html;
    fitVals(el);
  }
}
function updChart(i, fn) {
  const c = charts[i];
  if (!c) return;
  c.stop();
  fn(c);
  c.update("none");
}

function pricing(ri, li, price, el) {
  const pr = (r) => r[1] === ri && r[2] === li;
  const b = plan(pr);
  const y25 = b.yr[4];
  const gwp = b.g.y.p,
    nep = b.nep,
    lr = b.lr,
    acqR = y25.acq / y25.gwp,
    adm = y25.adm * (gwp / y25.gwp);
  const f = (p) => {
    const v = 1 - el * p,
      g2 = gwp * (1 + p) * v,
      n2 = nep * (1 + p) * v,
      cl = lr * nep * v,
      ac = acqR * g2,
      res = n2 - cl - ac - adm;
    return { g2, n2, cl, res, cr: (cl + ac + adm) / n2, lost: v };
  };
  return { b, base: f(0), sc: f(price / 100), f };
}
SCR.bus4 = () => {
  const sc = S.sc;
  const lines = NM.R.flatMap((r, ri) => NM.L.map((l, li) => `${r} · ${l}`));
  const html = `${winC(
    tl("Ipotezele", "Assumptions"),
    "Ipoteză",
    tl(
      "Alege combinația regiune–produs și mișcă cursoarele; rezultatele se recalculează imediat",
      "Pick a region–product combination and move the sliders; the results are recalculated instantly",
    ),
    selIn("sreg", tl("Regiune", "Region"), NM.R) +
      selIn("sline", tl("Linie de business", "Line of business"), NM.L) +
      sl("price", tl("Modificarea prețului", "Price change"), -10, 25, 1, pctS) +
      sl(
        "elast",
        tl("Elasticitatea cererii", "Price elasticity of demand"),
        0,
        1.5,
        0.05,
        (v) => nf2.format(v),
        "Elasticitatea cererii",
      ) +
      `<p class="sub" style="margin-top:8px">${tl("Elasticitatea e o ipoteză: 0,6 înseamnă că la +10% preț pierzi 6% din polițe. Pentru asigurările auto, valorile uzuale sunt între 0,3 și 1.", "Elasticity is an assumption: 0.6 means that a +10% price increase loses 6% of policies. For motor insurance, typical values are between 0.3 and 1.")}</p>`,
  )}
 <div class="s8" style="display:flex;flex-direction:column;gap:14px"><div class="cards" id="bOut"></div>
 ${win("s12", tl("Rezultatul tehnic în funcție de preț", "Underwriting result by price level"), "Scenariu", tl("Curba arată rezultatul pentru fiecare nivel de preț; punctul e scenariul ales", "The curve shows the result at each price level; the dot is the chosen scenario"), cv("c1", true))}</div>
 <div class="note" id="bNote"></div>`;
  const fm = { price: pctS, elast: (v) => nf2.format(v) };
  const calc = () => {
    const x = pricing(+sc.sreg, +sc.sline, sc.price, sc.elast);
    const bs = x.base,
      s = x.sc;
    const xs = [];
    for (let p = -10; p <= 25; p++) xs.push(p);
    const curve = xs.map((p) => x.f(p / 100).res);
    const best = xs[curve.indexOf(Math.max(...curve))];
    return { x, bs, s, xs, curve, best };
  };
  const update = () => {
    syncSl(fm);
    const { x, bs, s, xs, curve, best } = calc();
    const nm = tl(
      `${NM.L[+sc.sline].toLowerCase()} în ${NM.R[+sc.sreg]}`,
      `${NM.L[+sc.sline]} in ${NM.R[+sc.sreg]}`,
    );
    const vp = tl("față de plan", "vs plan");
    upd(
      "bOut",
      card(tl("Prime brute 2026", "GWP 2026"), "Prime brute subscrise", eurK(s.g2), [
        `${sgnPct(s.g2 / bs.g2 - 1)} ${vp}`,
        "",
      ]) +
        card(tl("Polițe", "Policies"), "Elasticitatea cererii", sgnPct(s.lost - 1), [
          tl("volum față de plan", "volume vs plan"),
          s.lost >= 1 ? "good" : "bad",
        ]) +
        card("Combined ratio", "Combined ratio", pct(s.cr), [
          `plan: ${pct(bs.cr)}`,
          s.cr <= bs.cr ? "good" : "bad",
        ]) +
        card(tl("Rezultat tehnic", "Underwriting result"), "Rezultat tehnic", eurK(s.res), [
          `${s.res >= bs.res ? "+" : "−"}${eurK(Math.abs(s.res - bs.res))} ${vp}`,
          s.res >= bs.res ? "good" : "bad",
        ]),
    );
    upd(
      "bNote",
      noteInner(
        tl(
          `Pentru ${nm}, planul pe 2026 are un combined ratio de ${pct(bs.cr)} și un rezultat tehnic de ${eurK(bs.res)}. O modificare de preț de ${pctS(sc.price)}, cu elasticitatea ${nf2.format(sc.elast)}, ar duce combined ratio la ${pct(s.cr)} și rezultatul la ${eurK(s.res)}. ${best >= 25 ? "La aceste ipoteze, rezultatul crește pe tot intervalul testat: linia e atât de subevaluată încât fiecare scumpire ajută. Limita reală o dă cât de mult acceptă clienții, adică elasticitatea." : best <= -10 ? "La aceste ipoteze, o ieftinire ar aduce mai mult, pentru că volumul câștigat compensează prețul mai mic." : `La aceste ipoteze, rezultatul maxim se obține la o modificare de ${pctS(best)}; dincolo de ea, clienții pierduți costă mai mult decât câștigul din preț.`} Merită testată și o elasticitate mai mare: pe o piață competitivă, clienții pleacă mai repede.`,
          `For ${nm}, the 2026 plan has a combined ratio of ${pct(bs.cr)} and an underwriting result of ${eurK(bs.res)}. A price change of ${pctS(sc.price)}, with an elasticity of ${nf2.format(sc.elast)}, would take the combined ratio to ${pct(s.cr)} and the result to ${eurK(s.res)}. ${best >= 25 ? "Under these assumptions, the result improves across the whole tested range: the line is so underpriced that every price increase helps. The real limit is how much customers will accept, that is, the elasticity." : best <= -10 ? "Under these assumptions, a price cut would pay off more, because the volume gained outweighs the lower price." : `Under these assumptions, the result peaks at a price change of ${pctS(best)}; beyond that, the customers lost cost more than the extra price brings in.`} A higher elasticity is also worth testing: in a competitive market, customers leave faster.`,
        ),
      ),
    );
    updChart(0, (c) => {
      c.data.datasets[0].data = curve;
      c.data.datasets[1].data = xs.map((p) => (p === sc.price ? s.res : null));
    });
  };
  const after = () => {
    const P1 = pal();
    const { xs, curve, s } = calc();
    mk("c1", {
      type: "line",
      data: {
        labels: xs.map(pctS),
        datasets: [
          {
            label: tl("Rezultat tehnic", "Underwriting result"),
            data: curve,
            borderColor: P1.s[0],
            backgroundColor: P1.s[0],
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: tl("Scenariul ales", "Chosen scenario"),
            data: xs.map((p) => (p === sc.price ? s.res : null)),
            borderColor: P1.s[1],
            backgroundColor: P1.s[1],
            pointRadius: 7,
            showLine: false,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { callback: tickEur } },
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: tl("Modificarea prețului", "Price change"),
              color: P1.ink3,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) => (c.raw == null ? null : `${c.dataset.label}: ${eurK(c.raw)}`),
            },
          },
        },
      },
    });
    update();
  };
  return {
    t: tl("Ce facem: prețuri", "What we do: pricing"),
    p: tl(
      "Simulatorul de preț: cât câștigi sau pierzi dacă modifici prețul unei linii.",
      "The pricing simulator: how much you gain or lose by changing the price of a line.",
    ),
    html,
    after,
    update,
  };
};

function catImpact(loss, ret, limit = 1000) {
  const net = Math.min(loss, ret) + Math.max(0, loss - ret - limit);
  return net;
}
SCR.dau4 = () => {
  const sc = S.sc;
  const p = groupPlan(),
    F = finPlan(p);
  const html = `${winC(
    tl("Ipotezele", "Assumptions"),
    "Test de stres",
    tl(
      "Simulează o catastrofă în 2026 și protecția prin reasigurare",
      "Simulate a catastrophe in 2026 and the protection from reinsurance",
    ),
    sl(
      "catL",
      tl("Mărimea catastrofei (daune brute)", "Catastrophe size (gross loss)"),
      0,
      2000,
      50,
      milS,
      "Eveniment catastrofal",
    ) +
      sl(
        "ret",
        tl("Retenția la reasigurare", "Reinsurance retention"),
        50,
        600,
        25,
        milS,
        "Retenție la reasigurare",
      ) +
      `<p class="sub">${tl("Contractul de reasigurare acoperă până la 1 mld € peste retenție.", "The reinsurance treaty covers up to €1bn above the retention.")}</p>` +
      sl(
        "fraud",
        tl("Frauda suplimentară prevenită", "Additional fraud prevented"),
        0,
        60,
        5,
        (v) => nf0.format(v) + "%",
        "Fraudă suspectată",
      ) +
      `<p class="sub">${tl("Procentul din dosarele suspecte care, cu verificări mai bune, nu s-ar mai plăti.", "The share of suspicious claims that, with better checks, would no longer be paid.")}</p>`,
  )}
 <div class="s8" style="display:flex;flex-direction:column;gap:14px"><div class="cards" id="dOut"></div>
 ${win("s12", tl("Cine plătește catastrofa", "Who pays for the catastrophe"), "Reasigurare", tl("Împărțirea daunei între InaVale și reasigurători", "How the loss is split between InaVale and its reinsurers"), cv("c1"))}</div><div class="note" id="dNote"></div>`;
  const fm = { catL: milS, ret: milS, fraud: (v) => nf0.format(v) + "%" };
  const cl = clAgg((r) => yOf(r[0]) === 2025);
  const fraudBase = cl.frate * (p.nep * p.lr) * 0.5;
  const calc = () => {
    const loss = sc.catL * 1000,
      ret = sc.ret * 1000,
      net = catImpact(loss, ret, 1e6),
      rein = loss - net,
      save = (fraudBase * sc.fraud) / 100;
    const cr = p.cr + (net - save) / p.nep;
    return { loss, net, rein, save, cr, ni: F.ni(cr), sol: F.sol(cr) };
  };
  const update = () => {
    syncSl(fm);
    const o = calc();
    upd(
      "dOut",
      card(
        tl("Daună netă pentru InaVale", "Net loss for InaVale"),
        "Retenție la reasigurare",
        eurK(o.net),
        [tl(`reasigurătorii plătesc ${eurK(o.rein)}`, `reinsurers pay ${eurK(o.rein)}`), ""],
      ) +
        card("Combined ratio 2026", "Combined ratio", pct(o.cr), [
          `plan: ${pct(p.cr)}`,
          o.cr <= p.cr ? "good" : "bad",
        ]) +
        card(tl("Profit net 2026", "Net profit 2026"), "Profit net", eurK(o.ni), [
          `plan: ${eurK(F.ni(p.cr))}`,
          o.ni >= F.ni(p.cr) ? "good" : "bad",
        ]) +
        card(tl("Solvabilitate", "Solvency ratio"), "Rata de solvabilitate", pct(o.sol, 0), [
          o.sol >= 1.5
            ? tl("peste pragul de 150%", "above the 150% threshold")
            : o.sol >= 1
              ? tl("sub pragul intern!", "below the internal threshold!")
              : tl("sub minimul legal!", "below the regulatory minimum!"),
          o.sol >= 1.5 ? "good" : "bad",
        ]),
    );
    upd(
      "dNote",
      noteInner(
        tl(
          `O catastrofă cu daune brute de ${eurK(o.loss)} ar costa InaVale, după reasigurare, ${eurK(o.net)}; restul de ${eurK(o.rein)} îl plătesc reasigurătorii. ` +
            `Profitul pe 2026 ar ajunge la ${eurK(o.ni)}, iar solvabilitatea la ${pct(o.sol, 0)}. ` +
            `Atenție: planul de bază include deja o încărcare medie pentru catastrofe de ${eurK(p.catAvg)}, deci evenimentul simulat e în plus față de ea. ` +
            `O retenție mai mică protejează mai bine, dar reasigurarea devine mai scumpă; costul ei nu e modelat aici. ` +
            `Prevenirea a ${nf0.format(sc.fraud)}% din frauda suspectată ar economisi circa ${eurK(o.save)}.`,
          `A catastrophe with a gross loss of ${eurK(o.loss)} would cost InaVale ${eurK(o.net)} after reinsurance; the remaining ${eurK(o.rein)} is paid by reinsurers. 2026 profit would come to ${eurK(o.ni)} and the solvency ratio to ${pct(o.sol, 0)}. ` +
            `Note that the base plan already includes an average catastrophe load of ${eurK(p.catAvg)}, so the simulated event comes on top of it. ` +
            `A lower retention protects better, but reinsurance becomes more expensive; its cost is not modelled here. ` +
            `Preventing ${nf0.format(sc.fraud)}% of suspected fraud would save about ${eurK(o.save)}.`,
        ),
      ),
    );
    updChart(0, (c) => {
      c.data.datasets[0].data = [o.net];
      c.data.datasets[1].data = [o.rein];
    });
  };
  const after = () => {
    const P1 = pal();
    const o = calc();
    mk("c1", {
      type: "bar",
      data: {
        labels: [tl("Catastrofa simulată", "Simulated catastrophe")],
        datasets: [
          { label: tl("InaVale (net)", "InaVale (net)"), data: [o.net], backgroundColor: P1.bad },
          { label: tl("Reasigurători", "Reinsurers"), data: [o.rein], backgroundColor: P1.s[5] },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: { stacked: true, ticks: { callback: tickEur } },
          y: { stacked: true, grid: { display: false } },
        },
        plugins: { tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${eurK(c.raw)}` } } },
      },
    });
    update();
  };
  return {
    t: tl("Ce facem: catastrofe și fraudă", "What we do: catastrophes and fraud"),
    p: tl(
      "Testul de stres pentru o catastrofă și efectul reasigurării și al prevenirii fraudei.",
      "The catastrophe stress test and the effect of reinsurance and fraud prevention.",
    ),
    html,
    after,
    update,
  };
};

SCR.oam4 = () => {
  const sc = S.sc;
  const teams = [];
  NM.R.forEach((r, ri) => D.D.forEach((d, di) => teams.push({ ri, di, n: `${NM.D[d]}, ${r}` })));
  const eurY = (v) => eurS(nf0.format(v));
  const html =
    `${winC(
      tl("Ipotezele", "Assumptions"),
      "Ipoteză",
      tl(
        "Un program de retenție pentru o echipă: cât costă și ce aduce",
        "A retention programme for one team: what it costs and what it delivers",
      ),
      selIn(
        "team",
        tl("Echipa", "Team"),
        teams.map((t) => t.n),
      ) +
        sl(
          "tgt",
          tl("Rata de plecări voluntare țintă", "Target voluntary attrition rate"),
          3,
          30,
          1,
          (v) => nf0.format(v) + "%",
          "Plecări voluntare",
        ) +
        sl(
          "repl",
          tl("Costul de înlocuire (% din salariu)", "Replacement cost (% of salary)"),
          20,
          150,
          5,
          (v) => nf0.format(v) + "%",
          "Cost de înlocuire",
        ) +
        sl(
          "prog",
          tl("Costul programului / angajat / an", "Programme cost / employee / year"),
          0,
          3000,
          100,
          eurY,
          "Ipoteză",
        ),
    )}
 ` +
    `<div class="s8" style="display:flex;flex-direction:column;gap:14px">` +
    `<div class="cards" id="oOut"></div>
 ${win("s12", tl("Costul plecărilor: acum și cu programul", "The cost of attrition: now and with the programme"), "Rentabilitatea investiției", tl("Costul anual al înlocuirii oamenilor care pleacă, plus costul programului", "The annual cost of replacing leavers, plus the cost of the programme"), cv("c1"))}` +
    `</div><div class="note" id="oNote"></div>`;
  const fm = { tgt: (v) => nf0.format(v) + "%", repl: (v) => nf0.format(v) + "%", prog: eurY };
  const eu = YEARS.map((z) => ({
    vr: hrAggP(
      (v) => v === z,
      (r) => r[1] === 0 && D.D[r[2]] === "Claims",
      false,
    ).vr,
    d: clAgg((r) => yOf(r[0]) === z && r[1] === 0).days,
  }));
  const xb = sum(eu.map((o) => o.vr)) / 5,
    yb = sum(eu.map((o) => o.d)) / 5;
  const slope = sum(eu.map((o) => (o.vr - xb) * (o.d - yb))) / sum(eu.map((o) => (o.vr - xb) ** 2));
  const calc = () => {
    const t = teams[+sc.team] || teams[1];
    const h = hrAggP(
      (z) => z === 2025,
      (r) => r[1] === t.ri && r[2] === t.di,
      false,
    );
    const hc = sum(
      D.hr.filter((r) => r[0] === 2025 && r[1] === t.ri && r[2] === t.di).map((r) => r[4]),
    );
    let n = 0,
      s = 0;
    D.pay.forEach((r) => {
      if (r[0] === t.ri && r[1] === t.di) {
        n += r[4];
        s += r[5];
      }
    });
    const sal = n ? s / n : 0;
    const cur = h.vr || 0,
      tgt = Math.min(cur, sc.tgt / 100);
    const lvC = hc * cur,
      lvT = hc * tgt,
      costC = (lvC * sal * sc.repl) / 100,
      costT = (lvT * sal * sc.repl) / 100,
      prog = hc * sc.prog,
      net = costC - costT - prog;
    const isCl = D.D[t.di] === "Claims" && t.ri === 0;
    const dDays = isCl ? slope * (tgt - cur) : null;
    return {
      t,
      hc,
      sal,
      cur,
      tgt,
      lvC,
      lvT,
      costC,
      costT,
      prog,
      net,
      roi: prog ? net / prog : null,
      dDays,
    };
  };
  const update = () => {
    syncSl(fm);
    const o = calc();
    upd(
      "oOut",
      card(tl("Plecări pe an", "Leavers per year"), "Plecări voluntare", nf0.format(o.lvT), [
        tl(
          `acum: ${nf0.format(o.lvC)} (${pct(o.cur)})`,
          `now: ${nf0.format(o.lvC)} (${pct(o.cur)})`,
        ),
        o.lvT <= o.lvC ? "good" : "bad",
      ]) +
        card(
          tl("Economie din înlocuiri", "Replacement savings"),
          "Cost de înlocuire",
          eurK((o.costC - o.costT) / 1000),
          [tl("pe an", "per year"), ""],
        ) +
        card(tl("Costul programului", "Programme cost"), "Ipoteză", eurK(o.prog / 1000), [
          tl(`${nf0.format(o.hc)} angajați`, `${nf0.format(o.hc)} employees`),
          "",
        ]) +
        card(tl("Câștig net", "Net gain"), "Rentabilitatea investiției", eurK(o.net / 1000), [
          o.roi == null ? "" : `ROI ${pct(o.roi, 0)}`,
          o.net >= 0 ? "good" : "bad",
        ]),
    );
    upd(
      "oNote",
      noteInner(
        tl(
          `Echipa „${o.t.n}” are ${nf0.format(o.hc)} de angajați și o rată a plecărilor voluntare de ${pct(o.cur)} în 2025, cu un salariu mediu de ${nf0.format(o.sal)} € pe an. Dacă un program de retenție ar coborî rata la ${pct(o.tgt)}, compania ar economisi ${eurK((o.costC - o.costT) / 1000)} pe an din costul înlocuirilor, la un cost al programului de ${eurK(o.prog / 1000)}: câștig net ${eurK(o.net / 1000)}.${o.dDays != null ? ` Pentru echipa de daune din Europa există și un efect asupra clienților: în istoricul 2021–2025, fiecare punct procentual de plecări în plus a însemnat în medie ${nf1.format(slope / 100)} zile în plus la soluționare, deci ținta aleasă ar scurta dosarele cu circa ${nf1.format(-o.dDays)} zile.` : ""} Rezultatul depinde mult de costul de înlocuire, o ipoteză greu de măsurat: merită testate mai multe valori.`,
          `The “${o.t.n}” team has ${nf0.format(o.hc)} employees and a voluntary attrition rate of ${pct(o.cur)} in 2025, with an average salary of €${nf0.format(o.sal)} a year. If a retention programme brought the rate down to ${pct(o.tgt)}, the company would save ${eurK((o.costC - o.costT) / 1000)} a year in replacement costs, for a programme cost of ${eurK(o.prog / 1000)}: a net gain of ${eurK(o.net / 1000)}.${o.dDays != null ? ` For the Europe claims team there is also a customer effect: in the 2021–2025 history, every extra percentage point of attrition meant ${nf1.format(slope / 100)} more days to settle a claim on average, so the chosen target would shorten claims by about ${nf1.format(-o.dDays)} days.` : ""} The result depends heavily on the replacement cost, an assumption that is hard to measure: it is worth testing several values.`,
        ),
      ),
    );
    updChart(0, (c) => {
      c.data.datasets[0].data = [o.costC / 1000, o.costT / 1000];
      c.data.datasets[1].data = [0, o.prog / 1000];
    });
  };
  const after = () => {
    const P1 = pal();
    const o = calc();
    mk("c1", {
      type: "bar",
      data: {
        labels: tl(["Fără program", "Cu program"], ["Without programme", "With programme"]),
        datasets: [
          {
            label: tl("Costul înlocuirilor", "Replacement cost"),
            data: [o.costC / 1000, o.costT / 1000],
            backgroundColor: P1.s[4],
          },
          {
            label: tl("Costul programului", "Programme cost"),
            data: [0, o.prog / 1000],
            backgroundColor: P1.s[5],
          },
        ],
      },
      options: {
        indexAxis: "y",
        scales: {
          x: { stacked: true, ticks: { callback: tickEur } },
          y: { stacked: true, grid: { display: false } },
        },
        plugins: { tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${eurK(c.raw)}` } } },
      },
    });
    update();
  };
  return {
    t: tl("Ce facem: retenția oamenilor", "What we do: employee retention"),
    p: tl(
      "Merită investit într-un program de retenție? Calculul costurilor și al beneficiilor.",
      "Is a retention programme worth the investment? The costs and benefits worked out.",
    ),
    html,
    after,
    update,
  };
};

SCR.fin4 = () => {
  const sc = S.sc;
  const p = groupPlan(),
    F = finPlan(p);
  const I = D.inv;
  const mv = (a) => {
    let v = 0;
    I.quarter.forEach((q, i) => {
      if (q === "2025-Q4" && I.asset_class[i] === a) v = I.market_value_eur[i];
    });
    return v / 1000;
  };
  const bonds = mv("Government bonds") + mv("Corporate bonds"),
    eqs = mv("Equities");
  const yrs = (v) => nf0.format(v) + tl(" ani", v === 1 ? " year" : " years");
  const html =
    `${winC(
      tl("Ipotezele", "Assumptions"),
      "Test de stres",
      tl(
        "Șocuri aplicate portofoliului și rezultatului la finalul lui 2026",
        "Shocks applied to the portfolio and the result at the end of 2026",
      ),
      sl(
        "eqd",
        tl("Scăderea bursei", "Equity market fall"),
        0,
        50,
        5,
        (v) => "−" + nf0.format(v) + "%",
        "Clasă de active",
      ) +
        sl(
          "rate",
          tl("Modificarea dobânzilor", "Interest rate change"),
          -200,
          300,
          25,
          bpS,
          "Randament",
        ) +
        sl(
          "dur",
          tl("Durata obligațiunilor (ani)", "Bond duration (years)"),
          2,
          12,
          1,
          yrs,
          "Durată",
        ) +
        sl(
          "catF",
          tl("Catastrofă netă suplimentară", "Additional net catastrophe"),
          0,
          1000,
          50,
          milS,
          "Eveniment catastrofal",
        ),
    )}
 ` +
    `<div class="s8" style="display:flex;flex-direction:column;gap:14px">` +
    `<div class="cards" id="fOut"></div>
 ${win("s12", tl("Ce consumă capitalul", "What eats into capital"), "Test de stres", tl("Pierderea din fiecare șoc, după impozit", "The loss from each shock, after tax"), cv("c1"))}` +
    `</div><div class="note" id="fNote"></div>`;
  const fm = { eqd: (v) => "−" + nf0.format(v) + "%", rate: bpS, dur: yrs, catF: milS };
  const calc = () => {
    const eqL = (eqs * sc.eqd) / 100,
      bdL = (bonds * sc.dur * sc.rate) / 10000,
      cat = sc.catF * 1000;
    const tot = (eqL + bdL + cat) * 0.75;
    const eq0 = F.eq(p.cr);
    const sol0 = F.sol(p.cr);
    const sol = (sol0 * (eq0 - tot)) / eq0;
    return { eqL: eqL * 0.75, bdL: bdL * 0.75, cat: cat * 0.75, tot, sol0, sol };
  };
  const update = () => {
    syncSl(fm);
    const o = calc();
    upd(
      "fOut",
      card(
        tl("Solvabilitate înainte de șoc", "Solvency ratio before the shock"),
        "Rata de solvabilitate",
        pct(o.sol0, 0),
        [tl("planul 2026", "2026 plan"), ""],
      ) +
        card(
          tl("Pierdere totală de capital", "Total capital loss"),
          "Capitaluri proprii",
          eurK(o.tot),
          [tl("după impozit", "after tax"), ""],
        ) +
        card(
          tl("Solvabilitate după șoc", "Solvency ratio after the shock"),
          "Rata de solvabilitate",
          pct(o.sol, 0),
          [
            o.sol >= 1.5
              ? tl("peste pragul intern de 150%", "above the 150% internal threshold")
              : o.sol >= 1
                ? tl("sub pragul intern de 150%", "below the 150% internal threshold")
                : tl("sub minimul legal de 100%", "below the 100% regulatory minimum"),
            o.sol >= 1.5 ? "good" : "bad",
          ],
        ),
    );
    const big = [
      [tl("scăderea bursei", "the equity market fall"), o.eqL],
      [tl("creșterea dobânzilor", "the rise in interest rates"), o.bdL],
      [tl("catastrofa", "the catastrophe"), o.cat],
    ].sort((a, b) => b[1] - a[1])[0][0];
    upd(
      "fNote",
      noteInner(
        tl(
          `Combinația de șocuri aleasă ar consuma ${eurK(o.tot)} din capital și ar coborî solvabilitatea de la ${pct(o.sol0, 0)} la ${pct(o.sol, 0)}. ` +
            `Cel mai mare efect îl are ${big}. Portofoliul are ${eurK(bonds)} în obligațiuni, iar la o durată de ${sc.dur} ani fiecare punct procentual de dobândă în plus le scade valoarea cu circa ${sc.dur}%. ` +
            `Aceeași creștere de dobânzi ar mări însă veniturile viitoare din investiții, efect care nu apare într-un test instantaneu. ` +
            `Simplificare: cerința de capital (SCR) e ținută constantă.`,
          `The chosen combination of shocks would use up ${eurK(o.tot)} of capital and take the solvency ratio from ${pct(o.sol0, 0)} to ${pct(o.sol, 0)}. ` +
            `The largest effect comes from ${big}. The portfolio holds ${eurK(bonds)} in bonds, and at a duration of ${sc.dur} years every extra percentage point of interest rates cuts their value by about ${sc.dur}%. ` +
            `The same rise in rates would, however, lift future investment income, an effect that does not show up in an instantaneous test. ` +
            `Simplification: the solvency capital requirement (SCR) is held constant.`,
        ),
      ),
    );
    updChart(0, (c) => {
      c.data.datasets[0].data = [o.eqL, Math.max(0, o.bdL), o.cat];
    });
  };
  const after = () => {
    const P1 = pal();
    const o = calc();
    mk("c1", {
      type: "bar",
      data: {
        labels: tl(
          ["Scăderea bursei", "Dobânzile", "Catastrofa"],
          ["Equity fall", "Interest rates", "Catastrophe"],
        ),
        datasets: [
          {
            data: [o.eqL, Math.max(0, o.bdL), o.cat],
            backgroundColor: [P1.s[3], P1.s[0], P1.bad],
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => eurK(c.raw) } },
        },
        scales: { x: { ticks: { callback: tickEur } }, y: { grid: { display: false } } },
      },
    });
    update();
  };
  return {
    t: tl("Ce facem: teste de stres", "What we do: stress tests"),
    p: tl(
      "Rămâne compania solvabilă dacă vin mai multe șocuri deodată?",
      "Does the company stay solvent if several shocks hit at once?",
    ),
    html,
    after,
    update,
  };
};

SCR.sin4 = () => {
  const sc = S.sc;
  const p = groupPlan(),
    F = finPlan(p);
  const html =
    `${winC(
      tl("Pârghiile planului 2026", "The levers of the 2026 plan"),
      "Scenariu",
      tl(
        "Combină deciziile și riscurile; graficul arată efectul fiecăreia asupra profitului",
        "Combine decisions and risks; the chart shows the effect of each on profit",
      ),
      sl(
        "scPrice",
        tl("Scumpire auto în America Latină", "Motor price increase in Latin America"),
        0,
        20,
        1,
        pctS,
        "Elasticitatea cererii",
      ) +
        sl(
          "scAsia",
          tl("Creștere suplimentară în Asia-Pacific", "Additional growth in Asia-Pacific"),
          -5,
          10,
          1,
          pctS,
          "Prime brute subscrise",
        ) +
        sl(
          "scAtt",
          tl("Reducerea plecărilor la daune în Europa", "Lower attrition in Europe claims"),
          0,
          60,
          5,
          (v) => nf0.format(v) + "%",
          "Plecări voluntare",
        ) +
        sl(
          "scYield",
          tl("Randament suplimentar la investiții", "Additional investment yield"),
          -100,
          100,
          25,
          bpS,
          "Randament",
        ) +
        sl(
          "scCat",
          tl("Catastrofă netă suplimentară", "Additional net catastrophe"),
          0,
          1000,
          50,
          milS,
          "Eveniment catastrofal",
        ),
    )}
 ` +
    `<div class="s8" style="display:flex;flex-direction:column;gap:14px">` +
    `<div class="cards" id="sOut"></div>
 ${win("s12", tl("De la plan la scenariu", "From plan to scenario"), "Scenariu", tl("Graficul în cascadă: fiecare bară arată cât adaugă sau scade o pârghie din profitul net planificat", "The waterfall chart: each bar shows how much a lever adds to or takes away from planned net profit"), cv("c1", true))}` +
    `</div><div class="note" id="sNote"></div>`;
  const fm = {
    scPrice: pctS,
    scAsia: pctS,
    scAtt: (v) => nf0.format(v) + "%",
    scYield: bpS,
    scCat: milS,
  };
  const aum =
    sum(
      Object.keys(NM.asset).map((a) => {
        let v = 0;
        D.inv.quarter.forEach((q, i) => {
          if (q === "2025-Q4" && D.inv.asset_class[i] === a) v = D.inv.market_value_eur[i];
        });
        return v;
      }),
    ) / 1000;
  const asia = plan((r) => r[1] === 2);
  const calc = () => {
    const base = F.ni(p.cr),
      t = 0.75;
    const pz = pricing(3, 0, sc.scPrice, 0.6);
    const dPrice = (pz.sc.res - pz.base.res) * t;
    const dAsia = ((asia.nep * sc.scAsia) / 100) * (1 - asia.cr) * t;
    let n = 0,
      s = 0;
    D.pay.forEach((r) => {
      if (r[0] === 0 && D.D[r[1]] === "Claims") {
        n += r[4];
        s += r[5];
      }
    });
    const sal = n ? s / n : 0;
    const h = hrAggP(
      (z) => z === 2025,
      (r) => r[1] === 0 && D.D[r[2]] === "Claims",
      false,
    );
    const dAtt =
      ((((h.vol * sc.scAtt) / 100) * sal * 0.5) / 1000) * t -
      ((sum(
        D.hr.filter((r) => r[0] === 2025 && r[1] === 0 && D.D[r[2]] === "Claims").map((r) => r[4]),
      ) *
        600) /
        1000) *
        t *
        (sc.scAtt > 0 ? 1 : 0);
    const dYield = ((aum * sc.scYield) / 10000) * t,
      dCat = -sc.scCat * 1000 * t;
    const ni = base + dPrice + dAsia + dAtt + dYield + dCat;
    const crS = p.cr - (dPrice + dAsia + dCat) / t / p.nep;
    const sol = (F.sol(p.cr) * (F.eq(p.cr) + (ni - base))) / F.eq(p.cr);
    return {
      base,
      dPrice,
      dAsia,
      dAtt,
      dYield,
      dCat,
      ni,
      crS,
      sol,
      roe: ni / ((F.eq25 + F.eq(p.cr) + (ni - base)) / 2),
    };
  };
  const wf = (o) => {
    const steps = [
      ["Plan", o.base],
      [tl("Preț auto AL", "LatAm motor price"), o.dPrice],
      [tl("Creștere Asia", "Asia growth"), o.dAsia],
      [tl("Retenție daune EU", "EU claims retention"), o.dAtt],
      [tl("Investiții", "Investments"), o.dYield],
      [tl("Catastrofă", "Catastrophe"), o.dCat],
    ];
    let run = 0;
    const base = [],
      h = [],
      cols = [],
      d = [];
    const P1 = pal();
    steps.forEach(([n, v], i) => {
      if (i === 0) {
        base.push(0);
        h.push(v);
        run = v;
        cols.push(P1.s[0]);
        d.push(v);
      } else {
        base.push(Math.min(run, run + v));
        h.push(Math.abs(v));
        run += v;
        cols.push(v >= 0 ? P1.good : P1.bad);
        d.push(v);
      }
    });
    base.push(0);
    h.push(run);
    cols.push(P1.s[1]);
    d.push(run);
    const lows = base.slice(1, -1).concat([run, steps[0][1]]);
    const mn = Math.floor((Math.min(...lows) * 0.9) / 1e5) * 1e5;
    return {
      labels: [...steps.map((s) => s[0]), tl("Scenariu", "Scenario")],
      base,
      h,
      cols,
      d,
      mn,
    };
  };
  const update = () => {
    syncSl(fm);
    const o = calc();
    upd(
      "sOut",
      card(tl("Profit net 2026", "Net profit 2026"), "Profit net", eurKd(o.ni), [
        `plan: ${eurKd(o.base)}`,
        o.ni >= o.base ? "good" : "bad",
      ]) +
        card("Combined ratio", "Combined ratio", pct(o.crS), [
          `plan: ${pct(p.cr)}`,
          o.crS <= p.cr ? "good" : "bad",
        ]) +
        card("ROE", "Rentabilitatea capitalurilor proprii", pct(o.roe), [
          `plan: ${pct(F.roe(p.cr))}`,
          o.roe >= F.roe(p.cr) ? "good" : "bad",
        ]) +
        card(tl("Solvabilitate", "Solvency ratio"), "Rata de solvabilitate", pct(o.sol, 0), [
          o.sol >= 1.5
            ? tl("peste pragul de 150%", "above the 150% threshold")
            : tl("sub pragul intern!", "below the internal threshold!"),
          o.sol >= 1.5 ? "good" : "bad",
        ]),
    );
    const L = [
      [
        tl("scumpirea auto în America Latină", "the motor price increase in Latin America"),
        o.dPrice,
      ],
      [tl("creșterea din Asia-Pacific", "growth in Asia-Pacific"), o.dAsia],
      [tl("retenția echipei de daune", "retention in the claims team"), o.dAtt],
      [tl("randamentul investițiilor", "the investment yield"), o.dYield],
      [tl("catastrofa", "the catastrophe"), o.dCat],
    ]
      .filter((x) => Math.abs(x[1]) > 1)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    upd(
      "sNote",
      noteInner(
        tl(
          `Scenariul ales duce profitul net din 2026 de la ${eurKd(o.base)} (planul) la ${eurKd(o.ni)}, iar ROE-ul la ${pct(o.roe)}.${L.length ? ` Cea mai puternică pârghie este ${L[0][0]}, cu ${L[0][1] >= 0 ? "+" : "−"}${eurK(Math.abs(L[0][1]))} după impozit.` : " Mișcă pârghiile din stânga ca să vezi efectul fiecăreia."} Graficul în cascadă arată de ce contează să separi efectele: un plan bun combină decizii pe care compania le controlează (prețuri, retenție) cu riscuri pe care doar le poate pregăti (catastrofe, piețe). ` +
            `Toate cifrele depind de ipotezele fiecărui simulator, vizibile în ecranele „Ce facem” din celelalte domenii.`,
          `The chosen scenario takes 2026 net profit from ${eurKd(o.base)} (the plan) to ${eurKd(o.ni)}, and ROE to ${pct(o.roe)}.${L.length ? ` The strongest lever is ${L[0][0]}, at ${L[0][1] >= 0 ? "+" : "−"}${eurK(Math.abs(L[0][1]))} after tax.` : " Move the levers on the left to see the effect of each one."} The waterfall chart shows why it pays to separate the effects: a good plan combines decisions the company controls (pricing, retention) with risks it can only prepare for (catastrophes, markets). ` +
            `All figures depend on the assumptions of each simulator, visible on the “What we do” screens of the other domains.`,
        ),
      ),
    );
    updChart(0, (c) => {
      const w = wf(o);
      c.data.datasets[0].data = w.base;
      c.data.datasets[1].data = w.h;
      c.data.datasets[1].backgroundColor = w.cols;
      c._wf = w;
      c.options.scales.y.min = w.mn;
    });
  };
  const after = () => {
    const o = calc(),
      w = wf(o);
    mk("c1", {
      type: "bar",
      data: {
        labels: w.labels,
        datasets: [
          { label: tl("bază", "base"), data: w.base, backgroundColor: "rgba(0,0,0,0)" },
          { label: tl("Efect", "Effect"), data: w.h, backgroundColor: w.cols, borderRadius: 3 },
        ],
      },
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            filter: (it) => it.datasetIndex === 1,
            callbacks: {
              label: (c) => {
                const W = c.chart._wf || w;
                const i = c.dataIndex,
                  v = W.d[i];
                return i === 0 || i === W.labels.length - 1
                  ? eurK(v)
                  : `${v >= 0 ? "+" : "−"}${eurK(Math.abs(v))}`;
              },
            },
          },
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: {
            stacked: true,
            min: w.mn,
            ticks: {
              callback: (v) => tl(nf2.format(v / 1e6) + " mld €", "€" + nf2.format(v / 1e6) + "bn"),
            },
          },
        },
      },
    });
    charts[0]._wf = w;
    update();
  };
  return {
    t: tl("Ce facem: planul 2026", "What we do: the 2026 plan"),
    p: tl(
      "Combină deciziile și riscurile într-un singur scenariu și vezi efectul asupra profitului.",
      "Combine decisions and risks in a single scenario and see the effect on profit.",
    ),
    html,
    after,
    update,
  };
};
