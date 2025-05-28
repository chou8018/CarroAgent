import React, { useState, useEffect } from "react";
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
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { AppointmentService } from "../api/services/appointmentService";
import {
  Postcode as PostcodeItem,
  InspectionLocation,
} from "../api/types/appointment";

type AppointmentScreenRouteProp = RouteProp<RootStackParamList, "Appointment">;

interface AppointmentScreenProps {
  route: AppointmentScreenRouteProp;
}

interface Location {
  title: string;
  value: string;
}

const AppointmentScreen: React.FC<AppointmentScreenProps> = ({ route }) => {
  const { carplateNo } = route.params;

  const [isMobileSelected, setIsMobileSelected] = useState<boolean>(true);
  const [postCode, setPostCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [allPostcodes, setAllPostcodes] = useState<PostcodeItem[]>([]);
  const [filteredPostcodes, setFilteredPostcodes] = useState<PostcodeItem[]>(
    []
  );
  const [locations, setLocations] = useState<Location[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [showPostcodeList, setShowPostcodeList] = useState<boolean>(false);
  const [showLocationList, setShowLocationList] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  useEffect(() => {
    const fetchPostcodes = async () => {
      try {
        setLoading(true);
        const response = await AppointmentService.getAvailablePostcodes();
        setAllPostcodes(response);
      } catch (error) {
        console.error("Failed to fetch postcodes:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        setLocationLoading(true);
        const response = await AppointmentService.getAvailableLocations();
        const formatted: Location[] = response.map(
          (item: InspectionLocation) => ({
            title: item.title,
            value: String(item.value),
          })
        );
        setLocations(formatted);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLocationLoading(false);
      }
    };

    fetchPostcodes();
    fetchLocations();
  }, []);

  useEffect(() => {
    if (postCode.length > 0) {
      const filtered = allPostcodes.filter((item) =>
        item.postcode.startsWith(postCode)
      );
      setFilteredPostcodes(filtered);
      setShowPostcodeList(filtered.length > 0);
    } else {
      setFilteredPostcodes([]);
      setShowPostcodeList(false);
    }
  }, [postCode, allPostcodes]);

  const handlePostcodeSelect = (postcode: string) => {
    setPostCode(postcode);
    setFilteredPostcodes([]);
    setShowPostcodeList(false);
    Keyboard.dismiss();
  };

  const handlePostcodeChange = (text: string) => {
    setPostCode(text);
    if (text.length === 0) {
      setShowPostcodeList(false);
      setFilteredPostcodes([]);
    }
  };

  const handleInputFocus = () => {
    if (postCode.length > 0 && filteredPostcodes.length > 0) {
      setShowPostcodeList(true);
    }
  };

  const toggleLocationList = () => {
    setShowLocationList((prev) => !prev);
  };

  const handleLocationSelect = (item: Location) => {
    setSelectedLocation(item);
    setShowLocationList(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request A Quote</Text>

      <Text style={styles.subHeader}>Choose Mobile or Inspection Point</Text>
      <Text style={styles.description}>
        Followed by an appointment date and time.
      </Text>

      <View style={styles.selectionContainer}>
        <TouchableOpacity
          style={[
            styles.selectionButton,
            isMobileSelected && styles.selectedButton,
          ]}
          onPress={() => setIsMobileSelected(true)}
        >
          <Text
            style={[
              styles.selectionButtonText,
              isMobileSelected && styles.selectedButtonText,
            ]}
          >
            Mobile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.selectionButton,
            !isMobileSelected && styles.selectedButton,
          ]}
          onPress={() => setIsMobileSelected(false)}
        >
          <Text
            style={[
              styles.selectionButtonText,
              !isMobileSelected && styles.selectedButtonText,
            ]}
          >
            Inspection Point
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Carplate No.:</Text>
      <Text style={styles.carplate}>{carplateNo}</Text>

      {isMobileSelected ? (
        <>
          <Text style={styles.label}>Post Code *</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter post code"
                value={postCode}
                onChangeText={handlePostcodeChange}
                placeholderTextColor="#999"
                keyboardType="number-pad"
                onFocus={handleInputFocus}
                onBlur={() => setShowPostcodeList(false)}
              />
              {showPostcodeList && filteredPostcodes.length > 0 && (
                <View style={styles.postcodeListContainer}>
                  <FlatList
                    data={filteredPostcodes}
                    keyExtractor={(item, index) => `${item.postcode}-${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.postcodeItem}
                        onPress={() => handlePostcodeSelect(item.postcode)}
                      >
                        <Text style={styles.postcodeText}>{item.postcode}</Text>
                      </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                    keyboardShouldPersistTaps="always"
                    nestedScrollEnabled
                  />
                </View>
              )}
            </>
          )}
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#999"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Select Location *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={toggleLocationList}
            disabled={locationLoading}
          >
            <Text style={{ color: selectedLocation ? "#000" : "#999" }}>
              {selectedLocation ? selectedLocation.title : "Choose location"}
            </Text>
          </TouchableOpacity>
          {showLocationList &&
            (locationLoading ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <View style={styles.postcodeListContainer}>
                <FlatList
                  data={locations}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.postcodeItem}
                      onPress={() => handleLocationSelect(item)}
                    >
                      <Text style={styles.postcodeText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  nestedScrollEnabled
                />
              </View>
            ))}
        </>
      )}

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#000" },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  description: { fontSize: 14, color: "#666", marginBottom: 20 },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  selectionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  selectedButton: { backgroundColor: "#007AFF" },
  selectionButtonText: { fontSize: 16, color: "#000" },
  selectedButtonText: { color: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#000" },
  carplate: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  postcodeListContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 20,
  },
  postcodeItem: { padding: 12, backgroundColor: "#fff" },
  postcodeText: { fontSize: 16, color: "#000" },
  separator: { height: 1, backgroundColor: "#eee" },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AppointmentScreen;
