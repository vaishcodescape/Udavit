import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ApplicationStatusScreen from './components/ApplicationStatusScreen';
import LoginSignupScreen from './components/LoginSignupScreen';
import MilestoneTrackingScreen from './components/MilestoneTrackingScreen';
import NotificationsCenterScreen from './components/NotificationsCenterScreen';
import OnBoardingScreen from './components/OnBoardingScreen';
import PaymentStatusScreen from './components/PaymentStatusScreen';
import ProfileSettingsScreen from './components/ProfileSettingsScreen';
import SplashScreen from './components/SplashScreen';
import StartupDashboardScreen from './components/StartupDashboardScreen';
import SubmitSubsidyScreen from './components/SubmitSubsidyScreen';
import WelcomeScreen from './components/WelcomeScreen';
import './global.css';

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

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'transparent' },
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
