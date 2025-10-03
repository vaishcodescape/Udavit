import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArrowLeft, Building2, Circle, FileText, Mail, Phone, Upload, User, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Modal, Pressable, SafeAreaView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { RootStackParamList } from '../App';
import { DocumentAnalysisResult, llmService } from '../services/llmService';
import { subsidyService } from '../services/subsidyService';
import { Button } from '../src/components/ui/button';
import { Card, CardContent } from '../src/components/ui/card';
import { Input } from '../src/components/ui/input';
import { Text as UIText } from '../src/components/ui/text';


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
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-green-50">
        {/* Header */}
        <Animated.View
          className="flex-row items-center px-5 pt-5 pb-5"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          <Pressable
            onPress={() => navigation.navigate('LoginSignup')}
            className="mr-5"
          >
            <ArrowLeft size={24} className="text-teal-700" />
          </Pressable>

          <UIText className="text-xl font-semibold text-primary">
            Apply for Government Subsidy
          </UIText>
        </Animated.View>

        {/* Form Content */}
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
        >
          {/* Company Information Section */}
          <Animated.View
            className="mb-5"
            style={{
              opacity: staggerAnim,
              transform: [{ translateY: staggerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }}
          >
            <Card className="bg-white border-0 shadow-lg">
              <CardContent className="p-5">
                <View className="flex-row items-center mb-4">
                  <Building2 size={20} className="text-teal-700 mr-2" />
                  <UIText className="text-lg font-semibold text-primary">
                    Company Information
                  </UIText>
                </View>
              
                {/* Error Message */}
                {error ? (
                  <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5">
                    <UIText className="text-red-600 text-sm font-medium">
                      {error}
                    </UIText>
                  </View>
                ) : null}

                {/* Company Name */}
                <View className="mb-5">
                  <UIText className="text-base font-medium text-primary mb-2">
                    Company Name *
                  </UIText>
                  <Input
                    placeholder="Enter your company name"
                    value={companyName}
                    onChangeText={setCompanyName}
                    className={`h-12 ${companyName ? 'border-teal-500' : 'border-gray-200'}`}
                  />
                </View>

                {/* Business Type */}
                <View className="mb-6">
                  <UIText className="text-base font-medium text-primary mb-2">
                    Business Type *
                  </UIText>
                  <Pressable
                    className={`h-12 bg-gray-50 rounded-lg border-2 justify-between items-center px-4 ${businessType ? 'border-teal-500' : 'border-gray-200'}`}
                    onPress={() => setBusinessTypeDropdownOpen(true)}
                  >
                    <UIText className={`text-base ${businessType ? 'text-primary font-medium' : 'text-gray-500'}`}>
                      {businessType || 'Select business type'}
                    </UIText>
                    <UIText className={`text-lg font-bold ${businessType ? 'text-green-600' : 'text-gray-500'}`}>
                      ▼
                    </UIText>
                  </Pressable>
                </View>
                
                  {/* Business Type Modal Dropdown */}
                  <Modal
                    visible={businessTypeDropdownOpen}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setBusinessTypeDropdownOpen(false)}
                  >
                    <TouchableWithoutFeedback onPress={() => setBusinessTypeDropdownOpen(false)}>
                      <View className="flex-1 bg-black/30 justify-center items-center p-5">
                        <TouchableWithoutFeedback>
                          <View className="w-full max-w-sm bg-white rounded-xl shadow-2xl max-h-96">
                            {/* Header */}
                            <View className="px-5 py-4 border-b border-gray-200">
                              <UIText className="text-lg font-semibold text-primary mb-2">
                                Select Business Type
                              </UIText>
                              <Input
                                placeholder="Search business types..."
                                value={businessTypeSearch}
                                onChangeText={setBusinessTypeSearch}
                                className="h-9 text-sm"
                              />
                            </View>
                          
                            <ScrollView
                              className="max-h-72"
                              showsVerticalScrollIndicator={true}
                              keyboardShouldPersistTaps="handled"
                            >
                              {filteredBusinessTypeOptions.length === 0 ? (
                                <View className="py-10 items-center">
                                  <UIText className="text-gray-400 text-sm italic">
                                    No business types found matching "{businessTypeSearch}"
                                  </UIText>
                                </View>
                              ) : (
                                filteredBusinessTypeOptions.map((option) => (
                                  <Pressable
                                    key={option.value}
                                    className={`py-4 px-5 ${businessType === option.value ? 'bg-blue-50' : 'active:bg-gray-50'} border-b border-gray-100`}
                                    onPress={() => {
                                      setBusinessType(option.value);
                                      setBusinessTypeDropdownOpen(false);
                                      setBusinessTypeSearch('');
                                    }}
                                  >
                                    <UIText className={`text-base ${businessType === option.value ? 'text-blue-700 font-semibold' : 'text-gray-700'}`}>
                                      {option.label}
                                    </UIText>
                                    {businessType === option.value && (
                                      <UIText className="text-blue-600 text-xs mt-1">
                                        ✓ Selected
                                      </UIText>
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
                </CardContent>
              </Card>
            </Animated.View>

            {/* Project Details Section */}
            <Animated.View
              className="mb-5"
              style={{
                opacity: staggerAnim,
                transform: [{ translateY: staggerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <View className="flex-row items-center mb-4">
                    <FileText size={20} className="text-teal-700 mr-2" />
                    <UIText className="text-lg font-semibold text-primary">
                      Project Details
                    </UIText>
                  </View>

                  {/* Project Description */}
                  <View className="mb-5">
                    <UIText className="text-base font-medium text-primary mb-2">
                      Project Description *
                    </UIText>
                    <Input
                      placeholder="Describe your hydrogen/chemical industry project in detail..."
                      value={projectDescription}
                      onChangeText={setProjectDescription}
                      multiline
                      numberOfLines={5}
                      className={`min-h-24 ${projectDescription ? 'border-teal-500' : 'border-gray-200'}`}
                      textAlignVertical="top"
                    />
                  </View>

                  {/* Funding Amount */}
                  <View className="mb-5">
                    <UIText className="text-base font-medium text-primary mb-2">
                      Requested Funding Amount *
                    </UIText>
                    <View className="flex-row items-center">
                      <Circle size={20} className="text-teal-700 mr-2" />
                      <Input
                        placeholder="Enter amount in ETH"
                        value={fundingAmount}
                        onChangeText={setFundingAmount}
                        keyboardType="numeric"
                        className={`flex-1 h-12 ${fundingAmount ? 'border-teal-500' : 'border-gray-200'}`}
                      />
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>

            {/* Document Upload Section */}
            <Animated.View
              className="mb-5"
              style={{
                opacity: staggerAnim,
                transform: [{ translateY: staggerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <View className="flex-row items-center mb-4">
                    <FileText size={20} className="text-teal-700 mr-2" />
                    <UIText className="text-lg font-semibold text-primary">
                      Supporting Documents
                    </UIText>
                  </View>
              
                  {/* Upload Documents Button */}
                  <Pressable
                    onPress={handleDocumentUpload}
                    className={`border-2 border-dashed border-teal-500 rounded-xl p-6 items-center ${uploadedDocuments.length > 0 ? 'mb-5' : 'mb-0'}`}
                  >
                    <Upload size={32} className="text-teal-500" />
                    <UIText className="text-base font-semibold text-teal-500 mt-2 text-center">
                      Upload Supporting Documents
                    </UIText>
                    <UIText className="text-sm text-gray-600 mt-1 text-center">
                      Business license, financial statements, project proposals
                    </UIText>
                  </Pressable>

                  {/* Uploaded Documents List */}
                  {uploadedDocuments.length > 0 && (
                    <View>
                      <UIText className="text-base font-medium text-primary mb-3">
                        Uploaded Documents ({uploadedDocuments.length})
                      </UIText>
                      {uploadedDocuments.map((document) => (
                        <View
                          key={document.id}
                          className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200"
                        >
                          <FileText size={20} className="text-teal-500" />
                          <View className="flex-1 ml-3">
                            <UIText className="text-sm font-medium text-primary">
                              {document.name}
                            </UIText>
                            <View className="flex-row items-center mt-0.5">
                              <UIText className="text-xs text-gray-600">
                                {document.type} • {document.size}
                              </UIText>
                              {document.analysisResult && (
                                <View className="flex-row items-center ml-2">
                                  <UIText className={`text-xs font-semibold ${
                                    document.analysisResult.validity === 'valid' ? 'text-green-600' :
                                    document.analysisResult.validity === 'needs_review' ? 'text-amber-600' : 'text-red-600'
                                  }`}>
                                    • Score: {Math.round(document.analysisResult.analysisScore / 10 * 10) / 10}/10
                                  </UIText>
                                  <UIText className={`text-xs font-medium ml-1 ${
                                    document.analysisResult.findings.authenticity >= 85 ? 'text-green-600' :
                                    document.analysisResult.findings.authenticity >= 70 ? 'text-amber-600' : 'text-red-600'
                                  }`}>
                                    🔐 {document.analysisResult.findings.authenticity}%
                                  </UIText>
                                </View>
                              )}
                              {document.isAnalyzing && (
                                <UIText className="text-xs font-semibold text-blue-600 ml-2">
                                  • Analyzing...
                                </UIText>
                              )}
                            </View>
                          </View>
                          <Pressable
                            onPress={() => removeDocument(document.id)}
                            className="p-1 rounded"
                          >
                            <X size={18} className="text-red-500" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* AI Project Evaluation Button */}
                  {(companyName.trim() && businessType.trim() && projectDescription.trim() && fundingAmount.trim()) && (
                    <View className="mt-5">
                      <Button
                        onPress={evaluateProject}
                        disabled={isEvaluating}
                        className={`rounded-xl p-4 items-center ${isEvaluating ? 'bg-gray-400' : 'bg-blue-600'} shadow-lg`}
                      >
                        <View className="flex-row items-center">
                          {isEvaluating && (
                            <ActivityIndicator
                              size="small"
                              className="text-white mr-2"
                            />
                          )}
                          <UIText className="text-white text-base font-semibold">
                            {isEvaluating ? 'AI Analyzing Project...' : '🤖 Get AI Project Evaluation'}
                          </UIText>
                        </View>
                        <UIText className="text-gray-200 text-xs mt-1 text-center">
                          Get detailed scores and feedback (1-10 scale)
                        </UIText>
                      </Button>
                    </View>
                  )}

                  {/* Project Evaluation Results Display */}
                  {projectEvaluation && (
                    <View className="mt-5 bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <UIText className="text-base font-semibold text-blue-800 mb-3 text-center">
                        🤖 AI Evaluation Results
                      </UIText>

                      <View className="flex-row justify-between mb-2">
                        <UIText className="text-sm font-medium text-gray-700">Overall Score:</UIText>
                        <UIText className={`text-sm font-semibold ${
                          projectEvaluation.overallScore >= 70 ? 'text-green-600' :
                          projectEvaluation.overallScore >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {Math.round(projectEvaluation.overallScore / 10 * 10) / 10}/10
                        </UIText>
                      </View>

                      <View className="flex-row justify-between mb-2">
                        <UIText className="text-sm font-medium text-gray-700">Eligibility:</UIText>
                        <UIText className={`text-sm font-semibold ${
                          projectEvaluation.eligibility === 'eligible' ? 'text-green-600' :
                          projectEvaluation.eligibility === 'conditional' ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {projectEvaluation.eligibility.replace('_', ' ').toUpperCase()}
                        </UIText>
                      </View>

                      <Button
                        onPress={() => showProjectEvaluationResults(projectEvaluation)}
                        className="bg-blue-600 mt-2"
                      >
                        <UIText className="text-white font-medium">
                          View Detailed Analysis
                        </UIText>
                      </Button>
                    </View>
                  )}
                </CardContent>
              </Card>
            </Animated.View>

            {/* Contact Information Section */}
            <Animated.View
              className="mb-24"
              style={{
                opacity: staggerAnim,
                transform: [{ translateY: staggerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })}]
              }}
            >
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-5">
                  <View className="flex-row items-center mb-4">
                    <User size={20} className="text-teal-700 mr-2" />
                    <UIText className="text-lg font-semibold text-primary">
                      Contact Information
                    </UIText>
                  </View>

                  {/* Contact Name */}
                  <View className="mb-5">
                    <UIText className="text-base font-medium text-primary mb-2">
                      Contact Person Name *
                    </UIText>
                    <Input
                      placeholder="Enter contact person name"
                      value={contactName}
                      onChangeText={setContactName}
                      className={`h-12 ${contactName ? 'border-teal-500' : 'border-gray-200'}`}
                    />
                  </View>

                  {/* Contact Email */}
                  <View className="mb-5">
                    <UIText className="text-base font-medium text-primary mb-2">
                      Email Address *
                    </UIText>
                    <View className="flex-row items-center">
                      <Mail size={20} className="text-teal-700 mr-2" />
                      <Input
                        placeholder="Enter email address"
                        value={contactEmail}
                        onChangeText={setContactEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className={`flex-1 h-12 ${contactEmail ? 'border-teal-500' : 'border-gray-200'}`}
                      />
                    </View>
                  </View>

                  {/* Contact Phone */}
                  <View className="mb-5">
                    <UIText className="text-base font-medium text-primary mb-2">
                      Phone Number *
                    </UIText>
                    <View className="flex-row items-center">
                      <Phone size={20} className="text-teal-700 mr-2" />
                      <Input
                        placeholder="Enter phone number"
                        value={contactPhone}
                        onChangeText={setContactPhone}
                        keyboardType="phone-pad"
                        className={`flex-1 h-12 ${contactPhone ? 'border-teal-500' : 'border-gray-200'}`}
                      />
                    </View>
                  </View>
                </CardContent>
              </Card>
            </Animated.View>
        </ScrollView>

          {/* Submit Button */}
          <View className="absolute bottom-10 left-5 right-5">
            <Button
              onPress={confirmAndSubmit}
              disabled={!isFormValid() || isSubmitting}
              className={`h-14 rounded-xl shadow-lg ${isFormValid() ? 'bg-teal-600' : 'bg-slate-400'}`}
            >
              <View className="flex-row items-center justify-center">
                {isSubmitting && (
                  <ActivityIndicator
                    size="small"
                    className="text-white mr-2"
                  />
                )}
                <UIText className="text-white text-lg font-semibold">
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </UIText>
              </View>
            </Button>
          </View>
      </View>
    </SafeAreaView>
  );
};

export default SubmitSubsidyScreen;
