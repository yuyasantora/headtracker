import * as Location from "expo-location"
import type { PressureData, WeatherForecast } from "../types"

const API_KEY="2924a789b91e3a43e56b7b09b43f539c"
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast"

// OpenWeatherMap APIからの応答データに対応する型
interface OpenWeatherMapResponse {
  list: {
    dt: number
    main: {
      pressure: number
      temp: number
      humidity: number
    }
  }[]
}

// ユーザーの現在地を取得する関数
export const getUserLocation = async (): Promise<Location.LocationObject | null> => {
  const { status } = await Location.requestForegroundPermissionsAsync()
  
}
// モックデータ生成関数
const generateMockPressureData = (): PressureData => {
  const basePressure = 1013.25
  const variation = (Math.random() - 0.5) * 20

  return {
    timestamp: Date.now(),
    pressure: basePressure + variation,
    temperature: 20 + (Math.random() - 0.5) * 15,
    humidity: 50 + (Math.random() - 0.5) * 30,
  }
}

const generateMockForecast = (): WeatherForecast[] => {
  const forecast: WeatherForecast[] = []
  const basePressure = 1013.25

  for (let i = 0; i < 3; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const pressureChange = (Math.random() - 0.5) * 10
    const pressure = basePressure + pressureChange

    let riskLevel: "low" | "medium" | "high" = "low"
    if (Math.abs(pressureChange) > 6) {
      riskLevel = "high"
    } else if (Math.abs(pressureChange) > 3) {
      riskLevel = "medium"
    }

    forecast.push({
      date: date.toISOString().split("T")[0],
      pressure,
      pressureChange,
      riskLevel,
      temperature: 20 + (Math.random() - 0.5) * 15,
      humidity: 50 + (Math.random() - 0.5) * 30,
    })
  }

  return forecast
}

// 実際のAPIを使用する場合は、以下の関数を実装してください
export const getCurrentPressure = async (): Promise<PressureData> => {
  // 実際のAPIコール
  // const response = await fetch('YOUR_WEATHER_API_ENDPOINT');
  // const data = await response.json();
  // return data;

  // モックデータを返す
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockPressureData())
    }, 1000)
  })
}

export const getForecast = async (): Promise<WeatherForecast[]> => {
  // 実際のAPIコール
  // const response = await fetch('YOUR_FORECAST_API_ENDPOINT');
  // const data = await response.json();
  // return data;

  // モックデータを返す
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockForecast())
    }, 1000)
  })
}

export const getHistoricalData = async (days = 7): Promise<PressureData[]> => {
  const data: PressureData[] = []
  const now = Date.now()

  for (let i = days; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000
    const basePressure = 1013.25
    const variation = (Math.random() - 0.5) * 15

    data.push({
      timestamp,
      pressure: basePressure + variation,
      temperature: 20 + (Math.random() - 0.5) * 10,
      humidity: 50 + (Math.random() - 0.5) * 20,
    })
  }

  return Promise.resolve(data)
}
