import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import UserNav from "../../components/user/UserNav";
import "./Profile.css";

const Profile = () => {
    const { user, token } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", place: "" });
    const [msg, setMsg] = useState("");

    const fetchProfile = async () => {
        try {
            if (token && user) {
                try {
                    const data = await userService.getUserProfile(token);
                    setProfileData(data.user || data);
                } catch (error) {
                    setProfileData(user);
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [token, user]);

    const handleEdit = () => {
        setFormData({
            name: profileData?.name || "",
            email: profileData?.email || "",
            phone: profileData?.phone || "",
            place: profileData?.place || ""
        });
        setMsg("");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        if (formData.name.length < 3) {
            setMsg("Name must be at least 3 characters long.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setMsg("Please enter a valid email address.");
            return;
        }

        if (formData.phone && formData.phone.length < 10) {
            setMsg("Phone number should be at least 10 digits.");
            return;
        }

        try {
            const data = await userService.updateProfile(formData, token);
            setProfileData(data.user);
            setMsg("Profile updated successfully!");
            setTimeout(() => {
                setIsEditing(false);
                setMsg("");
            }, 1500);
        } catch (error) {
            setMsg(error.response?.data?.message || "Failed to update profile.");
        }
    };

    if (loading) {
        return (
            <div className="minimal-container">
                <UserNav />
                <div className="minimal-main">Loading...</div>
            </div>
        );
    }

    return (
        <div className="minimal-container">
            <UserNav />
            <main className="minimal-main">
                <div className="minimal-profile-card">
                    <h2 className="minimal-title">My Profile</h2>
                    
                    {msg && <div className="minimal-msg">{msg}</div>}

                    {!isEditing ? (
                        <div className="minimal-info">
                            <div className="minimal-row">
                                <span className="minimal-label">Name:</span>
                                <span className="minimal-value">{profileData?.name || "Not provided"}</span>
                            </div>
                            <div className="minimal-row">
                                <span className="minimal-label">Email:</span>
                                <span className="minimal-value">{profileData?.email || "Not provided"}</span>
                            </div>
                            <div className="minimal-row">
                                <span className="minimal-label">Phone:</span>
                                <span className="minimal-value">{profileData?.phone || "Not provided"}</span>
                            </div>
                            <div className="minimal-row">
                                <span className="minimal-label">Place:</span>
                                <span className="minimal-value">{profileData?.place || "Not provided"}</span>
                            </div>
                            <button className="minimal-btn" onClick={handleEdit}>Edit Profile</button>
                        </div>
                    ) : (
                        <form className="minimal-form" onSubmit={handleSubmit}>
                            <div className="minimal-form-group">
                                <label>Name:</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="minimal-form-group">
                                <label>Email:</label>
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="minimal-form-group">
                                <label>Phone:</label>
                                <input 
                                    type="text" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                />
                            </div>
                            <div className="minimal-form-group">
                                <label>Place:</label>
                                <input 
                                    type="text" 
                                    value={formData.place} 
                                    onChange={(e) => setFormData({...formData, place: e.target.value})} 
                                />
                            </div>
                            <div className="minimal-actions">
                                <button type="submit" className="minimal-btn">Save</button>
                                <button type="button" className="minimal-btn-secondary" onClick={handleCancel}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Profile;