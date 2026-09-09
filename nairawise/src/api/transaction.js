import apiClient from "./client";
import * as SecureStore from "expo-secure-store"
import AsyncStorage  from "@react-native-async-storage/async-storage";

export const createTransaction = async(amount, type, categoryColors, description, date) => {
  
    const {data} = await apiClient.post('/api/transaction', {
        amount,
        type,
        category,
        description,
        date
    })
    return data

}

export const getTransaction = async() => {
    const {data} = await apiClient.get('/api/transactions')
    return data
}

export const deleteTransaction = async(id) => {
    await apiClient.delete('/api/:id')
}