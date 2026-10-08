"""Automated tests for the dashboard (Playwright + Chromium), run once in Romanian and once in English.
Install: pip install playwright && python -m playwright install chromium
Run:     python3 tests/run_tests.py            (tests index.html in the project root)
         python3 tests/run_tests.py ro         (one language only: ro or en)
Checks, in each language:
 - all 25 screens load without JS errors;
 - layout at 7 desktop widths and on 5 mobile devices (no horizontal scrolling, windows/charts not too narrow,
   figures not cut off on the cards, header not too tall);
 - the chat in claude.ai (simulated, with the data tools) and in public mode.
And additionally:
 - language choice: browser language on the first visit, the RO | EN switch, the choice kept after reload;
 - the tip on phones: shown on narrow screens, hidden automatically when the page becomes wider;
 - the domain menu on phones: the arrows and edge fades appear only on the side where the menu continues,
   the arrow scrolls the menu and the active domain stays fully visible;
 - no Romanian text left in the English interface (the letters ă â î ș ț and the „ quote) on every screen,
   with the notes and glossaries opened, the scenario sliders moved, the general glossary, the data dictionary,
   the chart legends, axes and tooltips, the term pop-ups, the chat and the aria-labels.
"""

import asyncio, os, sys, re
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "file://" + os.path.join(ROOT, "index.html")
SCREENS = [
    (d, l) for d in ["sin", "bus", "dau", "oam", "fin", "seg"] for l in [1, 2, 3, 4]
] + [("dat", 1)]
LANGS = [a for a in sys.argv[1:] if a in ("ro", "en")] or ["ro", "en"]
CHECK = """()=>{ const iss=[]; const de=document.documentElement;
 if(de.scrollWidth>de.clientWidth+1) iss.push('horizontal scrolling');
 const narrow=innerWidth<800;
 document.querySelectorAll('#main section.w').forEach(w=>{ const r=w.getBoundingClientRect(); if(!narrow&&r.width<300) iss.push('narrow window: '+w.dataset.title);
   const c=w.querySelector('canvas'); if(c&&c.clientWidth<(narrow?200:260)) iss.push('narrow chart: '+w.dataset.title); });
 document.querySelectorAll('#main .card .v').forEach(v=>{ if(v.scrollWidth>v.clientWidth+2) iss.push('figure cut off: '+v.innerText); });
 const hh=document.querySelector('header.top').offsetHeight; if(!narrow&&hh>170) iss.push('header too tall '+hh);
 return iss; }"""
MOCK = """(()=>{ const f=async(input,opts)=>{ let out=''; if(opts.tools){ for(const [n,a] of [['query_business',{from:2023,to:2023,region:'America Latină',line:'Auto'}],['query_business',{from:2023,to:2023,region:'Latin America',line:'Motor',channel:'Direct online'}],['query_people',{from:2023,to:2023,region:'Europa',department:'Daune',group_by:'year'}],['query_people',{from:2023,to:2023,region:'Europe',department:'Claims'}],['query_claims',{from:2024,to:2024,group_by:'quarter'}],['query_finance',{from:2024,to:2024}],['get_kpis',{year:2025}],['glossary',{term:'combined'}]]){ const t=opts.tools.find(x=>x.name===n); out+=JSON.stringify(await t.execute(a,{signal:new AbortController().signal})).slice(0,80)+'\\\\n'; } }
 window.__rules=input[0].content; const txt='Test answer.\\\\n'+out; opts.onText&&opts.onText({text:txt,delta:txt}); return {text:txt,truncated:false,modelTierApplied:'default'}; };
 f.limits=async()=>({maxPromptBytes:262144,tools:{maxCount:10}}); window.claude={use:async n=>n==='sample'?f:null}; })();"""
