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
        alert("נרשמת בהצלחה! עכשיו תתחבר");
        setIsRegister(false);
      } else {
        const user = await service.login(username, password);
        onLogin(user); // שומר את המשתמש באפליקציה
      }
    } catch (error) {
      alert("משהו לא עבד... בדוק שם משתמש וסיסמה");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>{isRegister ? "הרשמה" : "התחברות"}</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="שם משתמש" 
          value={username} onChange={e => setUsername(e.target.value)} 
          required 
        /><br/><br/>
        <input 
          type="password" placeholder="סיסמה" 
          value={password} onChange={e => setPassword(e.target.value)} 
          required 
        /><br/><br/>
        <button type="submit">{isRegister ? "הירשם" : "כנס למערכת"}</button>
      </form>
      <p onClick={() => setIsRegister(!isRegister)} style={{ cursor: "pointer", color: "blue" }}>
        {isRegister ? "כבר יש לי חשבון" : "אני רוצה להירשם"}
      </p>
    </div>
  );
}

export default Login;