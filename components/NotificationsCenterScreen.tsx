import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, ArrowLeft, Bell, CheckCircle, FileText, Info, Lock, Settings, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';

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
      color: '#10b981',
      onPress: () => navigation.navigate('ProfileSettings')
    },
    {
      id: 2,
      title: 'Manage KYC Documents',
      icon: FileText,
      color: '#f59e0b',
      onPress: () => navigation.navigate('ProfileSettings')
    },
    {
      id: 3,
      title: 'Change Password',
      icon: Lock,
      color: '#ef4444',
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
        return <CheckCircle size={20} color="#10b981" />;
      case 'warning':
        return <AlertCircle size={20} color="#f59e0b" />;
      case 'info':
        return <Info size={20} color="#3b82f6" />;
      default:
        return <Bell size={20} color="#6b7280" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#065f46' }}>
        {/* Header */}
        <Animated.View 
          style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Pressable 
            onPress={() => navigation.goBack()}
            style={{ marginRight: 20 }}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </Pressable>
          
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '600', 
            color: '#ffffff'
          }}>
            Notifications Center
          </Text>
        </Animated.View>

        {/* Content */}
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          <Animated.View 
            style={{ 
              marginBottom: 24,
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 16
            }}>
              Quick Actions
            </Text>
            
            {settingsOptions.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={option.onPress}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${option.color}20`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16
                }}>
                  <option.icon size={20} color={option.color} />
                </View>
                
                <Text style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: '#065f46',
                  flex: 1
                }}>
                  {option.title}
                </Text>
                
                <View style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: option.color
                }} />
              </Pressable>
            ))}
          </Animated.View>

          {/* Recent Notifications */}
          <Animated.View 
            style={{ 
              marginBottom: 24,
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: 16
            }}>
              Recent Notifications
            </Text>
            
            {notifications.map((notification, index) => (
              <View key={notification.id} style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                borderLeftWidth: 4,
                borderLeftColor: getNotificationColor(notification.type)
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  marginBottom: 8
                }}>
                  <View style={{ marginRight: 12, marginTop: 2 }}>
                    {getNotificationIcon(notification.type)}
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#065f46',
                      marginBottom: 4
                    }}>
                      {notification.title}
                    </Text>
                    
                    <Text style={{
                      fontSize: 14,
                      color: '#6b7280',
                      lineHeight: 20,
                      marginBottom: 8
                    }}>
                      {notification.message}
                    </Text>
                    
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text style={{
                        fontSize: 12,
                        color: '#9ca3af'
                      }}>
                        {notification.time}
                      </Text>
                      
                      {!notification.read && (
                        <View style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: getNotificationColor(notification.type)
                        }} />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* Notification Settings */}
          <Animated.View 
            style={{ 
              marginBottom: 40,
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <View style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <Settings size={20} color="#065f46" />
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#065f46',
                  marginLeft: 8
                }}>
                  Notification Preferences
                </Text>
              </View>
              
              <Text style={{
                fontSize: 14,
                color: '#6b7280',
                lineHeight: 20,
                marginBottom: 16
              }}>
                Customize how you receive notifications about your applications, milestones, and funding updates.
              </Text>
              
              <Pressable
                onPress={() => navigation.navigate('ProfileSettings')}
                style={{
                  backgroundColor: '#065f46',
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                  alignSelf: 'flex-start'
                }}
              >
                <Text style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  Configure Settings
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsCenterScreen;
