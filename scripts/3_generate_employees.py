import numpy as np, pandas as pd

rng = np.random.default_rng(11)
uw = pd.read_pickle("uw.pkl")
countries = pd.read_pickle("countries.pkl")
months = pd.period_range("2021-01", "2025-12", freq="M")
depts = {
    "Sales & Distribution": 0.22,
    "Claims": 0.18,
    "Customer Service": 0.14,
    "Underwriting": 0.10,
    "IT & Digital": 0.10,
    "Operations": 0.08,
    "Actuarial & Risk": 0.05,
    "Finance": 0.05,
    "HR": 0.03,
    "Legal & Compliance": 0.03,
    "Executive & Strategy": 0.02,
}
cshare = countries.set_index("country_code").base_gwp_eur_m
cshare = cshare / cshare.sum()
region_of = countries.set_index("country_code").region
levels = ["L1", "L2", "L3", "L4", "L5", "L6", "EX"]
lvl_p = np.array([0.25, 0.30, 0.22, 0.13, 0.07, 0.025, 0.005])
base_sal = dict(zip(levels, [32e3, 42e3, 56e3, 75e3, 105e3, 150e3, 320e3]))
cf = {
    "US": 1.35,
    "DE": 1.10,
    "GB": 1.10,
    "FR": 1.00,
    "RO": 0.38,
    "CA": 1.10,
    "JP": 0.95,
    "AU": 1.15,
    "SG": 1.10,
    "BR": 0.42,
    "MX": 0.38,
}
fem = dict(zip(levels, [0.58, 0.56, 0.52, 0.44, 0.34, 0.28, 0.22]))


def target(dept, cc, t):
    tot = (
        9200 * (1 + 0.011 * t / 12 * 12 / 12) ** (t / 12)
        if False
        else 9200 * (1.022 ** (t / 12))
    )
    d = depts[dept]
    if dept == "IT & Digital":
        d *= 1 + 0.45 * t / 59
    if dept == "Claims" and region_of[cc] == "Europe" and t >= 26:
        d *= 0.9  # reorg Mar 2023
    if dept == "Customer Service":
        d *= 1 - 0.15 * t / 59  # automation
    c = cshare[cc]
    reg = region_of[cc]
    c *= {
        "Europe": 1.15,
        "North America": 0.9,
        "Asia-Pacific": 1.0,
        "Latin America": 1.35,
    }[reg] * (1 + (0.10 * t / 59 if reg == "Asia-Pacific" else 0))
    return tot * d * c


# normalise country weights
norm = sum(target(d, cc, 0) for d in depts for cc in cshare.index) / 9200

emps = []
nid = [1]


def new_emp(dept, cc, t, initial=False):
    lv = rng.choice(levels, p=lvl_p if not initial else lvl_p)
    if not initial and lv in ("L6", "EX") and rng.random() < 0.7:
        lv = "L5"
    f_prob = fem[lv] + (0.08 if (not initial and lv in ("L4", "L5", "L6", "EX")) else 0)
    gender = "F" if rng.random() < f_prob else "M"
    if rng.random() < 0.004:
        gender = "X"
    age_start = {"L1": 24, "L2": 28, "L3": 33, "L4": 38, "L5": 43, "L6": 47, "EX": 50}[
        lv
    ] + rng.normal(0, 5)
    year_now = 2021 + t // 12
    if initial:
        tenure = rng.exponential(7)
        hire = pd.Timestamp("2021-01-01") - pd.to_timedelta(int(tenure * 365), unit="D")
    else:
        hire = months[t].to_timestamp() + pd.to_timedelta(
            int(rng.integers(0, 28)), unit="D"
        )
    e = dict(
        employee_id=f"E{nid[0]:06d}",
        gender=gender,
        birth_year=int(year_now - age_start),
        country_code=cc,
        region=region_of[cc],
        department=dept,
        job_level=lv,
        hire_date=hire.date(),
        exit_date=None,
        exit_type=None,
        exit_reason=None,
    )
    nid[0] += 1
    emps.append(e)
    return e


active = {}
for d in depts:
    for cc in cshare.index:
        n = int(round(target(d, cc, 0) / norm))
        active[(d, cc)] = [new_emp(d, cc, 0, True) for _ in range(n)]
