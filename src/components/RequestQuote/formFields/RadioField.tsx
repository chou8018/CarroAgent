import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface RadioOption {
  value: string;
  display_name: string;
}

interface RadioFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
}

const RadioField: React.FC<RadioFieldProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.radioCircle}>
              {value === option.value && <View style={styles.selectedRb} />}
            </View>
            <Text style={styles.optionText}>{option.display_name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "red",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF6B00",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF6B00",
  },
  optionText: {
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "red",
  },
});

export default RadioField;
