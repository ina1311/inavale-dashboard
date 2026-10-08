/* ---------- Segmente / Segments ---------- */
const SEGN = bi({
  region_ro: "regiuni",
  region_en: "regions",
  line_ro: "linii de business",
  line_en: "lines of business",
  channel_ro: "canale de vânzare",
  channel_en: "distribution channels",
});
const SEGD = {
  region: {
    i: 1,
    get names() {
      return NM.R;
    },
  },
  line: {
    i: 2,
    get names() {
      return NM.L;
    },
  },
  channel: {
    i: 3,
    get names() {
      return NM.C;
    },
  },
};
[
  [
    "Segment",
    "Segment",
    "Analiză de date",
    "O parte a business-ului analizată separat: o regiune, o linie de business sau un canal de vânzare.",
    "–",
  ],
  [
    "Pondere",
    "Weight / share",
    "Analiză de date",
    "Cât reprezintă un segment din total. Aici, ponderea se calculează din primele nete câștigate.",
    "Valoarea segmentului / total",
  ],
  [
    "Analiză de mix",
    "Mix analysis",
    "Analiză de date",
    "Descompune schimbarea unui indicator al grupului în două efecte: segmentele însele s-au îmbunătățit sau înrăutățit (efect de rată) și s-a schimbat ponderea lor (efect de mix).",
    "Δ total = Σ pondere veche × Δ rată + Σ Δ pondere × rată nouă",
  ],
  [
    "Efect de rată",
    "Rate effect",
    "Analiză de date",
    "Partea din schimbarea indicatorului de grup care vine din schimbarea performanței fiecărui segment, la ponderi constante.",
    "Σ pondere veche × (rată nouă − rată veche)",
  ],
  [
    "Efect de mix",
    "Mix effect",
    "Analiză de date",
    "Partea din schimbarea indicatorului de grup care vine doar din schimbarea ponderilor segmentelor, de exemplu mai multe vânzări în segmentele profitabile.",
    "Σ (pondere nouă − pondere veche) × rată nouă",
  ],
  [
    "Matrice creștere–profitabilitate",
    "Growth–profitability matrix",
    "Analiză de date",
    "Grafic în patru cadrane care pune fiecare segment după creștere și profitabilitate, ca să se vadă ce trebuie dezvoltat, protejat, reparat sau regândit.",
    "Pragurile sunt media grupului",
  ],
  [
    "Prima medie",
    "Average premium",
    "Asigurări – business",
    "Cât plătește în medie un client pe an pentru o poliță.",
    "Prime brute anuale / polițe active medii",
  ],
].forEach((g) => {
  D.gl.push(g);
  GL[g[0]] = { t: g[0], en: g[1], dom: g[2], def: g[3], f: g[4] };
});
Object.assign(SUGG, {
  seg1: [
    "Care segment aduce cei mai mulți bani și care pierde?",
    "De ce diferă atât de mult prima medie între segmente?",
    "Ce segment ar trebui să primească mai multă atenție?",
  ],
  seg2: [
    "Ce spune analiza de mix?",
    "În ce cadran e fiecare segment și ce înseamnă?",
    "Creșterea vine din segmentele bune sau din cele slabe?",
  ],
  seg3: [
    "Care segment va crește cel mai repede în 2026?",
    "Se va schimba mixul portofoliului în 2026?",
    "Ce segment are cea mai mare incertitudine?",
  ],
  seg4: [
    "Ce realocare ar îmbunătăți cel mai mult combined ratio?",
    "Cât costă reducerea segmentului slab în prime?",
    "Ce riscuri are o astfel de realocare?",
  ],
});
function segRows(R) {
  const d = SEGD[S.segDim];
  return d.names
    .map((nm, k) => {
      if (!R) return null;
      const o = uwAgg((r) => inR(yOf(r[0]), R) && r[d.i] === k && uwF(r));
      if (!o.gwp) return null;
      const n = R.to - R.from + 1;
      return {
        k,
        nm,
        gwp: o.gwp,
        nep: o.nep,
        ann: o.gwp / n,
        lr: o.lr,
        er: o.er,
        acq: o.acq / o.gwp,
        cr: o.cr,
        res: o.nep - o.clm - o.acq - o.adm,
        lapse: o.lapse,
        prem: (12 * o.gwp) / o.pifSum,
        nw: o.nw,
      };
    })
    .filter(Boolean);
}
const segTot = (R) => {
  const o = uwR(R);
  return {
    gwp: o.gwp,
    nep: o.nep,
    lr: o.lr,
    er: o.er,
    acq: o.acq / o.gwp,
    cr: o.cr,
    res: o.nep - o.clm - o.acq - o.adm,
    lapse: o.lapse,
    prem: (12 * o.gwp) / o.pifSum,
  };
};
const within = () => {
  const p = [];
  ["region", "line", "channel"].forEach((k) => {
    if (on(k) && S[k] >= 0) p.push(SEGD[k].names[S[k]]);
  });
  return p.length ? ` (${tl("în", "in")} ${p.join(", ")})` : "";
};

