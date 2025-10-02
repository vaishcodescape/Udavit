import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { blockchainService, MilestoneReward } from '../services/blockchainService';
import { ApplicationMilestone, userService } from '../services/userService';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/ui/card';
import { Input } from '../src/components/ui/input';
import { Text as UIText } from '../src/components/ui/text';

const MilestoneTrackingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animation state
  const [isVisible, setIsVisible] = useState(false);
  
  // State for milestone data
  const [milestones, setMilestones] = useState<ApplicationMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<ApplicationMilestone | null>(null);
  
  // State for ETH withdrawal
  const [availableRewards, setAvailableRewards] = useState<MilestoneReward[]>([]);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalAddress, setWithdrawalAddress] = useState('');

  // Fetch milestone data
  const fetchMilestones = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAllUserMilestones();
      
      if (response.success && response.data) {
        setMilestones(response.data);
        if (response.data.length > 0) {
          setSelectedMilestone(response.data[0]); // Select first milestone by default
        }
      } else {
        setError(response.message || 'Failed to fetch milestones');
      }
      
    } catch (err) {
      setError('Failed to fetch milestones');
      console.error('Error fetching milestones:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch available ETH rewards
  const fetchAvailableRewards = async () => {
    try {
      const response = await blockchainService.getMilestoneRewards();
      
      if (response.success && response.data) {
        setAvailableRewards(response.data);
      } else {
        console.error('Error fetching rewards:', response.message);
      }
      
    } catch (err) {
      console.error('Error fetching rewards:', err);
    }
  };

  // Handle milestone selection
  const handleMilestoneSelect = (milestone: ApplicationMilestone) => {
    setSelectedMilestone(milestone);
  };

  // Handle ETH withdrawal
  const handleWithdraw = async () => {
    if (!withdrawalAmount || !withdrawalAddress) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsWithdrawing(true);
      
      const response = await blockchainService.withdrawEth({
        milestoneId: selectedMilestone?.id || 'default',
        amount: withdrawalAmount,
        walletAddress: withdrawalAddress
      });
      
      if (response.success) {
        Alert.alert('Success', 'Withdrawal request submitted successfully');
        setWithdrawalAmount('');
        setWithdrawalAddress('');
        // Refresh rewards
        fetchAvailableRewards();
      } else {
        Alert.alert('Error', response.message || 'Withdrawal failed');
      }
      
    } catch (err) {
      Alert.alert('Error', 'Withdrawal failed');
      console.error('Withdrawal error:', err);
    } finally {
      setIsWithdrawing(false);
    }
  };
  
  useEffect(() => {
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Fetch milestone data and available rewards
    fetchMilestones();
    fetchAvailableRewards();
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-green-100 justify-center items-center">
          <UIText className="text-lg text-green-800">Loading milestones...</UIText>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-green-100 justify-center items-center px-5">
          <UIText className="text-lg text-red-600 text-center mb-4">{error}</UIText>
          <Button onPress={fetchMilestones} className="bg-green-600">
            <UIText className="text-white font-semibold">Retry</UIText>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-100">
        {/* Header */}
        <View className={`items-center pt-10 pb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <UIText className="text-2xl font-bold text-green-800">
            Milestone Tracking
          </UIText>
        </View>

        {/* Main Content */}
        <ScrollView className="px-5">
          {/* Milestone Selection */}
          {milestones.length > 0 && (
            <Card className="bg-white rounded-xl p-5 mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 font-semibold">
                  Select Milestone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                  {milestones.map((milestone, index) => (
                    <Pressable
                      key={milestone.id}
                      onPress={() => handleMilestoneSelect(milestone)}
                      className={`mr-3 p-3 rounded-lg border-2 ${
                        selectedMilestone?.id === milestone.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <UIText className={`font-semibold ${
                        selectedMilestone?.id === milestone.id
                          ? 'text-green-800'
                          : 'text-gray-700'
                      }`}>
                        {milestone.title}
                      </UIText>
                      <UIText className="text-sm text-gray-500 mt-1">
                        {milestone.progress}% Complete
                      </UIText>
                    </Pressable>
                  ))}
                </ScrollView>
              </CardContent>
            </Card>
          )}

          {/* Selected Milestone Details */}
          {selectedMilestone && (
            <Card className="bg-white rounded-xl p-5 mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 font-semibold">
                  {selectedMilestone.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {selectedMilestone.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress Bar */}
                <View className="mb-4">
                  <View className="h-2 bg-gray-200 rounded overflow-hidden">
                    <View 
                      className="h-full bg-green-500 rounded transition-all duration-1000"
                      style={{ width: `${selectedMilestone.progress}%` }}
                    />
                  </View>
                  <UIText className="text-sm text-green-600 font-semibold mt-2 text-center">
                    {selectedMilestone.progress}% Complete
                  </UIText>
                </View>

                {/* Milestone Details */}
                <View className="space-y-3">
                  <View className="flex-row justify-between">
                    <UIText className="text-gray-600">Status:</UIText>
                    <Badge variant={selectedMilestone.status === 'completed' ? 'default' : 'secondary'}>
                      <UIText className="text-white font-semibold">
                        {selectedMilestone.status}
                      </UIText>
                    </Badge>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <UIText className="text-gray-600">Due Date:</UIText>
                    <UIText className="text-gray-800 font-medium">
                      {new Date(selectedMilestone.dueDate).toLocaleDateString()}
                    </UIText>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <UIText className="text-gray-600">Progress:</UIText>
                    <UIText className="text-green-600 font-semibold">
                      {selectedMilestone.progress}%
                    </UIText>
                  </View>
                </View>
              </CardContent>
            </Card>
          )}

          {/* Available Rewards */}
          {availableRewards.length > 0 && (
            <Card className="bg-white rounded-xl p-5 mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 font-semibold">
                  Available Rewards
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Total: {availableRewards.reduce((sum, reward) => sum + parseFloat(reward.rewardAmount), 0).toFixed(4)} ETH
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View className="space-y-3">
                  {availableRewards.map((reward, index) => (
                    <View key={index} className="flex-row justify-between items-center p-3 bg-green-50 rounded-lg">
                      <View>
                        <UIText className="font-semibold text-green-800">
                          {reward.milestoneTitle}
                        </UIText>
                        <UIText className="text-sm text-gray-600">
                          Milestone ID: {reward.milestoneId}
                        </UIText>
                      </View>
                      <UIText className="text-green-600 font-bold">
                        {reward.rewardAmount} ETH
                      </UIText>
                    </View>
                  ))}
                </View>
              </CardContent>
            </Card>
          )}

          {/* Withdrawal Form */}
          {availableRewards.length > 0 && (
            <Card className="bg-white rounded-xl p-5 mb-6 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 font-semibold">
                  Withdraw Rewards
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the amount and wallet address to withdraw your rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View className="space-y-4">
                  <View>
                    <UIText className="text-sm font-medium text-gray-700 mb-2">
                      Amount (ETH)
                    </UIText>
                    <Input
                      placeholder="0.0"
                      value={withdrawalAmount}
                      onChangeText={setWithdrawalAmount}
                      keyboardType="numeric"
                      className="h-12"
                    />
                  </View>
                  
                  <View>
                    <UIText className="text-sm font-medium text-gray-700 mb-2">
                      Wallet Address
                    </UIText>
                    <Input
                      placeholder="0x..."
                      value={withdrawalAddress}
                      onChangeText={setWithdrawalAddress}
                      className="h-12"
                    />
                  </View>
                  
                  <Button
                    onPress={handleWithdraw}
                    disabled={isWithdrawing || !withdrawalAmount || !withdrawalAddress}
                    className="h-12"
                  >
                    {isWithdrawing ? (
                      <UIText className="text-white font-semibold">Processing...</UIText>
                    ) : (
                      <UIText className="text-white font-semibold">Withdraw</UIText>
                    )}
                  </Button>
                </View>
              </CardContent>
            </Card>
          )}

          {/* No Data State */}
          {milestones.length === 0 && (
            <Card className="bg-white rounded-xl p-8 mb-6 shadow-lg">
              <CardContent className="items-center">
                <UIText className="text-lg text-gray-600 text-center mb-4">
                  No milestones found
                </UIText>
                <UIText className="text-sm text-gray-500 text-center">
                  Your milestones will appear here once you start working on projects
                </UIText>
              </CardContent>
            </Card>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MilestoneTrackingScreen;