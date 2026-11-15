"""SPARC v7 contract tests (MW-15 brand round). RED -> GREEN.
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


class B1FormHeading(unittest.TestCase):
    def test_eyebrow_live_bold(self):
        joined = " ".join(blocks(".eyebrow-live"))
        self.assertRegex(joined, r"font-weight:\s*(700|bold)")

    def test_eyebrow_live_enlarged(self):
        spec = font_size(".eyebrow-live")
        self.assertTrue(spec.startswith("clamp("), "eyebrow-live needs a clamp font-size")
        self.assertGreaterEqual(clamp_px(spec, 320), 20)
        self.assertGreaterEqual(clamp_px(spec, 1440), 28)

    def test_eyebrow_row_enlarged(self):
        spec = font_size(".sheet-eyebrow")
        self.assertGreater(size_at(spec, 390), 13)

    def test_form_counterweight_stays_small(self):
        spec = font_size(".eyebrow-form")
        self.assertLessEqual(size_at(spec, 1440), 14)

    def test_eyebrow_still_over_form(self):
        m = re.search(r'<div class="intake-formwrap">(.*?)<form', HTML, re.S)
        self.assertIsNotNone(m)
        self.assertIn("OPEN A CASE", m.group(1))
        self.assertIn("FORM 01", m.group(1))


class B2WordmarkStamp(unittest.TestCase):
    def test_wordmark_has_stamp_frame_and_tilt(self):
        joined = " ".join(blocks(".wordmark"))
        self.assertRegex(joined, r"border:\s*[^;]+(solid|double)")
        self.assertRegex(joined, r"rotate\(-?\d")

    def test_wordmark_dominates_headline_at_mobile_and_tablet(self):
        wm = font_size(".wordmark")
        hl = font_size(".headline")
        for vw in (320, 390, 600, 768, 1023):
            self.assertGreater(size_at(wm, vw), size_at(hl, vw), f"viewport {vw}px")

    def test_wordmark_dominates_headline_at_desktop(self):
        desktop = CSS.split("@media (min-width: 1024px)")[1]
        wm = re.search(r"\.wordmark\s*\{([^}]*)\}", desktop)
        self.assertIsNotNone(wm, "desktop wordmark override missing")
        wm_m = re.search(r"font-size:\s*([\d.]+)rem", wm.group(1))
        self.assertIsNotNone(wm_m)
        wm_size = float(wm_m.group(1)) * 16
        for media, vw in (("@media (min-width: 1024px)", 1024), ("@media (min-width: 1440px)", 1440)):
            seg = CSS.split(media)[1]
            hl = re.search(r"\.headline\s*\{([^}]*)\}", seg)
            self.assertIsNotNone(hl, media)
            spec_m = re.search(r"font-size:\s*([^;]+);", hl.group(1))
            self.assertIsNotNone(spec_m)
            spec = spec_m.group(1).strip()
            self.assertGreater(wm_size, size_at(spec, vw), media)

    def test_wordmark_still_home_link(self):
        m = re.search(r'<a class="wordmark"[^>]*>', HTML)
        self.assertIsNotNone(m)
        self.assertIn('href="#intake"', m.group(0))
        self.assertIn('aria-label="MysteryD home"', m.group(0))


if __name__ == "__main__":
    unittest.main()
