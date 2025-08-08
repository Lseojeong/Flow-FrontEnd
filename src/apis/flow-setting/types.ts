export interface FlowSetting {
  workToken: string;
  temperature: number;
  maxToken: number;
  topK: number;
  topP: number;
  prompt: string;
}

export interface FlowSettingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FlowSetting;
}

export interface FlowSettingUpdateRequest {
  temperature: number;
  maxToken: number;
  topK: number;
  topP: number;
  prompt: string;
}

export interface FlowSettingUpdateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    orgId: string;
  };
}
