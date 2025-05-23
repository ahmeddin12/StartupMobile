import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants/config';
import { ScreenParamList } from '../types/user';

type EventDetailRouteProp = RouteProp<ScreenParamList, 'EventDetail'>;
type EventDetailNavigationProp = StackNavigationProp<ScreenParamList, 'EventDetail'>;

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  isVirtual: boolean;
  type: string;
  imageUrl?: string;
  organizerId: string;
  capacity?: number;
  registrationDeadline?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  organizer?: {
    name: string;
    email: string;
  };
  registeredCount?: number;
}

export const EventDetailScreen = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation<EventDetailNavigationProp>();
  const { eventId } = route.params;

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const response = await axios.get(`${API_URL}/public/events/${eventId}`);
      // setEvent(response.data);
      
      // For now, use mock data
      const mockEvent = MOCK_EVENTS.find(e => e.id === eventId);
      if (mockEvent) {
        setEvent(mockEvent);
        setError(null);
      } else {
        setError('Event not found');
      }
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Failed to load event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);
      // Mock registration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be an API call
      // await axios.post(`${API_URL}/events/${eventId}/register`);
      
      setIsRegistered(true);
      Alert.alert(
        'Registration Successful',
        'You have successfully registered for this event. You will receive an email with more details.',
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Error registering for event:', err);
      Alert.alert('Registration Failed', 'Unable to register for the event. Please try again later.');
    } finally {
      setRegistering(false);
    }
  };

  // Format date helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a6fa5" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Event not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEventDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.retryButton, { marginTop: 12, backgroundColor: '#718096' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isRegistrationOpen = () => {
    if (event.status !== 'PUBLISHED') return false;
    if (event.registrationDeadline) {
      return new Date() < new Date(event.registrationDeadline);
    }
    return true;
  };

  const isFull = () => {
    if (!event.capacity) return false;
    return (event.registeredCount || 0) >= event.capacity;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {event.imageUrl ? (
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.headerImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.headerImage, styles.placeholderImage]}>
          <MaterialCommunityIcons name="calendar-blank" size={60} color="#cbd5e0" />
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{event.type}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#4a6fa5" />
            <Text style={styles.infoText}>
              {formatDate(event.startDate)}
              {event.endDate && event.startDate.split('T')[0] !== event.endDate.split('T')[0] && 
                ` - ${formatDate(event.endDate)}`}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#4a6fa5" />
            <Text style={styles.infoText}>
              {formatTime(event.startDate)}
              {event.endDate && ` - ${formatTime(event.endDate)}`}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <FontAwesome5 
              name={event.isVirtual ? "laptop" : "map-marker-alt"} 
              size={18} 
              color="#4a6fa5" 
            />
            <Text style={styles.infoText}>
              {event.isVirtual ? 'Virtual Event' : event.location || 'Location TBA'}
            </Text>
          </View>

          {event.capacity && (
            <View style={styles.infoItem}>
              <MaterialIcons name="people" size={20} color="#4a6fa5" />
              <Text style={styles.infoText}>
                Capacity: {event.registeredCount || 0}/{event.capacity}
              </Text>
            </View>
          )}

          {event.registrationDeadline && (
            <View style={styles.infoItem}>
              <MaterialIcons name="event-available" size={20} color="#4a6fa5" />
              <Text style={styles.infoText}>
                Registration Deadline: {formatDate(event.registrationDeadline)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {event.organizer && (
          <View style={styles.organizerSection}>
            <Text style={styles.sectionTitle}>Organizer</Text>
            <View style={styles.organizer}>
              <View style={styles.organizerAvatar}>
                <Text style={styles.organizerInitial}>
                  {event.organizer.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.organizerName}>{event.organizer.name}</Text>
                <Text style={styles.organizerEmail}>{event.organizer.email}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actionSection}>
          {isRegistered ? (
            <View style={styles.registeredContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#48bb78" />
              <Text style={styles.registeredText}>You're registered for this event</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.registerButton,
                (!isRegistrationOpen() || isFull()) && styles.disabledButton
              ]}
              disabled={!isRegistrationOpen() || isFull() || registering}
              onPress={handleRegister}
            >
              {registering ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="calendar-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.registerButtonText}>
                    {isFull() ? 'Event Full' : !isRegistrationOpen() ? 'Registration Closed' : 'Register Now'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-social-outline" size={20} color="#4a6fa5" style={styles.buttonIcon} />
            <Text style={styles.shareButtonText}>Share Event</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
    marginRight: 12,
  },
  tagContainer: {
    backgroundColor: '#ebf5ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#3182ce',
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 24,
    backgroundColor: '#f9fafc',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#4a5568',
    marginLeft: 12,
  },
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#4a5568',
    lineHeight: 22,
  },
  organizerSection: {
    marginBottom: 24,
  },
  organizer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafc',
    borderRadius: 12,
    padding: 16,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a6fa5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  organizerInitial: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
    marginBottom: 4,
  },
  organizerEmail: {
    fontSize: 14,
    color: '#718096',
  },
  actionSection: {
    marginBottom: 30,
  },
  registeredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fff4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  registeredText: {
    fontSize: 16,
    color: '#48bb78',
    fontWeight: '500',
    marginLeft: 12,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a6fa5',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  registerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#cbd5e0',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4a6fa5',
    borderRadius: 12,
    paddingVertical: 16,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#4a6fa5',
    fontWeight: '500',
  },
  buttonIcon: {
    marginRight: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
});

// Mock events data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Startup Pitch Competition',
    description: 'Join us for an exciting pitch competition where promising startups will present their innovative ideas to a panel of investors and industry experts. Selected startups will have 5 minutes to pitch, followed by a 3-minute Q&A session. The winner will receive $10,000 in funding and mentorship opportunities with leading industry figures. Networking opportunities will be available after the competition.\n\nThis event is perfect for:  \n- Early-stage startups looking for funding  \n- Investors seeking new opportunities  \n- Industry professionals interested in innovation  \n- Anyone passionate about entrepreneurship',
    startDate: '2025-06-15T14:00:00Z',
    endDate: '2025-06-15T18:00:00Z',
    location: 'Tech Hub, San Francisco',
    isVirtual: false,
    type: 'Competition',
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    organizerId: 'admin1',
    organizer: {
      name: 'Sarah Johnson',
      email: 'sarah@techhub.com'
    },
    capacity: 150,
    registeredCount: 120,
    status: 'PUBLISHED'
  },
  {
    id: '2',
    title: 'Venture Capital Workshop',
    description: 'Learn the ins and outs of securing venture capital funding for your startup. Expert VCs will share insights on what they look for in investment opportunities, how to create a compelling pitch deck, and strategies for successful fundraising. This workshop will include interactive sessions where participants can practice their pitches and receive feedback.\n\nTopics covered:  \n- Understanding the VC landscape  \n- Building relationships with investors  \n- Creating a solid business model  \n- Valuation methods  \n- Term sheet negotiation  \n- Common pitfalls to avoid',
    startDate: '2025-07-10T10:00:00Z',
    endDate: '2025-07-10T16:00:00Z',
    isVirtual: true,
    type: 'Workshop',
    organizerId: 'admin1',
    organizer: {
      name: 'Michael Chen',
      email: 'michael@vcpartners.com'
    },
    capacity: 100,
    registeredCount: 45,
    registrationDeadline: '2025-07-08T23:59:59Z',
    status: 'PUBLISHED'
  },
  {
    id: '3',
    title: 'Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and industry professionals in a casual setting. Great opportunity to expand your professional network, exchange ideas, and foster potential collaborations. Light refreshments and drinks will be provided.\n\nWho should attend:  \n- Entrepreneurs at any stage  \n- Angel investors and VCs  \n- Industry professionals  \n- Startup mentors and advisors  \n- Business development executives',
    startDate: '2025-06-25T18:30:00Z',
    endDate: '2025-06-25T21:30:00Z',
    location: 'Startup Lounge, Downtown',
    isVirtual: false,
    type: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    organizerId: 'admin1',
    organizer: {
      name: 'David Wilson',
      email: 'david@startupnetwork.org'
    },
    capacity: 75,
    registeredCount: 75,
    status: 'PUBLISHED'
  },
  {
    id: '4',
    title: 'Product Design Masterclass',
    description: 'A comprehensive masterclass on product design principles for tech startups. Learn how to create user-centered designs that drive engagement and retention. This hands-on workshop will cover the entire design thinking process, from empathy and problem definition to ideation, prototyping, and testing.\n\nYou will learn:  \n- Design thinking methodology  \n- User research techniques  \n- Wireframing and prototyping  \n- Usability testing  \n- Mobile and responsive design principles  \n- Design systems and scalability',
    startDate: '2025-07-05T09:00:00Z',
    endDate: '2025-07-05T17:00:00Z',
    location: 'Design Academy',
    isVirtual: false,
    type: 'Workshop',
    imageUrl: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    organizerId: 'admin1',
    organizer: {
      name: 'Emma Rodriguez',
      email: 'emma@designacademy.com'
    },
    capacity: 50,
    registeredCount: 32,
    registrationDeadline: '2025-07-01T23:59:59Z',
    status: 'PUBLISHED'
  }
];
