import axios from 'axios';

const api = axios.create({
    baseURL: 'https://expensestracker-server.vercel.app/'
})

export const login = (user) => api.post("/login/", user)
export const register = (user) => api.post("/register/", user)