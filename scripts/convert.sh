#!/usr/bin/env bash
# convert.sh — Convert career-ops for use with other AI coding agents
# Usage: bash scripts/convert.sh <platform>
# Supported: codex, gemini, cursor, antigravity, windsurf, opencode

set -euo pipefail
shopt -s nullglob

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="$PROJECT_DIR/dist"

usage() {
    cat <<'USAGE'
Usage: bash scripts/convert.sh <platform>

Supported platforms:
  codex        — OpenAI Codex (AGENTS.md format)
  gemini       — Google Gemini CLI (GEMINI.md format)
  cursor       — Cursor IDE (.cursor/rules/ format)
  antigravity  — Antigravity (prompts/ directory format)
  windsurf     — Windsurf (.windsurfrules format)
  opencode     — OpenCode (AGENTS.md format)

Output is written to dist/<platform>/
USAGE
    exit 1
}

if [[ $# -lt 1 ]]; then
    usage
fi

PLATFORM="$1"

# Stream all reference content directly to stdout
stream_references() {
    for ref in "$PROJECT_DIR"/references/*.md; do
        [[ "$(basename "$ref")" == ".gitkeep" ]] && continue
        cat "$ref"
        printf "\n\n---\n\n"
    done
}

# Stream SKILL.md body (stripping YAML frontmatter) to stdout
stream_skill_body() {
    local skill_file="$PROJECT_DIR/SKILL.md"
    # Check if file starts with frontmatter
    if head -n 1 "$skill_file" | grep -q "^---$"; then
        # Skip everything between the first and second '---'
        sed '1,/^---$/d' "$skill_file" | sed '1,/^---$/d'
    else
        cat "$skill_file"
    fi
}

# Consolidate SKILL.md body and all references
build_consolidated() {
    stream_skill_body
    printf "\n---\n\n# Reference Files\n\nThe following reference modules are loaded on demand based on the routing table above.\n\n"
    stream_references
}

convert_codex() {
    local out="$OUTPUT_DIR/codex"
    mkdir -p "$out"
    echo "Converting for Codex..."

    {
        printf "# career-ops\n\n"
        build_consolidated
    } > "$out/AGENTS.md"

    echo "Output: $out/AGENTS.md"
    echo "Install: Copy AGENTS.md to your project root"
}

convert_gemini() {
    local out="$OUTPUT_DIR/gemini"
    mkdir -p "$out"
    echo "Converting for Gemini CLI..."

    {
        printf "# career-ops\n\n"
        build_consolidated
    } > "$out/GEMINI.md"

    echo "Output: $out/GEMINI.md"
    echo "Install: Copy GEMINI.md to your project root or pass with --context flag"
}

convert_cursor() {
    local out="$OUTPUT_DIR/cursor/rules"
    mkdir -p "$out"
    echo "Converting for Cursor..."

    stream_skill_body > "$out/career-ops.md"

    for ref in "$PROJECT_DIR"/references/*.md; do
        [[ "$(basename "$ref")" == ".gitkeep" ]] && continue
        cp "$ref" "$out/career-ops-$(basename "$ref")"
    done

    echo "Output: $out/"
    echo "Install: Copy contents of $out/ into your .cursor/rules/ directory"
}

convert_antigravity() {
    local out="$OUTPUT_DIR/antigravity"
    mkdir -p "$out"
    echo "Converting for Antigravity..."

    {
        printf "# career-ops\n\n"
        build_consolidated
    } > "$out/career-ops.md"

    echo "Output: $out/career-ops.md"
    echo "Install: Copy career-ops.md to your Antigravity prompts directory"
}

convert_windsurf() {
    local out="$OUTPUT_DIR/windsurf"
    mkdir -p "$out"
    echo "Converting for Windsurf..."

    {
        printf "# career-ops\n\n"
        build_consolidated
    } > "$out/.windsurfrules"

    echo "Output: $out/.windsurfrules"
    echo "Install: Copy .windsurfrules to your project root"
}

convert_opencode() {
    local out="$OUTPUT_DIR/opencode"
    mkdir -p "$out"
    echo "Converting for OpenCode..."

    {
        printf "# career-ops\n\n"
        build_consolidated
    } > "$out/AGENTS.md"

    echo "Output: $out/AGENTS.md"
    echo "Install: Copy AGENTS.md to your project root"
}

case "$PLATFORM" in
    codex)        convert_codex ;;
    gemini)       convert_gemini ;;
    cursor)       convert_cursor ;;
    antigravity)  convert_antigravity ;;
    windsurf)     convert_windsurf ;;
    opencode)     convert_opencode ;;
    *)
        echo "Error: Unknown platform '$PLATFORM'"
        echo ""
        usage
        ;;
esac

echo ""
echo "Done. Review the output before installing."
