
import React from "react";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex flex-col w-full">
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          {/* Mobile sidebar trigger */}
          <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-stone-200/60 p-3">
            <SidebarTrigger className="h-8 w-8" />
          </div>
          
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
