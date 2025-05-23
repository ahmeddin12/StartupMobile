import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, AuthResponse } from '../services/auth';
import { User, UserRole } from '../types/user';
import { API_URL } from '../constants/config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (userData: RegisterData) => Promise<RegisterResponse>;
  logout: () => Promise<void>;
  updateProfile: (profileData: ProfileData) => Promise<UpdateProfileResponse>;
}

interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  [key: string]: any;
}

interface RegisterResponse {
  success: boolean;
  error?: string;
  user?: User;
}

interface ProfileData {
  name?: string;
  email?: string;
  image?: string;
  [key: string]: any;
}

interface UpdateProfileResponse {
  success: boolean;
  user?: User;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    try {
      setAuthError(null);
      const response = await AuthService.login(email, password);
      setUser(response.user);
      return response.user;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Invalid credentials. Please try again.';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
      setAuthError(null);
      const { name, email, password, role } = userData;
      const response = await AuthService.register(
        name || '',
        email,
        password,
        role || UserRole.USER
      );
      setUser(response.user);
      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
      setAuthError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateProfile = async (profileData: ProfileData): Promise<UpdateProfileResponse> => {
    try {
      // This would need to be implemented in AuthService
      // For now, implementing it directly here
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Profile update failed');
      }

      const updatedUser = await response.json();
      
      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true, user: updatedUser };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        authError,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};