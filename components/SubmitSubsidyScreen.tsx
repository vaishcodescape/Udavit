import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Building2, Circle, FileText, Mail, Phone, User } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackParamList } from '../App';


const SubmitSubsidyScreen = () => {
  const navigation = useNavigation() as NativeStackNavigationProp<RootStackParamList>;
  
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Dropdown state
  const [businessTypeDropdownOpen, setBusinessTypeDropdownOpen] = useState(false);
  const [businessTypeSearch, setBusinessTypeSearch] = useState('');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const staggerAnim = useRef(new Animated.Value(0)).current;
  
  // Business type options for chemical industry
  const businessTypeOptions = [
    { label: 'Hydrogen Production & Storage', value: 'Hydrogen Production & Storage' },
    { label: 'Chemical Manufacturing', value: 'Chemical Manufacturing' },
    { label: 'Green Chemistry Solutions', value: 'Green Chemistry Solutions' },
    { label: 'Carbon Capture & Utilization', value: 'Carbon Capture & Utilization' },
    { label: 'Sustainable Materials', value: 'Sustainable Materials' },
    { label: 'Clean Energy Technologies', value: 'Clean Energy Technologies' },
    { label: 'Environmental Consulting', value: 'Environmental Consulting' },
    { label: 'Research & Development', value: 'Research & Development' },
    { label: 'Industrial Process Optimization', value: 'Industrial Process Optimization' },
    { label: 'Waste Management Solutions', value: 'Waste Management Solutions' }
  ];
  
  // Filtered options based on search
  const filteredBusinessTypeOptions = businessTypeOptions.filter(option =>
    option.label.toLowerCase().includes(businessTypeSearch.toLowerCase())
  );
  
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
      <View 
        style={{ flex: 1, backgroundColor: '#d1fae5' }}
      >
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
          style={{ flex: 1, paddingHorizontal: 20, zIndex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Company Information Section */}
          <Animated.View 
            style={{ 
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}],
              zIndex: 2
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
              <View style={{ marginBottom: 24 }}>
                <Text style={{
                  fontSize: 16,
                  color: '#065f46',
                  fontWeight: '500',
                  marginBottom: 8
                }}>
                  Business Type *
                </Text>
                <Pressable 
                  style={({ pressed }) => ({
                    height: 50,
                    backgroundColor: '#f9fafb',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: businessType ? '#38a3a5' : pressed ? '#38a3a5' : '#e5e7eb',
                    paddingHorizontal: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  })}
                  onPress={() => setBusinessTypeDropdownOpen(true)}
                >
                  <Text style={{
                    color: businessType ? '#065f46' : '#6b7280',
                    fontSize: 16,
                    fontWeight: businessType ? '500' : '400'
                  }}>
                    {businessType || 'Select business type'}
                  </Text>
                  <Text style={{
                    color: businessType ? '#10b981' : '#6b7280',
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}>▼</Text>
                </Pressable>
                
                {/* Business Type Modal Dropdown */}
                <Modal
                  visible={businessTypeDropdownOpen}
                  transparent={true}
                  animationType="fade"
                  onRequestClose={() => setBusinessTypeDropdownOpen(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setBusinessTypeDropdownOpen(false)}>
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
                              Select Business Type
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
                              placeholder="Search business types..."
                              placeholderTextColor="#9ca3af"
                              value={businessTypeSearch}
                              onChangeText={setBusinessTypeSearch}
                              autoCapitalize="none"
                            />
                          </View>
                          
                          <ScrollView 
                            style={{ maxHeight: 300 }}
                            showsVerticalScrollIndicator={true}
                            keyboardShouldPersistTaps="handled"
                          >
                            {filteredBusinessTypeOptions.length === 0 ? (
                              <View style={{
                                paddingVertical: 40,
                                alignItems: 'center'
                              }}>
                                <Text style={{
                                  color: '#9ca3af',
                                  fontSize: 14,
                                  fontStyle: 'italic'
                                }}>
                                  No business types found matching "{businessTypeSearch}"
                                </Text>
                              </View>
                            ) : (
                              filteredBusinessTypeOptions.map((option) => (
                                <Pressable
                                  key={option.value}
                                  style={({ pressed }) => ({
                                    paddingVertical: 16,
                                    paddingHorizontal: 20,
                                    backgroundColor: businessType === option.value ? '#eff6ff' : pressed ? '#f9fafb' : 'transparent',
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#f3f4f6'
                                  })}
                                  onPress={() => {
                                    setBusinessType(option.value);
                                    setBusinessTypeDropdownOpen(false);
                                    setBusinessTypeSearch('');
                                  }}
                                >
                                  <Text style={{
                                    color: businessType === option.value ? '#1d4ed8' : '#374151',
                                    fontSize: 16,
                                    fontWeight: businessType === option.value ? '600' : '400'
                                  }}>
                                    {option.label}
                                  </Text>
                                  {businessType === option.value && (
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
          </Animated.View>

          {/* Project Details Section */}
          <Animated.View 
            style={{ 
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}],
              zIndex: 2
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
              })}],
              zIndex: 2
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
