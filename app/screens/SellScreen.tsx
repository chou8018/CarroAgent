import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const sellOptions = [
  { id: "1", title: "Request" },
  { id: "2", title: "Calculator" },
  { id: "3", title: "Offers" },
  { id: "4", title: "Biddings" },
  { id: "5", title: "Records" },
];

const SellScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sell your cars</Text>
      <FlatList
        data={sellOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: 16,
  },
});

export default SellScreen;
