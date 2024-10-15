import axios from 'axios';

const api = axios.create({
    baseURL: 'https://expensestracker-server.vercel.app/' // http://localhost:8000/
})

export const addExpense = (newExpense, id) => api.post(`/${parseInt(id)}/add/`, newExpense);
export const getExpenses = (id) => api.get(`/${parseInt(id)}/expenses/`);
export const addIncome = (newIncome, id) => api.post(`/${parseInt(id)}/add/incomes/`, newIncome);
export const getIncomes = (id) => api.get(`/${parseInt(id)}/incomes/`);
export const deleteExpense = (id, user_id) => api.delete(`/${parseInt(user_id)}/delete/${parseInt(id)}`);
export const editExpense = (newExpense, user_id) => api.put(`/${parseInt(user_id)}/edit/`, newExpense);