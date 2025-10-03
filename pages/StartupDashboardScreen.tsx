import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowUpRight, BarChart3, Bell, DollarSign, Sparkles, Target } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/ui/card';
import { Text as UIText } from '../src/components/ui/text';

// Types for API data
interface StartupData {
  name: string;
  founder: string;
  status: string;
  applications: number;
  totalFunding: string;
  milestones: number; 
  completedMilestones: number;
  nextMilestone: string;
  recentActivity: string[];
}

interface Application {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  amount: string;
  submittedDate: string;
  reviewDate?: string;
}

const StartupDashboardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isVisible, setIsVisible] = useState(false);
  
  // State for dashboard data
  const [startupData, setStartupData] = useState<StartupData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  const mockStartupData: StartupData = {
    name: "GreenTech Innovations",
    founder: "Dr. Sarah Chen",
    status: "Active",
    applications: 3,
    totalFunding: "ETH 2.5",
    milestones: 5,
    completedMilestones: 3,
    nextMilestone: "Q2 2024 - Pilot Plant Launch",
    recentActivity: [
      "Application #001 approved for $50,000",
      "Milestone 2 completed successfully",
      "New team member joined: John Smith"
    ]
  };

  const mockApplications: Application[] = [
    {
      id: "1",
      title: "Hydrogen Production Facility",
      status: "approved",
      amount: "$50,000",
      submittedDate: "2024-01-15",
      reviewDate: "2024-01-20"
    },
    {
      id: "2", 
      title: "Fuel Cell Research",
      status: "under_review",
      amount: "$75,000",
      submittedDate: "2024-02-01"
    },
    {
      id: "3",
      title: "Green Energy Storage",
      status: "pending",
      amount: "$100,000",
      submittedDate: "2024-02-15"
    }
  ];

  useEffect(() => {
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Load dashboard data
    loadDashboardData();
    
    return () => clearTimeout(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStartupData(mockStartupData);
      setApplications(mockApplications);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-green-50 justify-center items-center">
          <UIText className="text-lg text-green-800">Loading dashboard...</UIText>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-green-50 justify-center items-center p-5">
          <UIText className="text-lg text-red-600 text-center mb-5">{error}</UIText>
          <Button onPress={loadDashboardData} className="bg-green-600">
            <UIText className="text-white font-semibold">Retry</UIText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-50">
        {/* Header */}
        <View className={`flex-row items-center px-5 pt-5 pb-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <Pressable
            onPress={() => navigation.goBack()}
            className="mr-5"
          >
            <ArrowLeft size={24} className="text-teal-700" />
          </Pressable>

          <View className="flex-1">
            <UIText variant="h3" className="text-primary font-bold">
              {startupData?.name || 'Startup Dashboard'}
            </UIText>
            <UIText className="text-muted-foreground text-sm">
              Hydrogen Innovation Platform
            </UIText>
          </View>

          <Pressable
            onPress={() => navigation.navigate('NotificationsCenter')}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg"
          >
            <Bell size={20} className="text-teal-700" />
          </Pressable>
        </View>

        {/* Welcome Section */}
        <View className={`px-5 mb-5 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary flex-row items-center">
                <Sparkles size={24} className="text-teal-700 mr-2" />
                {startupData?.founder ? `Welcome ${startupData.founder}` : 'Welcome'}
              </CardTitle>
              <CardDescription className="text-base">
                {startupData?.name
                  ? 'Your hydrogen innovation journey continues. Track your progress and manage your applications.'
                  : 'Connect your startup data to get started with your hydrogen innovation journey.'
                }
              </CardDescription>
            </CardHeader>
          </Card>
        </View>

        {/* Stats Overview */}
        <View className={`px-5 mb-5 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <View className="flex-row space-x-3">
            {/* Applications */}
            <Card className="flex-1 bg-white border-0 shadow-md">
              <CardContent className="p-4 items-center">
                <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-2">
                  <BarChart3 size={24} className="text-teal-700" />
                </View>
                <UIText variant="h2" className="text-primary font-bold">
                  {startupData?.applications || 0}
                </UIText>
                <UIText className="text-muted-foreground text-xs text-center">
                  Applications
                </UIText>
              </CardContent>
            </Card>

            {/* Funding */}
            <Card className="flex-1 bg-white border-0 shadow-md">
              <CardContent className="p-4 items-center">
                <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                  <DollarSign size={24} className="text-green-600" />
                </View>
                <UIText variant="h4" className="text-green-600 font-bold">
                  {startupData?.totalFunding || 'ETH 0'}
                </UIText>
                <UIText className="text-muted-foreground text-xs text-center">
                  Total Funding
                </UIText>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="flex-1 bg-white border-0 shadow-md">
              <CardContent className="p-4 items-center">
                <View className="w-12 h-12 bg-amber-100 rounded-full items-center justify-center mb-2">
                  <Target size={24} className="text-amber-600" />
                </View>
                <UIText variant="h4" className="text-amber-600 font-bold">
                  {startupData?.completedMilestones || 0}/{startupData?.milestones || 0}
                </UIText>
                <UIText className="text-muted-foreground text-xs text-center">
                  Milestones
                </UIText>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Recent Applications */}
        <View className={`px-5 mb-5 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-primary">Recent Applications</CardTitle>
              <CardDescription>Track your latest funding applications</CardDescription>
            </CardHeader>
            <CardContent>
              <View className="space-y-3">
                {applications.map((application) => (
                  <Card key={application.id} className="bg-gray-50 border-0">
                    <CardContent className="p-4">
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                          <UIText className="font-semibold text-gray-900 mb-1">
                            {application.title}
                          </UIText>
                          <UIText className="text-sm text-gray-600">
                            {application.amount} • {application.submittedDate}
                          </UIText>
                        </View>
                        <Badge className={getStatusColor(application.status)}>
                          <UIText className="text-xs font-semibold capitalize">
                            {application.status.replace('_', ' ')}
                          </UIText>
                        </Badge>
                      </View>
                      {application.reviewDate && (
                        <UIText className="text-xs text-gray-500">
                          Review Date: {application.reviewDate}
                        </UIText>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>

        {/* Action Button */}
        <View className="absolute bottom-10 left-5 right-5">
          <Button
            onPress={() => navigation.navigate('SubmitSubsidy')}
            className="h-14 rounded-xl shadow-lg"
            size="lg"
          >
            <UIText className="text-white font-bold text-lg">Submit Application</UIText>
            <ArrowUpRight size={20} className="text-white" />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StartupDashboardScreen;