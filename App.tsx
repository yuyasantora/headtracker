"use client"
import { useState, useEffect} from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

import HomeScreen from "./src/screens/HomeScreen"
import ChartScreen from "./src/screens/ChartScreen"
import RecordScreen from "./src/screens/RecordScreen"
import SettingsScreen from "./src/screens/SettingsScreen"
import OnboardingScreen from "./src/screens/OnboardingScreen"
import MatchingScreen from "./src/screens/MatchingScreen"

const Tab = createBottomTabNavigator()

interface UserProfile {
  prefecture: string
  age: number
  gender: "male" | "female" | "other"| ""
  headacheFrequency: "daily" | "weekly" | "monthly" |
  "rarely" | ""
  pressureSensitivity: number
  commonSymptoms: string[]
  triggers: string[]
  notifications: boolean
}



export default function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = 
  useState<boolean | null>(null)

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    checkOnboardingStatus()
  }, [])

  const checkOnboardingStatus = async() => {
    try {
      const profile = await AsyncStorage.getItem("userProfile")
      if (profile) {
        setUserProfile(JSON.parse(profile))
        setIsOnboardingComplete(true)
      } else {
        setIsOnboardingComplete(false)
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      setIsOnboardingComplete(false)
  }
  
    
  }

  const handleOnboardingComplete = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile))
      setUserProfile(profile)
      setIsOnboardingComplete(true)
    } catch (error) {
      console.error("Error saving user profile:", error)
    }
  }

  if (isOnboardingComplete === null) {
    return null
  }
  if (!isOnboardingComplete) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }
  // メインアプリ
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline"
            } else if (route.name === "Chart") {
              iconName = focused ? "analytics" : "analytics-outline"
            } else if (route.name === "Record") {
              iconName = focused ? "add-circle" : "add-circle-outline"
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline"
            } else if (route.name === "仲間") {
              iconName = focused ? "people" : "people-outline"
            } else {
              iconName = "help-outline"
            }

            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          headerStyle: {
            backgroundColor: "#007AFF",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: "ホーム" }} />
        <Tab.Screen name="Chart" component={ChartScreen} options={{ title: "グラフ" }} />
        <Tab.Screen name="Record" component={RecordScreen} options={{ title: "記録" }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "設定" }} />
        <Tab.Screen
          name="仲間"
          component={MatchingScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
