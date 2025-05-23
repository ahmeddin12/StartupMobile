import React from "react";
import "react-native-url-polyfill/auto";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";

const App = () => {
  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: 'transparent' // Suppress shadow warning
      }}
    >
      <PaperProvider>
        <AuthProvider>
          <AppNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