SCR.seg1 = () => {
  const Pp = P(),
    C = CP();
  const rows = segRows(Pp),
    rc = segRows(C),
    T = segTot(Pp);
  const gC = C ? segTot(C) : null;
  rows.forEach((r) => {
    const c = rc && rc.find((x) => x.k === r.k);
    r.g = c ? r.ann / c.ann - 1 : null;
    r.sh = r.gwp / T.gwp;
  });
  const rk = (key, lowGood) => {
    const s = [...rows].sort((a, b) => (lowGood ? a[key] - b[key] : b[key] - a[key]));
    rows.forEach((r) => (r["rk_" + key] = s.indexOf(r) + 1));
  };
  rk("gwp");
  rk("cr", true);
  rk("res");
  if (C) rk("g");
  const best = [...rows].sort((a, b) => a.cr - b.cr)[0],
    worst = [...rows].sort((a, b) => b.cr - a.cr)[0],
    big = [...rows].sort((a, b) => b.gwp - a.gwp)[0],
    fast = C ? [...rows].sort((a, b) => b.g - a.g)[0] : null;
  const gG1 = C ? T.gwp / Pp.n / (gC.gwp / C.n) - 1 : 0;
  const hdr =
    `<tr><th>Segment</th><th>${tl("Prime brute", "GWP")}</th><th>${tl("Pondere", "Share")} ${q("Pondere")}</th>${C ? `<th>${tl("Creștere", "Growth")} vs ${C.lab}</th>` : ""}` +
    `<th>${tl("Rata daunei", "Loss ratio")}</th><th>${tl("Cost de achiziție", "Acquisition cost")}</th>` +
    `<th>Combined ratio</th><th>${tl("Rezultat tehnic", "Underwriting result")}</th>` +
    `<th>${tl("Pierdere polițe", "Lapse rate")}</th><th>${tl("Prima medie", "Average premium")} ${q("Prima medie")}</th></tr>`;
  const tr = (r) =>
    `<tr><td>${r.nm}</td><td class="num">${eurK(r.gwp)}</td><td class="num">${pct(r.sh)}</td>${C ? `<td class="heat" style="${heat(r.g, gG1 - 0.06, gG1, gG1 + 0.08, false)}">${r.g == null ? "–" : sgnPct(r.g)}</td>` : ""}` +
    `<td class="heat" style="${heat(r.lr, T.lr - 0.1, T.lr, T.lr + 0.15)}">${pct(r.lr)}</td>` +
    `<td class="num">${pct(r.acq)}</td><td class="heat" style="${heat(r.cr, T.cr - 0.1, T.cr, T.cr + 0.12)}"><b>${pct(r.cr)}</b></td>` +
    `<td class="num ${r.res >= 0 ? "good" : "bad"}">${eurK(r.res)}</td>` +
    `<td class="heat" style="${heat(r.lapse, T.lapse - 0.05, T.lapse, T.lapse + 0.08)}">${pct(r.lapse)}</td>` +
    `<td class="num">${eurS(nf0.format(r.prem * 1000))}</td></tr>`;
  const tot =
    `<tr><td><b>Total${within()}</b></td><td class="num"><b>${eurK(T.gwp)}</b></td>` +
    `<td class="num">100%</td>${C ? `<td class="num">${sgnPct(T.gwp / Pp.n / (gC.gwp / C.n) - 1)}</td>` : ""}` +
    `<td class="num">${pct(T.lr)}</td><td class="num">${pct(T.acq)}</td>` +
    `<td class="num"><b>${pct(T.cr)}</b></td><td class="num">${eurK(T.res)}</td>` +
    `<td class="num">${pct(T.lapse)}</td><td class="num">${eurS(nf0.format(T.prem * 1000))}</td></tr>`;
  const html = [
    `<div class="s12 cards">`,
    card(tl("Cel mai mare segment", "Largest segment"), "Pondere", big.nm, [
      tl(`${pct(big.sh)} din prime`, `${pct(big.sh)} of premium`),
      "",
    ]),
    card(tl("Cel mai profitabil", "Most profitable"), "Combined ratio", best.nm, [
      `combined ratio ${pct(best.cr)}`,
      "good",
    ]),
    card(tl("Cel mai slab", "Weakest"), "Combined ratio", worst.nm, [
      `combined ratio ${pct(worst.cr)}`,
      worst.cr > 1 ? "bad" : "",
    ]),
    card(
      tl("Crește cel mai repede", "Fastest growing"),
      "Prime brute subscrise",
      fast ? fast.nm : "–",
      fast
        ? [`${sgnPct(fast.g)} ${cmpTxt(C, Pp.n !== C.n)}`, "good"]
        : [tl("alege o comparație", "choose a comparison"), ""],
    ),
    `</div>`,
    win(
      "s12",
      tl(`Tabel comparativ: ${SEGN[S.segDim]}`, `Comparison table: ${SEGN[S.segDim]}`),
      "Segment",
      tl(
        `${Pp.lab}${within()}. Culoarea arată abaterea față de totalul grupului: verde mai bine, roșu mai rău`,
        `${Pp.lab}${within()}. The colour shows the deviation from the group total: green is better, red is worse`,
      ),
      `<div class="tbl"><table><thead>${hdr}</thead><tbody>${rows.map(tr).join("")}${tot}</tbody></table></div>`,
    ),
    win(
      "s6",
      tl("Mărime vs. profitabilitate", "Size vs profitability"),
      "Combined ratio",
      tl(
        "Fiecare cerc e un segment: spre dreapta = mai mare, mai jos = mai profitabil. Linia punctată e combined ratio al grupului",
        "Each circle is a segment: further right = larger, lower = more profitable. The dashed line is the group combined ratio",
      ),
      cv("c1", true),
    ),
    win(
      "s6",
      tl("Cine aduce banii", "Who brings in the money"),
      "Rezultat tehnic",
      tl(`Rezultatul tehnic pe segment ${pw()}`, `Underwriting result by segment ${pw()}`),
      cv("c2", true),
    ),
    win(
      "s12",
      tl("Structura costurilor pe segment", "Cost structure by segment"),
      "Rata cheltuielilor",
      S.segDim === "channel"
        ? tl(
            "Pentru canale, costul de achiziție face diferența: un canal ieftin de vândut poate avea totuși clienți mai puțin fideli",
            "For channels, the acquisition cost makes the difference: a channel that is cheap to sell through can still have less loyal customers",
          )
        : tl(
            "Rata daunei, costul de achiziție și cheltuielile administrative, ca procent din primele nete câștigate",
            "Loss ratio, acquisition cost and administrative expenses, as a percentage of net earned premium",
          ),
      cv("c3"),
    ),
    note(
      tl(
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${big === best ? `${big.nm} e și cel mai mare segment (${pct(big.sh)} din prime), și cel mai profitabil, cu un combined ratio de ${pct(best.cr)}.` : `cel mai mare segment e ${big.nm} (${pct(big.sh)} din prime), iar cel mai profitabil e ${best.nm}, cu un combined ratio de ${pct(best.cr)}.`} La polul opus, ${worst.nm} are ${pct(worst.cr)}${worst.cr > 1 ? ": pierde bani din asigurare" : ""}. ${S.segDim === "channel" ? `Economia canalelor e un compromis: canalul online are cel mai mic cost de achiziție, dar cea mai mare rată de pierdere a polițelor, deci câștigul pe termen lung depinde de cât de repede pleacă clienții.` : `Tabelul arată de ce mărimea nu înseamnă automat profit: comparați poziția fiecărui segment în graficul „Mărime vs. profitabilitate”.`}`,
        `${pw()[0].toUpperCase() + pw().slice(1)}, ${big === best ? `${big.nm} is both the largest segment (${pct(big.sh)} of premium) and the most profitable, with a combined ratio of ${pct(best.cr)}.` : `the largest segment is ${big.nm} (${pct(big.sh)} of premium), and the most profitable is ${best.nm}, with a combined ratio of ${pct(best.cr)}.`} At the other end, ${worst.nm} runs at ${pct(worst.cr)}${worst.cr > 1 ? ": it loses money on underwriting" : ""}. ${S.segDim === "channel" ? `Channel economics is a trade-off: the online channel has the lowest acquisition cost but the highest lapse rate, so the long-term gain depends on how quickly customers leave.` : `The table shows why size does not automatically mean profit: compare each segment's position in the “Size vs profitability” chart.`}`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    const gAvg = tl("Media grupului", "Group average");
    mk("c1", {
      type: "bubble",
      data: {
        datasets: [
          ...rows.map((r, i) => ({
            label: r.nm,
            data: [{ x: r.gwp, y: r.cr, r: Math.max(6, Math.sqrt(r.sh) * 38) }],
            backgroundColor: P1.s[i % 6] + "99",
            borderColor: P1.s[i % 6],
          })),
          {
            type: "line",
            label: gAvg,
            data: [
              { x: 0, y: T.cr },
              { x: Math.max(...rows.map((r) => r.gwp)) * 1.15, y: T.cr },
            ],
            borderColor: P1.ink3,
            borderDash: [5, 4],
            pointRadius: 0,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) =>
                c.dataset.type === "line"
                  ? `${gAvg}: ${pct(T.cr)}`
                  : `${c.dataset.label}: ${eurK(c.raw.x)}, combined ratio ${pct(c.raw.y)}`,
            },
          },
        },
        scales: {
          x: { type: "linear", min: 0, ticks: { callback: tickEur } },
          y: { ticks: { callback: tickPct } },
        },
      },
    });
    const sr = [...rows].sort((a, b) => b.res - a.res);
    mk("c2", {
      type: "bar",
      data: {
        labels: sr.map((r) => r.nm),
        datasets: [
          {
            data: sr.map((r) => r.res),
            backgroundColor: sr.map((r) => (r.res >= 0 ? P1.good : P1.bad)),
            borderRadius: 3,
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
    mk("c3", {
      type: "bar",
      data: {
        labels: rows.map((r) => r.nm),
        datasets: [
          {
            label: tl("Rata daunei", "Loss ratio"),
            data: rows.map((r) => r.lr),
            backgroundColor: P1.s[0],
          },
          {
            label: tl("Costuri de achiziție", "Acquisition costs"),
            data: rows.map((r) => (r.acq * r.gwp) / r.nep),
            backgroundColor: P1.s[1],
          },
          {
            label: tl("Cheltuieli administrative", "Administrative expenses"),
            data: rows.map((r) => r.er - (r.acq * r.gwp) / r.nep),
            backgroundColor: P1.s[5],
          },
          {
            type: "line",
            label: tl("Pierderea polițelor (axa din dreapta)", "Lapse rate (right axis)"),
            data: rows.map((r) => r.lapse),
            yAxisID: "y1",
            borderColor: P1.panel,
            backgroundColor: P1.s[3],
            pointRadius: 6,
            pointBorderWidth: 2,
            showLine: false,
            order: -1,
          },
        ],
      },
      options: {
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, ticks: { callback: tickPct } },
          y1: { position: "right", grid: { display: false }, min: 0, ticks: { callback: tickPct } },
        },
        plugins: { tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } } },
      },
    });
  };
  return {
    t: tl(`Segmente: ${SEGN[S.segDim]}`, `Segments: ${SEGN[S.segDim]}`),
    p: tl(
      `Toate segmentele alăturat, ${pw()}${C ? `, comparat cu ${C.lab}` : ""}${within()}.`,
      `All segments side by side, ${pw()}${C ? `, compared with ${C.lab}` : ""}${within()}.`,
    ),
    html,
    after,
  };
};

/* the four quadrants of the growth–profitability matrix */
const QN = bi({
  grow_ro: "De dezvoltat",
  grow_en: "Grow",
  fix_ro: "De reparat",
  fix_en: "Fix",
  protect_ro: "De protejat",
  protect_en: "Protect",
  rethink_ro: "De regândit",
  rethink_en: "Rethink",
});
const quadPlugin = (gx, gy) => ({
  id: "quad",
  afterDraw(ch) {
    const {
      ctx,
      chartArea: a,
      scales: { x, y },
    } = ch;
    if (!a) return;
    const px = x.getPixelForValue(gx),
      py = y.getPixelForValue(gy);
    ctx.save();
    ctx.strokeStyle = css("--ink-3");
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(px, a.top);
    ctx.lineTo(px, a.bottom);
    ctx.moveTo(a.left, py);
    ctx.lineTo(a.right, py);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = "12px " + (css("--sans") || "sans-serif");
    ctx.fillStyle = css("--ink-3");
    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillText(QN.grow, a.right - 6, a.top + 6);
    ctx.fillText(QN.fix, a.right - 6, a.bottom - 18);
    ctx.textAlign = "left";
    ctx.fillText(QN.protect, a.left + 6, a.top + 6);
    ctx.fillText(QN.rethink, a.left + 6, a.bottom - 18);
    ctx.restore();
  },
});
SCR.seg2 = () => {
  const Pp = P(),
    C = CP();
  const rows = segRows(Pp),
    T = segTot(Pp);
  if (!C)
    return {
      t: tl(`De ce: ${SEGN[S.segDim]}`, `Why: ${SEGN[S.segDim]}`),
      p: tl(
        "Analiza de mix și cadranele au nevoie de o perioadă de comparație.",
        "The mix analysis and the quadrants need a comparison period.",
      ),
      html:
        `<div class="soon">${tl("Alege în filtrul „Compară cu” o perioadă sau un an. Analiza de mix compară două momente: ce s-a schimbat în segmente și ce s-a schimbat în ponderea lor.", "Choose a period or a year in the “Compare with” filter. The mix analysis compares two points in time: what changed within the segments and what changed in their weights.")}` +
        `</div>`,
    };
  const rc = segRows(C),
    Tc = segTot(C);
  const M = rows.map((r) => {
    const c = rc.find((x) => x.k === r.k) || { nep: 0, cr: r.cr, ann: r.ann };
    const wp = r.nep / T.nep,
      wc = c.nep / Tc.nep;
    return {
      nm: r.nm,
      wp,
      wc,
      crp: r.cr,
      crc: c.cr,
      rate: wc * (r.cr - c.cr),
      mix: (wp - wc) * r.cr,
      g: r.ann / c.ann - 1,
    };
  });
  const rateT = sum(M.map((m) => m.rate)),
    mixT = sum(M.map((m) => m.mix)),
    gG = T.gwp / Pp.n / (Tc.gwp / C.n) - 1;
  const quad = (m) =>
    m.g >= gG ? (m.crp <= T.cr ? "grow" : "fix") : m.crp <= T.cr ? "protect" : "rethink";
  const qTxt = {
    grow: tl(
      "crește peste medie și e profitabil: merită investit",
      "growing above average and profitable: worth investing in",
    ),
    fix: tl(
      "crește, dar pierde mai mult decât media: prețul sau selecția riscurilor trebuie revăzute",
      "growing, but loses more than average: pricing or risk selection needs reviewing",
    ),
    protect: tl(
      "profitabil, dar crește încet: trebuie păstrat, fără riscuri inutile",
      "profitable but growing slowly: to be kept, without taking unnecessary risks",
    ),
    rethink: tl(
      "crește încet și e sub medie: strategia lui trebuie regândită",
      "growing slowly and below average: its strategy needs rethinking",
    ),
  };
  const wT = tl("Pondere", "Weight");
  const mT =
    `<div class="tbl"><table><thead><tr><th>Segment</th><th>${wT} ${C.lab}</th>` +
    `<th>${wT} ${Pp.lab}</th><th>Combined ratio ${C.lab}</th><th>Combined ratio ${Pp.lab}</th>` +
    `<th>${tl("Efect de rată", "Rate effect")} ${q("Efect de rată")}</th>` +
    `<th>${tl("Efect de mix", "Mix effect")} ${q("Efect de mix")}</th></tr>` +
    `</thead><tbody>${M.map(
      (m) =>
        `<tr><td>${m.nm}</td><td class="num">${pct(m.wc)}</td><td class="num">${pct(m.wp)}</td>` +
        `<td class="num">${pct(m.crc)}</td><td class="num">${pct(m.crp)}</td>` +
        `<td class="num ${m.rate <= 0 ? "good" : "bad"}">${pp(m.rate)}</td>` +
        `<td class="num ${m.mix <= 0 ? "good" : "bad"}">${pp(m.mix)}</td></tr>`,
    ).join("")}` +
    `<tr><td><b>Total</b></td><td></td><td></td><td class="num"><b>${pct(Tc.cr)}</b></td>` +
    `<td class="num"><b>${pct(T.cr)}</b></td><td class="num"><b>${pp(rateT)}</b></td>` +
    `<td class="num"><b>${pp(mixT)}</b></td></tr></tbody></table>` +
    `</div>`;
  const qL = `<div class="tbl"><table><thead><tr><th>Segment</th><th>${tl("Cadran", "Quadrant")}</th><th>${tl("Ce înseamnă", "What it means")}</th></tr></thead><tbody>${M.map((m) => `<tr><td>${m.nm}</td><td><b>${QN[quad(m)]}</b></td><td style="white-space:normal;text-align:left;color:var(--ink-2)">${qTxt[quad(m)]}</td></tr>`).join("")}</tbody></table></div>`;
  const bigRate = [...M].sort((a, b) => Math.abs(b.rate) - Math.abs(a.rate))[0];
  const html = [
    `<div class="s12 cards">`,
    card(`Combined ratio ${C.lab}`, "Combined ratio", pct(Tc.cr), [
      tl("punctul de plecare", "the starting point"),
      "",
    ]),
    card(tl("Efect de rată", "Rate effect"), "Efect de rată", pp(rateT), [
      tl(
        "segmentele s-au " + (rateT <= 0 ? "îmbunătățit" : "înrăutățit"),
        "the segments " + (rateT <= 0 ? "improved" : "deteriorated"),
      ),
      rateT <= 0 ? "good" : "bad",
    ]),
    card(tl("Efect de mix", "Mix effect"), "Efect de mix", pp(mixT), [
      Math.abs(mixT) < 0.0015
        ? tl("practic neutru", "practically neutral")
        : mixT < 0
          ? tl("mixul a ajutat", "the mix helped")
          : tl("mixul a încurcat", "the mix hurt"),
      Math.abs(mixT) < 0.0015 ? "" : mixT < 0 ? "good" : "bad",
    ]),
    card(`Combined ratio ${Pp.lab}`, "Combined ratio", pct(T.cr), [
      `${pp(T.cr - Tc.cr)} ${tl("în total", "in total")}`,
      T.cr <= Tc.cr ? "good" : "bad",
    ]),
    `</div>`,
    win(
      "s7",
      tl("Creștere vs. profitabilitate", "Growth vs profitability"),
      "Matrice creștere–profitabilitate",
      tl(
        `Creșterea primelor anuale ${Pp.lab} față de ${C.lab} și combined ratio ${Pp.lab}. Liniile punctate sunt media grupului`,
        `Growth in annual premium ${Pp.lab} vs ${C.lab}, and combined ratio ${Pp.lab}. The dashed lines are the group average`,
      ),
      cv("c1", true),
    ),
    win(
      "s5",
      tl("Ce înseamnă fiecare cadran", "What each quadrant means"),
      "Matrice creștere–profitabilitate",
      "",
      qL,
    ),
    win(
      "s12",
      tl("Analiza de mix", "Mix analysis"),
      "Analiză de mix",
      tl(
        `Cum s-a ajuns de la ${pct(Tc.cr)} la ${pct(T.cr)}: cât vine din performanța segmentelor și cât din schimbarea ponderilor lor`,
        `How we got from ${pct(Tc.cr)} to ${pct(T.cr)}: how much comes from segment performance and how much from the change in their weights`,
      ),
      mT,
    ),
    note(
      tl(
        `Combined ratio al grupului${within()} s-a schimbat cu ${pp(T.cr - Tc.cr)} între ${C.lab} și ${Pp.lab}. ` +
          `Din asta, ${pp(rateT)} vin din efectul de rată (segmentele însele s-au ${rateT <= 0 ? "îmbunătățit" : "înrăutățit"}; cel mai mare aport îl are ${bigRate.nm}) și ${pp(mixT)} din efectul de mix (${Math.abs(mixT) < 0.0015 ? "ponderile segmentelor aproape nu s-au schimbat, deci mixul n-a contat" : mixT < 0 ? "portofoliul s-a mutat spre segmente mai profitabile" : "portofoliul s-a mutat spre segmente mai puțin profitabile"}). ` +
          `Distincția contează pentru decizii: un efect de rată se repară cu prețuri și subscriere, un efect de mix se gestionează prin strategia de vânzări.`,
        `The group combined ratio${within()} changed by ${pp(T.cr - Tc.cr)} between ${C.lab} and ${Pp.lab}. ` +
          `Of this, ${pp(rateT)} comes from the rate effect (the segments themselves ${rateT <= 0 ? "improved" : "deteriorated"}; ${bigRate.nm} contributes the most) and ${pp(mixT)} from the mix effect (${Math.abs(mixT) < 0.0015 ? "segment weights barely changed, so the mix did not matter" : mixT < 0 ? "the portfolio shifted towards more profitable segments" : "the portfolio shifted towards less profitable segments"}). ` +
          `The distinction matters for decisions: a rate effect is fixed through pricing and underwriting, a mix effect is managed through sales strategy.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bubble",
      data: {
        datasets: M.map((m, i) => ({
          label: m.nm,
          data: [{ x: m.g, y: m.crp, r: Math.max(6, Math.sqrt(m.wp) * 38) }],
          backgroundColor: P1.s[i % 6] + "99",
          borderColor: P1.s[i % 6],
        })),
      },
      plugins: [quadPlugin(gG, T.cr)],
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) =>
                `${c.dataset.label}: ${tl("creștere", "growth")} ${sgnPct(c.raw.x)}, combined ratio ${pct(c.raw.y)}`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: tl("Creșterea primelor (medie anuală)", "Premium growth (annual average)"),
              color: P1.ink3,
            },
            ticks: { callback: tickPct },
          },
          y: {
            reverse: true,
            title: {
              display: true,
              text: tl("Combined ratio (mai sus = mai bine)", "Combined ratio (higher = better)"),
              color: P1.ink3,
            },
            ticks: { callback: tickPct },
          },
        },
      },
    });
  };
  return {
    t: tl(`De ce: ${SEGN[S.segDim]}`, `Why: ${SEGN[S.segDim]}`),
    p: tl(
      `Ce segmente trag grupul în sus sau în jos și de ce, ${Pp.lab} față de ${C.lab}${within()}.`,
      `Which segments pull the group up or down, and why, ${Pp.lab} vs ${C.lab}${within()}.`,
    ),
    html,
    after,
  };
};

