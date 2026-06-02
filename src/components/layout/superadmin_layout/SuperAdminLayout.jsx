import React from 'react';
import { Outlet } from 'react-router-dom';
import SuperAdminNav from '../../superadmin/SuperAdminNav';
import './SuperAdminLayout.css';

const SuperAdminLayout = () => {
  return (
    <div className="superadmin-layout">
      <SuperAdminNav />
      <main className="superadmin-main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminLayout;