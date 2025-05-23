import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ScreenParamList } from '../types/user';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<ScreenParamList, 'TermsOfService'>;

export const TermsOfServiceScreen = (props: Props) => {
  const { navigation, route } = props;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>

        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.text}>
          Permission is granted to temporarily use this application for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </Text>

        <Text style={styles.sectionTitle}>3. User Account</Text>
        <Text style={styles.text}>
          To use certain features of the application, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </Text>

        <Text style={styles.sectionTitle}>4. Prohibited Activities</Text>
        <Text style={styles.text}>
          You agree not to:
          {'\n\n'}• Use the application for any illegal purpose
          {'\n'}• Violate any laws in your jurisdiction
          {'\n'}• Interfere with or disrupt the application
          {'\n'}• Attempt to gain unauthorized access to any portion of the application
        </Text>

        <Text style={styles.sectionTitle}>5. Disclaimer</Text>
        <Text style={styles.text}>
          The application is provided "as is" without any warranties, expressed or implied. We do not warrant that the application will be uninterrupted or error-free.
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.text}>
          In no event shall we be liable for any damages arising out of the use or inability to use the application.
        </Text>

        <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
        <Text style={styles.text}>
          We reserve the right to modify these terms at any time. Your continued use of the application following any changes indicates your acceptance of the new terms.
        </Text>

        <Text style={styles.lastUpdated}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666666',
    marginTop: 24,
    textAlign: 'center',
  },
}); 