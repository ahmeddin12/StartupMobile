import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Avatar, List, Switch, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackScreenProps } from '@navigation/types';
import { useAuth } from '../contexts/AuthContext';

type Props = RootStackScreenProps<'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Avatar.Image
            size={80}
            source={{ uri: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}` }}
          />
          <Text style={styles.name}>{user.fullName}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <List.Section>
          <List.Subheader>Account Settings</List.Subheader>
          <List.Item
            title="Edit Profile"
            left={props => <List.Icon {...props} icon="account-edit" />}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
              />
            )}
          />
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
              />
            )}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => navigation.navigate('TermsOfService')}
          />
          <List.Item
            title="App Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
        </List.Section>

        <View style={styles.logoutContainer}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            buttonColor="#FF4444"
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666666',
    marginTop: 5,
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    marginTop: 10,
  },
}); 