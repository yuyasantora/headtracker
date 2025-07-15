import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { getCommunityPosts, CommunityPost } from '../services/communityService';

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getCommunityPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch community posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleEmpathyPress = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            isEmpathized: !post.isEmpathized,
            empathyCount: post.isEmpathized ? post.empathyCount - 1 : post.empathyCount + 1,
          };
        }
        return post;
      })
    );
  };

  const renderItem = ({ item }: { item: CommunityPost }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.userIcon}>{item.userIcon}</Text>
        <View>
          <Text style={styles.userName}>{item.userName} ({item.prefecture})</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>

      <View style={styles.weatherInfo}>
        <Ionicons name="sunny-outline" size={18} color="#FFC300" />
        <Text style={styles.weatherText}>{item.weather.pressure}hPa ({item.weather.pressureChange > 0 ? '+' : ''}{item.weather.pressureChange})</Text>
      </View>

      <Text style={styles.note}>{item.note}</Text>

      <View style={styles.symptomsContainer}>
        {item.symptoms.map(symptom => (
          <View key={symptom} style={styles.symptomTag}>
            <Text style={styles.symptomText}>{symptom}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.empathyButton}
        onPress={() => handleEmpathyPress(item.id)}
      >
        <Ionicons
          name={item.isEmpathized ? "heart" : "heart-outline"}
          size={22}
          color={item.isEmpathized ? "#FF6B6B" : "#8A9BA8"}
        />
        <Text style={[styles.empathyCount, { color: item.isEmpathized ? "#FF6B6B" : "#8A9BA8" }]}>
          {item.empathyCount}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <LinearGradient colors={["#F0F4F8", "#D9E2EC"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#F0F4F8", "#D9E2EC"]} style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <View style={styles.header}>
            <Ionicons name="people-outline" size={32} color="#007AFF" />
            <Text style={styles.title}>みんなの記録</Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A202C', marginTop: 4 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#9DB0C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userIcon: { fontSize: 40, marginRight: 12 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#2D3748' },
  timestamp: { fontSize: 12, color: '#8A9BA8' },
  weatherInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F9FC', borderRadius: 8, padding: 8, alignSelf: 'flex-start', marginBottom: 12 },
  weatherText: { marginLeft: 8, color: '#4A5568', fontWeight: '500' },
  note: { fontSize: 15, color: '#4A5568', lineHeight: 22, marginBottom: 12 },
  symptomsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  symptomTag: { backgroundColor: '#E2E8F0', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10, marginRight: 8, marginBottom: 8 },
  symptomText: { color: '#4A5568', fontSize: 12, fontWeight: '500' },
  empathyButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' },
  empathyCount: { marginLeft: 6, fontSize: 16, fontWeight: 'bold' },
});

export default CommunityScreen;