import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminService";
import Swal from 'sweetalert2';
import "./ManageUser.css";

const ManageUsers = () => {
    const { token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers(token);
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You are about to delete this user!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete user!'
        });

        if (!result.isConfirmed) return;

        try {
            await adminService.deleteUser(id, token);

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

    return (
        <div className="admin-page-container">
            <div className="admin-page-header">
                <h1>Manage Users</h1>
                <p>View and manage all registered users in the system.</p>
            </div>

            <div className="admin-table-card">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
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
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="5"
                                    style={{
                                        textAlign: "center",
                                        padding: "20px",
                                    }}
                                >
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id.slice(0, 8)}...</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>

                                    <td>
                                        <button
                                            className="action-btn"
                                            style={{
                                                backgroundColor: "#ef4444",
                                            }}
                                            onClick={() =>
                                                handleDelete(user._id)
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

export default ManageUsers;