import React, { useState, useEffect } from "react";
import fileService from "../../services/fileService";
import { useAuth } from "../../context/AuthContext";
import UserNav from "../../components/user/UserNav";
import Swal from 'sweetalert2';
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const data = await fileService.getMyFiles();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchDashboardData();
  }, []);

  const handleFileUpload = async (uploadedFiles) => {
    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);

    try {
      setUploading(true);
      await fileService.uploadFile(formData);
      const data = await fileService.getMyFiles();
      setFiles(data);
      Swal.fire({
        title: 'Uploaded!',
        text: 'Your file has been uploaded successfully.',
        icon: 'success',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      });
    } catch (error) {
      console.error("Error uploading file", error);
      Swal.fire({
        title: 'Upload Failed',
        text: error.response?.data?.error || error.response?.data?.message || 'Failed to upload file. Please check file size and format.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
      e.target.value = null; // Clear the input to allow uploading the same file again
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

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
              <span className="stat-label">Shared Files</span>
              <span className="stat-value">{sharedLinksCount}</span>
            </div>
          </div>

          {/* Minimal Upload Zone */}
          <div 
            className={`minimal-upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ marginTop: '25px', marginBottom: '10px' }}
          >
            <p>Drag & Drop files here or</p>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileInput} disabled={uploading} />
            <label htmlFor="file-upload" className="minimal-upload-btn">
              {uploading ? 'Uploading...' : 'Quick Upload'}
            </label>
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
