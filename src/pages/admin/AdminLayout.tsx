
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster } from 'sonner';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-geeky-dark text-white">
      <AdminSidebar />
      
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
      
      <Toaster position="top-right" toastOptions={{
        className: "!bg-geeky-dark !border !border-geeky-purple/30 !font-mono",
        duration: 3000,
      }} />
    </div>
  );
};

export default AdminLayout;
