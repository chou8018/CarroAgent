// src/components/formFields/FileField.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";

interface UploadConfig {
  url: string;
  method: "POST" | "PUT" | "PATCH";
  collection: string;
  headers?: Record<string, string>;
}

interface FileFieldProps {
  label: string;
  value: string | null;
  onChange: (fileUri: string | null) => void;
  error?: string;
  required?: boolean;
  uploadConfig?: UploadConfig;
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
}

const FileField: React.FC<FileFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  uploadConfig,
  allowedTypes = ["image/jpeg", "image/png", "application/pdf"],
  maxFileSize = 5 * 1024 * 1024, // 5MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "mixed",
        includeBase64: false,
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        throw new Error(result.errorMessage || "File selection failed");
      }

      const file = result.assets?.[0];
      if (!file?.uri) return;

      // Validate file type
      if (allowedTypes && !allowedTypes.includes(file.type || "")) {
        throw new Error(`Only ${allowedTypes.join(", ")} files are allowed`);
      }

      // Validate file size
      if (file.fileSize && file.fileSize > maxFileSize) {
        throw new Error(
          `File size must be less than ${maxFileSize / (1024 * 1024)}MB`
        );
      }

      onChange(file.uri);

      if (uploadConfig) {
        await uploadFile(file);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to select file"
      );
      onChange(null);
    }
  };

  const uploadFile = async (file: any) => {
    if (!uploadConfig) return;

    const formData = new FormData();
    formData.append("file", {
      uri: file.uri,
      type: file.type || "image/jpeg",
      name: file.fileName || `file_${Date.now()}`,
    } as any);

    setUploading(true);
    setProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      const response = await new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch {
                resolve(xhr.responseText);
              }
            } else {
              reject(new Error(xhr.responseText));
            }
          }
        };

        xhr.open(uploadConfig.method, uploadConfig.url, true);

        // Set headers
        const headers = {
          Accept: "application/json",
          ...uploadConfig.headers,
        };

        for (const [key, value] of Object.entries(headers)) {
          xhr.setRequestHeader(key, value);
        }

        xhr.send(formData);
      });

      console.log("Upload successful:", response);
      return response;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemoveFile = () => {
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {value ? (
        <View style={styles.fileContainer}>
          <Image
            source={{ uri: value }}
            style={styles.previewImage}
            resizeMode="contain"
          />
          <View style={styles.fileActions}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveFile}
              disabled={uploading}
            >
              <Icon name="delete" size={20} color="#fff" />
            </TouchableOpacity>
            {uploading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>{progress}%</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.uploadButton,
            error ? styles.errorBorder : null,
            uploading ? styles.uploadingButton : null,
          ]}
          onPress={handleFileSelect}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#FF6B00" />
          ) : (
            <>
              <Icon name="cloud-upload" size={24} color="#FF6B00" />
              <Text style={styles.buttonText}>Select File</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {!error && uploadConfig && (
        <Text style={styles.hint}>
          Max size: {maxFileSize / (1024 * 1024)}MB | Allowed:{" "}
          {allowedTypes.join(", ")}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "red",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FF6B00",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF5F0",
    gap: 8,
  },
  uploadingButton: {
    opacity: 0.7,
  },
  errorBorder: {
    borderColor: "red",
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "red",
  },
  hint: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },
  fileContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
  },
  fileActions: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  removeButton: {
    backgroundColor: "rgba(255,0,0,0.7)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 15,
    padding: 6,
    minWidth: 60,
  },
  progressText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginTop: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF6B00",
  },
  buttonText: {
    color: "#FF6B00",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default FileField;
