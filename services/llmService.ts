// LLM service for document analysis and AI-powered evaluation
import { BACKEND_API_BASE_URL, buildApiUrl } from './apiConfig';
const API_BASE_URL = BACKEND_API_BASE_URL;
const FALLBACK_API_URL = 'http://localhost:8000';
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const REQUEST_TIMEOUT = 45000; // 45 seconds for LLM processing
const MAX_RETRIES = 2;
const RETRY_DELAY = 2000; // 2 seconds
const USE_MOCK_LLM = true; // Set to false when backend is available

// Document Analysis Interfaces
export interface DocumentAnalysisRequest {
  documentId: string;
  documentName: string;
  documentType: 'business_license' | 'financial_statement' | 'project_proposal' | 'other';
  documentContent?: string; // Base64 or text content
  projectContext: {
    companyName: string;
    businessType: string;
    projectDescription: string;
    fundingAmount: string;
  };
}

export interface DocumentAnalysisResult {
  documentId: string;
  analysisScore: number; // 0-100
  validity: 'valid' | 'invalid' | 'needs_review';
  confidence: number; // 0-1
  findings: {
    authenticity: number; // 0-100
    relevance: number; // 0-100
    completeness: number; // 0-100
    compliance: number; // 0-100
  };
  feedback: string;
  recommendations: string[];
  redFlags: string[];
  extractedData?: {
    [key: string]: any;
  };
}

export interface ProjectEvaluationRequest {
  companyName: string;
  businessType: string;
  projectDescription: string;
  fundingAmount: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    analysisResult?: DocumentAnalysisResult;
  }>;
}

