import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Eye, EyeOff } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackParamList } from '../App';
import { authService } from '../services/authService';


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
  
  // Dropdown state
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [startupDropdownOpen, setStartupDropdownOpen] = useState(false);
  
  // Search state
  const [roleSearch, setRoleSearch] = useState('');
  const [startupSearch, setStartupSearch] = useState('');
  
  // Close dropdowns when switching tabs
  useEffect(() => {
    setRoleDropdownOpen(false);
    setStartupDropdownOpen(false);
    setRoleSearch('');
    setStartupSearch('');
  }, [activeTab]);

  
  // Role and startup options
  const roleOptions = [
    { label: 'Chemical Engineer', value: 'Chemical Engineer' },
    { label: 'Process Engineer', value: 'Process Engineer' },
    { label: 'Research Scientist', value: 'Research Scientist' },
    { label: 'Laboratory Technician', value: 'Laboratory Technician' },
    { label: 'Quality Control Specialist', value: 'Quality Control Specialist' },
    { label: 'Safety Engineer', value: 'Safety Engineer' },
    { label: 'Environmental Engineer', value: 'Environmental Engineer' },
    { label: 'Production Manager', value: 'Production Manager' },
    { label: 'Plant Operator', value: 'Plant Operator' },
    { label: 'Analytical Chemist', value: 'Analytical Chemist' },
    { label: 'Catalyst Specialist', value: 'Catalyst Specialist' },
    { label: 'Electrolysis Engineer', value: 'Electrolysis Engineer' },
    { label: 'Hydrogen Storage Expert', value: 'Hydrogen Storage Expert' },
    { label: 'Fuel Cell Engineer', value: 'Fuel Cell Engineer' },
    { label: 'Chemical Plant Manager', value: 'Chemical Plant Manager' },
    { label: 'R&D Director', value: 'R&D Director' },
    { label: 'Technical Sales Representative', value: 'Technical Sales Representative' },
    { label: 'Regulatory Affairs Specialist', value: 'Regulatory Affairs Specialist' },
    { label: 'Sustainability Consultant', value: 'Sustainability Consultant' },
    { label: 'Other', value: 'Other' }
  ];
  
  const startupOptions = [
    { label: 'Hydrogen Production & Storage', value: 'Hydrogen Production & Storage' },
    { label: 'Electrolysis Technology', value: 'Electrolysis Technology' },
    { label: 'Fuel Cell Development', value: 'Fuel Cell Development' },
    { label: 'Chemical Manufacturing', value: 'Chemical Manufacturing' },
    { label: 'Green Hydrogen Solutions', value: 'Green Hydrogen Solutions' },
    { label: 'Industrial Gas Production', value: 'Industrial Gas Production' },
    { label: 'Catalyst Development', value: 'Catalyst Development' },
    { label: 'Chemical Process Optimization', value: 'Chemical Process Optimization' },
    { label: 'Hydrogen Infrastructure', value: 'Hydrogen Infrastructure' },
    { label: 'Carbon Capture & Utilization', value: 'Carbon Capture & Utilization' },
    { label: 'Renewable Energy Integration', value: 'Renewable Energy Integration' },
    { label: 'Chemical Safety & Compliance', value: 'Chemical Safety & Compliance' },
    { label: 'Sustainable Chemical Processes', value: 'Sustainable Chemical Processes' },
    { label: 'Hydrogen Transportation', value: 'Hydrogen Transportation' },
    { label: 'Chemical Analytics & Testing', value: 'Chemical Analytics & Testing' },
    { label: 'Industrial Automation', value: 'Industrial Automation' },
    { label: 'Chemical Waste Management', value: 'Chemical Waste Management' },
    { label: 'Green Chemistry Solutions', value: 'Green Chemistry Solutions' },
    { label: 'Other', value: 'Other' }
  ];
  
  // Filtered options based on search
  const filteredRoleOptions = roleOptions.filter(option =>
    option.label.toLowerCase().includes(roleSearch.toLowerCase())
  );
  
  const filteredStartupOptions = startupOptions.filter(option =>
    option.label.toLowerCase().includes(startupSearch.toLowerCase())
  );
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const headerSlideAnim = useRef(new Animated.Value(-30)).current;
  
  // Tab transition animations
  const tabSlideAnim = useRef(new Animated.Value(0)).current;
  const tabScaleAnim = useRef(new Animated.Value(1)).current;
  const formSlideAnim = useRef(new Animated.Value(0)).current;
  const indicatorPulseAnim = useRef(new Animated.Value(1)).current;
  
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Start indicator pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(indicatorPulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(indicatorPulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
    // Authentication functions
  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        Alert.alert(
          'Login Successful!',
          `Welcome back! Redirecting to dashboard...`,
          [{ 
            text: 'Continue', 
            onPress: () => navigation.navigate('StartupDashboard')
          }]
        );
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAndSignup = () => {
    // Show confirmation dialog with profile details
    Alert.alert(
      'Confirm Your Profile',
      `Please confirm your profile details before creating your account:\n\n📧 Email: ${email.trim()}\n👤 Role: ${role}\n🏢 Company Type: ${startup}\n\nThis information will be saved to your Firebase profile.`,
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

  const handleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Prepare complete user profile data for Firebase
      const signupData = {
        email: email.trim().toLowerCase(),
        password,
        role: role.trim(),
        startup: startup.trim()
      };

      console.log('Sending signup data to Firebase:', {
        email: signupData.email,
        role: signupData.role,
        startup: signupData.startup,
        // Don't log password for security
      });

      const response = await authService.signup(signupData);
      
      if (response.success) {
        console.log('Signup successful! User profile saved to Firebase:', {
          email: signupData.email,
          role: signupData.role,
          startup: signupData.startup,
          userId: response.user?.id
        });

        Alert.alert(
          'Account Created Successfully!', 
          `Welcome to the platform! Your complete profile has been saved to Firebase:\n\n📧 Email: ${signupData.email}\n👤 Role: ${signupData.role}\n🏢 Company Type: ${signupData.startup}\n\nYou can now log in with your credentials.`,
          [{ 
            text: 'Go to Login', 
            onPress: () => {
              setActiveTab('login');
              // Clear form
              setEmail('');
              setPassword('');
              setRole('');
              setStartup('');
            }
          }]
        );
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        setError('Checking server connection...');
        const isConnected = await authService.checkConnection();
        if (!isConnected) {
          setError('⚠️ Backend service unavailable - Using mock authentication for development. You can still test the app functionality!');
        } else {
          setError(''); // Clear error if connection is successful
        }
      } catch (error) {
        setError('⚠️ Backend service unavailable - Using mock authentication for development. You can still test the app functionality!');
      }
    };

    checkApiConnection();
  }, []);

  // Handle tab switching with animations
  const handleTabSwitch = (newTab: string) => {
    if (newTab === activeTab) return;
    
    // Reset form when switching tabs
    setEmail('');
    setPassword('');
    setRole('');
    setStartup('');
    setError('');
    
    // Animate tab switch
    Animated.parallel([
      Animated.timing(tabSlideAnim, {
        toValue: newTab === 'signup' ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(tabScaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(formSlideAnim, {
        toValue: newTab === 'signup' ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveTab(newTab);
      // Reset scale animation
      Animated.timing(tabScaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View 
        style={{ flex: 1, backgroundColor: '#d1fae5' }}
      >

        {/* Header */}
        <Animated.View 
          style={{ 
            alignItems: 'center', 
            paddingTop: 40,
            paddingBottom: 40,
            opacity: fadeAnim,
            transform: [{ translateY: headerSlideAnim }]
          }}
        >
        </Animated.View>

        {/* Tabs */}
        <Animated.View 
          style={{ 
            flexDirection: 'row', 
            marginHorizontal: 20,
            marginBottom: 40,
            backgroundColor: '#ffffff',
            borderRadius: 12,
            padding: 4,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            zIndex: 10
          }}
        >
          <Pressable 
            style={{
              flex: 1,
              backgroundColor: activeTab === 'login' ? '#22577a' : 'transparent',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              position: 'relative'
            }}
            onPress={() => handleTabSwitch('login')}
          >
            <Text style={{
              color: activeTab === 'login' ? '#ffffff' : '#22577a',
              fontWeight: '600',
              fontSize: 16
            }}>
              Login
            </Text>
            {activeTab === 'login' && (
              <Animated.View 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,  
                  backgroundColor: '#38a3a5',
                  borderRadius: 2,
                  transform: [{ scaleX: indicatorPulseAnim }]
                }}
              />
            )}
          </Pressable>
          
          <Pressable 
            style={{
              flex: 1,
              backgroundColor: activeTab === 'signup' ? '#22577a' : 'transparent',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              position: 'relative'
            }}
            onPress={() => handleTabSwitch('signup')}
          >
            <Text style={{
              color: activeTab === 'signup' ? '#ffffff' : '#22577a',
              fontWeight: '600',
              fontSize: 16
            }}>
              Signup
            </Text>
            {activeTab === 'signup' && (
              <Animated.View 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  backgroundColor: '#38a3a5',
                  borderRadius: 2,
                  transform: [{ scaleX: indicatorPulseAnim }]
                }}
              />
            )}
          </Pressable>
        </Animated.View>

        {/* Form Content */}
        <ScrollView 
          style={{ flex: 1, zIndex: 5 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          <Animated.View 
            style={{ 
              paddingHorizontal: 20,
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { translateX: formSlideAnim },
                { scale: tabScaleAnim }
              ],
              zIndex: 5
            }}
          >
            {/* Form Progress Indicator - Only show for signup */}
            {activeTab === 'signup' && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
                paddingHorizontal: 8
              }}>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginRight: 8
                }}>
                  Chemical Industry Profile Progress:
                </Text>
                <View style={{
                  flex: 1,
                  height: 6,
                  backgroundColor: '#e5e7eb',
                  borderRadius: 3,
                  overflow: 'hidden'
                }}>
                  <View style={{
                    width: `${((email ? 1 : 0) + (password ? 1 : 0) + (role ? 1 : 0) + (startup ? 1 : 0)) * 25}%`,
                    height: '100%',
                    backgroundColor: '#38a3a5',
                    borderRadius: 3
                  }} />
                </View>
                <Text style={{
                  fontSize: 12,
                  color: '#6b7280',
                  marginLeft: 8,
                  fontWeight: '600'
                }}>
                  {((email ? 1 : 0) + (password ? 1 : 0) + (role ? 1 : 0) + (startup ? 1 : 0)) * 25}%
                </Text>
              </View>
            )}

            {/* Error/Info Message */}
            {error ? (
              <View style={{
                backgroundColor: error.includes('mock authentication') ? '#eff6ff' : '#fef2f2',
                borderWidth: 1,
                borderColor: error.includes('mock authentication') ? '#bfdbfe' : '#fecaca',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                marginBottom: 20
              }}>
                <Text style={{
                  color: error.includes('mock authentication') ? '#1e40af' : '#dc2626',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                color: '#065f46',
                fontWeight: '500',
                marginBottom: 8
              }}>
                Email
              </Text>
              <TextInput
                style={{
                  height: 50,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: email ? '#10b981' : '#e5e7eb',
                  paddingHorizontal: 16,
                  color: '#065f46',
                  fontSize: 16
                }}
                placeholder="Enter your email"
                placeholderTextColor="#6b7280"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{
                fontSize: 16,
                color: '#065f46',
                fontWeight: '500',
                marginBottom: 8
              }}>
                Password
              </Text>
              <View style={{
                height: 50,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: password ? '#10b981' : '#e5e7eb',
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    height: '100%',
                    color: '#065f46',
                    fontSize: 16
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor="#6b7280"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  onPress={() => setShowPassword(v => !v)}
                  hitSlop={8}
                  style={{ paddingHorizontal: 6, height: '100%', justifyContent: 'center' }}
                >
                  {showPassword ? <Eye size={20} color="#6b7280" /> : <EyeOff size={20} color="#6b7280" />}
                </Pressable>
              </View>
            </View>

            {/* Role Dropdown - Only show for signup */}
            {activeTab === 'signup' && (
              <View style={{ marginBottom: 24, zIndex: 100 }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    color: '#065f46',
                    fontWeight: '500',
                    marginBottom: 8
                  }}>
                    Chemical Industry Role
                  </Text>
                  <View>
                    <Pressable 
                      style={({ pressed }) => ({
                        height: 48,
                        width: '100%',
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: role ? '#10b981' : pressed ? '#38a3a5' : '#e5e7eb',
                        backgroundColor: pressed ? '#f0fdf4' : '#ffffff',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        shadowColor: pressed ? '#38a3a5' : '#000',
                        shadowOffset: { width: 0, height: pressed ? 4 : 2 },
                        shadowOpacity: pressed ? 0.2 : 0.1,
                        shadowRadius: pressed ? 6 : 4,
                        elevation: pressed ? 6 : 3,
                      })}
                      onPress={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    >
                      <Text style={{
                        color: role ? '#065f46' : '#6b7280',
                        fontSize: 16,
                        fontWeight: role ? '500' : '400'
                      }}>
                        {role || 'Select your role'}
                      </Text>
                      <Text style={{
                        color: role ? '#10b981' : '#6b7280',
                        fontSize: 18,
                        fontWeight: 'bold',
                        transform: [{ rotate: roleDropdownOpen ? '180deg' : '0deg' }]
                      }}>▼</Text>
                    </Pressable>
                    
                    {/* Role Options Modal Dropdown */}
                    <Modal
                      visible={roleDropdownOpen}
                      transparent={true}
                      animationType="fade"
                      onRequestClose={() => setRoleDropdownOpen(false)}
                    >
                      <TouchableWithoutFeedback onPress={() => setRoleDropdownOpen(false)}>
                        <View style={{
                          flex: 1,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingHorizontal: 20
                        }}>
                          <TouchableWithoutFeedback>
                            <View style={{
                              width: '100%',
                              maxWidth: 350,
                              backgroundColor: '#ffffff',
                              borderRadius: 12,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 8 },
                              shadowOpacity: 0.2,
                              shadowRadius: 16,
                              elevation: 12,
                              maxHeight: 400
                            }}>
                              {/* Header */}
                              <View style={{
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#e5e7eb'
                              }}>
                                <Text style={{
                                  fontSize: 18,
                                  fontWeight: '600',
                                  color: '#065f46',
                                  marginBottom: 8
                                }}>
                                  Select Chemical Industry Role
                                </Text>
                                <TextInput
                                  style={{
                                    height: 36,
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    fontSize: 14,
                                    color: '#374151',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb'
                                  }}
                                  placeholder="Search roles..."
                                  placeholderTextColor="#9ca3af"
                                  value={roleSearch}
                                  onChangeText={setRoleSearch}
                                  autoCapitalize="none"
                                />
                              </View>
                              
                              <ScrollView 
                                style={{ maxHeight: 300 }}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="handled"
                              >
                                {filteredRoleOptions.length === 0 ? (
                                  <View style={{
                                    paddingVertical: 40,
                                    alignItems: 'center'
                                  }}>
                                    <Text style={{
                                      color: '#9ca3af',
                                      fontSize: 14,
                                      fontStyle: 'italic'
                                    }}>
                                      No roles found matching "{roleSearch}"
                                    </Text>
                                  </View>
                                ) : (
                                  filteredRoleOptions.map((option) => (
                                    <Pressable
                                      key={option.value}
                                      style={({ pressed }) => ({
                                        paddingVertical: 16,
                                        paddingHorizontal: 20,
                                        backgroundColor: role === option.value ? '#eff6ff' : pressed ? '#f9fafb' : 'transparent',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f3f4f6'
                                      })}
                                      onPress={() => {
                                        setRole(option.value);
                                        setRoleDropdownOpen(false);
                                        setRoleSearch('');
                                      }}
                                    >
                                      <Text style={{
                                        color: role === option.value ? '#1d4ed8' : '#374151',
                                        fontSize: 16,
                                        fontWeight: role === option.value ? '600' : '400'
                                      }}>
                                        {option.label}
                                      </Text>
                                      {role === option.value && (
                                        <Text style={{
                                          color: '#3b82f6',
                                          fontSize: 12,
                                          marginTop: 4
                                        }}>
                                          ✓ Selected
                                        </Text>
                                      )}
                                    </Pressable>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                  </View>
                </View>
              </View>
            )}

            {/* Startup Dropdown - Only show for signup */}
            {activeTab === 'signup' && (
              <View style={{ marginBottom: 120, zIndex: 50 }}>
                <View>
                  <Text style={{
                    fontSize: 16,
                    color: '#065f46',
                    fontWeight: '500',
                    marginBottom: 8
                  }}>
                    Hydrogen & Chemical Company
                  </Text>
                  <View>
                    <Pressable 
                      style={({ pressed }) => ({
                        height: 48,
                        width: '100%',
                        borderRadius: 8,
                        borderWidth: 2,
                        borderColor: startup ? '#10b981' : pressed ? '#38a3a5' : '#e5e7eb',
                        backgroundColor: pressed ? '#f0fdf4' : '#ffffff',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        shadowColor: pressed ? '#38a3a5' : '#000',
                        shadowOffset: { width: 0, height: pressed ? 4 : 2 },
                        shadowOpacity: pressed ? 0.2 : 0.1,
                        shadowRadius: pressed ? 6 : 4,
                        elevation: pressed ? 6 : 3,
                      })}
                      onPress={() => setStartupDropdownOpen(!startupDropdownOpen)}
                    >
                      <Text style={{
                        color: startup ? '#065f46' : '#6b7280',
                        fontSize: 16,
                        fontWeight: startup ? '500' : '400'
                      }}>
                        {startup || 'Select startup'}
                      </Text>
                      <Text style={{
                        color: startup ? '#10b981' : '#6b7280',
                        fontSize: 18,
                        fontWeight: 'bold',
                        transform: [{ rotate: startupDropdownOpen ? '180deg' : '0deg' }]
                      }}>▼</Text>
                    </Pressable>
                    
                    {/* Startup Options Modal Dropdown */}
                    <Modal
                      visible={startupDropdownOpen}
                      transparent={true}
                      animationType="fade"
                      onRequestClose={() => setStartupDropdownOpen(false)}
                    >
                      <TouchableWithoutFeedback onPress={() => setStartupDropdownOpen(false)}>
                        <View style={{
                          flex: 1,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingHorizontal: 20
                        }}>
                          <TouchableWithoutFeedback>
                            <View style={{
                              width: '100%',
                              maxWidth: 350,
                              backgroundColor: '#ffffff',
                              borderRadius: 12,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 8 },
                              shadowOpacity: 0.2,
                              shadowRadius: 16,
                              elevation: 12,
                              maxHeight: 400
                            }}>
                              {/* Header */}
                              <View style={{
                                paddingHorizontal: 20,
                                paddingVertical: 16,
                                borderBottomWidth: 1,
                                borderBottomColor: '#e5e7eb'
                              }}>
                                <Text style={{
                                  fontSize: 18,
                                  fontWeight: '600',
                                  color: '#065f46',
                                  marginBottom: 8
                                }}>
                                  Select Hydrogen & Chemical Company
                                </Text>
                                <TextInput
                                  style={{
                                    height: 36,
                                    backgroundColor: '#f9fafb',
                                    borderRadius: 8,
                                    paddingHorizontal: 12,
                                    fontSize: 14,
                                    color: '#374151',
                                    borderWidth: 1,
                                    borderColor: '#e5e7eb'
                                  }}
                                  placeholder="Search startups..."
                                  placeholderTextColor="#9ca3af"
                                  value={startupSearch}
                                  onChangeText={setStartupSearch}
                                  autoCapitalize="none"
                                />
                              </View>
                              
                              <ScrollView 
                                style={{ maxHeight: 300 }}
                                showsVerticalScrollIndicator={true}
                                keyboardShouldPersistTaps="handled"
                              >
                                {filteredStartupOptions.length === 0 ? (
                                  <View style={{
                                    paddingVertical: 40,
                                    alignItems: 'center'
                                  }}>
                                    <Text style={{
                                      color: '#9ca3af',
                                      fontSize: 14,
                                      fontStyle: 'italic'
                                    }}>
                                      No startups found matching "{startupSearch}"
                                    </Text>
                                  </View>
                                ) : (
                                  filteredStartupOptions.map((option) => (
                                    <Pressable
                                      key={option.value}
                                      style={({ pressed }) => ({
                                        paddingVertical: 16,
                                        paddingHorizontal: 20,
                                        backgroundColor: startup === option.value ? '#eff6ff' : pressed ? '#f9fafb' : 'transparent',
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#f3f4f6'
                                      })}
                                      onPress={() => {
                                        setStartup(option.value);
                                        setStartupDropdownOpen(false);
                                        setStartupSearch('');
                                      }}
                                    >
                                      <Text style={{
                                        color: startup === option.value ? '#1d4ed8' : '#374151',
                                        fontSize: 16,
                                        fontWeight: startup === option.value ? '600' : '400'
                                      }}>
                                        {option.label}
                                      </Text>
                                      {startup === option.value && (
                                        <Text style={{
                                          color: '#3b82f6',
                                          fontSize: 12,
                                          marginTop: 4
                                        }}>
                                          ✓ Selected
                                        </Text>
                                      )}
                                    </Pressable>
                                  ))
                                )}
                              </ScrollView>
                            </View>
                          </TouchableWithoutFeedback>
                        </View>
                      </TouchableWithoutFeedback>
                    </Modal>
                  </View>
                </View>
              </View>
            )}



            </Animated.View>
        </ScrollView>

        {/* Login Button */}
        <View style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 20, 
          right: 20,
          zIndex: 100
        }}>

          <Pressable 
            onPress={() => {
              if (activeTab === 'login') {
                handleLogin();
              } else {
                confirmAndSignup();
              }
            }}
            style={{
              backgroundColor: activeTab === 'login' 
                ? (email && password && !isLoading) ? '#38a3a5' : '#22577a'
                : (email && password && role && startup && !isLoading) ? '#38a3a5' : '#22577a',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              opacity: activeTab === 'login' 
                ? (email && password && !isLoading) ? 1 : 0.7
                : (email && password && role && startup && !isLoading) ? 1 : 0.7
            }}
            disabled={isLoading || (activeTab === 'login' 
              ? !(email && password)
              : !(email && password && role && startup))
            }
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {isLoading && (
                <ActivityIndicator 
                  size="small" 
                  color="#ffffff" 
                  style={{ marginRight: 8 }} 
                />
              )}
              <Text style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '600'
              }}>
                {isLoading 
                  ? (activeTab === 'login' ? 'LOGGING IN...' : 'SIGNING UP...')
                  : (activeTab === 'login' ? 'LOG IN' : 'SIGN UP')
                }
              </Text>
            </View>
          </Pressable>

          <Pressable 
            onPress={() => navigation.navigate('OnBoarding')}
            style={{
              backgroundColor: 'transparent',
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              marginTop: 12,
              borderWidth: 1,
              borderColor: '#22577a'
            }}
          >
            <Text style={{
              color: '#22577a',
              fontSize: 16,
              fontWeight: '500'
            }}>
              Back to Onboarding
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginSignupScreen;
