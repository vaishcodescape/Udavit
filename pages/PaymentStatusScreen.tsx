import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, ArrowUpRight, Banknote, Check, Clock, Copy, CreditCard, ExternalLink, Eye, EyeOff, Plus, RefreshCw, Wallet, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { blockchainService, EthWallet, SmartContractInfo, WithdrawalHistory } from '../services/blockchainService';
import { BankAccount, PaymentHistory, PaymentMethod, paymentService } from '../services/paymentService';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Input } from '../src/components/ui/input';
import { Text as UIText } from '../src/components/ui/text';

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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
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
        <View className="flex-1 bg-slate-900 justify-center items-center">
          <RefreshCw size={48} className="animate-spin text-teal-500" />
          <UIText className="text-lg text-slate-300 mt-4">Loading Payment Interface...</UIText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-slate-900">
        {/* Header */}
        <Animated.View 
          className="bg-slate-800 px-6 py-6 border-b border-slate-700"
          style={{ 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <View className="flex-row items-center justify-between">
            <Button
              variant="secondary"
              size="icon"
              onPress={() => navigation.goBack()}
              className="bg-slate-700 hover:bg-slate-600"
            >
              <ArrowLeft size={24} className="text-white" />
            </Button>
            
            <UIText className="text-xl font-bold text-white">
              Payment Interface
            </UIText>
            
            <Button
              variant="secondary"
              size="icon"
              onPress={handleRefresh}
              disabled={isRefreshing}
              className="bg-slate-700 hover:bg-slate-600"
            >
              <RefreshCw size={20} className={`text-white ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </View>
        </Animated.View>

        {/* Tab Navigation */}
        <View className="bg-slate-800 border-b border-slate-700">
          <View className="flex-row px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'history', label: 'History' },
              { key: 'settings', label: 'Settings' }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant="secondary"
                size="sm"
                onPress={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-3 ${activeTab === tab.key ? 'border-b-2 border-teal-400' : ''}`}
              >
                <UIText className={`text-sm font-medium ${
                  activeTab === tab.key ? 'text-teal-400' : 'text-slate-400'
                }`}>
                  {tab.label}
                </UIText>
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
              className="px-6 py-6"
              style={{ 
                opacity: staggerAnim,
                transform: [{ translateY: staggerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }}
            >
              {/* Wallet Balance Card */}
              <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 mb-6">
                <CardHeader>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Wallet size={24} className="text-teal-500" />
                      <UIText className="text-white text-lg font-bold ml-3">
                        Your Wallet
                      </UIText>
                    </View>
                    <Badge variant="secondary" className="bg-teal-500/20 border-teal-500/30">
                      <UIText className="text-teal-400 text-xs font-medium">
                        {walletInfo?.network?.toUpperCase() || 'SEPOLIA'}
                      </UIText>
                    </Badge>
                  </View>
                </CardHeader>
                
                <CardContent>
                  <UIText className="text-4xl font-bold text-white mb-4">
                    {walletInfo?.balance || '0.00'} ETH
                  </UIText>
                  
                  <View className="flex-row items-center bg-slate-700/50 rounded-lg px-4 py-3 border border-slate-600">
                    <UIText className="flex-1 text-slate-300 text-sm font-mono">
                      {showWalletAddress
                        ? walletInfo?.address || '0x...'
                        : `${walletInfo?.address?.substring(0, 6)}...${walletInfo?.address?.substring(-4)}`
                      }
                    </UIText>
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={() => setShowWalletAddress(!showWalletAddress)}
                      className="mr-2 bg-slate-600 hover:bg-slate-500"
                    >
                      {showWalletAddress ? 
                        <EyeOff size={16} className="text-slate-400" /> :
                        <Eye size={16} className="text-slate-400" />
                      }
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={copyWalletAddress}
                      className="bg-slate-600 hover:bg-slate-500"
                    >
                      <Copy size={16} className="text-slate-400" />
                    </Button>
                  </View>
                </CardContent>
              </Card>

              {/* Smart Contract Info */}
              {contractInfo && (
                <Card className="bg-slate-800 border-slate-600 mb-6">
                  <CardHeader>
                    <CardTitle>
                      <View className="flex-row items-center">
                        <CreditCard size={20} className="text-teal-500" />
                        <UIText className="text-lg font-bold text-white ml-3">
                          Smart Contract Status
                        </UIText>
                      </View>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <View className="space-y-4">
                      <View className="flex-row justify-between items-center">
                        <UIText className="text-sm text-slate-400">Contract Address:</UIText>
                        <UIText className="text-sm font-mono text-teal-400">
                          {contractInfo.contractAddress.substring(0, 10)}...
                        </UIText>
                      </View>
                      
                      <View className="flex-row justify-between items-center">
                        <UIText className="text-sm text-slate-400">Total Allocated:</UIText>
                        <UIText className="text-sm font-semibold text-white">
                          {contractInfo.totalAllocated} ETH
                        </UIText>
                      </View>
                      
                      <View className="flex-row justify-between items-center">
                        <UIText className="text-sm text-slate-400">Available Balance:</UIText>
                        <UIText className="text-sm font-semibold text-teal-400">
                          {contractInfo.availableBalance} ETH
                        </UIText>
                      </View>
                      
                      <View className="flex-row justify-between items-center">
                        <UIText className="text-sm text-slate-400">Contract Version:</UIText>
                        <Badge variant="outline" className="border-teal-500/30">
                          <UIText className="text-xs font-medium text-teal-400">
                            v{contractInfo.contractVersion}
                          </UIText>
                        </Badge>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              )}

              {/* Payment Methods */}
              <Card className="bg-slate-800 border-slate-600 mb-6">
                <CardHeader>
                  <CardTitle>
                    <View className="flex-row items-center">
                      <CreditCard size={20} className="text-teal-500" />
                      <UIText className="text-lg font-bold text-white ml-3">
                        Payment Methods
                      </UIText>
                    </View>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-3">
                    {paymentMethods.map((method) => (
                      <View key={method.id} className="flex-row items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <View className="flex-row items-center">
                          <UIText className="text-2xl mr-3">{method.icon}</UIText>
                          <View>
                            <UIText className="text-sm font-semibold text-white">{method.name}</UIText>
                            <UIText className="text-xs text-slate-400">{method.type.replace('_', ' ')}</UIText>
                          </View>
                        </View>
                        <Badge variant={method.isEnabled ? "default" : "secondary"} className={method.isEnabled ? "bg-green-500/20 border-green-500/30" : "bg-slate-500/20 border-slate-500/30"}>
                          <UIText className={`text-xs font-medium ${method.isEnabled ? 'text-green-400' : 'text-slate-400'}`}>
                            {method.isEnabled ? 'Active' : 'Inactive'}
                          </UIText>
                        </Badge>
                      </View>
                    ))}
                  </View>
                </CardContent>
              </Card>

              {/* Bank Accounts */}
              <Card className="bg-slate-800 border-slate-600 mb-6">
                <CardHeader>
                  <CardTitle>
                    <View className="flex-row items-center">
                      <Banknote size={20} className="text-teal-500" />
                      <UIText className="text-lg font-bold text-white ml-3">
                        Bank Accounts
                      </UIText>
                    </View>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-3">
                    {bankAccounts.map((account) => (
                      <View key={account.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <View className="flex-row items-center justify-between mb-2">
                          <UIText className="text-sm font-semibold text-white">{account.bankName}</UIText>
                          {account.isDefault && (
                            <Badge variant="default" className="bg-teal-500/20 border-teal-500/30">
                              <UIText className="text-xs font-medium text-teal-400">Default</UIText>
                            </Badge>
                          )}
                        </View>
                        <UIText className="text-xs text-slate-400 mb-1">
                          {account.accountHolderName}
                        </UIText>
                        <UIText className="text-xs font-mono text-slate-300">
                          {account.accountNumber} • {account.ifscCode}
                        </UIText>
                      </View>
                    ))}
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={() => Alert.alert('Coming Soon', 'Add bank account functionality will be available soon')}
                      className="mt-3 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
                    >
                      <Plus size={16} className="text-teal-500" />
                      <UIText className="text-teal-400 font-medium ml-2">
                        Add Bank Account
                      </UIText>
                    </Button>
                  </View>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-slate-800 border-slate-600 mb-6">
                <CardHeader>
                  <CardTitle>
                    <UIText className="text-lg font-bold text-white">
                      Quick Actions
                    </UIText>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-3">
                    <Button
                      variant="secondary"
                      size="lg"
                      onPress={() => navigation.navigate('MilestoneTracking')}
                      className="bg-teal-500/10 border-teal-500/30 hover:bg-teal-500/20 justify-start"
                    >
                      <ArrowUpRight size={20} className="text-teal-500" />
                      <UIText className="text-teal-400 font-semibold ml-3">
                        Withdraw Available Rewards
                      </UIText>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="lg"
                      onPress={() => Alert.alert('Coming Soon', 'Gas fee estimation will be available soon')}
                      className="justify-start bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
                    >
                      <Clock size={20} className="text-slate-400" />
                      <UIText className="text-slate-300 font-semibold ml-3">
                        Estimate Gas Fees
                      </UIText>
                    </Button>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <View className="px-6 py-6">
              {/* Blockchain Withdrawals */}
              <UIText className="text-xl font-bold text-white mb-4">
                Blockchain Transactions
              </UIText>
              
              {withdrawalHistory.length > 0 ? (
                withdrawalHistory.map((transaction) => (
                  <Card key={transaction.id} className="bg-slate-800 border-slate-600 mb-3">
                    <CardContent className="py-4">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <UIText className="text-base font-semibold text-white">
                            {transaction.milestoneTitle}
                          </UIText>
                          <UIText className="text-xs text-slate-400 mt-1">
                            {new Date(transaction.timestamp).toLocaleString()}
                          </UIText>
                          <UIText className="text-xs text-slate-500 font-mono mt-1">
                            {transaction.transactionHash.substring(0, 20)}...
                          </UIText>
                        </View>
                        
                        <View className="items-end">
                          <UIText className={`text-lg font-bold ${
                            transaction.status === 'confirmed' ? 'text-green-400' : 
                            transaction.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {transaction.amount} ETH
                          </UIText>
                          
                          <Badge 
                            variant={
                              transaction.status === 'confirmed' ? 'default' :
                              transaction.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className={`mt-1 ${
                              transaction.status === 'confirmed' ? 'bg-green-500/20 border-green-500/30' :
                              transaction.status === 'pending' ? 'bg-amber-500/20 border-amber-500/30' :
                              'bg-red-500/20 border-red-500/30'
                            }`}
                          >
                            <View className="flex-row items-center">
                              {transaction.status === 'confirmed' && <Check size={10} className="text-white" />}
                              {transaction.status === 'pending' && <Clock size={10} className="text-white" />}
                              {transaction.status === 'failed' && <X size={10} className="text-white" />}
                              <UIText className="text-xs font-medium text-white ml-1">
                                {transaction.status.toUpperCase()}
                              </UIText>
                            </View>
                          </Badge>
                          
                          {transaction.confirmations > 0 && (
                            <UIText className="text-xs text-slate-400 mt-1">
                              {transaction.confirmations} confirmations
                            </UIText>
                          )}
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-600 mb-5">
                  <CardContent className="items-center py-10">
                    <CreditCard size={48} className="text-slate-500" />
                    <UIText className="text-base text-slate-400 mt-4 text-center">
                      No blockchain transactions yet
                    </UIText>
                    <UIText className="text-sm text-slate-500 mt-2 text-center">
                      Complete milestones to start earning ETH rewards
                    </UIText>
                  </CardContent>
                </Card>
              )}

              {/* Payment History */}
              <UIText className="text-xl font-bold text-white mb-4 mt-6">
                Payment History
              </UIText>
              
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <Card key={payment.id} className="bg-slate-800 border-slate-600 mb-3">
                    <CardContent className="py-4">
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                          <UIText className="text-base font-semibold text-white">
                            {payment.description}
                          </UIText>
                          <UIText className="text-xs text-slate-400 mt-1">
                            {new Date(payment.timestamp).toLocaleString()}
                          </UIText>
                          <UIText className="text-xs text-slate-300 mt-1">
                            {payment.paymentMethod}
                          </UIText>
                          {payment.bankReference && (
                            <UIText className="text-xs text-slate-500 font-mono mt-1">
                              Ref: {payment.bankReference}
                            </UIText>
                          )}
                          {payment.transactionHash && (
                            <UIText className="text-xs text-slate-500 font-mono mt-1">
                              TX: {payment.transactionHash.substring(0, 20)}...
                            </UIText>
                          )}
                        </View>
                        
                        <View className="items-end">
                          <UIText className={`text-lg font-bold ${
                            payment.status === 'completed' ? 'text-green-400' : 
                            payment.status === 'pending' ? 'text-amber-400' : 'text-red-400'
                          }`}>
                            {payment.amount} {payment.currency}
                          </UIText>
                          
                          <Badge 
                            variant={
                              payment.status === 'completed' ? 'default' :
                              payment.status === 'pending' ? 'secondary' : 'destructive'
                            }
                            className={`mt-1 ${
                              payment.status === 'completed' ? 'bg-green-500/20 border-green-500/30' :
                              payment.status === 'pending' ? 'bg-amber-500/20 border-amber-500/30' :
                              'bg-red-500/20 border-red-500/30'
                            }`}
                          >
                            <View className="flex-row items-center">
                              {payment.status === 'completed' && <Check size={10} className="text-white" />}
                              {payment.status === 'pending' && <Clock size={10} className="text-white" />}
                              {payment.status === 'failed' && <X size={10} className="text-white" />}
                              <UIText className="text-xs font-medium text-white ml-1">
                                {payment.status.toUpperCase()}
                              </UIText>
                            </View>
                          </Badge>
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-600">
                  <CardContent className="items-center py-10">
                    <CreditCard size={48} className="text-slate-500" />
                    <UIText className="text-base text-slate-400 mt-4 text-center">
                      No payment history yet
                    </UIText>
                    <UIText className="text-sm text-slate-500 mt-2 text-center">
                      Make your first payment to see it here
                    </UIText>
                  </CardContent>
                </Card>
              )}
            </View>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <View className="px-6 py-6">
              <UIText className="text-xl font-bold text-white mb-4">
                Payment Settings
              </UIText>
              
              <Card className="bg-slate-800 border-slate-600 mb-4">
                <CardHeader>
                  <CardTitle>
                    <UIText className="text-lg font-semibold text-white">
                      Wallet Configuration
                    </UIText>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-4">
                    <View>
                      <UIText className="text-sm font-medium text-slate-300 mb-2">
                        Default Wallet Address
                      </UIText>
                      <Input
                        value={walletInfo?.address || ''}
                        placeholder="0x..."
                        editable={false}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </View>
                    
                    <View>
                      <UIText className="text-sm font-medium text-slate-300 mb-2">
                        Network
                      </UIText>
                      <Badge variant="outline" className="self-start border-teal-500/30">
                        <UIText className="text-sm font-medium text-teal-400">
                          {walletInfo?.network?.toUpperCase() || 'SEPOLIA TESTNET'}
                        </UIText>
                      </Badge>
                    </View>
                  </View>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600 mb-4">
                <CardHeader>
                  <CardTitle>
                    <UIText className="text-lg font-semibold text-white">
                      Payment Preferences
                    </UIText>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-4">
                    <View>
                      <UIText className="text-sm font-medium text-slate-300 mb-2">
                        Default Payment Method
                      </UIText>
                      <View className="flex-row items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                        <UIText className="text-sm text-white">
                          {paymentMethods.find(m => m.isEnabled)?.name || 'None selected'}
                        </UIText>
                        <Button
                          variant="secondary"
                          size="sm"
                          onPress={() => Alert.alert('Coming Soon', 'Payment method selection will be available soon')}
                          className="bg-slate-600 hover:bg-slate-500"
                        >
                          <UIText className="text-xs font-medium text-white">Change</UIText>
                        </Button>
                      </View>
                    </View>
                    
                    <View>
                      <UIText className="text-sm font-medium text-slate-300 mb-2">
                        Default Bank Account
                      </UIText>
                      <View className="flex-row items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                        <UIText className="text-sm text-white">
                          {bankAccounts.find(a => a.isDefault)?.bankName || 'None selected'}
                        </UIText>
                        <Button
                          variant="secondary"
                          size="sm"
                          onPress={() => Alert.alert('Coming Soon', 'Bank account selection will be available soon')}
                          className="bg-slate-600 hover:bg-slate-500"
                        >
                          <UIText className="text-xs font-medium text-white">Change</UIText>
                        </Button>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle>
                    <UIText className="text-lg font-semibold text-white">
                      Security & Support
                    </UIText>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <View className="space-y-3">
                    <Button
                      variant="secondary"
                      size="default"
                      onPress={() => Alert.alert('Help', 'Contact support at support@udavit.com')}
                      className="justify-start bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
                    >
                      <ExternalLink size={16} className="text-slate-400" />
                      <UIText className="text-slate-300 font-medium ml-3">
                        Contact Support
                      </UIText>
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="default"
                      onPress={() => Alert.alert('Documentation', 'Visit our documentation for more details')}
                      className="justify-start bg-slate-700/50 border-slate-600 hover:bg-slate-600/50"
                    >
                      <ExternalLink size={16} className="text-slate-400" />
                      <UIText className="text-slate-300 font-medium ml-3">
                        View Documentation
                      </UIText>
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
