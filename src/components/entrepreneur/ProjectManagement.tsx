import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { CONFIG } from '../../constants/config';

export const ProjectManagement: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Project Management</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Project management features will be implemented here.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.background,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: CONFIG.COLORS.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: CONFIG.COLORS.text,
  },
  content: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    color: CONFIG.COLORS.gray,
  },
});