SCR.seg3 = () => {
  const d = SEGD[S.segDim];
  const rows = d.names
    .map((nm, k) => {
      const pr = (r) => r[d.i] === k && uwF(r);
      const x = plan(pr);
      if (!x.yr[4].gwp) return null;
      return {
        nm,
        a: x.yr[4].gwp,
        p: x.g.y.p,
        lo: x.g.y.lo,
        hi: x.g.y.hi,
        cr: x.cr,
        cr25: x.yr[4].cr,
      };
    })
    .filter(Boolean);
  const t25 = sum(rows.map((r) => r.a)),
    t26 = sum(rows.map((r) => r.p));
  const fast = [...rows].sort((a, b) => b.p / b.a - a.p / a.a)[0];
  const wide = [...rows].sort((a, b) => (b.hi - b.lo) / b.p - (a.hi - a.lo) / a.p)[0];
  const wT = tl("Pondere", "Weight"),
    pT = tl("Prime", "GWP");
  const html = [
    win(
      "s12",
      tl(`Prognoza 2026 pe ${SEGN[S.segDim]}`, `2026 forecast: ${SEGN[S.segDim]}`),
      "Prognoză",
      tl(
        `Primele și combined ratio prevăzute${within()}; ponderile arată cum s-ar schimba mixul portofoliului`,
        `Forecast premium and combined ratio${within()}; the weights show how the portfolio mix would change`,
      ),
      `<div class="tbl"><table><thead><tr><th>Segment</th><th>${pT} 2025</th><th>${tl("Prime 2026 probabil", "GWP 2026 most likely")}</th><th>${tl("Interval 80%", "80% interval")}</th><th>${tl("Creștere", "Growth")}</th><th>${wT} 2025</th><th>${wT} 2026</th><th>Combined ratio 2025</th><th>Combined ratio 2026 (plan)</th></tr></thead><tbody>${rows
        .map(
          (r) =>
            `<tr><td>${r.nm}</td><td class="num">${eurK(r.a)}</td><td class="num"><b>${eurK(r.p)}</b></td>` +
            `<td class="num">${eurK(r.lo)} – ${eurK(r.hi)}</td><td class="num ${r.p >= r.a ? "good" : "bad"}">${sgnPct(r.p / r.a - 1)}</td>` +
            `<td class="num">${pct(r.a / t25)}</td><td class="num">${pct(r.p / t26)}</td>` +
            `<td class="num">${pct(r.cr25)}</td><td class="heat" style="${heat(r.cr, 0.85, 0.95, 1.1)}"><b>${pct(r.cr)}</b></td></tr>`,
        )
        .join("")}</tbody></table></div>`,
    ),
    win(
      "s12",
      tl("Creșterea prevăzută pe segmente", "Forecast growth by segment"),
      "Interval de prognoză",
      tl(
        "Bara arată intervalul de 80% al creșterii, punctul valoarea cea mai probabilă",
        "The bar shows the 80% interval for growth, the dot the most likely value",
      ),
      cv("c1"),
    ),
    note(
      tl(
        `Pentru 2026, segmentul cu cea mai rapidă creștere prevăzută e ${fast.nm} (${sgnPct(fast.p / fast.a - 1)})${wide === fast ? ", care are și cea mai mare incertitudine: creșterile rapide sunt mai greu de prognozat" : `, iar cea mai mare incertitudine o are ${wide.nm}`}. ` +
          `Dacă tendințele continuă, mixul portofoliului se mută treptat spre segmentele care cresc repede; merită verificat, în tabel, dacă acestea sunt și profitabile, pentru că altfel efectul de mix va lucra împotriva grupului.`,
        `For 2026, the segment with the fastest forecast growth is ${fast.nm} (${sgnPct(fast.p / fast.a - 1)})${wide === fast ? ", which also carries the most uncertainty: fast growth is harder to forecast" : `, while ${wide.nm} carries the most uncertainty`}. ` +
          `If the trends continue, the portfolio mix gradually shifts towards the fast-growing segments; it is worth checking in the table whether they are also profitable, because otherwise the mix effect will work against the group.`,
      ),
    ),
  ].join("");
  const after = () => {
    const P1 = pal();
    mk("c1", {
      type: "bar",
      data: {
        labels: rows.map((r) => r.nm),
        datasets: [
          {
            type: "line",
            label: tl("Valoare probabilă", "Most likely value"),
            data: rows.map((r) => r.p / r.a - 1),
            borderColor: P1.ink,
            backgroundColor: P1.ink,
            pointRadius: 5,
            showLine: false,
          },
          {
            label: tl("Interval 80%", "80% interval"),
            data: rows.map((r) => [r.lo / r.a - 1, r.hi / r.a - 1]),
            backgroundColor: P1.s[0] + "55",
            borderColor: P1.s[0],
            borderWidth: 1,
            borderRadius: 3,
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: (c) =>
                Array.isArray(c.raw)
                  ? `${tl("Interval", "Interval")}: ${sgnPct(c.raw[0])} – ${sgnPct(c.raw[1])}`
                  : `${tl("Probabil", "Most likely")}: ${sgnPct(c.raw)}`,
            },
          },
        },
        scales: { y: { ticks: { callback: tickPct } }, x: { grid: { display: false } } },
      },
    });
  };
  return {
    t: tl(`Ce urmează: ${SEGN[S.segDim]}`, `What's next: ${SEGN[S.segDim]}`),
    p: tl(
      "Cum ar arăta segmentele și mixul portofoliului în 2026.",
      "How the segments and the portfolio mix would look in 2026.",
    ),
    html,
    after,
  };
};

