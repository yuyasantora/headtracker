import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { PressureData } from "../types"

interface PressureCardProps {
  pressureData: PressureData
}

const PressureCard: React.FC<PressureCardProps> = ({ pressureData }) => {
  const formatPressure = (pressure: number): string => {
    return `${pressure.toFixed(1)} hPa`
  }

  const formatTemperature = (temp: number): string => {
    return `${temp.toFixed(1)}°C`
  }

  const formatHumidity = (humidity: number): string => {
    return `${humidity.toFixed(0)}%`
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainPressure}>
        <Text style={styles.pressureLabel}>現在の気圧</Text>
        <Text style={styles.pressureValue}>{formatPressure(pressureData.pressure)}</Text>
      </View>

      <View style={styles.additionalInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="thermometer-outline" size={20} color="#FF6B6B" />
          <Text style={styles.infoLabel}>気温</Text>
          <Text style={styles.infoValue}>{formatTemperature(pressureData.temperature)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="water-outline" size={20} color="#4ECDC4" />
          <Text style={styles.infoLabel}>湿度</Text>
          <Text style={styles.infoValue}>{formatHumidity(pressureData.humidity)}</Text>
        </View>
      </View>

      <Text style={styles.updateTime}>最終更新: {new Date(pressureData.timestamp).toLocaleTimeString("ja-JP")}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mainPressure: {
    alignItems: "center",
    marginBottom: 20,
  },
  pressureLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  pressureValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#007AFF",
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  infoItem: {
    alignItems: "center",
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  updateTime: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
})

export default PressureCard
