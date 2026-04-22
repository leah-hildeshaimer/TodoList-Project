import axios from 'axios';

const apiUrl = "https://todo-list-api-ua1v.onrender.com/";
axios.defaults.baseURL = apiUrl;

export default {
  // קבלת משימות לפי יוזר
  getTasks: async (userId) => {
    const result = await axios.get(`/items/${userId}`);    
    return result.data;
  },

  // הוספת משימה עם יוזר
  addTask: async (name, userId) => {
    const result = await axios.post(`/items`, { name, isComplete: false, userId });
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    await axios.put(`/items/${id}`, { isComplete });
  },

  deleteTask: async (id) => {
    await axios.delete(`/items/${id}`);
  },

  // לוגין והרשמה
  register: async (username, password) => {
    return await axios.post(`/Auth/register`, { username, password });
  },

  login: async (username, password) => {
    const result = await axios.post(`/Auth/login`, { username, password });
    return result.data; // מחזיר { userId, username }
  }
};