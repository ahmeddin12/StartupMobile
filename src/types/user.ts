export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  REVIEWER = "REVIEWER",
  SPONSOR = "SPONSOR",
  ENTREPRENEUR = "ENTREPRENEUR",
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type ScreenParamList = {
  Auth: undefined;
  Home: undefined;
  Dashboard: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  StartupCalls: undefined;
  EntrepreneurDashboard: undefined;
  ReviewerDashboard: undefined;
  SponsorDashboard: undefined;
  AdminDashboard: undefined;
  StartupSubmission: undefined;
  DocumentUpload: undefined;
  TaskList: undefined;
  EventCalendar: undefined;
  Events: undefined;
  EventDetail: { eventId: string };
  AnnouncementDetails: { announcementId: string };
  CallDetails: { callId: string };
  CallApplication: { callId: string };
  ChangePassword: undefined;
  EditProfile: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  MainTabsContent: undefined;
  // ProjectManagement removed as requested
};
