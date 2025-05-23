import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
// Update the import path below to the correct relative path where your navigation types are defined
// For example, if types are in src/navigation/types.ts, use:
import type { RootStackScreenProps } from "../navigation/types";

type Props = RootStackScreenProps<"ChangePassword">;

export const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement password change logic
      Alert.alert("Success", "Password changed successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <TextInput
          label="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        <Button
          mode="contained"
          onPress={handleChangePassword}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Change Password
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  button: {
    marginTop: 8,
  },
});
