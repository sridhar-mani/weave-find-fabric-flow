import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Home,
  Search,
  Layout,
  User,
  LogOut,
  Settings,
  Package,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import { LoginForm } from "./auth/LoginForm";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navItems = [
    {
      path: "/",
      icon: Home,
      label: "Home",
    },
    {
      path: "/explore",
      icon: Search,
      label: "Explore",
    },
    {
      path: "/collection",
      icon: Layout,
      label: "Collection",
    },
    {
      path: "/materials",
      icon: Package,
      label: "Materials",
      requiresAuth: true,
    },
    {
      path: "/analytics",
      icon: BarChart3,
      label: "Insights",
      requiresAuth: true,
    },
  ];

  if (isAdmin) {
    navItems.push({
      path: "/admin",
      icon: Settings,
      label: "Admin",
    });
    navItems.push({
      path: "/admin/dashboard",
      icon: BarChart3,
      label: "Dashboard",
    });
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-stone-200 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-stone-800">
              Weave
            </Link>{" "}
            <div className="flex items-center gap-6">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path ||
                      (item.path.startsWith("/admin") &&
                        location.pathname.startsWith(item.path))
                        ? "bg-amber-100 text-amber-700"
                        : "text-stone-600 hover:text-stone-800 hover:bg-stone-100"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-stone-600">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAuthModal(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-stone-200 z-30">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-colors ${
                location.pathname === item.path ||
                (item.path.startsWith("/admin") &&
                  location.pathname.startsWith(item.path))
                  ? "text-amber-700"
                  : "text-stone-600 hover:text-stone-800"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}

          {!user && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex flex-col items-center gap-1 p-3 rounded-lg text-stone-600 hover:text-stone-800 transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="text-xs">Sign In</span>
            </button>
          )}
        </div>
      </nav>{" "}
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md p-6">
          <LoginForm onSuccess={() => setShowAuthModal(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navigation;
