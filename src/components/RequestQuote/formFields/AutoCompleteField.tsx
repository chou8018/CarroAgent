import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { debounce } from "lodash";

interface SuggestionItem {
  id?: string | number;
  value?: string;
  name?: string;
  label?: string;
}

interface AutoCompleteFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  dataSource?: {
    url: string;
    params?: Record<string, any>;
  };
  error?: string;
  required?: boolean;
  hint?: string;
  defaultValue?: string;
  textCaps?: boolean;
  displayKey?: keyof SuggestionItem;
  valueKey?: keyof SuggestionItem;
}

const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({
  label,
  value,
  onChange,
  dataSource,
  error,
  required,
  hint,
  defaultValue = "",
  textCaps = false,
  displayKey = "name",
  valueKey = "id",
}) => {
  const [query, setQuery] = useState<string>(defaultValue);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // 初始化默认值（保持与外部value同步）
  useEffect(() => {
    if (!isDirty) {
      const initialValue = value || defaultValue;
      // setQuery(initialValue);
      handleClear();
      if (value !== initialValue) {
        onChange(initialValue);
      }
    }
  }, [value, defaultValue]);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!dataSource?.url || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${dataSource.url}?query=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setSuggestions(data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [dataSource]
  );

  // 处理输入变化
  const handleInputChange = (text: string) => {
    const newText = textCaps ? text.toUpperCase() : text;
    setQuery(newText);
    onChange(newText);
    setIsDirty(true);

    if (newText.length > 1) {
      debouncedSearch(newText);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
    }
  };

  // 选择项处理
  const handleSelect = (item: SuggestionItem) => {
    const displayValue = String(item[displayKey] || item.label || "");
    const submitValue = String(item[valueKey] || displayValue);

    setQuery(displayValue);
    onChange(submitValue);
    setShowSuggestions(false);
    setIsDirty(displayValue !== defaultValue);
    Keyboard.dismiss();
  };

  // 清除输入（重置为默认值）
  const handleClear = () => {
    setQuery(defaultValue);
    onChange(defaultValue);
    setSuggestions([]);
    setIsDirty(false);
    inputRef.current?.focus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={[styles.inputContainer, error ? styles.errorBorder : null]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={handleInputChange}
          placeholder={hint}
          placeholderTextColor="#999"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          autoCapitalize={textCaps ? "characters" : "none"}
        />

        {query !== defaultValue ? (
          <TouchableOpacity onPress={handleClear}>
            <Icon name="close" size={20} color="#999" />
          </TouchableOpacity>
        ) : loading ? (
          <ActivityIndicator size="small" color="#FF6B00" />
        ) : (
          <Icon
            name={showSuggestions ? "arrow-drop-up" : "arrow-drop-down"}
            size={24}
            color="#666"
          />
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            keyboardShouldPersistTaps="always"
            keyExtractor={(item, index) =>
              item.id?.toString() || item.value || `suggestion-${index}`
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.suggestionText}>
                  {String(item[displayKey] || item.label || "")}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: "relative",
    zIndex: 1,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    paddingVertical: 12,
    color: "#000", // 强制统一文本颜色
  },
  errorBorder: {
    borderColor: "red",
  },
  error: {
    marginTop: 4,
    fontSize: 14,
    color: "red",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    elevation: 3,
    zIndex: 100,
    marginTop: 4,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AutoCompleteField;
