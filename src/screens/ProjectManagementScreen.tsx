/**
 * DEPRECATED - This component has been marked for removal from the project
 * Do not use this component in new code
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProjectManagement from '../components/entrepreneur/ProjectManagement';

/**
 * Project Management Screen
 * Provides a standalone screen for project management features
 * This screen is accessible directly from the drawer menu
 * 
 * @deprecated This component is no longer used in the application
 */
export const ProjectManagementScreen = () => {
  return (
    <View style={styles.container}>
      <ProjectManagement />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default ProjectManagementScreen;
