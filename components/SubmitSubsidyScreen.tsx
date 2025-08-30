import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, Building2, ChevronDown, Circle, FileText, Mail, Phone, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../App';

const SubmitSubsidyScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [showBusinessTypeDropdown, setShowBusinessTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const staggerAnim = useRef(new Animated.Value(0)).current;
  
  // Business type options for chemical industry
  const businessTypeOptions = [
    'Hydrogen Production & Storage',
    'Chemical Manufacturing',
    'Green Chemistry Solutions',
    'Carbon Capture & Utilization',
    'Sustainable Materials',
    'Clean Energy Technologies',
    'Environmental Consulting',
    'Research & Development',
    'Industrial Process Optimization',
    'Waste Management Solutions'
  ];
  
  // Form validation
  const isFormValid = () => {
    return companyName.trim() && 
           businessType.trim() && 
           projectDescription.trim() && 
           fundingAmount.trim() && 
           contactName.trim() && 
           contactEmail.trim() && 
           contactPhone.trim();
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in all required fields before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigation.navigate('ApplicationStatus');
    }, 2000);
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
    
    // Stagger animation for form fields
    Animated.timing(staggerAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

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
            onPress={() => navigation.navigate('LoginSignup')}
            style={{ marginRight: 20 }}
          >
            <ArrowLeft size={24} color="#065f46" />
          </Pressable>
          
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '600', 
            color: '#065f46'
          }}>
            Apply for Government Subsidy
          </Text>
        </Animated.View>

        {/* Form Content */}
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Company Information Section */}
          <Animated.View 
            style={{ 
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
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <Building2 size={20} color="#065f46" />
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginLeft: 8
                }}>
                  Company Information
                </Text>
              </View>
              
              {/* Company Name */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Company Name *
                </Text>
                <TextInput
                  style={{
                    height: 50,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: companyName ? '#38a3a5' : '#e5e7eb',
                    paddingHorizontal: 16,
                    fontSize: 16,
                    color: '#065f46'
                  }}
                  placeholder="Enter your company name"
                  placeholderTextColor="#9ca3af"
                  value={companyName}
                  onChangeText={setCompanyName}
                />
              </View>

              {/* Business Type */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Business Type *
                </Text>
                <Pressable
                  onPress={() => setShowBusinessTypeDropdown(!showBusinessTypeDropdown)}
                  style={{
                    height: 50,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: businessType ? '#38a3a5' : showBusinessTypeDropdown ? '#22577a' : '#e5e7eb',
                    paddingHorizontal: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row'
                  }}
                >
                  <Text style={{ 
                    color: businessType ? '#065f46' : '#6b7280',
                    fontSize: 16
                  }}>
                    {businessType || 'Select business type'}
                  </Text>
                  <ChevronDown size={20} color="#6b7280" />
                </Pressable>
                
                {/* Business Type Dropdown */}
                {showBusinessTypeDropdown && (
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
                    zIndex: 9999,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 8
                  }}>
                    <ScrollView 
                      style={{ maxHeight: 250 }}
                      showsVerticalScrollIndicator={false}
                    >
                      {businessTypeOptions.map((option, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            setBusinessType(option);
                            setShowBusinessTypeDropdown(false);
                          }}
                          style={{
                            paddingVertical: 16,
                            paddingHorizontal: 20,
                            borderBottomWidth: index < businessTypeOptions.length - 1 ? 1 : 0,
                            borderBottomColor: '#f3f4f6',
                            backgroundColor: businessType === option ? '#ecfdf5' : 'transparent'
                          }}
                        >
                          <Text style={{
                            color: businessType === option ? '#065f46' : '#374151',
                            fontSize: 16,
                            fontWeight: businessType === option ? '600' : '400'
                          }}>
                            {option}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* Project Details Section */}
          <Animated.View 
            style={{ 
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
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <FileText size={20} color="#065f46" />
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginLeft: 8
                }}>
                  Project Details
                </Text>
              </View>
              
              {/* Project Description */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Project Description *
                </Text>
                <TextInput
                  style={{
                    height: 120,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: projectDescription ? '#38a3a5' : '#e5e7eb',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: '#065f46',
                    textAlignVertical: 'top'
                  }}
                  placeholder="Describe your hydrogen/chemical industry project in detail..."
                  placeholderTextColor="#9ca3af"
                  value={projectDescription}
                  onChangeText={setProjectDescription}
                  multiline
                  numberOfLines={5}
                />
              </View>

              {/* Funding Amount */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Requested Funding Amount *
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Circle size={20} color="#065f46" style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      height: 50,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: fundingAmount ? '#38a3a5' : '#e5e7eb',
                      paddingHorizontal: 16,
                      fontSize: 16,
                      color: '#065f46'
                    }}
                    placeholder="Enter amount in ETH"
                    placeholderTextColor="#9ca3af"
                    value={fundingAmount}
                    onChangeText={setFundingAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Contact Information Section */}
          <Animated.View 
            style={{ 
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
              padding: 20,
              marginBottom: 100,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16
              }}>
                <User size={20} color="#065f46" />
                <Text style={{
                  fontSize: 18,
                  color: '#065f46',
                  fontWeight: '600',
                  marginLeft: 8
                }}>
                  Contact Information
                </Text>
              </View>
              
              {/* Contact Name */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Contact Person Name *
                </Text>
                <TextInput
                  style={{
                    height: 50,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: contactName ? '#38a3a5' : '#e5e7eb',
                    paddingHorizontal: 16,
                    fontSize: 16,
                    color: '#065f46'
                  }}
                  placeholder="Enter contact person name"
                  placeholderTextColor="#9ca3af"
                  value={contactName}
                  onChangeText={setContactName}
                />
              </View>

              {/* Contact Email */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Email Address *
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Mail size={20} color="#065f46" style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      height: 50,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: contactEmail ? '#38a3a5' : '#e5e7eb',
                      paddingHorizontal: 16,
                      fontSize: 16,
                      color: '#065f46'
                    }}
                    placeholder="Enter email address"
                    placeholderTextColor="#9ca3af"
                    value={contactEmail}
                    onChangeText={setContactEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Contact Phone */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Phone Number *
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Phone size={20} color="#065f46" style={{ marginRight: 8 }} />
                  <TextInput
                    style={{
                      flex: 1,
                      height: 50,
                      backgroundColor: '#f9fafb',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: contactPhone ? '#38a3a5' : '#e5e7eb',
                      paddingHorizontal: 16,
                      fontSize: 16,
                      color: '#065f46'
                    }}
                    placeholder="Enter phone number"
                    placeholderTextColor="#9ca3af"
                    value={contactPhone}
                    onChangeText={setContactPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Submit Button */}
        <View style={{ 
          position: 'absolute', 
          bottom: 40, 
          left: 20, 
          right: 20 
        }}>
          <Pressable 
            onPress={handleSubmit}
            disabled={!isFormValid() || isSubmitting}
            style={{
              backgroundColor: isFormValid() ? '#38a3a5' : '#22577a',
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              opacity: isFormValid() ? 1 : 0.7
            }}
          >
            {isSubmitting ? (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#ffffff',
                  borderTopColor: 'transparent',
                  marginRight: 8
                }} />
                <Text style={{
                  color: '#ffffff',
                  fontSize: 18,
                  fontWeight: '600'
                }}>
                  Submitting...
                </Text>
              </View>
            ) : (
              <Text style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '600'
              }}>
                Submit Application
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubmitSubsidyScreen;
