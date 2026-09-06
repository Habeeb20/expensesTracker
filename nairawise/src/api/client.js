import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:1000";

const apiClient = axios.create({
    baseUrl:BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})


apiClient.interceptors.request.use(
    async(config) => {
        const token = await SecureStore.getItemAsync("auth_token");
        if(token ){
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