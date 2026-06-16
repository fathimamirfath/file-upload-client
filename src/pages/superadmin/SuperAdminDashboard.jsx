import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import superadminService from '../../services/superadminService';
import { FiUsers, FiShield, FiFileText, FiShare2, FiHardDrive } from 'react-icons/fi';
import './SuperAdminDashboard.css';

const SuperAdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAdmins: 0,
        totalFiles: 0,
        teamFiles: 0,
        storageUsed: 0,
    });
    const [sharedFiles, setSharedFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await superadminService.getDashboardStats(token);
            const files = await superadminService.getFiles(token);
            
            const shared = files.filter(f => f.sharedWith && f.sharedWith.length > 0);
            
            setStats({
                ...data,
                teamFiles: shared.length
            });
            setSharedFiles(shared);
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
        <div className="superadmin-dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Super Admin. Here is what's happening today.</p>
            </div>

            <div className="stats-grid">
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

                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">
                        <FiShield className="stat-icon" />
                    </div>
                    <div className="stat-info">
                        <h3>Total Admins</h3>
                        <h2>{loading ? '...' : stats.totalAdmins}</h2>
                        <p className="stat-trend positive">System administrators</p>
                    </div>
                </div>

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

            <div className="admin-page-header" style={{ marginTop: '2rem' }}>
                <h2>Recent Shared Files</h2>
                <p>Files that are currently shared with other users.</p>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Owner</th>
                            <th>Shared With</th>
                            <th>Size</th>
                            <th>Upload Date</th>
                            <th>File Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    Loading shared files...
                                </td>
                            </tr>
                        ) : sharedFiles.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No shared files found.
                                </td>
                            </tr>
                        ) : (
                            sharedFiles.map((file) => {
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
                                        <td>
                                            {file.sharedWith.length} user(s)
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

export default SuperAdminDashboard;