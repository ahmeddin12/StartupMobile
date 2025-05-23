import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native-paper";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserRole, ScreenParamList } from "../types/user";
import { useAuth } from "../contexts/AuthContext";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/Profile";
import { StartupCallsScreen } from "../screens/StartupCallsScreen";
import { CallDetailsScreen } from "../screens/CallDetails";

// Create navigators
const Tab = createBottomTabNavigator<ScreenParamList>();
const Stack = createNativeStackNavigator<ScreenParamList>();

// Define screen configurations
const screens = [
  {
    name: "Home" as keyof ScreenParamList,
    icon: "home",
    component: HomeScreen,
  },
  {
    name: "StartupCalls" as keyof ScreenParamList,
    icon: "phone",
    component: StartupCallsScreen,
  },
  {
    name: "Profile" as keyof ScreenParamList,
    icon: "account",
    component: ProfileScreen,
  },
] as const;

// Main Tab Navigator - extracted to a separate file to avoid circular dependencies
// Tab Navigator Component - used inside the Stack Navigator
const TabNavigator = () => {
  const { user, logout } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<ScreenParamList>>();

  if (!user) {
    return null;
  }
  
  // Function to handle logout action
  const handleLogout = async () => {
    try {
      // Call the logout function from AuthContext
      await logout();
      
      // Navigate to auth screen after logout
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({
        route,
      }: {
        route: { name: keyof ScreenParamList };
      }) => {
        const screen = screens.find((s) => s.name === route.name);
        return {
          tabBarIcon: ({ color, size }) => (
            <Icon name={screen?.icon || "home"} size={size} color={color} />
          ),
          // Hide header on HomeScreen, but show on other screens
          headerShown: route.name !== "Home",
          // Only show logout button if header is shown
          headerRight: route.name !== "Home" ? () => (
            <Button
              icon="logout"
              mode="text"
              onPress={handleLogout}
              style={{ marginRight: 10 }}
            >
              Logout
            </Button>
          ) : undefined,
        };
      }}
    >
      {screens.map(
        (screen: {
          name: keyof ScreenParamList;
          component: React.ComponentType<any>;
          icon: string;
        }) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={{ title: screen.name }}
          />
        )
      )}
    </Tab.Navigator>
  );
};

// Main Navigator that combines Tab Navigator with Stack screens
export const MainTabNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen 
        name="CallDetails" 
        component={CallDetailsScreen} 
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.callId === "new" ? "Schedule New Call" : "Call Details"
        })}
      />
    </Stack.Navigator>
  );
};
