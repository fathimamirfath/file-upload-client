import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const AdminProtectedRouter = () => {
  const { user, token, loading } = useAuth();

  // Wait until user is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user object isn't loaded for some reason but token is present
  if (!user) {
    return <div>Loading...</div>;
  }

  // Allow only admins
  if (user.role !== "admin") {
    // Optionally redirect superadmins to their own dash, and users to their dash
    if (user.role === "superadmin") {
      return <Navigate to="/superadmin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRouter;