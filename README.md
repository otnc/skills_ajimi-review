# ajimi-review

**English** | [日本語](README.ja.md)

An Agent Skill for reviewing pull requests and local changes. Each finding identifies what triggers the defect, what should happen, and what evidence shows the change is responsible.

## Install

Install directly after the source repository is published. You can also install from the collection after it syncs.

```sh
npx skills add otnc/skills_ajimi-review --skill ajimi-review
npx skills add otnc/agent-skills --skill ajimi-review
```

## Usage

Give the agent a PR link, a comparison point, or the local changes to inspect. Include acceptance criteria or known constraints when the diff alone leaves them unclear. Name `ajimi-review` to select it explicitly.

- **Pull request** “Review PR #42. The migration must work with existing records.”
- **Branch changes** “Use ajimi-review to review this branch against `main`. Check how current callers handle the new default.”
- **Local changes** “Use ajimi-review to review only my staged changes. Retry behavior should stay the same.”

The agent pins the change and baseline, traces the paths that can be affected, and runs a targeted check where it can do so safely. It can also verify a finding from source when the code path and contract settle the claim. The report identifies the evidence used and any material checks left open. Temporary verification uses isolated files when needed.

## Example finding

`[Important]` **Consecutive pages overlap** · `src/paginate.ts:12`

The first page grows from 20 to 50 items, while the second page still starts at offset 20. With the same 120-item fixture, the assertion that page 2 starts immediately after page 1 passes on the baseline (`20 → 21`) and fails on the reviewed change (`50 → 21`, expected `51`). Items 21 through 50 appear twice.

The report gives the scope, findings, discarded candidates, material unverified checks, and verification results. Status `complete` means the requested scope was reviewed, `incomplete` means material checks remain open, and `no changes` means the reviewed diff was empty. Confirmed findings can appear in either a complete or an incomplete report. [Skill instructions](skills/ajimi-review/SKILL.md) · [Report template](skills/ajimi-review/assets/report-template.md)

## References

- [AIに敵対的レビューをさせるな。トークンは検証に使え](https://zenn.dev/karamage/articles/5c3f8370b2b370)
- [15個の仕込みバグで比較](https://qiita.com/kunitomo926/items/7dfc85770cf5132f3d1c)
- [Google Engineering Practices — What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- [CRBugBench](https://arxiv.org/abs/2610.13668)
- [Hypothesis documentation](https://hypothesis.readthedocs.io/en/latest/)
- [TLA+ Tools](https://lamport.azurewebsites.net/tla/tools.html)

## Development

Use the Node.js version in `.node-version`. Edit this README in `base/README.base.md` and regenerate both languages.

```sh
npm ci
npm run docs:build
npm run check
```

## Release

Run the `release` workflow on the default branch with the version in `package.json`, without the leading `v`. The workflow runs the CI checks, then publishes a GitHub Release with notes from the commit history. The [collection workflow](https://github.com/otnc/agent-skills/blob/main/CONTRIBUTING.md) discovers public source repositories after a stable release.

## License

[MIT](LICENSE)
