import { tokenAtom } from "@/atoms/auth";
import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { getDefaultStore } from "jotai";

const store = getDefaultStore();

export interface RequestConfig<TData = unknown> {
  baseURL?: string | undefined;
  url?: string | undefined;
  method: "GET" | "PUT" | "PATCH" | "POST" | "DELETE";
  params?: unknown;
  data?: TData | FormData | undefined;
  responseType?: ResponseType | undefined;
  signal?: AbortSignal | undefined;
  headers?: Record<string, string> | undefined;
}

export interface ResponseConfig<TData = unknown> {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"];
}

export type ResponseErrorConfig<TError = unknown> = AxiosError<TError>;

export type Client = <TData, _TError = unknown, TVariables = unknown>(
  config: RequestConfig<TVariables>,
) => Promise<ResponseConfig<TData>>;

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use((config) => {
  const token = store.get(tokenAtom);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // global error handling
    if (error.response?.status === 401) {
      //window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);

export async function axiosClient<
  TData,
  _TError = unknown,
  TVariables = unknown,
>(config: RequestConfig<TVariables>): Promise<ResponseConfig<TData>> {
  const response = await instance.request<TData>(
    config as AxiosRequestConfig<TVariables>,
  );
  return response as unknown as ResponseConfig<TData>;
}

export const axiosInstance = instance;

export default axiosClient;
