import React, { useState } from 'react';
import service from './service';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await service.register(username, password);
        alert("נרשמת בהצלחה! מוזמן להתחבר");
        setIsRegister(false);
      } else {
        const user = await service.login(username, password);
        onLogin(user);
      }
    } catch (error) {
      alert("שגיאה: וודא ששם המשתמש והסיסמה נכונים");
    }
  };

  return (
    <div className="login-container">
      <h2 style={{color: '#2e7d32'}}>{isRegister ? "ליצור חשבון חדש" : "כניסה למערכת"}</h2>
      <p style={{color: '#666'}}>ניהול משימות חכם ופשוט</p>
      
      <form onSubmit={handleSubmit} className="login-form">
        <input 
          className="login-input"
          type="text" placeholder="שם משתמש" 
          value={username} onChange={e => setUsername(e.target.value)} 
          required 
        />
        <input 
          className="login-input"
          type="password" placeholder="סיסמה" 
          value={password} onChange={e => setPassword(e.target.value)} 
          required 
        />
        <button type="submit" className="add-btn" style={{width: '100%', margin: '10px 0'}}>
          {isRegister ? "הירשם עכשיו" : "התחבר"}
        </button>
      </form>
      
      <p className="login-link" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "כבר יש לך חשבון? להתחברות" : "אין לך חשבון? להרשמה מהירה"}
      </p>
    </div>
  );
}

export default Login;