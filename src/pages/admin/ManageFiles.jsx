import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminService";
import Swal from 'sweetalert2';
import "./ManageFiles.css";

const ManageFiles = () => {
  const { token } = useAuth();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const data = await adminService.getFiles(token);
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to delete this file!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete file!'
    });

    if (!result.isConfirmed) return;

    try {
      await adminService.deleteFile(id, token);

      setFiles((prevFiles) =>
        prevFiles.filter((file) => file._id !== id)
      );
      Swal.fire({
        title: 'Deleted!',
        text: 'The file has been deleted.',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      });
    } catch (error) {
      console.error("Failed to delete file:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete file.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Manage Files</h1>
        <p>Monitor and manage all files uploaded by users.</p>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Owner</th>
              <th>Size</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading files...
                </td>
              </tr>
            ) : files.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No files found.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file._id}>
                  <td>{file.fileName}</td>

                  <td>
                    {file.uploadedBy?.email || "Unknown"}
                  </td>

                  <td>
                    {formatBytes(file.fileSize)}
                  </td>

                  <td>
                    {new Date(
                      file.createdAt
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    <button
                      className="action-btn"
                      style={{
                        backgroundColor: "#ef4444",
                      }}
                      onClick={() =>
                        handleDelete(file._id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageFiles;