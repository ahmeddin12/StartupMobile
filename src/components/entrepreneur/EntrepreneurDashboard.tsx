import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Image, Modal } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar, Chip, SegmentedButtons, Divider, Avatar, Menu } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';
import api from '../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

interface Application {
  id: string;
  startupCallId: string;
  startupCallTitle: string;
  startupName: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  submittedAt: string;
  lastUpdated: string;
}

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  type: 'funding' | 'mentorship' | 'partnership' | 'other';
  status: 'open' | 'closing_soon' | 'closed';
  location: string;
  industry: string;
  logoUrl?: string;
}

interface Project {
  id: string;
  startupCallId: string;
  startupCallTitle: string;
  budget: {
    id: string;
    totalAmount: number;
    spent: number;
    remaining: number;
    categories: Array<{
      id: string;
      name: string;
      allocatedAmount: number;
      spent: number;
      remaining: number;
    }>;
    expenses: Array<{
      id: string;
      title: string;
      amount: number;
      date: string;
      categoryId: string;
      status: string;
    }>;
  };
  tasks: {
    total: number;
    completed: number;
    pending: number;
  };
  timeline: {
    milestones: Array<{
      id: string;
      title: string;
      dueDate: string;
      status: string;
    }>;
  };
}

// Styles
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
  },
  profilePicture: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  menuAnchor: {
    // Position coordinates for menu anchor
  },
  menu: {
    marginTop: 40,
    minWidth: 200,
  },
  menuItem: {
    fontSize: 14,
  },
  menuTitleItem: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  applicationItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  applicationDetails: {
    marginBottom: 12,
  },
  applicationSubtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 12,
    color: '#718096',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  viewDetailsText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  opportunityItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    marginRight: 8,
  },
  opportunityDetails: {
    marginBottom: 12,
  },
  opportunitySubtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  opportunityDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  }
});
