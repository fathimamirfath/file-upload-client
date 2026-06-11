import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import superadminService from "../../services/superadminService";
import Swal from 'sweetalert2';
import "./SuperAdminManageAdmin.css";

const SuperAdminManageAdmin = () => {
    const { token } = useAuth();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
    const [createLoading, setCreateLoading] = useState(false);

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

    const handleMakeUser = async (id) => {
        const result = await Swal.fire({
            title: 'Demote to User?',
            text: "This user will lose all administrative privileges and become a standard user.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, Demote'
        });

        if (!result.isConfirmed) return;

        try {
            await superadminService.changeRole(id, "user", token);
            setAdmins((prevAdmins) =>
                prevAdmins.filter((admin) => admin._id !== id)
            );
            Swal.fire({
                title: 'Demoted!',
                text: 'The admin has been successfully demoted to a standard user.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        } catch (error) {
            console.error("Failed to demote admin:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to change role.',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        }
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setCreateLoading(true);
        try {
            const createdAdmin = await superadminService.createAdmin(newAdmin, token);
            setAdmins(prevAdmins => [...prevAdmins, createdAdmin]);
            setShowCreateForm(false);
            setNewAdmin({ name: "", email: "", password: "" });
            Swal.fire({
                title: 'Created!',
                text: 'New Admin has been created successfully.',
                icon: 'success',
                confirmButtonColor: '#3b82f6'
            });
        } catch (error) {
            console.error("Failed to create admin:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to create admin.',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <div className="superadmin-page-container">
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Manage Admins</h1>
                    <p>View and manage all system administrators.</p>
                </div>
                <button 
                    className="action-btn" 
                    style={{ backgroundColor: "#3b82f6", padding: "10px 20px" }}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? "Cancel" : "+ Create Admin"}
                </button>
            </div>

            {showCreateForm && (
                <div className="admin-table-card" style={{ marginBottom: '20px', padding: '20px' }}>
                    <h2 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#1e293b' }}>Create New Admin</h2>
                    <form onSubmit={handleCreateSubmit} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#64748b' }}>Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={newAdmin.name} 
                                onChange={handleCreateChange} 
                                required 
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#64748b' }}>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                value={newAdmin.email} 
                                onChange={handleCreateChange} 
                                required 
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <div style={{ flex: '1', minWidth: '200px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#64748b' }}>Password</label>
                            <input 
                                type="password" 
                                name="password"
                                value={newAdmin.password} 
                                onChange={handleCreateChange} 
                                required 
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button 
                                type="submit" 
                                className="action-btn" 
                                style={{ backgroundColor: "#10b981", padding: "10px 20px", height: '42px' }}
                                disabled={createLoading}
                            >
                                {createLoading ? "Creating..." : "Save Admin"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

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
                                        {admin.role === 'superadmin' ? (
                                            <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.85rem' }}>No Actions</span>
                                        ) : (
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button
                                                    className="action-btn"
                                                    style={{ backgroundColor: "#f59e0b", fontSize: "0.85rem", padding: "6px 12px" }}
                                                    onClick={() => handleMakeUser(admin._id)}
                                                >
                                                    Make User
                                                </button>
                                                <button
                                                    className="action-btn"
                                                    style={{ backgroundColor: "#ef4444", fontSize: "0.85rem", padding: "6px 12px" }}
                                                    onClick={() => handleDelete(admin._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
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
