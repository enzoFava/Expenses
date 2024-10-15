import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000' // https://expensestracker-server.vercel.app/
})

export const login = (user) => api.post("/login/", user)
export const register = (user) => api.post("/register/", user)