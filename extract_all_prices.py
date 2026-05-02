import os
import fitz  # PyMuPDF
import re

pdf_dir = "Thrillingo pdf"
files = os.listdir(pdf_dir)
for f in files:
    if not f.endswith('.pdf'): continue
    path = os.path.join(pdf_dir, f)
    try:
        doc = fitz.open(path)
        text = ""
        for page in doc:
            text += page.get_text() + "\n"
        
        # look for typical price keywords
        print(f"\n======================\n{f}\n======================")
        lines = text.split('\n')
        for i, line in enumerate(lines):
            # Try to find currency symbols and digits
            if re.search(r'(₹|Rs|INR)\s*\d+[,0-9]*', line, re.IGNORECASE) or 'price' in line.lower() or 'cost' in line.lower():
                print(line.strip())
                # also print adjacent lines for context
                # print(f"  ctx: {lines[max(0, i-1)].strip()} | {lines[min(len(lines)-1, i+1)].strip()}")
    except Exception as e:
        print(f"Error: {e}")
