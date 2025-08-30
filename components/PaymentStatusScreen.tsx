import { FileText, Lock, User } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const PaymentStatusScreen = () => {
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
    
    // Stagger animation for menu items
    Animated.timing(staggerAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#065f46' }}>
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
            color: '#ffffff'
          }}>
            Payment Status
          </Text>
        </Animated.View>

        {/* Menu Items */}
        <ScrollView style={{ paddingHorizontal: 20 }}>
          {/* Edit Startup Details */}
          <Pressable style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16
            }}>
              <User size={20} color="#ffffff" />
            </View>
            <Text style={{
              fontSize: 18,
              color: '#ffffff',
              fontWeight: '500'
            }}>
              Edit startup details
            </Text>
          </Pressable>

          {/* Manage KYC Documents */}
          <Pressable style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16
            }}>
              <FileText size={20} color="#ffffff" />
            </View>
            <Text style={{
              fontSize: 18,
              color: '#ffffff',
              fontWeight: '500'
            }}>
              Manage KYC documents
            </Text>
          </Pressable>

          {/* Change Password */}
          <Pressable style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16
            }}>
              <Lock size={20} color="#ffffff" />
            </View>
            <Text style={{
              fontSize: 18,
              color: '#ffffff',
              fontWeight: '500'
            }}>
              Change password
            </Text>
          </Pressable>
        </ScrollView>

        {/* Additional Content */}
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingHorizontal: 20
        }}>
          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            lineHeight: 24
          }}>
            Your payment status and notifications will appear here. 
            Use the menu options above to manage your account settings.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentStatusScreen;
