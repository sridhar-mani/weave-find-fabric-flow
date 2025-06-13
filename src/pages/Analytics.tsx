import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  TrendingUp,
  Package,
  Users,
  BarChart3,
  Activity,
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAuth } from "@/hooks/useAuth";

// Advanced Analytics for Admin - Comprehensive business insights
const chartConfig = {
  views: { label: "Views", color: "#8B5CF6" },
  collections: { label: "Collections", color: "#06B6D4" },
  swatches: { label: "Swatches", color: "#10B981" },
  value: { label: "Value", color: "#F59E0B" },
};

// Admin analytics data
const businessMetrics = [
  { month: "Jan", revenue: 45000, orders: 120, customers: 89 },
  { month: "Feb", revenue: 52000, orders: 145, customers: 102 },
  { month: "Mar", revenue: 48000, orders: 132, customers: 95 },
  { month: "Apr", revenue: 67000, orders: 178, customers: 134 },
  { month: "May", revenue: 73000, orders: 198, customers: 156 },
  { month: "Jun", revenue: 82000, orders: 221, customers: 171 },
];

const supplierPerformance = [
  { name: "Premium Textiles", reliability: 95, quality: 88, cost: 72 },
  { name: "Global Fabrics", reliability: 88, quality: 92, cost: 85 },
  { name: "Eco Materials", reliability: 92, quality: 85, cost: 78 },
  { name: "Luxury Threads", reliability: 85, quality: 95, cost: 65 },
];

const categoryDistribution = [
  { name: "Natural Fibers", value: 35, color: "#8B5CF6" },
  { name: "Synthetics", value: 28, color: "#06B6D4" },
  { name: "Blends", value: 22, color: "#10B981" },
  { name: "Specialty", value: 15, color: "#F59E0B" },
];

const Analytics = () => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (user) {
      trackEvent("view_admin_analytics");
    }
  }, [user, trackEvent]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Page Content */}
        <div className="space-y-10">
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Business Insights Hub
            </h1>
            <p className="text-slate-600">
              Complete overview of your textile business performance and trends
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Monthly Revenue
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  $367K
                </div>
                <p className="text-sm text-emerald-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +23% from last quarter
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Active Customers
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  747
                </div>
                <p className="text-sm text-emerald-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% growth rate
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Fabric Orders
                </CardTitle>
                <Package className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  1,394
                </div>
                <p className="text-sm text-emerald-600 flex items-center">
                  <Activity className="w-4 h-4 mr-1" />
                  Processing 48 orders
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Supplier Rating
                </CardTitle>
                <Eye className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  4.7
                </div>
                <p className="text-sm text-emerald-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Above industry average
                </p>
              </CardContent>
            </Card>
          </motion.div>
          {/* Main Analytics Dashboard */}
          <Tabs defaultValue="business" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm p-2 h-12">
              <TabsTrigger value="business" className="text-sm font-medium">
                Business Overview
              </TabsTrigger>
              <TabsTrigger value="suppliers" className="text-sm font-medium">
                Supplier Network
              </TabsTrigger>
              <TabsTrigger value="inventory" className="text-sm font-medium">
                Material Stock
              </TabsTrigger>
              <TabsTrigger value="forecasting" className="text-sm font-medium">
                Market Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-slate-800">
                      Revenue Growth
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Monthly performance tracking for your textile business
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ChartContainer config={chartConfig} className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={businessMetrics}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#06B6D4"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
                <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-slate-800">
                      Material Categories
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Distribution of fabric types in your current orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <ChartContainer config={chartConfig} className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <Pie
                            data={categoryDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryDistribution.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>{" "}
              </div>
            </TabsContent>

            {/* Supplier Network Tab */}
            <TabsContent value="suppliers" className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl text-slate-800">
                    Supplier Performance Dashboard
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Monitor quality, reliability, and cost effectiveness of your
                    textile suppliers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-6">
                    {supplierPerformance.map((supplier, index) => (
                      <div
                        key={supplier.name}
                        className="p-6 rounded-lg bg-gradient-to-r from-slate-50 to-stone-50 border border-slate-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-slate-800">
                            {supplier.name}
                          </h4>
                          <Badge
                            variant={
                              supplier.reliability > 90
                                ? "default"
                                : "secondary"
                            }
                            className="text-sm px-3 py-1"
                          >
                            {supplier.reliability > 90 ? "Excellent" : "Good"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                          <div>
                            <p className="text-sm text-slate-600 mb-2 font-medium">
                              Reliability
                            </p>
                            <Progress
                              value={supplier.reliability}
                              className="h-3 mb-2"
                            />
                            <p className="text-sm text-slate-700 font-semibold">
                              {supplier.reliability}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 mb-2 font-medium">
                              Quality
                            </p>
                            <Progress
                              value={supplier.quality}
                              className="h-3 mb-2"
                            />
                            <p className="text-sm text-slate-700 font-semibold">
                              {supplier.quality}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 mb-2 font-medium">
                              Cost Efficiency
                            </p>
                            <Progress
                              value={supplier.cost}
                              className="h-3 mb-2"
                            />
                            <p className="text-sm text-slate-700 font-semibold">
                              {supplier.cost}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Material Stock Tab */}
            <TabsContent value="inventory" className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl text-slate-800">
                    Material Stock Management
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Current fabric inventory levels and movement patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                        <div className="text-3xl font-bold text-green-800 mb-2">
                          847
                        </div>
                        <p className="text-sm text-green-600 font-medium">
                          Materials In Stock
                        </p>
                      </div>
                      <div className="text-center p-6 bg-amber-50 rounded-xl border border-amber-200">
                        <div className="text-3xl font-bold text-amber-800 mb-2">
                          23
                        </div>
                        <p className="text-sm text-amber-600 font-medium">
                          Low Stock Items
                        </p>
                      </div>
                      <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
                        <div className="text-3xl font-bold text-red-800 mb-2">
                          5
                        </div>
                        <p className="text-sm text-red-600 font-medium">
                          Out of Stock
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Market Trends Tab */}
            <TabsContent value="forecasting" className="space-y-8">
              <Card className="bg-white/90 backdrop-blur-sm border-slate-200 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl text-slate-800">
                    Market Trends & Insights
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Predictive analytics and textile industry trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-800 mb-4">
                        Q3 2025 Market Predictions
                      </h4>{" "}
                      <ul className="space-y-3 text-sm text-blue-700">
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-3">•</span>
                          <span>
                            15% increase in sustainable material demand
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-3">•</span>
                          <span>Natural fiber prices expected to rise 8%</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-3">•</span>
                          <span>
                            New regulations may impact synthetic imports
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <h4 className="text-lg font-semibold text-green-800 mb-4">
                        Recommended Actions
                      </h4>{" "}
                      <ul className="space-y-3 text-sm text-green-700">
                        <li className="flex items-start">
                          <span className="text-green-500 mr-3">•</span>
                          <span>Increase organic cotton inventory by 25%</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-3">•</span>
                          <span>
                            Explore new sustainable supplier partnerships
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-500 mr-3">•</span>
                          <span>
                            Consider bulk purchasing before price increases
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
