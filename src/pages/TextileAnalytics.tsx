import { useState, useEffect } from "react";
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
  Heart,
  Package,
  TrendingUp,
  Activity,
  Leaf,
  Target,
  Award,
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
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";

const chartConfig = {
  views: { label: "Views", color: "#8B5CF6" },
  collections: { label: "Collections", color: "#06B6D4" },
  samples: { label: "Samples", color: "#10B981" },
  value: { label: "Value", color: "#F59E0B" },
};

// User textile activity data
const myTextileActivity = [
  { month: "Jan", views: 45, collections: 8, samples: 3 },
  { month: "Feb", views: 52, collections: 12, samples: 5 },
  { month: "Mar", views: 38, collections: 6, samples: 2 },
  { month: "Apr", views: 67, collections: 15, samples: 8 },
  { month: "May", views: 73, collections: 18, samples: 12 },
  { month: "Jun", views: 62, collections: 14, samples: 9 },
];

const materialPreferences = [
  { name: "Natural Fibers", value: 35, color: "#8B5CF6" },
  { name: "Synthetics", value: 28, color: "#06B6D4" },
  { name: "Blends", value: 22, color: "#10B981" },
  { name: "Specialty", value: 15, color: "#F59E0B" },
];

const trendingMaterials = [
  { name: "Organic Cotton", interest: 95, sustainability: "Excellent" },
  { name: "Recycled Polyester", interest: 87, sustainability: "Very Good" },
  { name: "Tencel", interest: 82, sustainability: "Excellent" },
  { name: "Hemp Blends", interest: 76, sustainability: "Outstanding" },
  { name: "Linen", interest: 71, sustainability: "Good" },
];

const TextileAnalytics = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 pt-24 pb-12">
      <div className="container mx-auto px-6 space-y-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-stone-800 mb-2">
            My Textile Insights
          </h1>
          <p className="text-stone-600">
            Discover your material exploration patterns and industry trends
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                Materials Explored
              </CardTitle>
              <Eye className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-800">247</div>
              <p className="text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +12% this month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                My Collections
              </CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-800">23</div>
              <p className="text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +3 new collections
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                Sample Requests
              </CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-800">18</div>
              <p className="text-xs text-amber-600">
                <Activity className="w-3 h-3 inline mr-1" />5 pending delivery
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-stone-600">
                Sustainability Score
              </CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-800">8.4</div>
              <p className="text-xs text-emerald-600">
                <Award className="w-3 h-3 inline mr-1" />
                Eco-conscious explorer
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="activity" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm p-2 h-12 rounded-lg">
            <TabsTrigger value="activity">My Activity</TabsTrigger>
            <TabsTrigger value="trends">Material Trends</TabsTrigger>
            <TabsTrigger value="preferences">My Preferences</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
                <CardHeader>
                  <CardTitle className="text-stone-800">
                    Monthly Activity
                  </CardTitle>
                  <CardDescription>
                    Your material exploration journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={myTextileActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="views"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="collections"
                          stroke="#06B6D4"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="samples"
                          stroke="#10B981"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
                <CardHeader>
                  <CardTitle className="text-stone-800">
                    Material Preferences
                  </CardTitle>
                  <CardDescription>
                    Your favorite fabric categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={materialPreferences}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {materialPreferences.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800">
                  Trending Materials
                </CardTitle>
                <CardDescription>
                  Popular materials in the textile industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingMaterials.map((material, index) => (
                    <div
                      key={material.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-stone-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl font-bold text-stone-400">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-stone-800">
                            {material.name}
                          </p>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800"
                          >
                            {material.sustainability}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32">
                          <Progress value={material.interest} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-stone-600">
                          {material.interest}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
                <CardHeader>
                  <CardTitle className="text-stone-800">
                    Favorite Categories
                  </CardTitle>
                  <CardDescription>
                    Your most explored material types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">
                        Natural Fibers
                      </span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">Synthetics</span>
                      <span className="text-sm font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">Blends</span>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
                <CardHeader>
                  <CardTitle className="text-stone-800">
                    Price Range Preference
                  </CardTitle>
                  <CardDescription>
                    Your typical material budget range
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">
                        Budget ($10-30/meter)
                      </span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">
                        Mid-range ($30-60/meter)
                      </span>
                      <span className="text-sm font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-stone-600">
                        Premium ($60+/meter)
                      </span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sustainability Tab */}
          <TabsContent value="sustainability" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-stone-200">
              <CardHeader>
                <CardTitle className="text-stone-800">
                  Your Sustainability Impact
                </CardTitle>
                <CardDescription>
                  Track your eco-friendly material choices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-800">78%</p>
                    <p className="text-sm text-green-600">
                      Sustainable Materials
                    </p>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <Activity className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-800">12</p>
                    <p className="text-sm text-blue-600">Certified Suppliers</p>
                  </div>
                  <div className="text-center p-6 bg-amber-50 rounded-lg">
                    <Award className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-800">Gold</p>
                    <p className="text-sm text-amber-600">Eco Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TextileAnalytics;
