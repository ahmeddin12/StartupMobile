import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Alert, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenParamList } from '../types/user';

interface Props {
  navigation: NativeStackNavigationProp<ScreenParamList>;
}

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;
    
    setLoading(true);
    try {
      // In a real app, you would call an API endpoint here
      // For now, we'll just simulate a successful response
      setTimeout(() => {
        Alert.alert(
          'Password Reset Email Sent',
          'If an account exists with this email, you will receive a password reset link.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Error',
        'There was a problem requesting a password reset. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Reset your password</Text>
        <Text style={styles.subtitle}>Enter your email address and we'll send you a link to reset your password</Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!emailError}
            mode="outlined"
            outlineColor="#E5E7EB"
            activeOutlineColor="#6366F1"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          
          <Button
            mode="contained"
            onPress={handleResetPassword}
            style={styles.resetButton}
            disabled={loading}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            color="#6366F1"
          >
            {loading ? <ActivityIndicator color="#fff" size={20} /> : 'Send reset link'}
          </Button>
          
          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            contentStyle={styles.buttonContent}
            labelStyle={[styles.buttonLabel, styles.backButtonLabel]}
            color="#6B7280"
          >
            Back to sign in
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#4F46E5',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 10,
  },
  resetButton: {
    marginVertical: 16,
    borderRadius: 8,
    elevation: 0,
  },
  backButton: {
    marginVertical: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonLabel: {
    color: '#6B7280',
  },
});
