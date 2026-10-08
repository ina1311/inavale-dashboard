import numpy as np, pandas as pd

rng = np.random.default_rng(23)
E = pd.read_pickle("emp.pkl")
uw = pd.read_pickle("uw.pkl")
claims = pd.read_pickle("claims.pkl")
fin = pd.read_pickle("fin.pkl")
E["hire_date"] = pd.to_datetime(E.hire_date)
E["exit_date"] = pd.to_datetime(E.exit_date)
depts = sorted(E.department.unique())
regions = sorted(E.region.unique())


# voluntary attrition per year x dept x region
def att(y, mask=None):
    s, e = pd.Timestamp(f"{y}-01-01"), pd.Timestamp(f"{y}-12-31")
    X = E if mask is None else E[mask]
    hc_s = ((X.hire_date <= s) & (X.exit_date.isna() | (X.exit_date > s))).sum()
    hc_e = ((X.hire_date <= e) & (X.exit_date.isna() | (X.exit_date > e))).sum()
    vol = ((X.exit_type == "Voluntary") & (X.exit_date >= s) & (X.exit_date <= e)).sum()
    return vol / max(1, (hc_s + hc_e) / 2), (hc_s + hc_e) / 2


# ---------- engagement survey ----------
rows = []
for y in range(2021, 2026):
    for d in depts:
        for r in regions:
            a, hc = att(y, (E.department == d) & (E.region == r))
            if hc < 5:
                continue
            eng = 77 - 60 * (a - 0.11) + rng.normal(0, 2)
            if d == "Claims" and r == "Europe" and y == 2023:
                eng -= 3
            if d == "IT & Digital":
                eng += 2
            if y == 2022:
                eng -= 1.5
            eng = float(np.clip(eng, 40, 92))
            rows.append(
                dict(
                    survey_year=y,
                    department=d,
                    region=r,
                    headcount_invited=int(round(hc)),
                    participation_rate=round(
                        float(
                            np.clip(
                                rng.normal(0.78, 0.05) - (0.1 if eng < 62 else 0),
                                0.4,
                                0.97,
                            )
                        ),
                        3,
                    ),
                    engagement_score_0_100=round(eng, 1),
                    enps=int(round((eng - 70) * 2.6 + rng.normal(0, 4))),
                    manager_support_0_100=round(eng + rng.normal(1, 3), 1),
                    workload_balance_0_100=round(
                        eng
                        - 6
                        + rng.normal(0, 3)
                        - (
                            10 if (d == "Claims" and r == "Europe" and y == 2023) else 0
                        ),
                        1,
                    ),
                    career_growth_0_100=round(eng - 4 + rng.normal(0, 3), 1),
                    pay_fairness_0_100=round(eng - 8 + rng.normal(0, 3), 1),
                )
            )
eng = pd.DataFrame(rows)

# ---------- recruitment funnel (quarterly) ----------
E["hire_q"] = E.hire_date.dt.to_period("Q").astype(str)
hires = (
    E[E.hire_date >= "2021-01-01"]
    .groupby(["hire_q", "department", "region"])
    .size()
    .rename("hires")
    .reset_index()
)
ratio = {
    "IT & Digital": 14,
    "Actuarial & Risk": 18,
    "Customer Service": 45,
    "Sales & Distribution": 38,
    "Claims": 30,
}
ttf = {
    "IT & Digital": 62,
    "Actuarial & Risk": 70,
    "Executive & Strategy": 95,
    "Customer Service": 28,
    "Sales & Distribution": 35,
}
rec = []
for _, h in hires.iterrows():
    n = h.hires
    rt = ratio.get(h.department, 32)
    t = (
        ttf.get(h.department, 45)
        * (1.35 if h.hire_q.startswith("2022") else 1)
        * (
            1.4
            if (
                h.department == "Claims"
                and h.region == "Europe"
                and h.hire_q.startswith("2023")
            )
            else 1
        )
    )
    offers = int(round(n / np.clip(rng.normal(0.84, 0.05), 0.6, 0.97)))
    rec.append(
        dict(
            quarter=h.hire_q,
            department=h.department,
            region=h.region,
            applications=int(n * rt * rng.normal(1, 0.12)),
            screened=int(n * rt * 0.35 * rng.normal(1, 0.1)),
            interviews=int(n * 4.2 * rng.normal(1, 0.1)),
            offers_made=offers,
            offers_accepted=int(n),
            hires=int(n),
            avg_time_to_hire_days=int(round(t * rng.normal(1, 0.08))),
            cost_per_hire_eur=int(
                round(
                    rng.normal(4200, 500)
                    * (
                        1.8
                        if h.department
                        in ("IT & Digital", "Actuarial & Risk", "Executive & Strategy")
                        else 1
                    )
                )
            ),
        )
    )
