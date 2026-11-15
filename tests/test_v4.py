"""SPARC v4 contract tests (RED -> GREEN). Static checks on shipped files.
Run: python3 -m unittest discover -s tests -v
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text()
INTAKE = (ROOT / "intake.js").read_text()
ATMO = (ROOT / "atmosphere.js").read_text()
CSS = (ROOT / "styles.css").read_text()


def placeholders():
    return dict(re.findall(r'id="(f-[\w-]+)"[^>]*placeholder="([^"]*)"', HTML))


def select_options(select_id):
    m = re.search(r'<select id="%s".*?</select>' % select_id, HTML, re.S)
    assert m, "select %s missing" % select_id
    return re.findall(r'<option value="([^"]*)"[^>]*>([^<]*)</option>', m.group(0))


class T1Headline(unittest.TestCase):
    def test_rejected_copy_gone(self):
        self.assertNotIn("We find the thing", HTML)
        self.assertNotIn("that is <em", HTML)

    def test_cta_headline_present(self):
        flat = re.sub(r"<[^>]+>", "", HTML)
        flat = re.sub(r"\s+", " ", flat)
        self.assertIn("We find what's wrong before your users do.", flat)

    def test_accent_hooks_intact(self):
        self.assertIn('class="hl-wrong"', HTML)
        self.assertIn('class="hl-stop"', HTML)
        self.assertEqual(HTML.count('class="hl-line"'), 3)


class T2IntakeUx(unittest.TestCase):
    def test_instruction_placeholders(self):
        want = {
            "f-name": "Tell us who is opening the case.",
            "f-email": "Where the findings should reach you.",
            "f-org": "The company the case is opened for.",
            "f-product": "Name the product under investigation.",
            "f-platforms": "Every place the product runs.",
            "f-problem": "Describe the symptom in your own words.",
        }
        got = placeholders()
        for fid, text in want.items():
            self.assertEqual(got.get(fid), text, fid)

    def test_no_sample_data_anywhere_in_form(self):
        m = re.search(r'<form id="intake-form".*?</form>', HTML, re.S)
        self.assertIsNotNone(m)
        form = m.group(0)
        for sample in ["Alex Rivers", "alex@rivers.co", "Rivers Labs",
                       "Web, iOS, Android", "Unexpected error when uploading"]:
            self.assertNotIn(sample, form)
        self.assertNotIn('placeholder="Atlas"', form)

    def test_deadline_options_exact(self):
        opts = select_options("f-deadline")
        self.assertEqual([v for v, _ in opts], ["rush48", "1w", "2w", "negotiable"])
        self.assertEqual([t for _, t in opts], [
            "In 48 hours (rush charge applies)", "1 week", "2 weeks", "Negotiable"])
        self.assertIn('value="negotiable" selected', HTML)

    def test_budget_single_option(self):
        opts = select_options("f-budget")
        self.assertEqual(opts, [("undecided", "Undecided (scope first)")])

    def test_errors_simplified(self):
        self.assertNotIn("Required:", HTML)
        self.assertNotIn("Required:", INTAKE)
        self.assertEqual(HTML.count(">Required.</p>"), 6)


class T3Sigils(unittest.TestCase):
    def test_glyph_library_size(self):
        glyphs = re.findall(r"function (g_\w+)\s*\(", ATMO)
        self.assertGreaterEqual(len(glyphs), 16)
        self.assertIn("GLYPHS", ATMO)

    def test_glyph_randomized_per_sigil(self):
        self.assertRegex(ATMO, r"glyph:\s*Math\.floor\(Math\.random\(\)")

    def test_motion_randomized(self):
        # spin both directions, drift any direction (angle-based, not up-only)
        self.assertRegex(ATMO, r"s\.spin\s*=\s*\(Math\.random\(\)\s*-\s*0\.5\)")
        self.assertRegex(ATMO, r"Math\.random\(\)\s*\*\s*Math\.PI\s*\*\s*2")
        self.assertNotIn("vy: -3 - Math.random() * 6", ATMO)

    def test_glyph_reroll_on_wrap(self):
        self.assertRegex(ATMO, r"s\.glyph\s*=")

    def test_reduced_motion_and_nojs_paths_kept(self):
        self.assertIn("reduceMq.matches", ATMO)
        self.assertIn("visibilitychange", ATMO)


class Provenance(unittest.TestCase):
    def test_no_symbolikon_assets_ship(self):
        for name, text in [("index.html", HTML), ("styles.css", CSS),
                           ("intake.js", INTAKE), ("atmosphere.js", ATMO)]:
            self.assertNotIn("symbolikon", text.lower(), name)


if __name__ == "__main__":
    unittest.main()
