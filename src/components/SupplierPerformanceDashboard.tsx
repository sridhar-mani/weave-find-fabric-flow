import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileDown,
  Calendar,
  Star,
  Clock,
  ShieldCheck,
  FileText,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  Download,
  CircleDashed,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/PageHeader";

// Component to show trend indicator
const TrendIndicator = ({
  trend,
  value,
}: {
  trend: "up" | "down" | "neutral";
  value: number;
}) => {
  if (trend === "up") {
    return (
      <div className="flex items-center text-green-600">
        <ArrowUp className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">+{value}%</span>
      </div>
    );
  }
  if (trend === "down") {
    return (
      <div className="flex items-center text-red-600">
        <ArrowDown className="w-3 h-3 mr-1" />
        <span className="text-xs font-medium">-{value}%</span>
      </div>
    );
  }
  return (
    <div className="flex items-center text-slate-500">
      <CircleDashed className="w-3 h-3 mr-1" />
      <span className="text-xs font-medium">0%</span>
    </div>
  );
};

// Statistic card component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  period,
  variant = "default",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  period?: string;
  variant?: "default" | "good" | "warning" | "bad";
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "good":
        return "bg-green-50 border-green-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "bad":
        return "bg-red-50 border-red-100";
      default:
        return "bg-white";
    }
  };

  return (
    <Card className={`shadow-sm ${getVariantClass()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {trend && trendValue && (
              <div className="flex justify-end">
                <TrendIndicator trend={trend} value={trendValue} />
                {period && (
                  <span className="text-xs text-slate-400 ml-1">
                    vs {period}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Types for the component
interface PerformanceMetrics {
  overallScore: number;
  responseTime: {
    average: string;
    improvement: number;
  };
  fulfillmentRate: number;
  onTimeDelivery: number;
  qualityScore: number;
  returnRate: number;
  communicationScore: number;
  certificationCompliance: number;
}

interface OrderMetrics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  totalRevenue: number;
  orderGrowth: number;
}

interface InquiryMetrics {
  totalInquiries: number;
  responseRate: number;
  averageResponseTime: string;
  conversionRate: number;
}

interface SupplierPerformanceDashboardProps {
  performanceMetrics: PerformanceMetrics;
  orderMetrics: OrderMetrics;
  inquiryMetrics: InquiryMetrics;
}

const SupplierPerformanceDashboard: React.FC<
  SupplierPerformanceDashboardProps
> = ({ performanceMetrics, orderMetrics, inquiryMetrics }) => {
  const [timeframe, setTimeframe] = useState<string>("3m");

  // Derive trends and variants for stats
  // These would normally be calculated from historical data
  const getPerformanceVariant = (score: number) => {
    if (score >= 90) return "good";
    if (score >= 70) return "default";
    if (score >= 50) return "warning";
    return "bad";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Supplier Performance Dashboard
          </h2>
          <p className="text-slate-500">
            Track your performance metrics and business analytics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <FileDown className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">
                Overall Supplier Score
              </h3>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-3xl font-bold">
                  {performanceMetrics.overallScore}/100
                </span>
                <Badge
                  variant="outline"
                  className={`ml-2 ${
                    performanceMetrics.overallScore >= 80
                      ? "bg-green-50 text-green-700 border-green-200"
                      : performanceMetrics.overallScore >= 60
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {performanceMetrics.overallScore >= 80
                    ? "Excellent"
                    : performanceMetrics.overallScore >= 60
                    ? "Good"
                    : "Needs Improvement"}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">
                  Fulfillment Rate
                </div>
                <div className="text-lg font-semibold">
                  {performanceMetrics.fulfillmentRate}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">
                  On-Time Delivery
                </div>
                <div className="text-lg font-semibold">
                  {performanceMetrics.onTimeDelivery}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Quality Score</div>
                <div className="text-lg font-semibold">
                  {performanceMetrics.qualityScore}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-500 mb-1">Response Time</div>
                <div className="text-lg font-semibold">
                  {performanceMetrics.responseTime.average}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Quality Score"
              value={`${performanceMetrics.qualityScore}%`}
              icon={Star}
              trend="up"
              trendValue={2.4}
              period="last period"
              variant={getPerformanceVariant(performanceMetrics.qualityScore)}
            />
            <StatCard
              title="On-Time Delivery"
              value={`${performanceMetrics.onTimeDelivery}%`}
              icon={Truck}
              trend={performanceMetrics.onTimeDelivery > 85 ? "up" : "down"}
              trendValue={performanceMetrics.onTimeDelivery > 85 ? 3.1 : 1.8}
              period="last period"
              variant={getPerformanceVariant(performanceMetrics.onTimeDelivery)}
            />
            <StatCard
              title="Response Time"
              value={performanceMetrics.responseTime.average}
              icon={Clock}
              trend="down"
              trendValue={performanceMetrics.responseTime.improvement}
              period="last period"
              variant="good"
            />
            <StatCard
              title="Return Rate"
              value={`${performanceMetrics.returnRate}%`}
              icon={AlertCircle}
              trend={performanceMetrics.returnRate < 5 ? "down" : "up"}
              trendValue={performanceMetrics.returnRate < 5 ? 0.8 : 1.2}
              period="last period"
              variant={performanceMetrics.returnRate < 5 ? "good" : "warning"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Communication Score</CardTitle>
                <CardDescription>
                  Based on buyer feedback and response metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Overall: {performanceMetrics.communicationScore}%
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          performanceMetrics.communicationScore >= 80
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {performanceMetrics.communicationScore >= 80
                          ? "Excellent"
                          : "Good"}
                      </span>
                    </div>
                    <Progress
                      value={performanceMetrics.communicationScore}
                      className="h-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">
                        Response Rate
                      </div>
                      <div className="text-lg font-medium">96%</div>
                      <Progress value={96} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">
                        Query Resolution
                      </div>
                      <div className="text-lg font-medium">92%</div>
                      <Progress value={92} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">
                        Clear Information
                      </div>
                      <div className="text-lg font-medium">88%</div>
                      <Progress value={88} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">
                        Follow-up Quality
                      </div>
                      <div className="text-lg font-medium">90%</div>
                      <Progress value={90} className="h-1 mt-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Certification Compliance
                </CardTitle>
                <CardDescription>
                  Status of your certifications and documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        Overall: {performanceMetrics.certificationCompliance}%
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          performanceMetrics.certificationCompliance >= 80
                            ? "text-green-600"
                            : "text-amber-600"
                        }`}
                      >
                        {performanceMetrics.certificationCompliance >= 80
                          ? "Compliant"
                          : "Needs Attention"}
                      </span>
                    </div>
                    <Progress
                      value={performanceMetrics.certificationCompliance}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">GOTS Certification</span>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-sm">OEKO-TEX Standard 100</span>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShieldCheck className="w-4 h-4 text-amber-500 mr-2" />
                        <span className="text-sm">
                          Fair Trade Certification
                        </span>
                      </div>
                      <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                        Renewal Needed
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <ShieldCheck className="w-4 h-4 text-slate-300 mr-2" />
                        <span className="text-sm">ISO 14001</span>
                      </div>
                      <Badge variant="outline">Not Applied</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Orders"
              value={orderMetrics.totalOrders}
              icon={FileText}
              trend="up"
              trendValue={orderMetrics.orderGrowth}
              period="last period"
            />
            <StatCard
              title="Pending Orders"
              value={orderMetrics.pendingOrders}
              icon={CircleDashed}
              trend={orderMetrics.pendingOrders > 10 ? "up" : "down"}
              trendValue={orderMetrics.pendingOrders > 10 ? 15 : 5}
              period="last period"
            />
            <StatCard
              title="Completed Orders"
              value={orderMetrics.completedOrders}
              icon={CheckCircle}
              trend="up"
              trendValue={12}
              period="last period"
            />
            <StatCard
              title="Average Order Value"
              value={`$${orderMetrics.averageOrderValue.toLocaleString()}`}
              icon={BarChart3}
              trend="up"
              trendValue={8.3}
              period="last period"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Order Status Distribution
                </CardTitle>
                <CardDescription>
                  Current distribution of order statuses
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                        <span className="text-sm">In Production (45%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-violet-500 rounded-full"></div>
                        <span className="text-sm">Shipped (30%)</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Processing (15%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Delivered (10%)</span>
                      </div>
                    </div>
                    <div className="h-6 mt-3 flex rounded-full overflow-hidden">
                      <div
                        className="bg-blue-500 h-full"
                        style={{ width: "15%" }}
                      ></div>
                      <div
                        className="bg-indigo-500 h-full"
                        style={{ width: "45%" }}
                      ></div>
                      <div
                        className="bg-violet-500 h-full"
                        style={{ width: "30%" }}
                      ></div>
                      <div
                        className="bg-green-500 h-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Revenue Overview</CardTitle>
                <CardDescription>
                  Total revenue: ${orderMetrics.totalRevenue.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-500">
                        Monthly Trend
                      </div>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">Increasing</span>
                        <span className="text-green-600 text-sm ml-2">
                          +12.4%
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Revenue Report
                    </Button>
                  </div>

                  <div>
                    <div className="text-sm text-slate-500 mb-1">
                      Target: $
                      {(orderMetrics.totalRevenue * 1.2).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Progress
                        value={
                          (orderMetrics.totalRevenue /
                            (orderMetrics.totalRevenue * 1.2)) *
                          100
                        }
                        className="h-2 flex-1"
                      />
                      <span className="text-sm ml-2">
                        {Math.round(
                          (orderMetrics.totalRevenue /
                            (orderMetrics.totalRevenue * 1.2)) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="Total Inquiries"
              value={inquiryMetrics.totalInquiries}
              icon={MessageSquare}
              trend="up"
              trendValue={14.5}
              period="last period"
            />
            <StatCard
              title="Response Rate"
              value={`${inquiryMetrics.responseRate}%`}
              icon={CheckCircle}
              trend={inquiryMetrics.responseRate > 90 ? "up" : "down"}
              trendValue={inquiryMetrics.responseRate > 90 ? 3.2 : 1.8}
              period="last period"
              variant={inquiryMetrics.responseRate > 90 ? "good" : "warning"}
            />
            <StatCard
              title="Avg. Response Time"
              value={inquiryMetrics.averageResponseTime}
              icon={Clock}
              trend="down"
              trendValue={15}
              period="last period"
              variant="good"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Inquiry-to-Order Conversion
              </CardTitle>
              <CardDescription>
                Conversion rate: {inquiryMetrics.conversionRate}%
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div
                    className="h-10 rounded-l-md bg-blue-100 flex items-center justify-center px-3 text-blue-700 font-medium"
                    style={{ width: "100%" }}
                  >
                    100% Inquiries Received
                  </div>
                </div>
                <div className="flex items-center">
                  <div
                    className="h-10 rounded-l-md bg-indigo-500 flex items-center justify-center px-3 text-white font-medium"
                    style={{ width: `${inquiryMetrics.responseRate}%` }}
                  >
                    {inquiryMetrics.responseRate}% Responded
                  </div>
                  <div className="h-10 bg-slate-100 flex-1"></div>
                </div>
                <div className="flex items-center">
                  <div
                    className="h-10 rounded-l-md bg-violet-600 flex items-center justify-center px-3 text-white font-medium"
                    style={{ width: `${inquiryMetrics.conversionRate}%` }}
                  >
                    {inquiryMetrics.conversionRate}% Converted to Orders
                  </div>
                  <div className="h-10 bg-slate-100 flex-1"></div>
                </div>
                <div className="pt-2">
                  <div className="text-sm text-slate-500 mb-2">
                    Improvement Opportunities:
                  </div>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5 mt-0.5" />
                      <span>Improve response time to high-value inquiries</span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5 mt-0.5" />
                      <span>
                        Add more detailed pricing information to responses
                      </span>
                    </li>
                    <li className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-1.5 mt-0.5" />
                      <span>
                        Follow up with customers who received quotes but didn't
                        order
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
  );
};

export default SupplierPerformanceDashboard;
