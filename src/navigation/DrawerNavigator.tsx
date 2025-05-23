import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Switch, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Drawer as PaperDrawer } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { ScreenParamList } from '../types/user';
import { MainTabNavigator } from './NavigationComponents';
import { useAuth } from '../contexts/AuthContext';
import { CallDetailsScreen } from '../screens/CallDetails';

// Create main drawer navigator
const Drawer = createDrawerNavigator();
// Create a stack navigator for the drawer content
const Stack = createNativeStackNavigator<ScreenParamList>();

// Custom drawer content component
const CustomDrawerContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<ScreenParamList>>();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }]
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would update theme context here
  };

  return (
    <View style={styles.drawerContent}>
      <View style={styles.userSection}>
        <Text style={styles.userName}>{user?.name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <Text style={styles.userRole}>{user?.role || ''}</Text>
      </View>

      <PaperDrawer.Section>
        <PaperDrawer.Item
          icon={({ color, size }) => <Icon name="home" color={color} size={size} />}
          label="Home"
          onPress={() => navigation.navigate({ name: 'Home', params: undefined })}
        />
        <PaperDrawer.Item
          icon={({ color, size }) => <Icon name="phone" color={color} size={size} />}
          label="Startup Calls"
          onPress={() => navigation.navigate({ name: 'StartupCalls', params: undefined })}
        />
        <PaperDrawer.Item
          icon={({ color, size }) => <Icon name="lightbulb" color={color} size={size} />}
          label="Startups"
          onPress={() => navigation.navigate({ name: 'StartupCalls', params: undefined })}
        />
        <PaperDrawer.Item
          icon={({ color, size }) => <Icon name="handshake" color={color} size={size} />}
          label="Sponsor Call"
          onPress={() => navigation.navigate({ name: 'StartupCalls', params: undefined })}
        />
        <PaperDrawer.Item
          icon={({ color, size }) => <Icon name="view-dashboard" color={color} size={size} />}
          label="Entrepreneur Dashboard"
          onPress={() => navigation.navigate({ name: 'EntrepreneurDashboard', params: undefined })}
        />
        <PaperDrawer.Item
          icon={({ color, size }) => <Icon name="calendar" color={color} size={size} />}
          label="Events"
          onPress={() => navigation.navigate({ name: 'Events', params: undefined })}
        />
      </PaperDrawer.Section>

      <PaperDrawer.Section title="Preferences">
        <View style={styles.themeToggleContainer}>
          <Text style={styles.themeToggleText}>Toggle Theme</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#6366F1' }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
      </PaperDrawer.Section>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="logout" size={24} color="#6366F1" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Import event and application screens
import { EventsScreen } from '../screens/EventsScreen';
import { EventDetailScreen } from '../screens/EventDetailScreen';
import { AnnouncementDetailsScreen } from '../screens/AnnouncementDetailsScreen';
import { CallApplicationScreen } from '../screens/CallApplicationScreen';
// ProjectManagementScreen removed as requested
import EntrepreneurDashboard from '../screens/EntrepreneurDashboard';

// Create a component that combines MainTabNavigator and other screens in a stack
const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabsContent" component={MainTabNavigator} />
      <Stack.Screen 
        name="CallDetails" 
        component={CallDetailsScreen} 
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.callId === "new" ? "Schedule New Call" : "Call Details"
        })}
      />
      <Stack.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{
          headerShown: true,
          title: "Events Calendar"
        }}
      />
      <Stack.Screen 
        name="EventDetail" 
        component={EventDetailScreen} 
        options={{
          headerShown: true,
          title: "Event Details"
        }}
      />
      <Stack.Screen 
        name="AnnouncementDetails" 
        component={AnnouncementDetailsScreen} 
        options={{
          headerShown: true,
          title: "Announcement Details"
        }}
      />
      <Stack.Screen 
        name="CallApplication" 
        component={CallApplicationScreen} 
        options={{
          headerShown: true,
          title: "Apply for Startup Call"
        }}
      />
      {/* ProjectManagement screen removed as requested */}
      <Stack.Screen 
        name="EntrepreneurDashboard" 
        component={EntrepreneurDashboard} 
        options={{
          headerShown: true,
          title: "Entrepreneur Dashboard",
          headerTitleStyle: {
            color: '#007AFF',
            fontWeight: 'bold'
          }
        }}
      />
    </Stack.Navigator>
  );
};

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: true,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen 
        name="MainTabs" 
        component={MainStackNavigator} 
        options={{
          title: 'Startup Call',
          headerTitleStyle: {
            color: '#4F46E5',
            fontWeight: 'bold',
          }
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  userSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '500',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  themeToggleText: {
    fontSize: 14,
    color: '#4B5563',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 'auto',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
});
