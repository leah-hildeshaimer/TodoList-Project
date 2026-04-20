import axios from 'axios';

// 1. הגדרת כתובת השרת כברירת מחדל לכל הקריאות (Config Defaults)
axios.defaults.baseURL = "http://localhost:5057";

// הגדרת interceptor לתפיסת שגיאות
axios.interceptors.response.use(
    response => response,
    error => {
        console.error("API Error:", error.response ? error.response.data : error.message);
        return Promise.reject(error);
    }
);

export default {
  getTasks: async () => {
    // עכשיו אפשר לכתוב רק את הנתיב, axios כבר יודע את ה-URL
    const result = await axios.get("/items");    
    return result.data;
  },

  addTask: async (name) => {
    const result = await axios.post("/items", { name: name, isComplete: false });    
    return result.data;
  },

  // setCompleted: async (id, isComplete) => {
  //   // אנחנו שולחים את ה-isComplete. 
  //   // השרת ב-C# יקבל את זה ויעדכן את המשימה לפי ה-ID שבנתיב.
  //   await axios.put(`/items/${id}`, { isComplete: isComplete });
  // },
 // },
setCompleted: async (id, isComplete) => {
  // נסי לשלוח אובייקט פשוט עם שני השדות
  await axios.put(`/items/${id}`, { id: id, isComplete: isComplete });
},
  deleteTask: async (id) => {
    await axios.delete(`/items/${id}`);
  }
};