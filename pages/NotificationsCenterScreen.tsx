import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, ArrowLeft, Bell, CheckCircle, FileText, Info, Lock, Settings, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Button } from '../src/components/ui/button';
import { Card, CardContent } from '../src/components/ui/card';
import { Text as UIText } from '../src/components/ui/text';

const NotificationsCenterScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const staggerAnim = useRef(new Animated.Value(0)).current;
  
  // Mock notifications data
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Application Approved',
      message: 'Your hydrogen production facility application has been approved!',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Document Update Required',
      message: 'Please update your KYC documents to continue processing.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Milestone Completed',
      message: 'Congratulations! You have completed the research phase milestone.',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Funding Released',
      message: 'The first tranche of funding has been released to your account.',
      time: '1 week ago',
      read: true
    }
  ]);
  
  // Settings options
  const [settingsOptions] = useState([
    {
      id: 1,
      title: 'Edit Startup Details',
      icon: User,
      color: 'green-500',
      onPress: () => navigation.navigate('ProfileSettings')
    },
    {
      id: 2,
      title: 'Manage KYC Documents',
      icon: FileText,
      color: 'amber-500',
      onPress: () => navigation.navigate('ProfileSettings')
    },
    {
      id: 3,
      title: 'Change Password',
      icon: Lock,
      color: 'red-500',
      onPress: () => navigation.navigate('ProfileSettings')
    }
  ]);
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Stagger animation for items
    Animated.timing(staggerAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'warning':
        return <AlertCircle size={20} className="text-amber-600" />;
      case 'info':
        return <Info size={20} className="text-blue-600" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'green-600';
      case 'warning':
        return 'amber-600';
      case 'info':
        return 'blue-600';
      default:
        return 'gray-500';
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-teal-700">
        {/* Header */}
        <Animated.View
          className="flex-row items-center px-5 pt-5 pb-5"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-5"
          >
            <ArrowLeft size={24} className="text-white" />
          </Pressable>

          <UIText className="text-xl font-semibold text-white">
            Notifications Center
          </UIText>
        </Animated.View>

        {/* Content */}
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          <Animated.View
            className="mb-6"
            style={{
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <UIText className="text-lg font-semibold text-white mb-4">
              Quick Actions
            </UIText>
            
            {settingsOptions.map((option, index) => (
              <Card key={option.id} className="mb-3 bg-white border-0 shadow-lg">
                <CardContent className="p-4">
                  <Pressable
                    onPress={option.onPress}
                    className="flex-row items-center"
                  >
                    <View className={`w-10 h-10 bg-${option.color}/20 rounded-full items-center justify-center mr-4`}>
                      <option.icon size={20} className={`text-${option.color}`} />
                    </View>

                    <UIText className="text-base font-medium text-primary flex-1">
                      {option.title}
                    </UIText>

                    <View className={`w-2 h-2 bg-${option.color} rounded-full`} />
                  </Pressable>
                </CardContent>
              </Card>
            ))}
          </Animated.View>

          {/* Recent Notifications */}
          <Animated.View
            className="mb-6"
            style={{
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <UIText className="text-lg font-semibold text-white mb-4">
              Recent Notifications
            </UIText>
            
            {notifications.map((notification, index) => (
              <Card key={notification.id} className={`mb-3 bg-white border-0 shadow-lg border-l-4 border-l-${getNotificationColor(notification.type)}`}>
                <CardContent className="p-4">
                  <View className="flex-row items-start">
                    <View className="mr-3 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </View>

                    <View className="flex-1">
                      <UIText className="text-base font-semibold text-primary mb-1">
                        {notification.title}
                      </UIText>

                      <UIText className="text-sm text-gray-600 leading-5 mb-2">
                        {notification.message}
                      </UIText>

                      <View className="flex-row justify-between items-center">
                        <UIText className="text-xs text-gray-500">
                          {notification.time}
                        </UIText>

                        {!notification.read && (
                          <View className={`w-2 h-2 bg-${getNotificationColor(notification.type)} rounded-full`} />
                        )}
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </Animated.View>

          {/* Notification Settings */}
          <Animated.View
            className="mb-10"
            style={{
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-5">
                <View className="flex-row items-center mb-4">
                  <Settings size={20} className="text-teal-700 mr-2" />
                  <UIText className="text-lg font-semibold text-primary">
                    Notification Preferences
                  </UIText>
                </View>

                <UIText className="text-sm text-gray-600 leading-5 mb-4">
                  Customize how you receive notifications about your applications, milestones, and funding updates.
                </UIText>

                <Button
                  onPress={() => navigation.navigate('ProfileSettings')}
                  className="bg-teal-700 self-start"
                >
                  <UIText className="text-white font-medium">
                    Configure Settings
                  </UIText>
                </Button>
              </CardContent>
            </Card>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsCenterScreen;
