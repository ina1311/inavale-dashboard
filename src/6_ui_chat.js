/* ---------- render ---------- */
/* a card value that does not fit (English amounts can be a few pixels wider on narrow phones) is scaled down slightly, never below 75% */
function fitVals(root = document.getElementById("main")) {
  root.querySelectorAll(".card .v").forEach((v) => {
    v.style.fontSize = "";
    if (v.scrollWidth <= v.clientWidth + 2) return;
    const f0 = parseFloat(getComputedStyle(v).fontSize);
    for (let f = f0 - 1; f >= f0 * 0.75; f--) {
      v.style.fontSize = f + "px";
      if (v.scrollWidth <= v.clientWidth + 2) break;
    }
  });
}
const main = document.getElementById("main");
let RT = 0,
  curKey = "sin1",
  curScreen = null;
function render() {
  const tok = ++RT;
  charts.forEach((c) => c.destroy());
  charts = [];
  screenTerms = new Set();
  hidePop();
  document
    .querySelectorAll("#domains button")
    .forEach((b) => b.setAttribute("aria-current", b.dataset.id === S.dom));
  document
    .querySelectorAll("#depth button")
    .forEach((b) => b.setAttribute("aria-current", +b.dataset.l === S.layer));
  renderFilters();
  curKey = S.dom === "dat" ? "dat1" : S.dom + S.layer;
  document.querySelector(".row2").style.display = S.dom === "dat" ? "none" : "";
  const f = SCR[curKey];

  const s = f();
  const terms = [...screenTerms]
    .map((t) => [t, glShow(GL[t])])
    .sort((a, b) => a[1].name.localeCompare(b[1].name, LANG));
  const gl =
    `<details class="gl"><summary>${tl("Glosarul acestui ecran", "Glossary for this screen")}: ${terms.length} ${tl("termeni", "terms")}</summary>` +
    `<dl>${terms
      .map(
        ([t, g]) =>
          `<div><dt>${esc(g.name)}${g.alt ? ` <span style="font-weight:400;color:var(--ink-3)">(${esc(g.alt)})</span>` : ""}</dt>` +
          `<dd>${esc(g.def)}${g.f && g.f !== "–" ? `<br><span style="color:var(--ink-3)">${esc(g.f)}</span>` : ""}</dd>` +
          `</div>`,
      )
      .join("")}</dl></details>`;
  main.innerHTML = `<div class="screenhead"><div><h1>${s.t}</h1><p>${s.p}</p></div></div><div class="grid">${s.html}${gl}</div>`;
  main.dataset.title = s.t;
  fitVals();
  updChat();
  navEdges();
  if (tipShownAt === "first") tipShownAt = "seen";
  else if (tipShownAt === "seen") {
    hideTip(false);
    tipShownAt = null;
  }
  const ab = document.querySelector('#domains button[aria-current="true"]');
  if (ab && matchMedia("(max-width:1000px)").matches) {
    const nv = document.getElementById("domains");
    nv.scrollTo({
      left: ab.offsetLeft - nv.offsetLeft - (nv.clientWidth - ab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }
  curScreen = s;
  requestAnimationFrame(() => {
    if (tok === RT && s.after) s.after();
  });
}
function renderFilters() {
  const F = document.getElementById("filters");
  const opt = (arr, v, all) =>
    `<option value="-1">${all}</option>` +
    arr.map((n, i) => `<option value="${i}" ${i === v ? "selected" : ""}>${n}</option>`).join("");
  const yo = (v) => YEARS.map((y) => `<option ${y === v ? "selected" : ""}>${y}</option>`).join("");
  const n = S.to - S.from + 1,
    pf = S.from - n;
  const prevLab =
    pf >= Y0
      ? `${tl("Perioada anterioară", "Previous period")} (${lbl(pf, S.from - 1)})`
      : tl("Perioada anterioară (nu există în date)", "Previous period (not in the data)");
  const parts = [];
  if (S.dom === "seg")
    parts.push(
      `<label>${tl("Compară după", "Compare by")}<select id="fd">${[
        ["region", tl("Regiuni", "Regions")],
        ["line", tl("Linii de business", "Lines of business")],
        ["channel", tl("Canale de vânzare", "Distribution channels")],
      ]
        .map(([v, t]) => `<option value="${v}" ${S.segDim === v ? "selected" : ""}>${t}</option>`)
        .join("")}</select></label>`,
    );
  if (S.dom === "dat") {
    F.innerHTML = "";
    setHH();
    return;
  }
  if (S.layer <= 2)
    parts.push(
      `<label>${tl("De la", "From")}<select id="ff">${yo(S.from)}</select></label>` +
        `<label>${tl("Până la", "To")}<select id="ft">${yo(S.to)}</select></label>
 ` +
        `<label>${tl("Compară cu", "Compare with")}<select id="fk"><option value="prev" ${S.cmp === "prev" ? "selected" : ""}>${prevLab}</option>${YEARS.map((y) => `<option value="${y}" ${S.cmp === String(y) ? "selected" : ""}>${tl("Anul", "Year")} ${y}</option>`).join("")}<option value="none" ${S.cmp === "none" ? "selected" : ""}>${tl("Fără comparație", "No comparison")}</option></select></label>`,
    );
  else
    parts.push(
      `<span class="fnote">${S.layer === 3 ? tl("Orizont 2026 · model construit pe istoria 2021–2025", "Horizon 2026 · model built on 2021–2025 history") : tl("Scenariile folosesc propriile ipoteze, din fereastra „Ipotezele”", "Scenarios use their own assumptions, set in the “Assumptions” window")}</span>`,
    );
  if (on("region"))
    parts.push(
      `<label>${tl("Regiune", "Region")}<select id="fr">${opt(NM.R, S.region, tl("Toate regiunile", "All regions"))}</select></label>`,
    );
  if (on("line"))
    parts.push(
      `<label>${tl("Linie de business", "Line of business")}<select id="fl">${opt(NM.L, S.line, tl("Toate liniile", "All lines"))}</select></label>`,
    );
  if (on("channel"))
    parts.push(
      `<label>${tl("Canal", "Channel")}<select id="fc">${opt(NM.C, S.channel, tl("Toate canalele", "All channels"))}</select></label>`,
    );
  F.innerHTML = parts.join("");
  const fs = [
    S.dom === "seg" ? `${tl("după", "by")} ${SEGN[S.segDim]}` : "",
    S.layer <= 2
      ? `<b>${P().lab}</b>${CP() ? " vs " + CP().lab : ""}`
      : S.layer === 3
        ? `<b>${tl("Orizont 2026", "Horizon 2026")}</b>`
        : `<b>${tl("Scenarii", "Scenarios")}</b>`,
    on("region") ? (S.region >= 0 ? NM.R[S.region] : tl("toate regiunile", "all regions")) : "",
    on("line") ? (S.line >= 0 ? NM.L[S.line] : tl("toate liniile", "all lines")) : "",
    on("channel") ? (S.channel >= 0 ? NM.C[S.channel] : tl("toate canalele", "all channels")) : "",
  ].filter(Boolean);
  const fb = document.getElementById("fbtn");
  fb.innerHTML = `<span>${tl("Filtre", "Filters")}: ${fs.join(" · ")}</span>`;
  fb.style.visibility = parts.length ? "" : "hidden";
  F.classList.toggle("open", fb.getAttribute("aria-expanded") === "true");
  const bind = (id, fn) => {
    const el = F.querySelector(id);
    if (el) el.onchange = fn;
  };
  bind("#fd", (e) => {
    S.segDim = e.target.value;
    S[S.segDim] = -1;
    render();
  });
  bind("#ff", (e) => {
    S.from = +e.target.value;
    if (S.to < S.from) S.to = S.from;
    render();
  });
  bind("#ft", (e) => {
    S.to = +e.target.value;
    if (S.from > S.to) S.from = S.to;
    render();
  });
  bind("#fk", (e) => {
    S.cmp = e.target.value;
    render();
  });
  bind("#fr", (e) => {
    S.region = +e.target.value;
    render();
  });
  bind("#fl", (e) => {
    S.line = +e.target.value;
    render();
  });
  bind("#fc", (e) => {
    S.channel = +e.target.value;
    render();
  });
  setHH();
}
document.getElementById("fbtn").onclick = () => {
  const fb = document.getElementById("fbtn"),
    o = fb.getAttribute("aria-expanded") !== "true";
  fb.setAttribute("aria-expanded", o);
  document.getElementById("filters").classList.toggle("open", o);
  setHH();
};
const totop = document.getElementById("totop");
window.addEventListener("scroll", () => totop.classList.toggle("show", window.scrollY > 500), {
  passive: true,
});
totop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
function buildNav() {
  document.getElementById("domains").innerHTML = DOMS.map(
    (d) => `<button data-id="${d.id}" aria-current="${d.id === S.dom}">${d.n}</button>`,
  ).join("");
  document.getElementById("depth").innerHTML = LAYERS.map(
    (l, i) =>
      `<button role="tab" data-l="${i + 1}" aria-current="${i + 1 === S.layer}">${l.n}<small>${i + 1} · ${l.s}</small></button>`,
  ).join("");
}
buildNav();
/* narrow screens: the domain menu scrolls sideways; a fade and an arrow show on the side(s) where it continues */
const navEl = document.getElementById("domains"),
  navWrap = document.getElementById("navwrap");
function navEdges() {
  const m = navEl.scrollWidth - navEl.clientWidth;
  navWrap.classList.toggle("l", m > 2 && navEl.scrollLeft > 2);
  navWrap.classList.toggle("r", m > 2 && navEl.scrollLeft < m - 2);
}
navEl.addEventListener("scroll", navEdges, { passive: true });
window.addEventListener("resize", navEdges);
document.getElementById("navNext").onclick = () =>
  navEl.scrollBy({ left: navEl.clientWidth * 0.7, behavior: reduceMotion ? "auto" : "smooth" });
document.getElementById("navPrev").onclick = () =>
  navEl.scrollBy({ left: -navEl.clientWidth * 0.7, behavior: reduceMotion ? "auto" : "smooth" });
document.getElementById("domains").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    S.dom = b.dataset.id;
    render();
  }
};
document.getElementById("depth").onclick = (e) => {
  const b = e.target.closest("button");
  if (b && !b.disabled) {
    S.layer = +b.dataset.l;
    render();
  }
};

const noteTogTxt = () =>
  noteOpen ? tl("Restrânge", "Show less") : tl("Citește mai mult", "Read more");
document.addEventListener("click", (e) => {
  const t = e.target.closest(".ntog");
  if (t) {
    noteOpen = !noteOpen;
    const n = t.closest(".note");
    n.querySelector(".nmore").hidden = !noteOpen;
    t.textContent = noteTogTxt();
    t.setAttribute("aria-expanded", noteOpen);
    return;
  }
  const a = e.target.closest(".nsug");
  if (a) {
    openSheetFor(a.closest(".note"));
    ask(a.dataset.ask);
    return;
  }
  const g = e.target.closest("[data-go]");
  if (g) {
    S.dom = g.dataset.go;
    window.scrollTo({ top: 0 });
    render();
  }
});
document.addEventListener("input", (e) => {
  const x = e.target.closest("[data-sc]");
  if (!x) return;
  S.sc[x.dataset.sc] = x.type === "range" ? +x.value : x.value;
  if (curScreen && curScreen.update) curScreen.update();
});
document.addEventListener("change", (e) => {
  const x = e.target.closest("select[data-sc]");
  if (x && curScreen && curScreen.update) curScreen.update();
});
/* ---------- tooltips ---------- */
const pop = document.getElementById("pop");
let popFor = null,
  pinned = false;
function showPop(btn) {
  const G = GL[btn.dataset.term];
  if (!G) return;
  const g = glShow(G);
  popFor && popFor.setAttribute("aria-expanded", "false");
  popFor = btn;
  btn.setAttribute("aria-expanded", "true");
  pop.innerHTML =
    `<b>${esc(g.name)}</b><em>${g.alt ? esc(g.alt) + " · " : ""}${esc(g.dom)}</em>${esc(g.def)}${g.f && g.f !== "–" ? `<div class="f">${esc(g.f)}</div>` : ""}` +
    `<div class="f"><a data-open="${esc(G.t)}">${tl("Deschide în glosar", "Open in the glossary")}</a>` +
    `</div>`;
  pop.style.display = "block";
  const r = btn.getBoundingClientRect();
  const w = pop.offsetWidth;
  let x = r.left + window.scrollX - 8;
  x = Math.min(x, window.scrollX + document.documentElement.clientWidth - w - 10);
  x = Math.max(10, x);
  pop.style.left = x + "px";
  pop.style.top = r.bottom + window.scrollY + 6 + "px";
}
function hidePop() {
  pop.style.display = "none";
  pinned = false;
  if (popFor) {
    popFor.setAttribute("aria-expanded", "false");
    popFor = null;
  }
}
document.addEventListener("mouseover", (e) => {
  const b = e.target.closest(".q");
  if (b && !pinned) showPop(b);
});
document.addEventListener("mouseout", (e) => {
  const b = e.target.closest(".q");
  if (b && !pinned && !(e.relatedTarget && pop.contains(e.relatedTarget))) hidePop();
});
pop.addEventListener("mouseleave", () => {
  if (!pinned) hidePop();
});
document.addEventListener("click", (e) => {
  const b = e.target.closest(".q");
  const a = e.target.closest("[data-open]");
  const x = e.target.closest("[data-explain]");
  if (a) {
    openDrawer(a.dataset.open);
    hidePop();
    return;
  }
  if (x) {
    explainWin(x.dataset.explain);
    return;
  }
  if (b) {
    if (pinned && popFor === b) {
      hidePop();
    } else {
      showPop(b);
      pinned = true;
    }
    e.stopPropagation();
    return;
  }
  if (!pop.contains(e.target)) hidePop();
});
document.addEventListener("focusin", (e) => {
  const b = e.target.closest && e.target.closest(".q");
  if (b) showPop(b);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hidePop();
    closeDrawer();
  }
});

/* ---------- glossary drawer ---------- */
const drawer = document.getElementById("drawer"),
  scrim = document.getElementById("scrim"),
  gs = document.getElementById("gsearch");
let gDom = null;
const doms = [...new Set(D.gl.map((g) => g[2]))];
const tid = (t) =>
  "t-" +
  Array.from(t)
    .map((c) => c.charCodeAt(0).toString(36))
    .join("");
/* search matches the Romanian and English names in both languages, plus the definition in the active language */
function renderGl(hl) {
  const qv = gs.value.trim().toLowerCase();
  document.getElementById("gchips").innerHTML = [
    `<button data-d="" aria-pressed="${!gDom}">${tl("Toate", "All")}</button>`,
  ]
    .concat(
      doms.map(
        (d) =>
          `<button data-d="${esc(d)}" aria-pressed="${gDom === d}">${esc(glDomName(d))}</button>`,
      ),
    )
    .join("");
  const L = D.gl
    .map((g) => [g, glShow(GL[g[0]])])
    .filter(
      ([g, v]) =>
        (!gDom || g[2] === gDom) &&
        (!qv || (g[0] + " " + g[1] + " " + v.def).toLowerCase().includes(qv)),
    )
    .sort((a, b) => a[1].name.localeCompare(b[1].name, LANG));
  document.getElementById("glist").innerHTML = L.length
    ? L.map(
        ([g, v]) =>
          `<div class="term ${g[0] === hl ? "hl" : ""}" id="${tid(g[0])}">` +
          `<div class="dom">${esc(v.dom)}</div><b>${esc(v.name)}</b>${v.alt ? `<em>${esc(v.alt)}</em>` : ""}` +
          `<p>${esc(v.def)}</p>${v.f && v.f !== "–" ? `<p style="color:var(--ink-3)">${esc(v.f)}</p>` : ""}` +
          `</div>`,
      ).join("")
    : `<p style="color:var(--ink-3)">${tl("Niciun termen nu se potrivește. Încearcă alt cuvânt sau alege „Toate”.", "No term matches. Try another word or choose “All”.")}</p>`;
  if (hl) {
    const el = document.getElementById(tid(hl));
    el && el.scrollIntoView({ block: "center" });
  }
}
function openDrawer(hl) {
  gDom = null;
  gs.value = "";
  renderGl(hl);
  drawer.classList.add("open");
  scrim.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  setTimeout(() => gs.focus({ preventScroll: true }), 50);
}
function closeDrawer() {
  drawer.classList.remove("open");
  scrim.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}
