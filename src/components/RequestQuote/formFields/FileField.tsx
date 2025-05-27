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
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import Icon from "react-native-vector-icons/MaterialIcons";
import { RequestQuoteService } from "../services";

interface UploadImage {
  url: string;
  id: string;
  cdn_url: string;
  cdn_watermark_url: string;
  collection_name: string;
  file_name: string;
  thumbnail_url: string;
  updated_at: string;
}

interface UploadConfig {
  url: string;
  method?: "POST" | "PUT" | "DELETE";
  collection?: string;
  item_id?: string;
  file_item_name?: string;
  headers?: Record<string, string>;
}

interface FileValue {
  uri: string;
  id: string;
}

interface FileFieldProps {
  label: string;
  value: FileValue | null;
  onChange: (file: FileValue | null) => void;
  error?: string;
  required?: boolean;
  uploadConfig?: UploadConfig;
  deleteConfig?: UploadConfig;
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
  deleteConfig,

  allowedTypes = ["image/jpeg", "image/png"],
  maxFileSize = 5 * 1024 * 1024,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission denied", "Media library access is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: false,
      });

      if (result.canceled) return;

      const file = result.assets?.[0];
      if (!file?.uri) return;

      const { uri: compressedUri } = await resizeAndCompressImage(file.uri);

      const fileInfo = await FileSystem.getInfoAsync(compressedUri);
      if (!fileInfo.exists) throw new Error("File does not exist");
      if (fileInfo.size && fileInfo.size > maxFileSize) {
        throw new Error(`File must be < ${maxFileSize / (1024 * 1024)}MB`);
      }

      // 先把本地压缩图uri传递给外部回调，方便展示loading或预览
      onChange({ uri: compressedUri, id: "" });

      if (uploadConfig) {
        await uploadToServer(compressedUri);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Upload failed"
      );
      onChange(null);
    }
  };

  const resizeAndCompressImage = async (uri: string) => {
    const info = await ImageManipulator.manipulateAsync(uri, []);
    const { width, height } = info;
    const maxSide = Math.max(width, height);
    const scale = maxSide > 1200 ? 1200 / maxSide : 1;

    return await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: Math.round(width * scale),
            height: Math.round(height * scale),
          },
        },
      ],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );
  };

  const uploadToServer = async (uri: string) => {
    if (!uploadConfig) return;

    setUploading(true);
    setProgress(0);

    try {
      const extraFields: Record<string, any> = {
        item_id: uploadConfig.item_id,
        collection: uploadConfig.collection,
        file_item_name: uploadConfig.file_item_name,
      };

      const response = await RequestQuoteService.uploadFile(
        uri,
        uploadConfig.url,
        uploadConfig.method || "POST",
        (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
        extraFields
      );
      setProgress(100);
      const imageData = response.data;
      const uploadedImage: UploadImage = {
        url: imageData.url || "",
        id: imageData.id?.toString() || "",
        cdn_url: imageData.cdn_url || "",
        cdn_watermark_url: imageData.cdn_watermark_url || "",
        collection_name: imageData.collection_name || "",
        file_name: imageData.file_name || "",
        thumbnail_url: imageData.thumbnail_url || "",
        updated_at: imageData.updated_at || "",
      };

      // 这里传给外部的是带id的完整对象，方便删除时用
      onChange({ uri, id: uploadedImage.id });
      console.log("✅ Upload success", imageData);
    } catch (error) {
      console.error("Upload error", error);
      onChange(null);
      throw error;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const handleRemoveFile = async () => {
    if (!deleteConfig || !value) {
      onChange(null);
      return;
    }

    if (!deleteConfig.url) {
      Alert.alert("Delete Failed", "Delete URL is not configured");
      return;
    }

    try {
      setUploading(true);

      await RequestQuoteService.deleteFile(
        { url: deleteConfig.url, method: deleteConfig.method || "DELETE" },
        value.id
      );

      console.log("✅ File deleted remotely");
      onChange(null);
    } catch (error) {
      console.error("❌ Delete failed", error);
      Alert.alert(
        "Delete Failed",
        error instanceof Error ? error.message : "Unable to delete the file."
      );
    } finally {
      setUploading(false);
    }
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
            source={{ uri: value.uri }}
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
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 8, color: "#333" },
  required: { color: "red" },
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
  uploadingButton: { opacity: 0.7 },
  errorBorder: { borderColor: "red" },
  error: { marginTop: 4, fontSize: 14, color: "red" },
  hint: { marginTop: 4, fontSize: 12, color: "#666" },
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
  progressText: { color: "#fff", fontSize: 12, textAlign: "center" },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    marginTop: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#FF6B00" },
  buttonText: { color: "#FF6B00", fontSize: 16, fontWeight: "500" },
});

export default FileField;
