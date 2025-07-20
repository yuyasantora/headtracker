# 頭痛予報アプリ (HeadacheTracker)

気圧の変化を監視して頭痛の可能性を予測するReact Nativeアプリです。

## 🚀 セットアップ

### 1. フロントエンド (React Native)

#### 1.1. 新しいExpoプロジェクトを作成
\`\`\`bash
npx create-expo-app HeadacheTracker --template blank-typescript
cd HeadacheTracker
\`\`\`

#### 1.2. 必要な依存関係をインストール
\`\`\`bash
# ナビゲーション関連
npm install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# UI関連
npx expo install expo-linear-gradient @expo/vector-icons

# チャート表示用
npm install react-native-chart-kit react-native-svg
\`\`\`

#### 1.3. ファイルを配置
- ダウンロードしたファイルをプロジェクトに配置
- `src/` フォルダ全体をプロジェクトルートにコピー
- `App.tsx` を置き換え

#### 1.4. アプリを起動
\`\`\`bash
npx expo start
\`\`\`

### 2. バックエンド (Rust/MySQL) ─ Ubuntu 22.04 例

#### 2.1. Rust をインストール
まだ Rust を入れていない場合は公式インストールスクリプトを実行します。
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### 2.2. MySQL サーバーをインストール
```bash
sudo apt update
sudo apt install mysql-server
```

#### 2.3. MySQL の初期セキュリティ設定
```bash
sudo mysql_secure_installation
```
対話形式で `root` パスワード設定・匿名ユーザー削除などを行います。

#### 2.4. データベース & ユーザー作成
```bash
sudo mysql -u root -p

-- アプリ用 DB
CREATE DATABASE my_app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- アプリ専用ユーザー
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON my_app_db.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 2.5. 環境変数を設定
`backend/.env` を作成し、以下を記述します（ユーザー名・パスワードは上記で設定したものに合わせてください）。
```env
DATABASE_URL="mysql://app_user:secure_password@localhost:3306/my_app_db"
```

#### 2.6. バックエンドサーバーを起動
```bash
cd backend
cargo run
```
`listening on 127.0.0.1:3001` と表示されれば成功です。

## 📱 実行方法

- **スマートフォン**: Expo GoアプリでQRコードをスキャン
- **iOS シミュレーター**: `npx expo start --ios`
- **Android エミュレーター**: `npx expo start --android`

## 🎯 主な機能

### ホーム画面
- 現在の気圧表示
- 頭痛リスクレベル表示
- 3日間の気圧予報
- 今日のアドバイス

### グラフ画面
- 過去7日間の気圧変化グラフ
- 統計情報（平均、最高、最低、変動幅）

### 記録画面
- 症状の重さ記録（0-5段階）
- 症状の種類選択
- メモ機能

### 設定画面
- 通知設定
- 表示単位設定
- データ管理
- アプリ情報

## 🛠 技術スタック

- **React Native**: モバイルアプリフレームワーク
- **TypeScript**: 型安全性
- **Expo**: 開発・ビルド環境
- **React Navigation**: ナビゲーション
- **React Native Chart Kit**: グラフ表示
- **Expo Linear Gradient**: グラデーション
- **Expo Vector Icons**: アイコン

## 📁 プロジェクト構造

\`\`\`
HeadacheTracker/
├── App.tsx                    # メインアプリコンポーネント
├── src/
│   ├── components/           # 再利用可能なコンポーネント
│   │   ├── PressureCard.tsx
│   │   ├── RiskIndicator.tsx
│   │   └── ForecastList.tsx
│   ├── screens/             # 画面コンポーネント
│   │   ├── HomeScreen.tsx
│   │   ├── ChartScreen.tsx
│   │   ├── RecordScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/            # API・データサービス
│   │   └── weatherService.ts
│   └── types/               # TypeScript型定義
│       └── index.ts
├── package.json
└── README.md
\`\`\`

## 🔧 カスタマイズ

### 実際の気象APIとの連携
`src/services/weatherService.ts` を編集して、実際の気象APIと連携できます：

\`\`\`typescript
export const getCurrentPressure = async (): Promise<PressureData> => {
  const response = await fetch('YOUR_WEATHER_API_ENDPOINT');
  const data = await response.json();
  return data;
};
\`\`\`

### データ永続化
AsyncStorageを使用してデータを保存：

\`\`\`bash
npx expo install @react-native-async-storage/async-storage
\`\`\`

### プッシュ通知
Expo Notificationsを使用：

\`\`\`bash
npx expo install expo-notifications
\`\`\`

## 🐛 トラブルシューティング

### Metro bundler エラー
\`\`\`bash
npx expo start --clear
\`\`\`

### 依存関係の問題
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### TypeScript エラー
\`\`\`bash
npx expo install --fix
\`\`\`

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

---

© 2024 HeadacheTracker
