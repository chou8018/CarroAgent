import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";

type AppointmentScreenRouteProp = RouteProp<RootStackParamList, "Appointment">;

interface AppointmentScreenProps {
  route: AppointmentScreenRouteProp;
}

const AppointmentScreen: React.FC<AppointmentScreenProps> = ({ route }) => {
  const { carplateNo } = route.params;
  const [isMobileSelected, setIsMobileSelected] = useState<boolean>(true); // Set to true by default
  const [isInspectionPointSelected, setIsInspectionPointSelected] =
    useState<boolean>(false);
  const [postCode, setPostCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [inspectionPoint, setInspectionPoint] = useState<string>("");

  // Optional: If you want to persist the selection when coming back to this screen
  useEffect(() => {
    // Reset to default (Mobile selected) when the screen mounts
    setIsMobileSelected(true);
    setIsInspectionPointSelected(false);
  }, []);

  const handleMobileSelect = () => {
    setIsMobileSelected(true);
    setIsInspectionPointSelected(false);
  };

  const handleInspectionPointSelect = () => {
    setIsMobileSelected(false);
    setIsInspectionPointSelected(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Request A Quote</Text>

      <Text style={styles.subHeader}>Choose Mobile or Inspection Point</Text>
      <Text style={styles.description}>
        Followed by an appointment date and time.
      </Text>

      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            isMobileSelected && styles.selectedButton,
          ]}
          onPress={handleMobileSelect}
        >
          <Text
            style={[
              styles.selectionButtonText,
              isMobileSelected && styles.selectedButtonText,
            ]}
          >
            Mobile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectionButton,
            isInspectionPointSelected && styles.selectedButton,
          ]}
          onPress={handleInspectionPointSelect}
        >
          <Text
            style={[
              styles.selectionButtonText,
              isInspectionPointSelected && styles.selectedButtonText,
            ]}
          >
            Inspection Point
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Carplate No.:</Text>
      <Text style={styles.carplate}>{carplateNo}</Text>

      {isMobileSelected && (
        <>
          <Text style={styles.label}>Post Code *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter post code"
            value={postCode}
            onChangeText={setPostCode}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#999"
          />
        </>
      )}

      {isInspectionPointSelected && (
        <>
          <View style={styles.divider} />

          <Text style={styles.label}>Inspection Point *</Text>
          <TextInput
            style={styles.input}
            placeholder="Select inspection point"
            value={inspectionPoint}
            onChangeText={setInspectionPoint}
            placeholderTextColor="#999"
          />

          <View style={styles.divider} />
        </>
      )}

      <Text style={styles.footerText}>
        By submitting this form, you agree to our Terms & Conditions and Privacy
        Policy
      </Text>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// ... keep your existing styles ...

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  selectionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  selectionButtonText: {
    fontSize: 16,
    color: "#000",
  },
  selectedButtonText: {
    color: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  carplate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentScreen;
