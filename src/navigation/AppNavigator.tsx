import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/user";
import { ScreenParamList } from "../types/user";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { NativeStackScreenProps as NativeStackScreenPropsType } from "@react-navigation/native-stack";
// Import MainTabNavigator from shared components file
import { MainTabNavigator } from "./NavigationComponents";

import { LoginScreen } from "../screens/LoginScreen";
import { PrivacyPolicyScreen } from "../screens/PrivacyPolicy";
import { TermsOfServiceScreen } from "../screens/TermsOfService";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator<ScreenParamList>();
const Tab = createBottomTabNavigator<ScreenParamList>();

// Add types for navigation
export type RootStackParamList = ScreenParamList;

// Import DrawerNavigator for the hamburger menu
import { DrawerNavigator } from './DrawerNavigator';

// Export the AppNavigator component
export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Define screen props type
export type ScreenProps<T extends keyof ScreenParamList> =
  NativeStackScreenPropsType<ScreenParamList, T>;

// Define screen components with proper types
interface ScreenComponents {
  [key: string]: React.ComponentType<ScreenProps<keyof ScreenParamList>>;
}

// Types for tab navigation
export type RootTabParamList = {
  Home: undefined;
  StartupCalls: undefined;
  Profile: undefined;
};

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Auth"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: "Create Account",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: "Forgot Password",
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{
          title: "Terms of Service",
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: "Privacy Policy",
        }}
      />
    </Stack.Navigator>
  );
};

// MainTabNavigator moved to NavigationComponents.tsx
