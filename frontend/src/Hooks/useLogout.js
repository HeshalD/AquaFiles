import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true }); // Include credentials
      localStorage.removeItem('role');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return logout;
};

export default useLogout;
