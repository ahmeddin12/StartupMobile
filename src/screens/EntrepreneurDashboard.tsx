import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { Card, Button, ActivityIndicator, Chip, Divider, Badge, SegmentedButtons, Title, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import api, { endpoints } from "../services/api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScreenParamList } from "../types/user";
import { StartupCall } from "../services/startupCalls";

type DashboardNavigationProp = StackNavigationProp<ScreenParamList>;

interface Startup {
  id: string;
  name: string;
  status: string;
  score: number | null;
  createdAt: string;
  description?: string;
}

// Using imported StartupCall interface from services/startupCalls

interface Application {
  id: string;
  callId: string;
  callTitle: string;
  status: string;
  submittedAt: string;
  lastUpdated: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  isVirtual: boolean;
  registrationOpen: boolean;
}

type DashboardCardProps = {
  title: string;
  icon: string;
  count: number | string;
  onPress?: () => void;
};

const DashboardCard = ({ title, icon, count, onPress }: DashboardCardProps) => {
  return (
    <TouchableOpacity style={styles.dashboardCard} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={icon} size={24} color="#007AFF" />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCount}>{count}</Text>
    </TouchableOpacity>
  );
};

const EntrepreneurDashboard = () => {
  const { user } = useAuth();
  const navigation = useNavigation<DashboardNavigationProp>();
  const [startups, setStartups] = useState<Startup[]>([]);
  const [startupCalls, setStartupCalls] = useState<StartupCall[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [hasActiveProject, setHasActiveProject] = useState(true); // Set to true for demo

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch startups
      const startupsResponse = await api.get(endpoints.startups.list);
      setStartups(startupsResponse.data || []);

      // Fetch startup calls
      const callsResponse = await api.get(endpoints.startupCalls.list);
      const calls = callsResponse.data || [];
      
      // Sort by deadline (most urgent first)
      const sortedCalls = [...calls].sort((a, b) => {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
      setStartupCalls(sortedCalls);

      // In a real app, we would fetch these from the API
      // For now, use mock data for applications
      const mockApplications: Application[] = [
        {
          id: 'app1',
          callId: '1',
          callTitle: 'Tech Innovation Challenge',
          status: 'APPROVED',
          submittedAt: '2025-04-10T15:30:00Z',
          lastUpdated: '2025-04-15T09:45:00Z',
        },
        {
          id: 'app2',
          callId: '3',
          callTitle: 'Sustainable Mobility Program',
          status: 'UNDER_REVIEW',
          submittedAt: '2025-05-05T11:20:00Z',
          lastUpdated: '2025-05-05T11:20:00Z',
        },
      ];
      setApplications(mockApplications);

      // Mock upcoming events
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Startup Pitch Competition',
          description: 'Join us for an exciting pitch competition where startups present their innovative ideas.',
          date: '2025-06-15T14:00:00Z',
          location: 'Tech Hub, San Francisco',
          isVirtual: false,
          registrationOpen: true,
        },
        {
          id: '2',
          title: 'Investor Networking Webinar',
          description: 'Connect with potential investors in this virtual networking event.',
          date: '2025-06-25T18:30:00Z',
          location: 'Online',
          isVirtual: true,
          registrationOpen: true,
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error loading entrepreneur dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSubmitNewStartup = () => {
    navigation.navigate('StartupSubmission');
  };

  const handleViewStartupCalls = () => {
    navigation.navigate('StartupCalls');
  };

  const handleViewCallDetails = (callId: string) => {
    navigation.navigate('CallDetails', { callId });
  };

  const handleViewEventDetails = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };
  
  // Format date in a user-friendly way
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get appropriate color for different status values
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return '#4CAF50';
      case 'REJECTED':
        return '#F44336';
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
      case 'PENDING':
        return '#FFC107';
      case 'WITHDRAWN':
        return '#9E9E9E';
      case 'PUBLISHED':
        return '#4CAF50';
      case 'CLOSED':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      );
    }

    
    
    if (activeTab === 'expenses') {
      return (
        <View style={styles.expensesContainer}>
          <Card style={styles.expensesCard}>
            <Card.Content>
              <Title style={styles.expensesTitle}>Expense Management</Title>
              <Paragraph style={styles.expensesParagraph}>
                Track and manage all your project expenses in one place. Submit expense reports, view spending analytics, and manage your budget allocations.                  
              </Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.expensesCard}>
            <Card.Content>
              <View style={styles.expensesSummary}>
                <View style={styles.expensesSummaryItem}>
                  <MaterialCommunityIcons name="cash-multiple" size={28} color="#38a169" />
                  <Text style={styles.expensesSummaryTitle}>Total Budget</Text>
                  <Text style={styles.expensesSummaryValue}>$50,000.00</Text>
                </View>
                <View style={styles.expensesSummaryItem}>
                  <MaterialCommunityIcons name="cash-remove" size={28} color="#e53e3e" />
                  <Text style={styles.expensesSummaryTitle}>Spent</Text>
                  <Text style={styles.expensesSummaryValue}>$22,500.00</Text>
                </View>
                <View style={styles.expensesSummaryItem}>
                  <MaterialCommunityIcons name="cash-plus" size={28} color="#3182ce" />
                  <Text style={styles.expensesSummaryTitle}>Remaining</Text>
                  <Text style={styles.expensesSummaryValue}>$27,500.00</Text>
                </View>
              </View>
              
              <Divider style={styles.expensesDivider} />
              
              <Text style={styles.expensesInfoText}>Expenses feature is currently under development. You can view detailed expense information in the Project Management tab.</Text>
              
              <Button 
                mode="contained" 
                style={styles.expensesButton}
                icon="arrow-right"
                onPress={() => setActiveTab('project')}
              >
                View in Project Management
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }
    
    // Overview tab (default)
    return (
      <View>
        <View style={styles.section}>
          <View style={styles.cardsContainer}>
            <DashboardCard
              title="My Applications"
              icon="application"
              count={applications.length}
              onPress={() => {}}
            />
            <DashboardCard
              title="Approved Projects"
              icon="check-circle"
              count={applications.filter(app => app.status === 'APPROVED').length}
              onPress={() => {}}
            />
            <DashboardCard
              title="Open Opportunities"
              icon="lightning-bolt"
              count={startupCalls.filter(call => call.status === 'PUBLISHED').length}
              onPress={handleViewStartupCalls}
            />
            <DashboardCard
              title="Startups"
              icon="rocket-launch"
              count={startups.length}
              onPress={handleSubmitNewStartup}
            />
          </View>
        </View>

        {/* Startup Applications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Applications</Text>
            <TouchableOpacity onPress={() => console.log('View all applications')}>
              <Text style={{ color: '#007AFF' }}>View All</Text>
            </TouchableOpacity>
          </View>

          {applications.length === 0 ? (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={{ textAlign: 'center', marginBottom: 10 }}>
                  You haven't applied to any startup calls yet
                </Text>
                <Button
                  mode="contained"
                  onPress={handleViewStartupCalls}
                  style={styles.actionButton}
                >
                  Browse Startup Calls
                </Button>
              </Card.Content>
            </Card>
          ) : (
            applications.map((application) => (
              <Card
                key={application.id}
                style={styles.card}
                onPress={() => console.log(`View application ${application.id}`)}
              >
                <Card.Content>
                  <View style={styles.applicationHeader}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                      {application.callTitle}
                    </Text>
                    <Chip
                      style={{
                        backgroundColor: getStatusColor(application.status),
                      }}
                      textStyle={{ color: 'white', fontSize: 12 }}
                    >
                      {application.status.replace('_', ' ')}
                    </Chip>
                  </View>

                  <View style={styles.applicationDetails}>
                    <View style={styles.applicationDetail}>
                      <FontAwesome5 name="calendar-alt" size={12} color="#718096" />
                      <Text style={styles.applicationDetailText}>
                        Submitted: {formatDate(application.submittedAt)}
                      </Text>
                    </View>
                    <View style={styles.applicationDetail}>
                      <FontAwesome5 name="clock" size={12} color="#718096" />
                      <Text style={styles.applicationDetailText}>
                        Last updated: {formatDate(application.lastUpdated)}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Events')}
            >
              View All
            </Button>
          </View>

          {events.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No upcoming events found</Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Events')}
                style={styles.actionButton}
              >
                Browse Events
              </Button>
            </View>
          ) : (
            events.map((event) => (
              <Card
                key={event.id}
                style={styles.card}
                onPress={() => handleViewEventDetails(event.id)}
              >
                <Card.Content>
                  <Text style={styles.cardItemTitle}>{event.title}</Text>
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Ionicons name="calendar-outline" size={16} color="#718096" />
                      <Text style={styles.eventDetailText}>
                        {formatDate(event.date)}
                      </Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <Ionicons name="location-outline" size={16} color="#718096" />
                      <Text style={styles.eventDetailText}>
                        {event.isVirtual ? 'Virtual Event' : event.location}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.cardItemFooter}>
                    <Chip
                      style={{
                        backgroundColor: event.isVirtual
                          ? '#e6f7ff'
                          : '#f0fff4',
                      }}
                      textStyle={{
                        color: event.isVirtual ? '#0366d6' : '#38a169',
                        fontSize: 12,
                      }}
                      icon={event.isVirtual ? 'video' : 'map-marker'}
                    >
                      {event.isVirtual ? 'Virtual' : 'In-Person'}
                    </Chip>
                    {event.registrationOpen && (
                      <Chip
                        style={{ backgroundColor: '#38a169', marginLeft: 8 }}
                        textStyle={{ color: 'white', fontSize: 12 }}
                      >
                        Registration Open
                      </Chip>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Your Startups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Startups</Text>
          </View>

          {startups.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't submitted any startups yet</Text>
              <Button
                mode="contained"
                onPress={handleSubmitNewStartup}
                style={styles.mainActionButton}
              >
                Submit Your Startup
              </Button>
            </View>
          ) : (
            startups.map((startup, index) => (
              <React.Fragment key={startup.id}>
                <Card style={styles.card}>
                  <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{startup.name}</Text>
                      <Chip
                        style={{
                          backgroundColor: getStatusColor(startup.status),
                        }}
                        textStyle={{ color: 'white', fontSize: 12 }}
                      >
                        {startup.status}
                      </Chip>
                    </View>
                    {startup.description && (
                      <Text style={{ marginTop: 8, color: '#4a5568' }}>{startup.description}</Text>
                    )}
                    <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
                      <Text style={{ color: '#718096', fontSize: 13 }}>
                        Created: {formatDate(startup.createdAt)}
                      </Text>
                      {startup.score !== null && (
                        <Badge style={styles.badge}>
                          {`Score: ${startup.score}/100`}
                        </Badge>
                      )}
                    </View>
                  </Card.Content>
                </Card>
                {index < startups.length - 1 && <Divider style={styles.divider} />}
              </React.Fragment>
            ))
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Entrepreneur Dashboard</Text>
        <Text style={styles.subtitle}>Welcome {user?.name || 'Entrepreneur'}</Text>
      </View>
      
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'overview', label: 'Overview' },
          { value: 'project', label: 'Project Management' },
          { value: 'expenses', label: 'Expenses' },
        ]}
        style={styles.tabButtons}
      />
      
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabButtons: {
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  header: {
    padding: 16,
    backgroundColor: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },
  dashboardCard: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
  },
  cardCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  card: {
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  cardItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardItemDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  cardItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  deadline: {
    fontSize: 14,
    color: "#e53e3e",
  },
  dateInfo: {
    fontSize: 14,
    color: "#666",
  },
  statusTag: {
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  actionButton: {
    marginTop: 0,
    backgroundColor: "#007AFF",
  },
  mainActionButton: {
    backgroundColor: "#007AFF",
  },
  badge: {
    backgroundColor: '#4a6fa5',
    color: 'white',
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicationDetails: {
    marginTop: 4,
  },
  applicationDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  applicationDetailText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 6,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#718096',
    marginLeft: 4,
  },
  divider: {
    marginVertical: 8,
  },
  expensesContainer: {
    padding: 16,
  },
  expensesCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  expensesTitle: {
    fontSize: 20,
    marginBottom: 8,
    color: '#2D3748',
  },
  expensesParagraph: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  expensesSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginVertical: 16,
  },
  expensesSummaryItem: {
    alignItems: 'center',
    width: '33%',
    paddingHorizontal: 8,
  },
  expensesSummaryTitle: {
    fontSize: 12,
    color: '#718096',
    marginTop: 6,
    marginBottom: 2,
  },
  expensesSummaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  expensesDivider: {
    marginVertical: 16,
  },
  expensesInfoText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 16,
  },
  expensesButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    marginTop: 8,
  },
  eventDetails: {
    marginVertical: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#718096',
    marginLeft: 6,
  },
});

export default EntrepreneurDashboard;
