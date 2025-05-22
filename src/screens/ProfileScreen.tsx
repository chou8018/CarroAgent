import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "../store/userStore";
import EnvIndicator from "../components/EnvIndicator";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);
  const insets = useSafeAreaInsets();
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

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>
              {user.active_group.role.display_name}
            </Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>

          {/* 功能项部分 */}
          <View style={styles.menuContainer}>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("Share Feedback")}
            >
              <Text style={styles.menuText}>Share Your Feedback</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("Log Out")}
            >
              <Text style={styles.menuText}>Log Out</Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleAction("Delete Account")}
            >
              <Text style={[styles.menuText, styles.deleteText]}>
                Delete My Account
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
            <View style={styles.divider} />
          </View>
        </ScrollView>

        {/* 固定到底部的组件 */}
        <View
          style={[styles.footer, { paddingBottom: (insets.bottom || 0) + 15 }]}
        >
          <EnvIndicator position="bottom-center" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 8,
  },
});

export default ProfileScreen;
