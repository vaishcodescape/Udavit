// Payment service for handling various payment methods
const API_BASE_URL = 'https://smartcontract-backend.onrender.com';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Mock data for demo purposes
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'bank_transfer',
    name: 'Bank Transfer',
    isEnabled: true,
    icon: '🏦'
  },
  {
    id: '2',
    type: 'upi',
    name: 'UPI',
    isEnabled: true,
    icon: '📱'
  },
  {
    id: '3',
    type: 'crypto',
    name: 'Cryptocurrency',
    isEnabled: true,
    icon: '₿'
  },
  {
    id: '4',
    type: 'card',
    name: 'Credit/Debit Card',
    isEnabled: true,
    icon: '💳'
  }
];

const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: '1',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    accountHolderName: 'John Doe',
    isDefault: true
  },
  {
    id: '2',
    accountNumber: '0987654321',
    ifscCode: 'HDFC0005678',
    bankName: 'HDFC Bank',
    accountHolderName: 'John Doe',
    isDefault: false
  }
];

const MOCK_PAYMENT_HISTORY: PaymentHistory[] = [
  {
    id: '1',
    amount: '5000',
    currency: 'INR',
    paymentMethod: 'Bank Transfer',
    status: 'completed',
    timestamp: '2024-01-15T10:30:00Z',
    description: 'Subsidy payment for Q4 2023',
    bankReference: 'TXN123456789'
  },
  {
    id: '2',
    amount: '3000',
    currency: 'INR',
    paymentMethod: 'UPI',
    status: 'completed',
    timestamp: '2024-01-10T14:20:00Z',
    description: 'Application fee payment',
    transactionHash: '0x1234567890abcdef'
  },
  {
    id: '3',
    amount: '7500',
    currency: 'INR',
    paymentMethod: 'Bank Transfer',
    status: 'pending',
    timestamp: '2024-01-20T09:15:00Z',
    description: 'Subsidy payment for Q1 2024',
    bankReference: 'TXN987654321'
  }
];

// Payment interfaces
export interface PaymentMethod {
  id: string;
  type: 'bank_transfer' | 'upi' | 'crypto' | 'card';
  name: string;
  isEnabled: boolean;
  icon: string;
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  accountHolderName: string;
  isDefault: boolean;
}

export interface PaymentRequest {
  amount: string;
  currency: 'INR' | 'USD' | 'ETH';
  paymentMethod: string;
  recipientAddress?: string; // For crypto payments
  bankAccountId?: string; // For bank transfers
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  transactionHash?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedCompletion?: string;
  error?: string;
}

export interface PaymentHistory {
  id: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  description: string;
  transactionHash?: string;
  bankReference?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class PaymentService {
  // HTTP request helpers
  private async makeRequestWithTimeout(
    endpoint: string,
    method: string,
    data?: any,
    timeoutMs: number = REQUEST_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms`);
      }
      throw error;
    }
  }

  private async makeRequest<T>(endpoint: string, method: string, data?: any): Promise<ApiResponse<T>> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Payment API attempt ${attempt}/${MAX_RETRIES} for ${method} ${endpoint}`);
        const response = await this.makeRequestWithTimeout(endpoint, method, data);
        
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error('Failed to parse payment API response:', parseError);
          result = { success: false, message: 'Invalid response format', error: 'Parse error' };
        }

        if (response.ok) {
          console.log(`Payment API success for ${method} ${endpoint}`);
          return result;
        } else {
          const errorMessage = result.message || result.error || `HTTP ${response.status}`;
          console.error(`Payment API error ${response.status} for ${method} ${endpoint}:`, errorMessage);
          return { success: false, message: errorMessage, error: result.error };
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Payment API attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    console.error('All payment API attempts failed');
    return {
      success: false,
      message: lastError?.message || 'Network error',
      error: 'Max retries exceeded'
    };
  }

  // Get available payment methods
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    // Return mock data for demo purposes
    return {
      success: true,
      message: 'Payment methods retrieved successfully',
      data: MOCK_PAYMENT_METHODS
    };
  }

  // Get user's bank accounts
  async getBankAccounts(userId?: string): Promise<ApiResponse<BankAccount[]>> {
    // Return mock data for demo purposes
    return {
      success: true,
      message: 'Bank accounts retrieved successfully',
      data: MOCK_BANK_ACCOUNTS
    };
  }

  // Add new bank account
  async addBankAccount(accountData: Omit<BankAccount, 'id' | 'isDefault'>): Promise<ApiResponse<BankAccount>> {
    // Mock successful addition
    const newAccount: BankAccount = {
      ...accountData,
      id: Date.now().toString(),
      isDefault: false
    };
    return {
      success: true,
      message: 'Bank account added successfully',
      data: newAccount
    };
  }

  // Set default bank account
  async setDefaultBankAccount(accountId: string): Promise<ApiResponse<BankAccount>> {
    // Mock successful update
    const updatedAccount = MOCK_BANK_ACCOUNTS.find(acc => acc.id === accountId);
    if (updatedAccount) {
      updatedAccount.isDefault = true;
      return {
        success: true,
        message: 'Default bank account updated successfully',
        data: updatedAccount
      };
    }
    return {
      success: false,
      message: 'Bank account not found',
      error: 'Account not found'
    };
  }

  // Process payment
  async processPayment(paymentRequest: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    // Mock successful payment processing
    const mockResponse: PaymentResponse = {
      success: true,
      message: 'Payment processed successfully',
      paymentId: `PAY_${Date.now()}`,
      transactionHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      status: 'processing',
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    return {
      success: true,
      message: 'Payment processed successfully',
      data: mockResponse
    };
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentResponse>> {
    // Mock payment status
    const mockResponse: PaymentResponse = {
      success: true,
      message: 'Payment status retrieved successfully',
      paymentId,
      status: 'completed',
      estimatedCompletion: new Date().toISOString()
    };
    return {
      success: true,
      message: 'Payment status retrieved successfully',
      data: mockResponse
    };
  }

  // Get payment history
  async getPaymentHistory(userId?: string, limit?: number): Promise<ApiResponse<PaymentHistory[]>> {
    // Return mock data for demo purposes
    let history = MOCK_PAYMENT_HISTORY;
    if (limit) {
      history = history.slice(0, limit);
    }
    return {
      success: true,
      message: 'Payment history retrieved successfully',
      data: history
    };
  }

  // Cancel pending payment
  async cancelPayment(paymentId: string): Promise<ApiResponse<{ success: boolean }>> {
    // Mock successful cancellation
    return {
      success: true,
      message: 'Payment cancelled successfully',
      data: { success: true }
    };
  }

  // Get payment fees and limits
  async getPaymentFees(paymentMethod: string, amount: string, currency: string): Promise<ApiResponse<{
    fee: string;
    feePercentage: number;
    minAmount: string;
    maxAmount: string;
    estimatedTotal: string;
  }>> {
    // Mock fee calculation
    const feePercentage = 0.02; // 2% fee
    const fee = (parseFloat(amount) * feePercentage).toFixed(2);
    const estimatedTotal = (parseFloat(amount) + parseFloat(fee)).toFixed(2);
    
    return {
      success: true,
      message: 'Payment fees calculated successfully',
      data: {
        fee,
        feePercentage: feePercentage * 100,
        minAmount: '100',
        maxAmount: '100000',
        estimatedTotal
      }
    };
  }

  // Health check for payment service
  async checkConnection(): Promise<boolean> {
    // Mock successful connection for demo
    console.log('Payment service connection check: SUCCESS (mock)');
    return true;
  }
}

export const paymentService = new PaymentService();
