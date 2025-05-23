import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from "react-native";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { CONFIG } from "../../constants/config";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";
import { AxiosError } from "axios";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface LoginScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
}

export const LoginScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, "Login">
> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      GoogleSignin.configure({
        webClientId: CONFIG.GOOGLE_WEB_CLIENT_ID, // Use the config value
        offlineAccess: true,
      });
    } catch (error) {
      console.error("Google Sign-In configuration error:", error);
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password || !role) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use the correct API endpoint from constants
      const response = await api.post("/api/mobile/auth/login", {
        email,
        password,
        role,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("@RNAuth:token", response.data.token);
        await AsyncStorage.setItem(
          "@RNAuth:user",
          JSON.stringify(response.data.user)
        );
        await AsyncStorage.setItem("@RNAuth:preferredRole", role);

        if (role === "SPONSOR") {
          navigation.replace("SponsorDashboard");
        } else if (role === "REVIEWER") {
          navigation.replace("ReviewerDashboard");
        } else if (role === "STARTUP") {
          navigation.replace("StartupDashboard");
        } else {
          navigation.replace("Dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage =
        "Authentication failed. Please check your credentials and try again.";

      if (error instanceof AxiosError && error.response?.data) {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setError(errorMessage);
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      const response = await api.post("/api/mobile/auth/google", {
        token: tokens.accessToken,
        role: role,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("@RNAuth:token", response.data.token);
        await AsyncStorage.setItem(
          "@RNAuth:user",
          JSON.stringify(response.data.user)
        );
        await AsyncStorage.setItem("@RNAuth:preferredRole", role);

        if (role === "SPONSOR") {
          navigation.replace("SponsorDashboard");
        } else if (role === "REVIEWER") {
          navigation.replace("ReviewerDashboard");
        } else if (role === "STARTUP") {
          navigation.replace("StartupDashboard");
        } else {
          navigation.replace("Dashboard");
        }
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      let errorMessage = "Google Sign-In failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.companyName}>Startup Tracker</Text>
          <Text style={styles.tagline}>Empowering Innovation</Text>
        </View>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>
          Enter your credentials to access your account
        </Text>

        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Select Role" value="" />
              <Picker.Item label="Startup" value="STARTUP" />
              <Picker.Item label="Sponsor" value="SPONSOR" />
              <Picker.Item label="Reviewer" value="REVIEWER" />
            </Picker>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            style={styles.input}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            error={error}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.signInButton, loading ? styles.disabled : null]}
          onPress={handleLogin}
          disabled={loading || !email || !password || !role}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.googleButton}>
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={loading || !role}
          >
            <Image
              source={require("../../assets/google-logo.png")}
              style={styles.googleLogo}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONFIG.COLORS.background,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: CONFIG.COLORS.primary,
    marginTop: 16,
  },
  tagline: {
    fontSize: 14,
    color: CONFIG.COLORS.gray,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: CONFIG.COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: CONFIG.COLORS.gray,
    marginBottom: 40,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    color: CONFIG.COLORS.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: CONFIG.COLORS.gray,
    borderRadius: 8,
    backgroundColor: CONFIG.COLORS.white,
  },
  picker: {
    width: "100%",
    height: 50,
  },
  pickerItem: {
    height: 50,
    color: CONFIG.COLORS.text,
  },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: CONFIG.COLORS.primary,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  signInButton: {
    backgroundColor: CONFIG.COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {
    color: CONFIG.COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: CONFIG.COLORS.gray,
  },
  footerLink: {
    fontSize: 14,
    color: CONFIG.COLORS.primary,
    textDecorationLine: "underline",
  },
  input: {
    marginBottom: 16,
  },
});
