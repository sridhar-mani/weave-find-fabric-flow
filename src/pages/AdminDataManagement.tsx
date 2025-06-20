
import React from "react";
import AdminGuard from "@/components/AdminGuard";
import CSVDataEntry from "@/components/CSVDataEntry";
import PageHeader from "@/components/PageHeader";

const AdminDataManagement = () => (
  <AdminGuard>
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      <div className="p-6">
        <PageHeader
          title="Data Management"
          description="Import and manage fabric data using CSV uploads"
          breadcrumbs={[{ label: "Admin", path: "/admin" }, { label: "Data Management" }]}
        />
        <div className="mt-6">
          <CSVDataEntry />
        </div>
      </div>
    </div>
  </AdminGuard>
);

export default AdminDataManagement;
