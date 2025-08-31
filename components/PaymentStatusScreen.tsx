import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowUpRight, Check, Clock, Copy, CreditCard, ExternalLink, Eye, EyeOff, RefreshCw, Wallet, X, Banknote, Plus } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { blockchainService, EthWallet, SmartContractInfo, WithdrawalHistory } from '../services/blockchainService';
import { paymentService, PaymentMethod, BankAccount, PaymentHistory } from '../services/paymentService';
import { Badge } from './nativewindui/Badge';
import { Button } from './nativewindui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './nativewindui/Card';
import { Input } from './nativewindui/Input';
import { Text } from './nativewindui/Text';

const PaymentStatusScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const staggerAnim = useRef(new Animated.Value(0)).current;
  
  // State management
  const [walletInfo, setWalletInfo] = useState<EthWallet | null>(null);
  const [contractInfo, setContractInfo] = useState<SmartContractInfo | null>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');
  
  // Fetch payment data
  const fetchPaymentData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [walletResponse, contractResponse, historyResponse, paymentMethodsResponse, bankAccountsResponse, paymentHistoryResponse] = await Promise.all([
        blockchainService.getWalletInfo(),
        blockchainService.getContractInfo(),
        blockchainService.getWithdrawalHistory(),
        paymentService.getPaymentMethods(),
        paymentService.getBankAccounts(),
        paymentService.getPaymentHistory()
      ]);
      
      if (walletResponse.success && walletResponse.data) {
        setWalletInfo(walletResponse.data);
      }
      
      if (contractResponse.success && contractResponse.data) {
        setContractInfo(contractResponse.data);
      }
      
      if (historyResponse.success && historyResponse.data) {
        setWithdrawalHistory(historyResponse.data);
      }

      if (paymentMethodsResponse.success && paymentMethodsResponse.data) {
        setPaymentMethods(paymentMethodsResponse.data);
      }

      if (bankAccountsResponse.success && bankAccountsResponse.data) {
        setBankAccounts(bankAccountsResponse.data);
      }

      if (paymentHistoryResponse.success && paymentHistoryResponse.data) {
        setPaymentHistory(paymentHistoryResponse.data);
      }
      
    } catch (err) {
      setError('Failed to load payment data');
      console.error('Error fetching payment data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPaymentData();
    setIsRefreshing(false);
  };
  
  // Copy wallet address to clipboard
  const copyWalletAddress = () => {
    if (walletInfo?.address) {
      // In a real app, you'd use Clipboard API
      Alert.alert('Copied!', 'Wallet address copied to clipboard');
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
    
    // Stagger animation for content
    Animated.timing(staggerAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
    
    // Fetch payment data
    fetchPaymentData();
  }, []);
  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 bg-emerald-50 justify-center items-center">
          <RefreshCw size={48} color="#10b981" className="animate-spin" />
          <Text className="text-lg text-emerald-800 mt-4">Loading Payment Interface...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-emerald-50">
        {/* Header */}
        <Animated.View 
          className="bg-emerald-800 px-5 py-6"
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="flex-row items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onPress={() => navigation.goBack()}
              className="bg-emerald-700"
            >
              <ArrowLeft size={24} color="#ffffff" />
            </Button>
            
            <Text className="text-xl font-bold text-white">
              💳 Payment Interface
          </Text>
            
            <Button
              variant="ghost"
              size="icon"
              onPress={handleRefresh}
              disabled={isRefreshing}
              className="bg-emerald-700"
            >
              <RefreshCw size={20} color="#ffffff" className={isRefreshing ? 'animate-spin' : ''} />
            </Button>
          </View>
        </Animated.View>

        {/* Tab Navigation */}
        <View className="bg-white border-b border-gray-200">
          <View className="flex-row px-5">
            {[
              { key: 'overview', label: '📊 Overview' },
              { key: 'history', label: '📋 History' },
              { key: 'settings', label: '⚙️ Settings' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant="ghost"
                size="sm"
                onPress={() => setActiveTab(tab.key as any)}
                className={`flex-1 ${activeTab === tab.key ? 'border-b-2 border-emerald-500' : ''}`}
              >
                <Text className={`text-sm font-medium ${
                  activeTab === tab.key ? 'text-emerald-600' : 'text-gray-600'
                }`}>
                  {tab.label}
                </Text>
              </Button>
            ))}
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <Animated.View 
              className="px-5 py-5"
              style={{ 
                opacity: staggerAnim,
                transform: [{ translateY: staggerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }}
            >
              {/* Wallet Balance Card */}
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 mb-5">
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Wallet size={24} color="#ffffff" />
                      <Text className="text-white text-lg font-bold ml-2">
                        Your Wallet
                      </Text>
                    </View>
                    <Badge variant="secondary" className="bg-white/20">
                      <Text className="text-white text-xs font-medium">
                        {walletInfo?.network?.toUpperCase() || 'SEPOLIA'}
                      </Text>
                    </Badge>
                  </View>
                </CardHeader>
                
                <CardContent>
                  <Text className="text-3xl font-bold text-white mb-2">
                    {walletInfo?.balance || '0.00'} ETH
                  </Text>
                  
                  <View className="flex-row items-center bg-white/10 rounded-lg px-3 py-2">
                    <Text className="flex-1 text-white text-sm font-mono">
                      {showWalletAddress 
                        ? walletInfo?.address || '0x...'
                        : `${walletInfo?.address?.substring(0, 6)}...${walletInfo?.address?.substring(-4)}`
                      }
                    </Text>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={() => setShowWalletAddress(!showWalletAddress)}
                      className="mr-2"
                    >
                      {showWalletAddress ? 
                        <EyeOff size={16} color="#ffffff" /> : 
                        <Eye size={16} color="#ffffff" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onPress={copyWalletAddress}
                    >
                      <Copy size={16} color="#ffffff" />
                    </Button>
                  </View>
                </CardContent>
              </Card>

              {/* Smart Contract Info */}
              {contractInfo && (
                <Card className="bg-white shadow-md border-0 mb-5">
                  <CardHeader>
                    <CardTitle>
                      <View className="flex-row items-center">
                        <CreditCard size={20} color="#065f46" />
                        <Text className="text-lg font-bold text-emerald-800 ml-2">
                          Smart Contract Status
                        </Text>
                      </View>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <View className="space-y-3">
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-gray-600">Contract Address:</Text>
                        <Text className="text-sm font-mono text-emerald-600">
                          {contractInfo.contractAddress.substring(0, 10)}...
                        </Text>
                      </View>
                      
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-gray-600">Total Allocated:</Text>
                        <Text className="text-sm font-semibold text-gray-900">
                          {contractInfo.totalAllocated} ETH
                        </Text>
                      </View>
                      
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-gray-600">Available Balance:</Text>
                        <Text className="text-sm font-semibold text-emerald-600">
                          {contractInfo.availableBalance} ETH
                        </Text>
                      </View>
                      
                      <View className="flex-row justify-between items-center">
                        <Text className="text-sm text-gray-600">Contract Version:</Text>
                        <Badge variant="outline">
                          <Text className="text-xs font-medium text-emerald-600">
                            v{contractInfo.contractVersion}
                          </Text>
                        </Badge>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-white shadow-md border-0 mb-5">
                <CardHeader>
                  <CardTitle>
                    <Text className="text-lg font-bold text-emerald-800">
                      ⚡ Quick Actions
                    </Text>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-3">
                    <Button
                      variant="tonal"
                      size="lg"
                      onPress={() => navigation.navigate('MilestoneTracking')}
                      className="bg-emerald-50 border-emerald-200 justify-start"
                    >
                      <ArrowUpRight size={20} color="#065f46" />
                      <Text className="text-emerald-800 font-semibold ml-2">
                        Withdraw Available Rewards
                      </Text>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="lg"
                      onPress={() => Alert.alert('Coming Soon', 'Gas fee estimation will be available soon')}
                      className="justify-start"
                    >
                      <Clock size={20} color="#6b7280" />
                      <Text className="text-gray-700 font-semibold ml-2">
                        Estimate Gas Fees
                      </Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <View className="px-5 py-5">
              <Text className="text-xl font-bold text-emerald-800 mb-4">
                📊 Transaction History
              </Text>
              
              {withdrawalHistory.length > 0 ? (
                withdrawalHistory.map((transaction) => (
                  <Card key={transaction.id} className="bg-white shadow-md border-0 mb-3">
                    <CardContent className="py-4">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <Text className="text-base font-semibold text-gray-900">
                            {transaction.milestoneTitle}
                          </Text>
                          <Text className="text-xs text-gray-500 mt-1">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </Text>
                          <Text className="text-xs text-gray-400 font-mono mt-1">
                            {transaction.transactionHash.substring(0, 20)}...
                          </Text>
                        </View>
                        
                        <View className="items-end">
                          <Text className={`text-lg font-bold ${
                            transaction.status === 'confirmed' ? 'text-emerald-500' : 
                            transaction.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                          }`}>
                            {transaction.amount} ETH
                          </Text>
                          
                          <Badge 
                            variant={
                              transaction.status === 'confirmed' ? 'success' :
                              transaction.status === 'pending' ? 'warning' : 'destructive'
                            }
                            size="sm"
                            className="mt-1"
                          >
                            <View className="flex-row items-center">
                              {transaction.status === 'confirmed' && <Check size={10} color="#ffffff" />}
                              {transaction.status === 'pending' && <Clock size={10} color="#ffffff" />}
                              {transaction.status === 'failed' && <X size={10} color="#ffffff" />}
                              <Text className="text-xs font-medium text-white ml-1">
                                {transaction.status.toUpperCase()}
                              </Text>
                            </View>
                          </Badge>
                          
                          {transaction.confirmations > 0 && (
                            <Text className="text-xs text-gray-500 mt-1">
                              {transaction.confirmations} confirmations
                            </Text>
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-white shadow-md border-0">
                  <CardContent className="items-center py-10">
                    <CreditCard size={48} color="#d1d5db" />
                    <Text className="text-base text-gray-500 mt-4 text-center">
                      No transactions yet
                    </Text>
                    <Text className="text-sm text-gray-400 mt-2 text-center">
                      Complete milestones to start earning ETH rewards
                    </Text>
                  </CardContent>
                </Card>
              )}
            </View>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <View className="px-5 py-5">
              <Text className="text-xl font-bold text-emerald-800 mb-4">
                ⚙️ Payment Settings
              </Text>
              
              <Card className="bg-white shadow-md border-0 mb-4">
                <CardHeader>
                  <CardTitle>
                    <Text className="text-lg font-semibold text-gray-900">
                      Wallet Configuration
                    </Text>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-4">
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Default Wallet Address
            </Text>
                      <Input
                        value={walletInfo?.address || ''}
                        placeholder="0x..."
                        editable={false}
                        className="bg-gray-50"
                      />
                    </View>
                    
                    <View>
                      <Text className="text-sm font-medium text-gray-700 mb-2">
                        Network
                      </Text>
                      <Badge variant="outline" className="self-start">
                        <Text className="text-sm font-medium text-emerald-600">
                          {walletInfo?.network?.toUpperCase() || 'SEPOLIA TESTNET'}
                        </Text>
                      </Badge>
                    </View>
            </View>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-md border-0">
                <CardHeader>
                  <CardTitle>
                    <Text className="text-lg font-semibold text-gray-900">
                      Security & Support
                    </Text>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-3">
                    <Button
                      variant="secondary"
                      size="md"
                      onPress={() => Alert.alert('Help', 'Contact support at support@udavit.com')}
                      className="justify-start"
                    >
                      <ExternalLink size={16} color="#6b7280" />
                      <Text className="text-gray-700 font-medium ml-2">
                        Contact Support
            </Text>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="md"
                      onPress={() => Alert.alert('Documentation', 'Visit our documentation for more details')}
                      className="justify-start"
                    >
                      <ExternalLink size={16} color="#6b7280" />
                      <Text className="text-gray-700 font-medium ml-2">
                        View Documentation
                      </Text>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PaymentStatusScreen;
