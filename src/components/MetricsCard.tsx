import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon }) => {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <MaterialIcon name={icon} size={24} color="#666" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