document.getElementById("glossBtn").onclick = () => openDrawer();
document.getElementById("closeDrawer").onclick = closeDrawer;
scrim.onclick = closeDrawer;
gs.oninput = () => renderGl();
document.getElementById("gchips").onclick = (e) => {
  const b = e.target.closest("button");
  if (b) {
    gDom = b.dataset.d || null;
    renderGl();
  }
};

/* ---------- theme ---------- */
const root = document.documentElement;
const mq = matchMedia("(prefers-color-scheme: dark)");
const SUN =
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  MOON = '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>';
const isDark = () => (root.dataset.theme ? root.dataset.theme === "dark" : mq.matches);
function paintThemeBtn() {
  const d = isDark();
  document.getElementById("themeIco").innerHTML = d ? SUN : MOON;
  document.getElementById("themeLbl").textContent = d
    ? tl("Luminos", "Light")
    : tl("Întunecat", "Dark");
  document
    .getElementById("themeBtn")
    .setAttribute(
      "aria-label",
      d
        ? tl("Treci la tema luminoasă", "Switch to light theme")
        : tl("Treci la tema întunecată", "Switch to dark theme"),
    );
}
try {
  const t = localStorage.getItem("nv-theme");
  if (t === "dark" || t === "light") root.dataset.theme = t;
} catch (e) {}
document.getElementById("themeBtn").onclick = () => {
  const n = isDark() ? "light" : "dark";
  root.dataset.theme = n;
  try {
    localStorage.setItem("nv-theme", n);
  } catch (e) {}
  paintThemeBtn();
  render();
};
mq.addEventListener &&
  mq.addEventListener("change", () => {
    if (!root.dataset.theme) {
      paintThemeBtn();
      render();
    }
  });
paintThemeBtn();

/* ---------- static texts of the page (data-i = content, data-ia = aria-label, data-ip = placeholder) ---------- */
const UI = {
  title: ["InaVale Assurance – dashboard de analiză", "InaVale Assurance – analytics dashboard"],
  brand: ["Assurance Group · dashboard de analiză", "Assurance Group · analytics dashboard"],
  navDomains: ["Domenii", "Domains"],
  navPrev: ["Domeniile anterioare", "Previous domains"],
  navNext: ["Mai multe domenii", "More domains"],
  chatBtn: ["Arată sau ascunde chat-ul", "Show or hide the chat"],
  chatLbl: ["Chat", "Chat"],
  glossBtn: ["Deschide glosarul general", "Open the general glossary"],
  glossLbl: ["Glosar", "Glossary"],
  langGroup: ["Limba", "Language"],
  depth: ["Profunzimea analizei", "Analysis depth"],
  mtip: [
    "<b>Sfat:</b> dashboard-ul e gândit pentru ecrane mari. Pe laptop sau desktop vezi ferestrele alăturat, iar graficele și tabelele se citesc mai ușor. Trimite-ți linkul ție sau unui coleg, ca să-l deschideți acolo.",
    "<b>Tip:</b> this dashboard is designed for large screens. On a laptop or desktop the windows sit side by side, and charts and tables are easier to read. Send the link to yourself or a colleague to open it there.",
  ],
  mtipShare: ["Trimite linkul", "Send the link"],
  mtipX: ["Închide sfatul", "Close the tip"],
  chatAside: ["Chat pe date", "Data chat"],
  grab: ["Trage pentru a mări sau micșora chat-ul", "Drag to enlarge or shrink the chat"],
  chatTitle: ["Întreabă despre date", "Ask about the data"],
  chatClear: ["Golește", "Clear"],
  chatClose: ["Ascunde", "Hide"],
  chatCloseA: ["Ascunde chat-ul", "Hide the chat"],
  chatPh: [
    "De exemplu: de ce a crescut rata daunei în 2023?",
    "For example: why did the loss ratio rise in 2023?",
  ],
  footCols: [
    `
 <div><h4>Despre proiect</h4><p>Un dashboard educațional de analiză a datelor, construit ca un instrument profesionist: 6 domenii, 4 layere de profunzime, perioade comparabile, prognoze și scenarii.</p>` +
      `<p>Scopul lui e să arate cum gândește un analist de date senior, de la „ce s-a întâmplat” până la „ce facem”.</p>` +
      `</div>
 <div><h4>Cum îl folosești</h4><p>Alege un domeniu în bara de sus, apoi profunzimea analizei. ` +
      `Filtrele apar doar unde se aplică.</p><p>„?” explică un termen, „Explică” interpretează o fereastră, iar chat-ul răspunde doar din datele InaVale.</p>` +
      `</div>
 <div><h4>Date și metode</h4><p>InaVale Assurance Group e o companie fictivă: 11 tabele sintetice, 2021–2025, sume în EUR. ` +
      `Contabilitatea de asigurări și solvabilitatea sunt simplificate; daunele individuale sunt un eșantion de 25.000 de dosare.</p>` +
      `<p><button type="button" class="lk" data-go="dat">Vezi tabul Despre date</button></p>` +
      `</div>
 <div><h4>Despre Ina</h4><p>Concepția și analiza: Ina, analist de date. ` +
      `Numele companiei fictive, InaVale, vine de la ea.</p></div>
`,
    `
 <div><h4>About the project</h4><p>An educational data analytics dashboard, built like a professional tool: 6 domains, 4 layers of depth, comparable periods, forecasts and scenarios.</p>` +
      `<p>Its purpose is to show how a senior data analyst thinks, from “what happened” to “what we do”.</p>` +
      `</div>
 <div><h4>How to use it</h4><p>Pick a domain in the top bar, then the depth of analysis. ` +
      `Filters appear only where they apply.</p><p>“?” explains a term, “Explain” interprets a window, and the chat answers only from InaVale’s data.</p>` +
      `</div>
 <div><h4>Data and methods</h4><p>InaVale Assurance Group is a fictional company: 11 synthetic tables, 2021–2025, amounts in EUR. ` +
      `Insurance accounting and solvency are simplified; individual claims are a sample of 25,000 files.</p>` +
      `<p><button type="button" class="lk" data-go="dat">See the About the data tab</button></p>` +
      `</div>
 <div><h4>About Ina</h4><p>Concept and analysis: Ina, data analyst. ` +
      `The fictional company’s name, InaVale, comes from hers.</p></div>
`,
  ],
  footFine: [
    "Asistentul AI funcționează în versiunea găzduită în claude.ai: acolo întrebările se trimit către Claude împreună cu cifrele de pe ecran, din contul celui care le pune. Datele sunt sintetice și nu descriu persoane sau companii reale. Versiune: 30 septembrie 2026.",
    "The AI assistant works in the version hosted on claude.ai: there, questions are sent to Claude together with the figures on screen, from the account of the person asking. The data is synthetic and does not describe real people or companies. Version: 30 September 2026.",
  ],
  totop: ["↑ Meniu", "↑ Menu"],
  totopA: ["Înapoi la meniu", "Back to the menu"],
  drawer: ["Glosar general", "General glossary"],
  close: ["Închide", "Close"],
  closeDrawerA: ["Închide glosarul", "Close the glossary"],
  gsearch: [
    "Caută un termen, de exemplu combined ratio",
    "Search for a term, for example combined ratio",
  ],
};
const ui = (k) => {
  const v = UI[k];
  return v ? tl(v[0], v[1]) : "";
};
function paintStatic() {
  root.lang = LANG;
  document.title = ui("title");
  document.querySelectorAll("[data-i]").forEach((el) => {
    el.innerHTML = ui(el.dataset.i);
  });
  document
    .querySelectorAll("[data-ia]")
    .forEach((el) => el.setAttribute("aria-label", ui(el.dataset.ia)));
  document
    .querySelectorAll("[data-ip]")
    .forEach((el) => el.setAttribute("placeholder", ui(el.dataset.ip)));
  document
    .querySelectorAll("#langsw button")
    .forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === LANG));
}
/* switching language: everything that holds text is rebuilt; the state (domain, layer, filters, scenario sliders) and the chat history stay */
function applyLang(l) {
  if (l !== "ro" && l !== "en") return;
  LANG = l;
  NM = CAT[l];
  setFormats();
  try {
    localStorage.setItem("nv-lang", l);
  } catch (e) {}
  paintStatic();
  buildNav();
  navEdges();
  paintThemeBtn();
  if (drawer.classList.contains("open")) renderGl();
  refreshChatLang();
  render();
}
document.getElementById("langsw").onclick = (e) => {
  const b = e.target.closest("button[data-lang]");
  if (b && b.dataset.lang !== LANG) applyLang(b.dataset.lang);
};
paintStatic();

