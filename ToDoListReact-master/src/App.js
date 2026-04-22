import React, { useEffect, useState } from 'react';
import service from './service.js';
import './App.css';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getTodos() {
    setLoading(true);
    try {
      const todos = await service.getTasks();
      setTodos(todos || []);
    } finally {
      setLoading(false);
    }
  }

  async function createTodo(e) {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await service.addTask(newTodo);
    setNewTodo("");
    await getTodos();
  }

  async function updateCompleted(todo, isComplete) {
    await service.setCompleted(todo.id, isComplete);
    await getTodos();
  }

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  const completedCount = todos.filter(t => t.isComplete).length;
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;
  return (
    <div className="app-container">
      <div className="todo-card">
        <header className="app-header">
          <h1>My Focus</h1>
          <p className="subtitle">Let's be amazing today</p>
          
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
            <button type="submit" className="add-btn">Add</button>
          </form>
        </header>

        <ul className="modern-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.isComplete ? 'is-done' : ''}`}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
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