# English interface: Romanian letters and the Romanian opening quote must not appear
RO_CHARS = re.compile("[ăâîșțşţĂÂÎȘȚŞŢ„]")
ALLOWED = {
    "Română"
}  # the name of the language on the RO button (aria-label, marked lang="ro")
COLLECT = """()=>{ const out=[]; const add=(w,t)=>{ if(t!=null&&String(t).trim()) out.push([w,String(t)]); };
 document.querySelectorAll('#main details').forEach(d=>d.open=true);
 add('screen',document.getElementById('main').innerText); add('filters',document.getElementById('filters').innerText+'\\n'+document.getElementById('fbtn').innerText);
 add('header',document.querySelector('header.top').innerText); add('footer',document.querySelector('footer').innerText); add('mobile tip',document.getElementById('mtip').innerText);
 add('chat',document.getElementById('chat').innerText); add('title',document.title);
 document.querySelectorAll('[aria-label]').forEach(e=>add('aria-label',e.getAttribute('aria-label'))); document.querySelectorAll('[placeholder]').forEach(e=>add('placeholder',e.getAttribute('placeholder')));
 document.querySelectorAll('#main select option').forEach(o=>add('option',o.textContent));
 charts.forEach(c=>{ add('chart labels',(c.data.labels||[]).join(' | ')); c.data.datasets.forEach(d=>add('chart series',d.label||'')); const sc=c.options.scales||{}; for(const k in sc){ const t=sc[k].title; if(t&&t.text) add('axis',t.text); }
  const cb=((c.options.plugins||{}).tooltip||{}).callbacks||{}; c.data.datasets.forEach((ds,di)=>ds.data.slice(0,4).forEach((v,i)=>{ try{ if(cb.label) add('tooltip',cb.label({raw:v,dataset:ds,label:(c.data.labels||[])[i],dataIndex:i,datasetIndex:di,parsed:{},chart:c})); }catch(e){} }));
  try{ if(cb.footer) add('tooltip',cb.footer([{raw:c.data.datasets[0].data[0],dataIndex:0}])); }catch(e){} });
 document.querySelectorAll('#main .q').forEach((b,i)=>{ if(i<40){ showPop(b); add('term pop-up',document.getElementById('pop').innerText); } }); hidePop();
 return out; }"""


async def screens(pg):
    bad = set()
    for d, l in SCREENS:
        await pg.evaluate(f"S.dom='{d}'; S.layer={l}; render()")
        await pg.wait_for_timeout(200)
        for i in await pg.evaluate(CHECK):
            bad.add(f"{d}{l}: {i}")
    return bad


async def new_page(b, lang, **kw):
    ctx = await b.new_context(locale="ro-RO" if lang == "ro" else "en-GB", **kw)
    await ctx.add_init_script(
        f"try{{localStorage.setItem('nv-lang','{lang}')}}catch(e){{}}"
    )
    pg = await ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    return ctx, pg, errs


async def layout_and_chat(b, lang):
    fails = 0
    for W in [1280, 1366, 1440, 1536, 1680, 1920, 2560]:
        for chat in (True, False):
            ctx, pg, errs = await new_page(
                b, lang, viewport={"width": W, "height": 900}
            )
            await pg.goto(URL)
            await pg.wait_for_timeout(500)
            if not chat:
                await pg.click("#chatBtn")
            bad = await screens(pg)
            bad |= {"JS error: " + e for e in errs}
            print(
                f"[{lang}] desktop {W}px chat={'on' if chat else 'off'}: {'OK' if not bad else bad}"
            )
            fails += bool(bad)
            await ctx.close()
    for name, W, H in [
        ("iPhone SE", 375, 667),
        ("iPhone 14", 390, 844),
        ("Android", 412, 915),
        ("iPad portrait", 768, 1024),
        ("iPad landscape", 1024, 768),
    ]:
        ctx, pg, errs = await new_page(
            b,
            lang,
            viewport={"width": W, "height": H},
            is_mobile=W < 800,
            has_touch=True,
        )
        await pg.goto(URL)
        await pg.wait_for_timeout(500)
        bad = await screens(pg)
        bad |= {"JS error: " + e for e in errs}
        print(f"[{lang}] mobile {name}: {'OK' if not bad else bad}")
        fails += bool(bad)
        await ctx.close()
    # chat in claude.ai (simulated), with the data tools (names accepted in both languages)
    ctx, pg, errs = await new_page(b, lang, viewport={"width": 1500, "height": 900})
    await pg.add_init_script(MOCK)
    await pg.goto(URL)
    await pg.wait_for_timeout(600)
    await pg.click(".sugg button")
    await pg.wait_for_timeout(600)
    t = await pg.evaluate("document.getElementById('msgs').innerText")
    rules = await pg.evaluate("window.__rules||''")
    ok = (
        "Test answer" in t
        and "Error" not in t
        and (
            ("Ești analistul" in rules)
            if lang == "ro"
            else ("You are the senior data analyst" in rules)
        )
        and not errs
    )
    print(
        f"[{lang}] chat claude.ai (simulated), with data tools:",
        "OK" if ok else (t[:300], errs),
    )
    fails += not ok
    await ctx.close()
    # chat in public mode
    ctx, pg, errs = await new_page(b, lang, viewport={"width": 1500, "height": 900})
    await pg.goto(URL)
    await pg.wait_for_timeout(500)
    await pg.click(".sugg button")
    await pg.wait_for_timeout(200)
    t = await pg.evaluate("document.getElementById('msgs').innerText")
    ok = ("nu este activ" in t) if lang == "ro" else ("is not active" in t)
    print(f"[{lang}] chat public mode:", "OK" if ok else t[:200])
    fails += not ok
    await ctx.close()
    return fails


