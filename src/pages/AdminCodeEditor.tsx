import React from "react";
import AdminGuard from "@/components/AdminGuard";
import MonacoCodeEditor from "@/components/MonacoCodeEditor";

const AdminCodeEditor = () => (
  <AdminGuard>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold mb-6 text-slate-800">Code Editor</h1>
        <MonacoCodeEditor />
      </div>
    </div>
  </AdminGuard>
);

export default AdminCodeEditor;
