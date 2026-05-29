# Flight Logbook

A pilot's personal flight record. Built with React + Vite + Tailwind CSS, deployed to Vercel.

## 機能

- ダッシュボード（全期間 / 今月切替、カード表示・色を自由にカスタマイズ）
- 新規入力（HH:MM・10進数両対応、PUSフライト自動反映、離着陸ごとに夜間フラグ）
- 記録一覧（月単位表示、表示カラム選択、CSV書き出し/読み込み）
- **PDF/画像から自動入力**（J-AIR月次サマリーフォーマット学習済み、Anthropic Claude APIで解析）
- 重複検出、プレビュー＆選択取り込み
- 90日カレンシーチェック
- 日英切替
- スマホ・タブレット・PC対応 (PWA)
- データはブラウザのLocalStorageに保存

---

## 1. 必要なもの

- **Node.js 18+** （ローカル開発用、未インストールでも Vercel だけでデプロイは可能）
- **GitHub アカウント**
- **Vercel アカウント**（無料） — https://vercel.com
- **Anthropic API キー** — https://console.anthropic.com で取得

---

## 2. デプロイ手順（最短）

### Step 1: GitHub にプロジェクトを push

このフォルダごと自分の GitHub にリポジトリとして push します。GitHub のWebUIから新しいリポジトリを作って、Code → "Add file" → "Upload files" でこのフォルダの中身を全部ドラッグ＆ドロップする方法が最も簡単です。

または ターミナルで:

```bash
cd flight-logbook
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/flight-logbook.git
git push -u origin main
```

### Step 2: Vercel に接続

1. https://vercel.com にログイン
2. **"Add New..." → "Project"** をクリック
3. GitHub リポジトリの一覧から `flight-logbook` を選んで **"Import"**
4. **Framework Preset** が自動で **"Vite"** になることを確認
5. **Environment Variables** セクションを開いて、以下を1つだけ追加:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-...`（Anthropic Console から取得した API キー）
6. **"Deploy"** をクリック

1〜2分後、`https://flight-logbook-xxx.vercel.app` のような URL が発行されます。

### Step 3: スマホで開く

発行された URL をスマホのブラウザで開きます。

#### iPhone (Safari)
1. URL を開く
2. 下の共有ボタン（□↑）をタップ
3. **"ホーム画面に追加"** をタップ
4. ホーム画面に "Logbook" アイコンが追加され、アプリのように起動できます

#### Android (Chrome)
1. URL を開く
2. 右上のメニュー（︙）をタップ
3. **"ホーム画面に追加"** をタップ

---

## 3. ローカルで開発する場合

```bash
cd flight-logbook
npm install
npm run dev
```

→ `http://localhost:5173` で起動。

**注意**: ローカル開発では `/api/anthropic` プロキシは動きません。Vercel CLI を使うと動かせます:

```bash
npm i -g vercel
vercel dev
# プロンプトに従う。.env.local に ANTHROPIC_API_KEY を設定
```

---

## 4. データのバックアップ

データはブラウザの LocalStorage に保存されています。**異なる端末間で自動同期はされません**。

別の端末でも同じデータを使いたい時は:

1. Menu → "CSV書き出し" でファイルを取得
2. 別端末のブラウザでアプリを開いて Menu → "CSV読み込み" で復元

クラウド同期が必要な場合は Firebase / Supabase との連携を別途実装する必要があります。

---

## 5. カスタムドメイン

Vercel ダッシュボード → Project → **Settings → Domains** から好きなドメインを設定できます（無料）。

---

## 6. トラブルシューティング

- **「Could not analyze the file」エラーが出る**:
  - Vercel ダッシュボードで環境変数 `ANTHROPIC_API_KEY` が正しく設定されているか確認
  - 設定後は **再デプロイが必要** (Deployments → 最新 → "..." → Redeploy)
  - ブラウザの開発者ツール（F12）→ Console タブでエラー詳細を確認

- **API リクエストが大きすぎる**:
  - PDF が 50MB を超える場合は分割するか画像化してください

- **PWA としてホーム画面に追加できない**:
  - HTTPS で配信されていることを確認（Vercel は自動で HTTPS）
  - 一度ブラウザのキャッシュをクリアして再アクセス

---

## ファイル構成

```
flight-logbook/
├── api/
│   └── anthropic.js          # Vercel Serverless Function (APIプロキシ)
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   └── icon-512.png
├── src/
│   ├── FlightLogbook.jsx     # メインコンポーネント
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── README.md
```
