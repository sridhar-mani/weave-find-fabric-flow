import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "user";
  permissions: string[];
}

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminData(null);
        setIsLoading(false);
        return;
      }

      try {
        // Check user role from profiles table
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setIsAdmin(false);
          setAdminData(null);
        } else if (profile?.role === "admin") {
          setIsAdmin(true);
          setAdminData({
            id: user.id,
            email: user.email || "",
            role: "admin",
            permissions: [
              "view_dashboard",
              "manage_fabrics",
              "manage_users",
              "view_analytics",
              "manage_suppliers",
            ],
          });
        } else {
          setIsAdmin(false);
          setAdminData(null);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
        setAdminData(null);
      }

      setIsLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  const hasPermission = (permission: string) => {
    return adminData?.permissions.includes(permission) || false;
  };

  return {
    isAdmin,
    isLoading,
    adminData,
    hasPermission,
    user,
  };
}
