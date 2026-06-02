import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import superadminService from "../../services/superadminService";
import Swal from 'sweetalert2';
import "./SuperAdminManageAdmin.css";

const SuperAdminManageAdmin = () => {
    const { token } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const data = await superadminService.getAdmins(token);
            setAdmins(data);
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to revoke this admin's access!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, revoke access!'
        });

        if (!result.isConfirmed) return;

        try {
            await superadminService.deleteAdmin(id, token);
            setAdmins((prevAdmins) =>
                prevAdmins.filter((admin) => admin._id !== id)
            );
            Swal.fire({
                title: 'Revoked!',
                text: 'Admin access has been revoked.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        } catch (error) {
            console.error("Failed to delete admin:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete admin. The backend might be blocking this action.',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    return (
        <div className="superadmin-page-container">
            <div className="admin-page-header">
                <h1>Manage Admins</h1>
                <p>View and manage all system administrators.</p>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Admin Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    Loading admins...
                                </td>
                            </tr>
                        ) : admins.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                    No admins found.
                                </td>
                            </tr>
                        ) : (
                            admins.map((admin) => (
                                <tr key={admin._id}>
                                    <td style={{ fontWeight: "500", color: "#1e293b" }}>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>
                                        <span style={{ 
                                            background: admin.role === 'superadmin' ? '#f5f3ff' : '#eff6ff', 
                                            color: admin.role === 'superadmin' ? '#7c3aed' : '#3b82f6', 
                                            padding: '4px 8px', 
                                            borderRadius: '6px',
                                            fontWeight: '600',
                                            fontSize: '0.8rem',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase'
                                        }}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td>{new Date(admin.createdAt || Date.now()).toLocaleDateString()}</td>
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
                                        <button
                                            className="action-btn"
                                            style={{ backgroundColor: "#ef4444" }}
                                            onClick={() => handleDelete(admin._id)}
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

export default SuperAdminManageAdmin;
