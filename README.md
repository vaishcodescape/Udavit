# Udavit 🚀

A native mobile application built with React Native, featuring AI-powered capabilities through Hugging Face Transformers and a robust backend infrastructure.

## 🏗️ Tech Stack

### Frontend
- **React Native** - JavaScript library for building native mobile applications
- Cross-platform development for iOS and Android
- Modern component-based architecture

### Authentication & Security
- **Firebase Auth** - Secure user authentication and management
- User registration, login, and session management
- Built-in security features and best practices

### Backend
- **FastAPI** - High-performance Python web framework
- RESTful API endpoints
- Automatic API documentation with OpenAPI/Swagger
- Async support for high concurrency

### AI/ML Integration
- **Hugging Face Transformers** - State-of-the-art natural language processing
- Pre-trained models for various AI tasks
- Easy integration with custom models

### Database
- **Firebase NoSQL** - Scalable cloud database
- Real-time data synchronization
- Offline support and data persistence

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Python 3
- Firebase CLI
- Android Studio / Xcode (for mobile development)

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

3. **Install backend dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Setup Firebase**
   ```bash
   firebase login
   firebase init
   ```

5. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase and API credentials

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
cd backend
uvicorn main:app --reload
```

## 📱 Features

- **Cross-platform mobile app** - Works on both iOS and Android
- **AI-powered functionality** - Leveraging Hugging Face Transformers
- **Real-time data sync** - Firebase NoSQL database integration
- **Secure authentication** - Firebase Auth implementation
- **High-performance backend** - FastAPI with async support

## 🏗️ Project Structure

```
Udavit/
├── app/                    # React Native app screens and navigation
├── components/            # Reusable React Native components
├── constants/             # App constants and configuration
├── hooks/                 # Custom React hooks
├── backend/               # FastAPI backend server
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

# Hugging Face Configuration
HUGGINGFACE_API_TOKEN=your_token
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
cd backend
pytest
```

## 🚀 Deployment

### Frontend
- **iOS**: Build and deploy through Xcode
- **Android**: Generate APK/AAB through Android Studio

### Backend
```bash
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Create an issue in the GitHub repository
- Check the documentation in the `docs/` folder
- Review the API documentation at `/docs` endpoint

## 🙏 Acknowledgments

- React Native community for the excellent framework
- Firebase team for robust backend services
- Hugging Face for state-of-the-art AI models
- FastAPI creators for the high-performance backend framework

---

**Built with ❤️ by the Udavit team**
