import React from "react";
import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const AdminGuard: React.FC<AdminGuardProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAdmin, isLoading, hasPermission, user } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <Card className="w-96 bg-white/80 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <Card className="w-96 bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-slate-800">
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              Please sign in to access the admin dashboard.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <Card className="w-96 bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-slate-800">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              You don't have permission to access the admin dashboard.
            </p>
            <p className="text-sm text-slate-500">
              Contact your administrator if you believe this is an error.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 flex items-center justify-center">
        <Card className="w-96 bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <CardTitle className="text-slate-800">
              Insufficient Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-600">
              You don't have the required permission:{" "}
              <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                {requiredPermission}
              </code>
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
