# Fold X Viewer

Galaxy Z Fold 7 向けに [X.com](https://x.com) を見やすくする PWA（Progressive Web App）です。

## 機能

- **PWA スタンドアロン表示**: ホーム画面に追加すると、URL バーなしの全画面で X.com を開けます。
- **画面状態検出**: 折りたたみ / 展開 / Flex Mode を検出して UI を切り替えます。
- **X.com 最適化 CSS**: 文字サイズ、余白、カラム数、ナビゲーションなどを調整できます。
- **ブックマークレット**: X.com を開いたあとに実行するだけで、最適化 CSS が即座に適用されます。
- **Stylus / UserCSS 対応**: 拡張機能にインポートすれば、X.com 訪問時に自動適用されます。

## 使い方

### 1. PWA をインストール

1. Chrome / Samsung Internet で `dist/` をホスト（または `npm run preview` / `npm run dev`）
2. 画面下部またはメニューから「ホーム画面に追加」を選択
3. アプリアイコンから起動

### 2. X.com を開く

アプリ内の「X.com を開く」ボタンをタップします。PWA スタンドアロン状態で X.com が開きます。

### 3. 最適化 CSS を適用

#### ブックマークレット

1. 「ブックマークレットをコピー」ボタンをタップ
2. ブラウザのブックマークに登録
3. X.com を開いたら、そのブックマークをタップ

#### Stylus を使う場合

1. ブラウザに [Stylus](https://add0n.com/stylus.html) をインストール
2. 「Stylus 用ファイルを保存」ボタンで `.user.css` をダウンロード
3. Stylus の「スタイルをインポート」でファイルを読み込む

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

ビルド結果は `dist/` に出力されます。

## Galaxy Z Fold 7 向け最適化ポイント

- **内側 Main Screen（7.6 インチ）**: 2 カラム風の余白と大きな文字で読みやすく
- **Cover Screen**: コンパクトな 1 カラム表示
- **Flex Mode**: `env(fold-*)` と `screen-spanning` メディアクエリで折り目を避ける
- **タップ領域拡大**: ボタン類の最小サイズを 40px に設定

## ライセンス

MIT
