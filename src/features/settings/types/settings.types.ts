export interface SystemSetting {
  id?: string;
  key?: string;
  name?: string;
  code?: string;
  description?: string;
  value?: string | number | boolean;
  type?: string;
  category?: string;
  [key: string]: unknown;
}

export interface UpdateSystemSettingPayload {
  id?: string;
  key?: string;
  code?: string;
  value: string | number | boolean;
}