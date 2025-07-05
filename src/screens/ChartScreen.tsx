"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { getHistoricalData } from "../services/weatherService"
import type { PressureData } from "../types"

const ChartScreen: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<PressureData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistoricalData()
  }, [])

  const loadHistoricalData = async () => {
    try {
      const data = await getHistoricalData(7)
      setHistoricalData(data)
    } catch (error) {
      console.error("Failed to load historical data:", error)
    } finally {
      setLoading(false)
    }
  }

  const screenWidth = Dimensions.get("window").width

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#007AFF",
    },
  }

  const formatChartData = () => {
    if (historicalData.length === 0) return null

    const labels = historicalData.map((item) => {
      const date = new Date(item.timestamp)
      return `${date.getMonth() + 1}/${date.getDate()}`
    })

    const pressureData = historicalData.map((item) => item.pressure)

    return {
      labels,
      datasets: [
        {
          data: pressureData,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      </View>
    )
  }

  const chartData = formatChartData()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>気圧変化グラフ</Text>
        <Text style={styles.subtitle}>過去7日間の気圧推移</Text>
      </View>

      {chartData && (
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>統計情報</Text>

        {historicalData.length > 0 && (
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>平均気圧</Text>
              <Text style={styles.statValue}>
                {(historicalData.reduce((sum, item) => sum + item.pressure, 0) / historicalData.length).toFixed(1)} hPa
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>最高気圧</Text>
              <Text style={styles.statValue}>
                {Math.max(...historicalData.map((item) => item.pressure)).toFixed(1)} hPa
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>最低気圧</Text>
              <Text style={styles.statValue}>
                {Math.min(...historicalData.map((item) => item.pressure)).toFixed(1)} hPa
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>変動幅</Text>
              <Text style={styles.statValue}>
                {(
                  Math.max(...historicalData.map((item) => item.pressure)) -
                  Math.min(...historicalData.map((item) => item.pressure))
                ).toFixed(1)}{" "}
                hPa
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
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
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
})

export default ChartScreen