/* ---------- chat: layout ---------- */
const layout = document.getElementById("layout"),
  hdr = document.querySelector("header.top");
function setHH() {
  const h = document.querySelector("header.top");
  if (h) document.documentElement.style.setProperty("--hh", h.offsetHeight + "px");
}
setHH();
window.addEventListener("resize", setHH);
const narrow = () => matchMedia("(max-width:1000px)").matches;
let chatOpen = !narrow();
try {
  const v = localStorage.getItem("nv-chat");
  if (v !== null && !narrow()) chatOpen = v === "1";
} catch (e) {}
function applyChat() {
  layout.classList.toggle("chat-off", !chatOpen);
  if (!chatOpen) setSheet(false);
  try {
    localStorage.setItem("nv-chat", chatOpen ? "1" : "0");
  } catch (e) {}
  charts.forEach((c) => c.resize());
}
const chatEl = document.getElementById("chat");
function setSheet(on, full = false) {
  chatEl.classList.toggle("sheet", on);
  chatEl.classList.toggle("full", on && full);
  document.body.classList.toggle("sheet-open", on && !full);
}
function openSheetFor(el) {
  if (!narrow()) {
    if (!chatOpen) {
      chatOpen = true;
      applyChat();
    }
    return;
  }
  chatOpen = true;
  applyChat();
  setSheet(true, false);
  if (el)
    requestAnimationFrame(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? "auto" : "smooth" });
    });
}
document.getElementById("chatBtn").onclick = () => {
  chatOpen = !chatOpen;
  setSheet(false);
  applyChat();
  if (chatOpen && !narrow()) document.getElementById("chatIn").focus();
};
(() => {
  const g = document.getElementById("grab");
  let y0 = null,
    h0 = 0;
  const vh = () => window.innerHeight;
  g.addEventListener("pointerdown", (e) => {
    if (!chatEl.classList.contains("sheet")) return;
    y0 = e.clientY;
    h0 = chatEl.getBoundingClientRect().height;
    chatEl.style.transition = "none";
    g.setPointerCapture(e.pointerId);
  });
  g.addEventListener("pointermove", (e) => {
    if (y0 == null) return;
    const h = Math.max(80, Math.min(vh(), h0 + (y0 - e.clientY)));
    chatEl.style.height = h + "px";
  });
  const end = (e) => {
    if (y0 == null) return;
    const moved = Math.abs(e.clientY - y0);
    const h = chatEl.getBoundingClientRect().height;
    chatEl.style.height = "";
    chatEl.style.transition = "";
    y0 = null;
    if (moved < 6) {
      setSheet(true, !chatEl.classList.contains("full"));
      return;
    }
    const r = h / vh();
    if (r > 0.75) setSheet(true, true);
    else if (r < 0.3) {
      chatOpen = false;
      applyChat();
    } else setSheet(true, false);
  };
  g.addEventListener("pointerup", end);
  g.addEventListener("pointercancel", end);
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSheet(true, !chatEl.classList.contains("full"));
    }
  });
})();
document.getElementById("chatClose").onclick = () => {
  chatOpen = false;
  applyChat();
};
applyChat();

/* ---------- chat: context from the screen ---------- */
function chartText(ch) {
  const cfg = ch.config,
    lab = ch.data.labels || [],
    cb = (((cfg.options || {}).plugins || {}).tooltip || {}).callbacks || {};
  const out = [];
  ch.data.datasets.forEach((ds) => {
    const vals = ds.data.map((v, i) => {
      let s;
      try {
        s = cb.label
          ? cb.label({ raw: v, dataset: ds, label: lab[i], dataIndex: i, parsed: {} })
          : null;
      } catch (e) {
        s = null;
      }
      if (s == null) s = typeof v === "number" ? Math.round(v * 1000) / 1000 : JSON.stringify(v);
      return (lab[i] != null ? lab[i] + " → " : "") + s;
    });
    out.push(
      tl(
        `  Serie „${ds.label || "valori"}”: ${vals.join("; ")}`,
        `  Series “${ds.label || "values"}”: ${vals.join("; ")}`,
      ),
    );
  });
  return out.join("\n");
}
function screenContext() {
  const L = [];
  const C = CP();
  const all = tl("toate", "all");
  L.push(
    S.dom === "dat"
      ? tl(
          `Ecran: Despre date (descrierea setului de date).`,
          `Screen: About the data (description of the dataset).`,
        )
      : tl(
          `Ecran: ${dom().n} › layer ${S.layer} „${LAYERS[S.layer - 1].n}” (${main.dataset.title || ""}).`,
          `Screen: ${dom().n} › layer ${S.layer} “${LAYERS[S.layer - 1].n}” (${main.dataset.title || ""}).`,
        ),
  );
  L.push(
    S.layer >= 3
      ? tl(
          `Layerul folosește toată istoria 2021–2025; prognozele sunt pentru 2026 și sunt estimări cu interval de 80%.`,
          `This layer uses the full 2021–2025 history; forecasts are for 2026 and are estimates with an 80% interval.`,
        )
      : tl(
          `Perioada selectată: ${P().lab}. Comparație: ${C ? C.lab : "fără"}. ` +
            `Filtre: regiune ${on("region") && S.region >= 0 ? NM.R[S.region] : all}, linie ${on("line") && S.line >= 0 ? NM.L[S.line] : all}, canal ${on("channel") && S.channel >= 0 ? NM.C[S.channel] : all} (pe ecran apar doar filtrele care se aplică).${S.dom === "seg" ? ` Dimensiunea comparată: ${SEGN[S.segDim]}.` : ""}`,
          `Selected period: ${P().lab}. Comparison: ${C ? C.lab : "none"}. ` +
            `Filters: region ${on("region") && S.region >= 0 ? NM.R[S.region] : all}, line ${on("line") && S.line >= 0 ? NM.L[S.line] : all}, channel ${on("channel") && S.channel >= 0 ? NM.C[S.channel] : all} (only the filters that apply are shown on screen).${S.dom === "seg" ? ` Dimension compared: ${SEGN[S.segDim]}.` : ""}`,
        ),
  );
  main.querySelectorAll(".cards .card").forEach((c) => {
    L.push(
      `${tl("Indicator", "KPI")}: ${c.querySelector(".l").innerText.replace("?", "").trim()} = ${c.querySelector(".v").innerText}${c.querySelector(".d").innerText.trim() ? ` (${c.querySelector(".d").innerText.trim()})` : ""}${c.querySelector(".d2") ? ` [${c.querySelector(".d2").innerText}]` : ""}`,
    );
  });
  main.querySelectorAll("section.w").forEach((w) => {
    L.push(
      tl(`\nFereastra „${w.dataset.title}”`, `\nWindow “${w.dataset.title}”`) +
        (w.querySelector(".sub") ? ` — ${w.querySelector(".sub").innerText}` : ""),
    );
    w.querySelectorAll("[data-in]").forEach((x) =>
      L.push(
        tl(
          `  Ipoteză „${x.dataset.in}” = ${x.dataset.shown || x.value}`,
          `  Assumption “${x.dataset.in}” = ${x.dataset.shown || x.value}`,
        ),
      ),
    );
    const t = w.querySelector("table");
    if (t) {
      [...t.rows]
        .slice(0, 40)
        .forEach((r) =>
          L.push("  " + [...r.cells].map((c) => c.innerText.replace(/\?/g, "").trim()).join(" | ")),
        );
    }
    const cvs = w.querySelector("canvas");
    if (cvs) {
      const ch = charts.find((x) => x.canvas === cvs);
      if (ch) L.push(chartText(ch));
    }
  });
  const n = main.querySelector(".note p");
  if (n) L.push(`\n${tl("Nota analistului", "Analyst’s note")}: ${n.innerText}`);
  L.push(
    `${tl("Termeni din glosarul ecranului", "Glossary terms on this screen")}: ${[...screenTerms].map((t) => glShow(GL[t]).name).join(", ")}.`,
  );
  return L.join("\n").slice(0, 40000);
}

