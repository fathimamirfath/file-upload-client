import React, { useState, useEffect } from "react";
import fileService from "../../services/fileService";
import { useAuth } from "../../context/AuthContext";
import UserNav from "../../components/user/UserNav";
import "./SharedFiles.css";

const SharedFiles = () => {
  const [sharedFiles, setSharedFiles] = useState([]);

  useEffect(() => {
    const fetchSharedFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        if(!token) return;
        
        const data = await fileService.getSharedFiles();
        setSharedFiles(data);
      } catch (error) {
        console.error("Error fetching shared files:", error);
      }
    };
    fetchSharedFiles();
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0 || !bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="minimal-container">
      <UserNav />

      <main className="minimal-main">
        <div className="sf-wrapper">
          <div className="minimal-header-section">
            <h1 className="minimal-page-title">Shared With Me</h1>
            <p className="minimal-subtitle">Files and folders other people have shared with you.</p>
          </div>

          <div className="minimal-recent-section">
            <h2 className="minimal-section-title">Recent Shared Files</h2>
            
            <div className="minimal-list">
              {sharedFiles.length === 0 ? (
                <div className="minimal-empty">No files have been shared with you yet.</div>
              ) : (
                sharedFiles.map(file => (
                  <div className="minimal-list-item" key={file._id}>
                    <div className="item-info">
                      <span className="item-name">{file.fileName}</span>
                      <span className="item-meta">
                        Shared by {file.uploadedBy?.name || 'Unknown'} • {formatSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString()}
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

export default SharedFiles;
