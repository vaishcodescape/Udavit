import { useEffect, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

const MilestoneTrackingScreen = () => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
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
    
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
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
            Milestone Tracking
          </Text>
        </Animated.View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {/* Milestone Name */}
          <View style={{ 
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{
              fontSize: 20,
              color: '#065f46',
              fontWeight: '600',
              marginBottom: 16
            }}>
              Milestone Name
            </Text>
            
            {/* Progress Bar */}
            <View style={{ marginBottom: 16 }}>
              <View style={{
                height: 8,
                backgroundColor: '#e5e7eb',
                borderRadius: 4,
                overflow: 'hidden'
              }}>
                <View style={{
                  width: '80%',
                  height: '100%',
                  backgroundColor: '#10b981',
                  borderRadius: 4
                }} />
              </View>
              <Text style={{
                fontSize: 16,
                color: '#10b981',
                fontWeight: '600',
                marginTop: 8,
                textAlign: 'center'
              }}>
                80% Complete
              </Text>
            </View>

            {/* Progress Lines */}
            <View style={{ marginTop: 20 }}>
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb',
                marginBottom: 8
              }} />
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb',
                marginBottom: 8
              }} />
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb',
                marginBottom: 8
              }} />
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb'
              }} />
            </View>
          </View>

          {/* Additional Details */}
          <View style={{ 
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{
              fontSize: 18,
              color: '#065f46',
              fontWeight: '600',
              marginBottom: 16
            }}>
              Milestone Details
            </Text>
            
            <View style={{ marginBottom: 16 }}>
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb',
                marginBottom: 8
              }} />
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb',
                marginBottom: 8
              }} />
              <View style={{
                height: 2,
                backgroundColor: '#e5e7eb'
              }} />
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 20, 
          right: 20 
        }}>
          <Pressable style={{
                          backgroundColor: '#22577a',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <Text style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: '600'
            }}>
              Submit Application
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MilestoneTrackingScreen;
