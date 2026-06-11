import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiPieChart,
  FiShield,
  FiUsers,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import "./SuperAdminNav.css";

const SuperAdminNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/superadmin");
  };

  return (
    <nav className="superadmin-sidebar">
      <div className="sidebar-header">
        <div className="logo-wrapper">
          <FiShield className="logo-icon" />
          <h2>
            Super<span>Admin</span>
          </h2>
        </div>
      </div>

      <div className="sidebar-menu">
        <p className="menu-label">Main Menu</p>

        <NavLink
          to="/superadmin/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiPieChart className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/superadmin/manageadmins"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiShield className="nav-icon" />
          <span>Manage Admins</span>
        </NavLink>

        <NavLink
          to="/superadmin/users"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiUsers className="nav-icon" />
          <span>Manage Users</span>
        </NavLink>

        <NavLink
          to="/superadmin/files"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <FiFileText className="nav-icon" />
          <span>Manage Files</span>
        </NavLink>

        <button onClick={handleLogout} className="nav-item logout-btn">
          <FiLogOut className="nav-icon" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default SuperAdminNav;