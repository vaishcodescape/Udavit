# Udavit 🌱⚡

**Green Hydrogen Subsidy Disbursement via Smart Contracts**

A mobile-first platform that revolutionizes government subsidy distribution for green hydrogen startups through blockchain technology, AI-powered evaluation, and automated milestone tracking.

## 🎯 Project Overview

**HackOut '25 Project Report: Team Segfault Squad**

**Team Members:**

- **Aditya Vaish** (Leader)
- **Kanika Pal**
- **Vedant Shah**
- **Nisarg Trivedi**

## 🚀 Core Idea

Udavit is a comprehensive platform that enables:

- **Green hydrogen startups** to apply for government subsidies
- **Government agencies** to track milestones and verify project progress
- **Automated subsidy disbursement** via smart contracts upon milestone completion
- **AI-powered feedback and scoring** using LLMs to evaluate project ideas and milestones

## 🏗️ Tech Stack (Tentative)

### Frontend

- **React Native** - Cross-platform mobile application development
- **Charts & Visualizations** - Recharts or Victory Native for analytics

### Backend & APIs

- **Node.js** - Primary backend server
- **FastAPI (Python)** - LLM integration and specialized services
- **RESTful APIs** - Secure endpoints for all platform operations

### Authentication & Security

- **Firebase Auth** - Secure user authentication and role-based access control
- **Data Encryption** - Backend and database security
- **Secure API Endpoints** - Protected routes and validation

### AI/ML Integration

- **Hugging Face Transformers** - Local LLM models for project evaluation
- **OpenAI GPT** - Alternative LLM API integration
- **Automated Scoring** - Feasibility, innovation, and environmental impact assessment

### Database

- **Firebase NoSQL** - Primary database for real-time data
- **PostgreSQL/MongoDB** - Additional database options for specific use cases

### Blockchain & Smart Contracts

- **Ethereum (Solidity)** - Smart contract development
- **Hyperledger (Chaincode)** - Alternative blockchain platform
- **Immutable Audit Trail** - Transparent transaction logging

### Payments & Banking

- **Secure Payment Gateways** - Razorpay/UPI API integration
- **Banking APIs** - Direct bank integration for subsidy transfers
- **Crypto Wallets** - Blockchain payment support

## 🔧 Features Breakdown

### A. User Management

- **Multi-role Access**: Startups, government officials, auditors, banks
- **Role-specific Dashboards**: Customized interfaces per user type
- **KYC Verification**: Secure document upload and verification
- **Signup/Login**: Firebase Auth with role-based permissions

### B. Subsidy Application & Idea Submission

- **Project Submission Forms**: Detailed project details, milestones, and production estimates
- **LLM-powered Evaluation**: Automatic scoring based on:
  - Feasibility assessment
  - Innovation evaluation
  - Environmental impact analysis
- **Point-based System**: Criteria-based scoring for subsidy eligibility

### C. Milestone Tracking

- **Progress Monitoring**: Automatic and manual milestone tracking
- **Real-time Data Integration**: IoT API and CSV upload support
- **Verification System**: Automated and manual milestone verification
- **Point Allocation**: Points awarded upon verified completion

### D. Smart Contract Integration

- **Automated Payments**: Trigger subsidy disbursement when milestones are met
- **Conditional Logic**: Smart contract conditions for payment release
- **Audit Trail**: Immutable blockchain records of all transactions
- **Transparency**: Public verification of payment logs

### E. AI-Powered Feedback System

- **Project Evaluation**: LLM analysis of startup submissions
- **Milestone Assessment**: Automated proof verification and scoring
- **Fraud Detection**: AI-powered anomaly detection
- **Continuous Learning**: Model improvement through feedback

### F. Secure Payment & Banking

- **Multi-channel Payments**: Traditional banking and cryptocurrency support
- **Transaction Logging**: Comprehensive payment audit trails
- **Bank Integration**: Direct API connections for subsidy transfers

### G. Dashboard & Analytics

- **Visual Analytics**: Charts and graphs for key metrics
- **Real-time Updates**: Live data on subsidies, milestones, and progress
- **Audit Logs**: Comprehensive tracking for government officials
- **Performance Metrics**: Startup and project performance indicators

