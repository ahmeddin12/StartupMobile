import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { Chip, Divider } from 'react-native-paper';
import { StartupCallsService, StartupCall } from '../services/startupCalls';
import { useAuth } from '../contexts/AuthContext';
import { ScreenParamList } from '../types/user';

type CallApplicationRouteProp = RouteProp<ScreenParamList, 'CallApplication'>;
type CallApplicationNavigationProp = StackNavigationProp<ScreenParamList, 'CallApplication'>;

interface FormData {
  startupName: string;
  website: string;
  foundingDate: string;
  teamSize: string;
  industry: string;
  stage: string;
  description: string;
  problem: string;
  solution: string;
  traction: string;
  businessModel: string;
  funding: string;
  useOfFunds: string;
  competitiveAdvantage: string;
  founderBio: string;
  termsAgreed: boolean;
}

export const CallApplicationScreen = () => {
  const [formData, setFormData] = useState<FormData>({
    startupName: '',
    website: '',
    foundingDate: '',
    teamSize: '',
    industry: '',
    stage: '',
    description: '',
    problem: '',
    solution: '',
    traction: '',
    businessModel: '',
    funding: '',
    useOfFunds: '',
    competitiveAdvantage: '',
    founderBio: '',
    termsAgreed: false
  });
  
  const [loading, setLoading] = useState(false);
  const [callDetails, setCallDetails] = useState<StartupCall | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);
  const navigation = useNavigation<CallApplicationNavigationProp>();
  const route = useRoute<CallApplicationRouteProp>();
  const { callId } = route.params;
  const { user } = useAuth();

  // Form steps for better UX
  const formSteps = [
    { 
      title: 'Basic Information', 
      fields: ['startupName', 'website', 'foundingDate', 'teamSize', 'industry', 'stage'] 
    },
    { 
      title: 'Startup Overview', 
      fields: ['description', 'problem', 'solution', 'traction'] 
    },
    { 
      title: 'Business Details', 
      fields: ['businessModel', 'funding', 'useOfFunds', 'competitiveAdvantage'] 
    },
    { 
      title: 'Founder & Terms', 
      fields: ['founderBio', 'termsAgreed'] 
    },
  ];

  // Fetch call details on component mount
  React.useEffect(() => {
    const fetchCallDetails = async () => {
      try {
        const call = await StartupCallsService.getCallById(callId);
        setCallDetails(call);
      } catch (error) {
        console.error('Error fetching call details:', error);
        Alert.alert('Error', 'Failed to load call details. Please try again.');
      }
    };

    fetchCallDetails();
  }, [callId]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateCurrentStep = () => {
    const currentStepFields = formSteps[activeStep].fields as (keyof FormData)[];
    for (const field of currentStepFields) {
      // Skip validation for optional fields and termsAgreed (handled separately)
      if (field === 'website' || field === 'termsAgreed') continue;
      
      if (!formData[field]) {
        Alert.alert('Validation Error', `Please fill in the ${formatFieldLabel(field)} field.`);
        return false;
      }
    }
    
    // Special validation for the final step with terms and conditions
    if (activeStep === formSteps.length - 1 && !formData.termsAgreed) {
      Alert.alert('Terms Required', 'You must agree to the terms and conditions to proceed.');
      return false;
    }
    
    return true;
  };

  const formatFieldLabel = (field: string): string => {
    // Convert camelCase to Title Case with spaces
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (activeStep < formSteps.length - 1) {
        setActiveStep(activeStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleTermsAgreedChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      termsAgreed: value
    }));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    try {
      setLoading(true);
      console.log('Submitting application for call ID:', callId);
      console.log('Form data being submitted:', formData);
      
      await StartupCallsService.applyForCall(callId, formData);
      
      Alert.alert(
        'Application Submitted',
        'Your application has been submitted successfully!',
        [{ 
          text: 'OK', 
          onPress: () => navigation.navigate('Home') 
        }]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit your application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    const currentStepFields = formSteps[activeStep].fields as (keyof FormData)[];
    
    return currentStepFields.map((field) => (
      <View key={field} style={styles.formGroup}>
        {field === 'termsAgreed' ? (
          <View style={styles.termsContainer}>
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[styles.checkbox, formData.termsAgreed && styles.checkboxChecked]}
                onPress={() => handleTermsAgreedChange(!formData.termsAgreed)}
              >
                {formData.termsAgreed && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the terms and conditions for submitting this application
              </Text>
            </View>
            <Text style={styles.termsNote}>
              By submitting this application, you confirm that all information provided is accurate
              and complete. Your application will be reviewed by the call administrators.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>{formatFieldLabel(field)}</Text>
            {field === 'description' || field === 'problem' || field === 'solution' || 
             field === 'businessModel' || field === 'competitiveAdvantage' || field === 'founderBio' ? (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData[field].toString()}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            ) : field === 'teamSize' ? (
              <TextInput
                style={styles.input}
                value={formData[field].toString()}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
                keyboardType="number-pad"
              />
            ) : field === 'foundingDate' ? (
              <TextInput
                style={styles.input}
                value={formData[field].toString()}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholder="YYYY-MM-DD"
              />
            ) : field === 'industry' || field === 'stage' ? (
              <View style={styles.pickerContainer}>
                <TextInput
                  style={styles.input}
                  value={formData[field].toString()}
                  onChangeText={(text) => handleInputChange(field, text)}
                  placeholder={field === 'industry' ? 'e.g. Fintech, Healthcare, AI' : 'e.g. Seed, Series A, Growth'}
                />
              </View>
            ) : (
              <TextInput
                style={styles.input}
                value={formData[field].toString()}
                onChangeText={(text) => handleInputChange(field, text)}
                placeholder={`Enter ${formatFieldLabel(field).toLowerCase()}`}
              />
            )}
          </>
        )}
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Call Information */}
        {callDetails && (
          <View style={styles.callInfo}>
            <Text style={styles.callTitle}>{callDetails.title}</Text>
            <View style={styles.deadlineContainer}>
              <Ionicons name="time-outline" size={16} color="#e53e3e" />
              <Text style={styles.deadlineText}>
                Application Deadline: {new Date(callDetails.applicationDeadline || '').toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}

        {/* Stepper */}
        <View style={styles.stepper}>
          {formSteps.map((step, index) => (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.stepCircle,
                  activeStep >= index ? styles.activeStep : styles.inactiveStep,
                ]}
              >
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              {index < formSteps.length - 1 && (
                <View
                  style={[
                    styles.stepConnector,
                    activeStep > index ? styles.activeConnector : styles.inactiveConnector,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Step Title */}
        <View style={styles.stepTitleContainer}>
          <Text style={styles.stepTitle}>{formSteps[activeStep].title}</Text>
          <Text style={styles.stepSubtitle}>
            Step {activeStep + 1} of {formSteps.length}
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>{renderFormFields()}</View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          {activeStep > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.backButton]}
              onPress={handleBack}
              disabled={loading}
            >
              <Ionicons name="arrow-back" size={20} color="#4a5568" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.nextButton, loading && styles.disabledButton]}
            onPress={activeStep === formSteps.length - 1 ? handleSubmit : handleNext}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>
                  {activeStep === formSteps.length - 1 ? 'Submit' : 'Next'}
                </Text>
                {activeStep !== formSteps.length - 1 && (
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#718096',
  },
  pickerContainer: {
    marginBottom: 8,
  },
  termsContainer: {
    backgroundColor: '#f3f7fc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4a6fa5',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a6fa5',
  },
  termsText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    fontWeight: '500',
  },
  termsNote: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
  },
  callInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  callTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    marginLeft: 6,
    color: '#e53e3e',
    fontSize: 14,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#4a6fa5',
  },
  inactiveStep: {
    backgroundColor: '#cbd5e0',
  },
  stepNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepConnector: {
    height: 2,
    width: 40,
  },
  activeConnector: {
    backgroundColor: '#4a6fa5',
  },
  inactiveConnector: {
    backgroundColor: '#cbd5e0',
  },
  stepTitleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#718096',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#2d3748',
    backgroundColor: '#f8fafc',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#f7fafc',
    borderWidth:1,
    borderColor: '#e2e8f0',
  },
  nextButton: {
    backgroundColor: '#4a6fa5',
    flex: 1,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#4a5568',
    fontWeight: '500',
  },
  nextButtonText: {
    marginRight: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});
