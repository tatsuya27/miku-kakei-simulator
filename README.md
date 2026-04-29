# 家計の黄金比シミュレーター

みく｜元借金妻のリール「家計の黄金比率」配布用シミュレーションツール。

## 概要

手取りを入力するだけで、世帯タイプ（単身／夫婦／夫婦＋子供）に応じた理想の家計予算が自動計算される。

## 比率の出典

家計再生コンサルタント・**横山光昭氏の家計再生メソッド**をベースにした参考値です。

実際の比率は世帯状況・地域・ライフステージによって異なるため、目安としてご利用ください。

## 使い方（ローカル）

```bash
cd ~/Documents/miku-kakei-simulator
open index.html
```

ブラウザで `index.html` を開くだけで動作。サーバー不要。

## デプロイ（Vercel）

1. GitHubにpush
2. Vercelで該当リポジトリをImport
3. 設定はデフォルト（Build CommandやOutput Directoryは空でOK＝静的サイト扱い）
4. デプロイ完了後、URLをフォロワーに配布

## ファイル構成

```
miku-kakei-simulator/
├── index.html    # メインHTML
├── style.css     # パステルピンクUI
├── script.js     # 計算ロジック + Chart.js連携
└── README.md     # このファイル
```

## 技術

- 静的HTML/CSS/JS（フレームワークなし・軽量）
- Chart.js v4（CDN経由）
- Google Fonts（Zen Maru Gothic / M PLUS Rounded 1c）

## ライセンス

非公開・みく専用ツール。
