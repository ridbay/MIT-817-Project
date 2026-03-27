import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  isAdmin?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ isAdmin = false }) => {
  return (
    <div className="sd-root">
      <Sidebar isAdmin={isAdmin} />
      <div className="sd-main">
        <TopBar />
        <div className="sd-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
