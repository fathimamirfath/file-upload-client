import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/files`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  };
};

const getMyFiles = async () => {
  const response = await axios.get(`${API_URL}/myfiles`, getAuthHeaders());
  return response.data;
};

const getSharedFiles = async () => {
  const response = await axios.get(`${API_URL}/sharedfiles`, getAuthHeaders());
  return response.data;
};

const uploadFile = async (formData) => {
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      ...getAuthHeaders().headers,
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

const deleteFile = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

const shareFile = async (id, email) => {
  const response = await axios.post(`${API_URL}/${id}/share`, { email }, getAuthHeaders());
  return response.data;
};

const fileService = {
  getMyFiles,
  getSharedFiles,
  uploadFile,
  deleteFile,
  shareFile
};

export default fileService;
