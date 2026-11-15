"""SPARC v5 contract tests (operator notes 1-5). RED -> GREEN.
Run: python3 -m unittest discover -s tests -v
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text()
CSS = (ROOT / "styles.css").read_text()


def flat(text):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text))


class N1Headline(unittest.TestCase):
    def test_exact_new_copy(self):
        self.assertIn("We find what's wrong before your users do.", flat(HTML))

    def test_old_copy_gone(self):
        f = flat(HTML)
        self.assertNotIn("Something is wrong", f)
        self.assertNotIn("We find it", f)

    def test_accent_on_whats_wrong(self):
        m = re.search(r'<em class="hl-wrong">([^<]*)</em>', HTML)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1), "what's wrong")

    def test_three_display_lines_and_stop(self):
        self.assertEqual(HTML.count('class="hl-line"'), 3)
        self.assertIn('class="hl-stop"', HTML)


class N2ItalicPlaceholders(unittest.TestCase):
    def test_placeholder_rule_italic(self):
        m = re.search(r"\.field input::placeholder,\s*\.field textarea::placeholder\s*\{([^}]*)\}", CSS)
        self.assertIsNotNone(m)
        self.assertRegex(m.group(1), r"font-style:\s*italic")

    def test_typed_input_not_italic(self):
        m = re.search(r"\.field input,\s*\.field textarea,\s*\.field select\s*\{([^}]*)\}", CSS)
        self.assertIsNotNone(m)
        self.assertNotIn("font-style: italic", m.group(1))


class N3ServicesIndex(unittest.TestCase):
    def entries(self):
        m = re.search(r'<ol class="index-list">(.*?)</ol>', HTML, re.S)
        self.assertIsNotNone(m)
        return re.findall(r"<li\b[^>]*>.*?</li>", m.group(1), re.S)

    def test_eight_entries_sequential(self):
        items = self.entries()
        self.assertEqual(len(items), 8)
        nums = [re.search(r'class="index-num">(\d+)<', it).group(1) for it in items]
        self.assertEqual(nums, ["01", "02", "03", "04", "05", "06", "07", "08"])

    def test_accessibility_entry(self):
        items = self.entries()
        acc = flat(items[4]).lower()
        self.assertIn("accessibility scan", acc)
        self.assertIn("wcag", acc)
        for level in ("a,", "aa", "aaa"):
            self.assertIn(level, acc)
        self.assertIn("granularity", acc)

    def test_pentest_entry(self):
        items = self.entries()
        pen = flat(items[5]).lower()
        self.assertIn("penetration testing", pen)
        self.assertIn("result", pen)

    def test_cta_last_and_lede_count(self):
        items = self.entries()
        self.assertIn('class="index-cta"', items[7])
        self.assertIn("#intake", items[7])
        self.assertIn("Eight entries", HTML)
        self.assertNotIn("Six entries", HTML)


class N4EyebrowOverForm(unittest.TestCase):
    def test_eyebrow_inside_formwrap_before_form(self):
        m = re.search(r'<div class="intake-formwrap">(.*?)<form', HTML, re.S)
        self.assertIsNotNone(m)
        self.assertIn('class="sheet-eyebrow"', m.group(1))
        self.assertIn("OPEN A CASE", m.group(1))
        self.assertIn("FORM 01", m.group(1))

    def test_eyebrow_not_in_lede(self):
        m = re.search(r'<div class="intake-lede">(.*?)</div>\s*<div class="intake-formwrap">', HTML, re.S)
        self.assertIsNotNone(m)
        self.assertNotIn("sheet-eyebrow", m.group(1))


class N5FontStack(unittest.TestCase):
    def test_no_rye_or_anton_anywhere(self):
        for name, text in (("index.html", HTML), ("styles.css", CSS)):
            self.assertNotIn("rye", text.lower(), name)
            self.assertNotIn("anton", text.lower(), name)

    def test_font_assets_removed(self):
        fonts = ROOT / "assets" / "fonts"
        for gone in ("rye.woff2", "rye.ttf", "anton.woff2", "anton.ttf"):
            self.assertFalse((fonts / gone).exists(), gone)
        for kept in ("special-elite.woff2", "source-sans-3-regular-variable.woff2",
                     "source-sans-3-italic-variable.woff2"):
            self.assertTrue((fonts / kept).exists(), kept)

    def test_three_families_only(self):
        faces = re.findall(r"@font-face\s*\{[^}]*font-family:\s*'([^']+)'", CSS)
        self.assertEqual(sorted(set(faces)), ["Source Sans 3", "Special Elite"])
        self.assertNotIn("--font-head", CSS)
        self.assertRegex(CSS, r"--font-display:\s*'Special Elite'")

    def test_former_anton_elements_retuned(self):
        for selector in (r"\.headline", r"\.step-num", r"\.case-opened-title"):
            blocks = re.findall(selector + r"\s*\{([^}]*)\}", CSS)
            self.assertTrue(blocks, selector)
            joined = " ".join(blocks)
            self.assertNotIn("--font-head", joined)


if __name__ == "__main__":
    unittest.main()
