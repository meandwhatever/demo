#!/usr/bin/env python3
import sys
import json
import time
from io import BytesIO
from pathlib import Path
import base64
import os
from pdf2image import convert_from_path
from openai import OpenAI, OpenAIError

# ——— Configuration ———
API_KEY = os.getenv("OPENAI_API_KEY")
MODEL    = "o4-mini"
DELAY    = 1.0  # seconds between calls
OUT_DIR  = Path("mbl_json")
PROMPT   = """
You will be given a PDF file and you need to classify it into one of the above categories.
- mbl: Master Bill of Lading
- hbl: House Bill of Lading
- invoice: Commercial Invoice
- packing_list: Packing List

output only the short name (mbl, hbl, invoice, packing_list) of the category, nothing else. if you are not sure, output "other".

"""

def main():
    # 1. validate args
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} path/to/document.pdf", file=sys.stderr)
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    """print(pdf_path)"""
    if not pdf_path.is_file():
        print(f"Error: file not found: {pdf_path}", file=sys.stderr)
        sys.exit(2)

    # 2. render pages to images
    print(f"▶ Converting {pdf_path.name} to images…", file=sys.stderr)
    try:
        images = convert_from_path(str(pdf_path), dpi=300)
    except Exception as e:
        print("❌ PDF→image conversion failed:", e, file=sys.stderr)
        sys.exit(3)

    # 3. build the chat message blocks
    content_blocks = [
        {"type": "text", "text": PROMPT}
    ]
    for idx, img in enumerate(images, start=1):
        buf = BytesIO()
        img.save(buf, format="PNG")
        uri = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
        content_blocks.append({
            "type":      "image_url",
            "image_url": { "url": uri }
        })
        print(f"  • embedded page {idx}/{len(images)}", file=sys.stderr)

    # 4. send to OpenAI
    client = OpenAI(api_key=API_KEY)
    try:
        print("▶ Sending to OpenAI for JSON extraction…", file=sys.stderr)
        resp = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": PROMPT},
                {"role": "user",   "content": content_blocks},
            ],
            temperature=1
        )
    except OpenAIError as e:
        print("❌ OpenAI API error:", e, file=sys.stderr)
        sys.exit(4)

    # 5. parse and write out JSON
    filetype = resp.choices[0].message.content.strip()
    print(filetype.lower())
    return filetype

if __name__ == "__main__":
    main()