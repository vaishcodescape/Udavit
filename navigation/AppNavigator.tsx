import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ApplicationStatusScreen from '../components/ApplicationStatusScreen';
import LoginSignupScreen from '../components/LoginSignupScreen';
import MilestoneTrackingScreen from '../components/MilestoneTrackingScreen';
import OnBoardingScreen from '../components/OnBoardingScreen';
import PaymentStatusScreen from '../components/PaymentStatusScreen';
import ProfileSettingsScreen from '../components/ProfileSettingsScreen';
import SubmitSubsidyScreen from '../components/SubmitSubsidyScreen';
import WelcomeScreen from '../components/WelcomeScreen';

export type RootStackParamList = {
  Welcome: undefined;
  OnBoarding: undefined;
  LoginSignup: undefined;
  SubmitSubsidy: undefined;
  ApplicationStatus: undefined;
  MilestoneTracking: undefined;
  PaymentStatus: undefined;
  ProfileSettings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
        <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
        <Stack.Screen name="SubmitSubsidy" component={SubmitSubsidyScreen} />
        <Stack.Screen name="ApplicationStatus" component={ApplicationStatusScreen} />
        <Stack.Screen name="MilestoneTracking" component={MilestoneTrackingScreen} />
        <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} />
        <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