/* ---------- chat: data tools for Claude ----------
   Tool names, input fields and result fields stay the same in both languages; only descriptions and labels are translated.
   Region, line, channel and department names are accepted in Romanian and in English. */
const findIdx = (v, arrs) => {
  if (v == null || v === "") return -1;
  const s = String(v).toLowerCase().trim();
  for (const a of arrs) {
    const i = a.findIndex((x) => String(x).toLowerCase() === s);
    if (i >= 0) return i;
  }
  for (const a of arrs) {
    const i = a.findIndex(
      (x) => String(x).toLowerCase().includes(s) || s.includes(String(x).toLowerCase()),
    );
    if (i >= 0) return i;
  }
  return -2;
};
const rng = (i) => {
  const f = Math.max(Y0, Math.min(2025, +i.from || Y0)),
    t = Math.max(f, Math.min(2025, +i.to || 2025));
  return { from: f, to: t };
};
const r1 = (v) => (v == null || !isFinite(v) ? null : Math.round(v * 10) / 10),
  r3 = (v) => (v == null || !isFinite(v) ? null : Math.round(v * 1000) / 1000);
const deptN = () => D.D.map((d) => NM.D[d]);
const RN = () => [CAT.ro.R, CAT.en.R, D.R],
  LN = () => [CAT.ro.L, CAT.en.L, D.L],
  CN = () => [CAT.ro.C, CAT.en.C, D.C],
  DN = () => [D.D.map((d) => CAT.ro.D[d]), D.D];
