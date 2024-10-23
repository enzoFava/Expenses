import axios from "axios";

const api = axios.create({
  baseURL:
    window.location.hostname === "localhost"
      ? "http://localhost:8000"
      : "https://expensestracker-server.vercel.app/",
});

export const login = (user) => api.post("/login/", user);
export const register = (user) => api.post("/register/", user);
export const getUser = (id) => api.get(`/user/${id}/`);
export const updateUser = (user, id) => api.put(`/user/${id}/update/`, user)
export const deleteUser = (password,email, id) => api.post(`/user/${id}/delete/`, {password, email});
