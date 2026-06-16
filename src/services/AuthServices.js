import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  return response.data;
};

const getMe = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/me`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  });
  return response.data;
};

const authService = {
  register,
  login,
  getMe
};

export default authService;
