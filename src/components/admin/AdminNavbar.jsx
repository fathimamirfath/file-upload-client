import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/admindashboard" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              Dashboard
            </NavLink>
          </li>
         
          <li>
            <NavLink 
              to="/manageusers" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/managefiles" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              Manage Files
            </NavLink>
          </li>
           <li>
            <NavLink 
              to="/teamfiles" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              Team Files
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/adminprofile" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            >
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminNavbar;
