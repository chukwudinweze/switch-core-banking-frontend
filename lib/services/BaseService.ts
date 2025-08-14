import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ** Config
import generalConfig from "@/lib/configs";
import { getSession } from "@/lib/actions/get-session";

// Add this interface after the imports
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipAuthRefresh?: boolean;
}

// Create axios instance
const baseService = axios.create({
  baseURL: generalConfig.baseUrl,
  timeout: generalConfig.timeout,
});

// Request queue for when token refresh is in progress
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

// Process queued requests
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
baseService.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from session storage
    const token = getSession();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
baseService.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    // If response is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return baseService(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint
        const refreshToken = sessionStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${generalConfig.baseUrl}/api/auth/refresh`,
          { refreshToken },
          { skipAuthRefresh: true } as CustomAxiosRequestConfig
        );

        if (response.data?.succeeded && response.data.data?.jwToken) {
          // Store new tokens
          const newAccessToken = response.data.data.jwToken;
          const newRefreshToken =
            response.data.data.refreshToken || refreshToken;
          const expiresIn = response.data.data.expiresIn || 3600;

          sessionStorage.setItem(generalConfig.authToken, newAccessToken);
          sessionStorage.setItem("refreshToken", newRefreshToken);

          if (expiresIn) {
            const expiresAt = Date.now() + expiresIn * 1000;
            sessionStorage.setItem("tokenExpiresAt", expiresAt.toString());
          }

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests
          processQueue(null, newAccessToken);

          // Retry the original request
          return baseService(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        sessionStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default baseService;