export interface ProjectEvaluationResult {
  overallScore: number; // 0-100
  eligibility: 'eligible' | 'not_eligible' | 'conditional';
  confidence: number; // 0-1
  criteria: {
    feasibility: number; // 0-100
    innovation: number; // 0-100
    environmentalImpact: number; // 0-100
    financialViability: number; // 0-100
    technicalMerit: number; // 0-100
  };
  feedback: string;
  recommendations: string[];
  requiredDocuments: string[];
  estimatedProcessingTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class LLMService {
  // Mock LLM responses for development
  private async mockAnalyzeDocument(request: DocumentAnalysisRequest): Promise<DocumentAnalysisResult> {
    console.log('Using mock LLM document analysis for development');
    
    // Simulate processing delay
    await this.delay(3000 + Math.random() * 2000);
    
    // Generate realistic mock analysis based on document type
    const mockScores = this.generateMockScores(request.documentType);
    
    return {
      documentId: request.documentId,
      analysisScore: mockScores.overall,
      validity: mockScores.overall >= 70 ? 'valid' : mockScores.overall >= 50 ? 'needs_review' : 'invalid',
      confidence: 0.85 + Math.random() * 0.1,
      findings: mockScores.findings,
      feedback: this.generateMockFeedback(request.documentType, mockScores.overall),
      recommendations: this.generateMockRecommendations(request.documentType),
      redFlags: mockScores.overall < 60 ? this.generateMockRedFlags(request.documentType) : [],
      extractedData: this.generateMockExtractedData(request.documentType, request.projectContext)
    };
  }

  private async mockEvaluateProject(request: ProjectEvaluationRequest): Promise<ProjectEvaluationResult> {
    console.log('Using mock LLM project evaluation for development');
    
    // Simulate processing delay
    await this.delay(4000 + Math.random() * 3000);
    
    // Calculate overall score based on project details and documents
    const documentScores = request.documents
      .filter(doc => doc.analysisResult)
      .map(doc => doc.analysisResult!.analysisScore);
    
    const avgDocumentScore = documentScores.length > 0 
      ? documentScores.reduce((a, b) => a + b, 0) / documentScores.length 
      : 60;
    
    const projectComplexityScore = this.calculateProjectComplexity(request);
    const overallScore = Math.round((avgDocumentScore * 0.6) + (projectComplexityScore * 0.4));
    
    return {
      overallScore,
      eligibility: overallScore >= 75 ? 'eligible' : overallScore >= 60 ? 'conditional' : 'not_eligible',
      confidence: 0.82 + Math.random() * 0.15,
      criteria: {
        feasibility: Math.max(60, Math.min(95, overallScore + Math.random() * 20 - 10)),
        innovation: Math.max(50, Math.min(90, overallScore + Math.random() * 25 - 12)),
        environmentalImpact: Math.max(70, Math.min(95, overallScore + Math.random() * 15 - 7)),
        financialViability: Math.max(55, Math.min(85, overallScore + Math.random() * 20 - 10)),
        technicalMerit: Math.max(60, Math.min(90, overallScore + Math.random() * 18 - 9))
      },
      feedback: this.generateProjectFeedback(overallScore, request),
      recommendations: this.generateProjectRecommendations(overallScore),
      requiredDocuments: request.documents.length < 3 ? ['Additional financial projections', 'Technical specifications'] : [],
      estimatedProcessingTime: overallScore >= 75 ? '5-7 business days' : '10-14 business days'
    };
  }

  private generateMockScores(documentType: string) {
    const baseScore = 65 + Math.random() * 30;
    return {
      overall: Math.round(baseScore),
      findings: {
        authenticity: Math.round(Math.max(50, baseScore + Math.random() * 20 - 10)),
        relevance: Math.round(Math.max(60, baseScore + Math.random() * 15 - 7)),
        completeness: Math.round(Math.max(55, baseScore + Math.random() * 25 - 12)),
        compliance: Math.round(Math.max(65, baseScore + Math.random() * 18 - 9))
      }
    };
  }

  private generateMockFeedback(documentType: string, score: number): string {
    const authenticityScore = this.generateMockScores(documentType).findings.authenticity;
    const authenticityNote = authenticityScore >= 85 
      ? " Document authenticity verification passed with high confidence."
      : authenticityScore >= 70 
      ? " Document shows minor authenticity concerns that may need verification."
      : " Document has significant authenticity issues requiring immediate attention.";
    
    const feedbackMap = {
      business_license: score >= 80 
        ? "Business license appears valid and current. All required information is present and matches provided company details." + authenticityNote
        : score >= 60 
        ? "Business license is generally acceptable but may require verification of expiration date and registration details." + authenticityNote
        : "Business license has inconsistencies or missing information that requires attention." + authenticityNote,
      
      financial_statement: score >= 80
        ? "Financial statements show strong fiscal health with consistent revenue patterns and appropriate cash flow for the proposed project." + authenticityNote
        : score >= 60
        ? "Financial statements are adequate but show some areas of concern regarding cash flow stability." + authenticityNote
        : "Financial statements indicate potential risks that may affect project viability." + authenticityNote,
      
      project_proposal: score >= 80
        ? "Project proposal is comprehensive with clear objectives, methodology, and expected outcomes aligned with green hydrogen initiatives." + authenticityNote
        : score >= 60
        ? "Project proposal has good foundation but could benefit from more detailed technical specifications and timeline." + authenticityNote
        : "Project proposal lacks sufficient detail in key areas and requires substantial improvements." + authenticityNote,
      
      other: score >= 80
        ? "Document provides valuable supporting information that strengthens the application." + authenticityNote
        : score >= 60
        ? "Document is relevant but may need additional context or clarification." + authenticityNote
        : "Document quality or relevance needs improvement." + authenticityNote
    };
    
    return feedbackMap[documentType as keyof typeof feedbackMap] || feedbackMap.other;
  }

  private generateMockRecommendations(documentType: string): string[] {
    const recommendationsMap = {
      business_license: [
        "Ensure license is current and not expired",
        "Verify registration matches company name exactly",
        "Include any relevant permits or certifications"
      ],
      financial_statement: [
        "Provide audited statements if available",
        "Include cash flow projections for next 12 months",
        "Clarify any unusual entries or discrepancies"
      ],
      project_proposal: [
        "Add detailed timeline with milestones",
        "Include risk assessment and mitigation strategies",
        "Specify environmental impact measurements"
      ],
      other: [
        "Ensure document relevance to the application",
        "Provide proper documentation or certification",
        "Include context for how this supports your project"
      ]
    };
    
    return recommendationsMap[documentType as keyof typeof recommendationsMap] || recommendationsMap.other;
  }

  private generateMockRedFlags(documentType: string): string[] {
    const redFlags = [
      "Document quality appears degraded or unclear",
      "Information inconsistency detected",
      "Missing required signatures or stamps",
      "Date discrepancies found",
      "Potential authenticity concerns"
    ];
    
    // Return 1-2 random red flags
    const shuffled = redFlags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
  }

  private generateMockExtractedData(documentType: string, context: any) {
    const extractedDataMap = {
      business_license: {
        licenseNumber: "BL-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        issuedDate: "2023-01-15",
        expiryDate: "2025-01-15",
        businessName: context.companyName,
        registeredAddress: "123 Innovation Drive, Tech City"
      },
      financial_statement: {
        revenue: "$" + (Math.random() * 5000000 + 1000000).toFixed(0),
        profit: "$" + (Math.random() * 500000 + 50000).toFixed(0),
        assets: "$" + (Math.random() * 2000000 + 500000).toFixed(0),
        reportingPeriod: "2023"
      },
      project_proposal: {
        projectDuration: (12 + Math.floor(Math.random() * 24)) + " months",
        expectedOutput: (Math.random() * 1000 + 100).toFixed(0) + " tons H2/year",
        investmentRequired: context.fundingAmount,
        jobsCreated: Math.floor(Math.random() * 50 + 10)
      }
    };
    
    return extractedDataMap[documentType as keyof typeof extractedDataMap] || {};
  }

  private calculateProjectComplexity(request: ProjectEvaluationRequest): number {
    let score = 70; // Base score
    
    // Adjust based on project description length and detail
    if (request.projectDescription.length > 500) score += 10;
    if (request.projectDescription.length > 1000) score += 5;
    
    // Adjust based on funding amount (reasonable amounts score higher)
    const fundingNum = parseFloat(request.fundingAmount.replace(/[^\d.]/g, ''));
    if (fundingNum > 0.1 && fundingNum < 10) score += 10; // Reasonable ETH range
    
    // Adjust based on business type
    if (request.businessType.includes('Hydrogen') || request.businessType.includes('Green')) score += 15;
    
    return Math.min(95, Math.max(40, score));
  }

  private generateProjectFeedback(score: number, request: ProjectEvaluationRequest): string {
    if (score >= 80) {
      return `Excellent project proposal with strong potential for success. The ${request.businessType.toLowerCase()} initiative shows clear alignment with green hydrogen objectives and demonstrates solid planning. The requested funding amount of ${request.fundingAmount} appears reasonable for the scope described.`;
    } else if (score >= 65) {
      return `Good project foundation with room for improvement. The proposal shows promise but would benefit from additional detail in technical specifications and risk assessment. Consider strengthening the business case and providing more comprehensive financial projections.`;
    } else {
      return `Project proposal needs significant enhancement before approval consideration. Key areas requiring attention include technical feasibility, financial planning, and environmental impact assessment. Additional documentation and revised projections are recommended.`;
    }
  }

  private generateProjectRecommendations(score: number): string[] {
    const commonRecommendations = [
      "Provide detailed project timeline with key milestones",
      "Include comprehensive risk assessment",
      "Add environmental impact measurements",
      "Specify technical specifications and requirements"
    ];
    
    const additionalRecommendations = score < 70 ? [
      "Strengthen financial projections and business model",
      "Provide additional market analysis",
      "Include more detailed technical documentation",
      "Consider partnering with established industry players"
    ] : [
      "Consider adding sustainability metrics",
      "Explore potential for scaling the project",
      "Include community impact assessment"
    ];
    
    return [...commonRecommendations.slice(0, 2), ...additionalRecommendations.slice(0, 2)];
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAuthToken(): string {
    // In a real app, get this from secure storage or context
    return 'mock-llm-token-' + Date.now();
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
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('LLM processing timed out. Please try again.');
      }
      throw error;
    }
  }

