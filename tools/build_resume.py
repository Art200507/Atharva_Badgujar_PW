"""Build the downloadable portfolio résumé draft. Requires reportlab."""
import json
from pathlib import Path
from html import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'dist/portfolio-data.js').read_text().split('=', 1)[1].strip().rstrip(';'))
for name, filename in [('Sans', 'DejaVuSans.ttf'), ('SansBold', 'DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, '/usr/share/fonts/truetype/dejavu/' + filename))
styles = {
    'name': ParagraphStyle('name', fontName='SansBold', fontSize=24, leading=30, textColor=HexColor('#152c3d'), spaceAfter=7),
    'section': ParagraphStyle('section', fontName='SansBold', fontSize=11, leading=15, textColor=HexColor('#285d7b'), spaceBefore=13, spaceAfter=9),
    'title': ParagraphStyle('title', fontName='SansBold', fontSize=9, leading=12, spaceAfter=3),
    'meta': ParagraphStyle('meta', fontName='Sans', fontSize=8, leading=11, textColor=HexColor('#435769'), spaceAfter=4),
    'body': ParagraphStyle('body', fontName='Sans', fontSize=9, leading=13, spaceAfter=8),
}
story = []
def p(text, style='body'):
    return Paragraph(escape(text), styles[style])
def heading(text):
    story.append(p(text, 'section'))
def card(id, description=True):
    c = data['cards'][id]
    parts = [p(c['title'], 'title'), p(c['meta'] + (' | ' + c['dates'] if c.get('dates') else ''), 'meta')]
    if description:
        parts.append(p(c['description']))
    story.append(KeepTogether(parts))
def footer(canvas, doc):
    canvas.setFont('Sans', 7)
    canvas.setFillColor(HexColor('#536678'))
    canvas.drawString(42, 28, 'Résumé draft · Based on portfolio entries · Education details pending')
    canvas.drawRightString(553, 28, str(doc.page))

story += [p('Atharva Badgujar', 'name'), Paragraph('<link href="mailto:abadguja@buffalo.edu">abadguja@buffalo.edu</link>', styles['meta']), p('Machine learning, data systems, and products that connect technical ideas with human needs.')]
for title, key in [('Research & professional experience', 'research-experience'), ('Teaching & general experience', 'general-experience')]:
    heading(title)
    for id in data['rows'][key]['ids']:
        card(id)
story += [PageBreak(), p('Selected work & leadership', 'name')]
heading('Research & engineering')
for id in ['wn4ss-project', 'qcnn', 'middleman-project', 'mindmirror-project', 'schema-project']:
    card(id)
heading('Leadership')
for id in data['rows']['leadership-experience']['ids']:
    card(id, description=False)
SimpleDocTemplate(str(ROOT / 'dist/resume.pdf'), pagesize=(595,842), rightMargin=42, leftMargin=42, topMargin=38, bottomMargin=45, title='Atharva Badgujar — Résumé Draft', author='Atharva Badgujar').build(story, onFirstPage=footer, onLaterPages=footer)
