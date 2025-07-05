import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface RiskIndicatorProps {
  riskLevel: "low" | "medium" | "high"
}

const RiskIndicator: React.FC<RiskIndicatorProps> = ({ riskLevel }) => {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case "high":
        return {
          color: "#FF4757",
          backgroundColor: "#FFE8EA",
          icon: "warning" as const,
          text: "注意",
          description: "頭痛が起こりやすい状況です",
        }
      case "medium":
        return {
          color: "#FFA726",
          backgroundColor: "#FFF3E0",
          icon: "alert-circle" as const,
          text: "警戒",
          description: "軽度の体調変化に注意",
        }
      case "low":
        return {
          color: "#4CAF50",
          backgroundColor: "#E8F5E8",
          icon: "checkmark-circle" as const,
          text: "安全",
          description: "気圧は安定しています",
        }
    }
  }

  const config = getRiskConfig()

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={config.icon} size={40} color={config.color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.riskText, { color: config.color }]}>{config.text}</Text>
        <Text style={styles.description}>{config.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  riskText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
})

export default RiskIndicator
