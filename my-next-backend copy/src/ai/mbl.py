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
PROMPT   = """\
You are to extract data from MBL documents and return the data in a structured JSON format.  
Only output valid JSON—no explanatory text.  **output only the JSON object**—no code fences, no extra text.
The JSON should be in the following schema:

{
  "shipper": {
    "name":              "",  // String
    "address":           "",  // String

  },
  "consignee": {
    "name":            "",  // String
    "address":         "",  // String

  },
  "notify_party": {
    "name":         "",  // String
    "address":      "",  // String

  },
  "shipment": {
    "mbl_number": "",  // String
    "carrier_scac_code":            "",  // String
    "carrier_booking_number":       "",  // String
    "vessel_name":                  "",  // String
    "voyage_number":                "",  // String
    "port_of_loading":              "",  // String
    "port_of_discharge":            "",  // String
    "place_of_receipt":             "",  // String
    "place_of_delivery":            "",  // String
    "place_of_release":             "",  // String
    "date_of_release":              null,  // String (ISO Date)
    "shipped_on_board_date":        null   // String (ISO Date)
    "mode":            "",  // String (e.g. "FCL", "LCL")
    "freight_term":    "",  // String (e.g. "Prepaid", "Collect")
    "freight_service": ""   // String (e.g. "Door‑to‑Door")
    "total_number_of_containers": null,  // Number (integer)
    "total_weight":               null,  // String (e.g. "10000 kg")
    "total_volume":               null,  // String (e.g. "10000 m3")
    "total_package":              null   // String (e.g. "10000 pcs")
  },


  "freight_charges": [
    {
      "charge_name": "",  // String
      "rate":        null,  // Number
      "quantity":    null,  // Number (integer)
      "unit(Currency)": "",  //String
      "amount":      null,  // Number
      "prepaid or collect":   "",  // String(write "prepaid" or "collect", or "" if not found)

    }
    // … repeat for each line item
  ],
  "containers": [
    {
      "container_number":            "",  // String
      "seal_number":                 "",  // String
      "container_type":              "",  // String
      "number_of_packages":          null,  // Number (integer)
      "package_uom":                 "",  // String
      "weight":                      null,  // Number
      "weight_uom":                  "",  // String
      "volume":                      null,  // Number
      "volume_uom":                  "",  // String
      "product_item_description":    "",  // String
      "product_item_hscode":         ""   // String
    }
    // … repeat for each container
  ]
}
"""


out_dir = Path("mbl_json")
out_dir.mkdir(parents=True, exist_ok=True)

def main():
    # 1. validate args
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} path/to/document.pdf", file=sys.stderr)
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    print(pdf_path)
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
    raw = resp.choices[0].message.content

    lines = raw.strip().splitlines()
    if lines[0].startswith("```"):
        lines = lines[1:]
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]

    clean = "\n".join(lines)

  
    try:
        data = json.loads(clean)
    except json.JSONDecodeError as e:
        print("❌ Failed to parse JSON:", e, file=sys.stderr)
        print("<< RAW RESPONSE >>", raw, file=sys.stderr)
        sys.exit(5)

    out_path = out_dir / f"{pdf_path.name}.json"    
    with open(out_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"✅ JSON saved to {out_path}")

if __name__ == "__main__":
    main()