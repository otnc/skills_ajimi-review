# ajimi-review

[English](README.md) | **日本語**

PR やローカルの差分をレビューする Agent Skill です。指摘には、不具合が起きる条件、期待どおりに動かない箇所、その変更が原因だと判断した根拠を添えます。

## インストール

リポジトリの公開後は、配布元から直接インストールできます。集約先への同期後は、`otnc/agent-skills` からも導入できます。

```sh
npx skills add otnc/skills_ajimi-review --skill ajimi-review
npx skills add otnc/agent-skills --skill ajimi-review
```

## 使い方

PR のリンク、比較元のブランチ、ローカルの差分など、見てほしい対象を伝えてください。差分から読み取れない仕様や制約があれば、依頼に添えてください。スキルを明示的に選ぶときは `ajimi-review` と指定します。

- **PR**「PR #42 をレビューして。マイグレーションは既存のレコードでも動く必要があります」
- **ブランチ差分**「ajimi-review で、このブランチを `main` と比較して。既存の呼び出し元に新しい既定値がどう影響するか見て」
- **ローカル差分**「ajimi-review で、ステージ済みの変更だけ見て。リトライ時の挙動は従来どおりです」

エージェントはレビュー対象と比較元を特定し、変更が影響する処理をたどります。安全に実行できるテストがあれば、疑わしい挙動を確かめます。ソースを読んで確定できた指摘には、根拠となる箇所と仕様を示します。一時的なテストファイルなどは、必要に応じて作業ツリーの外に置きます。

## 指摘の例

`[Important]` **1ページ目と2ページ目で項目が重複する**（`src/paginate.ts:12`）

1ページ目の件数を20から50に増やしたあとも、2ページ目は21件目から始まります。同じ120件のデータで、2ページ目が1ページ目の続きから始まることを確認しました。変更前は `20 → 21` で成功。変更後は `50 → 21` となり、期待した `51` から始まらず、21〜50件目が重複しました。

報告には、見た範囲、根拠付きの指摘、取り下げた候補、未確認の重要な項目、検証結果が載ります。依頼の範囲を確認できたら `complete`、重要な確認が残ったら `incomplete`、対象の差分が空なら `no changes` です。根拠が揃った指摘は `incomplete` の場合も報告に残ります。 [スキル本文](skills/ajimi-review/SKILL.md) ／ [報告テンプレート](skills/ajimi-review/assets/report-template.md)

## 参考資料

- [AIに敵対的レビューをさせるな。トークンは検証に使え](https://zenn.dev/karamage/articles/5c3f8370b2b370)
- [15個の仕込みバグで比較](https://qiita.com/kunitomo926/items/7dfc85770cf5132f3d1c)
- [Google Engineering Practices — What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html)
- [CRBugBench](https://arxiv.org/abs/2610.13668)
- [Hypothesis documentation](https://hypothesis.readthedocs.io/en/latest/)
- [TLA+ Tools](https://lamport.azurewebsites.net/tla/tools.html)

## 開発

`.node-version` に記載した Node.js を使います。README を更新するときは `base/README.base.md` を編集し、英語版と日本語版を生成します。

```sh
npm ci
npm run docs:build
npm run check
```

## リリース

デフォルトブランチで `release` ワークフローを実行します。入力するバージョンは `package.json` と同じ値で、先頭に `v` は付けません。CI と同じチェックが通ると、コミット履歴からリリースノートを作って GitHub Release を公開します。安定版の公開後は、[集約先の同期処理](https://github.com/otnc/agent-skills/blob/main/CONTRIBUTING.ja.md)が配布元を検出します。

## License

[MIT](LICENSE)
