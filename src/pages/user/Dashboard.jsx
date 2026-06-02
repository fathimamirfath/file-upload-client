import React, { useState, useEffect } from "react";
import fileService from "../../services/fileService";
import { useAuth } from "../../context/AuthContext";
import UserNav from "../../components/user/UserNav";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if(!token) return;

        const data = await fileService.getMyFiles();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const totalStorageBytes = files.reduce((acc, file) => acc + (file.fileSize || 0), 0);
  const totalFiles = files.length;
  const sharedLinksCount = files.filter(f => f.sharedWith && f.sharedWith.length > 0).length;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const recentFiles = files.slice(0, 4);

  return (
    <div className="minimal-container">
      <UserNav />

      <main className="minimal-main">
        <div className="dashboard-wrapper">
          <div className="minimal-header-section">
            <h1 className="minimal-page-title">Dashboard</h1>
            <p className="minimal-subtitle">Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}</p>
          </div>

          <div className="minimal-stats-grid">
            <div className="minimal-stat-card">
              <span className="stat-label">Total Storage Used</span>
              <span className="stat-value">{formatSize(totalStorageBytes)}</span>
            </div>
            
            <div className="minimal-stat-card">
              <span className="stat-label">Total Files</span>
              <span className="stat-value">{totalFiles}</span>
            </div>
            
            <div className="minimal-stat-card">
              <span className="stat-label">Shared Links</span>
              <span className="stat-value">{sharedLinksCount}</span>
            </div>
          </div>

          <div className="minimal-recent-section">
            <h2 className="minimal-section-title">Recent Files</h2>
            
            <div className="minimal-list">
              {recentFiles.length === 0 ? (
                <div className="minimal-empty">No files uploaded yet.</div>
              ) : (
                recentFiles.map(file => (
                  <div className="minimal-list-item" key={file._id}>
                    <div className="item-info">
                      <span className="item-name">{file.fileName}</span>
                      <span className="item-meta">
                        {formatSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="item-actions">
                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="minimal-action-btn">
                        Download
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
