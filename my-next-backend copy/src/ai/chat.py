#!/usr/bin/env python3
"""chat.py — CLI wrapper that receives the full chat history via argv[1]
and returns an assistant reply on stdout, prefixed with "AI reply: ".
Compatible with **openai‑python ≥ 1.0.0** (new client interface).
"""
import sys
import json
import os
import openai


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
        elif role == "system":
            messages.append({"role": "system", "content": content})
        # unknown roles are ignored silently
    return messages


def main():
    if len(sys.argv) < 2:
        sys.stderr.write("AI reply: ERROR: no history provided\n")
        sys.exit(1)

    messages = parse_history(sys.argv[1])

    # Optional system prompt
    system_prompt = """You are a helpful assistant that can answer questions and help with tasks. IMPORTANT: When user ask you about the task table, give that part of the answer in Strict JSON format.
    
    the json format example is:
    {
        "tasks": [
            {
                "id": 1,
                "name": "Task 1"
                "poNumber": "1234"
                "status": "Pending"
                "stackCount": 10
                "createdAt": "2021-01-01"

            }
        ]
    }
    
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
        print(answer)
    except Exception as exc:
        sys.stderr.write(f"AI reply: ERROR calling OpenAI: {exc}\n")
        sys.exit(1)


if __name__ == "__main__":
    main()
