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
  Alert,
} from "react-native";
import { RootStackParamList } from "../navigation/types";
import { AppointmentService } from "../api/services/appointmentService";
import {
  Postcode as PostcodeItem,
  InspectionLocation,
  AvailableDate,
} from "../api/types/appointment";
import dayjs from "dayjs";
import { Dimensions } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RequestQuoteService } from "../components/RequestQuote/services";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AppointmentRouteProp = RouteProp<RootStackParamList, "Appointment">;
const screenWidth = Dimensions.get("window").width;
const itemWidth = (screenWidth - 15 * 2 - 15 * 4) / 5; // 5列，左右各15边距，4个间距10

type AppointmentScreenRouteProp = RouteProp<RootStackParamList, "Appointment">;

interface AppointmentScreenProps {
  route: AppointmentScreenRouteProp;
}

interface Location {
  title: string;
  value: string;
}

const AppointmentScreen: React.FC<AppointmentScreenProps> = () => {
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

  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const route = useRoute<AppointmentRouteProp>();
  const { carplateNo, formData } = route.params;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

    const found = allPostcodes.find((item) => item.postcode === postcode);
    if (found?.location_id) {
      fetchAvailableDates(found.location_id.toString());
    } else {
      setAvailableDates([]);
      setSelectedDate(null);
      setTimeSlots([]);
    }
  };

  const handlePostcodeChange = (text: string) => {
    setPostCode(text);
    if (text.length === 0) {
      setShowPostcodeList(false);
      setFilteredPostcodes([]);
      setAvailableDates([]);
      setSelectedDate(null);
      setTimeSlots([]);
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
    fetchAvailableDates(item.value);
  };

  const fetchAvailableDates = async (locationId: string) => {
    try {
      setLoadingDates(true);
      const response: AvailableDate[] =
        await AppointmentService.getAvailableDates({
          locationId: Number(locationId),
          postcode: postCode,
        });

      // 提取日期字符串
      const dates = response.map((item) => item.date);
      setAvailableDates(dates);
      setSelectedDate(null);
      setTimeSlots([]);
      setSelectedTimeSlot(null);
    } catch (error) {
      console.error("Failed to fetch available dates:", error);
      setAvailableDates([]);
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchTimeSlots = async (locationId: string, date: string) => {
    try {
      setLoadingSlots(true);
      const response = await AppointmentService.getTimeSlots({
        locationId: Number(locationId),
        date,
      });
      // console.log("✅ fetch timeslots success", response);

      // response 类型是 { [date: string]: TimeSlot[] }
      const slotsForDate = response[date] || [];

      // 过滤剩余槽位大于0的时间段
      const availableSlots = slotsForDate.filter((slot) => slot.slots_left > 0);
      // 映射成字符串数组，只显示时间字符串
      const slotStrings = availableSlots.map((slot) => slot.time);
      setTimeSlots(slotStrings);
    } catch (error) {
      console.error("Failed to fetch time slots:", error);
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    const locationId = isMobileSelected
      ? allPostcodes.find((item) => item.postcode === postCode)?.location_id
      : selectedLocation?.value;

    if (locationId) {
      fetchTimeSlots(locationId.toString(), date);
    } else {
      setTimeSlots([]);
    }
  };

  const handleSubmit = async () => {
    if (isMobileSelected) {
      if (!postCode) {
        Alert.alert("Validation", "Please enter postcode.");
        return;
      }
      if (!address) {
        Alert.alert("Validation", "Please enter address.");
        return;
      }
    } else {
      if (!selectedLocation) {
        Alert.alert("Validation", "Please select a location.");
        return;
      }
    }
    if (!selectedDate) {
      Alert.alert("Validation", "Please select a date.");
      return;
    }
    if (!selectedTimeSlot) {
      Alert.alert("Validation", "Please select a time slot.");
      return;
    }

    const url = formData?.submit?.submit_config?.url;

    if (!url) {
      console.warn("url is invalid");
      return;
    }

    // 🟡 构建 inspection_appointment 字段并添加到 formData（不影响原逻辑）
    const date = selectedDate;
    const time_slot = convertTo24HourFormat(selectedTimeSlot);
    const locationId = isMobileSelected
      ? allPostcodes.find((item) => item.postcode === postCode)?.location_id
      : parseInt(selectedLocation?.value ?? "", 10);
    const inspection_appointment = isMobileSelected
      ? {
          location_type: "mobile",
          postcode: postCode,
          location_id: locationId,
          start_time: date,
          time_slot,
          address,
        }
      : {
          location_type: "inspection_point",
          location_id: locationId,
          location_name: selectedLocation?.title,
          start_time: date,
          time_slot,
        };

    const newFormData = {
      ...formData,
      inspection_appointment,
    };

    // 这种提交格式也是ok的
    // const newFormData = {
    //   items: formData.items,
    //   inspection_appointment,
    // };
    console.log("🧩 submit formData:", newFormData);

    try {
      const data = await RequestQuoteService.submitForm(url, newFormData);

      console.log("✅  submit success:", data);

      // 跳转到主 Tab 的 Sell 页面
      navigation.navigate("Main", {
        screen: "Sell",
      });
    } catch (error) {
      console.error("Failed to fetch form data:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertTo24HourFormat = (time12h: string): string => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
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
                returnKeyType="done"
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
              <View style={styles.locationListContainer}>
                <FlatList
                  data={locations}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.locationItem}
                      onPress={() => handleLocationSelect(item)}
                    >
                      <Text>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled
                />
              </View>
            ))}
        </>
      )}

      <Text style={styles.label}>Select Date *</Text>
      {loadingDates ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <FlatList
          data={availableDates}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateItem,
                selectedDate === item && styles.selectedDateItem,
              ]}
              onPress={() => handleDateSelect(item)}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedDate === item && styles.selectedDateText,
                ]}
              >
                {dayjs(item).format("MMM D, YYYY")}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>No available dates</Text>
          )}
        />
      )}

      <Text style={styles.label}>Select Time Slot *</Text>
      {loadingSlots ? (
        <ActivityIndicator size="small" color="#007AFF" />
      ) : (
        <FlatList
          data={timeSlots}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.timeSlotItem,
                selectedTimeSlot === item && styles.selectedTimeSlotItem,
              ]}
              onPress={() => setSelectedTimeSlot(item)}
            >
              <Text
                style={[
                  styles.dateText,
                  selectedTimeSlot === item && styles.selectedDateText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>No available time slots</Text>
          )}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  subHeader: { fontSize: 16, fontWeight: "600" },
  description: { marginBottom: 20, color: "#666" },

  selectionContainer: { flexDirection: "row", marginBottom: 20 },
  selectionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007AFF",
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  selectionButtonText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  selectedButtonText: {
    color: "#fff",
  },

  label: {
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },

  carplate: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
  },

  postcodeListContainer: {
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: "#fff",
    zIndex: 9999,
  },

  postcodeItem: {
    padding: 10,
  },
  postcodeText: {
    fontSize: 16,
  },

  locationListContainer: {
    maxHeight: 180,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 4,
    backgroundColor: "#fff",
  },
  locationItem: {
    padding: 10,
  },

  separator: {
    height: 1,
    backgroundColor: "#eee",
  },

  dateList: {
    paddingVertical: 10,
  },
  dateItem: {
    width: itemWidth,
    height: 60,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12, // 最后一列可能需要去掉
    marginBottom: 10, // 可选：多行布局时增加下间距
  },
  selectedDateItem: {
    backgroundColor: "#007AFF",
  },
  dateText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  selectedDateText: {
    color: "#fff",
  },

  timeSlotItem: {
    height: 60,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  selectedTimeSlotItem: {
    backgroundColor: "#007AFF",
  },

  noDataText: {
    color: "#999",
    fontStyle: "italic",
  },

  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default AppointmentScreen;
