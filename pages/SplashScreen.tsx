import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Leaf } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Text as UIText } from '../src/components/ui/text';

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Navigate to welcome screen after 3 seconds
    const navigationTimer = setTimeout(() => {
      navigation.navigate('Welcome');
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(navigationTimer);
    };
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-gradient-to-br from-green-400 to-teal-500 justify-center items-center">
        {/* Logo Container */}
        <View className={`items-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          {/* Logo Circle */}
          <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center mb-8 shadow-2xl">
            <Leaf size={64} color="#ffffff" />
          </View>
          
          {/* App Name */}
          <UIText className="text-4xl font-black text-white mb-2 tracking-wider">
            Udavit
          </UIText>
          
          {/* Tagline */}
          <UIText className="text-lg text-white/90 font-medium text-center">
            Hydrogen Innovation Platform
          </UIText>
        </View>

        {/* Loading Indicator */}
        <View className={`absolute bottom-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <View className="flex-row space-x-2">
            <View className="w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            <View className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-100" />
            <View className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-200" />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;