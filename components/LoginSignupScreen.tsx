import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronDown } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../App';

const LoginSignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState('login');
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [startup, setStartup] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showStartupDropdown, setShowStartupDropdown] = useState(false);
  
  // Role and startup options
  const roleOptions = [
    'Chemical Engineer',
    'Process Engineer',
    'Research Scientist',
    'Laboratory Technician',
    'Quality Control Specialist',
    'Safety Engineer',
    'Environmental Engineer',
    'Production Manager',
    'Plant Operator',
    'Analytical Chemist',
    'Catalyst Specialist',
    'Electrolysis Engineer',
    'Hydrogen Storage Expert',
    'Fuel Cell Engineer',
    'Chemical Plant Manager',
    'R&D Director',
    'Technical Sales Representative',
    'Regulatory Affairs Specialist',
    'Sustainability Consultant',
    'Other'
  ];
  
  const startupOptions = [
    'Hydrogen Production & Storage',
    'Electrolysis Technology',
    'Fuel Cell Development',
    'Chemical Manufacturing',
    'Green Hydrogen Solutions',
    'Industrial Gas Production',
    'Catalyst Development',
    'Chemical Process Optimization',
    'Hydrogen Infrastructure',
    'Carbon Capture & Utilization',
    'Renewable Energy Integration',
    'Chemical Safety & Compliance',
    'Sustainable Chemical Processes',
    'Hydrogen Transportation',
    'Chemical Analytics & Testing',
    'Industrial Automation',
    'Chemical Waste Management',
    'Green Chemistry Solutions',
    'Other'
  ];
  
  // Filtered options for search
  const [roleSearch, setRoleSearch] = useState('');
  const [startupSearch, setStartupSearch] = useState('');
  
  const filteredRoleOptions = roleOptions.filter(option =>
    option.toLowerCase().includes(roleSearch.toLowerCase())
  );
  
  const filteredStartupOptions = startupOptions.filter(option =>
    option.toLowerCase().includes(startupSearch.toLowerCase())
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
  
  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setShowRoleDropdown(false);
    setShowStartupDropdown(false);
    setRoleSearch('');
    setStartupSearch('');
  };
  
  // Handle tab switching with animations
  const handleTabSwitch = (newTab: string) => {
    if (newTab === activeTab) return;
    
    // Animate tab transition
    Animated.parallel([
      Animated.timing(tabScaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(formSlideAnim, {
        toValue: newTab === 'signup' ? -20 : 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Change tab
      setActiveTab(newTab);
      
      // Reset form position and animate back
      Animated.parallel([
        Animated.timing(tabScaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#d1fae5' }}>
        {/* No overlay - dropdowns will close on outside press */}
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
            elevation: 3
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
        <Pressable 
          onPress={closeDropdowns}
          style={{ flex: 1 }}
        >
          <Animated.View 
            style={{ 
              paddingHorizontal: 20,
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { translateX: formSlideAnim },
                { scale: tabScaleAnim }
              ]
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
            <TextInput
              style={{
                height: 50,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: password ? '#10b981' : '#e5e7eb',
                paddingHorizontal: 16,
                color: '#065f46',
                fontSize: 16
              }}
              placeholder="Enter your password"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Role Dropdown - Only show for signup */}
          {activeTab === 'signup' && (
            <View style={{ marginBottom: 24, zIndex: 9999 }}>
              <Text style={{
                fontSize: 16,
                color: '#065f46',
                fontWeight: '500',
                marginBottom: 8
              }}>
                Chemical Industry Role
              </Text>
              <Pressable
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                style={{
                  height: 50,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: role ? '#38a3a5' : showRoleDropdown ? '#22577a' : '#e5e7eb',
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Text style={{ 
                  color: role ? '#065f46' : '#6b7280',
                  fontSize: 16
                }}>
                  {role || 'Select your role'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </Pressable>
              
              {/* Role Options Dropdown */}
              {showRoleDropdown && (
                <View style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  marginTop: 4,
                  maxHeight: 300,
                  zIndex: 99999,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 10
                }}>
                  {/* Search Input */}
                  <View style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6',
                    backgroundColor: '#fafafa'
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginBottom: 8,
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      Search Chemical Industry Roles
                    </Text>
                    <TextInput
                      style={{
                        height: 44,
                        backgroundColor: '#ffffff',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        fontSize: 16,
                        color: '#065f46',
                        borderWidth: 1,
                        borderColor: '#e5e7eb'
                      }}
                      placeholder="Search chemical engineering roles..."
                      placeholderTextColor="#9ca3af"
                      value={roleSearch}
                      onChangeText={setRoleSearch}
                    />
                  </View>
                  
                  {/* Options List */}
                  {filteredRoleOptions.length > 0 ? (
                    <ScrollView 
                      style={{ maxHeight: 200 }}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      {filteredRoleOptions.map((option, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setRole(option);
                            setShowRoleDropdown(false);
                            setRoleSearch('');
                          }}
                          style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: index < filteredRoleOptions.length - 1 ? 1 : 0,
                            borderBottomColor: '#f3f4f6',
                            backgroundColor: role === option ? '#ecfdf5' : 'transparent',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                          <Text style={{
                            color: role === option ? '#065f46' : '#374151',
                            fontSize: 16,
                            fontWeight: role === option ? '600' : '400'
                          }}>
                            {option}
                          </Text>
                          {role === option && (
                            <View style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: '#10b981'
                            }} />
                          )}
                        </Pressable>
                      ))}
                    </ScrollView>
                  ) : (
                    <View style={{
                      padding: 24,
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
                )}
              </View>
            )}
          </View>
        )}

          {/* Startup Dropdown - Only show for signup */}
          {activeTab === 'signup' && (
            <View style={{ marginBottom: 40 }}>
              <Text style={{
                fontSize: 16,
                color: '#065f46',
                fontWeight: '500',
                marginBottom: 8
              }}>
                Hydrogen & Chemical Company
              </Text>
              <Pressable
                onPress={() => setShowStartupDropdown(!showStartupDropdown)}
                style={{
                  height: 50,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: startup ? '#38a3a5' : showStartupDropdown ? '#22577a' : '#e5e7eb',
                  paddingHorizontal: 16,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Text style={{ 
                  color: startup ? '#065f46' : '#6b7280',
                  fontSize: 16
                }}>
                  {startup || 'Select startup'}
                </Text>
                <ChevronDown size={20} color="#6b7280" />
              </Pressable>
              
              {/* Startup Options Dropdown */}
              {showStartupDropdown && (
                <View style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#ffffff',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  marginTop: 4,
                  maxHeight: 300,
                  zIndex: 99999,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 8,
                  elevation: 10
                }}>
                  {/* Search Input */}
                  <View style={{
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#f3f4f6',
                    backgroundColor: '#fafafa'
                  }}>
                    <Text style={{
                      fontSize: 12,
                      color: '#6b7280',
                      marginBottom: 8,
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}>
                      Search Hydrogen & Chemical Startups
                    </Text>
                    <TextInput
                      style={{
                        height: 44,
                        backgroundColor: '#ffffff',
                        borderRadius: 8,
                        paddingHorizontal: 16,
                        fontSize: 16,
                        color: '#065f46',
                        borderWidth: 1,
                        borderColor: '#e5e7eb'
                      }}
                      placeholder="Search hydrogen companies..."
                      placeholderTextColor="#9ca3af"
                      value={startupSearch}
                      onChangeText={setStartupSearch}
                    />
                  </View>
                  
                  {/* Options List */}
                  {filteredStartupOptions.length > 0 ? (
                    <ScrollView 
                      style={{ maxHeight: 200 }}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}
                    >
                      {filteredStartupOptions.map((option, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setStartup(option);
                            setShowStartupDropdown(false);
                            setStartupSearch('');
                          }}
                          style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: index < filteredStartupOptions.length - 1 ? 1 : 0,
                            borderBottomColor: '#f3f4f6',
                            backgroundColor: startup === option ? '#ecfdf5' : 'transparent',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Text style={{
                          color: startup === option ? '#065f46' : '#374151',
                          fontSize: 16,
                          fontWeight: startup === option ? '600' : '400'
                        }}>
                          {option}
                        </Text>
                        {startup === option && (
                          <View style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#10b981'
                          }} />
                        )}
                      </Pressable>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={{
                    padding: 24,
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
                )}
              </View>
            )}
          </View>
        )}
        </Animated.View>
        </Pressable>

        {/* Login Button */}
        <View style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 20, 
          right: 20 
        }}>
          <Pressable 
            onPress={() => {
              if (activeTab === 'login') {
                // For login, navigate to Startup Dashboard
                navigation.navigate('StartupDashboard');
              } else {
                // For signup, navigate to Submit Subsidy
                navigation.navigate('SubmitSubsidy');
              }
            }}
            style={{
              backgroundColor: activeTab === 'login' 
                ? (email && password) ? '#38a3a5' : '#22577a'
                : (email && password && role && startup) ? '#38a3a5' : '#22577a',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              opacity: activeTab === 'login' 
                ? (email && password) ? 1 : 0.7
                : (email && password && role && startup) ? 1 : 0.7
            }}
            disabled={activeTab === 'login' 
              ? !(email && password)
              : !(email && password && role && startup)
            }
          >
            <Text style={{
              color: '#ffffff',
              fontSize: 18,
              fontWeight: '600'
            }}>
              {activeTab === 'login' ? 'LOG IN' : 'SIGN UP'}
            </Text>
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
