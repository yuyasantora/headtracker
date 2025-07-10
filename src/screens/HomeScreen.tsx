"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

import type { PressureData, WeatherForecast } from "../types"
import { getCurrentPressure, getForecast, getUserLocation } from "../services/weatherService"
import PressureCard from "../components/PressureCard"
import ForecastList from "../components/ForecastList"
import RiskIndicator from "../components/RiskIndicator"

interface UserProfile {
  prefecture: string
  age: string
  gender: "male" | "female" | "other" | ""
  headacheFrequency: "daily" | "weekly" | "monthly" | "rarely" | ""
  pressureSensitivity: number
  commonSymptoms: string[]
  triggers: string[]
  notifications: boolean
}

const HomeScreen: React.FC = () => {
  const [currentPressure, setCurrentPressure] = useState<PressureData | null>(null)
  const [forecast, setForecast] = useState<WeatherForecast[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    loadData()
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem("userProfile")
      if (profile) {
        setUserProfile(JSON.parse(profile))
      }
    } catch (error) {
      console.error("Failed to load user profile:", error)
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // ユーザーの現在地を取得
      const location = await getUserLocation()
      if (!location) {
        Alert.alert("エラー", "位置情報が取得できませんでした。")
        setLoading(false)
        return
      }
      
      // 取得した位置情報を使ってAPIを呼び出す
      const [pressureData, forecastData] = await Promise.all([
        getCurrentPressure(location), 
        getForecast(location),
      ])

      setCurrentPressure(pressureData)
      setForecast(forecastData)
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("エラー", error.message)
      } else {
        Alert.alert("エラー", "データの取得に失敗しました")
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const getCurrentRisk = (): "low" | "medium" | "high" => {
    if (!currentPressure || forecast.length === 0) return "low"

    // ユーザーの敏感度を考慮してリスクレベルを調整
    let baseRisk = forecast[0].riskLevel
    if (userProfile?.pressureSensitivity) {
      if (userProfile.pressureSensitivity >= 4 && baseRisk === "medium") {
        baseRisk = "high"
      } else if (userProfile.pressureSensitivity <= 2 && baseRisk === "high") {
        baseRisk = "medium"
      }
    }

    return baseRisk
  }

  const getPersonalizedAdvice = (): string => {
    const risk = getCurrentRisk()
    const sensitivity = userProfile?.pressureSensitivity || 3
    const commonSymptoms = userProfile?.commonSymptoms || []

    if (risk === "high") {
      if (sensitivity >= 4) {
        return "あなたは気圧変化に敏感なため、特に注意が必要です。水分補給を心がけ、無理をしないようにしましょう。"
      }
      return "気圧の変化が大きいため、頭痛に注意してください。水分補給を心がけ、無理をしないようにしましょう。"
    } else if (risk === "medium") {
      if (commonSymptoms.includes("めまい") || commonSymptoms.includes("肩こり")) {
        return "軽度の気圧変化があります。めまいや肩こりに注意して過ごしましょう。"
      }
      return "軽度の気圧変化があります。体調の変化に注意して過ごしましょう。"
    } else {
      return "気圧は安定しています。快適にお過ごしください。"
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    )
  }

  return (
    <LinearGradient colors={["#4A90E2", "#7BB3F0"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{userProfile?.name ? `${userProfile.name}さん、` : ""}おはようございます</Text>
          <Text style={styles.title}>頭痛予報</Text>
          <Text style={styles.subtitle}>
            {new Date().toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </Text>
        </View>

        <RiskIndicator riskLevel={getCurrentRisk()} />

        {currentPressure && <PressureCard pressureData={currentPressure} />}

        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="calendar-outline" size={20} color="#333" />
            {"  "}3日間の予報
          </Text>
          <ForecastList forecast={forecast} />
        </View>

        <View style={styles.tipSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="bulb-outline" size={20} color="#333" />
            {"  "}あなたへのアドバイス
          </Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{getPersonalizedAdvice()}</Text>
          </View>
        </View>

        {userProfile?.commonSymptoms && userProfile.commonSymptoms.length > 0 && (
          <View style={styles.symptomsSection}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="medical-outline" size={20} color="#333" />
              {"  "}注意すべき症状
            </Text>
            <View style={styles.symptomsCard}>
              <View style={styles.symptomsGrid}>
                {userProfile.commonSymptoms.map((symptom) => (
                  <View key={symptom} style={styles.symptomTag}>
                    <Text style={styles.symptomTagText}>{symptom}</Text>
                  </View>
                ))}
              </View>
            </View>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  forecastSection: {
    margin: 20,
  },
  tipSection: {
    margin: 20,
  },
  symptomsSection: {
    margin: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  symptomsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  symptomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  symptomTag: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  symptomTagText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
})

export default HomeScreen
