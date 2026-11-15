"""SPARC v6 contract tests (MW-7 content round). RED -> GREEN.
Run: python3 -m unittest discover -s tests -v
"""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = (ROOT / "index.html").read_text()
CSS = (ROOT / "styles.css").read_text()
INTAKE = (ROOT / "intake.js").read_text()


def flat(text):
    text = text.replace("&nbsp;", " ").replace("&amp;", "&")
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", text))


def contact_list():
    m = re.search(r'<dl class="contact-list">(.*?)</dl>', HTML, re.S)
    assert m, "contact-list missing"
    return m.group(1)


class C1ContactChannel(unittest.TestCase):
    def test_no_email_placeholder_or_mailto(self):
        self.assertNotIn("[contact email pending]", HTML)
        self.assertNotIn("mailto:", HTML)
        self.assertNotIn("[contact", HTML)

    def test_contact_row_links_to_form_with_explanation(self):
        cl = contact_list()
        self.assertIn("<dt>Contact</dt>", cl)
        self.assertNotIn("<dt>Email</dt>", cl)
        self.assertIn('href="#intake"', cl)
        f = flat(cl).lower()
        self.assertIn("intake form", f)
        self.assertIn("confidential", f)

    def test_form_fail_no_dead_email_reference(self):
        m = re.search(r'id="form-fail"[^>]*>([^<]*)<', HTML)
        self.assertIsNotNone(m)
        self.assertNotIn("address in the case notes", m.group(1))
        self.assertIn("Try again", m.group(1))


class C2HoursAndPromise(unittest.TestCase):
    def test_hours_247(self):
        cl = contact_list()
        self.assertIn("<dt>Hours</dt>", cl)
        self.assertNotIn("[hours pending]", HTML)
        self.assertIn("24/7", flat(cl))

    def test_reply_within_24_hours_in_contact(self):
        self.assertIn("within 24 hours", flat(contact_list()))

    def test_no_business_day_promises_left(self):
        f = flat(HTML).lower()
        self.assertNotIn("business day", f)

    def test_24_hour_promise_at_each_site(self):
        f = flat(HTML)
        for site in (r'<p class="lede-note">(.*?)</p>',
                     r'<p class="reassurance">(.*?)</p>',
                     r'<p class="case-opened-body">(.*?)</p>'):
            m = re.search(site, HTML, re.S)
            self.assertIsNotNone(m, site)
            self.assertIn("24 hours", flat(m.group(1)), site)
        self.assertIn("reads the form within 24 hours", f)
        self.assertIn("replies within 24 hours", f)
        self.assertIn("Intake is read within 24 hours", f)


class C3FindingRemoved(unittest.TestCase):
    def test_finding_block_gone(self):
        self.assertNotIn('class="finding"', HTML)
        self.assertNotIn("Sample finding", HTML)
        self.assertNotIn("[pending real report]", HTML)
        self.assertNotIn("sev-tag", HTML)
        self.assertNotIn("expected-observed", HTML)

    def test_files_table_stays(self):
        self.assertIn('class="files-table"', HTML)
        self.assertIn("No fabricated entries ship", HTML)

    def test_dead_css_removed(self):
        for sel in (r"\.finding\b", r"\.sev-tag\b", r"\.expected-observed\b"):
            self.assertIsNone(re.search(sel, CSS), sel)


class C4QuoteRemoved(unittest.TestCase):
    def test_pullquote_gone(self):
        self.assertNotIn("pullquote", HTML)
        self.assertNotIn("quote-sigil", HTML)
        self.assertNotIn("<blockquote", HTML)
        self.assertNotIn("What we find stays found", HTML)

    def test_dead_css_removed(self):
        for sel in (r"\.pullquote\b", r"\.quote-sigil\b", r"sigil-turn"):
            self.assertIsNone(re.search(sel, CSS), sel)

    def test_reveal_selector_cleaned(self):
        m = re.search(r"querySelectorAll\('([^']*sheet-head[^']*)'\)", INTAKE)
        self.assertIsNotNone(m)
        self.assertNotIn(".finding", m.group(1))
        self.assertNotIn(".pullquote", m.group(1))
        self.assertIn(".contact-block", m.group(1))


class C5NotesLayoutIntact(unittest.TestCase):
    def test_notes_grid_still_faq_and_desk(self):
        self.assertIn('class="faq"', HTML)
        self.assertIn('class="contact-block"', HTML)
        self.assertIn("#notes .contact-block", CSS)
        self.assertNotIn("#notes .pullquote", CSS)


if __name__ == "__main__":
    unittest.main()