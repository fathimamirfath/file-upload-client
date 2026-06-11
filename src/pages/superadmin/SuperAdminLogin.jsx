import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/AuthServices";
import "./SuperAdminLogin.css";

const SuperAdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await authService.login(email, password);
      
      if (data.user.role !== "superadmin") {
        setError("Access Denied: You are not authorized as a Super Admin.");
        return;
      }
      
      login(data.user, data.token);
      navigate("/superadmin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-login-container">
      <div className="superadmin-login-card">
        <div className="superadmin-login-header">
          <h2>Super Admin Portal</h2>
          <p>System Management Access</p>
        </div>
        
        {error && <div className="superadmin-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="superadmin-login-form">
          <div className="superadmin-form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="superadmin@admin.com"
              required
            />
          </div>
          
          <div className="superadmin-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="superadmin-login-btn" disabled={loading}>
            {loading ? "Authenticating..." : "Login to Portal"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SuperAdminLogin;
