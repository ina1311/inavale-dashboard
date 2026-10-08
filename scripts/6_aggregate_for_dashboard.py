import pandas as pd, numpy as np, json
import os

X = pd.ExcelFile(os.environ.get("XLSX_IN", "../data/InaVale_Assurance_date.xlsx"))
rd = lambda s: pd.read_excel(X, s)
uw, cl, bud, fin, inv, emp, rec, eng, kpi, fx, gl = [
    rd(s)
    for s in [
        "Activitate_lunara",
        "Daune",
        "Buget",
        "Rezultate_grup",
        "Investitii",
        "Angajati",
        "Recrutare",
        "Sondaje_angajati",
        "Tinte_strategice",
        "Cursuri_valutare",
        "Glosar",
    ]
]
R = ["Europe", "North America", "Asia-Pacific", "Latin America"]
L = ["Motor", "Property", "Life", "Health", "Commercial"]
C = ["Agents", "Brokers", "Direct Online", "Bancassurance"]
months = sorted(uw.month.unique())
mi = {m: i for i, m in enumerate(months)}
# constant-FX GWP (at 2021 average rates)
fx["year"] = fx.month.str[:4].astype(int)
fx21 = fx[fx.year == 2021].groupby("currency").local_per_eur.mean()
uw["gwp_cfx"] = uw.gwp_local_ccy / uw.currency.map(fx21)
g = uw.groupby(["month", "region", "line_of_business", "channel"], as_index=False)[
    [
        "gwp_eur",
        "net_earned_premium_eur",
        "claims_incurred_eur",
        "acquisition_costs_eur",
        "admin_expenses_eur",
        "policies_in_force",
        "new_policies",
        "lapsed_policies",
        "gwp_cfx",
    ]
].sum()
k = lambda v: int(round(v / 1000))
UW = [
    [
        mi[r.month],
        R.index(r.region),
        L.index(r.line_of_business),
        C.index(r.channel),
        k(r.gwp_eur),
        k(r.net_earned_premium_eur),
        k(r.claims_incurred_eur),
        k(r.acquisition_costs_eur),
        k(r.admin_expenses_eur),
        int(r.policies_in_force),
        int(r.new_policies),
        int(r.lapsed_policies),
        k(r.gwp_cfx),
    ]
    for r in g.itertuples()
]
cats = uw[uw.cat_event.notna()].groupby(["month", "cat_event"], as_index=False).size()
CAT = [[mi[r.month], r.cat_event] for r in cats.itertuples()]
B = [
    [
        mi[r.month],
        R.index(r.region),
        L.index(r.line_of_business),
        k(r.budget_gwp_eur),
        round(r.target_combined_ratio, 4),
    ]
    for r in bud.itertuples()
]
# claims aggregates
cl["m"] = pd.to_datetime(cl.reported_date).dt.strftime("%Y-%m").map(mi)
cl["closed"] = cl.status == "Closed"
cl["rej"] = cl.status == "Rejected"
cl["open"] = cl.status == "Open"
cl["dsum"] = cl.days_to_settle.fillna(0)
cl["dn"] = cl.days_to_settle.notna()
cl["cs"] = cl.customer_satisfaction_1_5.fillna(0)
cl["csn"] = cl.customer_satisfaction_1_5.notna()
ca = cl.groupby(["m", "region", "line_of_business"], as_index=False).agg(
    n=("claim_id", "size"),
    amt=("claim_amount_eur", "sum"),
    closed=("closed", "sum"),
    rej=("rej", "sum"),
    op=("open", "sum"),
    dsum=("dsum", "sum"),
    dn=("dn", "sum"),
    fr=("fraud_suspected", "sum"),
    cs=("cs", "sum"),
    csn=("csn", "sum"),
)
CL = [
    [
        int(r.m),
        R.index(r.region),
        L.index(r.line_of_business),
        int(r.n),
        k(r.amt),
        int(r.closed),
        int(r.rej),
        int(r.op),
        int(r.dsum),
        int(r.dn),
        int(r.fr),
        int(r.cs),
        int(r.csn),
    ]
    for r in ca.itertuples()
]
causes = sorted(cl.cause.unique())
cl["y"] = pd.to_datetime(cl.reported_date).dt.year
cc = cl.groupby(["y", "region", "line_of_business", "cause"], as_index=False).agg(
    n=("claim_id", "size"), amt=("claim_amount_eur", "sum")
)
CC = [
    [
        int(r.y),
        R.index(r.region),
        L.index(r.line_of_business),
        causes.index(r.cause),
        int(r.n),
        k(r.amt),
    ]
    for r in cc.itertuples()
]
# days-to-settle buckets vs csat
b = pd.cut(
    cl.days_to_settle, [0, 15, 30, 45, 60, 90, 10000], labels=False, include_lowest=True
)
cl["b"] = b
cb = (
    cl[cl.csn]
    .groupby(["y", "region", "b"], as_index=False)
    .agg(n=("claim_id", "size"), cs=("cs", "sum"))
)
CB = [
    [int(r.y), R.index(r.region), int(r.b), int(r.n), int(r.cs)]
    for r in cb.itertuples()
]
# HR
emp["hire_date"] = pd.to_datetime(emp.hire_date)
emp["exit_date"] = pd.to_datetime(emp.exit_date)
D = sorted(emp.department.unique())
LV = ["L1", "L2", "L3", "L4", "L5", "L6", "EX"]
GN = ["F", "M", "X"]
reasons = sorted(emp.exit_reason.dropna().unique())
HR = []
HLG = []
EXR = []
for y in range(2021, 2026):
    s, e = pd.Timestamp(f"{y}-01-01"), pd.Timestamp(f"{y}-12-31")
    act_s = (emp.hire_date < s) & (emp.exit_date.isna() | (emp.exit_date >= s))
    act_e = (emp.hire_date <= e) & (emp.exit_date.isna() | (emp.exit_date > e))
    inyr = (emp.exit_date >= s) & (emp.exit_date <= e)
    hired = (emp.hire_date >= s) & (emp.hire_date <= e)
    for ri, r in enumerate(R):
        for di, d in enumerate(D):
            m = (emp.region == r) & (emp.department == d)
            HR.append(
                [
                    y,
                    ri,
                    di,
                    int((m & act_s).sum()),
                    int((m & act_e).sum()),
                    int((m & hired).sum()),
                    int((m & inyr & (emp.exit_type == "Voluntary")).sum()),
                    int((m & inyr & (emp.exit_type == "Involuntary")).sum()),
                    int((m & inyr & (emp.exit_type == "Retirement")).sum()),
                    int((m & hired & inyr).sum()),
                ]
            )
            for rs, n in (
                emp[m & inyr & (emp.exit_type == "Voluntary")]
                .exit_reason.value_counts()
                .items()
            ):
                EXR.append([y, ri, di, reasons.index(rs), int(n)])
        a = emp[act_e & (emp.region == r)]
        for (lv, gn), n in a.groupby(["job_level", "gender"]).size().items():
            HLG.append([y, ri, LV.index(lv), GN.index(gn), int(n)])
