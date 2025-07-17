import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-deck-swiper';
import * as Haptics from 'expo-haptics';

import { getCommunityPosts, CommunityPost } from '../services/communityService';

// 天気の種類に応じてアイコンと色を返すヘルパー
const getWeatherIcon = (condition: CommunityPost['weather']['condition']) => {
  const weatherIcons = {
    sunny: { name: 'sunny-outline' as const, color: '#FFC300' },
    cloudy: { name: 'partly-sunny-outline' as const, color: '#8A9BA8' },
    rainy: { name: 'rainy-outline' as const, color: '#007AFF' },
    snowy: { name: 'snow-outline' as const, color: '#A2D2FF' },
  };
  return weatherIcons[condition] || weatherIcons.cloudy;
};

// カードのUIコンポーネント
const Card = ({ card }: { card: CommunityPost }) => {
  if (!card) return null;
  const weatherIcon = getWeatherIcon(card.weather.condition);
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.userIcon}>{card.userIcon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName} numberOfLines={1}>{card.userName} ({card.prefecture})</Text>
            <Text style={styles.timestamp}>{card.timestamp}</Text>
          </View>
        </View>

        <View style={styles.weatherInfo}>
          <Ionicons name={weatherIcon.name} size={18} color={weatherIcon.color} />
          <Text style={styles.weatherText}>
            {card.weather.pressure}hPa ({card.weather.pressureChange > 0 ? '+' : ''}{card.weather.pressureChange})
          </Text>
        </View>

        <Text style={styles.note}>{card.note}</Text>
        
        <View style={styles.symptomsContainer}>
          {card.symptoms.map(symptom => (
            <View key={symptom} style={styles.symptomTag}>
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// すべてのカードを見終わった後の画面
const AllCardsSwiped = () => (
    <View style={styles.allSwipedContainer}>
      <Ionicons name="checkmark-done-circle-outline" size={80} color="#007AFF" />
      <Text style={styles.allSwipedText}>今日の記録はすべて見ました！</Text>
      <Text style={styles.allSwipedSubText}>お疲れ様でした。また後で確認してみてください。</Text>
    </View>
);

const CommunityScreen: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<Swiper<CommunityPost>>(null);
  const [cardIndex, setCardIndex] = useState(0);

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

  const handleSwipe = (hapticStyle: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(hapticStyle);
    setCardIndex(prevIndex => prevIndex + 1);
  };

  const handleEmpathy = (index: number) => {
    if (posts[index]?.isEmpathized) return;
    setPosts(currentPosts => 
      currentPosts.map((post, i) => 
        i === index ? { ...post, isEmpathized: true, empathyCount: post.empathyCount + 1 } : post
      )
    );
  };
  
  const handleButtonPress = (action: 'swipeLeft' | 'swipeRight') => {
    if (swiperRef.current) {
      swiperRef.current[action]();
    }
  }

  if (loading) {
    return (
      <LinearGradient colors={["#F0F4F8", "#D9E2EC"]} style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#F0F4F8", "#D9E2EC"]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="people-outline" size={32} color="#007AFF" />
        <Text style={styles.title}>みんなの記録</Text>
      </View>

      <View style={styles.swiperContainer}>
        {posts.length > 0 && cardIndex < posts.length ? (
          <Swiper
            ref={swiperRef}
            cards={posts}
            renderCard={(card) => <Card card={card} />}
            cardIndex={cardIndex}
            onSwipedLeft={() => handleSwipe(Haptics.ImpactFeedbackStyle.Light)}
            onSwipedRight={(i) => {
              handleEmpathy(i);
              handleSwipe(Haptics.ImpactFeedbackStyle.Medium);
            }}
            onSwipedAll={() => console.log('onSwipedAll')}
            backgroundColor={'transparent'}
            stackSize={3}
            stackSeparation={-28}
            cardVerticalMargin={20}
            animateCardOpacity
            animateOverlayLabelsOpacity
            verticalSwipe={false}
            overlayLabels={{
              left: {
                title: 'また今度',
                style: { label: styles.overlayLabelLeft, wrapper: styles.overlayWrapper },
              },
              right: {
                title: 'わかる',
                style: { label: styles.overlayLabelRight, wrapper: styles.overlayWrapper },
              },
            }}
          />
        ) : (
          !loading && <AllCardsSwiped />
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => handleButtonPress('swipeLeft')}>
          <View style={styles.button}>
            <Ionicons name="close-outline" size={40} color="#FF5A5F" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => handleButtonPress('swipeRight')}>
          <View style={[styles.button, { borderColor: '#00A699' }]}>
            <Ionicons name="heart-outline" size={36} color="#00A699" />
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginTop: 4,
  },
  swiperContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: '80%',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    padding: 24,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  userIcon: { fontSize: 40, marginRight: 12 },
  userName: { fontWeight: 'bold', fontSize: 16, color: '#2D3748' },
  timestamp: { fontSize: 12, color: '#8A9BA8' },
  weatherInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F9FC', borderRadius: 8, padding: 8, alignSelf: 'flex-start', marginBottom: 16 },
  weatherText: { marginLeft: 8, color: '#4A5568', fontWeight: '500' },
  note: { fontSize: 16, color: '#4A5568', lineHeight: 24, marginBottom: 16 },
  symptomsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 'auto', paddingTop: 10 },
  symptomTag: { backgroundColor: '#E2E8F0', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12, marginRight: 8, marginBottom: 8 },
  symptomText: { color: '#4A5568', fontSize: 12, fontWeight: '500' },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '80%',
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderColor: '#FF5A5F',
    borderWidth: 2,
  },
  allSwipedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  allSwipedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    textAlign: 'center',
  },
  allSwipedSubText: {
    fontSize: 16,
    color: '#8A9BA8',
    marginTop: 8,
    textAlign: 'center',
  },
  overlayWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelLeft: {
    borderColor: '#FF5A5F',
    color: '#FF5A5F',
    borderWidth: 3,
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
    borderRadius: 10,
    transform: [{ rotate: '-15deg' }],
  },
  overlayLabelRight: {
    borderColor: '#00A699',
    color: '#00A699',
    borderWidth: 3,
    fontSize: 32,
    fontWeight: '800',
    padding: 10,
    borderRadius: 10,
    transform: [{ rotate: '15deg' }],
  },
});

export default CommunityScreen;