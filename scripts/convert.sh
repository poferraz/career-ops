#!/usr/bin/env bash
# Export Career Ops without installing anything in the user's project.
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
platform="${1:-}"
if [[ $# -ne 1 ]]; then
    echo "Usage: bash scripts/convert.sh {codex|gemini|cursor|antigravity|windsurf|opencode}" >&2
    exit 1
fi

case "$platform" in
    codex|opencode) entry=AGENTS.md ;;
    gemini) entry=GEMINI.md ;;
    cursor) skill_root=.cursor/skills ;;
    antigravity) skill_root=.agents/skills ;;
    windsurf) skill_root=.windsurf/skills ;;
    *) echo "Unknown platform: $platform" >&2; exit 1 ;;
esac

out="$project_dir/dist/$platform"
mkdir -p "$project_dir/dist"
staging="$project_dir/dist/.$platform-build"
if ! mkdir "$staging"; then
    echo "An export is already in progress at $staging. Inspect it before retrying." >&2
    exit 1
fi

finish() {
    # If publishing was interrupted, restore the previous complete export.
    if [[ -d "$staging/previous" && ! -e "$out" ]]; then
        mv "$staging/previous" "$out" || return 1
    fi
    rm -rf "$staging"
}
trap finish EXIT
trap 'exit 1' HUP INT TERM
bundle="$staging/new/career-ops"
mkdir -p "$bundle/references"

# Copy only the modules the public routing table names. A local profile or a
# personal note alongside the reference files must never enter the export.
routes="$(sed -n 's/^|.*`\(references\/[^`/]*\.md\)` *|$/\1/p' "$project_dir/SKILL.md")"
if [[ -z "$routes" ]]; then
    echo "The skill routing table did not name any reference modules." >&2
    exit 1
fi
while IFS= read -r route; do
    cp "$project_dir/$route" "$bundle/$route"
done <<< "$routes"

if [[ -n "${entry:-}" ]]; then
    # Root instruction files use project-relative paths. Remove only the
    # opening YAML block; the remaining horizontal rules belong to the skill.
    awk '
        NR == 1 && $0 == "---" { frontmatter = 1; next }
        frontmatter && $0 == "---" { frontmatter = 0; next }
        !frontmatter { gsub(/references\//, "career-ops/references/"); print }
        END { if (frontmatter) exit 1 }
    ' "$project_dir/SKILL.md" > "$staging/new/$entry"
else
    cp "$project_dir/SKILL.md" "$bundle/SKILL.md"
fi

# Replace this platform's generated output together, so stale rules or notes
# from an older export cannot be copied during installation.
if [[ -e "$out" ]]; then
    mv "$out" "$staging/previous"
fi
mv "$staging/new" "$out"
if [[ -n "${entry:-}" ]]; then
    echo "Install $out/$entry and $out/career-ops/ together in your career project root."
    echo "If the project already has $entry, merge the instructions into that file."
else
    echo "Install the complete $out/career-ops/ directory at $skill_root/career-ops/ in your project."
fi
