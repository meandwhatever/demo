#!/usr/bin/env python3

import sys
import json
import os
import openai
import re


def parse_history(arg: str):
    """Decode the JSON history passed from Next.js and convert it to the
    format expected by OpenAI (list of {role, content} dicts)."""
    try:
        raw = json.loads(arg)
        if not isinstance(raw, list):
            raise TypeError("History must be a list")
    except Exception as exc:
        sys.stderr.write(f"AI reply: ERROR: invalid history JSON: {exc}\n")
        sys.exit(1)

    messages = []
    for msg in raw:
        role = msg.get("from")
        content = msg.get("message", "")
        if role == "user":
            messages.append({"role": "user", "content": content})
        elif role == "ai":
            messages.append({"role": "assistant", "content": content})
        # unknown roles are ignored silently
    return messages


def main():
    if len(sys.argv) < 2:
        sys.stderr.write("AI reply: ERROR: no history provided\n")
        sys.exit(1)

    messages = parse_history(sys.argv[1])

    # Optional system prompt
    system_prompt = """You are given a description of a product and you need to classify it into HS code.
     answer in only json format with the following keys:
     {
     "hs_code": the HS code of the product
     "confidence": the confidence score of the answer(give full number 0 to 100)
     "product_title": what this product is
     "product_description": the more detailed description of the product
     "first_two_digits": the first two digits of the HS code
     "broader_description": what the first two digits of the HS code mean
     }
     output only valid json format, meaning no backslashes
     """
    if system_prompt:
        messages.insert(0, {"role": "system", "content": system_prompt})

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        sys.stderr.write("AI reply: ERROR: OPENAI_API_KEY not set\n")
        sys.exit(1)

    # --- New openai‑python ≥1.0 style ---
    client = openai.OpenAI(api_key=api_key)

    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=1,
            max_tokens=8192,
        )
        answer = resp.choices[0].message.content.strip()

        # ── Clean up leading ```json / ``` … and trailing ``` ──────────────
        if answer.startswith("```"):
            answer = re.sub(r"^\s*```(?:json)?\s*", "", answer, flags=re.IGNORECASE)
            answer = re.sub(r"\s*```\s*$", "", answer).strip()

        print({answer})
    except Exception as exc:
        sys.stderr.write(f"AI reply: ERROR calling OpenAI: {exc}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
