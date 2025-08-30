import { Bell, ChevronRight, HelpCircle, LogOut, Shield, User } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const ProfileSettingsScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const staggerAnim = useRef(new Animated.Value(0)).current;
  
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
    
    // Stagger animation for settings items
    Animated.timing(staggerAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#d1fae5' }}>
        {/* Header */}
        <Animated.View 
          style={{ 
            alignItems: 'center', 
            paddingTop: 40,
            paddingBottom: 40,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Text style={{ 
            fontSize: 24, 
            fontWeight: '700', 
            color: '#065f46'
          }}>
            Profile & Settings
          </Text>
        </Animated.View>

        {/* Settings Options */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {/* Personal Information */}
          <Pressable style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <User size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Personal Information
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Update your profile details
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </Pressable>

          {/* Notifications */}
          <Pressable style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <Bell size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Notifications
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Manage your notification preferences
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </Pressable>

          {/* Privacy & Security */}
          <Pressable style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <Shield size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Privacy & Security
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Control your privacy settings
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </Pressable>

          {/* Help & Support */}
          <Pressable style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <HelpCircle size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Help & Support
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Get help and contact support
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </Pressable>

          {/* Logout */}
          <Pressable style={{
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#ef4444',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <LogOut size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Logout
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Sign out of your account
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#6b7280" />
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileSettingsScreen;
