import axios, { AxiosError } from "axios";
import axiosRetry from "axios-retry";
import { toast } from "@/hooks/use-toast";
import Configs from "./configs";

const BASE_URL = Configs.baseUrl;
const requestTimeout = Configs.timeout;

const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: requestTimeout,
});

// Configure Axios retries
axiosRetry(apiService, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error: AxiosError) => {
    return !!error.response && error.response.status >= 500;
  },
});

// Response interceptor
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      toast({
        variant: "destructive",
        title: "Session Expired",
      });
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export default apiService;
