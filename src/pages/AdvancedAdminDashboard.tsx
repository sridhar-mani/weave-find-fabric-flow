import React, { useState, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import AdminGuard from "@/components/AdminGuard";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { DataExporter } from "@/lib/dataExporter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  Eye,
  Download,
  FileSpreadsheet,
  FileText,
  Code,
  Database,
  Settings,
  X,
  RotateCcw,
  Save,
  Grid3x3,
  Monitor,
} from "lucide-react";

const ResponsiveGridLayout = WidthProvider(Responsive);

// Widget configurations
const WIDGET_TYPES = {
  REVENUE_CHART: "revenue_chart",
  TRAFFIC_OVERVIEW: "traffic_overview",
  USER_ENGAGEMENT: "user_engagement",
  TOP_FABRICS: "top_fabrics",
  GSM_DISTRIBUTION: "gsm_distribution",
  SUPPLIER_PERFORMANCE: "supplier_performance",
  CATEGORY_DISTRIBUTION: "category_distribution",
  KPI_USERS: "kpi_users",
  KPI_FABRICS: "kpi_fabrics",
  KPI_REVENUE: "kpi_revenue",
  KPI_SESSION_TIME: "kpi_session_time",
};

// Default layout configuration
const defaultLayouts = {
  lg: [
    { i: WIDGET_TYPES.KPI_USERS, x: 0, y: 0, w: 3, h: 2 },
    { i: WIDGET_TYPES.KPI_FABRICS, x: 3, y: 0, w: 3, h: 2 },
    { i: WIDGET_TYPES.KPI_REVENUE, x: 6, y: 0, w: 3, h: 2 },
    { i: WIDGET_TYPES.KPI_SESSION_TIME, x: 9, y: 0, w: 3, h: 2 },
    { i: WIDGET_TYPES.TRAFFIC_OVERVIEW, x: 0, y: 2, w: 6, h: 4 },
    { i: WIDGET_TYPES.CATEGORY_DISTRIBUTION, x: 6, y: 2, w: 6, h: 4 },
    { i: WIDGET_TYPES.USER_ENGAGEMENT, x: 0, y: 6, w: 12, h: 4 },
    { i: WIDGET_TYPES.TOP_FABRICS, x: 0, y: 10, w: 6, h: 4 },
    { i: WIDGET_TYPES.GSM_DISTRIBUTION, x: 6, y: 10, w: 6, h: 4 },
    { i: WIDGET_TYPES.SUPPLIER_PERFORMANCE, x: 0, y: 14, w: 12, h: 4 },
  ],
  md: [
    { i: WIDGET_TYPES.KPI_USERS, x: 0, y: 0, w: 6, h: 2 },
    { i: WIDGET_TYPES.KPI_FABRICS, x: 6, y: 0, w: 6, h: 2 },
    { i: WIDGET_TYPES.KPI_REVENUE, x: 0, y: 2, w: 6, h: 2 },
    { i: WIDGET_TYPES.KPI_SESSION_TIME, x: 6, y: 2, w: 6, h: 2 },
    { i: WIDGET_TYPES.TRAFFIC_OVERVIEW, x: 0, y: 4, w: 12, h: 4 },
    { i: WIDGET_TYPES.CATEGORY_DISTRIBUTION, x: 0, y: 8, w: 12, h: 4 },
    { i: WIDGET_TYPES.USER_ENGAGEMENT, x: 0, y: 12, w: 12, h: 4 },
    { i: WIDGET_TYPES.TOP_FABRICS, x: 0, y: 16, w: 12, h: 4 },
    { i: WIDGET_TYPES.GSM_DISTRIBUTION, x: 0, y: 20, w: 12, h: 4 },
    { i: WIDGET_TYPES.SUPPLIER_PERFORMANCE, x: 0, y: 24, w: 12, h: 4 },
  ],
  sm: [
    { i: WIDGET_TYPES.KPI_USERS, x: 0, y: 0, w: 12, h: 2 },
    { i: WIDGET_TYPES.KPI_FABRICS, x: 0, y: 2, w: 12, h: 2 },
    { i: WIDGET_TYPES.KPI_REVENUE, x: 0, y: 4, w: 12, h: 2 },
    { i: WIDGET_TYPES.KPI_SESSION_TIME, x: 0, y: 6, w: 12, h: 2 },
    { i: WIDGET_TYPES.TRAFFIC_OVERVIEW, x: 0, y: 8, w: 12, h: 4 },
    { i: WIDGET_TYPES.CATEGORY_DISTRIBUTION, x: 0, y: 12, w: 12, h: 4 },
    { i: WIDGET_TYPES.USER_ENGAGEMENT, x: 0, y: 16, w: 12, h: 4 },
    { i: WIDGET_TYPES.TOP_FABRICS, x: 0, y: 20, w: 12, h: 4 },
    { i: WIDGET_TYPES.GSM_DISTRIBUTION, x: 0, y: 24, w: 12, h: 4 },
    { i: WIDGET_TYPES.SUPPLIER_PERFORMANCE, x: 0, y: 28, w: 12, h: 4 },
  ],
};

