// User service for handling dashboard API calls
import { BACKEND_API_BASE_URL, buildApiUrl } from './apiConfig';
const API_BASE_URL = BACKEND_API_BASE_URL;
const FALLBACK_API_URL = 'http://localhost:8000';
const REQUEST_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const USE_MOCK_DATA = true; // Set to false when backend is available

// User Profile Interfaces
export interface UserProfile {
  id: string;
  email: string;
  role: string;
  startup: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
  companyAddress?: string;
  kycStatus?: 'pending' | 'verified' | 'rejected';
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  companyName?: string;
  companyAddress?: string;
  profilePicture?: string;
}

// Dashboard Data Interfaces
export interface StartupDashboardData {
  name: string;
  founder: string;
  status: 'active' | 'inactive' | 'pending_verification';
  applications: number;
  totalFunding: string;
  milestones: number;
  completedMilestones: number;
  kycStatus: 'pending' | 'verified' | 'rejected';
  lastLoginDate: string;
  registrationDate: string;
}

export interface SubsidyApplication {
  id: string;
  title: string;
  status: 'Approved' | 'Under Review' | 'Pending' | 'Rejected';
  progress: number;
  submittedDate: string;
  amount: string;
  description: string;
  milestones: ApplicationMilestone[];
  documents: ApplicationDocument[];
}

