import { CheckCircle, Clock } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, SafeAreaView, ScrollView, View } from 'react-native';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Card, CardContent } from '../src/components/ui/card';
import { Progress } from '../src/components/ui/progress';
import { Text as UIText } from '../src/components/ui/text';

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
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-50">
        {/* Header */}
        <Animated.View
          className="items-center pt-10 pb-10"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <UIText className="text-2xl font-bold text-primary">
            Application Status
          </UIText>
        </Animated.View>

        {/* Status Sections */}
        <ScrollView className="px-5">
          {/* First Review Section */}
          <Card className="mb-5 bg-white border-0 shadow-lg">
            <CardContent className="p-5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mr-4">
                  <CheckCircle size={20} className="text-white" />
                </View>
                <View className="flex-1">
                  <UIText className="text-lg font-semibold text-primary mb-1">
                    Review
                  </UIText>
                  <UIText className="text-sm text-muted-foreground">
                    Initial application review completed
                  </UIText>
                </View>
              </View>

              {/* Progress Lines */}
              <View className="ml-14">
                <View className="h-0.5 bg-gray-200 mb-2" />
                <View className="h-0.5 bg-gray-200 mb-2" />
                <View className="h-0.5 bg-gray-200" />
              </View>
            </CardContent>
          </Card>

          {/* Second Review Section */}
          <Card className="mb-5 bg-white border-0 shadow-lg">
            <CardContent className="p-5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-green-600 rounded-full items-center justify-center mr-4">
                  <CheckCircle size={20} className="text-white" />
                </View>
                <View className="flex-1">
                  <UIText className="text-lg font-semibold text-primary mb-1">
                    Review
                  </UIText>
                  <UIText className="text-sm text-muted-foreground">
                    Technical assessment in progress
                  </UIText>
                </View>
                <Badge className="bg-green-600">
                  <UIText className="text-white text-sm font-semibold">
                    80%
                  </UIText>
                </Badge>
              </View>

              {/* Progress Bar */}
              <View className="ml-14">
                <Progress value={80} className="h-2" />
              </View>
            </CardContent>
          </Card>

          {/* Scouting Section */}
          <Card className="mb-5 bg-white border-0 shadow-lg">
            <CardContent className="p-5">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-amber-500 rounded-full items-center justify-center mr-4">
                  <Clock size={20} className="text-white" />
                </View>
                <View className="flex-1">
                  <UIText className="text-lg font-semibold text-primary mb-1">
                    Scouting
                  </UIText>
                  <UIText className="text-sm text-muted-foreground">
                    Market research and validation
                  </UIText>
                </View>
                <Badge className="bg-amber-500">
                  <UIText className="text-white text-sm font-semibold">
                    Pending
                  </UIText>
                </Badge>
              </View>
            </CardContent>
          </Card>
        </ScrollView>

        {/* Submit Application Button */}
        <View className="absolute bottom-10 left-5 right-5">
          <Button
            className="h-14 rounded-xl shadow-lg bg-primary"
            size="lg"
          >
            <UIText className="text-white font-bold text-lg">
              Submit Application
            </UIText>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ApplicationStatusScreen;
