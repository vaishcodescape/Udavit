import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Leaf, Menu, Star } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';

const OnBoardingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(100)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Start continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#d1fae5' }}>
        {/* Header */}
        <Animated.View 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 40,
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }}
        >
          {/* Hamburger Menu */}
          <Pressable>
            <Menu size={24} color="#065f46" />
          </Pressable>
          
          {/* Empty space for balance */}
          <View style={{ width: 24 }} />
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Circular Icons */}
          <Animated.View 
            style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 60,
              gap: 20,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }}
          >
            {/* Green Circle */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#10b981',
              justifyContent: 'center',
              alignItems: 'center'
            }} />
            
            {/* Star Icon */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#ffffff',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Star size={20} color="#ffffff" />
            </View>
            
            {/* Leaf Icon */}
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: '#ffffff',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Leaf size={20} color="#ffffff" />
            </View>
          </Animated.View>

          {/* Main Content - Bullet Points */}
          <View style={{ paddingHorizontal: 40 }}>
            <View style={{ marginBottom: 30 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#38a3a5',
                  marginRight: 16
                }} />
                <Text style={{
                  fontSize: 18,
                  color: '#38a3a5',
                  fontWeight: '500'
                }}>
                  Apply for subsidies easily
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 30 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#38a3a5',
                  marginRight: 16
                }} />
                <Text style={{
                  fontSize: 18,
                  color: '#38a3a5',
                  fontWeight: '500'
                }}>
                  Track milestones in no time
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 30 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: '#38a3a5',
                  marginRight: 16
                }} />
                <Text style={{
                  fontSize: 18,
                  color: '#38a3a5',
                  fontWeight: '500'
                }}>
                  Get AI powered project feedback
                </Text>
              </View>
            </View>
          </View>

          {/* Navigation Button */}
          <View style={{ paddingHorizontal: 40, marginTop: 40 }}>
          <Pressable
            onPress={() => navigation.navigate('LoginSignup')}
            style={{
              backgroundColor: '#22577a',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              marginBottom: 20
            }}
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: '600'
            }}>
              Continue to Login
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Welcome')}
            style={{
              backgroundColor: 'transparent',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#22577a'
            }}
          >
            <Text style={{
              color: '#22577a',
              fontSize: 16,
              fontWeight: '500'
            }}>
              Back to Welcome
            </Text>
          </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;
