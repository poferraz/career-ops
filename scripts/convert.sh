#!/usr/bin/env bash
# Export Career Ops without installing anything in the user's project.
set -euo pipefail

readonly ALL_PLATFORMS=(codex gemini cursor antigravity windsurf opencode)

project_dir="$(CDPATH='' cd -P -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
active_staging=""
active_out=""

usage() {
    cat <<'EOF'
Usage: scripts/convert.sh <platform|all>

Export Career Ops without installing anything in the user's project.

Platforms:
  codex        Generate dist/codex/ (AGENTS.md + career-ops/)
  gemini       Generate dist/gemini/ (GEMINI.md + career-ops/)
  opencode     Generate dist/opencode/ (AGENTS.md + career-ops/)
  cursor       Generate dist/cursor/ (career-ops/ -> .cursor/skills/career-ops/)
  antigravity  Generate dist/antigravity/ (career-ops/ -> .agents/skills/career-ops/)
  windsurf     Generate dist/windsurf/ (career-ops/ -> .windsurf/skills/career-ops/)
  all          Export all six platforms sequentially

Options:
  -h, --help   Show this help message and exit
EOF
}

finish() {
    local status=$?
    # If publishing was interrupted, restore the previous complete export.
    if [[ -n "$active_staging" ]]; then
        if [[ ( -e "$active_staging/previous" || -L "$active_staging/previous" ) && ! -e "$active_out" && ! -L "$active_out" ]]; then
            mv -- "$active_staging/previous" "$active_out" || status=1
        fi
        rm -rf -- "$active_staging"
        active_staging=""
        active_out=""
    fi
    return "$status"
}

extract_routes() {
    local skill_file="$1"
    awk '
        { sub(/\r$/, "") }
        $0 == "## Routing Table" { in_section = 1; next }
        in_section && (/^# / || /^## /) { in_section = 0 }
        in_section && /^\|/ {
            line = $0
            while (match(line, /`[^`]+`/)) {
                token = substr(line, RSTART + 1, RLENGTH - 2)
                if (token ~ /^references\//) {
                    print token
                }
                line = substr(line, RSTART + RLENGTH)
            }
        }
    ' "$skill_file" | LC_ALL=C sort -u
}

render_entry_file() {
    local skill_file="$1"
    local dest_file="$2"
    # Root instruction files use project-relative paths. Remove only the
    # opening YAML block; the remaining horizontal rules belong to the skill.
    # Rewrite references/ only when not preceded by / or [A-Za-z0-9_-].
    awk '
        function rewrite_refs(line,    out, pos, prev) {
            out = ""
            while ((pos = index(line, "references/")) > 0) {
                if (pos > 1) {
                    prev = substr(line, pos - 1, 1)
                } else if (length(out) > 0) {
                    prev = substr(out, length(out), 1)
                } else {
                    prev = ""
                }
                if (prev != "" && index("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-/", prev) > 0) {
                    out = out substr(line, 1, pos + 10)
                } else {
                    out = out substr(line, 1, pos - 1) "career-ops/references/"
                }
                line = substr(line, pos + 11)
            }
            return out line
        }
        { sub(/\r$/, "") }
        NR == 1 && $0 == "---" { frontmatter = 1; next }
        frontmatter && $0 == "---" { frontmatter = 0; next }
        !frontmatter { print rewrite_refs($0) }
        END { if (frontmatter) exit 1 }
    ' "$skill_file" > "$dest_file"
}

export_platform() {
    local platform="$1"
    local entry=""
    local skill_root=""

    case "$platform" in
        codex|opencode) entry=AGENTS.md ;;
        gemini) entry=GEMINI.md ;;
        cursor) skill_root=.cursor/skills ;;
        antigravity) skill_root=.agents/skills ;;
        windsurf) skill_root=.windsurf/skills ;;
        *)
            echo "Unknown platform: $platform" >&2
            usage >&2
            return 2
            ;;
    esac

    if [[ -L "$project_dir/dist" ]]; then
        echo "Refusing to write to symlinked dist directory: $project_dir/dist" >&2
        return 1
    fi
    if [[ -L "$project_dir/SKILL.md" ]]; then
        echo "Refusing to read symlinked skill file: $project_dir/SKILL.md" >&2
        return 1
    fi
    if [[ ! -f "$project_dir/SKILL.md" ]]; then
        echo "Skill file not found or not a regular file: $project_dir/SKILL.md" >&2
        return 1
    fi
    if [[ -L "$project_dir/references" ]]; then
        echo "Refusing to read from symlinked references directory: $project_dir/references" >&2
        return 1
    fi

    local out="$project_dir/dist/$platform"
    local staging="$project_dir/dist/.$platform-build"
    mkdir -p -- "$project_dir/dist"

    if ! mkdir -- "$staging" 2>/dev/null; then
        if [[ -e "$staging" || -L "$staging" ]]; then
            echo "An export is already in progress at $staging. Inspect it before retrying." >&2
        else
            echo "Failed to create staging directory at $staging." >&2
        fi
        return 1
    fi

    active_staging="$staging"
    active_out="$out"
    trap finish EXIT
    trap 'exit 129' HUP
    trap 'exit 130' INT
    trap 'exit 143' TERM

    local bundle="$staging/new/career-ops"
    mkdir -p -- "$bundle/references"

    # Copy only the modules the public routing table names. A local profile or a
    # personal note alongside the reference files must never enter the export.
    local routes
    routes="$(extract_routes "$project_dir/SKILL.md")"
    if [[ -z "$routes" ]]; then
        echo "The skill routing table did not name any reference modules." >&2
        return 1
    fi

    local route
    local route_re='^references/[a-z0-9][a-z0-9-]*\.md$'
    while IFS= read -r route; do
        if [[ ! "$route" =~ $route_re ]]; then
            echo "Invalid reference route in routing table: $route" >&2
            return 1
        fi
        if [[ -L "$project_dir/$route" ]]; then
            echo "Refusing to copy symlinked reference file: $project_dir/$route" >&2
            return 1
        fi
        if [[ ! -f "$project_dir/$route" ]]; then
            echo "Referenced module not found or not a regular file: $project_dir/$route" >&2
            return 1
        fi
        cp -- "$project_dir/$route" "$bundle/$route"
    done <<< "$routes"

    if [[ -n "$entry" ]]; then
        render_entry_file "$project_dir/SKILL.md" "$staging/new/$entry"
    else
        cp -- "$project_dir/SKILL.md" "$bundle/SKILL.md"
    fi

    # Replace this platform's generated output together, so stale rules or notes
    # from an older export cannot be copied during installation.
    if [[ -e "$out" || -L "$out" ]]; then
        mv -- "$out" "$staging/previous"
    fi
    mv -- "$staging/new" "$out"

    rm -rf -- "$staging"
    active_staging=""
    active_out=""
    trap - EXIT HUP INT TERM

    if [[ -n "$entry" ]]; then
        echo "Install $out/$entry and $out/career-ops/ together in your career project root."
        echo "If the project already has $entry, merge the instructions into that file."
    else
        echo "Install the complete $out/career-ops/ directory at $skill_root/career-ops/ in your project."
    fi
}

main() {
    if [[ $# -eq 1 && ( "$1" == "-h" || "$1" == "--help" ) ]]; then
        usage
        exit 0
    fi
    if [[ $# -ne 1 ]]; then
        usage >&2
        exit 2
    fi

    local target="$1"
    if [[ "$target" == "all" ]]; then
        local platform
        for platform in "${ALL_PLATFORMS[@]}"; do
            export_platform "$platform"
        done
        return 0
    fi

    export_platform "$target"
}

main "$@"
