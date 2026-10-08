import numpy as np, pandas as pd

rng = np.random.default_rng(7)
uw = pd.read_pickle("uw.pkl")
countries = pd.read_pickle("countries.pkl")
months = sorted(uw.month.unique())

# ---------- claims sample (~25k) ----------
sev = {
    "Motor": 2800,
    "Property": 6500,
    "Life": 42000,
    "Health": 1900,
    "Commercial": 38000,
}
causes = {
    "Motor": ["Collision", "Theft", "Glass", "Third-party injury", "Fire"],
    "Property": ["Water damage", "Fire", "Storm", "Burglary", "Subsidence"],
    "Life": ["Death", "Disability", "Critical illness", "Maturity"],
    "Health": ["Hospitalisation", "Outpatient", "Dental", "Maternity", "Pharmacy"],
    "Commercial": [
        "Business interruption",
        "Liability",
        "Property damage",
        "Cyber",
        "Marine cargo",
    ],
}
agg = uw.groupby(
    ["month", "region", "country_code", "line_of_business", "channel", "cat_event"],
    as_index=False,
)["claims_incurred_eur"].sum()
agg["expected_n"] = agg.claims_incurred_eur / agg.line_of_business.map(sev)
p = agg.expected_n / agg.expected_n.sum()
N = 25000
pick = rng.choice(len(agg), size=N, p=p)
c = agg.iloc[pick].reset_index(drop=True)
c["claim_id"] = [f"CLM-{i:06d}" for i in range(1, N + 1)]
day = rng.integers(1, 29, N)
c["reported_date"] = pd.to_datetime(
    c.month + "-" + pd.Series(day).astype(str).str.zfill(2)
)
sig = c.line_of_business.map(
    {"Motor": 0.9, "Property": 1.1, "Life": 0.7, "Health": 0.8, "Commercial": 1.4}
)
mu = np.log(c.line_of_business.map(sev)) - sig**2 / 2
c["claim_amount_eur"] = np.round(np.exp(rng.normal(mu, sig)), 0)
iscat = c.cat_event != ""
c.loc[iscat, "claim_amount_eur"] *= 1.6
c["cause"] = [
    (
        "Storm"
        if (
            ce != ""
            and ln in ("Property", "Commercial", "Motor")
            and rng.random() < 0.85
        )
        else rng.choice(causes[ln])
    )
    for ln, ce in zip(c.line_of_business, c.cat_event)
]
# fraud flags: detection model launched Apr 2024 (motor + property Europe first, then global 2025)
ym = c.reported_date.dt.year * 100 + c.reported_date.dt.month
base = np.where(c.line_of_business.isin(["Motor", "Property", "Health"]), 0.018, 0.006)
boost = np.where(
    (ym >= 202404)
    & (c.region == "Europe")
    & c.line_of_business.isin(["Motor", "Property"]),
    0.035,
    0,
)
boost = boost + np.where(
    (ym >= 202501)
    & (c.region != "Europe")
    & c.line_of_business.isin(["Motor", "Property"]),
    0.025,
    0,
)
c["fraud_suspected"] = rng.random(N) < (base + boost)
# settlement days: Europe claims team attrition 2023 H2 -> backlog
days_base = c.line_of_business.map(
    {"Motor": 24, "Property": 35, "Life": 40, "Health": 12, "Commercial": 70}
)
mult = np.ones(N)
eu = c.region == "Europe"
mult = np.where(eu & (ym >= 202304) & (ym <= 202312), 1.55, mult)
mult = np.where(eu & (ym >= 202401) & (ym <= 202406), 1.30, mult)
mult = np.where(iscat, 1.8, mult)
mult = np.where((ym >= 202501), mult * 0.9, mult)
c["days_to_settle"] = np.round(days_base * mult * rng.lognormal(0, 0.45, N)).astype(int)
end = pd.Timestamp("2025-12-31")
settle = c.reported_date + pd.to_timedelta(c.days_to_settle, unit="D")
status = np.where(settle > end, "Open", "Closed")
rej = (rng.random(N) < 0.06) | (c.fraud_suspected & (rng.random(N) < 0.55))
status = np.where((status == "Closed") & rej, "Rejected", status)
c["status"] = status
c.loc[c.status == "Open", "days_to_settle"] = np.nan
c["paid_amount_eur"] = np.where(
    c.status == "Closed", c.claim_amount_eur * rng.uniform(0.85, 1, N).round(3), 0
).round(0)
c["customer_satisfaction_1_5"] = np.where(
    c.status == "Open",
    np.nan,
    np.clip(
        np.round(
            4.6
            - 0.012 * c.days_to_settle.fillna(0)
            + rng.normal(0, 0.6, N)
            - np.where(c.status == "Rejected", 1.5, 0)
        ),
        1,
        5,
    ),
)
claims = c[
    [
        "claim_id",
        "reported_date",
        "region",
        "country_code",
        "line_of_business",
        "channel",
        "cause",
        "cat_event",
        "claim_amount_eur",
        "paid_amount_eur",
        "status",
        "days_to_settle",
        "fraud_suspected",
        "customer_satisfaction_1_5",
    ]
]
claims = claims.sort_values("reported_date").reset_index(drop=True)
claims["reported_date"] = claims.reported_date.dt.date

