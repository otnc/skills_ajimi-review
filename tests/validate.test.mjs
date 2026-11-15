import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const validator = fileURLToPath(new URL("../scripts/validate.mjs", import.meta.url));

async function validateFixture(context, frontmatter, instructions = "# Review changes") {
  const skillsDirectory = await mkdtemp(join(tmpdir(), "ajimi-review-"));
  context.after(() => rm(skillsDirectory, { recursive: true }));
  const skillDirectory = join(skillsDirectory, "review");
  await mkdir(skillDirectory);
  if (frontmatter !== null) {
    await writeFile(join(skillDirectory, "SKILL.md"), `---\n${frontmatter}\n---\n\n${instructions}\n`);
  }
  const result = spawnSync(process.execPath, [validator, skillsDirectory], { encoding: "utf8" });
  assert.ifError(result.error);
  return result;
}

test("accepts bilingual skill metadata and nonempty instructions", async (context) => {
  const result = await validateFixture(context, 'name: review\ndescription: "Review code. コードレビューして。"');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 skill\(s\) OK/);
});

const invalidSkills = [
  ["a missing SKILL.md", null, undefined, /Missing SKILL\.md/],
  ["a mismatched name", "name: other\ndescription: Review code", undefined, /must match the directory name/],
  ["an absent description", "name: review", undefined, /description must be/],
  ["empty instructions", "name: review\ndescription: Review code", "", /Add the skill instructions/],
];

for (const [label, frontmatter, instructions, expectedError] of invalidSkills) {
  test(`rejects ${label}`, async (context) => {
    const result = await validateFixture(context, frontmatter, instructions);
    assert.equal(result.status, 1);
    assert.match(result.stderr, expectedError);
    assert.doesNotMatch(result.stdout, /skill\(s\) OK/);
  });
}
