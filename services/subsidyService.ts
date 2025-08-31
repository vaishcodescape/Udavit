// Subsidy service for handling API calls
const API_BASE_URL = 'https://smartcontract-backend.onrender.com';
const FALLBACK_API_URL = 'http://localhost:8000';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const USE_MOCK_SUBSIDY = true; // Set to false when backend is available

export interface SubsidyApplicationRequest {
  companyName: string;
  businessType: string;
  projectDescription: string;
  fundingAmount: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SubsidyApplicationResponse {
  success: boolean;
  message: string;
  application?: {
    id: string;
    applicationNumber: string;
    status: 'submitted' | 'under_review' | 'approved' | 'rejected';
    submittedAt: string;
    companyName: string;
    businessType: string;
    fundingAmount: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

class SubsidyService {
  // Mock subsidy application for development when backend is unavailable
  private async mockSubmitApplication(applicationData: SubsidyApplicationRequest): Promise<SubsidyApplicationResponse> {
    console.log('Using mock subsidy service for development');
    
    // Simulate network delay
    await this.delay(2000);
    
    // Mock validation
    const validationErrors = this.validateSubsidyApplication(applicationData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message
      };
    }
    
    // Mock successful submission
    const mockApplicationNumber = 'SUB-' + Date.now().toString().slice(-6);
    
    return {
      success: true,
      message: 'Subsidy application submitted successfully (mock mode)',
      application: {
        id: 'mock-app-' + Date.now(),
        applicationNumber: mockApplicationNumber,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        companyName: applicationData.companyName,
        businessType: applicationData.businessType,
        fundingAmount: applicationData.fundingAmount
      }
    };
  }

  private async mockGetApplicationStatus(applicationId: string): Promise<SubsidyApplicationResponse> {
    console.log('Using mock application status for development');
    
    await this.delay(1000);
    
    return {
      success: true,
      message: 'Application status retrieved successfully (mock mode)',
      application: {
        id: applicationId,
        applicationNumber: 'SUB-123456',
        status: 'under_review',
        submittedAt: '2024-01-15T10:00:00Z',
        companyName: 'GreenH2 Innovations',
        businessType: 'Hydrogen Production & Storage',
        fundingAmount: '1.5 ETH'
      }
    };
  }

  private async mockGetApplicationHistory(): Promise<SubsidyApplicationResponse> {
    console.log('Using mock application history for development');
    
    await this.delay(1200);
    
    return {
      success: true,
      message: 'Application history retrieved successfully (mock mode)'
    };
  }

  private validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { field: 'contactEmail', message: 'Contact email is required' };
    }
    if (!emailRegex.test(email)) {
      return { field: 'contactEmail', message: 'Please enter a valid email address' };
    }
    return null;
  }

