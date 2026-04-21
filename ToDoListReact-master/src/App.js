// import React, { useEffect, useState } from 'react';
// import service from './service.js';

// function App() {
//   const [newTodo, setNewTodo] = useState("");
//   const [todos, setTodos] = useState([]);

//   async function getTodos() {
//     const todos = await service.getTasks();
//     setTodos(todos);
//   }

//   async function createTodo(e) {
//     e.preventDefault();
//     await service.addTask(newTodo);
//     setNewTodo("");//clear input
//     await getTodos();//refresh tasks list (in order to see the new one)
//   }

//   async function updateCompleted(todo, isComplete) {
//     await service.setCompleted(todo.id, isComplete);
//     await getTodos();//refresh tasks list (in order to see the updated one)
//   }

//   async function deleteTodo(id) {
//     await service.deleteTask(id);
//     await getTodos();//refresh tasks list
//   }

//   useEffect(() => {
//     getTodos();
//   }, []);

//   return (
//     <section className="todoapp">
//       <header className="header">
//         <h1>todos</h1>
//         <form onSubmit={createTodo}>
//           <input className="new-todo" placeholder="Well, let's take on the day" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
//         </form>
//       </header>
//       <section className="main" style={{ display: "block" }}>
//         <ul className="todo-list">
//           {todos.map(todo => {
//             return (
//               <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
//                 <div className="view">
//                   <input className="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
//                   <label>{todo.name}</label>
//                   <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       </section>
//     </section >
//   );
// }

// export default App;
import React, { useEffect, useState } from 'react';
import service from './service.js';
import './App.css'; // נוודא שנטפל גם ב-CSS

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

  return (
    <div className="app-container">
      <div className="todo-card">
        <header className="app-header">
          <h1>Productive Day</h1>
          <p className="subtitle">Manage your tasks professionally</p>
          
          <div className="stats-bar">
            <span>{todos.length} Tasks</span>
            <span>{completedCount} Completed</span>
          </div>

          <form onSubmit={createTodo} className="input-group">
            <input 
              type="text"
              className="modern-input" 
              placeholder="What needs to be done?" 
              value={newTodo} 
              onChange={(e) => setNewTodo(e.target.value)} 
            />
            <button type="submit" className="add-btn">Add</button>
          </form>
        </header>

        <section className="list-section">
          {loading && <div className="loader">Updating...</div>}
          
          <ul className="modern-list">
            {todos.length === 0 && !loading && (
              <div className="empty-state">No tasks yet. Start by adding one!</div>
            )}
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.isComplete ? 'is-done' : ''}`}>
                <div className="todo-content">
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
        </section>
      </div>
    </div>
  );
}

export default App;