const AdvancedAdminDashboard = () => {
  const {
    metrics,
    trafficData,
    loading,
    getTopFabrics,
    getCategoryDistribution,
  } = useDashboardAnalytics();
  const [layouts, setLayouts] = useState(defaultLayouts);
  const [hiddenWidgets, setHiddenWidgets] = useState(new Set());
  const [isDragMode, setIsDragMode] = useState(false);

  // Chart configurations
  const chartConfig = {
    users: { label: "Users", color: "#8B5CF6" },
    pageViews: { label: "Page Views", color: "#06B6D4" },
    fabricViews: { label: "Fabric Views", color: "#10B981" },
    sessions: { label: "Sessions", color: "#F59E0B" },
    avgDuration: { label: "Avg Duration (min)", color: "#EF4444" },
    views: { label: "Views", color: "#8B5CF6" },
    samples: { label: "Samples", color: "#06B6D4" },
    reservations: { label: "Reservations", color: "#10B981" },
    revenue: { label: "Revenue ($)", color: "#F59E0B" },
    count: { label: "Count", color: "#10B981" },
  };

  // Sample data
  const userEngagementData = [
    { day: "Mon", sessions: 450, avgDuration: 4.2, bounceRate: 35 },
    { day: "Tue", sessions: 520, avgDuration: 5.1, bounceRate: 28 },
    { day: "Wed", sessions: 480, avgDuration: 4.8, bounceRate: 32 },
    { day: "Thu", sessions: 680, avgDuration: 6.2, bounceRate: 25 },
    { day: "Fri", sessions: 750, avgDuration: 5.8, bounceRate: 22 },
    { day: "Sat", sessions: 320, avgDuration: 3.5, bounceRate: 45 },
    { day: "Sun", sessions: 280, avgDuration: 3.2, bounceRate: 48 },
  ];

  const gsmDistributionData = [
    { gsm: "0-100", count: 45 },
    { gsm: "101-200", count: 180 },
    { gsm: "201-300", count: 320 },
    { gsm: "301-400", count: 250 },
    { gsm: "401-500", count: 85 },
  ];

  const supplierPerformanceData = [
    {
      supplier: "Textile Co.",
      orders: 85,
      onTime: 92,
      quality: 4.8,
      price: 3.2,
    },
    {
      supplier: "Fabric Masters",
      orders: 72,
      onTime: 88,
      quality: 4.6,
      price: 3.8,
    },
    {
      supplier: "Weave Works",
      orders: 65,
      onTime: 95,
      quality: 4.9,
      price: 2.9,
    },
    {
      supplier: "Thread & Co",
      orders: 58,
      onTime: 78,
      quality: 4.2,
      price: 4.1,
    },
    {
      supplier: "Natural Fibers",
      orders: 45,
      onTime: 85,
      quality: 4.5,
      price: 3.5,
    },
  ];

  const fabricPerformanceData = [
    {
      name: "Organic Cotton Canvas",
      views: 1250,
      samples: 180,
      reservations: 45,
      revenue: 5400,
    },
    {
      name: "Belgian Linen",
      views: 980,
      samples: 150,
      reservations: 38,
      revenue: 4200,
    },
    {
      name: "Merino Wool Jersey",
      views: 750,
      samples: 95,
      reservations: 25,
      revenue: 3200,
    },
    {
      name: "Bamboo Blend",
      views: 650,
      samples: 80,
      reservations: 20,
      revenue: 2100,
    },
    {
      name: "Hemp Canvas",
      views: 420,
      samples: 45,
      reservations: 12,
      revenue: 1800,
    },
  ];

  // Event handlers
  const onLayoutChange = useCallback((layout, layouts) => {
    setLayouts(layouts);
  }, []);
  const onBreakpointChange = useCallback((breakpoint) => {
    // Handle breakpoint changes if needed
  }, []);

  const toggleWidget = useCallback((widgetId) => {
    setHiddenWidgets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  }, []);

  const resetLayout = useCallback(() => {
    setLayouts(defaultLayouts);
    setHiddenWidgets(new Set());
  }, []);

  const saveLayout = useCallback(() => {
    localStorage.setItem("adminDashboardLayouts", JSON.stringify(layouts));
    localStorage.setItem(
      "adminDashboardHiddenWidgets",
      JSON.stringify([...hiddenWidgets])
    );
  }, [layouts, hiddenWidgets]);

  const handleExportData = (format: "excel" | "csv" | "json" | "jupyter") => {
    const timestamp = new Date().toISOString().split("T")[0];
    const categoryData = getCategoryDistribution();
    const topFabrics = getTopFabrics(5);

    const flattenedData = [
      ...trafficData.map((item) => ({ type: "traffic", ...item })),
      ...categoryData.map((item) => ({ type: "category", ...item })),
      ...topFabrics.map((item) => ({ type: "topFabric", ...item })),
      ...userEngagementData.map((item) => ({ type: "engagement", ...item })),
      ...gsmDistributionData.map((item) => ({ type: "gsm", ...item })),
      ...supplierPerformanceData.map((item) => ({ type: "supplier", ...item })),
      ...fabricPerformanceData.map((item) => ({
        type: "fabricPerformance",
        ...item,
      })),
      { type: "metrics", ...metrics, exportedAt: new Date().toISOString() },
    ];

    switch (format) {
      case "excel":
        DataExporter.exportToExcel(
          flattenedData,
          `weave-find-analytics-${timestamp}`,
          "Analytics"
        );
        break;
      case "csv":
        DataExporter.exportToCSV(
          flattenedData,
          `weave-find-analytics-${timestamp}`
        );
        break;
      case "json":
        DataExporter.exportToJSON(
          flattenedData,
          `weave-find-analytics-${timestamp}`
        );
        break;
      case "jupyter":
        DataExporter.exportToJupyterNotebook(
          flattenedData,
          `weave-find-analytics-${timestamp}`,
          "Advanced Analytics Dashboard"
        );
        break;
    }
  };

  // Widget components
  const renderWidget = (widgetType) => {
    if (hiddenWidgets.has(widgetType)) return null;

    const categoryData = getCategoryDistribution();
    const topFabrics = getTopFabrics(5);

    switch (widgetType) {
      case WIDGET_TYPES.KPI_USERS:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {metrics.totalUsers?.toLocaleString() || "2,847"}
              </div>
              <div className="flex items-center text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />+
                {metrics.userGrowth?.toFixed(1) || "12.4"}% from last month
              </div>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.KPI_FABRICS:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Total Fabrics
              </CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {metrics.totalFabrics?.toLocaleString() || "1,294"}
              </div>{" "}
              <div className="flex items-center text-xs text-emerald-600">
                <Activity className="w-3 h-3 mr-1" />+{(8.2).toFixed(1)}% from
                last month
              </div>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.KPI_REVENUE:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Monthly Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                ${metrics.monthlyRevenue?.toLocaleString() || "84,392"}
              </div>
              <div className="flex items-center text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />+
                {metrics.revenueGrowth?.toFixed(1) || "15.8"}% from last month
              </div>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.KPI_SESSION_TIME:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Avg Session Time
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {metrics.avgSessionTime?.toFixed(1) || "4.2"}m
              </div>
              <div className="flex items-center text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 mr-1" />+
                {metrics.sessionGrowth?.toFixed(1) || "3.1"}% from last month
              </div>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.TRAFFIC_OVERVIEW:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-slate-800">Traffic Overview</CardTitle>
              <CardDescription>Monthly user engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full min-h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={trafficData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="users" fill="#8B5CF6" name="Users" />
                    <Bar dataKey="pageViews" fill="#06B6D4" name="Page Views" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.CATEGORY_DISTRIBUTION:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-slate-800">
                Fabric Categories
              </CardTitle>
              <CardDescription>Distribution of fabric types</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full min-h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                      fontSize={10}
                    >
                      {categoryData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.USER_ENGAGEMENT:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-slate-800">
                Weekly User Engagement
              </CardTitle>
              <CardDescription>
                Daily sessions and user behavior patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full min-h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userEngagementData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: "#F59E0B", strokeWidth: 1, r: 3 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avgDuration"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: "#EF4444", strokeWidth: 1, r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.TOP_FABRICS:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full">
            <CardHeader>
              <CardTitle className="text-slate-800">
                Top Performing Fabrics
              </CardTitle>
              <CardDescription>
                Fabrics ranked by user engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[250px] overflow-y-auto">
                {topFabrics.map((fabric, index) => (
                  <div
                    key={fabric.id}
                    className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-violet-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 text-sm">
                          {fabric.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {fabric.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-violet-600">
                        {fabric.views} views
                      </div>
                      <div className="text-xs text-blue-600">
                        {fabric.samples} samples
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.GSM_DISTRIBUTION:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-slate-800">GSM Distribution</CardTitle>
              <CardDescription>
                Fabric weight distribution across catalog
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full min-h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={gsmDistributionData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="gsm" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      fill="#10B981"
                      name="Count"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      case WIDGET_TYPES.SUPPLIER_PERFORMANCE:
        return (
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-slate-800">
                Supplier Performance Matrix
              </CardTitle>
              <CardDescription>
                Quality vs Price positioning of suppliers
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4">
              <ChartContainer
                config={chartConfig}
                className="w-full h-full min-h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    data={supplierPerformanceData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="quality"
                      name="Quality Score"
                      domain={[4, 5]}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <YAxis
                      type="number"
                      dataKey="price"
                      name="Price Score"
                      domain={[2.5, 4.5]}
                      stroke="#64748b"
                      fontSize={12}
                    />
                    <ChartTooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={<ChartTooltipContent />}
                    />
                    <Scatter dataKey="orders" fill="#8B5CF6" r={6} />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-slate-200 rounded w-1/3"></div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {["kpi-1", "kpi-2", "kpi-3", "kpi-4"].map((id) => (
                  <div key={id} className="h-32 bg-slate-200 rounded"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {["chart-1", "chart-2", "chart-3", "chart-4"].map((id) => (
                  <div key={id} className="h-64 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                  Advanced Admin Dashboard
                </h1>
                <p className="text-slate-600">
                  Comprehensive analytics with customizable layout
                </p>
              </div>

              {/* Control Panel */}
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Live Data
                </Badge>

                <Button
                  variant={isDragMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsDragMode(!isDragMode)}
                  className="flex items-center gap-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                  {isDragMode ? "Lock Layout" : "Edit Layout"}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Widgets
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {Object.entries(WIDGET_TYPES).map(([key, value]) => (
                      <DropdownMenuItem
                        key={value}
                        onClick={() => toggleWidget(value)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">
                            {key.replace(/_/g, " ")}
                          </span>
                          {!hiddenWidgets.has(value) && (
                            <Eye className="w-4 h-4" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={resetLayout}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Layout
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={saveLayout}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Layout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Data
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleExportData("excel")}>
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportData("csv")}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export to CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportData("json")}>
                      <Database className="w-4 h-4 mr-2" />
                      Export to JSON
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleExportData("jupyter")}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Export Jupyter Notebook
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" asChild>
                <a
                  href="/admin/code-editor"
                  className="flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  Code Editor
                </a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a
                  href="/admin/data-management"
                  className="flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Data Management
                </a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href="/admin/analytics" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Full Analytics
                </a>
              </Button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div
            className={`transition-all duration-300 ${
              isDragMode
                ? "ring-2 ring-blue-300 ring-opacity-50 rounded-lg p-4 bg-blue-50/30"
                : ""
            }`}
          >
            <ResponsiveGridLayout
              className="layout"
              layouts={layouts}
              onLayoutChange={onLayoutChange}
              onBreakpointChange={onBreakpointChange}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
              rowHeight={60}
              isDraggable={isDragMode}
              isResizable={isDragMode}
              margin={[16, 16]}
              containerPadding={[0, 0]}
              useCSSTransforms={true}
              compactType="vertical"
              preventCollision={false}
            >
              {Object.values(WIDGET_TYPES).map((widgetType) => (
                <div key={widgetType} className="relative group">
                  {isDragMode && !hiddenWidgets.has(widgetType) && (
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWidget(widgetType)}
                        className="w-8 h-8 p-0 bg-white/90 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  )}
                  {renderWidget(widgetType)}
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>

          {isDragMode && (
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <Grid3x3 className="w-5 h-5" />
                <span className="font-medium">Layout Edit Mode Active</span>
              </div>
              <p className="text-blue-700 text-sm mt-1">
                Drag widgets to reposition them, resize by dragging corners, or
                use the settings menu to show/hide widgets.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdvancedAdminDashboard;