### H. Notifications & Alerts

- **Push Notifications**: Real-time updates for all users
- **Milestone Alerts**: Progress notifications for startups
- **Approval Reminders**: Pending action notifications for officials
- **Payment Confirmations**: Transaction status updates

### I. Security Features

- **Role-based Access Control**: Granular permissions per user type
- **Data Encryption**: End-to-end security for sensitive information
- **API Security**: Protected endpoints with authentication
- **Smart Contract Audits**: Blockchain security best practices

## 🔄 User Flow

1. **Startup Registration** → KYC verification → Role assignment
2. **Project Application** → LLM evaluation → Feedback integration → Final submission
3. **Government Review** → Project approval → Milestone definition
4. **Milestone Execution** → Progress tracking → Proof submission
5. **AI Evaluation** → LLM assessment → Point allocation
6. **Smart Contract Trigger** → Automated subsidy payment → Transaction logging
7. **Dashboard Update** → Real-time analytics → Audit trail maintenance

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Python 3
- Firebase CLI
- Android Studio / Xcode (for mobile development)
- Solidity compiler (for smart contracts)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/Udavit.git
   cd Udavit
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Setup Firebase**

   ```bash
   firebase login
   firebase init
   ```

5. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase, API, and blockchain credentials

### Running the Application

#### Frontend (React Native)

```bash
# Start Metro bundler
npx react-native start

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

#### Backend (FastAPI)

```bash
uvicorn main:app --reload
```

## 📱 Key Features

- **Cross-platform mobile app** - Works on both iOS and Android
- **AI-powered evaluation** - LLM integration for project assessment
- **Blockchain transparency** - Smart contracts for automated payments
- **Real-time tracking** - Live milestone and progress monitoring
- **Secure authentication** - Role-based access control
- **Comprehensive analytics** - Visual dashboards and reporting

## 🏗️ Project Structure

```
Udavit/
├── app/                    # React Native app screens and navigation
├── components/            # Reusable React Native components
├── constants/             # App constants and configuration
├── hooks/                 # Custom React hooks
├── smart-contracts/       # Solidity smart contracts
├── llm-services/          # AI/ML integration services
├── payment-gateways/      # Banking and payment integrations
├── assets/                # Images, fonts, and static assets
└── docs/                  # Project documentation
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Backend Configuration
BACKEND_URL=http://localhost:8000
API_KEY=your_api_key

# LLM Configuration
HUGGINGFACE_API_TOKEN=your_token
OPENAI_API_KEY=your_openai_key

# Blockchain Configuration
ETHEREUM_NETWORK=mainnet
PRIVATE_KEY=your_private_key
CONTRACT_ADDRESS=your_contract_address

# Payment Gateway Configuration
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 📚 API Documentation

Once the backend is running, visit:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
pytest

# Smart contract tests
npx hardhat test
```

## 🚀 Deployment

### Frontend

- **iOS**: Build and deploy through Xcode
- **Android**: Generate APK/AAB through Android Studio

### Backend

```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Smart Contracts

```bash
npx hardhat deploy --network mainnet
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🎯 Problem Statement

### Challenges Addressed

- **Lack of awareness** of existing government subsidiaries
- **Secure payment** mechanisms for subsidy distribution
- **Lack of data** on government fund utilization
- **Manual processes** in subsidy approval and disbursement
- **Transparency issues** in fund allocation and tracking

### Smart Contract Conditions

- **Conditional Payment**: If object A is sent, cryptocurrency sum is transferred
- **Asset Exchange**: If digital assets are transferred, object A is transferred
- **Work Completion**: If work is finished, specified digital assets are transferred

## 🌟 Impact & Vision

Udavit aims to revolutionize government subsidy distribution by:

- **Automating** the entire subsidy lifecycle
- **Ensuring transparency** through blockchain technology
- **Improving efficiency** with AI-powered evaluation
- **Reducing fraud** through smart contract automation
- **Accelerating** green hydrogen adoption

---

**Built with ❤️ by the Segfault Squad team**

*Empowering Green Hydrogen Innovation Through Technology*
