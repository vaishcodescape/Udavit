import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { RootStackParamList } from '../App';

import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';


 

const { width, height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

  // Floating particles animation values
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;
  const particle4 = useRef(new Animated.Value(0)).current;
  const particle5 = useRef(new Animated.Value(0)).current;

  // Background pulse animations
  const bgPulse1 = useRef(new Animated.Value(1)).current;
  const bgPulse2 = useRef(new Animated.Value(1)).current;
  const bgPulse3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start all animations
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Main leaf bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Title animations with delays
    Animated.timing(titleFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(subtitleFadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 1000,
      useNativeDriver: true,
    }).start();

    // Floating particles animations
    startParticleAnimation(particle1, 3000, 0);
    startParticleAnimation(particle2, 4000, 1000);
    startParticleAnimation(particle3, 3500, 2000);
    startParticleAnimation(particle4, 2800, 500);
    startParticleAnimation(particle5, 3200, 1500);

    // Background pulse animations
    startPulseAnimation(bgPulse1, 4000, 0);
    startPulseAnimation(bgPulse2, 5000, 2000);
    startPulseAnimation(bgPulse3, 6000, 3000);

    // Title pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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
  };

  const startParticleAnimation = (animValue: Animated.Value, duration: number, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: -20,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startPulseAnimation = (animValue: Animated.Value, duration: number, delay: number) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1.2,
          duration: duration,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Animated background gradient */}
        <LinearGradient
          colors={['#34d399', '#6ee7b7', '#5eead4']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        
        {/* Animated background overlay */}
        <Animated.View 
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            opacity: fadeAnim,
          }}
        >
          <LinearGradient
            colors={['rgba(5, 150, 105, 0.3)', 'transparent', 'rgba(52, 211, 153, 0.2)']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
        
        {/* Floating leaf particles */}
        <Animated.View
          style={{
            position: 'absolute',
            opacity: 0.2,
            top: height * 0.1,
            left: width * 0.1,
            transform: [{ translateY: particle1 }],
          }}
        >
          <Leaf size={24} color="#047857" />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            opacity: 0.15,
            top: height * 0.25,
            right: width * 0.15,
            transform: [{ translateY: particle2 }],
          }}
        >
          <Leaf size={32} color="#059669" />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            opacity: 0.1,
            top: height * 0.4,
            left: width * 0.25,
            transform: [{ translateY: particle3 }],
          }}
        >
          <Leaf size={28} color="#065f46" />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            opacity: 0.25,
            bottom: height * 0.45,
            right: width * 0.25,
            transform: [{ translateY: particle4 }],
          }}
        >
          <Leaf size={20} color="#047857" />
        </Animated.View>

        <Animated.View
          style={{
            position: 'absolute',
            opacity: 0.15,
            top: height * 0.5,
            left: width * 0.08,
            transform: [{ translateY: particle5 }],
          }}
        >
          <Leaf size={36} color="#059669" />
        </Animated.View>

        {/* Subtle moving circles for depth */}
        <Animated.View
          style={{
            position: 'absolute',
            width: 128,
            height: 128,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 64,
            top: height * 0.15,
            right: width * 0.2,
            transform: [{ scale: bgPulse1 }],
          }}
        />
        
        <Animated.View
          style={{
            position: 'absolute',
            width: 96,
            height: 96,
            backgroundColor: 'rgba(167, 243, 208, 0.2)',
            borderRadius: 48,
            bottom: height * 0.4,
            left: width * 0.15,
            transform: [{ scale: bgPulse2 }],
          }}
        />
        
        <Animated.View
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            backgroundColor: 'rgba(134, 239, 172, 0.15)',
            borderRadius: 40,
            top: height * 0.33,
            right: width * 0.33,
            transform: [{ scale: bgPulse3 }],
          }}
        />

                 {/* Main content */}
         <ScrollView 
           style={{ flex: 1 }}
           contentContainerStyle={{ 
             flexGrow: 1,
             justifyContent: 'center', 
             alignItems: 'center', 
             paddingHorizontal: 32 
           }}
           showsVerticalScrollIndicator={false}
         >
           <View style={{ alignItems: 'center' }}>
             {/* Main Leaf Icon positioned above the title */}
             <Animated.View
               style={{
                 marginBottom: 48,
                 opacity: fadeAnim,
                 transform: [
                   { translateY: bounceAnim },
                   { scale: pulseAnim },
                 ],
               }}
             >
               <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                 <Leaf 
                   size={100} 
                   color="#065f46"
                 />
               </View>
             </Animated.View>
             
             {/* App Title */}
             <Animated.View
               style={{
                 marginBottom: 24,
                 opacity: titleFadeAnim,
                 transform: [{ scale: pulseAnim }],
               }}
             >
               <Text style={{
                 fontSize: 60,
                 fontWeight: '900',
                 color: '#064e3b',
                 letterSpacing: 8,
                 textAlign: 'center',
                 textShadowColor: 'rgba(0, 0, 0, 0.1)',
                 textShadowOffset: { width: 2, height: 2 },
                 textShadowRadius: 4,
               }}>
                 Udavit
               </Text>
             </Animated.View>
             
             {/* Optional subtitle */}
             <Animated.View
               style={{
                 opacity: subtitleFadeAnim,
               }}
             >
               <Text style={{
                 fontSize: 20,
                 color: '#065f46',
                 opacity: 0.9,
                 textAlign: 'center',
                 fontWeight: '500',
                 letterSpacing: 2,
               }}>
                 Empowering Green Innovation
               </Text>
             </Animated.View>
             
             {/* Navigation Button */}
             <Animated.View
               style={{
                 marginTop: 40,
                 opacity: subtitleFadeAnim,
               }}
             >
               <Pressable
                 onPress={() => navigation.navigate('OnBoarding')}
                 style={{
                   backgroundColor: '#22577a',
                   paddingVertical: 16,
                   paddingHorizontal: 32,
                   borderRadius: 12,
                   alignItems: 'center',
                   shadowColor: '#000',
                   shadowOffset: { width: 0, height: 2 },
                   shadowOpacity: 0.1,
                   shadowRadius: 4,
                   elevation: 3,
                 }}
               >
                 <Text style={{
                   color: '#ffffff',
                   fontSize: 18,
                   fontWeight: '600',
                   textAlign: 'center'
                 }}>
                   Get Started
                 </Text>
               </Pressable>
             </Animated.View>
             
            
           </View>
         </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;