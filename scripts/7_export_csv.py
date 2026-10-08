import pandas as pd, os

X = pd.ExcelFile("../../data/InaVale_Assurance_date.xlsx")
os.makedirs("../../data/csv", exist_ok=True)
for s in X.sheet_names:
    if s == "Citeste_ma":
        continue
    pd.read_excel(X, s).to_csv(f"../../data/csv/{s}.csv", index=False, encoding="utf-8")
print("CSV exportate")
