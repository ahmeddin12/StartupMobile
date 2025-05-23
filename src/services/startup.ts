import axios from 'axios';
import { StartupSubmission } from '../types/startup';
import { User } from '../types/user';

export class StartupService {
  private static instance: StartupService;
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  private constructor() {}

  static getInstance(): StartupService {
    if (!StartupService.instance) {
      StartupService.instance = new StartupService();
    }
    return StartupService.instance;
  }

  async submitStartup(startupData: StartupSubmission): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('name', startupData.name);
      formData.append('description', startupData.description);
      formData.append('pitch', startupData.pitch);
      formData.append('stage', startupData.stage);
      formData.append('website', startupData.website || '');
      
      if (startupData.logo) {
        formData.append('logo', startupData.logo);
      }

      startupData.industries.forEach((industry, index) => {
        formData.append(`industries[${index}]`, industry);
      });

      await axios.post(`${this.baseUrl}/api/startups`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error('Failed to submit startup: ' + errorMessage);
    }
  }

  async getStartupsByFounder(founderId: string): Promise<StartupSubmission[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/startups?founderId=${founderId}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error('Failed to fetch startups: ' + errorMessage);
    }
  }

  async updateStartup(id: string, data: Partial<StartupSubmission>): Promise<void> {
    try {
      await axios.put(`${this.baseUrl}/api/startups/${id}`, data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error('Failed to update startup: ' + errorMessage);
    }
  }

  async deleteStartup(id: string): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/api/startups/${id}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error('Failed to delete startup: ' + errorMessage);
    }
  }
}  