act25 = emp[emp.status == "Active"]
PAY = [
    [
        R.index(r),
        D.index(d),
        LV.index(lv),
        GN.index(gn),
        int(len(x)),
        int(x.base_salary_eur.sum()),
    ]
    for (r, d, lv, gn), x in act25.groupby(
        ["region", "department", "job_level", "gender"]
    )
]
rec["y"] = rec.quarter.str[:4].astype(int)
rc = (
    rec.assign(
        tw=rec.avg_time_to_hire_days * rec.hires, cw=rec.cost_per_hire_eur * rec.hires
    )
    .groupby(["y", "region", "department"], as_index=False)[
        [
            "applications",
            "screened",
            "interviews",
            "offers_made",
            "offers_accepted",
            "hires",
            "tw",
            "cw",
        ]
    ]
    .sum()
)
REC = [
    [
        int(r.y),
        R.index(r.region),
        D.index(r.department),
        int(r.applications),
        int(r.screened),
        int(r.interviews),
        int(r.offers_made),
        int(r.offers_accepted),
        int(r.hires),
        int(r.tw),
        int(r.cw),
    ]
    for r in rc.itertuples()
]
ENG = [
    [
        int(r.survey_year),
        R.index(r.region),
        D.index(r.department),
        int(r.headcount_invited),
        r.participation_rate,
        r.engagement_score_0_100,
        int(r.enps),
        r.manager_support_0_100,
        r.workload_balance_0_100,
        r.career_growth_0_100,
        r.pay_fairness_0_100,
    ]
    for r in eng.itertuples()
]
FIN = fin.to_dict(orient="list")
INV = inv.to_dict(orient="list")
KPI = kpi.to_dict(orient="list")
GL = [[r.Termen, r._2, r.Domeniu, r.Definiție, r._5] for r in gl.itertuples()]
dd = pd.read_excel(X, "Dictionar_date").fillna("")
ROWS = {
    s: int(pd.read_excel(X, s).shape[0])
    for s in X.sheet_names
    if s not in ("Citeste_ma", "Dictionar_date", "Glosar")
}
out = dict(
    dict=dd.values.tolist(),
    rows=ROWS,
    months=months,
    R=R,
    L=L,
    C=C,
    D=D,
    LV=LV,
    GN=GN,
    causes=causes,
    reasons=reasons,
    uw=UW,
    cat=CAT,
    bud=B,
    cl=CL,
    cc=CC,
    cb=CB,
    hr=HR,
    hlg=HLG,
    exr=EXR,
    pay=PAY,
    rec=REC,
    eng=ENG,
    fin=FIN,
    inv=INV,
    kpi=KPI,
    gl=GL,
)
s = json.dumps(
    out,
    ensure_ascii=False,
    separators=(",", ":"),
    default=lambda o: None if (isinstance(o, float) and np.isnan(o)) else o,
)
open(os.environ.get("JSON_OUT", "../src/data.json"), "w").write(s)
print(len(s) / 1024, "KB", len(UW), len(CL), len(HR))
print(gl.columns.tolist())
print(D)
print(causes)
print(reasons)
