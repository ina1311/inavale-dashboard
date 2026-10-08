import numpy as np, pandas as pd

rng = np.random.default_rng(2026)
months = pd.period_range("2021-01", "2025-12", freq="M")
T = len(months)

# ---------- dimensions ----------
countries = pd.DataFrame(
    [
        ("DE", "Germany", "Europe", "EUR", 1500),
        ("FR", "France", "Europe", "EUR", 900),
        ("GB", "United Kingdom", "Europe", "GBP", 1100),
        ("RO", "Romania", "Europe", "RON", 150),
        ("US", "United States", "North America", "USD", 2200),
        ("CA", "Canada", "North America", "CAD", 450),
        ("JP", "Japan", "Asia-Pacific", "JPY", 700),
        ("AU", "Australia", "Asia-Pacific", "AUD", 500),
        ("SG", "Singapore", "Asia-Pacific", "SGD", 250),
        ("BR", "Brazil", "Latin America", "BRL", 450),
        ("MX", "Mexico", "Latin America", "MXN", 300),
    ],
    columns=["country_code", "country", "region", "currency", "base_gwp_eur_m"],
)
region_growth = {
    "Europe": 0.03,
    "North America": 0.05,
    "Asia-Pacific": 0.13,
    "Latin America": 0.08,
}
lines = ["Motor", "Property", "Life", "Health", "Commercial"]
channels = ["Agents", "Brokers", "Direct Online", "Bancassurance"]
line_mix = {
    "Motor": 0.30,
    "Property": 0.20,
    "Life": 0.22,
    "Health": 0.13,
    "Commercial": 0.15,
}
chan_mix = {
    "Motor": [0.35, 0.15, 0.35, 0.15],
    "Property": [0.40, 0.20, 0.25, 0.15],
    "Life": [0.40, 0.10, 0.10, 0.40],
    "Health": [0.35, 0.30, 0.20, 0.15],
    "Commercial": [0.15, 0.80, 0.05, 0.00],
}
avg_prem = {
    "Motor": 650,
    "Property": 420,
    "Life": 1100,
    "Health": 1500,
    "Commercial": 9000,
}
base_lr = {
    "Motor": 0.66,
    "Property": 0.56,
    "Life": 0.70,
    "Health": 0.78,
    "Commercial": 0.60,
}
acq = {"Agents": 0.17, "Brokers": 0.15, "Direct Online": 0.07, "Bancassurance": 0.12}

# ---------- FX (local per 1 EUR), monthly ----------
fx_start = {
    "EUR": 1,
    "GBP": 0.86,
    "RON": 4.88,
    "USD": 1.21,
    "CAD": 1.53,
    "JPY": 126,
    "AUD": 1.58,
    "SGD": 1.61,
    "BRL": 6.5,
    "MXN": 24.2,
}
fx_drift = {
    "EUR": 0,
    "GBP": 0.004,
    "RON": 0.004,
    "USD": -0.018,
    "CAD": 0.004,
    "JPY": 0.055,
    "AUD": 0.012,
    "SGD": -0.005,
    "BRL": -0.01,
    "MXN": -0.03,
}
fx_rows = []
fx = {}
for c in fx_start:
    path = [fx_start[c]]
    for t in range(1, T):
        vol = 0 if c == "EUR" else (0.004 if c in ("RON",) else 0.018)
        path.append(path[-1] * np.exp(fx_drift[c] / 12 + rng.normal(0, vol)))
    fx[c] = np.array(path)
    for t, m in enumerate(months):
        fx_rows.append((str(m), c, round(path[t], 4)))
fx_df = pd.DataFrame(fx_rows, columns=["month", "currency", "local_per_eur"])

# ---------- underwriting monthly ----------
rows = []
for _, cr in countries.iterrows():
    for ln in lines:
        mix = line_mix[ln] * (
            1.25 if (ln == "Commercial" and cr.region == "North America") else 1
        )
        for ci, ch in enumerate(channels):
            share0 = chan_mix[ln][ci]
            if share0 == 0:
                continue
            if ch == "Bancassurance" and cr.country_code in ("US", "CA"):
                continue
            annual0 = cr.base_gwp_eur_m * 1e6 * mix * share0
            for t, m in enumerate(months):
                yrs = t / 12
                g = region_growth[cr.region]
                if ch == "Direct Online":
                    g += 0.10
                if ch == "Agents":
                    g -= 0.03
                if cr.country_code == "BR" and ln == "Motor":
                    g += 0.06  # growing fast because underpriced
                season = 1.0
                if ln == "Commercial":
                    season = 1.9 if m.month == 1 else (1.3 if m.month == 7 else 0.89)
                if ln == "Health":
                    season = 1.35 if m.month == 1 else 0.97
                gwp = annual0 / 12 * ((1 + g) ** yrs) * season * rng.normal(1, 0.04)
                # repricing after inflation raises premiums 2023-2024 for motor/property
                if ln in ("Motor", "Property") and m.year >= 2023:
                    gwp *= 1 + 0.05 * min(1, (t - 24) / 12)
                # loss ratio
                lr = base_lr[ln]
                if ln in ("Motor", "Property"):
                    infl = {2021: 0, 2022: 0.06, 2023: 0.08, 2024: 0.03, 2025: 0}[
                        m.year
                    ]
                    lr += infl
                if cr.country_code == "BR" and ln == "Motor":
                    lr = 0.90 + (0.03 if m.year >= 2023 else 0)
                if (
                    ln == "Motor"
                    and cr.region == "Europe"
                    and (m.year > 2024 or (m.year == 2024 and m.month >= 4))
                ):
                    lr -= 0.035
                if ln == "Health" and m.year == 2021:
                    lr += 0.04  # post-covid catch-up
                lr *= rng.normal(1, 0.06)
                nep = gwp * 0.95  # smoothed later
                rows.append(
                    dict(
                        month=str(m),
                        year=m.year,
                        quarter=f"{m.year}-Q{(m.month-1)//3+1}",
                        country_code=cr.country_code,
                        region=cr.region,
                        line_of_business=ln,
                        channel=ch,
                        gwp=gwp,
                        lr=lr,
                        acq_ratio=acq[ch] * rng.normal(1, 0.03),
                        currency=cr.currency,
                        t=t,
                    )
                )
