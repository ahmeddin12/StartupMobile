import React, { useState, useRef } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Button,
  TextInput,
  Text,
  Card,
  HelperText,
  Menu,
  Portal,
  Provider as PaperProvider,
  useTheme,
} from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";
import { StartupService } from "../services/startup";
import {
  StartupStage,
  Industry,
  StartupSubmission as StartupSubmissionType,
} from "../types/startup";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenParamList } from "../types/user";

interface Props {
  navigation: NativeStackNavigationProp<ScreenParamList>;
}

export const StartupSubmission: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const startupService = StartupService.getInstance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state
  const [startupName, setStartupName] = useState("");
  const [description, setDescription] = useState("");
  const [pitch, setPitch] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [stage, setStage] = useState(StartupStage.IDEA);
  const [website, setWebsite] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const submitStartup = async () => {
    if (!user) {
      setError("Please log in to submit a startup");
      return;
    }

    if (
      !startupName ||
      !description ||
      !pitch ||
      selectedIndustries.length === 0
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const startupData: StartupSubmissionType = {
        name: startupName,
        description,
        pitch,
        industries: selectedIndustries,
        stage,
        website: website || undefined,
        logo: logo || undefined,
        founderId: user.id,
        status: "SUBMITTED",
      };

      await startupService.submitStartup(startupData);
      setSuccess(true);
      Alert.alert("Success", "Startup submitted successfully!");
      navigation.goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit startup");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIndustrySelect = (industry: Industry) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Submit Your Startup</Text>

          <TextInput
            label="Startup Name"
            value={startupName}
            onChangeText={setStartupName}
            mode="outlined"
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Pitch"
            value={pitch}
            onChangeText={setPitch}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            error={!!error}
          />

          <Text style={styles.sectionTitle}>Industries</Text>
          <View style={styles.industriesContainer}>
            {Object.values(Industry).map((industry) => (
              <Button
                key={industry}
                mode={
                  selectedIndustries.includes(industry)
                    ? "contained"
                    : "outlined"
                }
                onPress={() => handleIndustrySelect(industry)}
                style={styles.industryButton}
              >
                {industry}
              </Button>
            ))}
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Stage</Text>
            <Picker
              selectedValue={stage}
              onValueChange={setStage}
              style={styles.picker}
            >
              {Object.values(StartupStage).map((stage) => (
                <Picker.Item key={stage} label={stage} value={stage} />
              ))}
            </Picker>
          </View>

          <TextInput
            label="Website (optional)"
            value={website}
            onChangeText={setWebsite}
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={submitStartup}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.submitButton}
          >
            Submit Startup
          </Button>

          {error && <HelperText type="error">{error}</HelperText>}

          {error && <HelperText type="error">{error}</HelperText>}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  picker: {
    height: 50,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
  },
  industriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  industryButton: {
    flex: 1,
    maxWidth: "48%",
    marginVertical: 4,
  },
  submitButton: {
    marginTop: 24,
  },
});

export default StartupSubmission;
