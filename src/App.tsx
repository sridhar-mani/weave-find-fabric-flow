
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Collection from "./pages/Collection";
import MaterialsMarketplace from "./pages/MaterialsMarketplace";
import TextileAnalytics from "./pages/TextileAnalytics";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCodeEditor from "./pages/AdminCodeEditor";
import AdminDataManagement from "./pages/AdminDataManagement";
import AdvancedAdminDashboard from "./pages/AdvancedAdminDashboard";
import SupplierProfile from "./pages/SupplierProfile";
import SupplierDirectory from "./pages/SupplierDirectory";
import SupplierPerformancePage from "./pages/SupplierPerformancePage";
import Messages from "./pages/Messages";
import RequestForQuote from "./pages/RequestForQuote";
import QuoteRequests from "./pages/QuoteRequests";
import OrderTracking from "./pages/OrderTracking";
import SampleRequest from "./pages/SampleRequest";
import AdminGuard from "./components/AdminGuard";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import RequireAuth from "@/components/RequireAuth";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/collection" element={<Collection />} />
              <Route element={<RequireAuth />}>
                <Route path="/materials" element={<MaterialsMarketplace />} />
                <Route path="/analytics" element={<TextileAnalytics />} />
                <Route path="/suppliers" element={<SupplierDirectory />} />
                <Route path="/suppliers/:id" element={<SupplierProfile />} />
                <Route
                  path="/suppliers/performance"
                  element={<SupplierPerformancePage />}
                />
                <Route path="/messages" element={<Messages />} />
                <Route path="/quotes" element={<QuoteRequests />} />
                <Route path="/quotes/new" element={<RequestForQuote />} />
                <Route path="/orders" element={<OrderTracking />} />
                <Route path="/sample-request" element={<SampleRequest />} />
              </Route>
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
                element={
                  <AdminGuard>
                    <AdvancedAdminDashboard />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/code-editor"
                element={
                  <AdminGuard>
                    <AdminCodeEditor />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/data-management"
                element={
                  <AdminGuard>
                    <AdminDataManagement />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminGuard>
                    <AdminUsers />
                  </AdminGuard>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
