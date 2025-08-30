import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Leaf } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, View } from 'react-native';
import { RootStackParamList } from '../App';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const leafRotateAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(textSlideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Leaf rotation animation
    Animated.loop(
      Animated.timing(leafRotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
    
    // Navigate to Welcome screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigation]);
  
  const leafRotation = leafRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ 
        flex: 1, 
        backgroundColor: '#065f46',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40
      }}>
        {/* Leaf Icon */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: leafRotation }
            ],
            marginBottom: 40
          }}
        >
          <View style={{
            width: 80,
            height: 80,
            backgroundColor: '#10b981',
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8
          }}>
            <Leaf size={40} color="#ffffff" />
          </View>
        </Animated.View>
        
        {/* Main Title */}
        <Animated.Text
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 16,
            opacity: fadeAnim,
            transform: [{ translateY: textSlideAnim }]
          }}
        >
          Udavit
        </Animated.Text>
        
        {/* Subtitle */}
        <Animated.Text
          style={{
            fontSize: 18,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 26,
            opacity: fadeAnim,
            transform: [{ translateY: textSlideAnim }]
          }}
        >
          Empowering Green Hydrogen Innovation
        </Animated.Text>
        
        {/* Loading Indicator */}
        <Animated.View
          style={{
            marginTop: 60,
            opacity: fadeAnim,
            transform: [{ translateY: textSlideAnim }]
          }}
        >
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#10b981',
            borderTopColor: 'transparent'
          }} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
