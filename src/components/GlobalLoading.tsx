import React from "react";
import { View, ActivityIndicator, StyleSheet, Modal } from "react-native";
import { useLoadingStore } from "../store/loadingStore";

const GlobalLoading: React.FC = () => {
  const loading = useLoadingStore((state) => state.loading);

  if (!loading) return null;

  return (
    <Modal transparent visible={loading} animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlobalLoading;
