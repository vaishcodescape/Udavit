# 🚀 Udavit - Modern Mobile App

A beautiful, modern React Native application built with Expo and NativeWind for exceptional user experiences.

## ✨ Features

- **Modern Design**: Clean, intuitive interface with beautiful animations
- **Dark Mode**: Automatic theme switching with system preferences
- **Cross-Platform**: iOS, Android, and Web support
- **Performance**: Built with React Native's new architecture
- **Styling**: NativeWind (Tailwind CSS) for consistent, responsive design
- **Navigation**: Smooth tab-based navigation with haptic feedback
- **TypeScript**: Full type safety and modern development experience

## 🏗️ Architecture

```
Udavit App Structure:
├── app/                    # Expo Router app directory
│   ├── _layout.tsx        # Root layout with stack navigation
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab navigator
│   │   ├── index.tsx      # Home screen
│   │   └── explore.tsx    # Discover screen
│   └── +not-found.tsx     # 404 error screen
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── constants/              # App constants and configurations
└── assets/                 # Images, fonts, and static files
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd Segfault-Squad
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on your preferred platform**

   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🎨 Styling with NativeWind

Udavit uses NativeWind (Tailwind CSS for React Native) for consistent, responsive styling:

```tsx
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export function MyComponent() {
  return (
    <StyledView className="p-6 bg-white dark:bg-gray-800 rounded-xl">
      <StyledText className="text-2xl font-bold text-gray-900 dark:text-white">
        Hello Udavit!
      </StyledText>
    </StyledView>
  );
}
```

### Key Styling Features

- **Utility Classes**: Use Tailwind CSS classes directly
- **Dark Mode**: Automatic theme switching with `dark:` prefix
- **Responsive Design**: Breakpoint-based responsive layouts
- **Consistent Spacing**: Predefined spacing scale
- **Color System**: Comprehensive color palette

## 📱 App Screens

### 🏠 Home Screen

- Welcome message and app branding
- Quick action buttons
- Feature showcase
- App information

### 🔍 Discover Screen

- Featured content
- Category exploration
- Recent updates
- Premium features

### ❌ Error Screen

- User-friendly error messages
- Navigation assistance
- Helpful tips

## 🛠️ Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Reusable UI components with TypeScript
- **Hooks**: Custom React hooks for app logic
- **Navigation**: File-based routing with Expo Router
- **Styling**: NativeWind utility classes
- **Theming**: Automatic light/dark mode support

## 🔧 Configuration

### NativeWind Setup

- `tailwind.config.js` - Tailwind CSS configuration
- `babel.config.js` - Babel with NativeWind plugin
- `app.d.ts` - TypeScript declarations

### Expo Configuration

- `app.json` - Expo app configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules

## 📦 Dependencies

### Core

- **React Native**: 0.79.5
- **Expo**: SDK 53
- **React**: 19.0.0
- **TypeScript**: 5.8.3

### UI & Navigation

- **NativeWind**: Tailwind CSS for React Native
- **Expo Router**: File-based routing
- **React Navigation**: Navigation library

### Development

- **ESLint**: Code quality
- **Babel**: JavaScript compiler
- **Metro**: React Native bundler

## 🌟 Key Benefits

1. **Developer Experience**
   - Hot reload for instant feedback
   - TypeScript for type safety
   - Modern React patterns

2. **User Experience**
   - Smooth animations
   - Haptic feedback
   - Intuitive navigation

3. **Performance**
   - New React Native architecture
   - Optimized rendering
   - Efficient state management

4. **Maintainability**
   - Clean code structure
   - Reusable components
   - Consistent styling

## 🚀 Deployment

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Build for Web
expo build:web
```

### App Store Deployment

1. Configure app signing
2. Update version numbers
3. Build production bundle
4. Submit to app stores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and this README
- **Issues**: Create an issue on GitHub
- **Community**: Join our development community

---

**Built with ❤️ using React Native, Expo, and NativeWind**

*Udavit - Your innovative app for modern experiences*