SCR.seg4 = () => {
  const sc = S.sc;
  const d = SEGD[S.segDim];
  const B = d.names
    .map((nm, k) => {
      const x = plan((r) => r[d.i] === k);
      return { k, nm, nep: x.nep, cr: x.cr, gwp: x.g.y.p };
    })
    .filter((o) => o.nep > 0);
  const sorted = [...B].sort((a, b) => a.cr - b.cr);
  if (sc.segDim !== S.segDim) {
    sc.segDim = S.segDim;
    sc.segUp = B.indexOf(sorted[0]);
    sc.segDn = B.indexOf(sorted[sorted.length - 1]);
    sc.up = 10;
    sc.dn = 20;
  }
  const html = `${winC(
    tl("Realocarea portofoliului", "Portfolio reallocation"),
    "Efect de mix",
    tl(
      "Crește un segment și redu altul; vezi efectul asupra grupului în 2026",
      "Grow one segment and shrink another; see the effect on the group in 2026",
    ),
    selIn(
      "segUp",
      tl("Segmentul pe care îl creștem", "Segment to grow"),
      B.map((b) => `${b.nm} (CR ${pct(b.cr)})`),
    ) +
      sl(
        "up",
        tl("Creștere suplimentară", "Additional growth"),
        0,
        40,
        1,
        pctS,
        "Prime brute subscrise",
      ) +
      selIn(
        "segDn",
        tl("Segmentul pe care îl reducem", "Segment to shrink"),
        B.map((b) => `${b.nm} (CR ${pct(b.cr)})`),
      ) +
      sl("dn", tl("Reducere", "Reduction"), 0, 50, 1, (v) => "−" + nf0.format(v) + "%", "Ipoteză") +
      `<p class="sub">${tl("Simplificare: combined ratio al fiecărui segment rămâne cel din planul 2026; în realitate, creșterea rapidă aduce adesea riscuri mai slabe.", "Simplification: each segment keeps its 2026 plan combined ratio; in reality, fast growth often brings in weaker risks.")}</p>`,
  )}
 <div class="s8" style="display:flex;flex-direction:column;gap:14px"><div class="cards" id="gOut"></div>
 ${win("s12", tl("Mixul portofoliului: plan vs. scenariu", "Portfolio mix: plan vs scenario"), "Pondere", tl("Ponderea fiecărui segment în primele nete câștigate", "Each segment's share of net earned premium"), cv("c1", true))}</div><div class="note" id="gNote"></div>`;
  const fm = { up: pctS, dn: (v) => "−" + nf0.format(v) + "%" };
  const calc = () => {
    const u = +sc.segUp,
      dn = +sc.segDn;
    const S2 = B.map((b, i) => ({
      ...b,
      nep2: b.nep * (1 + (i === u ? sc.up / 100 : 0) - (i === dn ? sc.dn / 100 : 0)),
    }));
    const n1 = sum(B.map((b) => b.nep)),
      n2 = sum(S2.map((b) => b.nep2));
    const cr1 = sum(B.map((b) => b.nep * b.cr)) / n1,
      cr2 = sum(S2.map((b) => b.nep2 * b.cr)) / n2;
    const r1 = sum(B.map((b) => b.nep * (1 - b.cr))),
      r2 = sum(S2.map((b) => b.nep2 * (1 - b.cr)));
    return { S2, n1, n2, cr1, cr2, r1, r2, u, dn };
  };
  const update = () => {
    syncSl(fm);
    const o = calc();
    const same = o.u === o.dn;
    const vp = tl("față de plan", "vs plan");
    upd(
      "gOut",
      card(
        tl("Combined ratio grup 2026", "Group combined ratio 2026"),
        "Combined ratio",
        pct(o.cr2),
        [`plan: ${pct(o.cr1)}`, o.cr2 <= o.cr1 ? "good" : "bad"],
      ) +
        card(tl("Rezultat tehnic", "Underwriting result"), "Rezultat tehnic", eurK(o.r2), [
          `${o.r2 >= o.r1 ? "+" : "−"}${eurK(Math.abs(o.r2 - o.r1))} ${vp}`,
          o.r2 >= o.r1 ? "good" : "bad",
        ]) +
        card(tl("Prime nete câștigate", "Net earned premium"), "Prime nete câștigate", eurK(o.n2), [
          `${sgnPct(o.n2 / o.n1 - 1)} ${vp}`,
          "",
        ]),
    );
    upd(
      "gNote",
      noteInner(
        tl(
          `${
            same
              ? "Ai ales același segment de două ori; alege segmente diferite pentru creștere și reducere."
              : `Creșterea segmentului ${B[o.u].nm} cu ${pctS(sc.up)} și reducerea segmentului ${B[o.dn].nm} cu ${nf0.format(sc.dn)}% ar schimba combined ratio al grupului de la ${pct(o.cr1)} la ${pct(o.cr2)}, iar rezultatul tehnic cu ${o.r2 >= o.r1 ? "+" : "−"}${eurK(Math.abs(o.r2 - o.r1))}. ` +
                `Acesta e un efect de mix pur: niciun segment nu devine mai bun, doar se schimbă ponderile. ` +
                `Costul ascuns e în volum: primele scad sau cresc cu ${sgnPct(o.n2 / o.n1 - 1)}, ceea ce afectează cota de piață și costurile fixe.`
          }`,
          `${
            same
              ? "You have picked the same segment twice; choose different segments to grow and to shrink."
              : `Growing ${B[o.u].nm} by ${pctS(sc.up)} and shrinking ${B[o.dn].nm} by ${nf0.format(sc.dn)}% would move the group combined ratio from ${pct(o.cr1)} to ${pct(o.cr2)}, and the underwriting result by ${o.r2 >= o.r1 ? "+" : "−"}${eurK(Math.abs(o.r2 - o.r1))}. ` +
                `This is a pure mix effect: no segment gets any better, only the weights change. ` +
                `The hidden cost is volume: premium changes by ${sgnPct(o.n2 / o.n1 - 1)}, which affects market share and fixed costs.`
          }`,
        ),
      ),
    );
    updChart(0, (c) => {
      c.data.datasets[1].data = o.S2.map((b) => b.nep2 / o.n2);
    });
  };
  const after = () => {
    const P1 = pal();
    const o = calc();
    mk("c1", {
      type: "bar",
      data: {
        labels: B.map((b) => b.nm),
        datasets: [
          {
            label: "Plan 2026",
            data: B.map((b) => b.nep / o.n1),
            backgroundColor: P1.s[5],
            borderRadius: 3,
          },
          {
            label: tl("Scenariu", "Scenario"),
            data: o.S2.map((b) => b.nep2 / o.n2),
            backgroundColor: P1.s[0],
            borderRadius: 3,
          },
        ],
      },
      options: {
        scales: { y: { ticks: { callback: tickPct } }, x: { grid: { display: false } } },
        plugins: { tooltip: { callbacks: { label: (c) => `${c.dataset.label}: ${pct(c.raw)}` } } },
      },
    });
    update();
  };
  return {
    t: tl(`Ce facem: ${SEGN[S.segDim]}`, `What we do: ${SEGN[S.segDim]}`),
    p: tl(
      "Simulatorul de realocare: ce se întâmplă dacă mutăm vânzările între segmente.",
      "The reallocation simulator: what happens if we shift sales between segments.",
    ),
    html,
    after,
    update,
  };
};