export interface ApplicationMilestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending' | 'overdue';
  dueDate: string;
  completedDate?: string;
  progress: number;
  requirements: string[];
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  url: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// API Response Interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class UserService {
  // Mock data for development
  private mockUserProfile: UserProfile = {
    id: 'mock-user-123',
    email: 'founder@hydrogentech.com',
    role: 'Chemical Engineer',
    startup: 'Hydrogen Production & Storage',
    firstName: 'Alex',
    lastName: 'Johnson',
    phoneNumber: '+1-555-0123',
    companyName: 'GreenH2 Innovations',
    companyAddress: '123 Innovation Drive, Tech City, TC 12345',
    kycStatus: 'verified',
    profilePicture: '',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  };

  private mockStartupData: StartupDashboardData = {
    name: 'GreenH2 Innovations',
    founder: 'Alex Johnson',
    status: 'active',
    applications: 3,
    totalFunding: '2.5 ETH',
    milestones: 12,
    completedMilestones: 8,
    kycStatus: 'verified',
    lastLoginDate: new Date().toISOString(),
    registrationDate: '2024-01-15T10:00:00Z'
  };

  private mockApplications: SubsidyApplication[] = [
    {
      id: 'app-001',
      title: 'Green Hydrogen Production Facility',
      status: 'Under Review',
      progress: 65,
      submittedDate: '2024-01-10',
      amount: '1.5 ETH',
      description: 'Establishing a green hydrogen production facility using renewable energy sources.',
      milestones: [
        {
          id: 'mil-001',
          title: 'Site Preparation',
          description: 'Prepare the site for construction',
          status: 'completed',
          dueDate: '2024-02-15',
          completedDate: '2024-02-10',
          progress: 100,
          requirements: ['Environmental clearance', 'Site survey', 'Permits']
        },
        {
          id: 'mil-002',
          title: 'Equipment Installation',
          description: 'Install electrolysis equipment',
          status: 'in_progress',
          dueDate: '2024-03-15',
          progress: 45,
          requirements: ['Equipment procurement', 'Technical installation', 'Safety checks']
        }
      ],
      documents: [
        {
          id: 'doc-001',
          name: 'Environmental Impact Assessment',
          type: 'PDF',
          uploadDate: '2024-01-08',
          status: 'approved',
          url: '/documents/eia-001.pdf'
        }
      ]
    },
    {
      id: 'app-002',
      title: 'Hydrogen Storage System',
      status: 'Approved',
      progress: 85,
      submittedDate: '2023-12-05',
      amount: '0.75 ETH',
      description: 'Development of advanced hydrogen storage systems.',
      milestones: [],
      documents: []
    },
    {
      id: 'app-003',
      title: 'Fuel Cell Technology Research',
      status: 'Pending',
      progress: 25,
      submittedDate: '2024-01-20',
      amount: '0.25 ETH',
      description: 'Research and development of efficient fuel cell technologies.',
      milestones: [],
      documents: []
    }
  ];

  private mockNotifications: UserNotification[] = [
    {
      id: 'notif-001',
      title: 'Application Status Update',
      message: 'Your Green Hydrogen Production Facility application is now under review.',
      type: 'info',
      read: false,
      createdAt: '2024-01-22T10:00:00Z',
      actionUrl: '/applications/app-001',
      priority: 'medium'
    },
    {
      id: 'notif-002',
      title: 'Milestone Completed',
      message: 'Site Preparation milestone has been successfully completed!',
      type: 'success',
      read: false,
      createdAt: '2024-01-21T14:30:00Z',
      priority: 'high'
    },
    {
      id: 'notif-003',
      title: 'Document Review Required',
      message: 'Please review and upload additional documentation for your fuel cell research application.',
      type: 'warning',
      read: true,
      createdAt: '2024-01-20T09:15:00Z',
      actionUrl: '/applications/app-003',
      priority: 'high'
    }
  ];

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
      const response = await fetch(buildApiUrl(API_BASE_URL, endpoint), {
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

  private getAuthToken(): string {
    // In a real app, get this from secure storage or context
    return 'mock-token-' + Date.now();
  }

  private async makeRequest<T>(endpoint: string, method: string, data?: any): Promise<ApiResponse<T>> {
    if (USE_MOCK_DATA) {
      console.log(`Using mock data for ${method} ${endpoint}`);
      await this.delay(1000); // Simulate network delay
      return { success: true, message: 'Success (mock data)' };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`User API ${method} ${endpoint} - Attempt ${attempt}/${MAX_RETRIES}`);
        
        const response = await this.makeRequestWithTimeout(endpoint, method, data);
        
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          throw new Error('Invalid response from server. Please try again.');
        }

        if (!response.ok) {
          switch (response.status) {
            case 400:
              throw new Error(result.message || 'Invalid request data.');
            case 401:
              throw new Error('Authentication required. Please login again.');
            case 403:
              throw new Error('Access denied. Insufficient permissions.');
            case 404:
              throw new Error('Requested resource not found.');
            case 429:
              throw new Error('Too many requests. Please wait a moment and try again.');
            case 500:
              throw new Error('Server error. Please try again later.');
            default:
              throw new Error(result.message || `Request failed with status ${response.status}`);
          }
        }

        return {
          success: true,
          message: result.message || 'Success',
          data: result.data,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('An unexpected error occurred');
        console.error(`User API ${method} ${endpoint} error (attempt ${attempt}):`, lastError.message);

        // Don't retry for certain types of errors
        if (lastError.message.includes('Authentication required') ||
            lastError.message.includes('Access denied') ||
            lastError.message.includes('Invalid request')) {
          break;
        }

        // Wait before retrying
        if (attempt < MAX_RETRIES) {
          const delayTime = RETRY_DELAY * Math.pow(2, attempt - 1);
          await this.delay(delayTime);
        }
      }
    }

    return {
      success: false,
      message: lastError?.message || 'An unexpected error occurred',
      error: lastError?.message
    };
  }

  // Get user profile details
  async getUserProfile(userId?: string): Promise<ApiResponse<UserProfile>> {
    if (USE_MOCK_DATA) {
      await this.delay(800);
      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: this.mockUserProfile
      };
    }

    return this.makeRequest<UserProfile>(`/api/users/${userId || 'me'}/profile`, 'GET');
  }

  // Update user profile
  async updateUserProfile(updates: UpdateUserProfileRequest): Promise<ApiResponse<UserProfile>> {
    if (USE_MOCK_DATA) {
      await this.delay(1200);
      // Update mock data
      this.mockUserProfile = {
        ...this.mockUserProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return {
        success: true,
        message: 'Profile updated successfully',
        data: this.mockUserProfile
      };
    }

    return this.makeRequest<UserProfile>('/api/users/profile', 'PUT', updates);
  }

  // Get startup dashboard data
  async getStartupDashboardData(userId?: string): Promise<ApiResponse<StartupDashboardData>> {
    if (USE_MOCK_DATA) {
      await this.delay(1000);
      return {
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: this.mockStartupData
      };
    }

    return this.makeRequest<StartupDashboardData>(`/api/users/${userId || 'me'}/dashboard`, 'GET');
  }

  // Get user's subsidy applications
  async getApplications(userId?: string, limit?: number, offset?: number): Promise<ApiResponse<SubsidyApplication[]>> {
    if (USE_MOCK_DATA) {
      await this.delay(900);
      let applications = [...this.mockApplications];
      
      if (offset) {
        applications = applications.slice(offset);
      }
      if (limit) {
        applications = applications.slice(0, limit);
      }
      
      return {
        success: true,
        message: 'Applications retrieved successfully',
        data: applications
      };
    }

    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = `/api/users/${userId || 'me'}/applications${queryString ? '?' + queryString : ''}`;
    
    return this.makeRequest<SubsidyApplication[]>(endpoint, 'GET');
  }

  // Get specific application details
  async getApplication(applicationId: string): Promise<ApiResponse<SubsidyApplication>> {
    if (USE_MOCK_DATA) {
      await this.delay(700);
      const application = this.mockApplications.find(app => app.id === applicationId);
      if (!application) {
        return {
          success: false,
          message: 'Application not found',
          error: 'Application with specified ID does not exist'
        };
      }
      return {
        success: true,
        message: 'Application retrieved successfully',
        data: application
      };
    }

    return this.makeRequest<SubsidyApplication>(`/api/applications/${applicationId}`, 'GET');
  }

  // Get user notifications
  async getNotifications(userId?: string, unreadOnly: boolean = false): Promise<ApiResponse<UserNotification[]>> {
    if (USE_MOCK_DATA) {
      await this.delay(600);
      let notifications = [...this.mockNotifications];
      
      if (unreadOnly) {
        notifications = notifications.filter(notif => !notif.read);
      }
      
      return {
        success: true,
        message: 'Notifications retrieved successfully',
        data: notifications
      };
    }

    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread_only', 'true');
    
    const queryString = params.toString();
    const endpoint = `/api/users/${userId || 'me'}/notifications${queryString ? '?' + queryString : ''}`;
    
    return this.makeRequest<UserNotification[]>(endpoint, 'GET');
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await this.delay(400);
      const notification = this.mockNotifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
      return {
        success: true,
        message: 'Notification marked as read'
      };
    }

    return this.makeRequest<void>(`/api/notifications/${notificationId}/read`, 'PUT');
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId?: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_DATA) {
      await this.delay(500);
      this.mockNotifications.forEach(notification => {
        notification.read = true;
      });
      return {
        success: true,
        message: 'All notifications marked as read'
      };
    }

    return this.makeRequest<void>(`/api/users/${userId || 'me'}/notifications/read-all`, 'PUT');
  }

  // Get application milestones
  async getApplicationMilestones(applicationId: string): Promise<ApiResponse<ApplicationMilestone[]>> {
    if (USE_MOCK_DATA) {
      await this.delay(800);
      const application = this.mockApplications.find(app => app.id === applicationId);
      if (!application) {
        return {
          success: false,
          message: 'Application not found',
          error: 'Application with specified ID does not exist'
        };
      }
      return {
        success: true,
        message: 'Milestones retrieved successfully',
        data: application.milestones
      };
    }

    return this.makeRequest<ApplicationMilestone[]>(`/api/applications/${applicationId}/milestones`, 'GET');
  }

  // Update milestone progress
  async updateMilestoneProgress(milestoneId: string, progress: number, notes?: string): Promise<ApiResponse<ApplicationMilestone>> {
    if (USE_MOCK_DATA) {
      await this.delay(1000);
      
      // Find and update the milestone in mock data
      for (const application of this.mockApplications) {
        const milestone = application.milestones.find(m => m.id === milestoneId);
        if (milestone) {
          milestone.progress = Math.min(100, Math.max(0, progress));
          if (progress >= 100) {
            milestone.status = 'completed';
            milestone.completedDate = new Date().toISOString();
          } else if (progress > 0) {
            milestone.status = 'in_progress';
          }
          
          return {
            success: true,
            message: 'Milestone progress updated successfully',
            data: milestone
          };
        }
      }
      
      return {
        success: false,
        message: 'Milestone not found',
        error: 'Milestone with specified ID does not exist'
      };
    }

    const updateData = { progress, notes };
    return this.makeRequest<ApplicationMilestone>(`/api/milestones/${milestoneId}/progress`, 'PUT', updateData);
  }

  // Submit milestone completion
  async submitMilestoneCompletion(milestoneId: string, completionData: {
    evidenceUrls?: string[];
    notes?: string;
    completionDate?: string;
  }): Promise<ApiResponse<ApplicationMilestone>> {
    if (USE_MOCK_DATA) {
      await this.delay(1200);
      
      // Find and complete the milestone in mock data
      for (const application of this.mockApplications) {
        const milestone = application.milestones.find(m => m.id === milestoneId);
        if (milestone) {
          milestone.status = 'completed';
          milestone.progress = 100;
          milestone.completedDate = completionData.completionDate || new Date().toISOString();
          
          return {
            success: true,
            message: 'Milestone completed successfully',
            data: milestone
          };
        }
      }
      
      return {
        success: false,
        message: 'Milestone not found',
        error: 'Milestone with specified ID does not exist'
      };
    }

    return this.makeRequest<ApplicationMilestone>(`/api/milestones/${milestoneId}/complete`, 'POST', completionData);
  }

  // Get all milestones for a user across all applications
  async getAllUserMilestones(userId?: string, status?: 'pending' | 'in_progress' | 'completed' | 'overdue'): Promise<ApiResponse<ApplicationMilestone[]>> {
    if (USE_MOCK_DATA) {
      await this.delay(900);
      
      let allMilestones: ApplicationMilestone[] = [];
      this.mockApplications.forEach(app => {
        allMilestones = allMilestones.concat(app.milestones);
      });
      
      if (status) {
        allMilestones = allMilestones.filter(m => m.status === status);
      }
      
      return {
        success: true,
        message: 'User milestones retrieved successfully',
        data: allMilestones
      };
    }

    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const endpoint = `/api/users/${userId || 'me'}/milestones${queryString ? '?' + queryString : ''}`;
    
    return this.makeRequest<ApplicationMilestone[]>(endpoint, 'GET');
  }

  // Health check for the service
  async checkConnection(): Promise<boolean> {
    try {
      console.log('Checking user service connection...');
      const response = await this.makeRequestWithTimeout('/api/health', 'GET', undefined, 10000);
      const isConnected = response.ok;
      console.log(`User service connection check: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('User service connection check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

export const userService = new UserService();