const TOOLS = [
  {
    name: "query_business",
    label_ro: "activitatea de asigurare",
    label_en: "insurance activity",
    description_ro:
      "Indicatori de asigurare din setul complet InaVale (lunar agregat): prime brute (GWP), prime nete câștigate, rata daunei, rata cheltuielilor, combined ratio, polițe noi, rata de pierdere a polițelor, bugetul de prime și primele la cursurile din 2021. Sumele sunt în milioane EUR, ratele ca fracții (0,95 = 95%). Folosește-l pentru orice cifră de business care nu e pe ecran.",
    description_en:
      "Insurance indicators from the full InaVale dataset (aggregated monthly): gross written premium (GWP), net earned premium, loss ratio, expense ratio, combined ratio, new policies, lapse rate, premium budget and premium at 2021 exchange rates. Amounts are in EUR millions, ratios as fractions (0.95 = 95%). Use it for any business figure that is not on screen.",
    schema: () => ({
      type: "object",
      properties: {
        from: {
          type: "integer",
          description: tl("Primul an (2021–2025)", "First year (2021–2025)"),
        },
        to: { type: "integer", description: tl("Ultimul an (2021–2025)", "Last year (2021–2025)") },
        region: { type: "string", description: tl("Opțional: ", "Optional: ") + NM.R.join(", ") },
        line: { type: "string", description: tl("Opțional: ", "Optional: ") + NM.L.join(", ") },
        channel: { type: "string", description: tl("Opțional: ", "Optional: ") + NM.C.join(", ") },
        group_by: { type: "string", enum: ["none", "year", "region", "line", "channel"] },
      },
    }),
    execute(i) {
      const R = rng(i);
      const ri = findIdx(i.region, RN()),
        li = findIdx(i.line, LN()),
        ci = findIdx(i.channel, CN());
      if (ri === -2 || li === -2 || ci === -2)
        throw new Error(
          tl(
            "Valoare necunoscută pentru regiune, linie sau canal. Folosește numele din descriere.",
            "Unknown value for region, line or channel. Use the names in the description.",
          ),
        );
      const g = i.group_by || "none";
      const keys =
        g === "year"
          ? YEARS.filter((y) => y >= R.from && y <= R.to)
          : g === "region"
            ? NM.R.map((_, k) => k)
            : g === "line"
              ? NM.L.map((_, k) => k)
              : g === "channel"
                ? NM.C.map((_, k) => k)
                : [null];
      return keys.map((k) => {
        const pred = (r) => {
          const y = yOf(r[0]);
          return (
            y >= R.from &&
            y <= R.to &&
            (ri < 0 || r[1] === ri) &&
            (li < 0 || r[2] === li) &&
            (ci < 0 || r[3] === ci) &&
            (g !== "year" || y === k) &&
            (g !== "region" || r[1] === k) &&
            (g !== "line" || r[2] === k) &&
            (g !== "channel" || r[3] === k)
          );
        };
        const o = uwAgg(pred);
        let bud = null;
        if (ci < 0 && g !== "channel") {
          bud = 0;
          D.bud.forEach((r) => {
            const y = yOf(r[0]);
            if (
              y >= R.from &&
              y <= R.to &&
              (ri < 0 || r[1] === ri) &&
              (li < 0 || r[2] === li) &&
              (g !== "year" || y === k) &&
              (g !== "region" || r[1] === k) &&
              (g !== "line" || r[2] === k)
            )
              bud += r[3];
          });
        }
        return {
          grup:
            g === "none"
              ? "total"
              : g === "year"
                ? k
                : g === "region"
                  ? NM.R[k]
                  : g === "line"
                    ? NM.L[k]
                    : NM.C[k],
          gwp_mil_eur: r1(o.gwp / 1000),
          nep_mil_eur: r1(o.nep / 1000),
          daune_mil_eur: r1(o.clm / 1000),
          rata_daunei: r3(o.lr),
          rata_cheltuielilor: r3(o.er),
          combined_ratio: r3(o.cr),
          polite_noi: o.nw,
          rata_pierdere_polite_anuala: r3(o.lapse),
          buget_gwp_mil_eur: bud == null ? null : r1(bud / 1000),
          gwp_la_cursurile_2021_mil_eur: r1(o.cfx / 1000),
        };
      });
    },
  },
  {
    name: "query_claims",
    label_ro: "daunele",
    label_en: "claims",
    description_ro:
      "Indicatori din eșantionul de 25.000 de dosare de daună: număr de dosare, severitate medie (EUR), zile medii de soluționare, rata fraudei suspectate, satisfacția clienților (1–5), ponderea dosarelor respinse. Poate grupa pe an, trimestru, regiune sau linie.",
    description_en:
      "Indicators from the sample of 25,000 claim files: number of files, average severity (EUR), average days to settle, suspected fraud rate, customer satisfaction (1–5), share of rejected files. Can group by year, quarter, region or line.",
    schema: () => ({
      type: "object",
      properties: {
        from: { type: "integer" },
        to: { type: "integer" },
        region: { type: "string" },
        line: { type: "string" },
        group_by: { type: "string", enum: ["none", "year", "quarter", "region", "line"] },
      },
    }),
    execute(i) {
      const R = rng(i);
      const ri = findIdx(i.region, RN()),
        li = findIdx(i.line, LN());
      if (ri === -2 || li === -2)
        throw new Error(
          tl("Valoare necunoscută pentru regiune sau linie.", "Unknown value for region or line."),
        );
      const g = i.group_by || "none";
      let keys = [null];
      if (g === "year") keys = YEARS.filter((y) => y >= R.from && y <= R.to);
      if (g === "quarter") {
        keys = [];
        for (let q = (R.from - Y0) * 4; q < (R.to - Y0 + 1) * 4; q++) keys.push(q);
      }
      if (g === "region") keys = [0, 1, 2, 3];
      if (g === "line") keys = [0, 1, 2, 3, 4];
      return keys.map((k) => {
        const o = clAgg((r) => {
          const y = yOf(r[0]);
          return (
            y >= R.from &&
            y <= R.to &&
            (ri < 0 || r[1] === ri) &&
            (li < 0 || r[2] === li) &&
            (g !== "year" || y === k) &&
            (g !== "quarter" || Math.floor(r[0] / 3) === k) &&
            (g !== "region" || r[1] === k) &&
            (g !== "line" || r[2] === k)
          );
        });
        return {
          grup:
            g === "none"
              ? "total"
              : g === "year"
                ? k
                : g === "quarter"
                  ? `${Y0 + Math.floor(k / 4)}-${tl("T", "Q")}${(k % 4) + 1}`
                  : g === "region"
                    ? NM.R[k]
                    : NM.L[k],
          dosare: o.n,
          severitate_medie_eur: Math.round(o.sev * 1000),
          zile_medii_solutionare: r1(o.days),
          rata_frauda_suspectata: r3(o.frate),
          satisfactie_1_5: r3(o.csat),
          pondere_respinse: r3(o.rej / o.n),
        };
      });
    },
  },
  {
    name: "query_people",
    label_ro: "datele de HR",
    label_en: "HR data",
    description_ro:
      "Indicatori de resurse umane: angajați la final de an, angajări, plecări voluntare și rata lor anuală medie, engagement (0–100), eNPS. Poate grupa pe an, regiune sau departament.",
    description_en:
      "HR indicators: headcount at year end, hires, voluntary leavers and their average annual rate, engagement (0–100), eNPS. Can group by year, region or department.",
    schema: () => ({
      type: "object",
      properties: {
        from: { type: "integer" },
        to: { type: "integer" },
        region: { type: "string" },
        department: {
          type: "string",
          description: tl(
            "Opțional, de exemplu Daune, IT și digital, Relații clienți",
            "Optional, for example Claims, IT & Digital, Customer Service",
          ),
        },
        group_by: { type: "string", enum: ["none", "year", "region", "department"] },
      },
    }),
    execute(i) {
      const R = rng(i);
      const ri = findIdx(i.region, RN()),
        di = findIdx(i.department, DN());
      if (ri === -2 || di === -2)
        throw new Error(
          tl(
            "Valoare necunoscută pentru regiune sau departament.",
            "Unknown value for region or department.",
          ),
        );
      const g = i.group_by || "none";
      const keys =
        g === "year"
          ? YEARS.filter((y) => y >= R.from && y <= R.to)
          : g === "region"
            ? [0, 1, 2, 3]
            : g === "department"
              ? D.D.map((_, k) => k)
              : [null];
      return keys.map((k) => {
        const rr = g === "year" ? { from: k, to: k } : R;
        const pred = (r) =>
          (ri < 0 || r[1] === ri) &&
          (di < 0 || r[2] === di) &&
          (g !== "region" || r[1] === k) &&
          (g !== "department" || r[2] === k);
        const h = hrAggP((z) => inR(z, rr), pred, false),
          e = engP((z) => inR(z, rr), pred, false),
          end = sum(D.hr.filter((r) => r[0] === rr.to && pred(r)).map((r) => r[4]));
        return {
          grup: g === "none" ? "total" : g === "year" ? k : g === "region" ? NM.R[k] : deptN()[k],
          angajati_final: end,
          angajari: h.hi,
          plecari_voluntare: h.vol,
          rata_plecari_voluntare_anuala: r3(h.vr),
          engagement: r1(e.eng),
          enps: r1(e.enps),
        };
      });
    },
  },
  {
    name: "query_finance",
    label_ro: "rezultatele financiare",
    label_en: "financial results",
    description_ro:
      "Rezultatele grupului pe an sau trimestru: profit net, rezultat tehnic, venituri din investiții (milioane EUR), EPS și dividend pe acțiune (EUR), rata de solvabilitate (fracție), prețul acțiunii la final de perioadă.",
    description_en:
      "Group results by year or quarter: net profit, underwriting result, investment income (EUR millions), EPS and dividend per share (EUR), solvency ratio (fraction), share price at period end.",
    schema: () => ({
      type: "object",
      properties: {
        from: { type: "integer" },
        to: { type: "integer" },
        group_by: { type: "string", enum: ["year", "quarter"] },
      },
    }),
    execute(i) {
      const R = rng(i);
      const F = D.fin;
      if (i.group_by === "quarter")
        return F.quarter
          .map((q, k) => ({ q, k }))
          .filter((o) => inR(+o.q.slice(0, 4), R))
          .map(({ q, k }) => ({
            trimestru: q,
            profit_net_mil_eur: r1(F.net_income_eur[k] / 1e6),
            rezultat_tehnic_mil_eur: r1(F.underwriting_result_eur[k] / 1e6),
            venit_investitii_mil_eur: r1(F.investment_income_eur[k] / 1e6),
            eps_eur: F.eps_eur[k],
            solvabilitate: F.solvency_ii_ratio[k],
            pret_actiune_eur: F.share_price_eur_end[k],
          }));
      return YEARS.filter((y) => y >= R.from && y <= R.to).map((y) => {
        const Y = { from: y, to: y };
        return {
          an: y,
          profit_net_mil_eur: r1(finR(Y, "net_income_eur") / 1e6),
          rezultat_tehnic_mil_eur: r1(finR(Y, "underwriting_result_eur") / 1e6),
          venit_investitii_mil_eur: r1(finR(Y, "investment_income_eur") / 1e6),
          eps_eur: r3(finR(Y, "eps_eur")),
          dps_eur: r3(finR(Y, "dps_eur")),
          roe: r3(roeR(Y)),
          solvabilitate_final_an: finR(Y, "solvency_ii_ratio", "last"),
          pret_actiune_final_an: finR(Y, "share_price_eur_end", "last"),
        };
      });
    },
  },
  {
    name: "get_kpis",
    label_ro: "țintele strategice",
    label_en: "strategic targets",
    description_ro:
      "Cei 10 KPI strategici ai companiei pentru un an: țintă, realizat, dacă ținta e atinsă și dacă o valoare mai mică sau mai mare e de dorit.",
    description_en:
      "The company's 10 strategic KPIs for one year: target, actual, whether the target is met and whether a lower or higher value is better.",
    schema: () => ({
      type: "object",
      properties: { year: { type: "integer" } },
      required: ["year"],
    }),
    execute(i) {
      const y = Math.max(Y0, Math.min(2025, +i.year || 2025));
      return Object.keys(KPIN).map((n) => {
        const k = kpi(n, y);
        return {
          kpi: KPIN[n].l,
          tinta: k.t,
          realizat: r3(k.a),
          atinsa: met(k),
          mai_bine_daca: k.dir.startsWith("lower")
            ? tl("mai mic", "lower")
            : tl("mai mare", "higher"),
        };
      });
    },
  },
  {
    name: "glossary",
    label_ro: "glosarul",
    label_en: "the glossary",
    description_ro:
      "Caută un termen în glosarul dashboard-ului și întoarce definiția oficială și formula. Folosește-l când explici un termen tehnic.",
    description_en:
      "Looks up a term in the dashboard glossary and returns the official definition and formula. Use it when explaining a technical term.",
    schema: () => ({
      type: "object",
      properties: { term: { type: "string" } },
      required: ["term"],
    }),
    execute(i) {
      const s = String(i.term || "").toLowerCase();
      const hits = D.gl.filter((g) => (g[0] + " " + g[1]).toLowerCase().includes(s)).slice(0, 3);
      if (!hits.length)
        throw new Error(tl("Termenul nu e în glosar.", "The term is not in the glossary."));
      return hits.map((g) => {
        const v = glShow(GL[g[0]]);
        return { termen: g[0], engleza: g[1], domeniu: v.dom, definitie: v.def, formula: v.f };
      });
    },
  },
].map(bi);
const RULES_RO =
  `Ești analistul de date senior al dashboard-ului InaVale Assurance Group, o companie de asigurări FICTIVĂ (date sintetice, 2021–2025, sume în EUR). ` +
  `Discuți cu cineva care învață analiza de date.
Reguli:
1. Răspunzi DOAR pe baza datelor: contextul ecranului pe care ți-l trimit la fiecare întrebare și rezultatele instrumentelor query_*. ` +
  `Nu folosi cunoștințe generale despre companii reale și nu inventa cifre.
2. ` +
  `Dacă informația lipsește, folosește un instrument. Dacă nici acolo nu există, spune clar că datele nu conțin asta.
3. ` +
  `Când citezi o cifră de pe ecran, numește fereastra din care vine. ` +
  `Când o calculezi cu un instrument, spune asta pe scurt.
4. Explică termenii tehnici simplu, în spiritul glosarului (instrumentul glossary). ` +
  `Nu presupune că utilizatorul îi cunoaște.
5. Distinge între corelație și cauzalitate. ` +
  `Datele sintetice au fost generate cu anumite povești; nu le numi „sintetice” ca explicație, ci analizează-le ca pe date reale, menționând la nevoie că firma e fictivă.
6. ` +
  `Fii concis: de regulă 80–200 de cuvinte, paragrafe scurte, eventual o listă scurtă cu liniuță. ` +
  `Fără tabele, fără titluri. Scrie numerele în format românesc (virgulă zecimală).
7. ` +
  `Răspunde în limba în care ți se scrie (implicit română). Când e util, sugerează la final un singur pas următor: alt ecran, layer sau filtru de încercat.`;
