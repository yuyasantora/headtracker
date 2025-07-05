"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const SettingsScreen: React.FC = () => {
  const [notifications, setNotifications] = useState(true)
  const [highRiskAlerts, setHighRiskAlerts] = useState(true)
  const [dailyReports, setDailyReports] = useState(false)
  const [temperatureUnit, setTemperatureUnit] = useState<"celsius" | "fahrenheit">("celsius")
  const [pressureUnit, setPressureUnit] = useState<"hPa" | "mmHg">("hPa")

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value)
    if (!value) {
      setHighRiskAlerts(false)
      setDailyReports(false)
    }
  }

  const handleTemperatureUnitChange = () => {
    Alert.alert("温度単位の変更", "温度の表示単位を選択してください", [
      { text: "摂氏 (°C)", onPress: () => setTemperatureUnit("celsius") },
      { text: "華氏 (°F)", onPress: () => setTemperatureUnit("fahrenheit") },
      { text: "キャンセル", style: "cancel" },
    ])
  }

  const handlePressureUnitChange = () => {
    Alert.alert("気圧単位の変更", "気圧の表示単位を選択してください", [
      { text: "ヘクトパスカル (hPa)", onPress: () => setPressureUnit("hPa") },
      { text: "水銀柱ミリメートル (mmHg)", onPress: () => setPressureUnit("mmHg") },
      { text: "キャンセル", style: "cancel" },
    ])
  }

  const handleDataExport = () => {
    Alert.alert("データエクスポート", "記録されたデータをCSVファイルとしてエクスポートしますか？", [
      { text: "エクスポート", onPress: () => console.log("データエクスポート実行") },
      { text: "キャンセル", style: "cancel" },
    ])
  }

  const handleDataReset = () => {
    Alert.alert("データリセット", "すべての記録データが削除されます。この操作は取り消せません。", [
      {
        text: "リセット",
        style: "destructive",
        onPress: () => console.log("データリセット実行"),
      },
      { text: "キャンセル", style: "cancel" },
    ])
  }

  const SettingItem: React.FC<{
    icon: string
    title: string
    subtitle?: string
    onPress?: () => void
    rightComponent?: React.ReactNode
  }> = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#007AFF" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent && <View style={styles.settingRight}>{rightComponent}</View>}
      {onPress && !rightComponent && <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />}
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知設定</Text>

        <SettingItem
          icon="notifications-outline"
          title="通知を有効にする"
          subtitle="気圧変化や頭痛予報の通知を受け取る"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingItem
          icon="warning-outline"
          title="高リスク警告"
          subtitle="頭痛リスクが高い時に通知"
          rightComponent={
            <Switch
              value={highRiskAlerts}
              onValueChange={setHighRiskAlerts}
              disabled={!notifications}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          }
        />

        <SettingItem
          icon="calendar-outline"
          title="日次レポート"
          subtitle="毎日の気圧予報を朝に通知"
          rightComponent={
            <Switch
              value={dailyReports}
              onValueChange={setDailyReports}
              disabled={!notifications}
              trackColor={{ false: "#E5E5EA", true: "#34C759" }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>表示設定</Text>

        <SettingItem
          icon="thermometer-outline"
          title="温度単位"
          subtitle={temperatureUnit === "celsius" ? "摂氏 (°C)" : "華氏 (°F)"}
          onPress={handleTemperatureUnitChange}
        />

        <SettingItem
          icon="speedometer-outline"
          title="気圧単位"
          subtitle={pressureUnit === "hPa" ? "ヘクトパスカル (hPa)" : "水銀柱ミリメートル (mmHg)"}
          onPress={handlePressureUnitChange}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>データ管理</Text>

        <SettingItem
          icon="download-outline"
          title="データエクスポート"
          subtitle="記録データをCSVファイルで出力"
          onPress={handleDataExport}
        />

        <SettingItem
          icon="trash-outline"
          title="データリセット"
          subtitle="すべての記録データを削除"
          onPress={handleDataReset}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アプリについて</Text>

        <SettingItem icon="information-circle-outline" title="バージョン情報" subtitle="v1.0.0" />

        <SettingItem
          icon="help-circle-outline"
          title="ヘルプ・サポート"
          subtitle="使い方やよくある質問"
          onPress={() => Alert.alert("ヘルプ", "ヘルプページを開きます")}
        />

        <SettingItem
          icon="shield-checkmark-outline"
          title="プライバシーポリシー"
          subtitle="個人情報の取り扱いについて"
          onPress={() => Alert.alert("プライバシーポリシー", "プライバシーポリシーを表示します")}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>頭痛予報アプリ v1.0.0{"\n"}© 2024 HeadacheTracker</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  section: {
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  settingRight: {
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 20,
  },
})

export default SettingsScreen
