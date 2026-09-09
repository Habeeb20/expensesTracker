// import apiClient from "./client";
// import * as SecureStore from 'expo-secure-store';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// export const login = async(email, password) => {
//     const {data} = await apiClient.post('/api/user/login', {email, password});
//     if(data?.token){
//         await SecureStore.setItemAsync('auth_token', data.token);
//     }
//     if(data?.user){
//         await AsyncStorage.setItem('user'|| 'auth_user', JSON.stringify(data.user));
//     }
//     return data;
// }


// export const register = async(first_name, last_name, email, password) => {
//     const {data} = await apiClient.post('/api/user/register', {first_name, last_name, email, password});
//     if(data?.token) {
//         await SecureStore.setItemAsync('auth_token', data.token);
//     }
//     if(data?.user){
//         await AsyncStorage.setItem('user' || 'auth_user', JSON.stringify(data.user));
//     }
//     return data;
// }



// export const logout = async () => {
//   await SecureStore.deleteItemAsync('auth_token');
//   await AsyncStorage.removeItem('auth_user');
// };

// export const getStoredUser = async () => {
//   const raw = await AsyncStorage.getItem('auth_user');
//   return raw ? JSON.parse(raw) : null;
// };

// export const getCurrentUser = async () => {
//   const { data } = await apiClient.get('/api/user/me');
//   return data;
// };







import apiClient from "./client";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  const { data } = await apiClient.post('/api/user/login', { email, password });
  if (data?.token) {
    await SecureStore.setItemAsync('auth_token', data.token);
  }
  if (data?.user) {
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  return data;
};

export const register = async (first_name, last_name, email, password) => {
  const { data } = await apiClient.post('/api/user/register', { first_name, last_name, email, password });
  if (data?.token) {
    await SecureStore.setItemAsync('auth_token', data.token);
  }
  if (data?.user) {
    await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  }
  return data;
};

export const logout = async () => {
  await SecureStore.deleteItemAsync('auth_token');
  await AsyncStorage.removeItem('auth_user');
};

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem('auth_user');
  return raw ? JSON.parse(raw) : null;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get('/api/user/me');
  return data;
};

// Returns true only if there's a saved session to resume via biometrics
export const hasStoredSession = async () => {
  const token = await SecureStore.getItemAsync('auth_token');
  return !!token;
};