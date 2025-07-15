"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { SymptomType } from "../types"

const RecordScreen: React.FC = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<number>(0)
  const [selectedSymptoms, setSelectedSymptoms] = useState<SymptomType[]>([])
  const [notes, setNotes] = useState<string>("")

  const symptoms: SymptomType[] = [
    "頭痛",
    "めまい",
    "肩こり",
    "眠気",
    "関節痛",
    "だるさ",
    "吐き気",
    "耳鳴り",
    "発熱",
    "食欲不振",
    "こり・関節痛",
    "肌荒れ",
  ]

  const severityLabels = ["なし", "軽微", "軽度", "中度", "重度", "激痛"]
  const severityColors = ["#E5E5EA", "#34C759", "#FFCC02", "#FF9500", "#FF6B35", "#FF3B30"]

  const toggleSymptom = (symptom: SymptomType) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleSave = () => {
    if (selectedSeverity === 0 && selectedSymptoms.length === 0) {
      Alert.alert("記録エラー", "症状の重さまたは症状を選択してください。")
      return
    }

    // ここで実際のデータ保存処理を行う
    const record = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      severity: selectedSeverity,
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined,
    }

    console.log("Saving record:", record)

    Alert.alert("記録完了", "症状が記録されました。", [
      {
        text: "OK",
        onPress: () => {
          // リセット
          setSelectedSeverity(0)
          setSelectedSymptoms([])
          setNotes("")
        },
      },
    ])
  }

  const SeverityButton: React.FC<{ level: number; label: string; color: string }> = ({ level, label, color }) => (
    <TouchableOpacity
      style={[styles.severityButton, { backgroundColor: selectedSeverity === level ? color : "#f0f0f0" }]}
      onPress={() => setSelectedSeverity(level)}
    >
      <Text style={[styles.severityButtonText, { color: selectedSeverity === level ? "#fff" : "#333" }]}>{level}</Text>
      <Text style={[styles.severityLabel, { color: selectedSeverity === level ? "#fff" : "#666" }]}>{label}</Text>
    </TouchableOpacity>
  )

  const SymptomButton: React.FC<{ symptom: SymptomType }> = ({ symptom }) => (
    <TouchableOpacity
      style={[styles.symptomButton, selectedSymptoms.includes(symptom) && styles.symptomButtonSelected]}
      onPress={() => toggleSymptom(symptom)}
    >
      <Text style={[styles.symptomButtonText, selectedSymptoms.includes(symptom) && styles.symptomButtonTextSelected]}>
        {symptom}
      </Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="medical-outline" size={40} color="#007AFF" />
        <Text style={styles.title}>症状を記録</Text>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString("ja-JP", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="thermometer-outline" size={20} color="#333" />
          {"  "}症状の重さ
        </Text>
        <View style={styles.severityContainer}>
          {severityLabels.map((label, index) => (
            <SeverityButton key={index} level={index} label={label} color={severityColors[index]} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="list-outline" size={20} color="#333" />
          {"  "}症状の種類
        </Text>
        <View style={styles.symptomsContainer}>
          {symptoms.map((symptom) => (
            <SymptomButton key={symptom} symptom={symptom} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons name="document-text-outline" size={20} color="#333" />
          {"  "}メモ（任意）
        </Text>
        <TextInput
          style={styles.notesInput}
          placeholder="症状の詳細や気になることがあれば記録してください..."
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Ionicons name="save-outline" size={24} color="#fff" />
        <Text style={styles.saveButtonText}>記録を保存</Text>
      </TouchableOpacity>

      <View style={styles.tipContainer}>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
        <Text style={styles.tipText}>定期的に症状を記録することで、気圧変化との関連性を把握できます。</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  severityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  severityButton: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  severityButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  severityLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  symptomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  symptomButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  symptomButtonSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  symptomButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  symptomButtonTextSelected: {
    color: "#fff",
  },
  notesInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    minHeight: 100,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    margin: 20,
    padding: 18,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    marginTop: 0,
    padding: 15,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
  },
})

export default RecordScreen
