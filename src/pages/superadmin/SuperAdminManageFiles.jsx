import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import superadminService from "../../services/superadminService";
import Swal from 'sweetalert2';
import "./SuperAdminManageFiles.css";

const SuperAdminManageFiles = () => {
    const { token } = useAuth();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const data = await superadminService.getFiles(token);
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
            text: "You are about to permanently delete this file! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete file!'
        });

        if (!result.isConfirmed) return;

        try {
            await superadminService.deleteFile(id, token);
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
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileTypeBadgeColor = (type) => {
        if (!type) return { bg: '#f1f5f9', color: '#475569' };
        const lowerType = String(type).toLowerCase();

        if (lowerType.includes('pdf')) return { bg: '#fee2e2', color: '#ef4444' };
        if (lowerType.includes('image') || lowerType.includes('png') || lowerType.includes('jpg') || lowerType.includes('jpeg')) return { bg: '#e0e7ff', color: '#4f46e5' };
        if (lowerType.includes('word') || lowerType.includes('doc')) return { bg: '#dbeafe', color: '#2563eb' };
        if (lowerType.includes('excel') || lowerType.includes('csv') || lowerType.includes('sheet')) return { bg: '#dcfce7', color: '#16a34a' };
        if (lowerType.includes('zip') || lowerType.includes('rar') || lowerType.includes('tar')) return { bg: '#fef3c7', color: '#d97706' };

        return { bg: '#f1f5f9', color: '#475569' }; // default gray
    };

    return (
        <div className="superadmin-page-container">
            <div className="admin-page-header">
                <h1>Manage Files</h1>
                <p>View and manage all user-uploaded files across the system.</p>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Owner</th>
                            <th>Size</th>
                            <th>Upload Date</th>
                            <th>File Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    Loading files...
                                </td>
                            </tr>
                        ) : files.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No files found in the system.
                                </td>
                            </tr>
                        ) : (
                            files.map((file) => {
                                // Extract file type if fileType field is missing
                                const extractedType = file.fileType || (file.filename && file.filename.split('.').pop()) || 'FILE';
                                const typeStyles = getFileTypeBadgeColor(extractedType);

                                return (
                                    <tr key={file._id}>
                                        <td style={{
                                            fontWeight: "500",
                                            color: "#1e293b",
                                            maxWidth: '220px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {file.filename || file.title || "Unknown File"}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '500' }}>{file.uploadedBy?.name || "System"}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{file.uploadedBy?.email || ""}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: '#475569', fontWeight: '500' }}>
                                            {formatBytes(file.fileSize)}
                                        </td>
                                        <td>{new Date(file.createdAt || Date.now()).toLocaleDateString()}</td>
                                        <td>
                                            <span style={{
                                                background: typeStyles.bg,
                                                color: typeStyles.color,
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontWeight: '600',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {extractedType}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn"
                                                style={{ backgroundColor: "#ef4444" }}
                                                onClick={() => handleDelete(file._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuperAdminManageFiles;
