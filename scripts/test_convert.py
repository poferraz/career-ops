"""Check the exported artifacts in a disposable project, without starting any AI host."""

from pathlib import Path
import re
import shutil
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


class ConvertTests(unittest.TestCase):
    def setUp(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        self.source = Path(temp.name) / "career ops"
        (self.source / "scripts").mkdir(parents=True)
        shutil.copy(ROOT / "scripts/convert.sh", self.source / "scripts")
        shutil.copy(ROOT / "SKILL.md", self.source)
        self.canonical = (self.source / "SKILL.md").read_text()
        self.routes = set(re.findall(r"`(references/[^`\n]+\.md)`", self.canonical))
        self.assertTrue(self.routes)
        (self.source / "references").mkdir()
        for route in self.routes:
            shutil.copy(ROOT / route, self.source / route)

        (self.source / "session").mkdir()
        for path in ["session/user-profile.md", "references/personal-notes.md"]:
            (self.source / path).write_text("synthetic private fixture")

    def convert(self, platform, *, check=True):
        return subprocess.run(
            ["bash", "scripts/convert.sh", platform], cwd=self.source,
            capture_output=True, text=True, check=check,
        )

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
                    self.assertEqual((install / entry).read_text(),
                                     body.replace("references/", "career-ops/references/"))
                else:
                    self.assertIn(f"{location}/career-ops/", result.stdout)
                    self.assertEqual((bundle / "SKILL.md").read_text(), self.canonical)
                for route in self.routes:
                    self.assertEqual((bundle / route).read_bytes(), (self.source / route).read_bytes())
                expected = {Path("career-ops") / route for route in self.routes}
                expected.add(Path(entry or "career-ops/SKILL.md"))
                actual = {path.relative_to(export) for path in export.rglob("*") if path.is_file()}
                self.assertEqual(actual, expected)

    def test_rebuild_retires_obsolete_generated_instructions(self):
        legacy = self.source / "dist/cursor/rules/career-ops.md"
        legacy.parent.mkdir(parents=True)
        legacy.write_text("outdated profile instructions")
        self.convert("cursor")
        self.assertFalse(legacy.exists())
        self.assertEqual((self.source / "dist/cursor/career-ops/SKILL.md").read_text(),
                         self.canonical)

    def test_failed_rebuild_keeps_previous_bundle(self):
        self.convert("codex")
        missing = min(self.routes)
        (self.source / missing).unlink()
        self.assertNotEqual(self.convert("codex", check=False).returncode, 0)
        prior = self.source / "dist/codex/career-ops" / missing
        self.assertEqual(prior.read_bytes(), (ROOT / missing).read_bytes())


if __name__ == "__main__":
    unittest.main()
