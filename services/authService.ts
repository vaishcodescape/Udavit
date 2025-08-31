// Authentication service for handling API calls
// Note: Backend service appears to be unavailable. Using mock service for development.
const API_BASE_URL = 'https://udavit-backend.onrender.com';
const FALLBACK_API_URL = 'http://localhost:8000'; // Local development fallback
const REQUEST_TIMEOUT = 60000; // 60 seconds (increased for Render.com cold starts)
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds (increased delay)
const USE_MOCK_AUTH = true; // Set to false when backend is available

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  role: string;
  startup: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role?: string;
    startup?: string;
  };
  token?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

class AuthService {
  // Mock authentication for development when backend is unavailable
  private async mockLogin(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('Using mock authentication for development');
    
    // Simulate network delay
    await this.delay(1500);
    
    // Mock validation
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        message: 'Email and password are required'
      };
    }
    
    if (credentials.password.length < 6) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long'
      };
    }
    
    // Mock successful login
    return {
      success: true,
      message: 'Login successful (mock mode)',
      user: {
        id: 'mock-user-' + Date.now(),
        email: credentials.email,
        role: 'Chemical Engineer',
        startup: 'Hydrogen Production & Storage'
      },
      token: 'mock-token-' + Date.now()
    };
  }
  
  private async mockSignup(userData: SignupRequest): Promise<AuthResponse> {
    console.log('Using mock authentication for development');
    
    // Simulate network delay
    await this.delay(2000);
    
    // Mock validation
    const validationErrors = this.validateSignupData(userData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message
      };
    }
    
    // Mock successful signup
    return {
      success: true,
      message: 'Account created successfully (mock mode)',
      user: {
        id: 'mock-user-' + Date.now(),
        email: userData.email,
        role: userData.role,
        startup: userData.startup
      },
      token: 'mock-token-' + Date.now()
    };
  }
  private validateEmail(email: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { field: 'email', message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    return null;
  }

  private validatePassword(password: string): ValidationError | null {
    if (!password) {
      return { field: 'password', message: 'Password is required' };
    }
    if (password.length < 6) {
      return { field: 'password', message: 'Password must be at least 6 characters long' };
    }
    return null;
  }

  private validateSignupData(data: SignupRequest): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push(emailError);
    
    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.push(passwordError);
    
    // Validate role selection
    if (!data.role || data.role.trim() === '' || data.role === 'Select your role') {
      errors.push({ field: 'role', message: 'Please select your chemical industry role' });
    }
    
    // Validate startup/company selection
    if (!data.startup || data.startup.trim() === '' || data.startup === 'Select startup') {
      errors.push({ field: 'startup', message: 'Please select your hydrogen & chemical company type' });
    }
    
    // Additional validation for dropdown selections
    const validRoles = [
      'Chemical Engineer', 'Process Engineer', 'Research Scientist', 'Laboratory Technician',
      'Quality Control Specialist', 'Safety Engineer', 'Environmental Engineer', 'Production Manager',
      'Plant Operator', 'Analytical Chemist', 'Catalyst Specialist', 'Electrolysis Engineer',
      'Hydrogen Storage Expert', 'Fuel Cell Engineer', 'Chemical Plant Manager', 'R&D Director',
      'Technical Sales Representative', 'Regulatory Affairs Specialist', 'Sustainability Consultant', 'Other'
    ];
    
    const validStartups = [
      'Hydrogen Production & Storage', 'Electrolysis Technology', 'Fuel Cell Development',
      'Chemical Manufacturing', 'Green Hydrogen Solutions', 'Industrial Gas Production',
      'Catalyst Development', 'Chemical Process Optimization', 'Hydrogen Infrastructure',
      'Carbon Capture & Utilization', 'Renewable Energy Integration', 'Chemical Safety & Compliance',
      'Sustainable Chemical Processes', 'Hydrogen Transportation', 'Chemical Analytics & Testing',
      'Industrial Automation', 'Chemical Waste Management', 'Green Chemistry Solutions', 'Other'
    ];
    
    if (data.role && !validRoles.includes(data.role)) {
      errors.push({ field: 'role', message: 'Please select a valid role from the dropdown' });
    }
    
    if (data.startup && !validStartups.includes(data.startup)) {
      errors.push({ field: 'startup', message: 'Please select a valid company type from the dropdown' });
    }
    
    return errors;
  }

  private validateLoginData(data: LoginRequest): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const emailError = this.validateEmail(data.email);
    if (emailError) errors.push(emailError);
    
    const passwordError = this.validatePassword(data.password);
    if (passwordError) errors.push(passwordError);
    
    return errors;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<AuthResponse> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Auth ${method} ${endpoint} - Attempt ${attempt}/${MAX_RETRIES}`);
        
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
              throw new Error(result.message || 'Invalid request. Please check your information and try again.');
            case 401:
              throw new Error(result.message || 'Invalid email or password.');
            case 403:
              throw new Error(result.message || 'Access denied. Please contact support.');
            case 404:
              throw new Error('Backend service endpoints not found. The API may be down or the endpoints may not be deployed. Please contact support or try again later.');
            case 409:
              throw new Error(result.message || 'Email already exists. Please use a different email or try logging in.');
            case 429:
              throw new Error('Too many requests. Please wait a moment and try again.');
            case 500:
              throw new Error('Server error. Please try again later.');
            case 503:
              throw new Error('Service temporarily unavailable. Please try again later.');
            default:
              throw new Error(result.message || `Request failed with status ${response.status}`);
          }
        }

        return {
          success: true,
          message: result.message || 'Success',
          user: result.user,
          token: result.token,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('An unexpected error occurred');
        console.error(`Auth ${method} ${endpoint} error (attempt ${attempt}):`, lastError.message);

        // Don't retry for certain types of errors
        if (lastError.message.includes('Invalid email or password') ||
            lastError.message.includes('Email already exists') ||
            lastError.message.includes('Invalid request') ||
            lastError.message.includes('Access denied') ||
            lastError.message.includes('400') ||
            lastError.message.includes('401') ||
            lastError.message.includes('403') ||
            lastError.message.includes('409')) {
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
      errorMessage = 'Server is taking longer than expected to respond. This may be due to the backend service starting up. Please wait a moment and try again.';
    } else if (errorMessage.includes('AbortError')) {
      errorMessage = 'Connection was interrupted. The backend service may be starting up. Please try again in a few moments.';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Validate input data
    const validationErrors = this.validateLoginData(credentials);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message,
      };
    }

    // Use mock authentication if backend is unavailable
    if (USE_MOCK_AUTH) {
      console.log('Backend service unavailable - using mock authentication');
      return this.mockLogin(credentials);
    }

    // Wake up the backend service before attempting login (helps with Render.com cold starts)
    await this.wakeUpBackend();

    return this.makeRequest('/auth/login', 'POST', credentials);
  }

  async signup(userData: SignupRequest): Promise<AuthResponse> {
    // Validate input data
    const validationErrors = this.validateSignupData(userData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors[0].message,
      };
    }

    // Use mock authentication if backend is unavailable
    if (USE_MOCK_AUTH) {
      console.log('Backend service unavailable - using mock authentication');
      return this.mockSignup(userData);
    }

    // Wake up the backend service before attempting signup (helps with Render.com cold starts)
    await this.wakeUpBackend();

    // Log the complete user profile being sent to Firebase
    console.log('AuthService: Sending complete user profile to Firebase:', {
      email: userData.email,
      role: userData.role,
      startup: userData.startup,
      hasPassword: !!userData.password,
      timestamp: new Date().toISOString()
    });

    // Ensure all profile data is included in the request
    const completeUserData = {
      email: userData.email,
      password: userData.password,
      role: userData.role,
      startup: userData.startup,
      profile: {
        chemicalIndustryRole: userData.role,
        hydrogenChemicalCompany: userData.startup,
        createdAt: new Date().toISOString(),
        profileComplete: true
      }
    };

    return this.makeRequest('/auth/signup', 'POST', completeUserData);
  }

  // Helper method to check if the API is reachable
  async checkConnection(): Promise<boolean> {
    try {
      console.log('Checking backend connection...');
      const response = await this.makeRequestWithTimeout('/health', 'GET', undefined, 10000);
      const isConnected = response.ok;
      console.log(`Backend connection check: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('Connection check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  // Ping the backend to wake it up (useful for Render.com free tier)
  async wakeUpBackend(): Promise<void> {
    try {
      console.log('Attempting to wake up backend service...');
      await this.makeRequestWithTimeout('/health', 'GET', undefined, 15000);
      console.log('Backend wake-up attempt completed');
    } catch (error) {
      console.log('Backend wake-up failed, but continuing with auth request:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
}

export const authService = new AuthService();
