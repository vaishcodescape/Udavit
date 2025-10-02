import { CheckCircle, Clock, ArrowLeft } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Text as UIText } from '../src/components/ui/text';
import { Badge } from '../src/components/ui/badge';
import { Progress } from '../src/components/ui/progress';

const ApplicationStatusScreen = () => {
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
    
    // Animate progress bars
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
            Application Status Page
          </Text>
        </Animated.View>

        {/* Status Sections */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          {/* First Review Section */}
          <View style={{ 
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#38a3a5',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <CheckCircle size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  color: '#22577a',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Review
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Initial application review completed
                </Text>
              </View>
            </View>
            
            {/* Progress Lines */}
            <View style={{ marginLeft: 56 }}>
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

          {/* Second Review Section */}
          <View style={{ 
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#10b981',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <CheckCircle size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Review
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Technical assessment in progress
                </Text>
              </View>
              <View style={{
                backgroundColor: '#10b981',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16
              }}>
                <Text style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600'
                }}>
                  80%
                </Text>
              </View>
            </View>
          </View>

          {/* Scouting Section */}
          <View style={{ 
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#f59e0b',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16
              }}>
                <Clock size={20} color="#ffffff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginBottom: 4
                }}>
                  Scouting
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280'
                }}>
                  Market research and validation
                </Text>
              </View>
              <View style={{
                backgroundColor: '#f59e0b',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16
              }}>
                <Text style={{
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: '600'
                }}>
                  Pending
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Submit Application Button */}
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

export default ApplicationStatusScreen;
