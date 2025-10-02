import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import './global.css';
import ApplicationStatusScreen from './pages/ApplicationStatusScreen';
import LoginSignupScreen from './pages/LoginSignupScreen';
import MilestoneTrackingScreen from './pages/MilestoneTrackingScreen';
import NotificationsCenterScreen from './pages/NotificationsCenterScreen';
import OnBoardingScreen from './pages/OnBoardingScreen';
import PaymentStatusScreen from './pages/PaymentStatusScreen';
import ProfileSettingsScreen from './pages/ProfileSettingsScreen';
import SplashScreen from './pages/SplashScreen';
import StartupDashboardScreen from './pages/StartupDashboardScreen';
import SubmitSubsidyScreen from './pages/SubmitSubsidyScreen';
import WelcomeScreen from './pages/WelcomeScreen';

export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  OnBoarding: undefined;
  LoginSignup: undefined;
  StartupDashboard: undefined;
  SubmitSubsidy: undefined;
  ApplicationStatus: undefined;
  MilestoneTracking: undefined;
  PaymentStatus: undefined;
  ProfileSettings: undefined;
  NotificationsCenter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f0fdf4' },
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
          <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
          <Stack.Screen name="StartupDashboard" component={StartupDashboardScreen} />
          <Stack.Screen name="SubmitSubsidy" component={SubmitSubsidyScreen} />
          <Stack.Screen name="ApplicationStatus" component={ApplicationStatusScreen} />
          <Stack.Screen name="MilestoneTracking" component={MilestoneTrackingScreen} />
          <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} />
          <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
          <Stack.Screen name="NotificationsCenter" component={NotificationsCenterScreen} />
        </Stack.Navigator>
        
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
