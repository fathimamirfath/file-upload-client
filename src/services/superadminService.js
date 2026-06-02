import axios from "axios";

const API_URL = "http://localhost:5000/api/superadmin";

const getDashboardStats = async (token) => {
  const res = await axios.get(`${API_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getAdmins = async (token) => {
  const res = await axios.get(`${API_URL}/admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const deleteAdmin = async (id, token) => {
  const res = await axios.delete(`${API_URL}/admins/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const deleteUser = async (id, token) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const getFiles = async (token) => {
  const res = await axios.get(`${API_URL}/files`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const deleteFile = async (id, token) => {
  const res = await axios.delete(`${API_URL}/files/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

const superadminService = {
  getDashboardStats,
  getAdmins,
  deleteAdmin,
  getUsers,
  deleteUser,
  getFiles,
  deleteFile,
};

export default superadminService;
