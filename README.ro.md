# InaVale Assurance – dashboard de analiză pe mai multe niveluri

**Română** · [English](README.md)

Un dashboard interactiv pentru un grup de asigurări fictiv, construit ca exercițiu de analiză a datelor: de la „ce s-a întâmplat” până la „ce facem”.

**[Deschide dashboard-ul](https://ina1311.github.io/inavale-dashboard/)** · rulează direct în browser, fără instalare

![Captură a dashboard-ului](captura.png)

---

## De ce acest proiect

Am vrut să răspund la o întrebare practică: cum ar arăta un instrument de analiză pe care l-ar folosi, zi de zi, oamenii dintr-o companie de asigurări? Nu un raport static, ci un instrument în care fiecare cifră are context (față de ce e mare sau mică?), fiecare termen tehnic are o explicație și fiecare grafic are o concluzie scrisă.

Am ales asigurările pentru că sunt un domeniu cu indicatori specifici și exigenți (combined ratio, rata daunei, solvabilitate) și cu „povești” care se văd doar dacă legi între ele date din zone diferite ale companiei.

## Ce conține

Dashboard-ul are **6 domenii** și **4 niveluri de profunzime**, adică 24 de ecrane de analiză, plus un ecran care descrie datele.

| Domeniu | Ce analizează |
| --- | --- |
| Sinteză | Cei 10 KPI strategici față de ținte |
| Business și produse | Prime, polițe, canale, buget, efect valutar |
| Daune | Rata daunei, catastrofe, timp de soluționare, fraudă |
| Oameni | Angajați, plecări, recrutare, engagement, echitate salarială |
| Financiar și investitori | Profit, ROE, dividende, solvabilitate, investiții |
| Segmente | Regiuni, linii de business și canale comparate între ele |
| Despre date | Tabelele, legăturile dintre ele, formulele, limitele datelor |

Cele 4 niveluri urmează maturitatea analizei de date:

1. **Ce s-a întâmplat** (descriptiv): indicatori, evoluții, comparații.
2. **De ce** (diagnostic): abateri, hărți termice, cauze, analiză de mix.
3. **Ce urmează** (predictiv): prognoze pentru 2026, cu interval de incertitudine.
4. **Ce facem** (scenarii): simulatoare cu ipoteze vizibile, pe care utilizatorul le poate modifica.

## Datele

### De ce date sintetice

Datele interne ale unei companii de asigurări (daune, salarii, rezultate pe produs) nu sunt publice, iar seturile publice disponibile descriu fragmente din companii diferite. Pentru ca analizele să se lege între ele, adică plecările din echipa de daune să se vadă în timpul de soluționare și apoi în satisfacția clienților, am avut nevoie de **date coerente ale aceleiași companii**. De aceea am construit un set de date sintetic, realist, pentru o companie fictivă.

InaVale Assurance Group nu există. Nicio cifră nu descrie o persoană sau o companie reală.

### Ce conține setul

- **11 tabele**, **59.335 de rânduri**, **117 coloane documentate**
- perioada **2021–2025** (60 de luni), **11 țări** în 4 regiuni, **5 linii de business**, **4 canale de vânzare**, **11 departamente**
- sume în EUR, cu valorile în moneda locală convertite la cursul lunar

| Tabel | Un rând înseamnă | Rânduri |
| --- | --- | ---: |
| Activitate_lunara | lună × țară × linie × canal | 12.060 |
| Daune | un dosar (eșantion) | 25.000 |
| Angajati | un angajat | 19.232 |
| Recrutare | trimestru × departament × regiune | 842 |
| Buget | lună × regiune × linie | 1.200 |
| Sondaje_angajati | an × departament × regiune | 220 |
| Rezultate_grup | trimestru | 20 |
| Investitii | trimestru × clasă de active | 100 |
| Tinte_strategice | an × indicator | 50 |
| Cursuri_valutare | lună × monedă | 600 |
| Tari | o țară | 11 |

### Modelul de date

Tabelele sunt organizate ca o **schemă stea**: tabele de fapte (evenimente măsurabile) legate prin cinci dimensiuni comune: timp, geografie, produs, canal și departament. În dashboard, o „matrice de legături” arată ce tabele se pot combina și pe ce dimensiuni.

Setul complet, cu un dicționar al tuturor coloanelor și un glosar, se află în `data/InaVale_Assurance_date.xlsx`. Aceleași tabele sunt și în format CSV, în `data/csv/`, ca să poată fi răsfoite direct pe GitHub.

### Generarea și verificarea datelor

Datele au fost generate în Python (pandas, NumPy), cu scripturile din `scripts/`, pe baza unor reguli care imită comportamentul unui asigurător real: sezonalitatea reînnoirilor, inflația daunelor din 2022–2023, costuri de achiziție diferite pe canale, evenimente catastrofale, o populație de angajați simulată lună de lună, cu angajări și plecări.

Pentru că datele sunt generate, **nu au trecut printr-o etapă de curățare**, cum ar trebui să treacă datele reale. În schimb, am făcut verificări de consistență:

- indicatorii din tabelul de ținte (realizatul) sunt calculați din celelalte tabele, nu introduși separat;
- angajările din tabelul de recrutare corespund exact cu angajările din tabelul de angajați;
- valorile rezultate au fost verificate pentru plauzibilitate: combined ratio anual între 87% și 98%, solvabilitate între 155% și 225%, rate de plecare între 13% și 16%;
- limitele datelor sunt documentate explicit (eșantionul de daune, salariile disponibile doar pentru 2025, canale care nu există în anumite țări);
- generarea e **reproductibilă**: scripturile folosesc valori fixe pentru generatorul de numere aleatoare, deci rularea lor produce exact aceleași date.

## Metode analitice

**Agregarea pe perioade.** Indicatorii se agregă diferit, după tipul lor:
- *fluxurile* (prime, daune, profit) se adună;
- *stocurile* (angajați, polițe active, solvabilitate) se iau la sfârșitul perioadei;
- *ratele* (combined ratio, rata daunei, plecări) se recalculează din totalurile perioadei, nu se face media ratelor anuale.

**Comparații corecte.** Când se compară perioade de lungimi diferite (de exemplu, 2022–2025 cu 2021), dashboard-ul compară mediile anuale. Pe intervalele de mai mulți ani afișează și creșterea anuală compusă (CAGR).

**Notarea variațiilor.** Aceeași regulă pe tot dashboard-ul: procent relativ pentru sume, puncte procentuale (pp) pentru indicatorii exprimați în procente, puncte pentru scoruri, zile pentru durate. Culoarea arată efectul pentru companie, nu direcția cifrei.

**Analiza de mix.** Schimbarea combined ratio al grupului se descompune în *efect de rată* (segmentele s-au îmbunătățit sau înrăutățit) și *efect de mix* (s-a schimbat ponderea lor):
`Δ total = Σ pondere veche × Δ rată + Σ Δ pondere × rată nouă`

**Prognoze (2026).**
- Primele: regresie liniară pe logaritmul valorilor lunare, după eliminarea sezonalității, cu interval de prognoză de 80%.
- Rata daunei: separată în *rata de bază* (fără catastrofe, previzibilă) și *încărcarea pentru catastrofe* (media multianuală), cum procedează asigurătorii în planificare.
- Riscul de plecări: o regulă transparentă (media ponderată a ultimilor trei ani, ajustată cu engagement-ul), nu un model de tip „cutie neagră”.

**Scenarii.** Simulatoare pentru preț (cu elasticitatea cererii), catastrofe și reasigurare, retenția angajaților (cost și ROI), teste de stres pentru solvabilitate și realocarea portofoliului între segmente. Fiecare ipoteză e un cursor vizibil.

## Decizii de design

- **Fiecare cifră are context**: țintă, perioadă de comparație sau medie de grup.
- **Fiecare ecran are o concluzie scrisă** („Nota analistului”), calculată din date și actualizată când se schimbă filtrele.
- **Fiecare termen tehnic are o explicație**: butonul „?”, un glosar pentru fiecare ecran și un glosar general, cu 89 de termeni.
- **Filtrele apar doar unde se aplică**, ca utilizatorul să nu caute controale care nu funcționează.
- **Temă luminoasă și întunecată.**
- **Adaptat pentru orice ecran**: testat automat la 7 lățimi de desktop (1280–2560 px) și pe 5 dispozitive mobile. Pe telefon, meniul se compactează, filtrele se strâng într-un buton, iar chat-ul se deschide pe jumătate de ecran.

## Asistentul AI

Dashboard-ul are un chat care răspunde **doar din datele InaVale**: primește automat contextul ecranului curent (perioada, filtrele, cifrele din ferestre) și poate cere singur calcule suplimentare din setul complet, prin funcții definite în pagină. Tehnica se numește *grounding*: răspunsul e ancorat în date, nu în cunoștințele generale ale modelului.

Asistentul funcționează în versiunea găzduită pe claude.ai. În versiunea publică de aici, chat-ul arată întrebările sugerate pentru fiecare ecran, dar nu trimite întrebări.

## Cum a fost construit

- **Interfața**: HTML, CSS și JavaScript, asamblate într-un singur fișier, fără server; graficele cu [Chart.js](https://www.chartjs.org/).
- **Testele**: Playwright, pe desktop și dispozitive mobile simulate.
- **Stilul codului**: JavaScript-ul, HTML-ul și CSS-ul sunt formatate cu [Prettier](https://prettier.io/), iar Python-ul cu [Black](https://black.readthedocs.io/), ca să se citească unitar și să poată fi reformatate cu o singură comandă.
- **Datele**: Python (pandas, NumPy), exportate în Excel.
- **Rolul AI.** Am construit proiectul împreună cu **Claude (Anthropic)**, folosit ca asistent. [Descrie aici, cu cuvintele tale, ce ai decis tu: de exemplu alegerea domeniului, structura pe niveluri, ce indicatori și ce analize să conțină, cerințele de design, verificarea rezultatelor.] Codul și generarea datelor au fost realizate cu ajutorul lui Claude.

## Limitări și pași următori

- Datele sunt sintetice; contabilitatea de asigurări (IFRS 17) și calculul solvabilității sunt simplificate.
- Daunele individuale sunt un eșantion, deci unele cifre sunt estimări.
- Prognozele folosesc metode simple și transparente; un pas următor ar fi compararea lor cu modele de serii de timp dedicate.
- Idei de extindere: salvarea unei „fotografii” a ecranului la o anumită dată, note personale, un mod de prezentare pentru ședințe.

## Structura repository-ului

```
inavale-dashboard/
├── index.html                  # dashboard-ul complet, într-un singur fișier (date incluse)
├── captura.png                 # imaginea din acest README
├── .prettierrc.json            # setările de formatare a codului (Prettier)
├── data/
│   ├── InaVale_Assurance_date.xlsx   # setul de date, cu dicționar și glosar
│   └── csv/                          # aceleași tabele, în format CSV
├── scripts/                    # generarea datelor, pas cu pas
│   ├── 1_generate_business.py        # activitatea de asigurare, cursuri valutare
│   ├── 2_generate_claims_finance.py  # daune, buget, investiții, rezultate
│   ├── 3_generate_employees.py       # populația de angajați
│   ├── 4_generate_hr_kpi.py          # sondaje, recrutare, ținte strategice
│   ├── 5_build_excel.py              # fișierul Excel, cu dicționar și glosar
│   ├── 6_aggregate_for_dashboard.py  # datele agregate pentru dashboard
│   ├── 7_export_csv.py
│   └── run_all.sh                    # rulează toți pașii
├── src/                        # codul sursă al dashboard-ului
│   ├── page.html                     # structura paginii (cu locuri rezervate pentru stiluri și scripturi)
│   ├── styles.css                    # toate stilurile: teme, așezare, mobil
│   ├── 1_base.js … 6_ui_chat.js      # logica, ecranele, glosarul, chat-ul
│   ├── data.json                     # datele agregate (generate de scripts/)
│   ├── i18n_en.json                  # textele în engleză ale glosarului și dicționarului de date
│   ├── vendor/chart.umd.js           # Chart.js 4.4.1 (licență MIT)
│   └── build.py                      # asamblează index.html
└── tests/
    └── run_tests.py            # teste automate de afișare și funcționare
```

## Cum rulezi proiectul

**Doar dashboard-ul:** descarcă `index.html` și deschide-l în orice browser modern.

**Regenerarea datelor și a dashboard-ului** (Python 3, cu pandas, NumPy și openpyxl):

```bash
bash scripts/run_all.sh     # datele: Excel, CSV și src/data.json
python3 src/build.py        # dashboard-ul: index.html
```

**Formatarea codului** (după o modificare; Node.js pentru Prettier, Python pentru Black):

```bash
npx prettier --write "src/*.js" src/page.html src/styles.css src/i18n_en.json
black src/build.py tests/run_tests.py scripts/*.py
```

**Testele automate** (Playwright):

```bash
pip install playwright && python -m playwright install chromium
python3 tests/run_tests.py
```

Testele parcurg toate cele 25 de ecrane la 7 lățimi de desktop și pe 5 dispozitive mobile, verificând că nu apar erori, derulare orizontală, ferestre sau grafice prea înguste și cifre tăiate. Verifică și chat-ul, în ambele moduri.

## Autor

**[Numele tău]** · [LinkedIn] · [email]

Proiect realizat în 2026 ca exercițiu de analiză a datelor.
