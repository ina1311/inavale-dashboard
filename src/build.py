"""Builds the dashboard into a single file: index.html (in the project root).

The page is assembled from:
  page.html        page structure, with three placeholders
  styles.css       all styles             -> <!-- STYLES -->
  vendor/chart.umd.js  Chart.js            -> <!-- CHART_JS -->
  data.json, i18n_en.json and the JS files -> <!-- SCRIPTS -->

Run: python3 src/build.py
"""

import os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# The JavaScript files share one global scope and are loaded in this order.
JS_FILES = [
    "1_base.js",
    "2_screens_layers12.js",
    "3_screens_layers34.js",
    "4_screens_segments.js",
    "5_screen_data.js",
    "6_ui_chat.js",
]


def read(path):
    with open(os.path.join(HERE, path), encoding="utf-8") as f:
        return f.read()


def build():
    styles = "<style>\n" + read("styles.css") + "</style>"
    chart_js = "<script>" + read("vendor/chart.umd.js") + "</script>"
    data = (
        "<script>window.__DATA__=\n"
        + read("data.json")
        + "\n;window.__EN__=\n"
        + read("i18n_en.json")
        + "\n;</script>"
    )
    app = "<script>\n" + "\n".join(read(p) for p in JS_FILES) + "\n</script>"

    html = read("page.html")
    for placeholder, content in [
        ("<!-- STYLES -->", styles),
        ("<!-- CHART_JS -->", chart_js),
        ("<!-- SCRIPTS -->", data + app),
    ]:
        assert html.count(placeholder) == 1, f"placeholder missing: {placeholder}"
        html = html.replace(placeholder, content)

    with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    print("index.html built:", round(len(html.encode()) / 1024), "KB")


if __name__ == "__main__":
    build()
