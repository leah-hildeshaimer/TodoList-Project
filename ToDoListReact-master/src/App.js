import React, { useEffect, useState } from 'react';
import service from './service.js';
import Login from './Login'; // וודאי שיצרת את הקובץ הזה ב-src
import './App.css';

function App() {
  const [user, setUser] = useState(null); // שמירת המשתמש המחובר
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  // פונקציה לטעינת משימות לפי ה-userId של המשתמש המחובר
  async function getTodos(userId) {
    setLoading(true);
    try {
      const todos = await service.getTasks(userId);
      setTodos(todos || []);
    } catch (error) {
      console.error("Error fetching tasks", error);
    } finally {
      setLoading(false);
    }
  }

  // הוספת משימה חדשה עם ה-userId
  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    await service.addTask(newTodo, user.userId);
    setNewTodo("");
    await getTodos(user.userId);
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos(user.userId);
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos(user.userId);
  }

  // התנתקות מהמערכת
  function handleLogout() {
    setUser(null);
    setTodos([]);
  }

  // אם אין משתמש מחובר - מציגים את מסך הלוגין
  if (!user) {
    return <Login onLogin={(loggedInUser) => {
      setUser(loggedInUser);
      getTodos(loggedInUser.userId);
    }} />;
  }

  // חישובים עבור העיצוב שלך
  const completedCount = todos.filter(t => t.isComplete).length;
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="app-container">
      <div className="todo-card">
        <header className="app-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h1>My Focus</h1>
            <button onClick={handleLogout} className="logout-btn"
              style={{ background: '#f5f5f5', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px', fontSize: '12px', color: '#666', marginTop: '15px' }}>
              Logout
            </button>
          </div>
          <p className="subtitle">Welcome back, {user.username} ✨</p>

          <div className="stats-bar">
            <span>{todos.length} Tasks</span>
            <span>{progress}% Done</span>
          </div>

          <form onSubmit={createTodo} className="input-group">
            <input
              className="modern-input"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <button type="submit" className="add-btn" disabled={loading}>
              {loading ? "..." : "Add"}
            </button>
          </form>
        </header>

        <ul className="modern-list">
          {todos.length === 0 && !loading && <p style={{ textAlign: 'center', opacity: 0.5 }}>No tasks yet. Start being amazing!</p>}
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.isComplete ? 'is-done' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="checkbox"
                  className="modern-checkbox"
                  checked={todo.isComplete}
                  onChange={(e) => updateCompleted(todo, e.target.checked)}
                />
                <span className="todo-text">{todo.name}</span>
              </div>
              <button className="delete-icon" onClick={() => deleteTodo(todo.id)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;