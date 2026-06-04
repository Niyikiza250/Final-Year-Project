import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/ui/Header';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 font-sans transition-colors duration-200">
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
