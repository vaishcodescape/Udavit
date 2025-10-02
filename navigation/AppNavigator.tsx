import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import ApplicationStatusScreen from '../pages/ApplicationStatusScreen';
import LoginSignupScreen from '../pages/LoginSignupScreen';
import MilestoneTrackingScreen from '../pages/MilestoneTrackingScreen';
import OnBoardingScreen from '../pages/OnBoardingScreen';
import PaymentStatusScreen from '../pages/PaymentStatusScreen';
import ProfileSettingsScreen from '../pages/ProfileSettingsScreen';
import SubmitSubsidyScreen from '../pages/SubmitSubsidyScreen';
import WelcomeScreen from '../pages/WelcomeScreen';

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
