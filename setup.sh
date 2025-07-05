#!/bin/bash

echo "🚀 頭痛予報アプリのセットアップを開始します..."

# プロジェクト作成
echo "📦 Expoプロジェクトを作成中..."
npx create-expo-app HeadacheTracker --template blank-typescript
cd HeadacheTracker

# 依存関係のインストール
echo "📚 依存関係をインストール中..."
npm install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-linear-gradient @expo/vector-icons
npm install react-native-chart-kit react-native-svg

echo "✅ セットアップが完了しました！"
echo ""
echo "次の手順："
echo "1. ダウンロードしたファイルをプロジェクトに配置"
echo "2. npx expo start でアプリを起動"
echo "3. Expo Goアプリでテスト"
echo ""
echo "🎉 頭痛予報アプリの開発を始めましょう！"
