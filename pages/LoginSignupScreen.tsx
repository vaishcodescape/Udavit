import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AlertCircle, ArrowLeft, Bell, Building2, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { RootStackParamList } from '../App';
import { authService } from '../services/authService';
import { AlertDescription, AlertTitle, Alert as UIAlert } from '../src/components/ui/alert';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Input } from '../src/components/ui/input';
import { Label } from '../src/components/ui/label';
import { Progress } from '../src/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../src/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '../src/components/ui/tabs';
import { Text as UIText } from '../src/components/ui/text';

const LoginSignupScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [startup, setStartup] = useState('');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  
  // Role and startup options
  const roleOptions = [
    { label: 'Chemical Engineer', value: 'Chemical Engineer' },
    { label: 'Process Engineer', value: 'Process Engineer' },
    { label: 'Research Scientist', value: 'Research Scientist' },
    { label: 'Project Manager', value: 'Project Manager' },
    { label: 'Quality Manager', value: 'Quality Manager' },
    { label: 'Environmental Engineer', value: 'Environmental Engineer' },
    { label: 'Safety Engineer', value: 'Safety Engineer' },
    { label: 'Operations Manager', value: 'Operations Manager' },
    { label: 'Technical Director', value: 'Technical Director' },
    { label: 'CEO/Founder', value: 'CEO/Founder' },
    { label: 'CTO', value: 'CTO' },
    { label: 'VP Engineering', value: 'VP Engineering' },
    { label: 'Plant Manager', value: 'Plant Manager' },
    { label: 'R&D Manager', value: 'R&D Manager' },
    { label: 'Other', value: 'Other' }
  ];
  
  const startupOptions = [
    { label: 'Hydrogen Production', value: 'Hydrogen Production' },
    { label: 'Fuel Cell Technology', value: 'Fuel Cell Technology' },
    { label: 'Chemical Manufacturing', value: 'Chemical Manufacturing' },
    { label: 'Green Energy Solutions', value: 'Green Energy Solutions' },
    { label: 'Carbon Capture', value: 'Carbon Capture' },
    { label: 'Renewable Energy', value: 'Renewable Energy' },
    { label: 'Clean Technology', value: 'Clean Technology' },
    { label: 'Environmental Services', value: 'Environmental Services' },
    { label: 'Industrial Automation', value: 'Industrial Automation' },
    { label: 'Other', value: 'Other' }
  ];
  
  useEffect(() => {
    // Trigger visibility animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle tab switching
  const handleTabSwitch = (newTab: string) => {
    if (newTab === activeTab) return;
    
    // Reset form when switching tabs
    setEmail('');
    setPassword('');
    setRole('');
    setStartup('');
    setError('');
    
    setActiveTab(newTab);
  };
  
    // Authentication functions
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email: email.trim().toLowerCase(), password });
      
      if (response.success) {
        navigation.navigate('StartupDashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      const signupData = {
        email: email.trim().toLowerCase(),
        password,
        role: role.trim(),
        startup: startup.trim()
      };

      const response = await authService.signup(signupData);
      
      if (response.success) {
        navigation.navigate('StartupDashboard');
      } else {
        setError(response.message || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAndSignup = () => {
    Alert.alert(
      'Confirm Your Profile',
      `Please confirm your profile details before creating your account:\n\n📧 Email: ${email.trim()}\n👤 Role: ${role}\n🏢 Company Type: ${startup}\n\nThis information will be saved to your profile.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Create Account',
          onPress: handleSignup
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-50">
        {/* Header */}
        <View className={`px-5 pt-5 pb-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <Pressable 
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-5"
          >
            <ArrowLeft size={24} className="text-teal-700" />
            <UIText className="text-primary font-semibold ml-2">Back</UIText>
          </Pressable>
        </View>

        {/* Tabs */}
        <View className={`mx-5 mb-6 z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-2">
              <Tabs value={activeTab} onValueChange={handleTabSwitch} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" className="flex-1">
                    <UIText className="font-semibold">Login</UIText>
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">
                    <UIText className="font-semibold">Signup</UIText>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </View>

        {/* Form Content */}
        <ScrollView 
          className="flex-1 z-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <View className={`px-5 z-5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold text-primary">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <UIText className="text-center text-muted-foreground">
                  {activeTab === 'login' 
                    ? 'Sign in to your hydrogen innovation account' 
                    : 'Join the hydrogen innovation community'
                  }
                </UIText>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Form Progress Indicator - Only show for signup */}
                {activeTab === 'signup' && (
                  <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <UIText className="text-sm text-muted-foreground font-medium">
                        Profile Completion
                      </UIText>
                      <Badge variant="outline" className="bg-primary/10">
                        <UIText className="text-primary font-semibold">
                          {((email ? 1 : 0) + (password ? 1 : 0) + (role ? 1 : 0) + (startup ? 1 : 0)) * 25}%
                        </UIText>
                      </Badge>
                    </View>
                    <Progress 
                      value={((email ? 1 : 0) + (password ? 1 : 0) + (role ? 1 : 0) + (startup ? 1 : 0)) * 25} 
                      className="h-2"
                    />
                  </View>
                )}

                {/* Error/Info Message */}
                {error && (
                  <UIAlert 
                    variant={error.includes('mock authentication') ? 'default' : 'destructive'}
                    icon={error.includes('mock authentication') ? Bell : AlertCircle}
                  >
                    <AlertTitle>
                      {error.includes('mock authentication') ? 'Development Mode' : 'Error'}
                    </AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </UIAlert>
                )}

                {/* Email Input */}
                <View className="space-y-2">
                  <Label className="flex-row items-center">
                    <Mail size={16} className="text-teal-700" />
                    <UIText className="text-sm font-medium text-primary ml-2">Email</UIText>
                  </Label>
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="h-12"
                  />
                </View>

                {/* Password Input */}
                <View className="space-y-2">
                  <Label className="flex-row items-center">
                    <Lock size={16} className="text-teal-700" />
                    <UIText className="text-sm font-medium text-primary ml-2">Password</UIText>
                  </Label>
                  <View className="relative">
                    <Input
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      className="h-12 pr-12"
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                      onPress={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <Eye size={20} className="text-gray-500" /> : <EyeOff size={20} className="text-gray-500" />}
                    </Pressable>
                  </View>
                </View>

                {/* Role Dropdown - Only show for signup */}
                {activeTab === 'signup' && (
                  <View className="space-y-2">
                    <Label className="flex-row items-center">
                      <User size={16} className="text-teal-700" />
                      <UIText className="text-sm font-medium text-primary ml-2">Chemical Industry Role</UIText>
                    </Label>
                    <Select value={roleOptions.find(opt => opt.value === role)} onValueChange={(option) => setRole(option?.value || '')}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <UIText>{option.label}</UIText>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </View>
            )}

                {/* Startup Dropdown - Only show for signup */}
                {activeTab === 'signup' && (
                  <View className="space-y-2">
                    <Label className="flex-row items-center">
                      <Building2 size={16} className="text-teal-700" />
                      <UIText className="text-sm font-medium text-primary ml-2">Hydrogen & Chemical Company</UIText>
                    </Label>
                    <Select value={startupOptions.find(opt => opt.value === startup)} onValueChange={(option) => setStartup(option?.value || '')}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select startup" />
                      </SelectTrigger>
                      <SelectContent>
                        {startupOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} label={option.label}>
                            <UIText>{option.label}</UIText>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
              </View>
            )}
              </CardContent>
            </Card>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="absolute bottom-10 left-5 right-5 z-50">
          <Card className="bg-white border-0 shadow-xl">
            <CardContent className="p-4 space-y-3">
              <Button
                onPress={() => {
                  if (activeTab === 'login') {
                    handleLogin();
                  } else {
                    confirmAndSignup();
                  }
                }}
                disabled={isLoading || (activeTab === 'login' 
                  ? !(email && password)
                  : !(email && password && role && startup))
                }
                className="h-12"
                size="lg"
              >
                {isLoading && (
                  <ActivityIndicator
                    size="small"
                    className="mr-2 text-white"
                  />
                )}
                <UIText className="text-white font-bold text-lg">
                  {isLoading 
                    ? (activeTab === 'login' ? 'LOGGING IN...' : 'SIGNING UP...')
                    : (activeTab === 'login' ? 'LOG IN' : 'SIGN UP')
                  }
                </UIText>
              </Button>

              <Button 
                onPress={() => navigation.navigate('OnBoarding')}
                variant="outline"
                className="h-12"
              >
                <UIText className="text-primary font-semibold">
                  Back to Onboarding
                </UIText>
              </Button>
            </CardContent>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginSignupScreen;