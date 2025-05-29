export interface FormItem {
  id: number;
  visible: boolean;
  value: any;
  display_name: {
    en: string;
    id?: string;
  };
  type: "text" | "dropdown" | "radio" | "file" | "auto_complete_text";
  name: string;
  validate_config?: {
    empty_validate?: {
      empty_tip_message: {
        en: string;
        id?: string;
      };
    };
    space_validate?: {
      space_tip_message: {
        en: string;
      };
    };
    multiples_validate?: {
      multiples_tip_message: {
        en: string;
      };
      multiple_value: string;
    };
    max_length_validate?: {
      max_length: string;
      max_length_tip_message: {
        en: string;
      };
    };
  };
  type_config: {
    text_type?: "string" | "number";
    prefix?: string;
    suffix?: string;
    hint?: {
      en: string;
      id?: string;
    };
    text_caps?: boolean;
    required?: boolean;
    default?: any;
    options?: Array<{
      value: string;
      display_name: string;
    }>;
    data_source?: {
      url: string;
      params?: Array<{
        name: string;
        value_ref: number;
      }>;
    };
    condition?: {
      action: Array<{
        value: string;
        action_type: "show" | "hide" | "refresh";
        id: number;
      }>;
    };
    files?: Array<{
      display_name: string;
      upload_config: {
        url: string;
        method: string;
        collection: string;
      };
      name: string;
      file_type: string;
      delete_config: {
        url: string;
        method: string;
        collection: string;
      };
    }>;
  };
}

export interface QuoteFormData {
  id: number;
  lead_id: number | null;
  submit: {
    submit_config: {
      url: string;
      method: string;
    };
    display_name: {
      id: string;
      en: string;
    };
  };
  files: any;
  items: FormItem[];
}
