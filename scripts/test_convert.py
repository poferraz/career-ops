"""Check the exported artifacts in a disposable project, without starting any AI host."""

import os
from pathlib import Path
import re
import shutil
import stat
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]
PLATFORMS = {
    "codex": ("AGENTS.md", "."),
    "gemini": ("GEMINI.md", "."),
    "opencode": ("AGENTS.md", "."),
    "cursor": (None, ".cursor/skills"),
    "antigravity": (None, ".agents/skills"),
    "windsurf": (None, ".windsurf/skills"),
}


def extract_routing_table_routes(skill_text: str) -> set[str]:
    """Extract reference routes strictly from the ## Routing Table section."""
    in_section = False
    routes: set[str] = set()
    for raw_line in skill_text.splitlines():
        line = raw_line.rstrip("\r")
        if line == "## Routing Table":
            in_section = True
            continue
        if in_section and (line.startswith("# ") or line.startswith("## ")):
            in_section = False
        if in_section and line.startswith("|"):
            for token in re.findall(r"`([^`]+)`", line):
                if token.startswith("references/"):
                    routes.add(token)
    return routes


def expected_entry_rewrite(body: str) -> str:
    """Mirror the intended boundary-aware path rewrite for entry files."""
    normalized = body.replace("\r\n", "\n")
    return re.sub(r"(?<![/A-Za-z0-9_-])references/", "career-ops/references/", normalized)


class ConvertTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.source = Path(temp.name) / "career ops"
        (self.source / "scripts").mkdir(parents=True)
        shutil.copy2(ROOT / "scripts/convert.sh", self.source / "scripts/convert.sh")
        shutil.copy2(ROOT / "SKILL.md", self.source / "SKILL.md")
        self.canonical = (self.source / "SKILL.md").read_text(encoding="utf-8")
        self.routes = extract_routing_table_routes(self.canonical)
        self.assertTrue(self.routes)
        (self.source / "references").mkdir()
        for route in self.routes:
            shutil.copy2(ROOT / route, self.source / route)

        (self.source / "session").mkdir()
        for path in ["session/user-profile.md", "references/personal-notes.md"]:
            (self.source / path).write_text("synthetic private fixture", encoding="utf-8")

    def convert(self, *args, check=True, cwd=None, env=None, direct=False):
        script = str(self.source / "scripts/convert.sh") if direct else "scripts/convert.sh"
        cmd = [script, *args] if direct else ["bash", script, *args]
        return subprocess.run(
            cmd,
            cwd=cwd or self.source,
            env=env,
            capture_output=True,
            text=True,
            check=check,
        )

    def staging_dirs(self) -> list[Path]:
        dist = self.source / "dist"
        if not dist.exists():
            return []
        return [p for p in dist.iterdir() if p.name.startswith(".") and p.name.endswith("-build")]

    def test_six_exports_preserve_the_skill_and_its_routed_modules(self):
        _, body = self.canonical.split("\n---\n", 1)
        self.assertIn("## Core Principle", body)
        self.assertIn("## Session Initialization", body)
        self.assertIn("## User Profile Persistence", body)
        for platform, (entry, location) in PLATFORMS.items():
            with self.subTest(platform=platform):
                result = self.convert(platform)
                export = self.source / "dist" / platform
                install = self.source.parent / "installed" / platform / location
                shutil.copytree(export, install)
                bundle = install / "career-ops"
                if entry:
                    self.assertIn(f"/{entry}", result.stdout)
                    self.assertIn("/career-ops/", result.stdout)
                    self.assertIn(f"already has {entry}", result.stdout)
                    self.assertEqual(
                        (install / entry).read_text(encoding="utf-8"),
                        expected_entry_rewrite(body),
                    )
                else:
                    self.assertIn(f"{location}/career-ops/", result.stdout)
                    self.assertEqual(
                        (bundle / "SKILL.md").read_text(encoding="utf-8"),
                        self.canonical,
                    )
                for route in self.routes:
                    self.assertEqual(
                        (bundle / route).read_bytes(),
                        (self.source / route).read_bytes(),
                    )
                expected = {Path("career-ops") / route for route in self.routes}
                expected.add(Path(entry or "career-ops/SKILL.md"))
                actual = {path.relative_to(export) for path in export.rglob("*") if path.is_file()}
                self.assertEqual(actual, expected)

    def test_rebuild_retires_obsolete_generated_instructions(self):
        legacy = self.source / "dist/cursor/rules/career-ops.md"
        legacy.parent.mkdir(parents=True)
        legacy.write_text("outdated profile instructions", encoding="utf-8")
        self.convert("cursor")
        self.assertFalse(legacy.exists())
        self.assertEqual(
            (self.source / "dist/cursor/career-ops/SKILL.md").read_text(encoding="utf-8"),
            self.canonical,
        )

    def test_failed_rebuild_keeps_previous_bundle(self):
        self.convert("codex")
        missing = min(self.routes)
        (self.source / missing).unlink()
        self.assertNotEqual(self.convert("codex", check=False).returncode, 0)
        prior = self.source / "dist/codex/career-ops" / missing
        self.assertEqual(prior.read_bytes(), (ROOT / missing).read_bytes())

    def test_help_flag_prints_usage_and_exits_zero(self):
        for flag in ("-h", "--help"):
            with self.subTest(flag=flag):
                result = self.convert(flag, check=False)
                self.assertEqual(result.returncode, 0)
                for token in (*PLATFORMS.keys(), "all"):
                    self.assertIn(token, result.stdout)

    def test_invalid_and_traversal_arguments_exit_two(self):
        cases = [
            (),
            ("unknown",),
            ("../etc",),
            ("codex", "gemini"),
        ]
        for args in cases:
            with self.subTest(args=args):
                result = self.convert(*args, check=False)
                self.assertEqual(result.returncode, 2)
                self.assertIn("Usage:", result.stderr)

    def test_all_target_exports_all_six_platforms_without_leftover_staging(self):
        result = self.convert("all")
        self.assertEqual(result.returncode, 0)
        for platform, (entry, _) in PLATFORMS.items():
            export = self.source / "dist" / platform
            self.assertTrue(export.is_dir(), f"Missing export for {platform}")
            target = export / (entry or "career-ops/SKILL.md")
            self.assertTrue(target.is_file(), f"Missing target file for {platform}")
        self.assertEqual(self.staging_dirs(), [])

    def test_symlinked_reference_file_is_rejected_without_leaking_data(self):
        secret = self.source.parent / "secret.txt"
        secret.write_text("TOP_SECRET_MARKER", encoding="utf-8")
        routed = self.source / "references/resume.md"
        routed.unlink()
        routed.symlink_to(secret)

        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("symlink", result.stderr.lower())
        self.assertFalse((self.source / "dist/codex").exists())
        self.assertEqual(self.staging_dirs(), [])
        for path in (self.source / "dist").rglob("*"):
            if path.is_file():
                self.assertNotIn("TOP_SECRET_MARKER", path.read_text(encoding="utf-8"))

    def test_symlinked_skill_and_dist_are_rejected(self):
        external_skill = self.source.parent / "external_skill.md"
        external_skill.write_text(self.canonical, encoding="utf-8")
        skill_path = self.source / "SKILL.md"
        skill_path.unlink()
        skill_path.symlink_to(external_skill)
        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("symlink", result.stderr.lower())

        skill_path.unlink()
        skill_path.write_text(self.canonical, encoding="utf-8")
        external_dist = self.source.parent / "external_dist"
        external_dist.mkdir()
        (self.source / "dist").symlink_to(external_dist)
        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("symlink", result.stderr.lower())

    def test_broken_symlink_at_output_is_cleanly_replaced(self):
        dist = self.source / "dist"
        dist.mkdir(parents=True, exist_ok=True)
        out = dist / "codex"
        out.symlink_to(self.source.parent / "does-not-exist")
        self.assertTrue(out.is_symlink())
        self.assertFalse(out.exists())

        result = self.convert("codex")
        self.assertEqual(result.returncode, 0)
        self.assertFalse(out.is_symlink())
        self.assertTrue(out.is_dir())
        self.assertTrue((out / "AGENTS.md").is_file())
        self.assertEqual(self.staging_dirs(), [])

    def test_preexisting_staging_lock_fails_without_clobbering_existing_export(self):
        self.convert("codex")
        original = (self.source / "dist/codex/AGENTS.md").read_text(encoding="utf-8")
        lock = self.source / "dist/.codex-build"
        lock.mkdir()
        marker = lock / "sentinel"
        marker.write_text("in-progress", encoding="utf-8")

        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("already in progress", result.stderr)
        self.assertEqual(
            (self.source / "dist/codex/AGENTS.md").read_text(encoding="utf-8"),
            original,
        )
        self.assertTrue(marker.is_file())

    def test_staging_directory_cleaned_up_on_success_and_failure(self):
        self.convert("gemini")
        self.assertEqual(self.staging_dirs(), [])

        missing = min(self.routes)
        (self.source / missing).unlink()
        result = self.convert("gemini", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.staging_dirs(), [])

    def test_rollback_restores_previous_export_on_swap_failure(self):
        self.convert("codex")
        original = (self.source / "dist/codex/AGENTS.md").read_text(encoding="utf-8")

        real_mv = shutil.which("mv")
        self.assertIsNotNone(real_mv)

        shim_dir = self.source.parent / "shim_bin"
        shim_dir.mkdir()
        count_file = self.source.parent / "mv_count.txt"
        count_file.write_text("0", encoding="utf-8")
        mv_shim = shim_dir / "mv"
        mv_shim.write_text(
            "#!/usr/bin/env bash\n"
            f'count_file="{count_file}"\n'
            'count="$(cat "$count_file")"\n'
            'count=$((count + 1))\n'
            'printf "%s" "$count" > "$count_file"\n'
            'if [[ "$count" -eq 2 ]]; then\n'
            '    echo "simulated swap failure" >&2\n'
            '    exit 1\n'
            'fi\n'
            f'exec "{real_mv}" "$@"\n',
            encoding="utf-8",
        )
        mv_shim.chmod(mv_shim.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)

        env = os.environ.copy()
        env["PATH"] = f"{shim_dir}:{env['PATH']}"
        result = self.convert("codex", check=False, env=env)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(count_file.read_text(encoding="utf-8"), "3")
        self.assertEqual(
            (self.source / "dist/codex/AGENTS.md").read_text(encoding="utf-8"),
            original,
        )
        self.assertEqual(self.staging_dirs(), [])

    def test_unclosed_yaml_frontmatter_fails_cleanly(self):
        broken = "---\nname: career-ops\n## Routing Table\n| A | `references/resume.md` |\n"
        (self.source / "SKILL.md").write_text(broken, encoding="utf-8")
        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertFalse((self.source / "dist/codex").exists())
        self.assertEqual(self.staging_dirs(), [])

    def test_empty_routing_table_fails_cleanly(self):
        no_routes = (
            "---\nname: career-ops\n---\n\n"
            "# career-ops\n\n"
            "## Routing Table\n\n"
            "| Request | Load |\n"
            "| --- | --- |\n\n"
            "## Other Section\n\n"
            "| Ignored | `references/resume.md` |\n"
        )
        (self.source / "SKILL.md").write_text(no_routes, encoding="utf-8")
        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("routing table", result.stderr.lower())
        self.assertEqual(self.staging_dirs(), [])

    def test_invalid_route_in_routing_table_fails_cleanly(self):
        bad_route = (
            "---\nname: career-ops\n---\n\n"
            "## Routing Table\n\n"
            "| Request | Load |\n"
            "| --- | --- |\n"
            "| Evil | `references/../SKILL.md` |\n"
        )
        (self.source / "SKILL.md").write_text(bad_route, encoding="utf-8")
        result = self.convert("codex", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid reference route", result.stderr.lower())
        self.assertEqual(self.staging_dirs(), [])

    def test_entry_files_preserve_urls_prefixed_paths_and_horizontal_rules(self):
        augmented = (
            self.canonical
            + "\r\n---\r\n\r\n"
            + "External: https://example.com/references/guide\r\n"
            + "Already prefixed: career-ops/references/resume.md\r\n"
            + "Hyphenated: my-references/guide.md\r\n"
            + "Underscored: old_references/guide.md\r\n"
            + "Alphanumeric: v2references/guide.md\r\n"
            + "Relative inline: `references/resume.md` and (references/anti-slop.md)\r\n"
        )
        (self.source / "SKILL.md").write_text(augmented, encoding="utf-8")

        for platform, entry in (("codex", "AGENTS.md"), ("gemini", "GEMINI.md")):
            with self.subTest(platform=platform):
                self.convert(platform)
                rendered = (self.source / "dist" / platform / entry).read_text(encoding="utf-8")
                self.assertNotIn("\r", rendered)
                self.assertIn("\n---\n", rendered)
                self.assertIn("External: https://example.com/references/guide", rendered)
                self.assertNotIn("https://example.com/career-ops/references/guide", rendered)
                self.assertIn("Already prefixed: career-ops/references/resume.md", rendered)
                self.assertNotIn("career-ops/career-ops/references/", rendered)
                self.assertIn("Hyphenated: my-references/guide.md", rendered)
                self.assertIn("Underscored: old_references/guide.md", rendered)
                self.assertIn("Alphanumeric: v2references/guide.md", rendered)
                self.assertIn(
                    "Relative inline: `career-ops/references/resume.md` and (career-ops/references/anti-slop.md)",
                    rendered,
                )

    def test_direct_execution_from_outside_project_with_cdpath(self):
        outside = self.source.parent / "outside"
        outside.mkdir()
        env = os.environ.copy()
        env["CDPATH"] = "/tmp"

        result = self.convert("codex", cwd=outside, env=env, direct=True)
        self.assertEqual(result.returncode, 0)
        self.assertTrue((self.source / "dist/codex/AGENTS.md").is_file())
        self.assertEqual(self.staging_dirs(), [])

    def test_all_tracked_reference_modules_are_in_live_routing_table(self):
        live_skill = (ROOT / "SKILL.md").read_text(encoding="utf-8")
        routed = extract_routing_table_routes(live_skill)
        tracked_proc = subprocess.run(
            ["git", "ls-files", "references/*.md"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        if tracked_proc.returncode == 0 and tracked_proc.stdout.strip():
            tracked = {line.strip() for line in tracked_proc.stdout.splitlines() if line.strip()}
        else:
            tracked = {f"references/{p.name}" for p in (ROOT / "references").glob("*.md")}
        self.assertTrue(tracked)
        self.assertEqual(routed, tracked)


if __name__ == "__main__":
    unittest.main()
