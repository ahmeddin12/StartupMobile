import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Text, Button, Divider, Chip } from 'react-native-paper';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { StartupCallsService, StartupCall, ApplicationStatus } from '../services/startupCalls';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenParamList } from '../types/user';
import { UserRole } from '../types/user';

type CallDetailRouteProp = RouteProp<ScreenParamList, 'CallDetails'>;
type CallDetailsNavigationProp = StackNavigationProp<ScreenParamList>;

export const CallDetailsScreen = () => {
  const [call, setCall] = useState<StartupCall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<CallDetailRouteProp>();
  const navigation = useNavigation<CallDetailsNavigationProp>();
  const { callId } = route.params;
  const { user } = useAuth();

  useEffect(() => {
    fetchCallDetails();
  }, [callId]);

  const fetchCallDetails = async () => {
    try {
      setLoading(true);
      const data = await StartupCallsService.getCallById(callId);
      setCall(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching call details:', err);
      setError('Failed to load call details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to apply for this call.');
      return;
    }

    if (user.role !== UserRole.ENTREPRENEUR) {
      Alert.alert(
        'Permission Denied',
        'Only entrepreneurs can apply for startup calls.'
      );
      return;
    }

    // Navigate to application screen
    navigation.navigate('CallApplication', { callId });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysLeft = (deadline?: string) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return '#4CAF50';
      case 'CLOSED':
        return '#F44336';
      case 'DRAFT':
        return '#FFC107';
      case 'ARCHIVED':
        return '#9E9E9E';
      default:
        return '#000000';
    }
  };

  const getApplicationStatusColor = (status?: ApplicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return '#4CAF50';
      case 'REJECTED':
        return '#F44336';
      case 'UNDER_REVIEW':
        return '#FFC107';
      case 'SUBMITTED':
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };
  
  const getApplicationStatusText = (status?: ApplicationStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'SUBMITTED':
        return 'Submitted';
      default:
        return 'Not Applied';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !call) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Call not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCallDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const daysLeft = getDaysLeft(call.applicationDeadline);
  const isDeadlinePassed = daysLeft <= 0;
  const canApply = 
    call.status === 'PUBLISHED' && 
    !isDeadlinePassed && 
    (!call.applicationStatus || call.applicationStatus === 'NOT_APPLIED');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroContainer}>
        <View style={styles.badgesContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(call.status) }]}>
            <Ionicons name="checkmark-circle" size={16} color="#fff" style={styles.badgeIcon} />
            <Text style={styles.statusText}>{call.status}</Text>
          </View>
          
          {call.applicationStatus && call.applicationStatus !== 'NOT_APPLIED' && (
            <View style={[styles.applicationBadge, { backgroundColor: getApplicationStatusColor(call.applicationStatus) }]}>
              <Ionicons 
                name={call.applicationStatus === 'APPROVED' ? 'checkmark-circle' : 
                      call.applicationStatus === 'REJECTED' ? 'close-circle' : 'time'} 
                size={16} 
                color="#fff" 
                style={styles.badgeIcon} 
              />
              <Text style={styles.statusText}>{getApplicationStatusText(call.applicationStatus)}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.title}>{call.title}</Text>
        
        {!isDeadlinePassed && daysLeft > 0 ? (
          <View style={styles.deadlineHighlight}>
            <Ionicons name="alarm-outline" size={20} color="#fff" />
            <Text style={styles.deadlineHighlightText}>
              {daysLeft} {daysLeft === 1 ? 'day' : 'days'} left to apply
            </Text>
          </View>
        ) : isDeadlinePassed ? (
          <View style={[styles.deadlineHighlight, styles.deadlineExpired]}>
            <Ionicons name="alarm-outline" size={20} color="#fff" />
            <Text style={styles.deadlineHighlightText}>
              Application period has ended
            </Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.metadataContainer}>
        <View style={styles.metadataCard}>
          <View style={styles.metadataItem}>
            <FontAwesome5 name="industry" size={18} color="#4a6fa5" style={styles.metadataIcon} />
            <View>
              <Text style={styles.metadataLabel}>Industry</Text>
              <Text style={styles.metadataValue}>{call.industry || 'Various Industries'}</Text>
            </View>
          </View>
          
          <View style={styles.metadataDivider} />
          
          <View style={styles.metadataItem}>
            <Ionicons name="location-outline" size={18} color="#4a6fa5" style={styles.metadataIcon} />
            <View>
              <Text style={styles.metadataLabel}>Location</Text>
              <Text style={styles.metadataValue}>{call.location || 'Global'}</Text>
            </View>
          </View>
          
          <View style={styles.metadataDivider} />
          
          <View style={styles.metadataItem}>
            <MaterialIcons name="attach-money" size={18} color="#4a6fa5" style={styles.metadataIcon} />
            <View>
              <Text style={styles.metadataLabel}>Funding</Text>
              <Text style={styles.metadataValue}>{call.fundingAmount || 'Not specified'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.timelineCard}>
          <View style={styles.timelineItem}>
            <Ionicons name="calendar-outline" size={18} color="#4a6fa5" />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Published</Text>
              <Text style={styles.timelineDate}>{formatDate(call.publishedDate)}</Text>
            </View>
          </View>
          
          <View style={styles.timelineDivider} />
          
          <View style={styles.timelineItem}>
            <Ionicons 
              name="time-outline" 
              size={18} 
              color={isDeadlinePassed ? '#F44336' : '#4a6fa5'} 
            />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Application Deadline</Text>
              <Text 
                style={[
                  styles.timelineDate, 
                  isDeadlinePassed && styles.deadlinePassed
                ]}
              >
                {formatDate(call.applicationDeadline)}
                {isDeadlinePassed && ' (Expired)'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{call.description}</Text>
      </View>
      
      {call.requirements && call.requirements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {call.requirements.map((req, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{req}</Text>
            </View>
          ))}
        </View>
      )}
      
      {call.eligibilityCriteria && call.eligibilityCriteria.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          {call.eligibilityCriteria.map((criteria, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{criteria}</Text>
            </View>
          ))}
        </View>
      )}
      
      {call.selectionProcess && call.selectionProcess.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selection Process</Text>
          {call.selectionProcess.map((process, index) => (
            <View key={index} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>{index + 1}.</Text>
              <Text style={styles.bulletText}>{process}</Text>
            </View>
          ))}
        </View>
      )}
      
      {call.aboutSponsor && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Sponsor</Text>
          <Text style={styles.description}>{call.aboutSponsor}</Text>
        </View>
      )}
      
      {call.applicationProcess && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Process</Text>
          <Text style={styles.description}>{call.applicationProcess}</Text>
        </View>
      )}
      
      <View style={styles.actionContainer}>
        {canApply ? (
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.applyClosed}>
            <Text style={styles.applyClosedText}>
              {call.applicationStatus && call.applicationStatus !== 'NOT_APPLIED' 
                ? 'You have already applied for this call' 
                : isDeadlinePassed 
                  ? 'Application deadline has passed' 
                  : call.status !== 'PUBLISHED' 
                    ? 'This call is not open for applications' 
                    : 'Applications closed'}
            </Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Hero section styles
  heroContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 8,
  },
  badgeIcon: {
    marginRight: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  applicationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  deadlineHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  deadlineHighlightText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  deadlineExpired: {
    backgroundColor: '#e53e3e',
  },
  // Metadata section styles
  metadataContainer: {
    padding: 16,
  },
  metadataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  metadataIcon: {
    marginRight: 12,
    width: 28,
    alignItems: 'center',
  },
  metadataLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 15,
    color: '#2d3748',
    fontWeight: '500',
  },
  metadataDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  // Timeline section styles
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  timelineContent: {
    marginLeft: 12,
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    color: '#718096',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 15,
    color: '#2d3748',
    fontWeight: '500',
  },
  timelineDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  // Original styles
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  deadlineContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deadlinePassed: {
    color: '#F44336',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 16,
    fontSize: 16,
    color: '#4a6fa5',
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginTop: 20,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  applyClosed: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyClosedText: {
    color: '#757575',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 0.25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 2,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
