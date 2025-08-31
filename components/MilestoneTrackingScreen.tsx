import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { blockchainService, MilestoneReward, WithdrawalRequest } from '../services/blockchainService';
import { ApplicationMilestone, userService } from '../services/userService';
import { Button } from './nativewindui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './nativewindui/Card';
import { Input } from './nativewindui/Input';
import { Text } from './nativewindui/Text';

const MilestoneTrackingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // State for milestone data
  const [milestones, setMilestones] = useState<ApplicationMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<ApplicationMilestone | null>(null);
  
  // State for ETH withdrawal
  const [availableRewards, setAvailableRewards] = useState<MilestoneReward[]>([]);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<MilestoneReward | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Fetch milestones from API
  const fetchMilestones = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
      console.error('Error fetching available rewards:', err);
    }
  };

  // Update milestone progress
  const updateProgress = async (milestoneId: string, progress: number) => {
    try {
      const response = await userService.updateMilestoneProgress(milestoneId, progress);
      
      if (response.success && response.data) {
        // Update local state
        setMilestones(prev => prev.map(m => 
          m.id === milestoneId ? response.data! : m
        ));
        if (selectedMilestone?.id === milestoneId) {
          setSelectedMilestone(response.data);
        }
        
        Alert.alert('Success', 'Milestone progress updated successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to update milestone progress');
      }
    } catch (err) {
      console.error('Error updating milestone:', err);
      Alert.alert('Error', 'Failed to update milestone progress');
    }
  };

  // Complete milestone
  const completeMilestone = async (milestoneId: string) => {
    Alert.alert(
      'Complete Milestone',
      'Are you sure you want to mark this milestone as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              const response = await userService.submitMilestoneCompletion(milestoneId, {
                completionDate: new Date().toISOString(),
                notes: 'Milestone completed via mobile app'
              });
              
              if (response.success && response.data) {
                // Update local state
                setMilestones(prev => prev.map(m => 
                  m.id === milestoneId ? response.data! : m
                ));
                if (selectedMilestone?.id === milestoneId) {
                  setSelectedMilestone(response.data);
                }
                
                // Refresh available rewards after completion
                await fetchAvailableRewards();
                
                // Show withdrawal option if reward is available
                const reward = availableRewards.find(r => r.milestoneId === milestoneId && r.isEligible);
                if (reward) {
                  Alert.alert(
                    'Milestone Completed! 🎉',
                    `Congratulations! You've earned ${reward.rewardAmount} ETH for completing this milestone. Would you like to withdraw it now?`,
                    [
                      { text: 'Later', style: 'cancel' },
                      {
                        text: 'Withdraw ETH',
                        onPress: () => {
                          setSelectedReward(reward);
                          setShowWithdrawalModal(true);
                        }
                      }
                    ]
                  );
                } else {
                  Alert.alert('Success', 'Milestone completed successfully!');
                }
              } else {
                Alert.alert('Error', response.message || 'Failed to complete milestone');
              }
            } catch (err) {
              console.error('Error completing milestone:', err);
              Alert.alert('Error', 'Failed to complete milestone');
            }
          }
        }
      ]
    );
  };

  // Process ETH withdrawal
  const processWithdrawal = async () => {
    if (!selectedReward || !walletAddress.trim()) {
      Alert.alert('Error', 'Please enter a valid wallet address');
      return;
    }

    // Basic ETH address validation
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      Alert.alert('Error', 'Please enter a valid Ethereum address (0x...)');
      return;
    }

    try {
      setIsWithdrawing(true);
      
      const withdrawalRequest: WithdrawalRequest = {
        milestoneId: selectedReward.milestoneId,
        walletAddress: walletAddress.trim(),
        amount: selectedReward.rewardAmount
      };

      const response = await blockchainService.withdrawEth(withdrawalRequest);
      
      if (response.success && response.data) {
        Alert.alert(
          'Withdrawal Initiated! 🚀',
          `Your withdrawal of ${selectedReward.rewardAmount} ETH has been initiated. Transaction hash: ${response.data.transactionHash?.substring(0, 10)}...`,
          [{ text: 'OK', onPress: () => {
            setShowWithdrawalModal(false);
            setSelectedReward(null);
            setWalletAddress('');
            fetchAvailableRewards(); // Refresh rewards
          }}]
        );
      } else {
        Alert.alert('Withdrawal Failed', response.message || 'Unable to process withdrawal');
      }
    } catch (err) {
      console.error('Error processing withdrawal:', err);
      Alert.alert('Error', 'Failed to process withdrawal');
    } finally {
      setIsWithdrawing(false);
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
    
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    
    // Fetch milestone data and available rewards
    fetchMilestones();
    fetchAvailableRewards();
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

        {/* Available Rewards Section */}
        {availableRewards.filter(r => r.isEligible && !r.isWithdrawn).length > 0 && (
          <View className="absolute bottom-28 left-5 right-5">
            <Card className="bg-white shadow-lg border-2 border-emerald-500">
              <CardHeader>
                <CardTitle>
                  <Text className="text-base font-semibold text-emerald-800">
                    🎉 ETH Rewards Available
                  </Text>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableRewards.filter(r => r.isEligible && !r.isWithdrawn).map((reward) => (
                  <Button
                    key={reward.milestoneId}
                    variant="tonal"
                    size="md"
                    onPress={() => {
                      setSelectedReward(reward);
                      setShowWithdrawalModal(true);
                    }}
                    className="bg-emerald-50 border-emerald-200 mb-2 justify-start"
                  >
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-emerald-800">
                        {reward.milestoneTitle}
                      </Text>
                      <Text className="text-base font-bold text-emerald-500 mt-1">
                        {reward.rewardAmount} ETH
                      </Text>
                    </View>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </View>
        )}

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

        {/* ETH Withdrawal Modal */}
        {showWithdrawalModal && selectedReward && (
          <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 justify-center items-center z-50">
            <Card className="bg-white mx-5 w-full max-w-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle>
                  <Text className="text-xl font-bold text-emerald-800 text-center">
                    Withdraw ETH Reward 🎉
                  </Text>
                </CardTitle>
                <CardDescription>
                  <Text className="text-sm text-gray-600 text-center">
                    {selectedReward.milestoneTitle}
                  </Text>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Card className="bg-emerald-50 border-emerald-200 mb-5">
                  <CardContent className="items-center py-4">
                    <Text className="text-3xl font-bold text-emerald-500">
                      {selectedReward.rewardAmount} ETH
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Available for withdrawal
                    </Text>
                  </CardContent>
                </Card>

                <Input
                  label="Wallet Address"
                  placeholder="0x..."
                  value={walletAddress}
                  onChangeText={setWalletAddress}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="mb-5"
                />
              </CardContent>

              <CardFooter>
                <View className="flex-row space-x-3 w-full">
                  <Button
                    variant="secondary"
                    size="md"
                    onPress={() => {
                      setShowWithdrawalModal(false);
                      setSelectedReward(null);
                      setWalletAddress('');
                    }}
                    className="flex-1"
                  >
                    <Text className="text-gray-600 font-semibold">
                      Cancel
                    </Text>
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onPress={processWithdrawal}
                    disabled={isWithdrawing}
                    className={`flex-1 ${isWithdrawing ? 'bg-gray-400' : 'bg-emerald-500'}`}
                  >
                    <Text className="text-white font-semibold">
                      {isWithdrawing ? 'Processing...' : 'Withdraw'}
                    </Text>
                  </Button>
                </View>
              </CardFooter>
            </Card>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MilestoneTrackingScreen;
