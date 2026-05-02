import fitz
import os

pdf_dir = "Thrillingo pdf"
targets = {
    'kedarnath': 'Kedarnath_The_Call_of_Mahadev_Star_Holiday .pdf_20260226_161007_0000.pdf',
    'spiti': 'Spiti valley_20260418_212043_0000.pdf',
    'hampta': 'Hampta Pass Trek 2026.pdf',
    'zanskar': 'Zanskar Valley 6N7D - 2026.pdf.pdf',
    'bali': "Ultimate Bali & Nusa Penida Adventure 6N7D's Tripstars Holidays_compressed.pdf"
}

for key, fname in targets.items():
    path = os.path.join(pdf_dir, fname)
    if os.path.exists(path):
        text = ""
        doc = fitz.open(path)
        for page in doc:
            text += page.get_text() + "\n"
        with open(f"extracted_{key}.txt", "w") as f:
            f.write(text)
    else:
        print(f"Missing: {fname}")
