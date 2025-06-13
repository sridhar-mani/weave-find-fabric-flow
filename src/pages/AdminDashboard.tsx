import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AdminGuard from "@/components/AdminGuard";
import CSVDataEntry from "@/components/CSVDataEntry";
import MonacoCodeEditor from "@/components/MonacoCodeEditor";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { DataExporter } from "@/lib/dataExporter";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Eye,
  ShoppingCart,
  AlertTriangle,
  Download,
  FileSpreadsheet,
  FileText,
  Code,
  Database,
  BarChart3,
} from "lucide-react";
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
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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
  { supplier: "Textile Co.", orders: 85, onTime: 92, quality: 4.8, price: 3.2 },
  {
    supplier: "Fabric Masters",
    orders: 72,
    onTime: 88,
    quality: 4.6,
    price: 3.8,
  },
  { supplier: "Weave Works", orders: 65, onTime: 95, quality: 4.9, price: 2.9 },
  { supplier: "Thread & Co", orders: 58, onTime: 78, quality: 4.2, price: 4.1 },
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

const AdminDashboard = () => {
  const {
    metrics,
    trafficData,
    loading,
    getTopFabrics,
    getCategoryDistribution,
  } = useDashboardAnalytics();
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
          "Weave Find Analytics Report"
        );
        break;
    }
  };

  const handleOpenInJupyter = async () => {
    const timestamp = new Date().toISOString().split("T")[0];
    const flattenedData = [
      ...trafficData.map((item) => ({ type: "traffic", ...item })),
      ...getCategoryDistribution().map((item) => ({
        type: "category",
        ...item,
      })),
      ...getTopFabrics(5).map((item) => ({ type: "topFabric", ...item })),
    ];

    const jupyterUrl = await DataExporter.sendToJupyterHub(
      flattenedData,
      `weave-find-analytics-${timestamp}`
    );
    if (jupyterUrl) {
      window.open(jupyterUrl, "_blank");
    } else {
      handleExportData("jupyter");
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <div className="h-10 w-64 bg-slate-200 rounded mb-2"></div>
              <div className="h-6 w-96 bg-slate-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              {["users", "fabrics", "revenue", "sessions"].map(
                (cardType, i) => (
                  <Card
                    key={`loading-${cardType}`}
                    className="bg-white/80 backdrop-blur-sm border-slate-200"
                  >
                    <CardHeader>
                      <div className="h-4 w-24 bg-slate-200 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-20 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  const categoryData = getCategoryDistribution();
  const topFabrics = getTopFabrics(5);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
        <div className="container mx-auto px-6 space-y-10">
          {" "}
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600">
                  Comprehensive analytics and insights for Weave Find
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  Live Data
                </Badge>
                {/* Data Export Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
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
                      Download Jupyter Notebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenInJupyter}>
                      <Code className="w-4 h-4 mr-2" />
                      Open in Jupyter Hub
                    </DropdownMenuItem>{" "}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Quick Access Buttons */}
                <Link to="/admin/code-editor">
                  <Button variant="secondary" size="sm" className="ml-4">
                    <Code className="w-4 h-4 mr-2" />
                    Code Editor
                  </Button>
                </Link>

                <Link to="/admin/data-management">
                  <Button variant="secondary" size="sm" className="ml-2">
                    <Database className="w-4 h-4 mr-2" />
                    Data Management
                  </Button>
                </Link>

                <Link to="/admin/dashboard">
                  <Button variant="secondary" size="sm" className="ml-2">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Advanced Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>{" "}
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-violet-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {metrics.totalUsers.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs ${
                    metrics.userGrowth >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.userGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metrics.userGrowth >= 0 ? "+" : ""}
                  {metrics.userGrowth.toFixed(1)}% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Fabrics
                </CardTitle>
                <Package className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {metrics.totalFabrics.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-emerald-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  ${metrics.monthlyRevenue.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs ${
                    metrics.revenueGrowth >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.revenueGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metrics.revenueGrowth >= 0 ? "+" : ""}
                  {metrics.revenueGrowth.toFixed(1)}% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Avg Session Time
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">
                  {metrics.avgSessionTime.toFixed(1)}m
                </div>
                <div
                  className={`flex items-center text-xs ${
                    metrics.sessionGrowth >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {metrics.sessionGrowth >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {metrics.sessionGrowth >= 0 ? "+" : ""}
                  {metrics.sessionGrowth.toFixed(1)}% from last month
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-8">
            {" "}
            <TabsList className="grid w-full grid-cols-7 bg-white/70 backdrop-blur-sm p-2 h-12 rounded-lg">
              <TabsTrigger value="overview" className="text-sm font-medium">
                Overview
              </TabsTrigger>
              <TabsTrigger value="fabrics" className="text-sm font-medium">
                Fabrics
              </TabsTrigger>
              <TabsTrigger value="users" className="text-sm font-medium">
                Users
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="text-sm font-medium">
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-sm font-medium">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="code-editor" className="text-sm font-medium">
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="csv-entry" className="text-sm font-medium">
                Data Management
              </TabsTrigger>
            </TabsList>
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Overview */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Traffic Overview
                    </CardTitle>
                    <CardDescription>
                      Monthly user engagement metrics
                    </CardDescription>
                  </CardHeader>{" "}
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ChartContainer
                        config={chartConfig}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={trafficData}
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="#e2e8f0"
                            />
                            <XAxis dataKey="month" stroke="#64748b" />
                            <YAxis stroke="#64748b" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="users" fill="#8B5CF6" name="Users" />
                            <Bar
                              dataKey="pageViews"
                              fill="#06B6D4"
                              name="Page Views"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Fabric Categories */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Fabric Categories
                    </CardTitle>
                    <CardDescription>
                      Distribution of fabric types
                    </CardDescription>
                  </CardHeader>{" "}
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {categoryData.map((category, index) => (
                          <div
                            key={category.name}
                            className="text-center p-4 rounded-lg border border-slate-200"
                          >
                            <div
                              className="w-8 h-8 rounded-full mx-auto mb-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <div className="text-sm font-medium text-slate-700">
                              {category.name}
                            </div>
                            <div className="text-lg font-bold text-slate-800">
                              {category.value}%
                            </div>
                            <div className="text-xs text-slate-500">
                              {category.count} fabrics
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Engagement */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">
                    Weekly User Engagement
                  </CardTitle>
                  <CardDescription>
                    Daily sessions and user behavior patterns
                  </CardDescription>
                </CardHeader>{" "}
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer
                      config={chartConfig}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={userEngagementData}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="day" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="sessions"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="avgDuration"
                            stroke="#EF4444"
                            strokeWidth={3}
                            dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Fabrics Tab */}
            <TabsContent value="fabrics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performing Fabrics */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Top Performing Fabrics
                    </CardTitle>
                    <CardDescription>
                      Fabrics ranked by user engagement
                    </CardDescription>
                  </CardHeader>{" "}
                  <CardContent>
                    <div className="space-y-4">
                      {topFabrics.map((fabric, index) => (
                        <div
                          key={fabric.id}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-violet-600">
                                #{index + 1}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">
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

                {/* GSM Distribution */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      GSM Distribution
                    </CardTitle>
                    <CardDescription>
                      Fabric weight distribution across catalog
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gsmDistributionData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="gsm" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="count"
                            fill="url(#colorGSM)"
                            radius={[4, 4, 0, 0]}
                          />
                          <defs>
                            <linearGradient
                              id="colorGSM"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10B981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10B981"
                                stopOpacity={0.4}
                              />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      User Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800 mb-2">
                      12,847
                    </div>
                    <div className="text-sm text-slate-600 mb-4">
                      Active Users
                    </div>
                    <div className="flex items-center text-emerald-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+1,284 this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Engagement Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800 mb-2">
                      68.4%
                    </div>
                    <div className="text-sm text-slate-600 mb-4">
                      Users with 2+ sessions
                    </div>
                    <div className="flex items-center text-emerald-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="text-sm">+5.2% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Sample Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-800 mb-2">
                      2,450
                    </div>
                    <div className="text-sm text-slate-600 mb-4">
                      This month
                    </div>
                    <div className="flex items-center text-red-600">
                      <TrendingDown className="w-4 h-4 mr-1" />
                      <span className="text-sm">-2.1% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* Suppliers Tab */}
            <TabsContent value="suppliers" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800">
                    Supplier Performance Matrix
                  </CardTitle>
                  <CardDescription>
                    Quality vs Price positioning of suppliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart data={supplierPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          type="number"
                          dataKey="quality"
                          name="Quality Score"
                          domain={[4, 5]}
                          stroke="#64748b"
                        />
                        <YAxis
                          type="number"
                          dataKey="price"
                          name="Price Score"
                          domain={[2.5, 4.5]}
                          stroke="#64748b"
                        />
                        <ChartTooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          content={<ChartTooltipContent />}
                        />
                        <Scatter dataKey="orders" fill="#8B5CF6" r={8} />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Revenue Trends
                    </CardTitle>
                    <CardDescription>
                      Monthly revenue and growth patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={fabricPerformanceData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                          />
                          <XAxis dataKey="name" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#F59E0B"
                            fill="url(#colorRevenue)"
                          />
                          <defs>
                            <linearGradient
                              id="colorRevenue"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#F59E0B"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#F59E0B"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-slate-800">
                      Conversion Funnel
                    </CardTitle>
                    <CardDescription>
                      User journey from view to reservation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-violet-50 rounded-lg">
                        <div className="flex items-center">
                          <Eye className="w-5 h-5 text-violet-600 mr-2" />
                          <span className="font-medium text-violet-800">
                            Fabric Views
                          </span>
                        </div>
                        <div className="text-xl font-bold text-violet-800">
                          12,450
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                        <div className="flex items-center">
                          <Activity className="w-5 h-5 text-cyan-600 mr-2" />
                          <span className="font-medium text-cyan-800">
                            Sample Requests
                          </span>
                        </div>
                        <div className="text-xl font-bold text-cyan-800">
                          2,450
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <ShoppingCart className="w-5 h-5 text-green-600 mr-2" />
                          <span className="font-medium text-green-800">
                            Reservations
                          </span>
                        </div>
                        <div className="text-xl font-bold text-green-800">
                          580
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                        <div className="text-sm text-amber-800">
                          <strong>Conversion Rate:</strong> 4.7% (View to
                          Reservation)
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Alerts and Notifications */}
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-red-800">
                          Low stock alert: Organic Cotton Canvas
                        </span>
                      </div>
                      <Badge variant="destructive">Critical</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                        <span className="text-amber-800">
                          Supplier delivery delay: Textile Co.
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-amber-300 text-amber-700"
                      >
                        Warning
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-blue-800">
                          New fabric samples received
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-blue-300 text-blue-700"
                      >
                        Info
                      </Badge>
                    </div>
                  </div>{" "}
                </CardContent>
              </Card>{" "}
            </TabsContent>
            {/* Code Editor Tab */}
            <TabsContent value="code-editor" className="space-y-6">
              <MonacoCodeEditor />
            </TabsContent>
            {/* Data Management Tab */}
            <TabsContent value="csv-entry" className="space-y-6">
              <CSVDataEntry />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboard;
