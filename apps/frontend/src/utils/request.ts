import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import router from "@/router";
import { ResponseCode } from "@miany-soul/shared";
import { useMessage } from "@/composables/useMessage";
import { getAccessToken } from "@/utils/auth-token";
import { useUserStore } from "@/stores/user";

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, message } = response.data;

    if (code === ResponseCode.SUCCESS) {
      return data;
    }

    const { error } = useMessage();
    error(message || "请求失败");
    return Promise.reject(new Error(message || "请求失败"));
  },
  (error) => {
    const { error: showError } = useMessage();

    if (error.response) {
      const { status, data, config } = error.response;

      if (status === 401 || data?.code === ResponseCode.UNAUTHORIZED) {
        const url = config?.url || "";
        const isChangePassword = url.includes("change-password");
        if (!isChangePassword) {
          const userStore = useUserStore();
          userStore.logout();
          router.push({ name: "AdminLogin" });
          showError("登录已过期，请重新登录");
        }
        return Promise.reject(error);
      }

      if (status === 403 || data?.code === ResponseCode.FORBIDDEN) {
        showError("权限不足");
        return Promise.reject(error);
      }

      showError(data?.message || error.message || "请求失败");
    } else {
      showError("网络错误，请检查网络连接");
    }

    return Promise.reject(error);
  }
);

export const http = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config);
  },

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config);
  },

  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config);
  },

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config);
  },

  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.patch(url, data, config);
  },
};

export default request;
