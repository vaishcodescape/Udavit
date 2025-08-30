import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, ArrowLeft, BarChart3, Bell, CheckCircle, Clock, TrendingUp } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { RootStackParamList } from '../App';

// Types for API data
interface StartupData {
  name: string;
  founder: string;
  status: string;
  applications: number;
  totalFunding: string;
  milestones: number; 
  completedMilestones: number;
}

interface Application {
  id: string;
  title: string;
  status: 'Approved' | 'Under Review' | 'Pending' | 'Rejected';
  progress: number;
  submittedDate: string;
}

const StartupDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const staggerAnim = useRef(new Animated.Value(0)).current;
  
  // API data state - empty endpoints ready for integration
  const [startupData, setStartupData] = useState<StartupData>({
    name: '',
    founder: '',
    status: '',
    applications: 0,
    totalFunding: '',
    milestones: 0,
    completedMilestones: 0
  });
  
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // API endpoints - ready for integration
  const fetchStartupData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const response = await fetch('YOUR_API_ENDPOINT/startup-data');
      // const data = await response.json();
      // setStartupData(data);
      
      // Placeholder for API integration
      console.log('Fetching startup data...');
      
    } catch (err) {
      setError('Failed to fetch startup data');
      console.error('Error fetching startup data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchRecentApplications = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('YOUR_API_ENDPOINT/recent-applications');
      // const data = await response.json();
      // setRecentApplications(data);
      
      // Placeholder for API integration
      console.log('Fetching recent applications...');
      
    } catch (err) {
      console.error('Error fetching recent applications:', err);
    }
  };
  
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
    
    // Stagger animation for dashboard items
    Animated.timing(staggerAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
    
    // Fetch data when component mounts
    fetchStartupData();
    fetchRecentApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#10b981';
      case 'Under Review':
        return '#f59e0b';
      case 'Pending':
        return '#6b7280';
      case 'Rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle size={16} color="#10b981" />;
      case 'Under Review':
        return <Clock size={16} color="#f59e0b" />;
      case 'Pending':
        return <AlertCircle size={16} color="#6b7280" />;
      case 'Rejected':
        return <AlertCircle size={16} color="#ef4444" />;
      default:
        return <AlertCircle size={16} color="#6b7280" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#065f46' }}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#d1fae5', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: '#ef4444', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
          <Pressable 
            onPress={fetchStartupData}
            style={{
              backgroundColor: '#065f46',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8
            }}
          >
            <Text style={{ color: '#ffffff', fontSize: 16 }}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#d1fae5' }}>
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
            <ArrowLeft size={24} color="#065f46" />
          </Pressable>
          
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '600', 
            color: '#065f46'
          }}>
            {startupData.name ? `Startup: ${startupData.name}` : 'Startup Dashboard'}
          </Text>
          
          <Pressable 
            onPress={() => navigation.navigate('NotificationsCenter')}
            style={{ marginLeft: 'auto' }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#ffffff',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}>
              <Bell size={20} color="#065f46" />
            </View>
          </Pressable>
        </Animated.View>

        {/* Welcome Section */}
        <Animated.View 
          style={{ 
            paddingHorizontal: 20,
            marginBottom: 20,
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
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3
          }}>
            <Text style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#065f46',
              marginBottom: 8
            }}>
              {startupData.founder ? `Welcome ${startupData.founder}` : 'Welcome'}
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#6b7280',
              lineHeight: 24
            }}>
              {startupData.name 
                ? 'Your hydrogen innovation journey continues. Track your progress and manage your applications.'
                : 'Connect your startup data to get started with your hydrogen innovation journey.'
              }
            </Text>
          </View>
        </Animated.View>

        {/* Stats Overview */}
        <Animated.View 
          style={{ 
            paddingHorizontal: 20,
            marginBottom: 20,
            opacity: staggerAnim,
            transform: [{ translateY: staggerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}]
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            {/* Applications */}
            <View style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 16,
              marginRight: 8,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <BarChart3 size={24} color="#065f46" />
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#065f46',
                marginTop: 8
              }}>
                {startupData.applications || 0}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center'
              }}>
                Applications
              </Text>
            </View>

            {/* Funding */}
            <View style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 16,
              marginHorizontal: 4,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <TrendingUp size={24} color="#10b981" />
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#10b981',
                marginTop: 8
              }}>
                {startupData.totalFunding || 'ETH 0'}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center'
              }}>
                Total Funding Recieved
              </Text>
            </View>

            {/* Milestones */}
            <View style={{
              flex: 1,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 16,
              marginLeft: 8,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <CheckCircle size={24} color="#f59e0b" />
              <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#f59e0b',
                marginTop: 8
              }}>
                {startupData.completedMilestones || 0}/{startupData.milestones || 0}
              </Text>
              <Text style={{
                fontSize: 12,
                color: '#6b7280',
                textAlign: 'center'
              }}>
                Milestones
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Recent Applications */}
        <Animated.View 
          style={{ 
            flex: 1,
            paddingHorizontal: 20,
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
            color: '#065f46',
            marginBottom: 16
          }}>
            Recent Applications
          </Text>
          
          {recentApplications.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {recentApplications.map((application, index) => (
                <View key={application.id} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2
                }}>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#065f46',
                      flex: 1
                    }}>
                      {application.title}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center'
                    }}>
                      {getStatusIcon(application.status)}
                      <Text style={{
                        fontSize: 12,
                        color: getStatusColor(application.status),
                        marginLeft: 4,
                        fontWeight: '500'
                      }}>
                        {application.status}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: '#6b7280'
                    }}>
                      Submitted: {application.submittedDate}
                    </Text>
                    <Text style={{
                      fontSize: 12,
                      color: '#065f46',
                      fontWeight: '500'
                    }}>
                      {application.progress}% Complete
                    </Text>
                  </View>
                  
                  {/* Progress Bar */}
                  <View style={{
                    height: 4,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 2,
                    marginTop: 8,
                    overflow: 'hidden'
                  }}>
                    <View style={{
                      width: `${application.progress}%`,
                      height: '100%',
                      backgroundColor: getStatusColor(application.status),
                      borderRadius: 2
                    }} />
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 40,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2
            }}>
              <BarChart3 size={48} color="#d1d5db" />
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                marginTop: 16,
                textAlign: 'center'
              }}>
                No applications yet
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#9ca3af',
                marginTop: 8,
                textAlign: 'center'
              }}>
                Submit your first application to get started
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Action Button */}
        <View style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 20, 
          right: 20 
        }}>
          <Pressable 
            onPress={() => navigation.navigate('SubmitSubsidy')}
            style={{
              backgroundColor: '#065f46',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
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

export default StartupDashboardScreen;
