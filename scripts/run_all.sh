#!/usr/bin/env bash
# Regenerează tot setul de date și fișierul de date al dashboard-ului.
# Rulare: bash scripts/run_all.sh   (necesită Python 3, pandas, numpy, openpyxl)
set -e
cd "$(dirname "$0")"
mkdir -p _work && cd _work
for s in 1_generate_business 2_generate_claims_finance 3_generate_employees 4_generate_hr_kpi; do
  echo ">> $s"; python3 ../$s.py > /dev/null
done
echo ">> 5_build_excel";  XLSX_OUT=../../data/InaVale_Assurance_date.xlsx python3 ../5_build_excel.py
echo ">> 6_aggregate_for_dashboard"; XLSX_IN=../../data/InaVale_Assurance_date.xlsx JSON_OUT=../../src/data.json python3 ../6_aggregate_for_dashboard.py > /dev/null
echo ">> 7_export_csv"; python3 ../7_export_csv.py
echo "Gata. Apoi construiește dashboard-ul: python3 src/build.py"