const RULES_EN =
  `You are the senior data analyst of the InaVale Assurance Group dashboard, a FICTIONAL insurance company (synthetic data, 2021–2025, amounts in EUR). ` +
  `You are talking to someone who is learning data analysis.
Rules:
1. ` +
  `Answer ONLY from the data: the screen context I send with every question and the results of the query_* tools. ` +
  `Do not use general knowledge about real companies and do not make up figures.
2. ` +
  `If information is missing, use a tool. If it is not there either, say clearly that the data does not contain it.
3. ` +
  `When you quote a figure from the screen, name the window it comes from. ` +
  `When you calculate it with a tool, say so briefly.
4. Explain technical terms simply, in the spirit of the glossary (the glossary tool). ` +
  `Do not assume the user knows them.
5. Distinguish correlation from causation. ` +
  `The synthetic data was generated with certain storylines; do not use “synthetic” as an explanation, but analyse it like real data, mentioning where needed that the company is fictional.
6. ` +
  `Be concise: usually 80–200 words, short paragraphs, possibly a short bulleted list. ` +
  `No tables, no headings. Write numbers in English format (decimal point).
7. ` +
  `Reply in the language you are written to (English by default). ` +
  `Where useful, end by suggesting a single next step: another screen, layer or filter to try.`;
const rules = () => tl(RULES_RO, RULES_EN);

/* ---------- chat: UI ---------- */
const msgs = document.getElementById("msgs"),
  sugg = document.getElementById("sugg"),
  form = document.getElementById("chatForm"),
  inp = document.getElementById("chatIn"),
  sendB = document.getElementById("chatSend");
let pvN = 0,
  sample = null,
  sampleReady = false,
  previewMode = false,
  turns = [],
  busy = null;
function md(t) {
  const e = esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const out = [];
  let ul = false;
  e.split(/\n/).forEach((l) => {
    const m = l.match(/^\s*[-•*]\s+(.*)/);
    if (m) {
      if (!ul) {
        out.push("<ul>");
        ul = true;
      }
      out.push(`<li>${m[1]}</li>`);
    } else {
      if (ul) {
        out.push("</ul>");
        ul = false;
      }
      if (l.trim()) out.push(`<p>${l}</p>`);
    }
  });
  if (ul) out.push("</ul>");
  return out.join("");
}
function addMsg(cls, html) {
  const d = document.createElement("div");
  d.className = "m " + cls;
  d.innerHTML = html;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
  return d;
}
const previewMsg = () =>
  tl(
    `<p><b>Asistentul AI nu este activ în această versiune publică.</b></p>` +
      `<p>El funcționează în versiunea găzduită în claude.ai, unde răspunde doar din datele InaVale: vede cifrele de pe ecran și poate calcula singur altele din setul complet. ` +
      `Poate fi demonstrat live, la cerere.</p><p style="color:var(--ink-3);font-size:12px">Întrebările sugerate arată ce tip de analize poate face asistentul pe fiecare ecran.</p>`,
    `<p><b>The AI assistant is not active in this public version.</b></p>` +
      `<p>It works in the version hosted on claude.ai, where it answers only from InaVale’s data: it sees the figures on screen and can calculate others from the full dataset on its own. ` +
      `It can be demonstrated live on request.</p><p style="color:var(--ink-3);font-size:12px">The suggested questions show the kind of analysis the assistant can do on each screen.</p>`,
  );
