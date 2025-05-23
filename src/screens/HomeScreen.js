import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const RocketIcon = () => (
    <Svg width={width * 0.8} height={width * 0.8} viewBox="0 0 400 400" fill="none">
      <Path
        d="M200 50C200 50 150 100 150 200C150 300 200 350 200 350"
        stroke="#4B7BF5"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <Path
        d="M150 200C150 200 180 220 200 220C220 220 250 200 250 200"
        stroke="#4B7BF5"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <Path
        d="M200 50C200 50 250 100 250 200C250 300 200 350 200 350"
        stroke="#4B7BF5"
        strokeWidth="20"
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Turn your ideas into{'\n'}
              <Text style={styles.highlightedText}>successful startups</Text>
            </Text>
          </View>

          <View style={styles.illustrationContainer}>
            <RocketIcon />
          </View>

          <Text style={styles.description}>
            Our platform connects entrepreneurs with resources, funding, and expert guidance to transform innovative concepts into thriving businesses.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => navigation.navigate('StartupCalls')}
            >
              <Text style={styles.primaryButtonText}>Submit Your Idea</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => navigation.navigate('StartupCalls')}
            >
              <Text style={styles.secondaryButtonText}>Browse Startups</Text>
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
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1A1A1A',
    lineHeight: 44,
  },
  highlightedText: {
    color: '#4B7BF5',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4B7BF5',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4B7BF5',
  },
  secondaryButtonText: {
    color: '#4B7BF5',
    fontSize: 16,
    fontWeight: '600',
  },
}); 