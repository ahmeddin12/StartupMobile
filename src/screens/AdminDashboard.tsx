import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenParamList } from '../types/user';
import { Button } from 'react-native-paper';

interface Props {
  navigation: NativeStackNavigationProp<ScreenParamList>;
}

export const AdminDashboard: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Button
        icon="view-list"
        mode="contained"
        onPress={() => navigation.navigate('StartupCalls')}
        style={styles.button}
      >
        View Startup Calls
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    width: '100%',
  },
});
