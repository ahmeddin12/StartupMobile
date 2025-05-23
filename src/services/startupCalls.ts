import { getApiUrl } from '../constants/env';
import api, { endpoints } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock data to use when API calls fail
const MOCK_STARTUP_CALLS: StartupCall[] = [
  {
    id: '1',
    title: 'Tech Innovation Challenge',
    description: 'A challenge for early-stage startups with innovative technology solutions in clean energy, healthcare, or education.',
    status: 'CLOSED' as CallStatus,
    applicationDeadline: '2024-08-01T00:00:00.000Z',
    publishedDate: '2025-05-08T00:00:00.000Z',
    industry: 'Technology',
    location: 'Global',
    fundingAmount: '$25,000 - $50,000',
    requirements: ['Less than 5 years in operation', 'Working prototype or MVP required', 'At least one full-time founder'],
    eligibilityCriteria: ['Early-stage startups', 'Focus on clean energy, healthcare, or education'],
    selectionProcess: ['Application review', 'Interview', 'Pitch day']
  },
  {
    id: '2',
    title: 'Fintech Innovation Challenge',
    description: 'Looking for innovative fintech solutions that address financial inclusion challenges.',
    status: 'PUBLISHED' as CallStatus,
    applicationDeadline: '2025-07-15T00:00:00.000Z',
    publishedDate: '2025-05-01T00:00:00.000Z',
    industry: 'Fintech',
    location: 'Global',
    fundingAmount: '$50,000 - $100,000',
    requirements: ['MVP ready', 'Team of 2+ people', 'Less than 2 years in operation'],
    eligibilityCriteria: ['Registered business', 'Working prototype'],
    selectionProcess: ['Application review', 'Interview', 'Pitch day']
  },
  {
    id: '3',
    title: 'Sustainable Mobility Program',
    description: 'Seeking startups focused on sustainable transportation and mobility solutions.',
    status: 'PUBLISHED' as CallStatus,
    applicationDeadline: '2025-06-30T00:00:00.000Z',
    publishedDate: '2025-04-15T00:00:00.000Z',
    industry: 'Mobility',
    location: 'Europe',
    fundingAmount: 'Up to €75,000',
    requirements: ['Sustainable mobility focus', 'Scalable solution'],
    eligibilityCriteria: ['European registration', 'Early-stage startup'],
    selectionProcess: ['Initial screening', 'Expert evaluation', 'Final selection']
  },
  {
    id: '4',
    title: 'Health Tech Accelerator',
    description: 'Program for innovative healthcare technology startups addressing critical medical challenges.',
    status: 'CLOSED' as CallStatus,
    applicationDeadline: '2025-04-01T00:00:00.000Z',
    publishedDate: '2025-03-01T00:00:00.000Z',
    industry: 'Health Tech',
    location: 'North America',
    fundingAmount: '$100,000 - $250,000',
    requirements: ['Healthcare focus', 'Clinical validation'],
    eligibilityCriteria: ['Registered in US or Canada', 'Less than 3 years old'],
    selectionProcess: ['Application', 'Expert panel review', 'Demo day']
  }
];

export type CallStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type ApplicationStatus = 'NOT_APPLIED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

export interface StartupCall {
  id: string;
  title?: string;
  description?: string;
  status: CallStatus;
  applicationDeadline?: string;
  publishedDate?: string;
  industry?: string;
  location?: string;
  fundingAmount?: string;
  requirements?: string[];
  eligibilityCriteria?: string[];
  selectionProcess?: string[];
  aboutSponsor?: string;
  applicationProcess?: string;
  applicationStatus?: ApplicationStatus;
  startupName?: string;
  callId?: string;
  call?: {
    id: string;
    title: string;
    status: string;
    applicationDeadline: string;
    industry: string;
    location: string;
    fundingAmount: string;
  }
}


export const StartupCallsService = {
  async getAllCalls(): Promise<StartupCall[]> {
    try {
      console.log('Fetching startup calls from API');
      
      const response = await api.get(endpoints.startupCalls.list);

      console.log('Successfully fetched startup calls from API:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching startup calls, using mock data:', error);
      // Return mock data when the API fails
      return MOCK_STARTUP_CALLS;
    }
  },

  async getCallById(id: string): Promise<StartupCall> {
    try {
      console.log(`Fetching startup call by ID: ${id}`);
      
      const response = await api.get(endpoints.startupCalls.details(id));

      console.log('Successfully fetched startup call details');
      return response.data;
    } catch (error) {
      console.error('Error in getCallById:', error);
      // If the API fails, try to find the call in the mock data
      const mockCall = MOCK_STARTUP_CALLS.find(call => call.id === id);
      if (mockCall) {
        console.log('Returning mock data for call');
        return mockCall;
      }
      throw new Error('Failed to fetch startup call details');
    }
  },

  async createCall(call: Omit<StartupCall, 'id'>): Promise<StartupCall> {
    try {
      console.log('Creating new startup call');
      const response = await api.post(endpoints.startupCalls.list, call);
      console.log('Successfully created startup call');
      return response.data;
    } catch (error) {
      console.error('Error creating startup call:', error);
      throw new Error('Failed to create startup call');
    }
  },

  async updateCall(id: string, call: Partial<StartupCall>): Promise<StartupCall> {
    try {
      console.log(`Updating startup call with ID: ${id}`);
      const response = await api.put(endpoints.startupCalls.details(id), call);
      console.log('Successfully updated startup call');
      return response.data;
    } catch (error) {
      console.error('Error updating startup call:', error);
      throw new Error('Failed to update startup call');
    }
  },

  async deleteCall(id: string): Promise<void> {
    try {
      console.log(`Deleting startup call with ID: ${id}`);
      await api.delete(endpoints.startupCalls.details(id));
      console.log('Successfully deleted startup call');
    } catch (error) {
      console.error('Error deleting startup call:', error);
      throw new Error('Failed to delete startup call');
    }
  },

  async getMyApplications(): Promise<StartupCall[]> {
    try {
      console.log('Fetching my applications');
      const response = await api.get(endpoints.applications.list);
      console.log('Successfully fetched applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },

  async applyForCall(callId: string, applicationData: any): Promise<void> {
    try {
      console.log(`Applying for startup call with ID: ${callId}`);
      await api.post(endpoints.startupCalls.apply(callId), {
        ...applicationData
      });
      console.log('Successfully submitted application');
    } catch (error) {
      console.error('Error submitting application:', error);
      throw new Error('Failed to submit application');
    }
  },
}; 