"""SPARC v8 contract tests (MW-16 operator notes). RED -> GREEN.
Run: python3 -m unittest discover -s tests -v
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text()
CSS = (ROOT / "styles.css").read_text()


def blocks(selector):
    return re.findall(re.escape(selector) + r"\s*\{([^}]*)\}", CSS)


def font_size(selector):
    joined = " ".join(blocks(selector))
    m = re.search(r"font-size:\s*([^;]+);", joined)
    assert m, selector + " has no font-size"
    return m.group(1).strip()


def clamp_px(spec, vw):
    parts = [p.strip() for p in spec[len("clamp("):-1].split(",")]

    def px(t):
        if t.endswith("rem"):
            return float(t[:-3]) * 16
        if t.endswith("vw"):
            return float(t[:-2]) * vw / 100
        return float(t)

    lo, pref, hi = (px(p) for p in parts)
    return max(lo, min(pref, hi))


def size_at(spec, vw):
    return clamp_px(spec, vw) if spec.startswith("clamp(") else float(spec.replace("rem", "")) * 16


class B1LogoExactRatio(unittest.TestCase):
    def test_wordmark_125x_headline_base(self):
        wm = font_size(".wordmark")
        hl = font_size(".headline")
        self.assertTrue(wm.startswith("clamp("), "wordmark needs a clamp font-size")
        for vw in (320, 390, 600, 768, 1023):
            ratio = size_at(wm, vw) / size_at(hl, vw)
            self.assertAlmostEqual(ratio, 1.25, delta=0.01, msg=f"viewport {vw}px ratio {ratio:.3f}")

    def test_wordmark_125x_headline_desktop(self):
        for media, vw in (("@media (min-width: 1024px)", 1024), ("@media (min-width: 1440px)", 1440)):
            seg = CSS.split(media)[1]
            wm = re.search(r"\.wordmark\s*\{([^}]*)\}", seg)
            self.assertIsNotNone(wm, f"wordmark override missing in {media}")
            wm_m = re.search(r"font-size:\s*([^;]+);", wm.group(1))  # type: ignore[union-attr]
            self.assertIsNotNone(wm_m)
            wm_spec = wm_m.group(1).strip()  # type: ignore[union-attr]
            hl = re.search(r"\.headline\s*\{([^}]*)\}", seg)
            self.assertIsNotNone(hl, media)
            hl_block = hl.group(1)  # type: ignore[union-attr]
            spec_m = re.search(r"font-size:\s*([^;]+);", hl_block)
            self.assertIsNotNone(spec_m)
            hl_spec = spec_m.group(1).strip()  # type: ignore[union-attr]
            ratio = size_at(wm_spec, vw) / size_at(hl_spec, vw)
            self.assertAlmostEqual(ratio, 1.25, delta=0.01, msg=f"{media} ratio {ratio:.3f}")

    def test_stamp_styling_kept(self):
        joined = " ".join(blocks(".wordmark"))
        self.assertRegex(joined, r"border:\s*[^;]+(solid|double)")
        self.assertRegex(joined, r"rotate\(-?\d")


class B2ExchangeHidden(unittest.TestCase):
    def test_exchange_section_hidden(self):
        m = re.search(r'<section[^>]*id="exchange"[^>]*>', HTML)
        self.assertIsNotNone(m, "exchange section must stay in markup")
        tag = m.group(0)  # type: ignore[union-attr]
        self.assertRegex(tag, r"\bhidden\b")

    def test_exchange_markup_kept_for_revival(self):
        self.assertIn('id="exchange-title"', HTML)
        self.assertIn("File exchange", HTML)
        self.assertIn("files-table", HTML)

    def test_no_links_to_exchange(self):
        self.assertNotIn('href="#exchange"', HTML)
        self.assertNotIn('data-spy="exchange"', HTML)

    def test_visible_folios_sequential(self):
        visible = re.findall(r'<section class="sheet[^"]*"(?![^>]*hidden)[^>]*data-folio="(\d+)"', HTML)
        self.assertEqual(visible, ["01", "02", "03", "04"])


class B3FaqRename(unittest.TestCase):
    def test_notes_title_is_faq(self):
        m = re.search(r'<h2 id="notes-title"[^>]*>([^<]*)</h2>', HTML)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1).strip(), "FAQ")  # type: ignore[union-attr]

    def test_case_notes_gone_from_visible_copy(self):
        text = re.sub(r"<[^>]+>", " ", HTML)
        self.assertNotIn("Case notes", text)
        self.assertNotIn("case notes", text)

    def test_notes_anchor_kept(self):
        self.assertIn('id="notes"', HTML)
        self.assertIn('href="#notes"', HTML)


if __name__ == "__main__":
    unittest.main()
