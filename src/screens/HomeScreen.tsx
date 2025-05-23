import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  ImageBackground,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
  Easing,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenParamList } from '../types/user';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { Card, Chip, Divider, Surface } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '../constants/config';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Interface for the latest updates items
interface UpdateItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  date?: string;
  type: 'event' | 'announcement';
  category: string;
  createdAt: string;
  saved?: boolean;
}

// Startup Call interface
interface StartupCall {
  id: string;
  title: string;
  description: string;
  industry: string;
  location: string;
  deadline: string;
  status: 'open' | 'closed';
  createdAt: string;
  trending?: boolean;
  successRate?: number;
}

// Success story interface
interface SuccessStory {
  id: string;
  companyName: string;
  founderName: string;
  description: string;
  imageUrl: string;
  yearFounded: string;
  fundingRaised: string;
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Get relative time (e.g., "2 days ago")
const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Calculate deadline proximity (for UI indicators)
const getDeadlineProximity = (deadline: string): 'urgent' | 'approaching' | 'normal' => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 3) return 'urgent';
  if (diffDays <= 7) return 'approaching';
  return 'normal';
};

// Format currency
const formatCurrency = (amount: string) => {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ScreenParamList>>();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  
  // State management
  const [email, setEmail] = useState('');
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [calls, setCalls] = useState<StartupCall[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation values
  const scrollY = new Animated.Value(0);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  // Fetch data function
  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      // Mock data for now
      setUpdates([
        {
          id: '1',
          title: 'New Startup Call: Tech Innovation Challenge',
          description: 'Submit your tech ideas for a chance to win funding and mentorship.',
          type: 'announcement',
          category: 'funding',
          createdAt: '2025-05-20T10:00:00Z',
          saved: false
        },
        {
          id: '2',
          title: 'Upcoming Networking Event',
          description: 'Join us for a virtual networking event with industry leaders.',
          type: 'event',
          category: 'networking',
          createdAt: '2025-05-21T14:30:00Z',
          date: '2025-06-15T18:00:00Z',
          saved: true
        }
      ]);
      
      setCalls([
        {
          id: '1',
          title: 'Tech Innovation Challenge',
          description: 'Looking for innovative tech solutions to address climate change.',
          industry: 'Technology',
          location: 'Global',
          deadline: '2025-06-30T23:59:59Z',
          status: 'open',
          createdAt: '2025-05-01T10:00:00Z',
          trending: true,
          successRate: 85
        },
        {
          id: '2',
          title: 'Healthcare Solutions',
          description: 'Seeking startups with innovative healthcare technologies.',
          industry: 'Healthcare',
          location: 'North America',
          deadline: '2025-07-15T23:59:59Z',
          status: 'open',
          createdAt: '2025-05-10T14:00:00Z',
          trending: false,
          successRate: 72
        }
      ]);
      
      setSuccessStories([
        {
          id: '1',
          companyName: 'EcoTech Solutions',
          founderName: 'Sarah Johnson',
          description: 'Developed sustainable packaging materials that are now used by major retailers worldwide.',
          imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
          yearFounded: '2021',
          fundingRaised: '2500000',
        },
        {
          id: '2',
          companyName: 'HealthAI',
          founderName: 'Michael Chen',
          description: 'Created an AI-powered diagnostic tool that helps detect early signs of chronic diseases.',
          imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
          yearFounded: '2022',
          fundingRaised: '4800000',
        }
      ]);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle refresh
  const handleRefresh = () => {
    fetchData(true);
  };
  
  // Toggle save item
  const toggleSaveItem = (id: string, type: 'update' | 'call') => {
    if (type === 'update') {
      setUpdates(prevUpdates => 
        prevUpdates.map(update => 
          update.id === id ? {...update, saved: !update.saved} : update
        )
      );
    }
  };

  // Render update item with updated design
  const renderUpdateItem = ({ item }: { item: UpdateItem }) => (
    <Surface style={styles.updateCard}>
      <View style={styles.updateCardContent}>
        <View style={styles.updateHeader}>
          <View style={styles.updateTypeContainer}>
            <Icon 
              name={item.type === 'event' ? 'calendar' : 'bullhorn'} 
              size={16} 
              color="#4B7BF5" 
            />
            <Text style={styles.updateType}>
              {item.type === 'event' ? 'Event' : 'Announcement'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleSaveItem(item.id, 'update')}>
            <Icon 
              name={item.saved ? 'bookmark' : 'bookmark-outline'} 
              size={20} 
              color={item.saved ? "#4B7BF5" : "#9CA3AF"} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.updateTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.updateDescription} numberOfLines={3}>
          {item.description}
        </Text>
        
        <View style={styles.updateFooter}>
          {item.date && (
            <View style={styles.updateDateContainer}>
              <Icon name="clock-outline" size={14} color="#6B7280" />
              <Text style={styles.updateDate}>
                {getRelativeTime(item.createdAt)}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => {
              if (item.type === 'event') {
                navigation.navigate('EventDetail', { eventId: item.id });
              } else {
                navigation.navigate('AnnouncementDetails', { announcementId: item.id });
              }
            }}
          >
            <Text style={styles.readMoreText}>Read more</Text>
            <Icon name="chevron-right" size={16} color="#4B7BF5" />
          </TouchableOpacity>
        </View>
      </View>
    </Surface>
  );

  // Render feature items with updated design
  const features = [
    {
      id: '1',
      title: 'Startup Submission',
      description: 'Submit your innovative startup ideas and get noticed by investors and mentors.',
      icon: 'rocket',
      color: '#6366F1',
    },
    {
      id: '2',
      title: 'Funding',
      description: 'Connect with investors who can help fund your business vision.',
      icon: 'cash',
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Growth Tracking',
      description: 'Monitor your startup progress with our tracking tools.',
      icon: 'chart-line',
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Community',
      description: 'Join a thriving community of entrepreneurs and experts.',
      icon: 'account-group',
      color: '#EC4899',
    },
  ];

  const renderFeatureItem = ({ item }: { item: typeof features[0] }) => {
    return (
      <TouchableOpacity 
        style={[styles.featureCard, { backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }]}
        onPress={() => navigation.navigate('Home')}
      >
        <View style={[styles.featureIconContainer, { backgroundColor: `${item.color}20` }]}>
          <Icon name={item.icon as any} size={24} color={item.color} />
        </View>
        <Text style={styles.featureTitle}>{item.title}</Text>
        <Text style={styles.featureDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={['#4B7BF5']}
            tintColor="#4B7BF5"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header with user greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>
              {new Date().getHours() < 12 ? 'Good morning' : 
               new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}
            </Text>
            <Text style={styles.userName}>
              {user ? user.name : 'Welcome back'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.avatar}>
              {user?.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <Icon name="account" size={24} color="#4B7BF5" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity>
          <Icon name="magnify" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search for startups, events...</Text>
        </TouchableOpacity>

        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>
                Discover your next{'\n'}big opportunity
              </Text>
              <Text style={styles.heroSubtitle}>
                Connect with investors and grow your startup
              </Text>
              <TouchableOpacity 
                style={styles.heroButton}
                onPress={() => navigation.navigate('StartupCalls')}
              >
                <Text style={styles.heroButtonText}>Explore Now</Text>
                <Icon name="arrow-right" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Quick actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity>
            <View style={[styles.quickActionIcon, { backgroundColor: '#EEF2FF' }]}>
              <Icon name="lightbulb-outline" size={20} color="#4B7BF5" />
            </View>
            <Text style={styles.quickActionText}>Submit Idea</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction} onPress={() => navigation.navigate('Events')}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Icon name="calendar" size={20} color="#10B981" />
            </View>
            <Text style={styles.quickActionText}>Events</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="book" size={20} color="#D97706" />
            </View>
            <Text style={styles.quickActionText}>Resources</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#F3E8FF' }]}>
              <Icon name="account-group" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.quickActionText}>Network</Text>
          </TouchableOpacity>
        </View>

        {/* Latest Updates Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4B7BF5" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={24} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : updates.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No updates available</Text>
            </View>
          ) : (
            <FlatList
              data={updates}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderUpdateItem}
              contentContainerStyle={styles.updatesList}
            />
          )}
        </View>

        {/* Features Section */}
        <View style={[styles.section, { backgroundColor: '#F9FAFB' }]}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need to grow your startup
          </Text>
          
          <View style={styles.featuresGrid}>
            {features.map((feature) => (
              <React.Fragment key={feature.id}>
                {renderFeatureItem({ item: feature })}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Startup Calls Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Calls</Text>
            <TouchableOpacity onPress={() => navigation.navigate('StartupCalls')}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {calls.length > 0 ? (
            <View style={styles.callsContainer}>
              {calls.slice(0, 2).map((call) => (
                <View key={call.id} style={styles.callCard}>
                  <View style={styles.callHeader}>
                    <Text style={styles.callTitle}>{call.title}</Text>
                    {call.trending && (
                      <View style={styles.trendingBadge}>
                        <Icon name="trending-up" size={14} color="#FFF" />
                        <Text style={styles.trendingText}>Trending</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.callDescription} numberOfLines={2}>
                    {call.description}
                  </Text>
                  <View style={styles.callDetails}>
                    <View style={styles.callDetailItem}>
                      <Icon name="map-marker" size={14} color="#6B7280" />
                      <Text style={styles.callDetailText}>{call.location}</Text>
                    </View>
                    <View style={styles.callDetailItem}>
                      <Icon name="clock-outline" size={14} color="#6B7280" />
                      <Text style={styles.callDetailText}>
                        {getDeadlineProximity(call.deadline) === 'urgent' ? 'Closing soon' : 
                         getDeadlineProximity(call.deadline) === 'approaching' ? 'Ending in 7 days' : 
                         `Until ${formatDate(call.deadline)}`}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => navigation.navigate('CallDetails', { callId: call.id })}
                  >
                    <Text style={styles.callButtonText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active calls at this time</Text>
            </View>
          )}
        </View>

        {/* Success Stories */}
        <View style={[styles.section, { backgroundColor: '#F9FAFB' }]}>
          <Text style={styles.sectionTitle}>Success Stories</Text>
          <Text style={styles.sectionSubtitle}>
            Startups that found success through our platform
          </Text>
          
          {successStories.length > 0 ? (
            <FlatList
              data={successStories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.successCard}>
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.successImage} 
                  />
                  <View style={styles.successContent}>
                    <Text style={styles.successCompany}>{item.companyName}</Text>
                    <Text style={styles.successFounder}>{item.founderName}</Text>
                    <Text style={styles.successDescription} numberOfLines={3}>
                      {item.description}
                    </Text>
                    <View style={styles.successStats}>
                      <View style={styles.successStat}>
                        <Text style={styles.successStatValue}>{item.yearFounded}</Text>
                        <Text style={styles.successStatLabel}>Founded</Text>
                      </View>
                      <View style={styles.successStat}>
                        <Text style={styles.successStatValue}>{formatCurrency(item.fundingRaised)}</Text>
                        <Text style={styles.successStatLabel}>Raised</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.successList}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No success stories available</Text>
            </View>
          )}
        </View>

        {/* Newsletter CTA */}
        <View style={[styles.section, styles.newsletterSection]}>
          <Icon name="email-newsletter" size={40} color="#4B7BF5" style={styles.newsletterIcon} />
          <Text style={styles.newsletterTitle}>Stay Updated</Text>
          <Text style={styles.newsletterText}>
            Subscribe to our newsletter for the latest opportunities and resources
          </Text>
          
          <View style={styles.newsletterForm}>
            <TextInput
              style={styles.emailInput}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.subscribeButton}>
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  heroBanner: {
    height: 180,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'center',
  },
  heroImageStyle: {
    opacity: 0.9,
  },
  heroContent: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: 16,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4B7BF5',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickAction: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  viewAllLink: {
    color: '#4B7BF5',
    fontWeight: '500',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#6B7280',
  },
  updatesList: {
    paddingBottom: 8,
  },
  updateCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  updateCardContent: {
    flex: 1,
  },
  updateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  updateTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateType: {
    fontSize: 12,
    color: '#4B7BF5',
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  updateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  updateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  updateDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 12,
    color: '#4B7BF5',
    fontWeight: '500',
    marginRight: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  callsContainer: {
    marginTop: 8,
  },
  callCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  callTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  trendingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  callDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  callDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  callDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  callDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  callButton: {
    backgroundColor: '#4B7BF5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  successList: {
    paddingBottom: 8,
  },
  successCard: {
    width: width * 0.7,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  successImage: {
    width: '100%',
    height: 120,
  },
  successContent: {
    padding: 16,
  },
  successCompany: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  successFounder: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  successDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  successStats: {
    flexDirection: 'row',
  },
  successStat: {
    marginRight: 16,
  },
  successStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  successStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  newsletterSection: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    paddingVertical: 32,
  },
  newsletterIcon: {
    marginBottom: 8,
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  newsletterText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  newsletterForm: {
    width: '100%',
    maxWidth: 400,
  },
  emailInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  subscribeButton: {
    backgroundColor: '#4B7BF5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  }
});