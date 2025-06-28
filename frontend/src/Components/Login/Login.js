import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { username, password }, { withCredentials: true });

      localStorage.setItem('role', res.data.role);

      if (res.data.role === 'data_entry') {
        navigate('/data-entry');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 w-80 bg-white rounded shadow-md">
        <h2 className="mb-4 text-xl">Login</h2>
        <input type="text" placeholder="Username" value={username}
          onChange={e => setUsername(e.target.value)} className="p-2 mb-2 w-full rounded border" />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} className="p-2 mb-4 w-full rounded border" />
        <button type="submit" className="py-2 w-full text-white bg-blue-600 rounded">Login</button>
      </form>
    </div>
  );
}
