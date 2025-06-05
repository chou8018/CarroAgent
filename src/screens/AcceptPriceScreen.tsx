import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RequestQuoteService } from "../components/RequestQuote/services";
import { QuoteFormData, FormItem } from "../components/RequestQuote/types";
import TextField from "../components/RequestQuote/formFields/TextField";
import DropdownField from "../components/RequestQuote/formFields/DropdownField";
import RadioField from "../components/RequestQuote/formFields/RadioField";
import FileField from "../components/RequestQuote/formFields/FileField";
import AutoCompleteField from "../components/RequestQuote/formFields/AutoCompleteField";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import type { SubPageData } from "./SellScreen";

type RouteParams = {
  offer: SubPageData;
};

const AcceptPriceScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState<QuoteFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [_, forceUpdate] = useState(0);
  const [optionsCache, setOptionsCache] = useState<Record<number, any[]>>({});
  type AcceptPriceScreenRouteProp = RouteProp<
    RootStackParamList,
    "AcceptPrice"
  >;
  const route = useRoute<AcceptPriceScreenRouteProp>();
  // 安全获取参数并处理可能的undefined
  const { offer } = (route.params as RouteParams) || {
    offer: {
      car_plate: "N/A",
      price_value: "N/A",
      owner_name: "N/A",
      manufacture_year: "N/A",
      car_make: "N/A",
      car_model: "N/A",
      processing_fee: 0,
    },
  };

  // 安全访问字段
  const carPlate = offer.car_plate;
  const price = offer.price_value;
  const processingFee = offer.processing_fee || 0;

  useEffect(() => {
    if (!offer) {
      console.warn("No item data received, going back");
      navigation.goBack();
      return;
    }
    const fetchFormData = async () => {
      try {
        const data = await RequestQuoteService.getAcceptPriceForm();
        setFormData(data);
        const initialValues: Record<string, any> = {};
        data.items.forEach((item: FormItem) => {
          initialValues[item.name] =
            item.value || item.type_config.default || "";
        });
        setFormValues(initialValues);
      } catch (error) {
        console.error("Failed to fetch form data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  useEffect(() => {
    if (!formData) return;

    formData.items.forEach((item) => {
      if (item.type === "dropdown" && isItemVisible(item)) {
        loadOptions(item);
      }
    });
  }, [formData]);

  const itemMap = useMemo(() => {
    const map = new Map<number, QuoteFormData["items"][0]>();
    formData?.items.forEach((item) => map.set(item.id, item));
    return map;
  }, [formData]);

  const isItemVisible = (item: any): boolean => {
    if (!formData) return item.visible;

    const controllers = formData.items.filter((field) =>
      field.type_config?.condition?.action?.some(
        (action) => action.id === item.id
      )
    );

    for (const controller of controllers) {
      const currentValue = formValues[controller.name];
      const actions = controller.type_config?.condition?.action;
      const action = actions?.find(
        (a) => a.id === item.id && a.value === currentValue
      );
      if (action) {
        return action.action_type === "show";
      }
    }

    return item.visible;
  };

  const loadOptions = async (item: any) => {
    console.log("💥 loadOptions triggered for", item.name);

    // ✅ 优先使用静态 options
    if (
      Array.isArray(item.type_config?.options) &&
      item.type_config.options.length > 0
    ) {
      const mappedOptions = item.type_config.options.map((opt: any) => ({
        label: opt.label || opt.title || String(opt.value),
        value: String(opt.value),
      }));

      console.log(
        `[loadOptions] Static options for ${item.name}:`,
        mappedOptions
      );
      setOptionsCache((prev) => ({ ...prev, [item.id]: mappedOptions }));
      return;
    }
    const ds = item.type_config?.data_source;

    if (!ds || typeof ds.url !== "string" || !ds.url.trim()) {
      console.warn("❗ Invalid ds.url for", item.name, ds);
      return;
    }

    const params: Record<string, any> = {};

    ds.params?.forEach((param: any) => {
      if (param.value_ref) {
        const refItem = itemMap.get(param.value_ref);
        if (refItem) {
          params[param.name] = formValues[refItem.name];
        }
      } else {
        params[param.name] = param.value;
      }
    });

    params["country_code"] = formValues["country_code"] || "MY";

    try {
      console.log("🚀 Fetching options:", ds.url, params);
      const rawData = await RequestQuoteService.fetchOptions(ds.url, params);

      const mappedOptions = Array.isArray(rawData)
        ? rawData.map((opt: any) => ({
            label: opt.title || opt.label || String(opt.value),
            value: String(opt.value),
          }))
        : [];

      console.log(
        `[loadOptions] Mapped options for ${item.name}:`,
        mappedOptions
      );

      setOptionsCache((prev) => ({ ...prev, [item.id]: mappedOptions }));
    } catch (e) {
      console.error("Failed to fetch options for", item.name, e);
      setOptionsCache((prev) => ({ ...prev, [item.id]: [] }));
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => {
      const updated = { ...prev, [name]: value };

      const controller = formData?.items.find((item) => item.name === name);
      const actions = controller?.type_config?.condition?.action || [];

      actions.forEach((act: any) => {
        const target = itemMap.get(act.id);
        if (target) {
          updated[target.name] = "";
          loadOptions(target);
        }
      });

      return updated;
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    forceUpdate((i) => i + 1);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const newErrors: Record<string, string> = {};
    formData.items.forEach((item) => {
      if (
        item.type_config.required &&
        isItemVisible(item) &&
        !formValues[item.name]
      ) {
        newErrors[item.name] =
          item.validate_config?.empty_validate?.empty_tip_message.en ||
          "This field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // ✅ Step 2: 将 formValues 赋回 formData.items[].value
    const updatedItems = formData.items.map((item) => {
      let value = formValues[item.name] ?? "";

      // ✅ 强制转换成字符串（仅当为基本类型时）
      if (typeof value === "number") {
        value = String(value);
      } else if (value && typeof value === "object" && "value" in value) {
        value = String(value.value);
      }

      return {
        ...item,
        value,
      };
    });

    const updatedFormData = {
      ...formData,
      items: updatedItems,
    };
    navigation.navigate("Appointment", {
      carplateNo: formValues["car_plate"] || "TEST001",
      formData: updatedFormData,
    });
  };

  const renderField = (item: QuoteFormData["items"][0]) => {
    const key = item.id.toString();
    const commonProps = {
      label: item.display_name.en,
      value: formValues[item.name],
      onChange: (value: any) => handleChange(item.name, value),
      error: errors[item.name],
      required: item.type_config.required,
      hint: item.type_config.hint?.en,
    };

    switch (item.type) {
      case "text":
        return (
          <TextField
            key={key}
            {...commonProps}
            textType={item.type_config.text_type}
            prefix={item.type_config.prefix}
            suffix={item.type_config.suffix}
            textCaps={item.type_config.text_caps}
          />
        );
      case "dropdown":
        return (
          <DropdownField
            key={key}
            {...commonProps}
            options={optionsCache[item.id] || []}
            dataSource={item.type_config.data_source}
            onFocus={() => loadOptions(item)}
          />
        );
      case "radio":
        return (
          <RadioField
            key={key}
            {...commonProps}
            options={item.type_config.options || []}
          />
        );
      case "file":
        const fileConfig = item.type_config.files?.[0];
        const uploadConfig = fileConfig?.upload_config;
        const deleteConfig = fileConfig?.delete_config;

        return (
          <FileField
            key={key}
            {...commonProps}
            uploadConfig={
              uploadConfig
                ? {
                    ...uploadConfig,
                    item_id: item.id.toString(),
                    collection: uploadConfig.collection,
                    file_item_name: fileConfig.name,
                    method: uploadConfig.method as "POST" | "PUT",
                  }
                : undefined
            }
            deleteConfig={
              deleteConfig
                ? {
                    ...deleteConfig,
                    item_id: item.id.toString(),
                    collection: deleteConfig.collection,
                    file_item_name: fileConfig.name,
                    method: deleteConfig.method as "DELETE",
                  }
                : undefined
            }
          />
        );
      case "auto_complete_text":
        return (
          <AutoCompleteField
            key={key}
            {...commonProps}
            dataSource={item.type_config.data_source}
            defaultValue={item.type_config.default}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (!offer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No vehicle data available</Text>
      </View>
    );
  }

  if (!formData) {
    return (
      <View style={styles.container}>
        <Text>Failed to load form data.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Carplate No.: {offer.car_plate}</Text>
      <Text style={styles.subtitle}>Price:{offer.price_value}</Text>
      <Text style={styles.subtitle}>
        Processing Fee: {offer.processing_fee}
      </Text>

      {formData.items.filter(isItemVisible).map(renderField)}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {formData.submit.display_name.en}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8, color: "#333" },
  subtitle: { fontSize: 16, marginBottom: 16, color: "#666" },
  submitButton: {
    backgroundColor: "#FF6B00",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default AcceptPriceScreen;
