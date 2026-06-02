import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GoFileDirectoryFill } from 'react-icons/go';
import { RiFolderSharedFill } from 'react-icons/ri';
import { MdDashboard, MdPerson } from 'react-icons/md';
import './UserNav.css';

const UserNav = () => {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="user-top-nav">
            <div className="nav-logo">
                <div className="logo-icon"></div>
                <h2>FileHub</h2>
            </div>

            <div className="nav-links">
                <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    <span className="icon"><MdDashboard /></span>
                    Dashboard
                </Link>
                <Link to="/myfiles" className={`nav-item ${location.pathname === '/myfiles' ? 'active' : ''}`}>
                    <span className="icon"><GoFileDirectoryFill /></span>
                    My Files
                </Link>
                <Link to="/sharedfiles" className={`nav-item ${location.pathname === '/sharedfiles' ? 'active' : ''}`}>
                    <span className="icon"><RiFolderSharedFill /></span>
                    Shared with me
                </Link>
            </div>

            <div className="nav-actions">
                <Link to="/profile" className="profile-icon-link">
                    <MdPerson />
                </Link>
                <button onClick={logout} className="logout-button">
                    Log Out
                </button>
            </div>
        </nav>
    );
};

export default UserNav;