import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export const PrivacyPolicyScreen = ({ navigation, route }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information that you provide directly to us, including:
          {'\n\n'}• Your name and email address
          {'\n'}• Profile information
          {'\n'}• Call scheduling data
          {'\n'}• Usage data and preferences
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the information we collect to:
          {'\n\n'}• Provide and maintain our services
          {'\n'}• Send you notifications about your calls
          {'\n'}• Improve our services
          {'\n'}• Communicate with you about updates and changes
        </Text>

        <Text style={styles.sectionTitle}>3. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {'\n\n'}• Access your personal data
          {'\n'}• Correct inaccurate data
          {'\n'}• Request deletion of your data
          {'\n'}• Object to processing of your data
        </Text>

        <Text style={styles.sectionTitle}>5. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at privacy@example.com
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