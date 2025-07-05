export interface PressureData {
  timestamp: number
  pressure: number
  temperature: number
  humidity: number
}

export interface HeadacheRecord {
  id: string
  timestamp: number
  severity: number // 1-5
  symptoms: string[]
  notes?: string
}

export interface WeatherForecast {
  date: string
  pressure: number
  pressureChange: number
  riskLevel: "low" | "medium" | "high"
  temperature: number
  humidity: number
}

export type SymptomType = "頭痛" | "めまい" | "肩こり" | "眠気" | "関節痛" | "だるさ"
