import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../constants/config';

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
}

export const EventsScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/public/events`);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');

      // Use mock data when API fails
      setEvents(MOCK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter events based on search term
  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewEventDetails = (eventId: string) => {
    // Navigate to event details screen
    // This will need to be implemented
    console.log(`Navigate to event details for ID: ${eventId}`);
    // navigation.navigate('EventDetails', { eventId });
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleViewEventDetails(item.id)}
    >
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.eventImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.eventContent}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#4a6fa5" />
          <Text style={styles.dateText}>
            {formatDate(item.startDate)}
            {item.endDate && ` - ${formatDate(item.endDate)}`}
          </Text>
        </View>

        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDescription} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.locationContainer}>
          <FontAwesome5 name="map-marker-alt" size={14} color="#666" />
          <Text style={styles.locationText}>
            {item.isVirtual ? 'Virtual Event' : item.location || 'Location TBA'}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{item.type}</Text>
          </View>

          <View style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
            <MaterialIcons name="arrow-forward" size={16} color="#4a6fa5" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a6fa5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Events</Text>
        <Text style={styles.subtitle}>
          Join our community events, workshops, and networking opportunities
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      </View>

      {error && !events.length ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchTerm ? 'No events match your search.' : 'No upcoming events at the moment.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchEvents}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  eventsList: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImage: {
    height: 160,
    width: '100%',
  },
  eventContent: {
    padding: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#4a6fa5',
    marginLeft: 6,
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    lineHeight: 24,
  },
  eventDescription: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#718096',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#edf2f7',
  },
  tagContainer: {
    backgroundColor: '#ebf5ff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#3182ce',
    fontWeight: '500',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#4a6fa5',
    fontWeight: '500',
    marginRight: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
});

// Mock data to use when API fails
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Startup Pitch Competition',
    description: 'Join us for an exciting pitch competition where promising startups will present their innovative ideas to a panel of investors and industry experts.',
    startDate: '2025-06-15T14:00:00Z',
    endDate: '2025-06-15T18:00:00Z',
    location: 'Tech Hub, San Francisco',
    isVirtual: false,
    type: 'Competition',
    imageUrl: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    organizerId: 'admin1',
    status: 'PUBLISHED'
  },
  {
    id: '2',
    title: 'Venture Capital Workshop',
    description: 'Learn the ins and outs of securing venture capital funding for your startup. Expert VCs will share insights on what they look for in investment opportunities.',
    startDate: '2025-07-10T10:00:00Z',
    endDate: '2025-07-10T16:00:00Z',
    isVirtual: true,
    type: 'Workshop',
    organizerId: 'admin1',
    status: 'PUBLISHED'
  },
  {
    id: '3',
    title: 'Networking Mixer',
    description: 'Connect with fellow entrepreneurs, investors, and industry professionals in a casual setting. Great opportunity to expand your professional network.',
    startDate: '2025-06-25T18:30:00Z',
    location: 'Startup Lounge, Downtown',
    isVirtual: false,
    type: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    organizerId: 'admin1',
    status: 'PUBLISHED'
  },
  {
    id: '4',
    title: 'Product Design Masterclass',
    description: 'A comprehensive masterclass on product design principles for tech startups. Learn how to create user-centered designs that drive engagement and retention.',
    startDate: '2025-07-05T09:00:00Z',
    endDate: '2025-07-05T17:00:00Z',
    location: 'Design Academy',
    isVirtual: false,
    type: 'Workshop',
    imageUrl: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
    organizerId: 'admin1',
    capacity: 50,
    registrationDeadline: '2025-07-01T23:59:59Z',
    status: 'PUBLISHED'
  }
];
