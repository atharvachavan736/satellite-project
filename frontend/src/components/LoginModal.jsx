
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE}/api/login`, {
        username,
        password
      });

      if (res.data.error) {
        setError(res.data.error);
      } else if (res.data.access_token) {
        // Save the JWT token securely in the browser
        localStorage.setItem('satellite_token', res.data.access_token);
        onLoginSuccess();
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        background: '#111', padding: '30px', borderRadius: '8px', 
        border: '1px solid #333', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>Authorized Access</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }}>✕</button>
        </div>

        {error && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '15px', background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '4px' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '5px', display: 'block' }}>USERNAME</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="Enter 'admin'"
            />
          </div>
          <div>
            <label style={{ color: '#888', fontSize: '11px', marginBottom: '5px', display: 'block' }}>PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: 'white', borderRadius: '4px', boxSizing: 'border-box' }}
              placeholder="Enter 'admin123'"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: '#3b82f6', color: 'white', border: 'none', padding: '12px', 
              borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS TELEMETRY'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;


