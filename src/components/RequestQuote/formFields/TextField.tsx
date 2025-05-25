import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  textType?: "string" | "number";
  prefix?: string;
  suffix?: string;
  textCaps?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  hint,
  textType,
  prefix,
  suffix,
  textCaps,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.inputContainer}>
        {prefix && <Text style={styles.affix}>{prefix}</Text>}
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={value}
          onChangeText={onChange}
          placeholder={hint}
          keyboardType={textType === "number" ? "numeric" : "default"}
          autoCapitalize={textCaps ? "characters" : "none"}
        />
        {suffix && <Text style={styles.affix}>{suffix}</Text>}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  affix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#666",
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "red",
  },
});

export default TextField;
