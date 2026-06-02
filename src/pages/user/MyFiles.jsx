import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import UserNav from "../../components/user/UserNav";
import fileService from "../../services/fileService";
import "./MyFiles.css";

const MyFiles = () => {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Share Modal State
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [fileToShare, setFileToShare] = useState(null);
  const [shareEmail, setShareEmail] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const fetchFiles = async () => {
    try {
      const data = await fileService.getMyFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (uploadedFiles) => {
    const formData = new FormData();
    formData.append("file", uploadedFiles[0]);

    try {
      setUploading(true);
      await fileService.uploadFile(formData);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fileService.deleteFile(id);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  const openShareModal = (file) => {
    setFileToShare(file);
    setShareEmail("");
    setShareMsg("");
    setShareModalOpen(true);
  };

  const closeShareModal = () => {
    setShareModalOpen(false);
    setFileToShare(null);
    setShareEmail("");
    setShareMsg("");
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!fileToShare || !shareEmail) return;

    try {
      setIsSharing(true);
      setShareMsg("");
      await fileService.shareFile(fileToShare._id, shareEmail);
      setShareMsg("File shared successfully!");
      setTimeout(() => {
        closeShareModal();
      }, 1500);
    } catch (error) {
      setShareMsg(error.response?.data?.message || "Failed to share file");
    } finally {
      setIsSharing(false);
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

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="minimal-container">
      <UserNav />

      <main className="minimal-main">
        <div className="mf-wrapper">
          <div className="minimal-header-section">
            <h1 className="minimal-page-title">My Files</h1>
          </div>

          {/* Minimal Upload Zone */}
          <div 
            className={`minimal-upload-zone ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <p>Drag & Drop files here or</p>
            <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileInput} disabled={uploading} />
            <label htmlFor="file-upload" className="minimal-upload-btn">
              {uploading ? 'Uploading...' : 'Browse Files'}
            </label>
          </div>

          {/* Minimal Files List */}
          <div className="minimal-recent-section">
            <h2 className="minimal-section-title">All Files</h2>
            
            <div className="minimal-list">
              {files.length === 0 ? (
                <div className="minimal-empty">No files uploaded yet.</div>
              ) : (
                files.map(file => (
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
                      <button className="minimal-action-btn" onClick={() => openShareModal(file)}>
                        Share
                      </button>
                      <button className="minimal-action-btn danger" onClick={() => handleDelete(file._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {shareModalOpen && (
          <div className="minimal-modal-overlay">
            <div className="minimal-modal-content">
              <h3>Share File</h3>
              <p className="minimal-modal-subtitle">Share "{fileToShare?.fileName}" with another user.</p>
              
              {shareMsg && (
                <div className={`minimal-msg ${shareMsg.includes("successfully") ? 'success' : 'error'}`}>
                  {shareMsg}
                </div>
              )}

              <form onSubmit={handleShare} className="minimal-form mt-1">
                <div className="minimal-form-group">
                  <label>User Email</label>
                  <input 
                    type="email" 
                    value={shareEmail} 
                    onChange={(e) => setShareEmail(e.target.value)} 
                    placeholder="Enter email address"
                    required 
                  />
                </div>
                <div className="minimal-modal-actions">
                  <button type="submit" className="minimal-btn" disabled={isSharing}>
                    {isSharing ? 'Sharing...' : 'Share File'}
                  </button>
                  <button type="button" className="minimal-btn-secondary" onClick={closeShareModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default MyFiles;
