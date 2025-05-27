import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { RequestQuoteService } from "./services";
import { FormData } from "./types";
import TextField from "./formFields/TextField";
import DropdownField from "./formFields/DropdownField";
import RadioField from "./formFields/RadioField";
import FileField from "./formFields/FileField";
import AutoCompleteField from "./formFields/AutoCompleteField";

const RequestQuoteScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [_, forceUpdate] = useState(0);
  const [optionsCache, setOptionsCache] = useState<Record<number, any[]>>({});

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const data = await RequestQuoteService.getDraftForm();
        setFormData(data);
        const initialValues: Record<string, any> = {};
        data.items.forEach((item) => {
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

  const itemMap = useMemo(() => {
    const map = new Map<number, FormData["items"][0]>();
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

    try {
      await RequestQuoteService.submitForm(formData.id, formValues);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  const renderField = (item: FormData["items"][0]) => {
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

  if (!formData) {
    return (
      <View style={styles.container}>
        <Text>Failed to load form data.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Request A Quote</Text>
      <Text style={styles.subtitle}>Please tell us more about your car.</Text>
      <Text style={styles.subtitle}>
        Fill out the form below to schedule an inspection.
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
});

export default RequestQuoteScreen;
