import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const ProfileScreen: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "We need camera roll permission to upload photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleAction = (action: string) => {
    Alert.alert(`Action: ${action}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 用户头像部分 */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleImageUpload}>
          <View style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <MaterialIcons name="account-circle" size={80} color="#666" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* 用户信息部分 */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>Chen Jun</Text>
        <Text style={styles.userRole}>Superadmin</Text>
        <Text style={styles.userPhone}>+60121212312</Text>
      </View>

      {/* 功能项部分 */}
      <View style={styles.menuContainer}>
        {/* 分割线 */}
        <View style={styles.divider} />

        {/* Share Your Feedback */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleAction("Share Feedback")}
        >
          <Text style={styles.menuText}>Share Your Feedback</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        {/* 分割线 */}
        <View style={styles.divider} />

        {/* Log Out */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleAction("Log Out")}
        >
          <Text style={styles.menuText}>Log Out</Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        {/* 分割线 */}
        <View style={styles.divider} />

        {/* Delete My Account */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleAction("Delete Account")}
        >
          <Text style={[styles.menuText, styles.deleteText]}>
            Delete My Account
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        {/* 分割线 */}
        <View style={styles.divider} />
      </View>

      {/* 版本信息 */}
      <Text style={styles.versionText}>
        v2.4.2 build 133 staging-cx (116564)
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 50, // 为底部留出空间，防止内容被遮挡
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  userInfoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  userPhone: {
    fontSize: 16,
    color: "#333",
  },
  menuContainer: {
    marginTop: 20,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  deleteText: {
    color: "red",
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 60,
    marginBottom: 20,
  },
});

export default ProfileScreen;
