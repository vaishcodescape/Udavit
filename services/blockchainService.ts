// Blockchain service for handling ETH withdrawals and smart contract interactions
import { BLOCKCHAIN_API_BASE_URL, buildApiUrl } from './apiConfig';
const API_BASE_URL = BLOCKCHAIN_API_BASE_URL;
const FALLBACK_API_URL = 'http://localhost:8000';
const REQUEST_TIMEOUT = 45000; // 45 seconds for blockchain operations
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const USE_MOCK_DATA = true; // Set to false when backend is available

// Blockchain-related interfaces
export interface EthWallet {
  address: string;
  balance: string; // ETH amount as string
  network: 'mainnet' | 'testnet' | 'sepolia';
}

export interface WithdrawalRequest {
  milestoneId: string;
  walletAddress: string;
  amount: string; // ETH amount to withdraw
  gasLimit?: string;
  gasPrice?: string;
}

export interface WithdrawalResponse {
  success: boolean;
  transactionHash?: string;
  blockNumber?: number;
  gasUsed?: string;
  effectiveGasPrice?: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  amount: string;
  recipientAddress: string;
  error?: string;
}

export interface WithdrawalHistory {
  id: string;
  milestoneId: string;
  milestoneTitle: string;
  transactionHash: string;
  amount: string;
  recipientAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  blockNumber?: number;
  gasUsed?: string;
  networkFee?: string;
  confirmations: number;
}

export interface SmartContractInfo {
  contractAddress: string;
  network: string;
  totalAllocated: string;
  totalWithdrawn: string;
  availableBalance: string;
  contractVersion: string;
}

export interface MilestoneReward {
  milestoneId: string;
  milestoneTitle: string;
  rewardAmount: string; // ETH amount available for withdrawal
  isEligible: boolean;
  isWithdrawn: boolean;
  withdrawalDeadline?: string;
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class BlockchainService {
  // Mock data for development
  private mockWallet: EthWallet = {
    address: '0x742d35Cc6634C0532925a3b8D5c5C0C5b5C5C5C5',
    balance: '2.5',
    network: 'sepolia'
  };

  private mockWithdrawals: WithdrawalHistory[] = [
    {
      id: 'w1',
      milestoneId: 'm1',
      milestoneTitle: 'Initial Prototype Development',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      amount: '0.5',
      recipientAddress: '0x742d35Cc6634C0532925a3b8D5c5C0C5b5C5C5C5',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      blockNumber: 18500000,
      gasUsed: '21000',
      networkFee: '0.001',
      confirmations: 12
    },
    {
      id: 'w2',
      milestoneId: 'm2',
      milestoneTitle: 'Market Research Completion',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      amount: '0.8',
      recipientAddress: '0x742d35Cc6634C0532925a3b8D5c5C0C5b5C5C5C5',
      status: 'confirmed',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      blockNumber: 18499500,
      gasUsed: '21000',
      networkFee: '0.0012',
      confirmations: 24
    }
  ];

  private mockContractInfo: SmartContractInfo = {
    contractAddress: '0x1234567890123456789012345678901234567890',
    network: 'sepolia',
    totalAllocated: '10.0',
    totalWithdrawn: '1.3',
    availableBalance: '8.7',
    contractVersion: '1.2.0'
  };

  private mockMilestoneRewards: MilestoneReward[] = [
    {
      milestoneId: 'm3',
      milestoneTitle: 'Beta Testing Phase',
      rewardAmount: '1.2',
      isEligible: true,
      isWithdrawn: false,
      withdrawalDeadline: new Date(Date.now() + 2592000000).toISOString() // 30 days from now
    },
    {
      milestoneId: 'm4',
      milestoneTitle: 'Production Scaling',
      rewardAmount: '2.0',
      isEligible: false,
      isWithdrawn: false
    }
  ];

  // Simulate network delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Mock withdrawal processing
  private async mockProcessWithdrawal(request: WithdrawalRequest): Promise<WithdrawalResponse> {
    await this.delay(3000); // Simulate blockchain processing time
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const transactionHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      
      // Add to mock withdrawal history
      const newWithdrawal: WithdrawalHistory = {
        id: 'w' + (this.mockWithdrawals.length + 1),
        milestoneId: request.milestoneId,
        milestoneTitle: 'Milestone Completion Reward',
        transactionHash,
        amount: request.amount,
        recipientAddress: request.walletAddress,
        status: 'pending',
        timestamp: new Date().toISOString(),
        gasUsed: '21000',
        networkFee: '0.001',
        confirmations: 0
      };
      
      this.mockWithdrawals.unshift(newWithdrawal);
      
      // Update milestone reward status
      const reward = this.mockMilestoneRewards.find(r => r.milestoneId === request.milestoneId);
      if (reward) {
        reward.isWithdrawn = true;
      }
      
      return {
        success: true,
        transactionHash,
        blockNumber: 18500100,
        gasUsed: '21000',
        effectiveGasPrice: '20000000000',
        status: 'pending',
        timestamp: new Date().toISOString(),
        amount: request.amount,
        recipientAddress: request.walletAddress
      };
    } else {
      return {
        success: false,
        status: 'failed',
        timestamp: new Date().toISOString(),
        amount: request.amount,
        recipientAddress: request.walletAddress,
        error: 'Insufficient gas or network congestion'
      };
    }
  }

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
      const response = await fetch(buildApiUrl(API_BASE_URL, endpoint), {
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
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for ${method} ${endpoint}`);
      await this.delay(1500); // Simulate network delay for blockchain operations
      return { success: true, message: 'Success (mock blockchain)' };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Blockchain API attempt ${attempt}/${MAX_RETRIES} for ${method} ${endpoint}`);
        const response = await this.makeRequestWithTimeout(endpoint, method, data);
        
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          console.error('Failed to parse blockchain API response:', parseError);
          result = { success: false, message: 'Invalid response format', error: 'Parse error' };
        }