rec = pd.DataFrame(rec).rename(columns={"quarter": "quarter"})

# ---------- strategic KPI targets ----------
kp = []
yu = uw.groupby("year")[
    [
        "gwp_eur",
        "net_earned_premium_eur",
        "claims_incurred_eur",
        "acquisition_costs_eur",
        "admin_expenses_eur",
    ]
].sum()
cr = (
    yu.claims_incurred_eur + yu.acquisition_costs_eur + yu.admin_expenses_eur
) / yu.net_earned_premium_eur
gr = yu.gwp_eur.pct_change()
gr.loc[2021] = 0.041
online = (
    uw[uw.channel == "Direct Online"].groupby("year").new_policies.sum()
    / uw.groupby("year").new_policies.sum()
)
cl = claims.copy()
cl["y"] = pd.to_datetime(cl.reported_date).dt.year
med = cl.groupby("y").days_to_settle.median()
csat = cl.groupby("y").customer_satisfaction_1_5.mean()
nps = (csat - csat.mean()) * 45 + 24 + rng.normal(0, 1, 5)
fy = fin.assign(y=fin.quarter.str[:4].astype(int)).groupby("y")
roe = fy.net_income_eur.sum() / fy.shareholders_equity_eur.mean()
solv = fy.solvency_ii_ratio.last()
engg = eng.groupby("survey_year").apply(
    lambda g: np.average(g.engagement_score_0_100, weights=g.headcount_invited)
)
wsen = []
vol = []
for y in range(2021, 2026):
    d = pd.Timestamp(f"{y}-12-31")
    a = E[(E.hire_date <= d) & (E.exit_date.isna() | (E.exit_date > d))]
    s = a[a.job_level.isin(["L5", "L6", "EX"])]
    wsen.append((s.gender == "F").mean())
    vol.append(att(y)[0])
T = {
    "Combined ratio": (
        [0.93, 0.92, 0.915, 0.91, 0.905],
        cr.values,
        "lower is better",
        "ratio",
    ),
    "GWP growth": (
        [0.05, 0.06, 0.07, 0.07, 0.07],
        gr.values,
        "higher is better",
        "pct",
    ),
    "Return on equity": (
        [0.11, 0.115, 0.12, 0.125, 0.13],
        roe.values,
        "higher is better",
        "pct",
    ),
    "Solvency II ratio (year-end)": (
        [1.8] * 5,
        solv.values,
        "higher is better (min 1.5 internal)",
        "ratio",
    ),
    "Digital share of new policies": (
        [0.50, 0.53, 0.56, 0.59, 0.62],
        online.values,
        "higher is better",
        "pct",
    ),
    "Customer NPS": ([22, 23, 24, 26, 28], nps.values, "higher is better", "points"),
    "Median claim settlement (days)": (
        [22, 21, 20, 20, 19],
        med.values,
        "lower is better",
        "days",
    ),
    "Employee engagement (0-100)": (
        [75, 76, 76, 77, 77],
        engg.values,
        "higher is better",
        "score",
    ),
    "Voluntary attrition": (
        [0.13, 0.13, 0.125, 0.12, 0.12],
        np.array(vol),
        "lower is better",
        "pct",
    ),
    "Women in senior leadership (L5+)": (
        [0.33, 0.35, 0.37, 0.39, 0.40],
        np.array(wsen),
        "higher is better",
        "pct",
    ),
}
owner = {
    "Combined ratio": "Finance / Underwriting",
    "GWP growth": "Sales & Distribution",
    "Return on equity": "CFO",
    "Solvency II ratio (year-end)": "Actuarial & Risk",
    "Digital share of new policies": "IT & Digital",
    "Customer NPS": "Customer Service",
    "Median claim settlement (days)": "Claims",
    "Employee engagement (0-100)": "HR",
    "Voluntary attrition": "HR",
    "Women in senior leadership (L5+)": "HR / Executive",
}
for k, (tg, ac, dirn, unit) in T.items():
    for i, y in enumerate(range(2021, 2026)):
        kp.append(
            dict(
                year=y,
                kpi=k,
                owner=owner[k],
                unit=unit,
                direction=dirn,
                target=round(float(tg[i]), 4),
                actual=round(float(ac[i]), 4),
            )
        )
kpi = pd.DataFrame(kp)
print(kpi[kpi.year.isin([2023, 2025])].to_string())
print("vol attr", [round(v, 3) for v in vol])
print(
    eng[(eng.department == "Claims") & (eng.region == "Europe")][
        ["survey_year", "engagement_score_0_100", "enps"]
    ]
)
eng.to_pickle("eng.pkl")
rec.to_pickle("rec.pkl")
kpi.to_pickle("kpi.pkl")
