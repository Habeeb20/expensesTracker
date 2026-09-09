import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = "http://192.168.100.13:1000"
// const BASE_URL = process.env.EXPO_PUBLIC_API_URL

// const BASE_URL = "https://expenses-tracker-3zbh.vercel.app";
// const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:1000";

const apiClient = axios.create({
    baseURL: BASE_URL,   // ✅ fixed casing
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config
    },
    (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      // TODO: redirect to login — wire this to your router once auth context exists
    }
    return Promise.reject(error);
  }
);

export default apiClient;