function intro() {
  msgs.innerHTML = "";
  if (previewMode) {
    addMsg(
      "sys",
      tl(
        `<p>Aici poți discuta cu un asistent AI despre ce vezi pe ecran.</p>` +
          `<p style="color:var(--ink-3);font-size:12px">Versiune publică: asistentul e disponibil doar în versiunea din claude.ai. ` +
          `Întrebările de mai jos arată ce poate face pe acest ecran.</p>`,
        `<p>Here you can talk to an AI assistant about what you see on screen.</p>` +
          `<p style="color:var(--ink-3);font-size:12px">Public version: the assistant is available only in the claude.ai version. ` +
          `The questions below show what it can do on this screen.</p>`,
      ),
    );
    return;
  }
  addMsg(
    "sys",
    tl(
      `<p>Pot răspunde la întrebări despre ce vezi pe ecran și pot calcula singur alte cifre din setul complet InaVale. ` +
        `Răspunsurile vin doar din aceste date.</p><p style="color:var(--ink-3);font-size:12px">Întrebările se consumă din limita contului tău Claude. ` +
        `La prima întrebare, claude.ai îți cere acordul.</p>`,
      `<p>I can answer questions about what you see on screen and calculate other figures from the full InaVale dataset on my own. ` +
        `The answers come only from this data.</p><p style="color:var(--ink-3);font-size:12px">Questions count towards your Claude account’s usage limit. ` +
        `On your first question, claude.ai asks for your permission.</p>`,
    ),
  );
}
function updChat() {
  document.getElementById("chatCtx").textContent =
    S.dom === "dat"
      ? tl("Vede: Despre date", "Sees: About the data")
      : `${tl("Vede", "Sees")}: ${dom().n} › ${LAYERS[S.layer - 1].n}${S.layer <= 2 ? ` · ${P().lab}${CP() ? " vs " + CP().lab : ""}` : tl(" · orizont 2026", " · horizon 2026")}`;
  const list = suggFor(curKey);
  sugg.innerHTML =
    busy || !(sampleReady || previewMode)
      ? ""
      : list.map((s) => `<button type="button">${esc(s)}</button>`).join("");
}
sugg.onclick = (e) => {
  const b = e.target.closest("button");
  if (b) ask(b.textContent);
};
form.onsubmit = (e) => {
  e.preventDefault();
  if (busy) {
    busy.abort();
    return;
  }
  const v = inp.value.trim();
  if (!v) return;
  inp.value = "";
  autoH();
  ask(v);
};
inp.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});
const autoH = () => {
  inp.style.height = "auto";
  inp.style.height = Math.min(140, inp.scrollHeight) + "px";
};
inp.addEventListener("input", autoH);
document.getElementById("chatClear").onclick = () => {
  if (busy) busy.abort();
  turns = [];
  intro();
  updChat();
};
function explainWin(title) {
  const el = [...document.querySelectorAll("#main section.w")].find(
    (w) => w.dataset.title === title,
  );
  openSheetFor(el);
  ask(
    tl(
      `Explică-mi fereastra „${title}”: ce arată, ce e important de observat și ce ar trebui urmărit mai departe.`,
      `Explain the “${title}” window to me: what it shows, what is important to notice and what should be followed up.`,
    ),
  );
}
const ERR = {
  not_granted: [
    "Chat-ul nu are acordul de a folosi Claude în această pagină. Poți reîncărca pagina ca să fii întrebat din nou.",
    "The chat does not have permission to use Claude on this page. You can reload the page to be asked again.",
  ],
  sampling_disabled: [
    "Claude nu e disponibil pentru acest cont.",
    "Claude is not available for this account.",
  ],
  capability_disabled: [
    "Chat-ul nu poate rula în această vizualizare.",
    "The chat cannot run in this view.",
  ],
  not_declared: [
    "Chat-ul nu e activat pentru această pagină.",
    "The chat is not enabled for this page.",
  ],
  rate_limited: [
    "Prea multe întrebări într-un timp scurt sau limita contului a fost atinsă. Încearcă peste câteva minute.",
    "Too many questions in a short time, or the account limit has been reached. Try again in a few minutes.",
  ],
  session_expired: [
    "Sesiunea a expirat. Autentifică-te din nou în claude.ai.",
    "The session has expired. Sign in to claude.ai again.",
  ],
  prompt_too_large: [
    "Conversația a devenit prea lungă. Apasă „Golește” și reia întrebarea.",
    "The conversation has become too long. Press “Clear” and ask again.",
  ],
  refused: [
    "Claude nu a putut răspunde la această formulare. Încearcă altfel.",
    "Claude could not answer this wording. Try phrasing it differently.",
  ],
  empty_completion: [
    "Nu a venit niciun răspuns. Reformulează întrebarea, mai simplu.",
    "No answer came back. Rephrase the question more simply.",
  ],
  tools_unavailable: [
    "Instrumentele de date nu merg în această vizualizare; întreabă doar despre ce e pe ecran.",
    "The data tools do not work in this view; ask only about what is on screen.",
  ],
  upstream_error: [
    "Conexiunea s-a întrerupt. Încearcă din nou.",
    "The connection was interrupted. Try again.",
  ],
};
const errTxt = (code) => {
  const e = ERR[code] || ERR.upstream_error;
  return tl(e[0], e[1]);
};
async function ask(q) {
  if (previewMode) {
    addMsg("u", esc(q));
    addMsg(
      "sys",
      pvN++
        ? `<p style="color:var(--ink-2)">${tl("Asistentul AI nu este activ în versiunea publică; poate fi demonstrat live, în versiunea din claude.ai.", "The AI assistant is not active in the public version; it can be demonstrated live in the claude.ai version.")}</p>`
        : previewMsg(),
    );
    return;
  }
  if (!sampleReady) {
    addMsg(
      "err",
      tl(
        "Chat-ul se pregătește. Încearcă din nou în câteva secunde.",
        "The chat is getting ready. Try again in a few seconds.",
      ),
    );
    return;
  }
  if (busy) return;
  addMsg("u", esc(q));
  const a = addMsg(
    "a",
    `<p style="color:var(--ink-3)">${tl("Mă gândesc… poate dura până la un minut când caut în date.", "Thinking… this can take up to a minute when I search the data.")}</p>`,
  );
  const st = document.createElement("div");
  st.className = "st";
  a.after(st);
  const ctx = screenContext();
  turns.push({ role: "user", content: q });
  while (turns.length > 12) turns.splice(0, 2);
  const input = [{ role: "user", content: rules() }].concat(turns.slice(0, -1)).concat([
    {
      role: "user",
      content: tl(
        `Contextul ecranului în momentul întrebării:\n${ctx}\n\nÎntrebarea: ${q}`,
        `Screen context at the time of the question:\n${ctx}\n\nQuestion: ${q}`,
      ),
    },
  ]);
  busy = new AbortController();
  sendB.textContent = tl("Oprește", "Stop");
  sendB.classList.add("stop");
  updChat();
  const tools = useTools
    ? TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.schema(),
        execute: (i) => {
          st.textContent = `${tl("Caut în date", "Searching the data")}: ${t.label}…`;
          return t.execute(i || {});
        },
      }))
    : undefined;
  try {
    const r = await sample(input, {
      cache: false,
      signal: busy.signal,
      tools,
      onText: ({ text }) => {
        a.innerHTML = md(text);
        st.textContent = "";
        msgs.scrollTop = msgs.scrollHeight;
      },
    });
    a.innerHTML = md(r.text);
    turns.push({ role: "assistant", content: r.text });
    st.textContent = r.truncated
      ? tl(
          "Răspunsul a fost scurtat; cere mai puțin deodată.",
          "The answer was cut short; ask for less at once.",
        )
      : "";
  } catch (e) {
    const code = e && e.code;
    if (e && e.text && code !== "refused") {
      a.innerHTML = md(e.text);
    } else a.remove();
    if (code === "cancelled") {
      st.textContent = tl("Oprit.", "Stopped.");
    } else {
      st.remove();
      addMsg("err", esc(errTxt(code)));
    }
    if (
      ["not_granted", "sampling_disabled", "capability_disabled", "not_declared"].includes(code)
    ) {
      sampleReady = false;
      inp.disabled = true;
    }
    turns.pop();
  } finally {
    busy = null;
    sendB.textContent = tl("Trimite", "Send");
    sendB.classList.remove("stop");
    updChat();
  }
}
/* on a language switch: an empty chat shows the new intro; an ongoing conversation keeps its messages */
function refreshChatLang() {
  if (!turns.length && !busy) intro();
  if (!busy) sendB.textContent = tl("Trimite", "Send");
  updChat();
}
let useTools = true;
intro();
sendB.textContent = tl("Trimite", "Send");
const goPreview = () => {
  previewMode = true;
  intro();
  updChat();
};
if (!(window.claude && window.claude.use)) goPreview();
(async () => {
  if (previewMode) return;
  try {
    sample = await window.claude.use("sample");
  } catch (e) {
    sample = null;
  }
  if (!sample) {
    goPreview();
    return;
  }
  try {
    const lim = await sample.limits();
    useTools = !!(lim && lim.tools);
  } catch (e) {
    useTools = false;
  }
  sampleReady = true;
  updChat();
})();

/* ---------- mobile tip ---------- */
const mtip = document.getElementById("mtip");
let tipShownAt = null;
(() => {
  let dismissed = false;
  try {
    dismissed = localStorage.getItem("nv-mtip") === "1";
  } catch (e) {}
  if (!dismissed && matchMedia("(max-width:760px)").matches) {
    mtip.hidden = false;
    tipShownAt = "first";
  }
})();
function hideTip(remember) {
  mtip.hidden = true;
  if (remember) {
    try {
      localStorage.setItem("nv-mtip", "1");
    } catch (e) {}
  }
}
/* the tip is only for narrow screens: if the page becomes wider (for example a panel opened full screen), it goes away without being remembered as closed */
matchMedia("(min-width:761px)").addEventListener("change", (e) => {
  if (e.matches && !mtip.hidden) {
    hideTip(false);
    tipShownAt = null;
  }
});
document.getElementById("mtipX").onclick = () => hideTip(true);
document.getElementById("mtipShare").onclick = async () => {
  const url =
    window.claude && window.claude.use
      ? "https://claude.ai/artifact/TbdNWQe9n9BxHKxBDL2YgM"
      : location.href.split("#")[0];
  const msg = document.getElementById("mtipMsg");
  try {
    if (navigator.share) {
      await navigator.share({
        title: tl("InaVale – dashboard de analiză", "InaVale – analytics dashboard"),
        text: tl(
          "Dashboard de analiză InaVale, de deschis pe laptop sau desktop",
          "InaVale analytics dashboard, best opened on a laptop or desktop",
        ),
        url,
      });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return;
  }
  try {
    await navigator.clipboard.writeText(url);
    msg.textContent = tl(
      "Linkul a fost copiat. Trimite-l pe email sau pe chat.",
      "The link has been copied. Send it by email or chat.",
    );
    return;
  } catch (e) {}
  msg.textContent = url;
};
function boot() {
  if (!window.Chart) {
    setTimeout(boot, 60);
    return;
  }
  render();
}
boot();
