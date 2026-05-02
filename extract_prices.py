import os
import re
try:
    import PyPDF2
except ImportError:
    os.system('pip3 install PyPDF2')
    import PyPDF2

pdf_dir = "Thrillingo pdf"
files = [
    "Dubai Itinerary.pdf",
    "Vietnam Thrillingo.pdf",
    "Ultimate Bali & Nusa Penida Adventure 6N7D's Tripstars Holidays_compressed.pdf",
    "Thailand.pdf",
    "Kashmir Thrillingo.pdf",
    "SHIMAL+KULLU+MANALI+KASOL THRILLINGO.pdf",
    "THRILLINGO WITH GOA.pdf",
    "Jaisalmer Thrillingo Winter Season.pdf",
    "Kedarnath_The_Call_of_Mahadev_Star_Holiday .pdf_20260226_161007_0000.pdf",
    "Spiti valley_20260418_212043_0000.pdf",
    "Zanskar Valley 6N7D - 2026.pdf.pdf",
    "Hampta Pass Trek 2026.pdf"
]

for f in files:
    path = os.path.join(pdf_dir, f)
    if not os.path.exists(path):
        print(f"NOT FOUND: {f}")
        continue
    
    try:
        reader = PyPDF2.PdfReader(path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        # look for lines with price
        lines = text.split('\n')
        print(f"\n--- {f} ---")
        price_lines = []
        for i, line in enumerate(lines):
            if '₹' in line or 'INR' in line or 'Rs' in line or 'price' in line.lower() or 'cost' in line.lower() or '/-' in line:
                # get context
                context = ' '.join(lines[max(0, i-1):min(len(lines), i+2)])
                price_lines.append(context)
        
        # print first few matches
        for p in list(set(price_lines))[:5]:
            print(p)
            
    except Exception as e:
        print(f"Error reading {f}: {e}")
