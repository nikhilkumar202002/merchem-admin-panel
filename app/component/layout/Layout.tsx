"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeNavId?: string;
  onSelectNav?: (id: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeNavId = "main-categories",
  onSelectNav,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFA] flex flex-col font-sans">
      {/* Fixed Sidebar */}
      <Sidebar
        activeId={activeNavId}
        onSelectNav={onSelectNav}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Layout Wrapper (margin-left on desktop for 240px sidebar) */}
      <div className="flex-1 flex flex-col md:pl-[240px] transition-all duration-300">
        {/* Top Header */}
        <Header
          onToggleMobileSidebar={() =>
            setIsMobileSidebarOpen(!isMobileSidebarOpen)
          }
        />

        {/* Main Content Container */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;