import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminService";
import { FiUsers, FiFileText, FiShare2, FiHardDrive } from 'react-icons/fi';
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFiles: 0,
    teamFiles: 0,
    storageUsed: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back, Admin. Here is what's happening today.</p>
      </div>

      <div className="stats-grid">
        {/* Total Users Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FiUsers className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <h2>{loading ? '...' : stats.totalUsers}</h2>
            <p className="stat-trend positive">Registered users</p>
          </div>
        </div>

        {/* Total Files Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <FiFileText className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Total Files</h3>
            <h2>{loading ? '...' : stats.totalFiles}</h2>
            <p className="stat-trend positive">Stored in system</p>
          </div>
        </div>

        {/* Shared Files Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <FiShare2 className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Shared Files</h3>
            <h2>{loading ? '...' : stats.teamFiles}</h2>
            <p className="stat-trend positive">Active shares</p>
          </div>
        </div>

        {/* Storage Used Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <FiHardDrive className="stat-icon" />
          </div>
          <div className="stat-info">
            <h3>Storage Used</h3>
            <h2>{loading ? '...' : formatBytes(stats.storageUsed)}</h2>
            <p className="stat-trend neutral">Of allocated capacity</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content-area">
         <div className="dashboard-card placeholder-card">
            <h3>Recent System Activity</h3>
            <p className="empty-state">No recent activity to display.</p>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;