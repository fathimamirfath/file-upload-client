import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const UserProtectedRouter = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user doesn't have a token, they shouldn't access protected routes
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // Strictly enforce user role
  if (user.role !== "user") {
    if (user.role === "superadmin") {
      return <Navigate to="/superadmindashboard" replace />;
    }
    if (user.role === "admin") {
      return <Navigate to="/admindashboard" replace />;
    }
  }

  // Render child routes
  return <Outlet />;
};

export default UserProtectedRouter;
