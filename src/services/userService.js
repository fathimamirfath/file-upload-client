import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Adjust this if your user route is different

const getUserProfile = async (token) => {
  const res = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const updateProfile = async (userData, token) => {
  const res = await axios.put(`${API_URL}/update-profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const updateAvatar = async (formData, token) => {
  const res = await axios.put(`${API_URL}/update-avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const updatePassword = async (passwordData, token) => {
  const res = await axios.put(`${API_URL}/update-password`, passwordData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const userService = {
  getUserProfile,
  updateProfile,
  updateAvatar,
  updatePassword,
};

export default userService;
