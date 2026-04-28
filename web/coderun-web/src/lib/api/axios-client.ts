import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/lib/constants/api.constants';

const COOKIE_ACCESS_TOKEN = 'access_token';
const COOKIE_REFRESH_TOKEN = 'refresh_token';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: token ekle
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(COOKIE_ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: 401 → refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get(COOKIE_REFRESH_TOKEN);
      if (!refreshToken) {
        // Token yok → login'e yönlendir
        Cookies.remove(COOKIE_ACCESS_TOKEN);
        Cookies.remove(COOKIE_REFRESH_TOKEN);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`,
          { refresh_token: refreshToken }
        );
        const { access_token: accessToken } = response.data;

        Cookies.set(COOKIE_ACCESS_TOKEN, accessToken, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          expires: 1 / 48, // 30 dakika (access token ile uyumlu)
        });

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        Cookies.remove(COOKIE_ACCESS_TOKEN);
        Cookies.remove(COOKIE_REFRESH_TOKEN);
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { COOKIE_ACCESS_TOKEN, COOKIE_REFRESH_TOKEN };
export default axiosClient;
