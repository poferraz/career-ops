#!/usr/bin/env bash
# convert.sh — Convert career-ops for use with other AI coding agents
# Usage: bash scripts/convert.sh <platform>
# Supported: codex, gemini, cursor, antigravity, windsurf, opencode

set -euo pipefail

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

# Collect all reference content into a single block
collect_references() {
    local refs=""
    for ref in "$PROJECT_DIR"/references/*.md; do
        [[ "$(basename "$ref")" == ".gitkeep" ]] && continue
        refs+="$(cat "$ref")"
        refs+=$'\n\n---\n\n'
    done
    echo "$refs"
}

# Read SKILL.md content
read_skill() {
    cat "$PROJECT_DIR/SKILL.md"
}

# Strip YAML frontmatter from SKILL.md
strip_frontmatter() {
    local content
    content="$(read_skill)"
    if [[ "$content" == ---* ]]; then
        echo "$content" | sed '1,/^---$/{ /^---$/!d; /^---$/d; }' | sed '1{ /^---$/d; }'
    else
        echo "$content"
    fi
}

# Build a single consolidated file from SKILL.md + all references
build_consolidated() {
    local skill_body
    skill_body="$(strip_frontmatter)"

    cat <<CONSOLIDATED
${skill_body}

---

# Reference Files

The following reference modules are loaded on demand based on the routing table above.

$(collect_references)
CONSOLIDATED
}

convert_codex() {
    local out="$OUTPUT_DIR/codex"
    mkdir -p "$out"
    echo "Converting for Codex..."

    # Codex uses AGENTS.md at repo root
    {
        echo "# career-ops"
        echo ""
        build_consolidated
    } > "$out/AGENTS.md"

    echo "Output: $out/AGENTS.md"
    echo "Install: Copy AGENTS.md to your project root"
}

convert_gemini() {
    local out="$OUTPUT_DIR/gemini"
    mkdir -p "$out"
    echo "Converting for Gemini CLI..."

    # Gemini CLI uses GEMINI.md
    {
        echo "# career-ops"
        echo ""
        build_consolidated
    } > "$out/GEMINI.md"

    echo "Output: $out/GEMINI.md"
    echo "Install: Copy GEMINI.md to your project root or pass with --context flag"
}

convert_cursor() {
    local out="$OUTPUT_DIR/cursor/rules"
    mkdir -p "$out"
    echo "Converting for Cursor..."

    # Cursor uses .cursor/rules/ with individual .md files
    # Write the main skill as the primary rule
    strip_frontmatter > "$out/career-ops.md"

    # Write each reference as a separate rule file
    for ref in "$PROJECT_DIR"/references/*.md; do
        [[ "$(basename "$ref")" == ".gitkeep" ]] && continue
        local basename
        basename="$(basename "$ref")"
        cp "$ref" "$out/career-ops-${basename}"
    done

    echo "Output: $out/"
    echo "Install: Copy contents of $out/ into your .cursor/rules/ directory"
}

convert_antigravity() {
    local out="$OUTPUT_DIR/antigravity"
    mkdir -p "$out"
    echo "Converting for Antigravity..."

    # Antigravity uses a prompts directory with a single system prompt
    {
        echo "# career-ops"
        echo ""
        build_consolidated
    } > "$out/career-ops.md"

    echo "Output: $out/career-ops.md"
    echo "Install: Copy career-ops.md to your Antigravity prompts directory"
}

convert_windsurf() {
    local out="$OUTPUT_DIR/windsurf"
    mkdir -p "$out"
    echo "Converting for Windsurf..."

    # Windsurf uses .windsurfrules at project root
    {
        echo "# career-ops"
        echo ""
        build_consolidated
    } > "$out/.windsurfrules"

    echo "Output: $out/.windsurfrules"
    echo "Install: Copy .windsurfrules to your project root"
}

convert_opencode() {
    local out="$OUTPUT_DIR/opencode"
    mkdir -p "$out"
    echo "Converting for OpenCode..."

    # OpenCode uses AGENTS.md
    {
        echo "# career-ops"
        echo ""
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
