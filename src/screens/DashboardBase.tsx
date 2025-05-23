import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";

// This component acts as a router to direct users to the correct dashboard based on their role
const DashboardBase = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (!user) return;

    // Determine which dashboard to show based on user role
    // This mimics the behavior of the web application's routing
    const role = user.role;

    switch (role) {
      case "ADMIN":
        navigation.replace("AdminDashboard");
        break;
      case "REVIEWER":
        navigation.replace("ReviewerDashboard");
        break;
      case "SPONSOR":
        navigation.replace("SponsorDashboard");
        break;
      case "USER":
      default:
        // Default to entrepreneur dashboard for regular users
        navigation.replace("EntrepreneurDashboard");
        break;
    }
  }, [user, navigation]);

  // Show loading while determining which dashboard to navigate to
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading your dashboard...</Text>
    </View>
  );
};

// Generic dashboard card component that all dashboards can use
export const DashboardCard = ({
  title,
  icon,
  count,
  onPress,
}: {
  title: string;
  icon: string;
  count: number | string;
  onPress?: () => void;
}) => {
  return (
    <View style={styles.card} onTouchEnd={onPress}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardCount}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  cardsContainer: {
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flex: 1,
    maxWidth: "48%",
    minHeight: 120,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  cardCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default DashboardBase;
