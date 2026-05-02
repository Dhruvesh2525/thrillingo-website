import fitz
import os

pdf_dir = "Thrillingo pdf"
out_dir = "assets/pdf-pages"
os.makedirs(out_dir, exist_ok=True)

pdfs = {
    'dubai': 'Dubai Itinerary.pdf',
    'vietnam': 'Vietnam Thrillingo.pdf',
    'thailand': 'Thailand.pdf',
    'kashmir': 'Kashmir Thrillingo.pdf',
    'shimla_manali': 'SHIMAL+KULLU+MANALI+KASOL THRILLINGO.pdf',
    'goa': 'THRILLINGO WITH GOA.pdf',
    'rajasthan': 'Jaisalmer Thrillingo Winter Season.pdf',
}

for dest_id, fname in pdfs.items():
    path = os.path.join(pdf_dir, fname)
    if not os.path.exists(path):
        print(f"Missing: {path}")
        continue
    doc = fitz.open(path)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=180)
        out_path = os.path.join(out_dir, f"{dest_id}_page_{i}.png")
        pix.save(out_path)
    print(f"Converted {fname}: {len(doc)} pages")
    doc.close()

print("Done!")