  private validatePhone(phone: string): ValidationError | null {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phone) {
      return { field: 'contactPhone', message: 'Contact phone is required' };
    }
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return { field: 'contactPhone', message: 'Please enter a valid phone number' };
    }
    return null;
  }

  private validateFundingAmount(amount: string): ValidationError | null {
    if (!amount) {
      return { field: 'fundingAmount', message: 'Funding amount is required' };
    }
    const numericAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return { field: 'fundingAmount', message: 'Please enter a valid funding amount' };
    }
    if (numericAmount < 1000) {
      return { field: 'fundingAmount', message: 'Minimum funding amount is $1,000' };
    }
    if (numericAmount > 10000000) {
      return { field: 'fundingAmount', message: 'Maximum funding amount is $10,000,000' };
    }
    return null;
  }

  private validateSubsidyApplication(data: SubsidyApplicationRequest): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Validate company name
    if (!data.companyName || data.companyName.trim().length < 2) {
      errors.push({ field: 'companyName', message: 'Company name must be at least 2 characters long' });
    }
    
    // Validate business type
    const validBusinessTypes = [
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
    
    if (!data.businessType || !validBusinessTypes.includes(data.businessType)) {
      errors.push({ field: 'businessType', message: 'Please select a valid business type' });
    }
    
    // Validate project description
    if (!data.projectDescription || data.projectDescription.trim().length < 50) {
      errors.push({ field: 'projectDescription', message: 'Project description must be at least 50 characters long' });
    }
    if (data.projectDescription && data.projectDescription.length > 2000) {
      errors.push({ field: 'projectDescription', message: 'Project description must be less than 2000 characters' });
    }
    
    // Validate funding amount
    const fundingError = this.validateFundingAmount(data.fundingAmount);
    if (fundingError) errors.push(fundingError);
    
    // Validate contact name
    if (!data.contactName || data.contactName.trim().length < 2) {
      errors.push({ field: 'contactName', message: 'Contact name must be at least 2 characters long' });
    }
    
    // Validate contact email
    const emailError = this.validateEmail(data.contactEmail);
    if (emailError) errors.push(emailError);
    
    // Validate contact phone
    const phoneError = this.validatePhone(data.contactPhone);
    if (phoneError) errors.push(phoneError);
    
    return errors;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAuthToken(): string {
    // In a real app, get this from secure storage or context
    return 'mock-token-' + Date.now();
  }

  private async makeRequestWithTimeout(
    endpoint: string, 
    method: string, 
    data?: any, 
    timeout: number = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`, // Include auth token
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<SubsidyApplicationResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Subsidy ${method} ${endpoint} - Attempt ${attempt}/${MAX_RETRIES}`);
        
        const response = await this.makeRequestWithTimeout(endpoint, method, data);
        
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          throw new Error('Invalid response from server. Please try again.');
        }

        if (!response.ok) {
          // Handle specific HTTP status codes
          switch (response.status) {
            case 400:
              throw new Error(result.message || 'Invalid application data. Please check your information and try again.');
            case 401:
              throw new Error('Authentication required. Please log in and try again.');
            case 403:
              throw new Error('Access denied. You may not have permission to submit applications.');
            case 404:
              throw new Error('Subsidy service not found. Please try again later.');
            case 409:
              throw new Error(result.message || 'Application already exists or conflicts with existing data.');
            case 422:
              throw new Error(result.message || 'Application data validation failed. Please check all fields.');
            case 429:
              throw new Error('Too many applications submitted. Please wait before submitting again.');
            case 500:
              throw new Error('Server error. Please try again later.');
            case 503:
              throw new Error('Subsidy service temporarily unavailable. Please try again later.');
            default:
              throw new Error(result.message || `Request failed with status ${response.status}`);
          }
        }

        return {
          success: true,
          message: result.message || 'Application submitted successfully',
          application: result.application,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('An unexpected error occurred');
        console.error(`Subsidy ${method} ${endpoint} error (attempt ${attempt}):`, lastError.message);

        // Don't retry for certain types of errors
        if (lastError.message.includes('Invalid application data') ||
            lastError.message.includes('Authentication required') ||
            lastError.message.includes('Access denied') ||
            lastError.message.includes('validation failed')) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < MAX_RETRIES) {
          const delayTime = RETRY_DELAY * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delayTime}ms...`);
          await this.delay(delayTime);
        }
      }
    }

    // If we get here, all retries failed
    let errorMessage = lastError?.message || 'An unexpected error occurred';
    
    // Provide helpful error messages for common network issues
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('NetworkError')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      errorMessage = 'Request timed out. Please check your internet connection and try again.';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }

  async submitApplication(applicationData: SubsidyApplicationRequest): Promise<SubsidyApplicationResponse> {
    // Validate input data
    const validationErrors = this.validateSubsidyApplication(applicationData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message,
      };
    }

    // Use mock subsidy service if backend is unavailable
    if (USE_MOCK_SUBSIDY) {
      console.log('Backend service unavailable - using mock subsidy service');
      return this.mockSubmitApplication(applicationData);
    }

    // Wake up the backend service before attempting submission (helps with Render.com cold starts)
    await this.wakeUpBackend();

    // Log the complete application being sent
    console.log('SubsidyService: Sending subsidy application:', {
      companyName: applicationData.companyName,
      businessType: applicationData.businessType,
      fundingAmount: applicationData.fundingAmount,
      contactEmail: applicationData.contactEmail,
      projectDescriptionLength: applicationData.projectDescription.length,
      timestamp: new Date().toISOString()
    });

    // Prepare complete application data
    const completeApplicationData = {
      ...applicationData,
      companyName: applicationData.companyName.trim(),
      businessType: applicationData.businessType.trim(),
      projectDescription: applicationData.projectDescription.trim(),
      fundingAmount: applicationData.fundingAmount.trim(),
      contactName: applicationData.contactName.trim(),
      contactEmail: applicationData.contactEmail.trim().toLowerCase(),
      contactPhone: applicationData.contactPhone.trim(),
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      applicationMetadata: {
        platform: 'mobile_app',
        version: '1.0.0',
        submissionMethod: 'form'
      }
    };

    return this.makeRequest('/api/subsidy/submit', 'POST', completeApplicationData);
  }

  async getApplicationStatus(applicationId: string): Promise<SubsidyApplicationResponse> {
    if (USE_MOCK_SUBSIDY) {
      console.log('Backend service unavailable - using mock application status');
      return this.mockGetApplicationStatus(applicationId);
    }
    
    return this.makeRequest(`/api/subsidy/applications/${applicationId}/status`, 'GET');
  }

  async getApplicationHistory(): Promise<SubsidyApplicationResponse> {
    if (USE_MOCK_SUBSIDY) {
      console.log('Backend service unavailable - using mock application history');
      return this.mockGetApplicationHistory();
    }
    
    return this.makeRequest('/api/subsidy/applications/history', 'GET');
  }

  // Helper method to check if the subsidy API is reachable
  async checkConnection(): Promise<boolean> {
    if (USE_MOCK_SUBSIDY) {
      console.log('Using mock subsidy service - connection always available');
      return true;
    }
    
    try {
      console.log('Checking subsidy service connection...');
      const response = await this.makeRequestWithTimeout('/api/health', 'GET', undefined, 10000);
      const isConnected = response.ok;
      console.log(`Subsidy service connection check: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('Subsidy service connection check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // Ping the backend to wake it up (useful for Render.com free tier)
  async wakeUpBackend(): Promise<void> {
    if (USE_MOCK_SUBSIDY) {
      return;
    }
    
    try {
      console.log('Attempting to wake up subsidy backend service...');
      await this.makeRequestWithTimeout('/api/health', 'GET', undefined, 15000);
      console.log('Subsidy backend wake-up attempt completed');
    } catch (error) {
      console.log('Subsidy backend wake-up failed, but continuing with request:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export const subsidyService = new SubsidyService();
