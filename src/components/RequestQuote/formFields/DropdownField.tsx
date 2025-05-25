import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

interface DropdownOption {
  value: string;
  label: string;
}

interface DataSource {
  url: string;
  params?: Record<string, any>;
}

interface DropdownFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: DropdownOption[];
  dataSource?: DataSource;
  error?: string;
  required?: boolean;
  hint?: string;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  value,
  onChange,
  options = [],
  dataSource,
  error,
  required,
  hint,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fetchedOptions, setFetchedOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!dataSource) return;

      setLoading(true);
      try {
        const response = await axios.get(dataSource.url, {
          params: dataSource.params,
        });

        const items = response.data?.data || [];

        const mapped = items.map((item: any) => ({
          label: item.label || item.name || item.title || String(item.id),
          value: String(item.value ?? item.id),
        }));

        setFetchedOptions(mapped);
      } catch (err) {
        console.error("Failed to fetch dropdown options:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [dataSource]);

  const allOptions = dataSource ? fetchedOptions : options;

  const selectedLabel =
    allOptions.find((opt) => opt.value === value)?.label ||
    hint ||
    "Select an option";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <TouchableOpacity
        style={[styles.dropdown, error ? styles.errorBorder : null]}
        onPress={() => setModalVisible(true)}
        disabled={dataSource && loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <>
            <Text style={styles.selectedText}>{selectedLabel}</Text>
            <Icon name="arrow-drop-down" size={24} color="#666" />
          </>
        )}
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <FlatList
                  data={allOptions}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.option}
                      onPress={() => {
                        onChange(item.value);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                      {value === item.value && (
                        <Icon name="check" size={20} color="#FF6B00" />
                      )}
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text style={styles.optionText}>No options available</Text>
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 50,
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "red",
  },
  errorBorder: {
    borderColor: "red",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 8,
    maxHeight: "60%",
    paddingVertical: 10,
  },
  option: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  emptyContainer: {
    flex: 1,
    height: 200, // 可根据需要调整弹窗内可视区域高度
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DropdownField;
