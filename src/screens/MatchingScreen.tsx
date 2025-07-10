import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

import { findSimilarUsers } from "../services/matchingService"
import type { UserProfile } from "../types"

interface MatchedUser {
  user: UserProfile
  score: number
}

const MatchingScreen: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [matchedUsers, setMatchedUsers] = useState<MatchedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAndMatch = async () => {
      try {
        const profileString = await AsyncStorage.getItem("userProfile")
        if (!profileString) {
          Alert.alert("エラー", "ユーザー情報が見つかりません。")
          setLoading(false)
          return
        }
        const profile = JSON.parse(profileString) as UserProfile
        setUserProfile(profile)

        const results = await findSimilarUsers(profile)
        setMatchedUsers(results)
      } catch (error) {
        console.error(error)
        Alert.alert("エラー", "マッチングデータの取得に失敗しました。")
      } finally {
        setLoading(false)
      }
    }
    loadAndMatch()
  }, [])

  if (loading) {
    return (
      <LinearGradient colors={["#F0F4F8", "#D9E2EC"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>あなたと似た人を探しています...</Text>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#F0F4F8", "#D9E2EC"]} style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="people-circle-outline" size={48} color="#007AFF" />
          <Text style={styles.title}>仲間を探す</Text>
          <Text style={styles.subtitle}>症状や体質が似ている他のユーザーの記録です</Text>
        </View>

        {matchedUsers.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="sad-outline" size={60} color="#8A9BA8" />
            <Text style={styles.noResultsText}>似ている症状のユーザーが見つかりませんでした。</Text>
          </View>
        ) : (
          <View style={styles.cardsContainer}>
            {matchedUsers.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    {item.user.prefecture}・{item.user.age}代・{item.user.gender === "male" ? "男性" : "女性"}
                  </Text>
                  <View style={styles.scoreBadge}>
                    <Ionicons name="heart" size={16} color="#FF6B6B" />
                    <Text style={styles.scoreText}>{item.score}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Ionicons name="pulse-outline" size={20} color="#555" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                      <Text style={styles.infoLabel}>主な症状: </Text>
                      {item.user.commonSymptoms.join("、")}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="warning-outline" size={20} color="#555" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                      <Text style={styles.infoLabel}>きっかけ: </Text>
                      {item.user.triggers.join("、")}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Ionicons name="speedometer-outline" size={20} color="#555" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                      <Text style={styles.infoLabel}>気圧の敏感度: </Text>
                      {item.user.pressureSensitivity} / 5
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A202C",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A5568",
    marginTop: 4,
    textAlign: "center",
  },
  noResultsContainer: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8A9BA8",
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#9DB0C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
  },
  scoreBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5E5",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  scoreText: {
    marginLeft: 4,
    color: "#FF6B6B",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardBody: {
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#4A5568",
  },
  infoText: {
    fontSize: 14,
    color: "#4A5568",
    flex: 1,
  },
})

export default MatchingScreen



