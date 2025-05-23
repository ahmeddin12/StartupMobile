import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  CallDetails: { callId: string };
  ForgotPassword: undefined;
  Auth: undefined;
  Main: undefined;
  StartupCallsScreen: undefined;
  SponsorDashboard: undefined;
  ReviewerDashboard: undefined;
  StartupDashboard: undefined;
  Dashboard: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  navigation: any; // Replace 'any' with your navigation type
  route: { params: RootStackParamList[T] };
};
export type MainTabParamList = {
  Home: undefined;
  StartupCalls: undefined;
  Profile: undefined;
  Notifications: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
