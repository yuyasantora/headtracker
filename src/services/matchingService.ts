import type { UserProfile } from "../types" // アプリ共通の型定義ファイルを想定

// 他のユーザーのプロフィール情報（本来はサーバーから取得）
// ここではダミーデータを使用
const otherUsers: UserProfile[] = [
  {
    prefecture: "東京都",
    age: "25",
    gender: "female",
    headacheFrequency: "weekly",
    pressureSensitivity: 4,
    commonSymptoms: ["頭痛", "肩こり", "めまい"],
    triggers: ["気圧の変化", "ストレス", "睡眠不足"],
    notifications: true,
  },
  {
    prefecture: "大阪府",
    age: "32",
    gender: "male",
    headacheFrequency: "monthly",
    pressureSensitivity: 5,
    commonSymptoms: ["頭痛", "吐き気"],
    triggers: ["気圧の変化", "天気の変化", "疲労"],
    notifications: true,
  },
  // ... 他のユーザーデータ
]

/**
 * 2人のユーザーの症状やトリガーに基づいてマッチングスコアを計算する
 * @param currentUserProfile - 現在のユーザーのプロフィール
 * @param otherUserProfile - 比較対象のユーザーのプロフィール
 * @returns マッチングスコア（数値）
 */
const calculateMatchScore = (currentUserProfile: UserProfile, otherUserProfile: UserProfile): number => {
  let score = 0
  const weight = {
    symptom: 10,
    trigger: 8,
    sensitivity: 5,
  }

  // 共通の症状に基づいてスコアを加算
  currentUserProfile.commonSymptoms.forEach(symptom => {
    if (otherUserProfile.commonSymptoms.includes(symptom)) {
      score += weight.symptom
    }
  })

  // 共通のトリガーに基づいてスコアを加算
  currentUserProfile.triggers.forEach(trigger => {
    if (otherUserProfile.triggers.includes(trigger)) {
      score += weight.trigger
    }
  })

  // 気圧への敏感度の近さでスコアを加算
  const sensitivityDiff = Math.abs(currentUserProfile.pressureSensitivity - otherUserProfile.pressureSensitivity)
  score += (5 - sensitivityDiff) * weight.sensitivity // 差が0なら25点、1なら20点...

  return score
}


/**
 * 自分と似た症状を持つユーザーを見つける
 * @param currentUserProfile - 現在のユーザーのプロフィール
 * @returns スコアの高い順にソートされたユーザーリスト
 */
export const findSimilarUsers = async (currentUserProfile: UserProfile): Promise<{ user: UserProfile, score: number }[]> => {
  // 本来はここでサーバーにAPIリクエストを送り、
  // サーバー側で計算されたマッチング結果を受け取る。
  // ここではクライアントサイドでダミーデータを使ってシミュレーションする。

  const rankedUsers = otherUsers
    .map(otherUser => ({
      user: otherUser,
      score: calculateMatchScore(currentUserProfile, otherUser),
    }))
    .filter(item => item.score > 0) // スコアが0より大きいユーザーのみ
    .sort((a, b) => b.score - a.score) // スコアの高い順にソート

  return Promise.resolve(rankedUsers.slice(0, 10)) // 上位10件を返す
}