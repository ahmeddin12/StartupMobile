import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { CONFIG } from "../../constants/config";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  style?: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  style,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={CONFIG.COLORS.gray}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: CONFIG.COLORS.text,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: CONFIG.COLORS.gray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: CONFIG.COLORS.text,
    backgroundColor: CONFIG.COLORS.background,
  },
  inputError: {
    borderColor: CONFIG.COLORS.error,
  },
  errorText: {
    color: CONFIG.COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});
