import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowRight, Leaf, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, useWindowDimensions, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Card, CardContent } from '../src/components/ui/card';
import { Text as UIText } from '../src/components/ui/text';

const {width, height} = useWindowDimensions();

const WelcomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigation.navigate('LoginSignup');
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 relative overflow-hidden">
        {/* Background Gradient */}
        <View className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-300 to-teal-300" />

        {/* Overlay Gradient */}
        <View className={`absolute inset-0 transition-all duration-1000 bg-gradient-to-t from-emerald-600/30 via-transparent to-green-400/20 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

        {/* Floating Elements */}
        <View className={`absolute top-20 left-8 w-16 h-16 bg-white/10 rounded-full transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
        <View className={`absolute top-40 right-12 w-12 h-12 bg-white/15 rounded-full transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
        <View className={`absolute bottom-40 left-12 w-20 h-20 bg-white/5 rounded-full transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
        <View className={`absolute bottom-60 right-8 w-14 h-14 bg-white/20 rounded-full transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center w-full">
            {/* Logo */}
            <View className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <View className="items-center justify-center w-30 h-30 rounded-full bg-white/15 border-2 border-white/20 shadow-2xl">
                <Leaf size={60} className="text-white" />
              </View>
            </View>

            {/* Title */}
            <View className={`mb-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
              <UIText variant="h1" className="text-white text-center font-black tracking-wider">
                Udavit
              </UIText>
            </View>

            {/* Subtitle */}
            <View className={`mb-8 items-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <Badge variant="secondary" className="bg-white/20 border-white/30 mb-3">
                <Sparkles size={16} className="text-white" />
                <UIText className="text-white font-semibold ml-1">Hydrogen Innovation Platform</UIText>
              </Badge>
              <UIText variant="lead" className="text-white/90 text-center font-medium">
                Subsidized, Secured & Automated
              </UIText>
            </View>

            {/* Feature Card */}
            <View className={`w-full mb-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <UIText className="text-white font-semibold text-lg mb-1">Smart Subsidies</UIText>
                      <UIText className="text-white/80 text-sm">Automated funding for hydrogen projects</UIText>
                    </View>
                    <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                      <Leaf size={24} className="text-white" />
                    </View>
                  </View>
                </CardContent>
              </Card>
            </View>

            {/* CTA Button */}
            <View className={`w-full transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
              <Button
                onPress={handleGetStarted}
                className="bg-white border-0 h-14 rounded-xl shadow-lg"
                size="lg"
              >
                <UIText className="text-primary font-bold text-lg">Get Started</UIText>
                <ArrowRight size={20} className="text-primary" />
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;