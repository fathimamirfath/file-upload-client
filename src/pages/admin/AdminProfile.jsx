import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AdminProfile.css";

const AdminProfile = () => {
  const { user } = useAuth();
  
  // Local state for password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // Implementation for password change API would go here
    alert("Password change functionality to be implemented.");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div className="profile-container">
        <div className="profile-header">
            <h1>Admin Profile</h1>
            <p>Manage your account settings and credentials.</p>
        </div>

        <div className="profile-card">
            <div className="profile-section">
                <h2>Account Information</h2>
                <div className="info-group">
                    <span className="info-label">Name</span>
                    {/* Fallback to Admin if user object is missing details during dev */}
                    <span className="info-value">{user?.name || "Super Admin"}</span>
                </div>
                <div className="info-group">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user?.email || "admin@example.com"}</span>
                </div>
                <div className="info-group">
                    <span className="info-label">Role</span>
                    <span className="info-value">{user?.role || "Administrator"}</span>
                </div>
            </div>

            <div className="profile-section">
                <h2>Security</h2>
                <form className="password-form" onSubmit={handlePasswordChange}>
                    <div className="form-group">
                        <label className="info-label">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label className="info-label">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary">Change Password</button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AdminProfile;