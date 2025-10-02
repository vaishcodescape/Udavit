import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Building2, Circle, FileText, Mail, Phone, Upload, User, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Modal, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackParamList } from '../App';
import { DocumentAnalysisResult, llmService } from '../services/llmService';
import { subsidyService } from '../services/subsidyService';
import { Button } from '../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Input } from '../src/components/ui/input';
import { Text as UIText } from '../src/components/ui/text';
import { Badge } from '../src/components/ui/badge';
import { Progress } from '../src/components/ui/progress';


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
  const [error, setError] = useState('');
  
  // LLM evaluation state
  const [projectEvaluation, setProjectEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Document upload state
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{
    id: string;
    name: string;
    type: string;
    size: string;
    uri?: string;
    analysisResult?: DocumentAnalysisResult;
    isAnalyzing?: boolean;
  }>>([]);
  
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
  // Document handling functions
  const handleDocumentUpload = () => {
    Alert.alert(
      'Upload Document',
      'Select document type to upload',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Business License', onPress: () => mockUploadDocument('Business License', 'PDF') },
        { text: 'Financial Statement', onPress: () => mockUploadDocument('Financial Statement', 'PDF') },
        { text: 'Project Proposal', onPress: () => mockUploadDocument('Project Proposal', 'PDF') },
        { text: 'Other Document', onPress: () => mockUploadDocument('Supporting Document', 'PDF') }
      ]
    );
  };

  const mockUploadDocument = async (name: string, type: string) => {
    // Mock document upload - in real app, this would use react-native-document-picker
    const newDocument = {
      id: 'doc-' + Date.now(),
      name: name + '.' + type.toLowerCase(),
      type: type,
      size: '2.4 MB',
      uri: 'mock-uri-' + Date.now(),
      isAnalyzing: true
    };
    
    setUploadedDocuments(prev => [...prev, newDocument]);
    Alert.alert('Success', `${name} uploaded successfully! AI analysis starting...`);
    
    // Start LLM analysis
    await analyzeDocument(newDocument.id, name, type);
  };

  const analyzeDocument = async (documentId: string, documentName: string, documentType: string) => {
    try {
      // Map document types to LLM service types
      const typeMapping: { [key: string]: 'business_license' | 'financial_statement' | 'project_proposal' | 'other' } = {
        'Business License': 'business_license',
        'Financial Statement': 'financial_statement',
        'Project Proposal': 'project_proposal',
        'Supporting Document': 'other'
      };

      const analysisRequest = {
        documentId,
        documentName,
        documentType: typeMapping[documentName] || 'other',
        projectContext: {
          companyName: companyName || 'Company Name',
          businessType: businessType || 'Business Type',
          projectDescription: projectDescription || 'Project Description',
          fundingAmount: fundingAmount || '0 ETH'
        }
      };

      const response = await llmService.analyzeDocument(analysisRequest);

      if (response.success && response.data) {
        // Update document with analysis result
        setUploadedDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, analysisResult: response.data, isAnalyzing: false }
            : doc
        ));

        // Show analysis result
        const result = response.data;
        const validityColor = result.validity === 'valid' ? '✅' : result.validity === 'needs_review' ? '⚠️' : '❌';
        
        Alert.alert(
          'AI Analysis Complete',
          `${validityColor} Document: ${documentName}\n\n` +
          `Analysis Score: ${result.analysisScore}/100\n` +
          `Validity: ${result.validity.replace('_', ' ').toUpperCase()}\n` +
          `Authenticity: ${result.findings.authenticity}%\n` +
          `Confidence: ${Math.round(result.confidence * 100)}%\n\n` +
          `${result.feedback}`,
          [{ text: 'View Details', onPress: () => showDetailedAnalysis(result) }, { text: 'OK' }]
        );
      } else {
        // Analysis failed
        setUploadedDocuments(prev => prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, isAnalyzing: false }
            : doc
        ));
        
        Alert.alert('Analysis Failed', response.message || 'Unable to analyze document');
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      setUploadedDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { ...doc, isAnalyzing: false }
          : doc
      ));
      Alert.alert('Analysis Error', 'Failed to analyze document. Please try again.');
    }
  };

  const showDetailedAnalysis = (result: DocumentAnalysisResult) => {
    const findings = result.findings;
    const authenticityStatus = findings.authenticity >= 85 ? '🟢 HIGH' : 
                              findings.authenticity >= 70 ? '🟡 MEDIUM' : '🔴 LOW';
    
    Alert.alert(
      'Detailed Analysis Results',
      `Document Analysis Breakdown:\n\n` +
      `🔍 Authenticity: ${findings.authenticity}% (${authenticityStatus})\n` +
      `📋 Relevance: ${findings.relevance}%\n` +
      `✅ Completeness: ${findings.completeness}%\n` +
      `⚖️ Compliance: ${findings.compliance}%\n\n` +
      `🔐 Authenticity Assessment:\n` +
      `${findings.authenticity >= 85 ? '• Document appears genuine and unaltered' : 
        findings.authenticity >= 70 ? '• Document shows minor authenticity concerns' : 
        '• Document has significant authenticity issues'}\n` +
      `• AI confidence in authenticity: ${Math.round(result.confidence * 100)}%\n\n` +
      `Recommendations:\n${result.recommendations.map(r => `• ${r}`).join('\n')}\n\n` +
      (result.redFlags.length > 0 ? `⚠️ Red Flags:\n${result.redFlags.map(r => `• ${r}`).join('\n')}` : '✅ No red flags detected'),
      [{ text: 'OK' }]
    );
  };

  // Evaluate entire project with LLM
  const evaluateProject = async () => {
    if (!companyName.trim() || !businessType.trim() || !projectDescription.trim() || !fundingAmount.trim()) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before getting AI evaluation.');
      return;
    }

    setIsEvaluating(true);
    
    try {
      const evaluationRequest = {
        companyName: companyName.trim(),
        businessType: businessType.trim(),
        projectDescription: projectDescription.trim(),
        fundingAmount: fundingAmount.trim(),
        documents: uploadedDocuments.map(doc => ({
          id: doc.id,
          name: doc.name,
          type: doc.type,
          analysisResult: doc.analysisResult
        }))
      };

      const response = await llmService.evaluateProject(evaluationRequest);

      if (response.success && response.data) {
        setProjectEvaluation(response.data);
        showProjectEvaluationResults(response.data);
      } else {
        Alert.alert('Evaluation Failed', response.message || 'Unable to evaluate project');
      }
    } catch (error) {
      console.error('Project evaluation error:', error);
      Alert.alert('Evaluation Error', 'Failed to evaluate project. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const showProjectEvaluationResults = (evaluation: any) => {
    const criteria = evaluation.criteria;
    const overallScore = Math.round(evaluation.overallScore / 10 * 10) / 10; // Convert to 1-10 scale
    
    // Convert all criteria scores to 1-10 scale
    const feasibilityScore = Math.round(criteria.feasibility / 10 * 10) / 10;
    const innovationScore = Math.round(criteria.innovation / 10 * 10) / 10;
    const environmentalScore = Math.round(criteria.environmentalImpact / 10 * 10) / 10;
    const financialScore = Math.round(criteria.financialViability / 10 * 10) / 10;
    const technicalScore = Math.round(criteria.technicalMerit / 10 * 10) / 10;
    
    // Calculate overall authenticity from uploaded documents
    const documentsWithAnalysis = uploadedDocuments.filter(doc => doc.analysisResult);
    const avgAuthenticity = documentsWithAnalysis.length > 0 
      ? Math.round(documentsWithAnalysis.reduce((sum, doc) => sum + doc.analysisResult!.findings.authenticity, 0) / documentsWithAnalysis.length)
      : 0;
    
    const authenticityStatus = avgAuthenticity >= 85 ? '🟢 HIGH' : 
                              avgAuthenticity >= 70 ? '🟡 MEDIUM' : 
                              avgAuthenticity > 0 ? '🔴 LOW' : '⚪ N/A';
    
    const eligibilityEmoji = evaluation.eligibility === 'eligible' ? '✅' : 
                           evaluation.eligibility === 'conditional' ? '⚠️' : '❌';
    
    Alert.alert(
      'AI Project Evaluation Results',
      `${eligibilityEmoji} Overall Score: ${overallScore}/10\n` +
      `Eligibility: ${evaluation.eligibility.replace('_', ' ').toUpperCase()}\n` +
      `🔐 Document Authenticity: ${avgAuthenticity > 0 ? `${avgAuthenticity}% (${authenticityStatus})` : 'No documents analyzed'}\n` +
      `Confidence: ${Math.round(evaluation.confidence * 100)}%\n\n` +
      `📊 Detailed Scores (1-10 scale):\n` +
      `🔬 Feasibility: ${feasibilityScore}/10\n` +
      `💡 Innovation: ${innovationScore}/10\n` +
      `🌱 Environmental Impact: ${environmentalScore}/10\n` +
      `💰 Financial Viability: ${financialScore}/10\n` +
      `⚙️ Technical Merit: ${technicalScore}/10\n\n` +
      `📝 AI Feedback:\n${evaluation.feedback}\n\n` +
      `⏱️ Est. Processing: ${evaluation.estimatedProcessingTime}`,
      [
        { text: 'View Recommendations', onPress: () => showRecommendations(evaluation) },
        { text: 'OK' }
      ]
    );
  };

  const showRecommendations = (evaluation: any) => {
    Alert.alert(
      'AI Recommendations',
      `💡 Recommendations for Improvement:\n${evaluation.recommendations.map((r: string) => `• ${r}`).join('\n')}\n\n` +
      (evaluation.requiredDocuments.length > 0 ? 
        `📋 Additional Documents Needed:\n${evaluation.requiredDocuments.map((d: string) => `• ${d}`).join('\n')}` : 
        '✅ All required documents are present'),
      [{ text: 'OK' }]
    );
  };

  const removeDocument = (documentId: string) => {
    Alert.alert(
      'Remove Document',
      'Are you sure you want to remove this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => {
          setUploadedDocuments(prev => prev.filter(doc => doc.id !== documentId));
        }}
      ]
    );
  };

  const isFormValid = () => {
    return companyName.trim() && 
           businessType.trim() && 
           projectDescription.trim() && 
           fundingAmount.trim() && 
           contactName.trim() && 
           contactEmail.trim() && 
           contactPhone.trim();
  };
  
  // Handle form submission with API integration
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const applicationData = {
        companyName: companyName.trim(),
        businessType: businessType.trim(),
        projectDescription: projectDescription.trim(),
        fundingAmount: fundingAmount.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim()
      };

      console.log('Submitting subsidy application:', {
        companyName: applicationData.companyName,
        businessType: applicationData.businessType,
        fundingAmount: applicationData.fundingAmount,
        contactEmail: applicationData.contactEmail,
        projectDescriptionLength: applicationData.projectDescription.length,
        documentsCount: uploadedDocuments.length
      });

      const response = await subsidyService.submitApplication(applicationData);

      if (response.success) {
        Alert.alert(
          'Application Submitted Successfully!',
          `Your subsidy application has been submitted and is now under review.\n\n` +
          `Application Details:\n` +
          `• Company: ${applicationData.companyName}\n` +
          `• Business Type: ${applicationData.businessType}\n` +
          `• Funding Amount: ${applicationData.fundingAmount}\n` +
          `• Documents: ${uploadedDocuments.length} file(s) uploaded\n` +
          `• Application ID: ${response.application?.applicationNumber || 'Generated'}\n\n` +
          `You will receive updates on your application status via email.`,
          [
            {
              text: 'View Status',
              onPress: () => navigation.navigate('ApplicationStatus')
            }
          ]
        );
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error('Subsidy submission error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add confirmation dialog before submission
  const confirmAndSubmit = () => {
    if (!isFormValid()) {
      setError('Please fill in all required fields before submitting.');
      return;
    }

    Alert.alert(
      'Confirm Application Submission',
      `Please review your application details:\n\n` +
      `Company: ${companyName}\n` +
      `Business Type: ${businessType}\n` +
      `Funding Amount: ${fundingAmount}\n` +
      `Documents: ${uploadedDocuments.length} file(s) uploaded\n` +
      `Contact: ${contactName} (${contactEmail})\n\n` +
      `Once submitted, your application will be processed and you cannot make changes.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Submit Application',
          onPress: handleSubmit
        }
      ]
    );
  };
  
  // Check API connection on component mount
  useEffect(() => {
    const checkApiConnection = async () => {
      const isConnected = await subsidyService.checkConnection();
      if (!isConnected) {
        setError('Unable to connect to subsidy service. Please check your internet connection.');
      }
    };

    checkApiConnection();
  }, []);

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
              
              {/* Error Message */}
              {error ? (
                <View style={{
                  backgroundColor: '#fef2f2',
                  borderWidth: 1,
                  borderColor: '#fecaca',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  marginBottom: 20
                }}>
                  <Text style={{
                    color: '#dc2626',
                    fontSize: 14,
                    fontWeight: '500'
                  }}>
                    {error}
                  </Text>
                </View>
              ) : null}
              
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

          {/* Document Upload Section */}
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
                  Proof
                </Text>
              </View>
              
              {/* Upload Documents Button */}
              <Pressable
                onPress={handleDocumentUpload}
                style={{
                  backgroundColor: '#f0f9ff',
                  borderWidth: 2,
                  borderColor: '#38a3a5',
                  borderStyle: 'dashed',
                  borderRadius: 12,
                  padding: 24,
                  alignItems: 'center',
                  marginBottom: uploadedDocuments.length > 0 ? 20 : 0
                }}
              >
                <Upload size={32} color="#38a3a5" />
                <Text style={{
                  fontSize: 16,
                  color: '#38a3a5',
                  fontWeight: '600',
                  marginTop: 8,
                  textAlign: 'center'
                }}>
                  Upload Supporting Documents
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginTop: 4,
                  textAlign: 'center'
                }}>
                  Business license, financial statements, project proposals
                </Text>
              </Pressable>

              {/* Uploaded Documents List */}
              {uploadedDocuments.length > 0 && (
                <View>
                  <Text style={{
                    fontSize: 16,
                    color: '#065f46',
                    fontWeight: '500',
                    marginBottom: 12
                  }}>
                    Uploaded Documents ({uploadedDocuments.length})
                  </Text>
                  {uploadedDocuments.map((document) => (
                    <View
                      key={document.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#f9fafb',
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 8,
                        borderWidth: 1,
                        borderColor: '#e5e7eb'
                      }}
                    >
                      <FileText size={20} color="#38a3a5" />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={{
                          fontSize: 14,
                          color: '#065f46',
                          fontWeight: '500'
                        }}>
                          {document.name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                          <Text style={{
                            fontSize: 12,
                            color: '#6b7280'
                          }}>
                            {document.type} • {document.size}
                          </Text>
                          {document.analysisResult && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                              <Text style={{
                                fontSize: 12,
                                color: document.analysisResult.validity === 'valid' ? '#10b981' : 
                                      document.analysisResult.validity === 'needs_review' ? '#f59e0b' : '#ef4444',
                                fontWeight: '600'
                              }}>
                                • Score: {Math.round(document.analysisResult.analysisScore / 10 * 10) / 10}/10
                              </Text>
                              <Text style={{
                                fontSize: 11,
                                color: document.analysisResult.findings.authenticity >= 85 ? '#10b981' : 
                                      document.analysisResult.findings.authenticity >= 70 ? '#f59e0b' : '#ef4444',
                                fontWeight: '500',
                                marginLeft: 6
                              }}>
                                🔐 {document.analysisResult.findings.authenticity}%
                              </Text>
                            </View>
                          )}
                          {document.isAnalyzing && (
                            <Text style={{
                              fontSize: 12,
                              color: '#3b82f6',
                              fontWeight: '600',
                              marginLeft: 8
                            }}>
                              • Analyzing...
                            </Text>
                          )}
                        </View>
                      </View>
                      <Pressable
                        onPress={() => removeDocument(document.id)}
                        style={{
                          padding: 4,
                          borderRadius: 4
                        }}
                      >
                        <X size={18} color="#ef4444" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              {/* AI Project Evaluation Button */}
              {(companyName.trim() && businessType.trim() && projectDescription.trim() && fundingAmount.trim()) && (
                <View style={{ marginTop: 20 }}>
                  <Pressable
                    onPress={evaluateProject}
                    disabled={isEvaluating}
                    style={{
                      backgroundColor: isEvaluating ? '#9ca3af' : '#3b82f6',
                      borderRadius: 12,
                      padding: 16,
                      alignItems: 'center',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {isEvaluating && (
                        <ActivityIndicator 
                          size="small" 
                          color="#ffffff" 
                          style={{ marginRight: 8 }} 
                        />
                      )}
                      <Text style={{
                        color: '#ffffff',
                        fontSize: 16,
                        fontWeight: '600'
                      }}>
                        {isEvaluating ? 'AI Analyzing Project...' : '🤖 Get AI Project Evaluation'}
                      </Text>
                    </View>
                    <Text style={{
                      color: '#e5e7eb',
                      fontSize: 12,
                      marginTop: 4,
                      textAlign: 'center'
                    }}>
                      Get detailed scores and feedback (1-10 scale)
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Project Evaluation Results Display */}
              {projectEvaluation && (
                <View style={{
                  marginTop: 20,
                  backgroundColor: '#f0f9ff',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: '#3b82f6'
                }}>
                  <Text style={{
                    fontSize: 16,
                    color: '#1e40af',
                    fontWeight: '600',
                    marginBottom: 12,
                    textAlign: 'center'
                  }}>
                    🤖 AI Evaluation Results
                  </Text>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, color: '#374151', fontWeight: '500' }}>Overall Score:</Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: projectEvaluation.overallScore >= 70 ? '#10b981' : 
                            projectEvaluation.overallScore >= 50 ? '#f59e0b' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {Math.round(projectEvaluation.overallScore / 10 * 10) / 10}/10
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, color: '#374151', fontWeight: '500' }}>Eligibility:</Text>
                    <Text style={{ 
                      fontSize: 14, 
                      color: projectEvaluation.eligibility === 'eligible' ? '#10b981' : 
                            projectEvaluation.eligibility === 'conditional' ? '#f59e0b' : '#ef4444',
                      fontWeight: '600'
                    }}>
                      {projectEvaluation.eligibility.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  
                  <Pressable
                    onPress={() => showProjectEvaluationResults(projectEvaluation)}
                    style={{
                      backgroundColor: '#3b82f6',
                      borderRadius: 8,
                      padding: 12,
                      alignItems: 'center',
                      marginTop: 8
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '600' }}>
                      View Detailed Analysis
                    </Text>
                  </Pressable>
                </View>
              )}
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
            onPress={confirmAndSubmit}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {isSubmitting && (
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
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubmitSubsidyScreen;