async def language_choice(b):
    fails = 0
    for loc, exp in [("ro-RO", "ro"), ("en-US", "en"), ("de-DE", "en"), ("ro", "ro")]:
        ctx = await b.new_context(locale=loc)
        pg = await ctx.new_page()
        await pg.goto(URL)
        await pg.wait_for_timeout(400)
        got = await pg.evaluate("[LANG,document.documentElement.lang]")
        ok = got == [exp, exp]
        print(f"language on first visit, browser {loc}: {'OK' if ok else got}")
        fails += not ok
        await ctx.close()
    ctx = await b.new_context(locale="en-US", viewport={"width": 1500, "height": 900})
    pg = await ctx.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto(URL)
    await pg.wait_for_timeout(400)
    await pg.evaluate("S.dom='bus';S.layer=2;S.region=3;render()")
    await pg.click("#langsw button[data-lang='ro']")
    await pg.wait_for_timeout(300)
    st = await pg.evaluate(
        "[LANG,localStorage.getItem('nv-lang'),document.documentElement.lang,document.title,S.dom,S.layer,S.region,document.querySelector('#main h1').innerText,document.querySelector('#langsw [aria-pressed=\"true\"]').dataset.lang]"
    )
    ok = (
        st[:3] == ["ro", "ro", "ro"]
        and "analiză" in st[3]
        and st[4:7] == ["bus", 2, 3]
        and st[7].startswith("De ce")
        and st[8] == "ro"
    )
    print("RO | EN switch (state kept, page updated):", "OK" if ok else st)
    fails += not ok
    await pg.reload()
    await pg.wait_for_timeout(400)
    lang = await pg.evaluate("LANG")
    ok = lang == "ro" and not errs
    print("choice kept after reload:", "OK" if ok else (lang, errs))
    fails += not ok
    await ctx.close()
    return fails


async def mobile_menu(b):
    fails = 0
    for lang in LANGS:
        ctx, pg, errs = await new_page(
            b,
            lang,
            viewport={"width": 390, "height": 800},
            is_mobile=True,
            has_touch=True,
        )
        await pg.goto(URL)
        await pg.wait_for_timeout(500)
        start = await pg.evaluate("navWrap.className")
        await pg.click("#navNext")
        await pg.wait_for_timeout(700)
        moved = await pg.evaluate("navEl.scrollLeft>0")
        vis = []
        for d in ["sin", "bus", "dau", "oam", "fin", "seg", "dat"]:
            await pg.evaluate(f"S.dom='{d}';render()")
            await pg.wait_for_timeout(700)
            vis.append(
                await pg.evaluate(
                    """(()=>{ const b=document.querySelector('#domains button[aria-current="true"]').getBoundingClientRect(), n=navEl.getBoundingClientRect();
              const l=navWrap.classList.contains('l')?32:0, r=navWrap.classList.contains('r')?32:0; return b.left>=n.left+l-1 && b.right<=n.right-r+1; })()"""
                )
            )
        end = await pg.evaluate("navWrap.className")
        ok = (
            ("r" in start.split() and "l" not in start.split())
            and moved
            and all(vis)
            and ("l" in end.split() and "r" not in end.split())
            and not errs
        )
        print(
            f"[{lang}] mobile domain menu (arrows, fades, active domain visible):",
            "OK" if ok else (start, moved, vis, end, errs),
        )
        fails += not ok
        await ctx.close()
        ctx, pg, errs = await new_page(b, lang, viewport={"width": 1440, "height": 900})
        await pg.goto(URL)
        await pg.wait_for_timeout(400)
        ok = await pg.evaluate(
            "getComputedStyle(document.getElementById('navNext')).display==='none'&&getComputedStyle(document.getElementById('navPrev')).display==='none'"
        )
        print(
            f"[{lang}] desktop domain menu without arrows:",
            "OK" if ok else "arrows visible",
        )
        fails += not ok
        await ctx.close()
    return fails


async def mobile_tip(b):
    fails = 0
    for lang in LANGS:
        ctx, pg, errs = await new_page(
            b,
            lang,
            viewport={"width": 400, "height": 800},
            is_mobile=True,
            has_touch=True,
        )
        await pg.goto(URL)
        await pg.wait_for_timeout(500)
        shown = await pg.evaluate("!mtip.hidden")
        txt = await pg.evaluate("mtip.innerText")
        await pg.set_viewport_size({"width": 1400, "height": 900})
        await pg.wait_for_timeout(300)
        gone = await pg.evaluate("mtip.hidden")
        remembered = await pg.evaluate("localStorage.getItem('nv-mtip')")
        word = "coleg" if lang == "ro" else "colleague"
        ok = shown and word in txt and gone and remembered is None and not errs
        print(
            f"[{lang}] mobile tip (shown on a phone, hidden when the page gets wider):",
            "OK" if ok else (shown, txt[:80], gone, remembered, errs),
        )
        fails += not ok
        await ctx.close()
    return fails


