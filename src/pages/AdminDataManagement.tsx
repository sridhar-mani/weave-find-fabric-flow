import React from "react";
import AdminGuard from "@/components/AdminGuard";
import CSVDataEntry from "@/components/CSVDataEntry";

const AdminDataManagement = () => (
  <AdminGuard>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-slate-800">
          Data Management
        </h1>
        <CSVDataEntry />
      </div>
    </div>
  </AdminGuard>
);

export default AdminDataManagement;
