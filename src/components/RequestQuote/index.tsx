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
  const [_, forceUpdate] = useState(0); // 强制刷新用于响应条件变化

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

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    // 触发刷新重新计算 visible 状态
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

      {formData.items
        .filter((item) => isItemVisible(item))
        .map((item) => {
          const commonProps = {
            key: item.id.toString(),
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
                  {...commonProps}
                  dataSource={item.type_config.data_source}
                />
              );
            case "radio":
              return (
                <RadioField
                  {...commonProps}
                  options={item.type_config.options || []}
                />
              );
            case "file":
              const fileUploadConfig =
                item.type_config.files?.[0]?.upload_config;
              return (
                <FileField
                  {...commonProps}
                  uploadConfig={
                    fileUploadConfig
                      ? {
                          ...fileUploadConfig,
                          method: fileUploadConfig.method as
                            | "POST"
                            | "PUT"
                            | "PATCH",
                        }
                      : undefined
                  }
                />
              );
            case "auto_complete_text":
              return (
                <AutoCompleteField
                  {...commonProps}
                  dataSource={item.type_config.data_source}
                  defaultValue={item.type_config.default}
                />
              );
            default:
              return null;
          }
        })}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {formData.submit.display_name.en}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
  },
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