vol_rate = {
    "Customer Service": 0.18,
    "Sales & Distribution": 0.14,
    "IT & Digital": 0.13,
}
reasons_v = [
    "Better pay elsewhere",
    "Career growth",
    "Workload / burnout",
    "Relocation",
    "Manager relationship",
    "Career change",
]
for t, m in enumerate(months):
    for (d, cc), lst in active.items():
        reg = region_of[cc]
        v = vol_rate.get(d, 0.10) * (
            1.15 if m.year == 2022 else 1
        )  # 2022 tight labour market
        wmix = [0.28, 0.25, 0.15, 0.12, 0.12, 0.08]
        if d == "Claims" and reg == "Europe" and 2023 <= m.year <= 2023:
            v = 0.27
            wmix = [0.15, 0.12, 0.40, 0.05, 0.20, 0.08]
        if d == "Claims" and reg == "Europe" and m.year == 2024 and m.month <= 6:
            v = 0.17
        stay = []
        for e in lst:
            age = m.year - e["birth_year"]
            r = rng.random()
            invol = 0.03 / 12 + (
                0.10
                if (d == "Claims" and reg == "Europe" and str(m) == "2023-03")
                else 0
            )
            if age >= 62 and r < 0.25 / 12:
                e.update(exit_type="Retirement", exit_reason="Retirement")
            elif r < v / 12 * (
                1.4 if e["job_level"] in ("L1", "L2") else 0.8
            ) + 0.25 / 12 * (age >= 62):
                e.update(
                    exit_type="Voluntary", exit_reason=rng.choice(reasons_v, p=wmix)
                )
            elif (
                r
                < v / 12 * (1.4 if e["job_level"] in ("L1", "L2") else 0.8)
                + 0.25 / 12 * (age >= 62)
                + invol
            ):
                e.update(
                    exit_type="Involuntary",
                    exit_reason=(
                        "Restructuring"
                        if str(m) == "2023-03" and d == "Claims" and reg == "Europe"
                        else rng.choice(
                            ["Performance", "Restructuring", "Misconduct"],
                            p=[0.6, 0.3, 0.1],
                        )
                    ),
                )
            else:
                stay.append(e)
                continue
            e["exit_date"] = (
                m.to_timestamp() + pd.to_timedelta(int(rng.integers(0, 28)), unit="D")
            ).date()
        tgt = int(round(target(d, cc, t) / norm))
        # hiring lags in the Claims-Europe crisis
        gap = tgt - len(stay)
        if d == "Claims" and reg == "Europe" and m.year == 2023:
            gap = int(gap * 0.5)
        for _ in range(max(0, gap)):
            stay.append(new_emp(d, cc, t))
        active[(d, cc)] = stay
E = pd.DataFrame(emps)
# salary, performance, extras
yrs_ten = (
    (
        pd.to_datetime(E.exit_date.fillna(pd.Timestamp("2025-12-31").date()))
        - pd.to_datetime(E.hire_date)
    ).dt.days
    / 365
).clip(0)
sal = (
    E.job_level.map(base_sal)
    * E.country_code.map(cf)
    * (1 + 0.012 * yrs_ten.clip(upper=15))
    * rng.normal(1, 0.07, len(E))
)
sal *= np.where(E.department.isin(["IT & Digital", "Actuarial & Risk"]), 1.12, 1)
sal *= np.where(
    (E.gender == "F") & E.job_level.isin(["L4", "L5", "L6", "EX"]),
    0.955,
    np.where(E.gender == "F", 0.985, 1),
)
E["base_salary_eur"] = (sal / 100).round() * 100
E["bonus_target_pct"] = E.job_level.map(
    {"L1": 0.03, "L2": 0.05, "L3": 0.08, "L4": 0.12, "L5": 0.18, "L6": 0.25, "EX": 0.45}
)
perf = np.clip(np.round(rng.normal(3.3, 0.8, len(E))), 1, 5)
perf = np.where(
    (E.exit_type == "Involuntary") & (E.exit_reason == "Performance"),
    np.minimum(perf, 2),
    perf,
)
E["last_performance_rating_1_5"] = perf.astype(int)
E["is_people_manager"] = E.job_level.isin(["L4", "L5", "L6", "EX"]) & (
    rng.random(len(E)) < 0.75
)
E["work_model"] = rng.choice(
    ["Hybrid", "Office", "Remote"], len(E), p=[0.62, 0.28, 0.10]
)
E.loc[E.department.isin(["Customer Service", "Claims"]), "work_model"] = rng.choice(
    ["Hybrid", "Office"],
    (E.department.isin(["Customer Service", "Claims"])).sum(),
    p=[0.5, 0.5],
)
E["status"] = np.where(E.exit_date.isna(), "Active", "Left")
E = E[
    [
        "employee_id",
        "status",
        "gender",
        "birth_year",
        "region",
        "country_code",
        "department",
        "job_level",
        "is_people_manager",
        "work_model",
        "hire_date",
        "exit_date",
        "exit_type",
        "exit_reason",
        "base_salary_eur",
        "bonus_target_pct",
        "last_performance_rating_1_5",
    ]
]
print(E.shape, (E.status == "Active").sum())

# headcount check by year-end
for y in range(2021, 2026):
    d = pd.Timestamp(f"{y}-12-31").date()
    act = E[(E.hire_date <= d) & (E.exit_date.isna() | (E.exit_date > d))]
    print(y, len(act))
E.to_pickle("emp.pkl")
