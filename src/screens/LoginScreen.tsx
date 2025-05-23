import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Alert, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Button, ActivityIndicator, Checkbox, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenParamList } from '../types/user';
import { AuthService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: NativeStackNavigationProp<ScreenParamList>;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();

  const validateInputs = () => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);
    try {
      // Call the login function from AuthContext directly
      // This will internally use AuthService and handle token storage
      await login(email, password);
      
      // Navigate to the appropriate dashboard based on user role
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = () => {
    // Navigate to the Register screen
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Startup Idea Management</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
        <Text style={styles.subtitleSmall}>Or <Text style={styles.textLink} onPress={handleRegister}>create a new account</Text></Text>
        
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            placeholder="just@gmail.com"
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
          
          <View style={styles.passwordContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            placeholder="•••••••••••••••"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            style={styles.input}
            secureTextEntry
            error={!!passwordError}
            mode="outlined"
            outlineColor="#E5E7EB"
            activeOutlineColor="#6366F1"
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          <View style={styles.rememberContainer}>
            <Checkbox.Android
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
              color="#6366F1"
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </View>
          
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.signInButton}
            disabled={loading}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            color="#6366F1"
          >
            {loading ? <ActivityIndicator color="#fff" size={20} /> : 'Sign in'}
          </Button>
          
          <View style={styles.orContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>Or continue with</Text>
            <View style={styles.divider} />
          </View>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'Google login not implemented yet')}>
              <View style={styles.socialButtonContent}>
                <Text style={styles.socialButtonText}>Google</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.socialButton} onPress={() => Alert.alert('Info', 'GitHub login not implemented yet')}>
              <View style={styles.socialButtonContent}>
                <Text style={styles.socialButtonText}>GitHub</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Button
            mode="text"
            onPress={() => navigation.navigate('TermsOfService')}
            style={styles.link}
            compact
            color="#6B7280"
          >
            Terms of Service
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('PrivacyPolicy')}
            style={styles.link}
            compact
            color="#6B7280"
          >
            Privacy Policy
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#4F46E5',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 4,
  },
  subtitleSmall: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 30,
  },
  textLink: {
    color: '#6366F1',
    fontWeight: '500',
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
  passwordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  forgotPassword: {
    color: '#6366F1',
    fontSize: 14,
    fontWeight: '500',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  rememberText: {
    color: '#4B5563',
    fontSize: 14,
    marginLeft: 8,
  },
  signInButton: {
    marginVertical: 16,
    borderRadius: 8,
    elevation: 0,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  orText: {
    color: '#6B7280',
    fontSize: 14,
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  link: {
    marginHorizontal: 4,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
