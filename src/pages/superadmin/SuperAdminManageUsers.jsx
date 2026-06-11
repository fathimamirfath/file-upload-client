import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import superadminService from "../../services/superadminService";
import Swal from 'sweetalert2';
import "./SuperAdminManageUsers.css";

const SuperAdminManageUsers = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch both users and files in parallel to calculate "Files Uploaded"
            const [usersData, filesData] = await Promise.all([
                superadminService.getUsers(token),
                superadminService.getFiles(token)
            ]);
            
            // Filter to only show standard users (not admins)
            const standardUsers = usersData.filter(user => user.role === "user");
            
            setUsers(standardUsers);
            setFiles(filesData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to permanently delete this user! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete user!'
        });

        if (!result.isConfirmed) return;

        try {
            await superadminService.deleteUser(id, token);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== id)
            );
            Swal.fire({
                title: 'Deleted!',
                text: 'The user has been deleted.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        } catch (error) {
            console.error("Failed to delete user:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete user.',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleMakeAdmin = async (id) => {
        const result = await Swal.fire({
            title: 'Make Admin?',
            text: "This user will be granted full administrative privileges.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Make Admin'
        });

        if (!result.isConfirmed) return;

        try {
            await superadminService.changeRole(id, "admin", token);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== id)
            );
            Swal.fire({
                title: 'Promoted!',
                text: 'The user has been promoted to Admin successfully.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        } catch (error) {
            console.error("Failed to promote user:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to change role.',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    // Helper function to count files for a specific user
    const getUserFileCount = (userId) => {
        return files.filter(file => {
            // file.uploadedBy could be an object (if populated) or just an ID string
            const uploadedById = file.uploadedBy?._id || file.uploadedBy;
            return uploadedById === userId;
        }).length;
    };

    return (
        <div className="superadmin-page-container">
            <div className="admin-page-header">
                <h1>Manage Users</h1>
                <p>View and manage all registered standard users in the system.</p>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email</th>
                            <th>Joined Date</th>
                            <th>Files Uploaded</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No standard users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td style={{ fontWeight: "500", color: "#1e293b" }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                                    <td>
                                        <span style={{ 
                                            background: '#f1f5f9', 
                                            color: '#475569', 
                                            padding: '4px 10px', 
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            fontSize: '0.85rem'
                                        }}>
                                            {getUserFileCount(user._id)} Files
                                        </span>
                                    </td>
                                    <td>
                                        <span style={{ 
                                            color: '#10b981', 
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <span style={{
                                                width: '8px',
                                                height: '8px',
                                                backgroundColor: '#10b981',
                                                borderRadius: '50%',
                                                display: 'inline-block'
                                            }}></span>
                                            Active
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="action-btn"
                                                style={{ backgroundColor: "#10b981", fontSize: "0.85rem", padding: "6px 12px" }}
                                                onClick={() => handleMakeAdmin(user._id)}
                                            >
                                                Make Admin
                                            </button>
                                            <button
                                                className="action-btn"
                                                style={{ backgroundColor: "#ef4444", fontSize: "0.85rem", padding: "6px 12px" }}
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
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

export default SuperAdminManageUsers;
