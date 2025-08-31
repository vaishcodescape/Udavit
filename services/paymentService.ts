// Payment service for handling various payment methods
const API_BASE_URL = 'https://smartcontract-backend.onrender.com';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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
    return this.makeRequest<PaymentMethod[]>('/api/payments/methods', 'GET');
  }

  // Get user's bank accounts
  async getBankAccounts(userId?: string): Promise<ApiResponse<BankAccount[]>> {
    return this.makeRequest<BankAccount[]>(`/api/payments/bank-accounts/${userId || 'me'}`, 'GET');
  }

  // Add new bank account
  async addBankAccount(accountData: Omit<BankAccount, 'id' | 'isDefault'>): Promise<ApiResponse<BankAccount>> {
    return this.makeRequest<BankAccount>('/api/payments/bank-accounts', 'POST', accountData);
  }

  // Set default bank account
  async setDefaultBankAccount(accountId: string): Promise<ApiResponse<BankAccount>> {
    return this.makeRequest<BankAccount>(`/api/payments/bank-accounts/${accountId}/default`, 'PUT');
  }

  // Process payment
  async processPayment(paymentRequest: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.makeRequest<PaymentResponse>('/api/payments/process', 'POST', paymentRequest);
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<ApiResponse<PaymentResponse>> {
    return this.makeRequest<PaymentResponse>(`/api/payments/status/${paymentId}`, 'GET');
  }

  // Get payment history
  async getPaymentHistory(userId?: string, limit?: number): Promise<ApiResponse<PaymentHistory[]>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/api/payments/history/${userId || 'me'}${queryString ? '?' + queryString : ''}`;
    
    return this.makeRequest<PaymentHistory[]>(endpoint, 'GET');
  }

  // Cancel pending payment
  async cancelPayment(paymentId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest<{ success: boolean }>(`/api/payments/${paymentId}/cancel`, 'PUT');
  }

  // Get payment fees and limits
  async getPaymentFees(paymentMethod: string, amount: string, currency: string): Promise<ApiResponse<{
    fee: string;
    feePercentage: number;
    minAmount: string;
    maxAmount: string;
    estimatedTotal: string;
  }>> {
    return this.makeRequest('/api/payments/fees', 'POST', {
      paymentMethod,
      amount,
      currency
    });
  }

  // Health check for payment service
  async checkConnection(): Promise<boolean> {
    try {
      console.log('Checking payment service connection...');
      const response = await this.makeRequestWithTimeout('/api/payments/health', 'GET', undefined, 10000);
      const isConnected = response.ok;
      console.log(`Payment service connection check: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('Payment service connection check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

export const paymentService = new PaymentService();
