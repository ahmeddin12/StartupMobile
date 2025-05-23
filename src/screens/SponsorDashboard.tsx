import React, { ReactNode, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import axios from 'axios';
import { MetricsCard } from '../components/MetricsCard';

export interface DashboardBaseProps {
  title: string;
  cards: any[]; // You can replace `any` with a specific type if known
  children?: ReactNode;
}

export interface SponsorDashboardMetrics {
  activeInvestments: number;
  totalFunded: number;
  potentialDeals: number;
  investmentReturns: number;
  sponsoredStartups: number;
  upcomingPitches: number;
}

interface SponsoredStartup {
  id: string;
  name: string;
  status: string;
  investmentAmount: number;
  returnOnInvestment: number;
  nextPitchDate: string;
  currentStage: string;
}

const DashboardBase: React.FC<DashboardBaseProps> = ({ title, cards, children }) => {
  const [metrics, setMetrics] = useState<SponsorDashboardMetrics | null>(null);
  const [sponsoredStartups, setSponsoredStartups] = useState<SponsoredStartup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const user = { id: 'user-id' }; // Replace with actual user data

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch metrics
        const metricsResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/sponsors/metrics`,
          {
            headers: { Authorization: `Bearer ${user?.id}` },
          }
        );
        setMetrics(metricsResponse.data);

        // Fetch sponsored startups
        const startupsResponse = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/sponsors/startups`,
          {
            headers: { Authorization: `Bearer ${user?.id}` },
          }
        );
        setSponsoredStartups(startupsResponse.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Optional card section (currently not used, but placeholder is here) */}
      {cards.length > 0 && (
        <ScrollView horizontal style={styles.cardContainer}>
          {cards.map((card, index) => (
            <View key={index} style={styles.card}>
              <Text>{card.title || 'Card'}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Main content passed as children */}
      <View style={styles.content}>
        {children}
      </View>

      {/* New section for metrics and sponsored startups */}
      {metrics && (
        <View style={styles.metricsContainer}>
          <Text style={styles.metricsTitle}>Metrics</Text>
          <View style={styles.metricsRow}>
            <Text>Active Investments: {metrics.activeInvestments}</Text>
            <Text>Total Funded: {metrics.totalFunded}</Text>
          </View>
          <View style={styles.metricsRow}>
            <Text>Potential Deals: {metrics.potentialDeals}</Text>
            <Text>Investment Returns: {metrics.investmentReturns}</Text>
          </View>
        </View>
      )}

      {sponsoredStartups.length > 0 && (
        <View style={styles.startupsContainer}>
          <Text style={styles.startupsTitle}>Sponsored Startups</Text>
          {sponsoredStartups.map((startup, index) => (
            <View key={index} style={styles.startupCard}>
              <Text>{startup.name}</Text>
              <Text>Status: {startup.status}</Text>
              <Text>Investment Amount: {startup.investmentAmount}</Text>
              <Text>Return on Investment: {startup.returnOnInvestment}</Text>
              <Text>Next Pitch Date: {startup.nextPitchDate}</Text>
              <Text>Current Stage: {startup.currentStage}</Text>
            </View>
          ))}
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      )}

      {error && showError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default DashboardBase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  content: {
    padding: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  metricsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  startupsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  startupsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  startupCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
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
    color: '#dc3545',
    textAlign: 'center',
  },
});
