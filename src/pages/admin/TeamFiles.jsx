import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminService";
import "./TeamFiles.css";

const TeamFiles = () => {
  const { token } = useAuth();

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamFiles();
  }, []);

  const fetchTeamFiles = async () => {
    try {
      const data = await adminService.getTeamFiles(token);
      setFiles(data);
    } catch (error) {
      console.error("Failed to fetch team files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url) => {
    if (!url) {
      alert("File URL not found");
      return;
    }

    window.open(url, "_blank");
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Team Files</h1>
        <p>Manage files shared across different teams and groups.</p>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Shared By</th>
              <th>Shared With</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Loading team files...
                </td>
              </tr>
            ) : files.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No shared team files found.
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
                    {file.sharedWith &&
                    file.sharedWith.length > 0
                      ? `${file.sharedWith[0]?.email}${
                          file.sharedWith.length > 1
                            ? ` (+${file.sharedWith.length - 1})`
                            : ""
                        }`
                      : "No one"}
                  </td>

                  <td>
                    <button
                      className="action-btn"
                      onClick={() =>
                        handleDownload(file.fileUrl)
                      }
                    >
                      Download
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

export default TeamFiles;