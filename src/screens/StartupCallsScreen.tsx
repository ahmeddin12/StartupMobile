import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  StartupCallsService,
  StartupCall,
  CallStatus,
} from "../services/startupCalls";
import { useNavigation, useFocusEffect, NavigationProp } from "@react-navigation/native";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RootStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScreenParamList } from "../types/user";

// Use NavigationProp for simpler nested navigation
type StartupCallsScreenNavigationProp = NavigationProp<ScreenParamList>;

export const StartupCallsScreen = () => {
  const [calls, setCalls] = useState<StartupCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<StartupCallsScreenNavigationProp>();

  // Fetch calls when component mounts
  useEffect(() => {
    fetchCalls();
  }, []);
  
  // Refetch calls when the screen comes into focus (e.g., from drawer navigation)
  useFocusEffect(
    useCallback(() => {
      fetchCalls();
      return () => {}; // cleanup function
    }, [])
  );

  const fetchCalls = async () => {
    console.log('Fetching startup calls...');
    try {
      setLoading(true);
      const data = await StartupCallsService.getAllCalls();
      console.log(`Loaded ${data.length} startup calls`);
      setCalls(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching startup calls:', err);
      setError("Failed to load startup calls");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case "PUBLISHED":
        return "#4CAF50";
      case "CLOSED":
        return "#F44336";
      case "DRAFT":
        return "#FFC107";
      case "ARCHIVED":
        return "#9E9E9E";
      default:
        return "#000000";
    }
  };

  const renderCallItem = ({ item }: { item: StartupCall }) => (
    <View style={styles.callItem}>
      {/* Title and main details */}
      <Text style={styles.callTitle}>{item.title}</Text>
      <View style={styles.tagsRow}>
        <View style={styles.tagItem}>
          <FontAwesome5 name="industry" size={14} color="#666" style={styles.tagIcon} />
          <Text style={styles.tagText}>{item.industry}</Text>
        </View>
        <View style={styles.tagItem}>
          <Ionicons name="location-outline" size={14} color="#666" style={styles.tagIcon} />
          <Text style={styles.tagText}>{item.location}</Text>
        </View>
        <View style={styles.tagItem}>
          <MaterialCommunityIcons name="cash" size={14} color="#666" style={styles.tagIcon} />
          <Text style={styles.tagText}>{item.fundingAmount}</Text>
        </View>
      </View>
      
      {/* Description */}
      <Text style={styles.callDescription}>{item.description}</Text>
      
      {/* Requirements as bullet points */}
      {item.requirements && item.requirements.length > 0 && (
        <View style={styles.requirementsList}>
          {item.requirements.map((req, index) => (
            <Text key={index} style={styles.requirementItem}>• {req}</Text>
          ))}
        </View>
      )}
      
      {/* Dates */}
      <View style={styles.datesContainer}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#666" style={styles.dateIcon} />
          <Text style={styles.dateInfo}>
            Published: {new Date(item.publishedDate || "").toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
          </Text>
        </View>
        <View style={styles.dateRow}>
          <Ionicons name="time-outline" size={14} color="#666" style={styles.dateIcon} />
          <Text style={styles.dateInfo}>
            Deadline: {new Date(item.applicationDeadline || "").toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
          </Text>
        </View>
      </View>
      
      {/* Status badge */}
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status === 'CLOSED' ? 'Expired' : item.status}</Text>
        </View>
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtonsContainer}>
        {/* View Details button */}
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => {
            console.log('Navigating to call details:', item.id);
            // Direct navigation to CallDetails screen
            navigation.navigate('CallDetails', { callId: item.id });
          }}
        >
          <Ionicons name="information-circle-outline" size={16} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>
        
        {/* Apply Now button - only show if call is PUBLISHED */}
        {item.status === 'PUBLISHED' && (
          <TouchableOpacity 
            style={styles.applyNowButton}
            onPress={() => {
              console.log('Navigating to apply for call:', item.id);
              navigation.navigate('CallApplication', { callId: item.id });
            }}
          >
            <Ionicons name="paper-plane" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.applyNowText}>Apply Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchCalls} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={calls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchCalls}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  callItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  applyNowButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyNowText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  callTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  callTagline: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontWeight: "500",
  },
  // Tags styles
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    alignItems: 'center',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  tagIcon: {
    marginRight: 4,
  },
  tagText: {
    fontSize: 14,
    color: "#666",
  },
  callDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  requirementsList: {
    marginBottom: 16,
  },
  requirementItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
    paddingLeft: 4,
  },
  datesContainer: {
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateIcon: {
    marginRight: 6,
  },
  dateInfo: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  viewDetailsButton: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 6,
  },
  viewDetailsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  callHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  callDetails: {
    marginBottom: 12,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  deadlineText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#444",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#2196f3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
