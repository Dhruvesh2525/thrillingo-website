import fitz
import os

pdf_dir = "Thrillingo pdf"
files = [
    "Ultimate Bali & Nusa Penida Adventure 6N7D's Tripstars Holidays_compressed.pdf",
    "Kedarnath_The_Call_of_Mahadev_Star_Holiday .pdf_20260226_161007_0000.pdf"
]

html = "<html><body>"
for f in files:
    path = os.path.join(pdf_dir, f)
    if not os.path.exists(path): continue
    try:
        doc = fitz.open(path)
        html += f"<h1>{f}</h1>"
        for i, page in enumerate(doc):
            pix = page.get_pixmap(dpi=150)
            img_name = f"{f.replace(' ', '_')}_page_{i}.png"
            pix.save(img_name)
            html += f"<img src='{img_name}' style='max-width:100%; border:1px solid #ccc;'><br>"
        html += "<hr>"
    except Exception as e:
        print(e)
html += "</body></html>"

with open("pdf_all_pages.html", "w") as f:
    f.write(html)
