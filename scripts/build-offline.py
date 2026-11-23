"""Build the standalone editor from the hosted source files."""

import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / "src"
html = (source / "index.html").read_text(encoding="utf-8")


def inline_asset(match):
    stylesheet, script = match.groups()
    tag = "style" if stylesheet else "script"
    content = (source / (stylesheet or script)).read_text(encoding="utf-8")
    return f"<{tag}>{content}</{tag}>"


standalone = re.sub(
    r'<link rel="stylesheet" href="([^"]+)">|<script src="([^"]+)"></script>',
    inline_asset,
    html,
)
(root / "KaTeX Editor.html").write_text(standalone, encoding="utf-8")