async def no_romanian_in_english(b):
    ctx, pg, errs = await new_page(b, "en", viewport={"width": 1500, "height": 900})
    await pg.goto(URL)
    await pg.wait_for_timeout(600)
    hits = {}

    def scan(where, items):
        for w, t in items:
            for line in t.split("\n"):
                s = line.strip()
                if s and s not in ALLOWED and RO_CHARS.search(s):
                    hits.setdefault(f"{where} [{w}]", set()).add(s[:140])

    for d, l in SCREENS:
        for dim in (["region", "line", "channel"] if d == "seg" else [None]):
            await pg.evaluate(
                f"S.dom='{d}';S.layer={l};noteOpen=true;"
                + (f"S.segDim='{dim}';" if dim else "")
                + "render()"
            )
            await pg.wait_for_timeout(250)
            key = f"{d}{l}" + (f"/{dim}" if dim else "")
            scan(key, await pg.evaluate(COLLECT))
            if (
                l == 4
            ):  # move every slider to both ends, so that all branches of the scenario notes are shown
                for pos in ("min", "max"):
                    await pg.evaluate(
                        "document.querySelectorAll('#main input[type=range]').forEach(x=>{x.value=x.%s; x.dispatchEvent(new Event('input',{bubbles:true}));})"
                        % pos
                    )
                    await pg.wait_for_timeout(150)
                    scan(f"{key} sliders {pos}", await pg.evaluate(COLLECT))
                await pg.evaluate(
                    "document.querySelectorAll('#main select[data-sc]').forEach(x=>{x.selectedIndex=x.options.length-1; x.dispatchEvent(new Event('input',{bubbles:true}));})"
                )
                await pg.wait_for_timeout(150)
                scan(f"{key} selects", await pg.evaluate(COLLECT))
        if d != "dat" and l == 2:  # "why" screens without a comparison period
            await pg.evaluate(f"S.cmp='none';S.dom='{d}';S.layer=2;render()")
            await pg.wait_for_timeout(150)
            scan(f"{d}2 no comparison", await pg.evaluate(COLLECT))
            await pg.evaluate("S.cmp='prev'")
    await pg.evaluate("S.from=2022;S.to=2025;S.dom='sin';S.layer=1;render()")
    await pg.wait_for_timeout(200)
    scan("sin1 2022–2025", await pg.evaluate(COLLECT))
    await pg.evaluate("S.from=2025;S.to=2025;openDrawer()")
    await pg.wait_for_timeout(200)
    scan(
        "general glossary",
        [("list", await pg.evaluate("document.getElementById('drawer').innerText"))],
    )
    n = await pg.evaluate("document.querySelectorAll('#glist .term').length")
    await pg.fill("#gsearch", "loss ratio")
    await pg.wait_for_timeout(150)
    found = await pg.evaluate("document.querySelectorAll('#glist .term').length")
    await pg.evaluate("closeDrawer();S.dom='dat';render()")
    await pg.wait_for_timeout(300)
    rows = await pg.evaluate("document.querySelectorAll('#dbody tr').length")
    scan(
        "data dictionary",
        [("table", await pg.evaluate("document.getElementById('dbody').innerText"))],
    )
    await ctx.close()
    for k, v in hits.items():
        print("  Romanian text left:", k, "→", list(v)[:3])
    ok = not hits and not errs and n == 89 and found > 0 and rows == 117
    print(
        f"[en] no Romanian text in the English interface (glossary {n} terms, search 'loss ratio' {found} hits, dictionary {rows} columns):",
        "OK" if ok else f"{len(hits)} places, errors {errs[:2]}",
    )
    return int(not ok)


async def main():
    fails = 0
    async with async_playwright() as p:
        b = await p.chromium.launch()
        fails += await language_choice(b)
        fails += await mobile_menu(b)
        fails += await mobile_tip(b)
        for lang in LANGS:
            fails += await layout_and_chat(b, lang)
        if "en" in LANGS:
            fails += await no_romanian_in_english(b)
        await b.close()
    print("\nRESULT:", "all tests passed" if not fails else f"{fails} tests failed")
    sys.exit(1 if fails else 0)


asyncio.run(main())