  private async makeRequest<T>(endpoint: string, method: string, data?: any): Promise<ApiResponse<T>> {
    if (USE_MOCK_LLM) {
      console.log(`Using mock LLM for ${method} ${endpoint}`);
      return { success: true, message: 'Success (mock LLM)' };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`LLM API ${method} ${endpoint} - Attempt ${attempt}/${MAX_RETRIES}`);
        
        const response = await this.makeRequestWithTimeout(endpoint, method, data);
        
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          throw new Error('Invalid response from LLM service. Please try again.');
        }

        if (!response.ok) {
          switch (response.status) {
            case 400:
              throw new Error(result.message || 'Invalid request data for LLM analysis.');
            case 401:
              throw new Error('Authentication required for LLM service.');
            case 403:
              throw new Error('Access denied to LLM service.');
            case 429:
              throw new Error('LLM service rate limit exceeded. Please wait and try again.');
            case 500:
              throw new Error('LLM service error. Please try again later.');
            default:
              throw new Error(result.message || `LLM request failed with status ${response.status}`);
          }
        }

        return {
          success: true,
          message: result.message || 'Success',
          data: result.data,
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('An unexpected error occurred');
        console.error(`LLM API ${method} ${endpoint} error (attempt ${attempt}):`, lastError.message);

        if (attempt < MAX_RETRIES) {
          const delayTime = RETRY_DELAY * Math.pow(2, attempt - 1);
          await this.delay(delayTime);
        }
      }
    }

    return {
      success: false,
      message: lastError?.message || 'LLM analysis failed',
      error: lastError?.message
    };
  }

  // Analyze a single document
  async analyzeDocument(request: DocumentAnalysisRequest): Promise<ApiResponse<DocumentAnalysisResult>> {
    if (USE_MOCK_LLM) {
      const result = await this.mockAnalyzeDocument(request);
      return {
        success: true,
        message: 'Document analysis completed successfully',
        data: result
      };
    }

    return this.makeRequest<DocumentAnalysisResult>('/api/llm/analyze-document', 'POST', request);
  }

  // Evaluate entire project with all documents
  async evaluateProject(request: ProjectEvaluationRequest): Promise<ApiResponse<ProjectEvaluationResult>> {
    if (USE_MOCK_LLM) {
      const result = await this.mockEvaluateProject(request);
      return {
        success: true,
        message: 'Project evaluation completed successfully',
        data: result
      };
    }

    return this.makeRequest<ProjectEvaluationResult>('/api/llm/evaluate-project', 'POST', request);
  }

  // Health check for LLM service
  async checkConnection(): Promise<boolean> {
    if (USE_MOCK_LLM) {
      console.log('Using mock LLM service - connection always available');
      return true;
    }
    
    try {
      console.log('Checking LLM service connection...');
      const response = await this.makeRequestWithTimeout('/api/llm/health', 'GET', undefined, 10000);
      const isConnected = response.ok;
      console.log(`LLM service connection check: ${isConnected ? 'SUCCESS' : 'FAILED'}`);
      return isConnected;
    } catch (error) {
      console.error('LLM service connection check failed:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }
}

export const llmService = new LLMService();
