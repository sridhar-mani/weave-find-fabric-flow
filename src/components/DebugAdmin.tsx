import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function DebugAdmin() {
  const { user } = useAuth();
  const { isAdmin, isLoading, adminData } = useAdmin();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setProfileData(data);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    checkProfile();
  }, [user]);

  if (!user) {
    return <div className="p-4 bg-yellow-100">No user logged in</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-2">
      <h3 className="font-bold">Debug Admin Status</h3>
      <p>
        <strong>User ID:</strong> {user.id}
      </p>
      <p>
        <strong>User Email:</strong> {user.email}
      </p>
      <p>
        <strong>Is Admin (hook):</strong> {isAdmin ? "YES" : "NO"}
      </p>
      <p>
        <strong>Is Loading:</strong> {isLoading ? "YES" : "NO"}
      </p>

      <div className="mt-4">
        <strong>Profile Data:</strong>
        {error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : profileData ? (
          <pre className="text-xs bg-white p-2 rounded">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        ) : (
          <div>Loading profile...</div>
        )}
      </div>

      <div className="mt-4">
        <strong>Admin Data:</strong>
        <pre className="text-xs bg-white p-2 rounded">
          {JSON.stringify(adminData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