# ---------- budget ----------
act = uw.groupby(["year", "month", "region", "line_of_business"], as_index=False)[
    [
        "gwp_eur",
        "net_earned_premium_eur",
        "claims_incurred_eur",
        "acquisition_costs_eur",
        "admin_expenses_eur",
    ]
].sum()
bud = []
tgt_growth = {
    "Europe": 0.05,
    "North America": 0.06,
    "Asia-Pacific": 0.15,
    "Latin America": 0.10,
}
cr_target = {2021: 0.93, 2022: 0.92, 2023: 0.915, 2024: 0.91, 2025: 0.905}
for (reg, ln), g in act.groupby(["region", "line_of_business"]):
    g = g.sort_values("month")
    base2021 = g[g.year == 2021].gwp_eur.values / (
        1 + 0.03
    )  # plan built from 2020 (not in data)
    prev = base2021
    for yr in range(2021, 2026):
        cur = g[g.year == yr]
        if yr > 2021:
            prev = g[g.year == yr - 1].gwp_eur.values
        smooth = prev * (1 + tgt_growth[reg]) * rng.normal(1, 0.01, 12)
        for i, (_, r) in enumerate(cur.iterrows()):
            bud.append(
                dict(
                    month=r.month,
                    year=yr,
                    region=reg,
                    line_of_business=ln,
                    budget_gwp_eur=round(smooth[i]),
                    target_combined_ratio=cr_target[yr]
                    + (0.03 if ln == "Health" else 0),
                )
            )
budget = (
    pd.DataFrame(bud)
    .sort_values(["month", "region", "line_of_business"])
    .reset_index(drop=True)
)

# ---------- investments quarterly ----------
quarters = sorted(uw.quarter.unique())
assets = {
    "Government bonds": 0.42,
    "Corporate bonds": 0.30,
    "Equities": 0.12,
    "Real estate": 0.09,
    "Cash & money market": 0.07,
}
yld = {
    "Government bonds": np.linspace(0.009, 0.031, 20),
    "Corporate bonds": np.linspace(0.014, 0.041, 20),
    "Real estate": np.full(20, 0.042),
    "Cash & money market": np.r_[
        np.full(6, 0.0), np.linspace(0.01, 0.035, 8), np.linspace(0.033, 0.022, 6)
    ],
}
eq_ret = [
    0.06,
    0.03,
    -0.01,
    0.07,
    -0.06,
    -0.11,
    -0.04,
    0.09,
    0.07,
    0.03,
    -0.03,
    0.10,
    0.08,
    0.04,
    0.05,
    0.02,
    -0.02,
    0.06,
    0.07,
    0.03,
]
ug_bond = [
    -0.004,
    0.006,
    0.0,
    -0.012,
    -0.035,
    -0.045,
    -0.03,
    0.01,
    0.01,
    -0.005,
    -0.015,
    0.03,
    -0.005,
    0.0,
    0.02,
    -0.01,
    0.005,
    0.008,
    0.004,
    0.003,
]
aum = 26e9
inv = []
for qi, q in enumerate(quarters):
    aum = aum * (1 + 0.012 + rng.normal(0, 0.004))
    for a, w in assets.items():
        mv = aum * w * (1.02 if a == "Equities" and qi > 12 else 1)
        if a == "Equities":
            income = mv * 0.006
            unreal = mv * eq_ret[qi]
        elif a in ("Government bonds", "Corporate bonds"):
            income = mv * yld[a][qi] / 4
            unreal = mv * ug_bond[qi] * (1.2 if a == "Corporate bonds" else 1)
        else:
            income = mv * yld[a][qi] / 4
            unreal = mv * (rng.normal(0.002, 0.004) if a == "Real estate" else 0)
        inv.append(
            dict(
                quarter=q,
                asset_class=a,
                market_value_eur=round(mv),
                investment_income_eur=round(income),
                unrealised_gain_loss_eur=round(unreal),
            )
        )
