import type React from "react"
import { View, Text, StyleSheet, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { WeatherForecast } from "../types"

interface ForecastListProps {
  forecast: WeatherForecast[]
}

const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "#FF4757"
      case "medium":
        return "#FFA726"
      case "low":
        return "#4CAF50"
      default:
        return "#666"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "warning"
      case "medium":
        return "alert-circle"
      case "low":
        return "checkmark-circle"
      default:
        return "help-circle"
    }
  }

  const renderForecastItem = ({ item }: { item: WeatherForecast }) => {
    const date = new Date(item.date)
    const dayName = date.toLocaleDateString("ja-JP", { weekday: "short" })
    const dateStr = date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })

    return (
      <View style={styles.forecastItem}>
        <View style={styles.dateContainer}>
          <Text style={styles.dayName}>{dayName}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>

        <View style={styles.pressureContainer}>
          <Text style={styles.pressureText}>{item.pressure.toFixed(1)} hPa</Text>
          <Text style={[styles.changeText, { color: item.pressureChange > 0 ? "#FF4757" : "#4CAF50" }]}>
            {item.pressureChange > 0 ? "+" : ""}
            {item.pressureChange.toFixed(1)}
          </Text>
        </View>

        <View style={styles.riskContainer}>
          <Ionicons name={getRiskIcon(item.riskLevel) as any} size={24} color={getRiskColor(item.riskLevel)} />
        </View>
      </View>
    )
  }

  return (
    <FlatList
      data={forecast}
      renderItem={renderForecastItem}
      keyExtractor={(item) => item.date}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  forecastItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dateContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
  pressureContainer: {
    flex: 1,
    alignItems: "center",
  },
  pressureText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  riskContainer: {
    flex: 0.5,
    alignItems: "center",
  },
})

export default ForecastList
