import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, MainTabParamList } from "./types";
import { LoginScreen } from "../screens/auth/LoginScreen";

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={() => null} />
      <AuthStack.Screen name="ForgotPassword" component={() => null} />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={() => null} />
      <Tab.Screen name="StartupCalls" component={() => null} />
      <Tab.Screen name="Profile" component={() => null} />
      <Tab.Screen name="Notifications" component={() => null} />
    </Tab.Navigator>
  );
};

// Root Navigator
const Navigation = () => {
  const isAuthenticated = false; // This will be replaced with actual auth state

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
