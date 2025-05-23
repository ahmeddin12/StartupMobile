import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { ScreenParamList } from '../types/user';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AnnouncementDetailsScreenRouteProp = RouteProp<ScreenParamList, 'AnnouncementDetails'>;

type AnnouncementDetailsScreenProps = {
  route: AnnouncementDetailsScreenRouteProp;
  navigation: NativeStackNavigationProp<ScreenParamList, 'AnnouncementDetails'>;
};

// Define the announcement type
interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author?: string;
  imageUrl?: string;
}

export const AnnouncementDetailsScreen: React.FC<AnnouncementDetailsScreenProps> = ({ route, navigation }) => {
  const { announcementId } = route.params;
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the announcement data from your API
    // For now, we'll simulate a fetch with a timeout
    const fetchAnnouncementDetails = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - in a real app, this would come from your API
        const mockAnnouncement: Announcement = {
          id: announcementId,
          title: 'Important Program Update',
          content: 'We are excited to announce new resources available for all entrepreneurs in our program. Starting next month, all participants will have access to our new mentorship platform and expanded funding opportunities.\n\nPlease check your email for more details about how to access these resources and make the most of these new opportunities.',
          date: '2025-05-15',
          author: 'Program Director',
        };
        
        setAnnouncement(mockAnnouncement);
        setLoading(false);
      } catch (err) {
        setError('Failed to load announcement details');
        setLoading(false);
        console.error('Error fetching announcement:', err);
      }
    };

    fetchAnnouncementDetails();
  }, [announcementId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading announcement details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!announcement) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Announcement not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.date}>{new Date(announcement.date).toLocaleDateString()}</Text>
        <Text style={styles.title}>{announcement.title}</Text>
        {announcement.author && (
          <Text style={styles.author}>By: {announcement.author}</Text>
        )}
        <View style={styles.divider} />
        <Text style={styles.content}>{announcement.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4F46E5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: '#4F46E5',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
});
