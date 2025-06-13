import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Home,
  Search,
  Layout,
  Package,
  BarChart3,
  Settings,
  Users,
  Code,
  Database,
  MessageSquare,
  ShoppingCart,
  Star,
  Building2,
  ChevronRight,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile sidebar when location changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const userNavItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
    },
    {
      path: "/explore",
      icon: Search,
      label: "Explore Materials",
    },
    {
      path: "/collection",
      icon: Layout,
      label: "My Collections",
      requiresAuth: true,
    },
    {
      path: "/materials",
      icon: Package,
      label: "Materials Marketplace",
      requiresAuth: true,
    },
    {
      path: "/analytics",
      icon: BarChart3,
      label: "Textile Insights",
      requiresAuth: true,
    },
    {
      path: "/suppliers",
      icon: Building2,
      label: "Suppliers",
      requiresAuth: true,
    },
    {
      path: "/quotes",
      icon: ShoppingCart,
      label: "Quote Requests",
      requiresAuth: true,
    },
    {
      path: "/messages",
      icon: MessageSquare,
      label: "Messages",
      requiresAuth: true,
    },
  ];

  const adminNavItems = [
    {
      path: "/admin/dashboard",
      icon: BarChart3,
      label: "Admin Dashboard",
    },
    {
      path: "/admin/analytics",
      icon: ChevronRight,
      label: "Advanced Analytics",
    },
    {
      path: "/admin/users",
      icon: Users,
      label: "User Management",
    },
    {
      path: "/admin/code-editor",
      icon: Code,
      label: "Code Editor",
    },
    {
      path: "/admin/data-management",
      icon: Database,
      label: "Data Management",
    },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile toggle */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 bg-white border-b border-stone-200 lg:hidden">
        <Link to="/" className="text-xl font-bold text-stone-800">
          Weave
        </Link>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                isMobileOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </Button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-stone-200 transition-transform duration-300 transform lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-600" />
            <Link to="/" className="text-xl font-bold text-stone-800">
              Weave
            </Link>
          </div>

          <Separator />

          {/* User navigation */}
          <div className="px-3 py-4 flex-1 overflow-y-auto">
            <div className="mb-2 px-4">
              <p className="text-xs font-medium text-stone-500">MAIN</p>
            </div>
            <nav className="space-y-1">
              {userNavItems.map((item) => {
                // Skip auth-required items for non-logged in users
                if (item.requiresAuth && !user) return null;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors",
                      isLinkActive(item.path)
                        ? "bg-amber-50 text-amber-700 font-medium"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Admin navigation */}
            {isAdmin && (
              <>
                <div className="mt-6 mb-2 px-4">
                  <p className="text-xs font-medium text-stone-500">ADMIN</p>
                </div>
                <nav className="space-y-1">
                  {adminNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors",
                        isLinkActive(item.path)
                          ? "bg-amber-50 text-amber-700 font-medium"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </>
            )}
          </div>

          {/* User profile section */}
          <div className="p-4 border-t border-stone-200">
            {user ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">
                    {user.email.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-stone-500">
                      {isAdmin ? "Administrator" : "Member"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-stone-600">
                  Sign in to access all features
                </p>
                <Button asChild className="w-full">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
