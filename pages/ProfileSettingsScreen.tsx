import { ArrowLeft, Bell, ChevronRight, HelpCircle, LogOut, Shield, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { Card, CardContent } from '../src/components/ui/card';
import { Text as UIText } from '../src/components/ui/text';

const ProfileSettingsScreen = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const settingsOptions = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Update your profile details',
      icon: User,
      color: 'bg-green-500',
      onPress: () => console.log('Personal Info pressed')
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Manage your notification preferences',
      icon: Bell,
      color: 'bg-blue-500',
      onPress: () => console.log('Notifications pressed')
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Control your privacy settings',
      icon: Shield,
      color: 'bg-purple-500',
      onPress: () => console.log('Privacy pressed')
    },
    {
      id: 'help',
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: HelpCircle,
      color: 'bg-orange-500',
      onPress: () => console.log('Help pressed')
    },
    {
      id: 'logout',
      title: 'Logout',
      description: 'Sign out of your account',
      icon: LogOut,
      color: 'bg-red-500',
      onPress: () => console.log('Logout pressed')
    }
  ];

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-50">
        {/* Header */}
        <View className={`px-5 pt-10 pb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <View className="flex-row items-center justify-between mb-6">
            <Pressable className="flex-row items-center">
              <ArrowLeft size={24} color="#065f46" />
              <UIText className="text-primary font-semibold ml-2">Back</UIText>
            </Pressable>
          </View>
          <UIText variant="h2" className="text-primary font-bold text-center">
            Profile & Settings
          </UIText>
        </View>

        {/* Settings Options */}
        <ScrollView className="px-5">
          <View className="space-y-4">
            {settingsOptions.map((option, index) => (
              <Card 
                key={option.id} 
                className={`bg-white border-0 shadow-md transition-all duration-1000 delay-${(index + 1) * 100} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <Pressable 
                  className="p-5 flex-row items-center justify-between"
                  onPress={option.onPress}
                >
                  <View className="flex-row items-center flex-1">
                    <View className={`w-10 h-10 ${option.color} rounded-full items-center justify-center mr-4`}>
                      <option.icon size={20} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                      <UIText className="text-lg text-primary font-semibold mb-1">
                        {option.title}
                      </UIText>
                      <UIText className="text-sm text-muted-foreground">
                        {option.description}
                      </UIText>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#6b7280" />
                </Pressable>
              </Card>
            ))}
          </View>

          {/* App Version Info */}
          <View className={`mt-8 mb-4 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <Card className="bg-white/50 border-0">
              <CardContent className="p-4 items-center">
                <UIText className="text-sm text-muted-foreground text-center">
                  Udavit v1.0.0
                </UIText>
                <UIText className="text-xs text-muted-foreground text-center mt-1">
                  Hydrogen Innovation Platform
                </UIText>
              </CardContent>
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileSettingsScreen;