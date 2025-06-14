import React from "react";
import SupplierPerformanceDashboard from "@/components/SupplierPerformanceDashboard";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileDown, Printer, Mail } from "lucide-react";

const SupplierPerformancePage = () => {
  // Mock performance data
  const performanceMetrics = {
    overallScore: 86,
    responseTime: {
      average: "4.2 hours",
      improvement: 15,
    },
    fulfillmentRate: 94,
    onTimeDelivery: 92,
    qualityScore: 89,
    returnRate: 2.4,
    communicationScore: 86,
    certificationCompliance: 95,
  };

  const orderMetrics = {
    totalOrders: 147,
    pendingOrders: 12,
    completedOrders: 135,
    averageOrderValue: 7850,
    totalRevenue: 1153950,
    orderGrowth: 12.4,
  };

  const inquiryMetrics = {
    totalInquiries: 342,
    responseRate: 96,
    averageResponseTime: "4.2 hours",
    conversionRate: 38,
  };

  return (
    <div className="container py-6 max-w-screen-2xl">
      <PageHeader
        title="Supplier Performance"
        description="Monitor your business metrics and performance as a supplier"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="dashboard" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">Performance Dashboard</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <SupplierPerformanceDashboard
            performanceMetrics={performanceMetrics}
            orderMetrics={orderMetrics}
            inquiryMetrics={inquiryMetrics}
          />
        </TabsContent>

        <TabsContent value="certifications">
          <div className="bg-slate-50 p-8 rounded-md text-center">
            <h3 className="text-lg font-medium mb-2">Certifications Tab</h3>
            <p className="text-slate-500">
              This area would display certification management features.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="quality">
          <div className="bg-slate-50 p-8 rounded-md text-center">
            <h3 className="text-lg font-medium mb-2">Quality Control Tab</h3>
            <p className="text-slate-500">
              This area would display quality testing and control features.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="bg-slate-50 p-8 rounded-md text-center">
            <h3 className="text-lg font-medium mb-2">Reports Tab</h3>
            <p className="text-slate-500">
              This area would provide detailed performance reports and
              analytics.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplierPerformancePage;
