import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const DevFloatingButton = () => {
  const navigation = useNavigation();
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 100 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const { x, y } = (pan as any).__getValue();
        pan.setOffset({ x, y });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.fab, { transform: pan.getTranslateTransform() }]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("NetworkLogger" as never)}
      >
        <Text style={styles.buttonText}>🐞</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    zIndex: 999,
    right: 0,
    bottom: 0,
  },
  button: {
    backgroundColor: "#333",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
  floatingButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    opacity: 0.8,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
  },
});

export default DevFloatingButton;
