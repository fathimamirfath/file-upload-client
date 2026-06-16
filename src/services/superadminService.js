import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/superadmin`;

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

const createAdmin = async (adminData, token) => {
  const res = await axios.post(`${API_URL}/admins`, adminData, {
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

const changeRole = async (id, role, token) => {
  const res = await axios.put(`${API_URL}/roles/${id}`, { role }, {
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
  createAdmin,
  deleteAdmin,
  getUsers,
  deleteUser,
  getFiles,
  deleteFile,
  changeRole,
};

export default superadminService;
