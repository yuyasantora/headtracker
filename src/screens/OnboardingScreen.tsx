"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

interface UserProfile {
  name: string
  age: string
  gender: "male" | "female" | "other" | ""
  headacheFrequency: "daily" | "weekly" | "monthly" | "rarely" | ""
  pressureSensitivity: number // 1-5
  commonSymptoms: string[]
  triggers: string[]
  notifications: boolean
}

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: "",
    gender: "",
    headacheFrequency: "",
    pressureSensitivity: 3,
    commonSymptoms: [],
    triggers: [],
    notifications: true,
  })

  const totalSteps = 6

  const symptoms = ["頭痛", "めまい", "肩こり", "眠気", "関節痛", "だるさ", "吐き気", "耳鳴り"]
  const triggers = ["気圧変化", "天気の変化", "ストレス", "睡眠不足", "疲労", "生理周期", "食事", "アルコール"]

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    if (!profile.name.trim()) {
      Alert.alert("入力エラー", "お名前を入力してください。")
      return
    }
    onComplete(profile)
  }

  const toggleSymptom = (symptom: string) => {
    setProfile((prev) => ({
      ...prev,
      commonSymptoms: prev.commonSymptoms.includes(symptom)
        ? prev.commonSymptoms.filter((s) => s !== symptom)
        : [...prev.commonSymptoms, symptom],
    }))
  }

  const toggleTrigger = (trigger: string) => {
    setProfile((prev) => ({
      ...prev,
      triggers: prev.triggers.includes(trigger)
        ? prev.triggers.filter((t) => t !== trigger)
        : [...prev.triggers, trigger],
    }))
  }

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentStep + 1) / totalSteps) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {currentStep + 1} / {totalSteps}
      </Text>
    </View>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="person-outline" size={60} color="#007AFF" />
            <Text style={styles.stepTitle}>はじめまして！</Text>
            <Text style={styles.stepSubtitle}>あなたの基本情報を教えてください</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>お名前</Text>
              <TextInput
                style={styles.textInput}
                placeholder="山田太郎"
                value={profile.name}
                onChangeText={(text) => setProfile((prev) => ({ ...prev, name: text }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>年齢</Text>
              <TextInput
                style={styles.textInput}
                placeholder="30"
                keyboardType="numeric"
                value={profile.age}
                onChangeText={(text) => setProfile((prev) => ({ ...prev, age: text }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>性別</Text>
              <View style={styles.genderContainer}>
                {[
                  { key: "male", label: "男性" },
                  { key: "female", label: "女性" },
                  { key: "other", label: "その他" },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[styles.genderButton, profile.gender === option.key && styles.genderButtonSelected]}
                    onPress={() => setProfile((prev) => ({ ...prev, gender: option.key as any }))}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        profile.gender === option.key && styles.genderButtonTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )

      case 1:
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="calendar-outline" size={60} color="#007AFF" />
            <Text style={styles.stepTitle}>頭痛の頻度</Text>
            <Text style={styles.stepSubtitle}>どのくらいの頻度で頭痛を感じますか？</Text>

            <View style={styles.frequencyContainer}>
              {[
                { key: "daily", label: "ほぼ毎日", icon: "alarm-outline" },
                { key: "weekly", label: "週に数回", icon: "calendar-outline" },
                { key: "monthly", label: "月に数回", icon: "calendar-clear-outline" },
                { key: "rarely", label: "めったにない", icon: "checkmark-circle-outline" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.frequencyButton,
                    profile.headacheFrequency === option.key && styles.frequencyButtonSelected,
                  ]}
                  onPress={() => setProfile((prev) => ({ ...prev, headacheFrequency: option.key as any }))}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={profile.headacheFrequency === option.key ? "#fff" : "#007AFF"}
                  />
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      profile.headacheFrequency === option.key && styles.frequencyButtonTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="speedometer-outline" size={60} color="#007AFF" />
            <Text style={styles.stepTitle}>気圧への敏感度</Text>
            <Text style={styles.stepSubtitle}>気圧の変化にどの程度敏感ですか？</Text>

            <View style={styles.sensitivityContainer}>
              <Text style={styles.sensitivityValue}>{profile.pressureSensitivity}</Text>
              <Text style={styles.sensitivityLabel}>
                {profile.pressureSensitivity === 1
                  ? "全く敏感でない"
                  : profile.pressureSensitivity === 2
                    ? "あまり敏感でない"
                    : profile.pressureSensitivity === 3
                      ? "普通"
                      : profile.pressureSensitivity === 4
                        ? "やや敏感"
                        : "とても敏感"}
              </Text>

              <View style={styles.sliderContainer}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.sliderButton, profile.pressureSensitivity >= level && styles.sliderButtonActive]}
                    onPress={() => setProfile((prev) => ({ ...prev, pressureSensitivity: level }))}
                  >
                    <Text style={styles.sliderButtonText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="medical-outline" size={60} color="#007AFF" />
            <Text style={styles.stepTitle}>よくある症状</Text>
            <Text style={styles.stepSubtitle}>普段感じることが多い症状を選択してください</Text>

            <View style={styles.symptomsContainer}>
              {symptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  style={[styles.symptomChip, profile.commonSymptoms.includes(symptom) && styles.symptomChipSelected]}
                  onPress={() => toggleSymptom(symptom)}
                >
                  <Text
                    style={[
                      styles.symptomChipText,
                      profile.commonSymptoms.includes(symptom) && styles.symptomChipTextSelected,
                    ]}
                  >
                    {symptom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="warning-outline" size={60} color="#007AFF" />
            <Text style={styles.stepTitle}>症状のきっかけ</Text>
            <Text style={styles.stepSubtitle}>症状が起こりやすいきっかけを選択してください</Text>

            <View style={styles.triggersContainer}>
              {triggers.map((trigger) => (
                <TouchableOpacity
                  key={trigger}
                  style={[styles.triggerChip, profile.triggers.includes(trigger) && styles.triggerChipSelected]}
                  onPress={() => toggleTrigger(trigger)}
                >
                  <Text
                    style={[
                      styles.triggerChipText,
                      profile.triggers.includes(trigger) && styles.triggerChipTextSelected,
                    ]}
                  >
                    {trigger}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Ionicons name="notifications-outline" size={60} color="#007AFF" />
            <Text style={styles.stepTitle}>通知設定</Text>
            <Text style={styles.stepSubtitle}>気圧変化の通知を受け取りますか？</Text>

            <View style={styles.notificationContainer}>
              <TouchableOpacity
                style={[styles.notificationButton, profile.notifications && styles.notificationButtonSelected]}
                onPress={() => setProfile((prev) => ({ ...prev, notifications: true }))}
              >
                <Ionicons name="notifications" size={30} color={profile.notifications ? "#fff" : "#007AFF"} />
                <Text
                  style={[
                    styles.notificationButtonText,
                    profile.notifications && styles.notificationButtonTextSelected,
                  ]}
                >
                  通知を受け取る
                </Text>
                <Text style={styles.notificationButtonSubtext}>気圧変化や頭痛予報をお知らせします</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.notificationButton, !profile.notifications && styles.notificationButtonSelected]}
                onPress={() => setProfile((prev) => ({ ...prev, notifications: false }))}
              >
                <Ionicons name="notifications-off" size={30} color={!profile.notifications ? "#fff" : "#666"} />
                <Text
                  style={[
                    styles.notificationButtonText,
                    !profile.notifications && styles.notificationButtonTextSelected,
                  ]}
                >
                  通知しない
                </Text>
                <Text style={styles.notificationButtonSubtext}>後で設定画面から変更できます</Text>
              </TouchableOpacity>
            </View>
          </View>
        )

      default:
        return null
    }
  }

  return (
    <LinearGradient colors={["#4A90E2", "#7BB3F0"]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProgressBar()}
        {renderStep()}
      </ScrollView>

      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{currentStep === totalSteps - 1 ? "完了" : "次へ"}</Text>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    padding: 20,
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 2,
  },
  progressText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  stepContainer: {
    padding: 20,
    alignItems: "center",
    minHeight: 500,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  stepSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 10,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  genderButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#fff",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  genderButtonTextSelected: {
    color: "#fff",
  },
  frequencyContainer: {
    width: "100%",
    gap: 15,
  },
  frequencyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  frequencyButtonSelected: {
    backgroundColor: "#007AFF",
  },
  frequencyButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginLeft: 15,
  },
  frequencyButtonTextSelected: {
    color: "#fff",
  },
  sensitivityContainer: {
    alignItems: "center",
    width: "100%",
  },
  sensitivityValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  sensitivityLabel: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 30,
  },
  sliderContainer: {
    flexDirection: "row",
    gap: 15,
  },
  sliderButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  sliderButtonActive: {
    backgroundColor: "#fff",
  },
  sliderButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  symptomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  symptomChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  symptomChipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#fff",
  },
  symptomChipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  symptomChipTextSelected: {
    color: "#fff",
  },
  triggersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  triggerChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  triggerChipSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#fff",
  },
  triggerChipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  triggerChipTextSelected: {
    color: "#fff",
  },
  notificationContainer: {
    width: "100%",
    gap: 20,
  },
  notificationButton: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "transparent",
  },
  notificationButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#fff",
  },
  notificationButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  notificationButtonTextSelected: {
    color: "#fff",
  },
  notificationButtonSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 5,
  },
})

export default OnboardingScreen
