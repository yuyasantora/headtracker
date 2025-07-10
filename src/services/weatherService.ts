import * as Location from "expo-location"
import type { PressureData, WeatherForecast } from "../types"

const API_KEY="2924a789b91e3a43e56b7b09b43f539c"
const FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast"

// OpenWeatherMap APIからの応答データに対応する型
interface WeatherApiResponse {
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
  if (status !== "granted") {
    console.error("位置情報の権限がありません")
    return null
  }

  return await Location.getCurrentPositionAsync({})
}

// APIからのデータをアプリで使う形式に変換するヘルパー関数
const transformForecastData = (apiData: WeatherApiResponse): WeatherForecast[] => {
  const dailyData: { [key: string]: { pressures: number[]; temps: number[]; humidities: number[] } } = {}

  // 3時間ごとのデータを日毎にグループ化
  apiData.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const dateString = date.toISOString().split("T")[0]

    if (!dailyData[dateString]) {
      dailyData[dateString] = { pressures: [], temps: [], humidities: [] }
    }
    dailyData[dateString].pressures.push(item.main.pressure)
    dailyData[dateString].temps.push(item.main.temp)
    dailyData[dateString].humidities.push(item.main.humidity)
  })

  let previousPressure: number | null = null
  const forecast: WeatherForecast[] = []

  // 日毎の平均値を計算し、アプリの形式に整形
  for (const date in dailyData) {
    const day = dailyData[date]
    const pressure = day.pressures.reduce((a, b) => a + b, 0) / day.pressures.length
    
    let pressureChange = 0
    if (previousPressure !== null) {
      pressureChange = pressure - previousPressure
    }

    let riskLevel: "low" | "medium" | "high" = "low"
    if (Math.abs(pressureChange) > 6) {
      riskLevel = "high"
    } else if (Math.abs(pressureChange) > 3) {
      riskLevel = "medium"
    }
    
    forecast.push({
      date,
      pressure,
      pressureChange,
      riskLevel,
      temperature: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
      humidity: day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length,
    })

    previousPressure = pressure
  }

  // 最初の日の変化量は0になるが、それを含めて先頭から3日分取得する
  return forecast.slice(0, 3)
}

// モックデータ生成関数は削除し、実際のAPIを叩く関数に置き換える

export const getCurrentPressure = async (location: Location.LocationObject): Promise<PressureData> => {
  const { latitude, longitude } = location.coords
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
  
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("現在の気圧データの取得に失敗しました")
  }
  const data = await response.json()

  return {
    timestamp: data.dt * 1000,
    pressure: data.main.pressure,
    temperature: data.main.temp,
    humidity: data.main.humidity,
  }
}

export const getForecast = async (location: Location.LocationObject): Promise<WeatherForecast[]> => {
  const { latitude, longitude } = location.coords
  const url = `${FORECAST_API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=ja`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error("天気予報の取得に失敗しました")
  }
  const data: WeatherApiResponse = await response.json()

  return transformForecastData(data)
}

// getHistoricalDataは一旦そのまま（または削除）
export const getHistoricalData = async (days = 7): Promise<PressureData[]> => {
  // ... (この部分は一旦変更なし)
  return Promise.resolve([]) // 空のデータを返す
}
