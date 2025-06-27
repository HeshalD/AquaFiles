import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
  withCredentials: true, // If you're using sessions/cookies
});

export default instance;