uw = pd.DataFrame(rows)
# earned premium = 12m rolling average of GWP (net of 6% reinsurance) -> smoother than written
uw = uw.sort_values(["country_code", "line_of_business", "channel", "t"])
key = ["country_code", "line_of_business", "channel"]
uw["nep"] = (
    uw.groupby(key)["gwp"].transform(lambda s: s.rolling(12, min_periods=1).mean())
    * 0.94
)
# first year: rolling on partial window underestimates seasonality fine
uw["claims_incurred"] = uw["nep"] * uw["lr"]


# catastrophe events
def cat(mask, total):
    idx = uw[mask].index
    w = uw.loc[idx, "nep"] / uw.loc[idx, "nep"].sum()
    uw.loc[idx, "claims_incurred"] += total * w
    uw.loc[idx, "cat_event"] = name


uw["cat_event"] = ""
name = "Storm Aurel (Central Europe)"
cat(
    (uw.month == "2023-07")
    & (uw.country_code.isin(["DE", "FR", "RO"]))
    & (uw.line_of_business.isin(["Property", "Commercial"])),
    270e6,
)
name = "Hurricane Delphine (US Gulf Coast)"
cat(
    (uw.month == "2024-09")
    & (uw.country_code == "US")
    & (uw.line_of_business.isin(["Property", "Commercial"])),
    430e6,
)
name = "Floods (Southern Brazil)"
cat(
    (uw.month == "2024-05")
    & (uw.country_code == "BR")
    & (uw.line_of_business.isin(["Property", "Motor"])),
    95e6,
)
admin_ratio = lambda y: {
    2021: 0.095,
    2022: 0.093,
    2023: 0.091,
    2024: 0.087,
    2025: 0.083,
}[y]
uw["acquisition_costs"] = uw["gwp"] * uw["acq_ratio"]
uw["admin_expenses"] = (
    uw["nep"] * uw["year"].map(admin_ratio) * rng.normal(1, 0.03, len(uw))
)
uw["policies_in_force"] = (
    (
        uw.groupby(key)["gwp"].transform(lambda s: s.rolling(12, min_periods=1).mean())
        * 12
        / uw["line_of_business"].map(avg_prem)
    )
    .round()
    .astype(int)
)
lapse = uw["channel"].map(
    {"Agents": 0.008, "Brokers": 0.007, "Direct Online": 0.016, "Bancassurance": 0.006}
)
uw["lapsed_policies"] = (
    (uw["policies_in_force"] * lapse * rng.normal(1, 0.1, len(uw)))
    .round()
    .clip(0)
    .astype(int)
)
prev = uw.groupby(key)["policies_in_force"].shift(1).fillna(uw["policies_in_force"])
uw["new_policies"] = (
    (uw["policies_in_force"] - prev + uw["lapsed_policies"])
    .clip(lower=0)
    .round()
    .astype(int)
)
uw["fx_local_per_eur"] = [fx[c][t] for c, t in zip(uw.currency, uw.t)]
uw["gwp_local"] = uw["gwp"] * uw["fx_local_per_eur"]
uw_out = uw[
    [
        "month",
        "year",
        "quarter",
        "region",
        "country_code",
        "line_of_business",
        "channel",
        "currency",
        "gwp",
        "gwp_local",
        "nep",
        "claims_incurred",
        "acquisition_costs",
        "admin_expenses",
        "policies_in_force",
        "new_policies",
        "lapsed_policies",
        "cat_event",
    ]
].copy()
uw_out = uw_out.rename(
    columns={
        "gwp": "gwp_eur",
        "gwp_local": "gwp_local_ccy",
        "nep": "net_earned_premium_eur",
        "claims_incurred": "claims_incurred_eur",
        "acquisition_costs": "acquisition_costs_eur",
        "admin_expenses": "admin_expenses_eur",
    }
)
for c in [
    "gwp_eur",
    "gwp_local_ccy",
    "net_earned_premium_eur",
    "claims_incurred_eur",
    "acquisition_costs_eur",
    "admin_expenses_eur",
]:
    uw_out[c] = uw_out[c].round(0)
uw_out = uw_out.sort_values(
    ["month", "country_code", "line_of_business", "channel"]
).reset_index(drop=True)
uw_out.to_pickle("uw.pkl")
countries.to_pickle("countries.pkl")
fx_df.to_pickle("fx.pkl")
print(uw_out.shape)
y = uw_out.groupby("year")[
    [
        "gwp_eur",
        "net_earned_premium_eur",
        "claims_incurred_eur",
        "acquisition_costs_eur",
        "admin_expenses_eur",
    ]
].sum()
y["LR"] = y.claims_incurred_eur / y.net_earned_premium_eur
y["CR"] = (
    y.claims_incurred_eur + y.acquisition_costs_eur + y.admin_expenses_eur
) / y.net_earned_premium_eur
print((y / 1e6).round(0).assign(LR=y.LR.round(3), CR=y.CR.round(3)))
