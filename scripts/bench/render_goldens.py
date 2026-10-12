#!/usr/bin/env python3
"""Render byte-exact reference prompts using each model's local tokenizer/chat template in ~/.omlx/models."""
import hashlib
import json
import os
import sys
from pathlib import Path
from jinja2 import Environment

MODELS_ROOT = Path(os.environ.get("CAREER_OPS_MODELS_DIR", Path.home() / ".omlx" / "models"))
SYSTEM = "You rewrite resume bullets."
USER = "Original bullet: Built a dashboard used by 300 agents."


def main() -> None:
    out_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("packages/core/tests/fixtures/prompt-goldens.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    msgs = [{"role": "system", "content": SYSTEM}, {"role": "user", "content": USER}]
    env = Environment(trim_blocks=True, lstrip_blocks=True)

    hem_jinja_path = MODELS_ROOT / "mlx-community" / "Hemmingway-1-OptiQ-4bit" / "chat_template.jinja"
    hem_tpl = env.from_string(hem_jinja_path.read_text(encoding="utf-8"))
    hem_rendered = hem_tpl.render(messages=msgs, add_generation_prompt=True, enable_thinking=False)

    qwen_tc_path = MODELS_ROOT / "mlx-community" / "Qwen3-8B-4bit" / "tokenizer_config.json"
    qwen_tc = json.loads(qwen_tc_path.read_text(encoding="utf-8"))
    qwen_tpl = env.from_string(qwen_tc["chat_template"])
    qwen_rendered = qwen_tpl.render(messages=msgs, add_generation_prompt=True, enable_thinking=False)

    pf_path = MODELS_ROOT / "cowWhySo" / "humanizer-12b-mlx-8bit" / "prompt_format.json"
    pf = json.loads(pf_path.read_text(encoding="utf-8"))
    draft = "Built a dashboard used by 300 agents."
    hum_rendered = pf["instr"] + "\n\n" + draft.strip() + pf["sep"]
    fingerprint = hashlib.sha256((pf["instr"] + "\n\nX" + pf["sep"]).encode("utf-8")).hexdigest()[:16]

    out = {
        "hemmingway": {"system": SYSTEM, "user": USER, "rendered": hem_rendered},
        "qwen3": {"system": SYSTEM, "user": USER, "rendered": qwen_rendered},
        "humanizer": {"draft": draft, "rendered": hum_rendered, "fingerprint": fingerprint},
    }
    out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {out_path} (fingerprint={fingerprint})")


if __name__ == "__main__":
    main()
