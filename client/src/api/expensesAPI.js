import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/'
})

export const addExpense = (newExpense, id) => api.post(`/${parseInt(id)}/add/`, newExpense);
export const getExpenses = (id) => api.get(`/${parseInt(id)}/expenses/`);
export const addIncome = (newIncome, id) => api.post(`/${parseInt(id)}/add/incomes/`, newIncome);
export const getIncomes = (id) => api.get(`/${parseInt(id)}/incomes/`);