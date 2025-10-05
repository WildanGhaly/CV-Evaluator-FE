import axios from 'axios';
import type { UploadResponse, EvaluateRequest, EvaluateResponse, ResultResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFiles = async (cv: File, project: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('cv', cv);
  formData.append('report', project);  // Backend expects 'report' not 'project'

  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const evaluateDocuments = async (data: EvaluateRequest): Promise<EvaluateResponse> => {
  const response = await api.post<EvaluateResponse>('/evaluate', data);
  return response.data;
};

export const getResult = async (id: string): Promise<ResultResponse> => {
  const response = await api.get<ResultResponse>(`/result/${id}`);
  return response.data;
};

