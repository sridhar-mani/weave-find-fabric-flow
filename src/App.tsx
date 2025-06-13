import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Collection from "./pages/Collection";
import Materials from "./pages/Materials";
import TextileAnalytics from "./pages/TextileAnalytics";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCodeEditor from "./pages/AdminCodeEditor";
import AdminDataManagement from "./pages/AdminDataManagement";
import AdvancedAdminDashboard from "./pages/AdvancedAdminDashboard";
import AdminGuard from "./components/AdminGuard";
import Navigation from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100">
            <Navigation />{" "}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/analytics" element={<TextileAnalytics />} />
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <AdminGuard>
                    <Analytics />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/dashboard"
                element={<AdvancedAdminDashboard />}
              />
              <Route path="/admin/code-editor" element={<AdminCodeEditor />} />
              <Route
                path="/admin/data-management"
                element={<AdminDataManagement />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
