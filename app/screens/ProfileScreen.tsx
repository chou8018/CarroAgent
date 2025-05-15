import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const ProfileScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.userName}>Chen Jun</Text>
      <Text style={styles.userRole}>Superadmin</Text>
      <Text style={styles.userPhone}>+60121212312</Text>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Share Your Feedback</Text>
        <Text style={styles.menuArrow}>{">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={styles.menuText}>Log Out</Text>
        <Text style={styles.menuArrow}>{">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Text style={[styles.menuText, styles.deleteText]}>
          Delete My Account
        </Text>
        <Text style={styles.menuArrow}>{">"}</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>
        v2.4.2 build 133 staging-cx (116564)
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  userPhone: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuText: {
    fontSize: 16,
  },
  menuArrow: {
    fontSize: 16,
    color: "#888",
  },
  deleteText: {
    color: "red",
  },
  versionText: {
    marginTop: 20,
    color: "#888",
    fontSize: 12,
    textAlign: "center",
  },
});

export default ProfileScreen;
