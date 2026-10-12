#!/usr/bin/env bash
# scripts/bench/mlx-bootstrap.sh — Verifies local oMLX runtime & sequential solo-model execution across all 3 models.
set -euo pipefail
OUT="${1:-docs/benchmarks/runtime-smoke.json}"
mkdir -p "$(dirname "$OUT")"

python3 - "$OUT" <<'PY'
import json, sys, time, urllib.request, urllib.error, hashlib
from pathlib import Path

settings_path = Path.home() / ".omlx" / "settings.json"
settings = json.loads(settings_path.read_text(encoding="utf-8"))
key = settings.get("auth", {}).get("api_key", "")
port = settings.get("server", {}).get("port", 6000)
base = f"http://127.0.0.1:{port}"

def req(method, path, body=None, timeout=180):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    r = urllib.request.Request(f"{base}{path}", data=data, method=method, headers={
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    })
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            return resp.status, json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode("utf-8"))

def wait_until_unloaded(target_id=None, timeout_s=30):
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        _, st = req("GET", "/v1/models/status")
        loaded = [m["id"] for m in st.get("models", []) if m.get("loaded") or m.get("is_loading")]
        if target_id is None and not loaded:
            return st
        if target_id is not None and target_id not in loaded:
            return st
        for mid in loaded:
            if target_id is None or mid == target_id:
                req("POST", f"/v1/models/{mid}/unload", {})
        time.sleep(0.25)
    raise RuntimeError(f"Timed out waiting for unload (target={target_id})")

wait_until_unloaded()

pf_path = Path.home() / ".omlx" / "models" / "cowWhySo" / "humanizer-12b-mlx-8bit" / "prompt_format.json"
pf = json.loads(pf_path.read_text(encoding="utf-8"))
fp = hashlib.sha256((pf["instr"] + "\n\nX" + pf["sep"]).encode("utf-8")).hexdigest()[:16]

results = {
    "endpoint": base,
    "fingerprint": fp,
    "fingerprint_ok": fp == "cc51d66b4c593fbe",
    "solo_residency_enforced": True,
    "stages": []
}

stages = [
    (
        "stage1_qwen3",
        "Qwen3-8B-4bit",
        "<|im_start|>user\nReply with exactly: OK<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n",
        {"max_tokens": 16, "temperature": 0}
    ),
    (
        "stage2_hemmingway",
        "Hemmingway-1-OptiQ-4bit",
        "<|im_start|>system\nRewrite the resume bullet. Keep every fact. Output one line.<|im_end|>\n<|im_start|>user\nWas responsible for migrating RabbitMQ to Kafka, reaching 250k events/sec.<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n",
        {"max_tokens": 64, "temperature": 0.2, "stop": ["<|im_end|>", "\n"]}
    ),
    (
        "stage3_humanizer",
        "humanizer-12b-mlx-8bit",
        pf["instr"] + "\n\nMigrated the messaging pipeline from RabbitMQ to Kafka, scaling throughput to 250k events/sec." + pf["sep"],
        {"max_tokens": 96, "temperature": 1.0, "top_p": 0.95, "top_k": 0}
    )
]

for stage_name, model_id, prompt, params in stages:
    wait_until_unloaded()
    t0 = time.perf_counter()
    code, res = req("POST", "/v1/completions", {"model": model_id, "prompt": prompt, **params})
    if code != 200:
        raise RuntimeError(f"{model_id} failed with {code}: {res}")
    elapsed = round(time.perf_counter() - t0, 2)
    _, st_during = req("GET", "/v1/models/status")
    loaded_during = [m["id"] for m in st_during["models"] if m["loaded"]]
    mem_during_gb = round(st_during["current_model_memory"] / 1e9, 2)
    st_after = wait_until_unloaded(model_id)
    loaded_after = [m["id"] for m in st_after["models"] if m["loaded"]]
    results["stages"].append({
        "stage": stage_name,
        "model": model_id,
        "loaded_during": loaded_during,
        "sole_resident": loaded_during == [model_id],
        "mem_during_gb": mem_during_gb,
        "loaded_after_unload": loaded_after,
        "elapsed_s": elapsed,
        "usage": res.get("usage", {}),
        "sample": res["choices"][0]["text"].strip()
    })

Path(sys.argv[1]).write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
print(json.dumps(results, indent=2))
PY
