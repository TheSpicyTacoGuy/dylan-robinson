"""Writes the CV as a Word file for resume uploads (Workforce Australia and the
like), from the same document the printable page is drawn from.

    python scripts/make-resume-docx.py

`src/resume/model.ts` is read through Node, so a role, a year or a stack is only
ever edited once. The Word file follows the printed layout but drops everything
a parser trips over: no tables, no text boxes, no images, no headers, no
columns. Dates and sections stay as ordinary paragraphs with real heading
styles, which is what an automated reader looks for.

Contact details that should not sit in a public repository (a phone number and
referees) are read from scripts/resume-private.json, which is git-ignored. With
no such file the CV still builds, it just says "Phone on request" and has no
References section.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

from docx import Document
from docx.enum.text import WD_LINE_SPACING, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "src" / "resume" / "model.ts"
PRIVATE = ROOT / "scripts" / "resume-private.json"
OUTPUT = ROOT / "dylan-robinson-resume.docx"

FOREST = RGBColor(0x2E, 0x35, 0x18)
INK = RGBColor(0x2B, 0x2A, 0x27)
MUTED = RGBColor(0x69, 0x65, 0x5D)
STRONG = RGBColor(0x1D, 0x1C, 0x1A)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)

SERIF = "Georgia"
SANS = "Arial"

GUTTER = Pt(100)
BODY = Pt(8.8)
LEADING = Pt(12)

# Schema order for w:pPr: everything that follows w:shd has to stay after it.
AFTER_SHD = (
    "w:tabs",
    "w:suppressAutoHyphens",
    "w:kinsoku",
    "w:wordWrap",
    "w:overflowPunct",
    "w:topLinePunct",
    "w:autoSpaceDE",
    "w:autoSpaceDN",
    "w:bidi",
    "w:adjustRightInd",
    "w:snapToGrid",
    "w:spacing",
    "w:ind",
    "w:contextualSpacing",
    "w:mirrorIndents",
    "w:suppressOverlap",
    "w:jc",
    "w:textDirection",
    "w:textAlignment",
    "w:textboxTightWrap",
    "w:outlineLvl",
    "w:divId",
    "w:cnfStyle",
    "w:rPr",
    "w:sectPr",
    "w:pPrChange",
)


def load_document() -> dict:
    """Ask Node for the same tree the printable page renders.

    esbuild (already installed with Vite) bundles the TypeScript first, so the
    extensionless imports that Vite resolves resolve here too.
    """
    esbuild = ROOT / "node_modules" / "esbuild" / "bin" / "esbuild"
    if not esbuild.exists():
        sys.exit("esbuild is missing. Run `npm install` first.")

    with tempfile.TemporaryDirectory() as folder:
        bundle = Path(folder) / "cv-model.mjs"
        subprocess.run(
            [
                "node",
                str(esbuild),
                str(MODEL),
                "--bundle",
                "--format=esm",
                "--log-level=warning",
                f"--outfile={bundle}",
            ],
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )

        script = (
            f"const m = await import({json.dumps(bundle.as_uri())});"
            "process.stdout.write(JSON.stringify(m.resume));"
        )
        result = subprocess.run(
            ["node", "--input-type=module", "-e", script],
            capture_output=True,
            text=True,
            encoding="utf-8",
        )

    if result.returncode != 0:
        sys.exit(f"Could not read the resume model:\n{result.stderr}")

    return json.loads(result.stdout)


def load_private() -> dict:
    if not PRIVATE.exists():
        return {}
    return json.loads(PRIVATE.read_text(encoding="utf-8"))


def set_font(target, name: str, size: Pt, *, bold: bool = False, color: RGBColor | None = None):
    """Set a font on a style or a run, clearing the theme fonts a style may carry."""
    font = target.font
    font.name = name
    font.size = size
    font.bold = bold
    if color is not None:
        font.color.rgb = color

    rPr = target.element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    for theme in ("w:asciiTheme", "w:hAnsiTheme", "w:eastAsiaTheme", "w:cstheme"):
        if rFonts.get(qn(theme)) is not None:
            del rFonts.attrib[qn(theme)]
    for attr in ("w:ascii", "w:hAnsi", "w:cs"):
        rFonts.set(qn(attr), name)


def shade(paragraph, fill: str):
    pPr = paragraph._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"), fill)
    pPr.insert_element_before(shd, *AFTER_SHD)


def bottom_rule(target, color: str, size_eighths: int = 6, space: int = 2):
    """A hairline under a section heading, drawn as a paragraph border."""
    pPr = target._p.get_or_add_pPr() if hasattr(target, "_p") else target.element.get_or_add_pPr()
    pBdr = pPr.find(qn("w:pBdr"))
    if pBdr is None:
        pBdr = OxmlElement("w:pBdr")
        pPr.insert_element_before(pBdr, "w:shd", *AFTER_SHD)
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), str(size_eighths))
    bottom.set(qn("w:space"), str(space))
    bottom.set(qn("w:color"), color)
    pBdr.append(bottom)


def drop_border(target, tag: str):
    pPr = target.element.get_or_add_pPr()
    pBdr = pPr.find(qn("w:pBdr"))
    if pBdr is None:
        return
    child = pBdr.find(qn(tag))
    if child is not None:
        pBdr.remove(child)


def style_document(doc: Document):
    normal = doc.styles["Normal"]
    set_font(normal, SANS, BODY, color=INK)
    fmt = normal.paragraph_format
    fmt.space_before = Pt(0)
    fmt.space_after = Pt(0)
    fmt.line_spacing = LEADING

    lang = OxmlElement("w:lang")
    lang.set(qn("w:val"), "en-AU")
    lang.set(qn("w:eastAsia"), "en-AU")
    normal.element.get_or_add_rPr().append(lang)

    title = doc.styles["Title"]
    set_font(title, SERIF, Pt(24), color=WHITE)
    title.paragraph_format.space_before = Pt(0)
    title.paragraph_format.space_after = Pt(0)
    title.paragraph_format.line_spacing = Pt(27)
    drop_border(title, "w:bottom")

    heading = doc.styles["Heading 1"]
    set_font(heading, SERIF, Pt(11), bold=True, color=FOREST)
    fmt = heading.paragraph_format
    fmt.space_before = Pt(8)
    fmt.space_after = Pt(4)
    fmt.keep_with_next = True
    fmt.line_spacing = Pt(14)
    bottom_rule(heading, "2E3518")


def banner(doc: Document, resume: dict, phone: str | None):
    def band(**kwargs):
        paragraph = doc.add_paragraph()
        fmt = paragraph.paragraph_format
        fmt.left_indent = Pt(8)
        fmt.right_indent = Pt(8)
        fmt.space_before = Pt(0)
        fmt.space_after = Pt(0)
        fmt.line_spacing = kwargs.pop("leading", LEADING)
        fmt.line_spacing_rule = WD_LINE_SPACING.EXACTLY
        shade(paragraph, "2E3518")
        return paragraph

    band(leading=Pt(12))

    name = doc.add_paragraph(style="Title")
    name.paragraph_format.left_indent = Pt(8)
    name.paragraph_format.right_indent = Pt(8)
    shade(name, "2E3518")
    name.add_run(resume["name"])

    band(leading=Pt(9))

    role = band(leading=Pt(13))
    run = role.add_run(resume["role"])
    set_font(run, SANS, Pt(10), color=WHITE)

    band(leading=Pt(8))

    items = [item["label"] for item in resume["contact"]]
    if phone:
        items = [phone if label == "Phone on request" else label for label in items]

    contact = band()
    run = contact.add_run(" · ".join(items))
    set_font(run, SANS, Pt(8), color=WHITE)

    band(leading=Pt(12))


def heading(doc: Document, text: str):
    paragraph = doc.add_paragraph(text, style="Heading 1")
    return paragraph


def prose(doc: Document, text: str, *, indent: Pt | None = None, space_before: Pt = Pt(3)):
    paragraph = doc.add_paragraph()
    fmt = paragraph.paragraph_format
    if indent is not None:
        fmt.left_indent = indent
    fmt.space_before = space_before
    run = paragraph.add_run(text)
    set_font(run, SANS, BODY, color=INK)
    return paragraph


def entry(doc: Document, item: dict):
    """Date in the gutter, title beside it, then the body. Nothing but paragraphs."""
    title = doc.add_paragraph()
    fmt = title.paragraph_format
    fmt.space_before = Pt(6)
    # A hanging indent keeps a wrapped title in its column: the date starts the
    # line at the margin, the tab jumps to the gutter, and any second line of the
    # title lines up under the first instead of falling back to the margin.
    fmt.left_indent = GUTTER
    fmt.first_line_indent = Pt(-100)
    fmt.tab_stops.add_tab_stop(GUTTER, WD_TAB_ALIGNMENT.LEFT)
    fmt.keep_with_next = True
    fmt.keep_together = True

    when = title.add_run(item["when"])
    set_font(when, SANS, Pt(8), color=MUTED)

    title.add_run("\t")

    label = title.add_run(item["title"])
    set_font(label, SANS, BODY, bold=True, color=STRONG)

    paragraphs = []

    for text in item.get("paragraphs") or []:
        paragraphs.append(prose(doc, text, indent=GUTTER))

    for point in item.get("points") or []:
        paragraph = doc.add_paragraph()
        fmt = paragraph.paragraph_format
        fmt.left_indent = Pt(111)
        fmt.first_line_indent = Pt(-11)
        fmt.space_before = Pt(2)
        run = paragraph.add_run("•  ")
        set_font(run, SANS, BODY, color=INK)
        run = paragraph.add_run(point)
        set_font(run, SANS, BODY, color=INK)
        paragraphs.append(paragraph)

    if item.get("note"):
        paragraphs.append(prose(doc, item["note"], indent=GUTTER, space_before=Pt(1)))

    if item.get("skills"):
        paragraph = doc.add_paragraph()
        fmt = paragraph.paragraph_format
        fmt.left_indent = GUTTER
        fmt.space_before = Pt(2)
        lead = paragraph.add_run("Skills · ")
        set_font(lead, SANS, Pt(8), color=FOREST)
        rest = paragraph.add_run(item["skills"])
        set_font(rest, SANS, Pt(8), color=MUTED)
        paragraphs.append(paragraph)

    # The title never sits alone at the foot of a page, and the closing skills
    # line never starts a page on its own. Other paragraphs may run over, which
    # is what a reader expects from a resume.
    if len(paragraphs) > 1:
        paragraphs[-2].paragraph_format.keep_with_next = True


def references(doc: Document, referees: list[dict]):
    """One referee per block, in reading order. Two columns read as one run-on
    sentence once a parser strips the tabs."""
    heading(doc, "References")
    for index, person in enumerate(referees):
        line = doc.add_paragraph()
        fmt = line.paragraph_format
        fmt.space_before = Pt(7 if index == 0 else 4)
        fmt.keep_with_next = True

        name = line.add_run(person["name"])
        set_font(name, SANS, BODY, bold=True, color=STRONG)

        role = line.add_run(f", {person['role']}")
        set_font(role, SANS, BODY, color=MUTED)

        phone = doc.add_paragraph()
        phone.paragraph_format.space_before = Pt(0)
        run = phone.add_run(person["phone"])
        set_font(run, SANS, BODY, color=INK)


def build(resume: dict, private: dict) -> Path:
    doc = Document()
    style_document(doc)

    section = doc.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    for edge in ("top_margin", "bottom_margin", "left_margin", "right_margin"):
        setattr(section, edge, Cm(1.38))

    properties = doc.core_properties
    properties.title = f"{resume['name']}, resume"
    properties.author = resume["name"]
    properties.subject = "Resume"
    properties.keywords = "software developer, resume, CV"

    banner(doc, resume, private.get("phone"))

    for block in resume["sections"]:
        heading(doc, block["heading"])

        if block["kind"] == "prose":
            for text in block["paragraphs"]:
                prose(doc, text)
        elif block["kind"] == "skills":
            prose(doc, " · ".join(block["items"]))
        else:
            for item in block["entries"]:
                entry(doc, item)

    if private.get("referees"):
        references(doc, private["referees"])

    doc.save(OUTPUT)
    return OUTPUT


if __name__ == "__main__":
    document = load_document()
    private = load_private()
    path = build(document, private)
    print(f"Wrote {path.relative_to(ROOT)}")
