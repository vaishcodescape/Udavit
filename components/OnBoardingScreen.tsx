import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, CheckCircle, ChevronRight, Star, Zap } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';

const { width: screenWidth } = Dimensions.get('window');

const OnBoardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;
  const buttonSlideAnim = useRef(new Animated.Value(30)).current;
  
  // Step data
  const steps = [
    {
      icon: <Zap size={40} color="#ffffff" />,
      title: "Apply for Subsidies Easily",
      description: "Streamlined application process for hydrogen and chemical industry projects",
      color: "#10b981"
    },
    {
      icon: <CheckCircle size={40} color="#ffffff" />,
      title: "Track Milestones in Real-Time",
      description: "Monitor your project progress with intelligent milestone tracking",
      color: "#38a3a5"
    },
    {
      icon: <Star size={40} color="#ffffff" />,
      title: "AI-Powered Project Feedback",
      description: "Get intelligent insights and recommendations for your projects",
      color: "#22577a"
    }
  ];

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
    }).start();

    // Icon animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconScaleAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(iconScaleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Button animation
    Animated.timing(buttonSlideAnim, {
      toValue: 0,
      duration: 800,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.navigate('LoginSignup');
    }
  };

  const handleSkip = () => {
    navigation.navigate('LoginSignup');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#d1fae5' }}>
        {/* Progress Bar */}
        <Animated.View 
          style={{ 
            height: 4,
            backgroundColor: '#e5e7eb',
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }}
        >
          <Animated.View 
            style={{
              height: '100%',
              backgroundColor: '#10b981',
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }),
              borderRadius: 2
            }}
          />
        </Animated.View>

        {/* Header */}
        <Animated.View 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }]
          }}
        >
          {/* Step Counter */}
          <Text style={{
            fontSize: 16,
            color: '#065f46',
            fontWeight: '600'
          }}>
            {currentStep + 1} of {steps.length}
          </Text>
          
          {/* Skip Button */}
          <Pressable onPress={handleSkip}>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Skip
            </Text>
          </Pressable>
        </Animated.View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          {/* Main Content */}
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            {/* Icon Container */}
            <Animated.View 
              style={{ 
                alignItems: 'center',
                marginBottom: 60,
                transform: [{ scale: iconScaleAnim }]
              }}
            >
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: steps[currentStep].color,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 16,
                elevation: 8
              }}>
                {steps[currentStep].icon}
              </View>
            </Animated.View>

            {/* Title */}
            <Animated.View 
              style={{ 
                marginBottom: 20,
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }}
            >
              <Text style={{
                fontSize: 28,
                color: '#065f46',
                fontWeight: '700',
                textAlign: 'center',
                lineHeight: 36,
                marginBottom: 16
              }}>
                {steps[currentStep].title}
              </Text>
              
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: 20
              }}>
                {steps[currentStep].description}
              </Text>
            </Animated.View>

            {/* Step Indicators */}
            <Animated.View 
              style={{ 
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 60,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }}
            >
              {steps.map((_, index) => (
                                 <View
                   key={index}
                   style={{
                     width: index === currentStep ? 12 : 8,
                     height: index === currentStep ? 12 : 8,
                     borderRadius: index === currentStep ? 6 : 4,
                     backgroundColor: index === currentStep ? '#10b981' : '#d1d5db',
                     marginHorizontal: 4
                   }}
                 />
              ))}
            </Animated.View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <Animated.View 
          style={{ 
            paddingHorizontal: 20,
            paddingBottom: 20,
            transform: [{ translateY: buttonSlideAnim }]
          }}
        >
          {/* Primary Button */}
          <Pressable
            onPress={handleNextStep}
            style={{
              backgroundColor: '#10b981',
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '600',
                marginRight: 8
              }}>
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </Text>
              {currentStep < steps.length - 1 ? (
                <ChevronRight size={20} color="#ffffff" />
              ) : (
                <ArrowRight size={20} color="#ffffff" />
              )}
            </View>
          </Pressable>

          {/* Secondary Button */}
          <Pressable
            onPress={() => navigation.navigate('Welcome')}
            style={{
              backgroundColor: 'transparent',
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#d1d5db'
            }}
          >
            <Text style={{
              color: '#6b7280',
              fontSize: 16,
              fontWeight: '500'
            }}>
              Back to Welcome
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;
