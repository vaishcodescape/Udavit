import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, CheckCircle, ChevronRight, Star, Zap } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Button } from '../src/components/ui/button';
import { Text as UIText } from '../src/components/ui/text';

const { width: screenWidth } = Dimensions.get('window');

const OnBoardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
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
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
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
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-100">
        {/* Progress Bar */}
        <View className={`h-1 bg-gray-200 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <View 
            className="h-full bg-green-500 rounded-sm transition-all duration-1000"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </View>

        {/* Header */}
        <View className={`flex-row items-center justify-between px-5 pt-5 pb-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          {/* Step Counter */}
          <UIText className="text-base text-green-800 font-semibold">
            {currentStep + 1} of {steps.length}
          </UIText>
          
          {/* Skip Button */}
          <Pressable onPress={handleSkip} className="px-3 py-1 rounded-lg bg-green-100 active:bg-green-200">
            <UIText className="text-base text-green-600 font-semibold">
              Skip
            </UIText>
          </Pressable>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          {/* Main Content */}
          <View className="flex-1 justify-center px-5">
            {/* Icon Container */}
            <View className={`items-center mb-15 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <View 
                className="w-30 h-30 rounded-full justify-center items-center shadow-2xl"
                style={{ backgroundColor: steps[currentStep].color }}
              >
                {steps[currentStep].icon}
              </View>
            </View>

            {/* Title */}
            <View className={`mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <UIText className="text-3xl text-green-800 font-bold text-center mb-4">
                {steps[currentStep].title}
              </UIText>
              
              <UIText className="text-lg text-green-600 text-center leading-6">
                {steps[currentStep].description}
              </UIText>
            </View>

            {/* Step Indicators */}
            <View className={`flex-row justify-center space-x-2 mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              {steps.map((_, index) => (
                <View
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-green-500 scale-110' 
                      : 'bg-green-200'
                  }`}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className={`px-5 pb-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <View className="flex-row space-x-3">
            {/* Next Button */}
            <Button
              onPress={handleNextStep}
              className="flex-1 h-12 bg-green-600 rounded-xl shadow-lg"
              size="lg"
            >
              <UIText className="text-white font-bold text-lg">
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </UIText>
              {currentStep === steps.length - 1 ? (
                <ArrowRight size={20} color="#ffffff" />
              ) : (
                <ChevronRight size={20} color="#ffffff" />
              )}
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnBoardingScreen;