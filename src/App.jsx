import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Dashboard from "./pages/user/Dashboard";
import MyFiles from "./pages/user/MyFiles";
import SharedFiles from "./pages/user/SharedFiles";
import UserProtectedRouter from "./components/protected_router/user_protected_router/UserProtectedRouter";

import AdminProtectedRouter from "./components/protected_router/admin_protected_router/AdminProtectedRouter";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageFiles from "./pages/admin/ManageFiles";
import TeamFiles from "./pages/admin/TeamFiles";
import AdminLayout from "./components/layout/admin-layout/Adminlayout";

// Super Admin Imports
import SuperAdminProtectedRouter from "./components/protected_router/superadmin_protected_router/SuperAdminProtectedRouter";
import SuperAdminLayout from "./components/layout/superadmin_layout/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import SuperAdminManageAdmin from "./pages/superadmin/SuperAdminManageAdmin";
import SuperAdminManageUsers from "./pages/superadmin/SuperAdminManageUsers";
import SuperAdminManageFiles from "./pages/superadmin/SuperAdminManageFiles";

import { useAuth } from "./context/AuthContext";
import Profile from "./pages/user/Profile";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Could replace with a spinner component
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Routes */}
        <Route element={<UserProtectedRouter />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/myfiles" element={<MyFiles />} />
          <Route path="/sharedfiles" element={<SharedFiles />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminProtectedRouter />}>
          <Route element={<AdminLayout />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/manageusers" element={<ManageUsers />} />
            <Route path="/managefiles" element={<ManageFiles />} />
            <Route path="/teamfiles" element={<TeamFiles />} /> 
            <Route path="/adminprofile" element={<AdminProfile />} />
          </Route>
        </Route>

        {/* Super Admin Protected Routes */}
        <Route element={<SuperAdminProtectedRouter />}>
          <Route element={<SuperAdminLayout />}>
            <Route path="/superadmindashboard" element={<SuperAdminDashboard />} />
            <Route path="/manageadmins" element={<SuperAdminManageAdmin />} />
            <Route path="/superadminusers" element={<SuperAdminManageUsers />} />
            <Route path="/superadminfiles" element={<SuperAdminManageFiles />} />
            {/* Add the rest as you build them: /roles, /settings, /auditlogs, /superadminprofile */}
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;