import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from "react-native";
import { TextInput, Button, Checkbox, Divider, ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenParamList, UserRole } from "../../types/user";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  navigation: NativeStackNavigationProp<ScreenParamList>;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(UserRole.ENTREPRENEUR);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  const validateInputs = () => {
    let isValid = true;
    
    // Name validation
    if (!fullName) {
      setNameError('Full name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
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
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    // Terms validation
    if (!agreeToTerms) {
      setTermsError('You must agree to the Terms of Service and Privacy Policy');
      isValid = false;
    } else {
      setTermsError('');
    }
    
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    
    setLoading(true);

    try {
      const result = await register({
        name: fullName,
        email,
        password,
        role
      });
      
      if (result.success) {
        // Navigation will be handled by the auth context
        console.log('Registration successful');
      } else {
        Alert.alert('Registration Failed', result.error || 'Please try again');
      }
    } catch (err) {
      console.error('Register error:', err);
      Alert.alert(
        'Registration Failed',
        err instanceof Error ? err.message : 'Please try again'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    Alert.alert('Info', `${provider} login not implemented yet`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create your account</Text>
          
          <View style={styles.accountLinkContainer}>
            <Text style={styles.accountText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Auth")}>
              <Text style={styles.accountLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            {/* Full name input */}
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (nameError) setNameError('');
              }}
              style={styles.input}
              autoCapitalize="words"
              error={!!nameError}
              mode="outlined"
              outlineColor="#E5E7EB"
              activeOutlineColor="#6366F1"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            
            {/* Email input */}
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
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
            
            {/* Password input */}
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
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
            
            {/* Confirm password input */}
            <Text style={styles.inputLabel}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmPasswordError) setConfirmPasswordError('');
              }}
              style={styles.input}
              secureTextEntry
              error={!!confirmPasswordError}
              mode="outlined"
              outlineColor="#E5E7EB"
              activeOutlineColor="#6366F1"
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            
            {/* Role selection */}
            <Text style={styles.inputLabel}>I am a</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={(itemValue) => setRole(itemValue as UserRole)}
                style={styles.picker}
              >
                <Picker.Item label="Entrepreneur" value={UserRole.ENTREPRENEUR} />
                <Picker.Item label="Investor" value={UserRole.SPONSOR} />
                <Picker.Item label="Reviewer" value={UserRole.REVIEWER} />
              </Picker>
            </View>
            
            {/* Terms agreement */}
            <View style={styles.termsContainer}>
              <Checkbox.Android
                status={agreeToTerms ? 'checked' : 'unchecked'}
                onPress={() => {
                  setAgreeToTerms(!agreeToTerms);
                  if (termsError) setTermsError('');
                }}
                color="#6366F1"
              />
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text 
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('TermsOfService')}
                >
                  Terms of Service
                </Text>
                {' '}and{' '}
                <Text 
                  style={styles.termsLink}
                  onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
            {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}
            
            {/* Sign up button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              style={styles.createButton}
              disabled={loading}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              color="#6366F1"
            >
              {loading ? <ActivityIndicator color="#fff" size={20} /> : 'Create account'}
            </Button>
            
            {/* Social login options */}
            <View style={styles.orContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>Or continue with</Text>
              <View style={styles.divider} />
            </View>
            
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialLogin('Google')}
              >
                <View style={styles.socialButtonContent}>
                  <Text style={styles.socialButtonText}>Google</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.socialButton} 
                onPress={() => handleSocialLogin('GitHub')}
              >
                <View style={styles.socialButtonContent}>
                  <Text style={styles.socialButtonText}>GitHub</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: '#4F46E5',
  },
  accountLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  accountText: {
    color: '#6B7280',
    fontSize: 14,
  },
  accountLink: {
    color: '#6366F1',
    fontSize: 14,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    color: '#4B5563',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  termsText: {
    color: '#4B5563',
    fontSize: 14,
    flex: 1,
    marginLeft: 8,
  },
  termsLink: {
    color: '#6366F1',
    fontWeight: '500',
  },
  createButton: {
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
});