invest = pd.DataFrame(inv)

# ---------- group financials quarterly ----------
q = uw.groupby("quarter")[
    [
        "gwp_eur",
        "net_earned_premium_eur",
        "claims_incurred_eur",
        "acquisition_costs_eur",
        "admin_expenses_eur",
    ]
].sum()
ii = invest.groupby("quarter").investment_income_eur.sum()
fin = q.copy()
fin["investment_income_eur"] = ii
fin["underwriting_result_eur"] = (
    fin.net_earned_premium_eur
    - fin.claims_incurred_eur
    - fin.acquisition_costs_eur
    - fin.admin_expenses_eur
)
fin["other_expenses_eur"] = -fin.net_earned_premium_eur * 0.012
fin["profit_before_tax_eur"] = (
    fin.underwriting_result_eur + fin.investment_income_eur + fin.other_expenses_eur
)
fin["tax_eur"] = fin.profit_before_tax_eur.clip(lower=0) * 0.25
fin["net_income_eur"] = fin.profit_before_tax_eur - fin.tax_eur
shares = []
s = 250e6
for i, qq in enumerate(fin.index):
    if qq >= "2024-Q2" and qq <= "2025-Q1":
        s -= 1.5e6  # buyback programme
    shares.append(s)
fin["shares_outstanding"] = shares
fin["eps_eur"] = fin.net_income_eur / fin.shares_outstanding
eq = []
e = 7.8e9
divs = []
unr = invest.groupby("quarter").unrealised_gain_loss_eur.sum()
for qq, r in fin.iterrows():
    div = 0
    if qq.endswith("Q2"):
        py = str(int(qq[:4]) - 1)
        prev_ni = (
            fin.loc[[x for x in fin.index if x.startswith(py)], "net_income_eur"].sum()
            if py >= "2021"
            else 1.0e9
        )
        div = prev_ni * 0.55
    e = (
        e
        + r.net_income_eur
        + unr[qq] * 0.8
        - div
        - (1.5e6 * 55 if ("2024-Q2" <= qq <= "2025-Q1") else 0)
    )
    eq.append(e)
    divs.append(div)
fin["dividends_paid_eur"] = divs
fin["shareholders_equity_eur"] = eq
fin["dps_eur"] = fin.dividends_paid_eur / fin.shares_outstanding
fin["roe_annualised"] = fin.net_income_eur * 4 / fin.shareholders_equity_eur
scr = (
    fin.net_earned_premium_eur * 4 * 0.19
    + invest.groupby("quarter").market_value_eur.sum() * 0.035
) * 1.7
fin["solvency_ii_ratio"] = fin.shareholders_equity_eur * 1.12 / scr
price = []
pr = 44.0
ttm = fin.eps_eur.rolling(4, min_periods=1).mean() * 4
for i, (qq, r) in enumerate(fin.iterrows()):
    target = ttm.iloc[i] * 11.5
    pr = pr * 0.6 + target * 0.4 + rng.normal(0, 1.0)
    if qq == "2023-Q3":
        pr *= 0.91
    if qq == "2024-Q3":
        pr *= 0.94
    if qq == "2022-Q2":
        pr *= 0.93
    price.append(pr)
fin["share_price_eur_end"] = price
fin["market_cap_eur"] = fin.share_price_eur_end * fin.shares_outstanding
fin = fin.reset_index()
for col in fin.columns:
    if col.endswith("_eur") and col not in (
        "eps_eur",
        "dps_eur",
        "share_price_eur_end",
    ):
        fin[col] = fin[col].round(0)
for col in ["eps_eur", "dps_eur", "share_price_eur_end"]:
    fin[col] = fin[col].round(2)
for col in ["roe_annualised", "solvency_ii_ratio"]:
    fin[col] = fin[col].round(4)
fin["shares_outstanding"] = fin.shares_outstanding.astype(int)
print(
    fin[
        [
            "quarter",
            "net_income_eur",
            "eps_eur",
            "roe_annualised",
            "solvency_ii_ratio",
            "share_price_eur_end",
        ]
    ].to_string()
)
claims.to_pickle("claims.pkl")
budget.to_pickle("budget.pkl")
invest.to_pickle("invest.pkl")
fin.to_pickle("fin.pkl")
print(claims.shape, budget.shape, invest.shape)
print(
    claims.groupby(
        [claims.region == "Europe", pd.to_datetime(claims.reported_date).dt.year]
    )
    .days_to_settle.median()
    .unstack()
)
