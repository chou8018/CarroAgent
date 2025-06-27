import React from "react";
import { TabBar } from "react-native-tab-view";
import { StyleSheet } from "react-native";

export const CustomTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={styles.indicator}
    style={styles.bar}
    labelStyle={styles.label}
    activeColor="#FF6B00"
    inactiveColor="#666"
  />
);

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
    margin: 0,
  },
  indicator: {
    backgroundColor: "#FF6B00",
    height: 3,
  },
});
