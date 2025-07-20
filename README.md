# Headache Tracker Monorepo

気圧の変化を監視して頭痛の可能性を予測するアプリケーション。Web版とモバイル版を提供し、共通のコアロジックを共有するmonorepoプロジェクトです。

## 📁 プロジェクト構造

```
headache-tracker-monorepo/
├── packages/
│   ├── core/           # 共通ロジック（型定義、API通信など）
│   ├── web/           # Next.js Webアプリケーション
│   └── mobile/        # React Native モバイルアプリケーション
```

## 🚀 開発環境のセットアップ

### 必要な環境
- Node.js 18+
- pnpm 8+
- Rust (バックエンド用)
- MySQL 8.0+
- Expo CLI (モバイル開発用)
- Xcode 14+ (iOS開発用、Macのみ)
- Android Studio (Android開発用)

### インストール手順

1. **リポジトリのクローン**
```bash
git clone git@github.com:yuyasantora/headache-tracker-monorepo.git
cd headache-tracker-monorepo
```

2. **依存関係のインストール**
```bash
# pnpm のインストール（まだの場合）
npm install -g pnpm

# プロジェクトの依存関係をインストール
pnpm install
```

3. **core パッケージのビルド**
```bash
pnpm build:core
```

### 開発サーバーの起動

**Web版の開発**
```bash
# Web開発サーバーを起動
pnpm dev:web
```
👉 http://localhost:3000 でアクセス

**モバイル版の開発**
```bash
# モバイル開発サーバーを起動
pnpm dev:mobile
```
👉 Expo Go アプリでQRコードをスキャン

## 📦 パッケージの説明

### core パッケージ
共通のビジネスロジックを提供します。

- 型定義
- API通信
- ユーティリティ関数
- 状態管理ロジック

### web パッケージ
Next.js で構築されたWebアプリケーション。

**主な機能**
- 気圧データの可視化
- 頭痛記録の管理
- レスポンシブデザイン
- PWA対応

### mobile パッケージ
React Native / Expo で構築されたモバイルアプリケーション。

**主な機能**
- リアルタイム気圧監視
- プッシュ通知
- オフライン対応
- ネイティブUI/UX

## 🛠 開発ワークフロー

### ブランチ戦略
- `main`: 本番用ブランチ
- `develop`: 開発用ブランチ
- `feature/*`: 機能開発用ブランチ
- `fix/*`: バグ修正用ブランチ

### コミットメッセージ規約
```
feat: 新機能
fix: バグ修正
docs: ドキュメントのみの変更
style: コードスタイルの変更
refactor: リファクタリング
test: テストコードの追加・修正
chore: ビルドプロセスやツールの変更
```

### パッケージの追加
```bash
# core パッケージに追加
pnpm add <package-name> --filter core

# web パッケージに追加
pnpm add <package-name> --filter web

# mobile パッケージに追加
pnpm add <package-name> --filter mobile
```

## 🧪 テスト

```bash
# 全パッケージのテストを実行
pnpm test

# 特定パッケージのテストを実行
pnpm test:core
pnpm test:web
pnpm test:mobile
```

## 📦 ビルド

```bash
# core パッケージのビルド
pnpm build:core

# web パッケージのビルド
pnpm build:web

# mobile パッケージのビルド
pnpm build:mobile
```

## 🐛 トラブルシューティング

### よくある問題と解決方法

1. **ビルドエラー**
```bash
# 依存関係のクリーンインストール
rm -rf node_modules
pnpm install
```

2. **型エラー**
```bash
# core パッケージの再ビルド
pnpm build:core
```

3. **Metro バンドラーの問題**
```bash
# キャッシュのクリア
pnpm clean
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 👥 チーム

- Frontend: [@yuyasantora](https://github.com/yuyasantora)
- Backend: [@yuyasantora](https://github.com/yuyasantora)
- Design: [@yuyasantora](https://github.com/yuyasantora)

---

© 2024 Headache Tracker Team