        if (response.ok) {
          console.log(`Blockchain API success for ${method} ${endpoint}`);
          return result;
        } else {
          const errorMessage = result.message || result.error || `HTTP ${response.status}`;
          console.error(`Blockchain API error ${response.status} for ${method} ${endpoint}:`, errorMessage);
          return { success: false, message: errorMessage, error: result.error };
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Blockchain API attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < MAX_RETRIES) {
          console.log(`Retrying in ${RETRY_DELAY}ms...`);
          await this.delay(RETRY_DELAY);
        }
      }
    }

    console.error('All blockchain API attempts failed');
    return {
      success: false,
      message: lastError?.message || 'Network error',
      error: 'Max retries exceeded'
    };
  }

  // API Methods

  // Get user's ETH wallet information
  async getWalletInfo(userId?: string): Promise<ApiResponse<EthWallet>> {
    if (USE_MOCK_DATA) {
      await this.delay(1000);
      return {
        success: true,
        message: 'Wallet information retrieved successfully',
        data: this.mockWallet
      };
    }

    return this.makeRequest<EthWallet>(`/api/blockchain/wallet/${userId || 'me'}`, 'GET');
  }

  // Get available milestone rewards for withdrawal
  async getMilestoneRewards(userId?: string): Promise<ApiResponse<MilestoneReward[]>> {
    if (USE_MOCK_DATA) {
      await this.delay(800);
      return {
        success: true,
        message: 'Milestone rewards retrieved successfully',
        data: this.mockMilestoneRewards
      };
    }

    return this.makeRequest<MilestoneReward[]>(`/api/blockchain/rewards/${userId || 'me'}`, 'GET');
  }

  // Process ETH withdrawal for a completed milestone
  async withdrawEth(request: WithdrawalRequest): Promise<ApiResponse<WithdrawalResponse>> {
    if (USE_MOCK_DATA) {
      const result = await this.mockProcessWithdrawal(request);
      return {
        success: result.success,
        message: result.success ? 'Withdrawal initiated successfully' : 'Withdrawal failed',
        data: result,
        error: result.error
      };
    }

    return this.makeRequest<WithdrawalResponse>('/api/blockchain/withdraw', 'POST', request);
  }

  // Get withdrawal history
  async getWithdrawalHistory(userId?: string, limit?: number): Promise<ApiResponse<WithdrawalHistory[]>> {
    if (USE_MOCK_DATA) {
      await this.delay(900);
      const data = limit ? this.mockWithdrawals.slice(0, limit) : this.mockWithdrawals;
      return {
        success: true,
        message: 'Withdrawal history retrieved successfully',
        data
      };
    }

    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const endpoint = `/api/blockchain/withdrawals/${userId || 'me'}${queryString ? '?' + queryString : ''}`;
    
    return this.makeRequest<WithdrawalHistory[]>(endpoint, 'GET');
  }

  // Get transaction status by hash
  async getTransactionStatus(transactionHash: string): Promise<ApiResponse<WithdrawalHistory>> {
    if (USE_MOCK_DATA) {
      await this.delay(1200);
      const transaction = this.mockWithdrawals.find(w => w.transactionHash === transactionHash);
      
      if (transaction) {
        // Simulate transaction confirmation over time
        if (transaction.status === 'pending' && Math.random() > 0.3) {
          transaction.status = 'confirmed';
          transaction.confirmations = Math.floor(Math.random() * 20) + 1;
          transaction.blockNumber = 18500000 + Math.floor(Math.random() * 100);
        }
        
        return {
          success: true,
          message: 'Transaction status retrieved successfully',
          data: transaction
        };
      } else {
        return {
          success: false,
          message: 'Transaction not found',
          error: 'Invalid transaction hash'
        };
      }
    }

    return this.makeRequest<WithdrawalHistory>(`/api/blockchain/transaction/${transactionHash}`, 'GET');
  }

  // Get smart contract information
  async getContractInfo(): Promise<ApiResponse<SmartContractInfo>> {
    if (USE_MOCK_DATA) {
      await this.delay(700);
      return {
        success: true,
        message: 'Smart contract information retrieved successfully',
        data: this.mockContractInfo
      };
    }

    return this.makeRequest<SmartContractInfo>('/api/blockchain/contract/info', 'GET');
  }

  // Estimate gas fees for withdrawal
  async estimateGasFees(amount: string, walletAddress: string): Promise<ApiResponse<{
    gasLimit: string;
    gasPrice: string;
    estimatedFee: string;
    estimatedTotal: string;
  }>> {
    if (USE_MOCK_DATA) {
      await this.delay(500);
      const gasLimit = '21000';
      const gasPrice = '20000000000'; // 20 Gwei
      const estimatedFee = '0.00042'; // 21000 * 20 Gwei
      const estimatedTotal = (parseFloat(amount) + parseFloat(estimatedFee)).toString();
      
      return {
        success: true,
        message: 'Gas fees estimated successfully',
        data: {
          gasLimit,
          gasPrice,
          estimatedFee,
          estimatedTotal
        }
      };
    }

    return this.makeRequest(`/api/blockchain/estimate-gas`, 'POST', { amount, walletAddress });
  }

  // Health check for blockchain service
  async checkConnection(): Promise<boolean> {
    try {
      console.log('Checking blockchain service connection...');
      const response = await this.makeRequestWithTimeout('/api/blockchain/health', 'GET', undefined, 10000);
      const isConnected = response.ok;
      console.log(`Blockchain service connection check: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('Blockchain service connection check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

export const blockchainService = new BlockchainService();
