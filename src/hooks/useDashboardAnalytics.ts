import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { fabricTypes } from "@/data/fabricData";

interface DashboardMetrics {
  totalUsers: number;
  totalFabrics: number;
  monthlyRevenue: number;
  avgSessionTime: number;
  userGrowth: number;
  revenueGrowth: number;
  sessionGrowth: number;
}

interface FabricAnalytics {
  id: string;
  name: string;
  category: string;
  views: number;
  samples: number;
  reservations: number;
  revenue: number;
}

interface TrafficData {
  month: string;
  users: number;
  pageViews: number;
  fabricViews: number;
}

export function useDashboardAnalytics() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 0,
    totalFabrics: 0,
    monthlyRevenue: 0,
    avgSessionTime: 0,
    userGrowth: 0,
    revenueGrowth: 0,
    sessionGrowth: 0,
  });

  const [fabricAnalytics, setFabricAnalytics] = useState<FabricAnalytics[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Simulate API call - in real app this would fetch from your analytics backend
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Generate realistic metrics
        const baseUsers = 12000 + Math.floor(Math.random() * 2000);
        const baseFabrics =
          fabricTypes.length * 10 + Math.floor(Math.random() * 100);

        setMetrics({
          totalUsers: baseUsers,
          totalFabrics: baseFabrics,
          monthlyRevenue: 24592 + Math.floor(Math.random() * 5000),
          avgSessionTime: 4.8 + Math.random() * 2,
          userGrowth: 12.5 + Math.random() * 10 - 5,
          revenueGrowth: -3.1 + Math.random() * 10 - 5,
          sessionGrowth: 15.3 + Math.random() * 10 - 5,
        });

        // Generate fabric analytics based on actual fabric types
        const fabricAnalyticsData = fabricTypes
          .slice(0, 8)
          .map((fabric, index) => ({
            id: fabric.id,
            name: fabric.name,
            category: fabric.category,
            views: 1500 - index * 150 + Math.floor(Math.random() * 300),
            samples: 200 - index * 20 + Math.floor(Math.random() * 50),
            reservations: 50 - index * 5 + Math.floor(Math.random() * 15),
            revenue: 5000 - index * 500 + Math.floor(Math.random() * 1000),
          }));

        setFabricAnalytics(fabricAnalyticsData);

        // Generate traffic data for last 6 months
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const trafficAnalytics = months.map((month, index) => ({
          month,
          users: 1200 + index * 300 + Math.floor(Math.random() * 200),
          pageViews: 4500 + index * 1500 + Math.floor(Math.random() * 800),
          fabricViews: 2800 + index * 800 + Math.floor(Math.random() * 500),
        }));

        setTrafficData(trafficAnalytics);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load analytics:", error);
        setLoading(false);
      }
    };

    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const getTopFabrics = (limit: number = 5) => {
    return fabricAnalytics.sort((a, b) => b.views - a.views).slice(0, limit);
  };

  const getTotalRevenue = () => {
    return fabricAnalytics.reduce((sum, fabric) => sum + fabric.revenue, 0);
  };

  const getConversionRate = () => {
    const totalViews = fabricAnalytics.reduce(
      (sum, fabric) => sum + fabric.views,
      0
    );
    const totalReservations = fabricAnalytics.reduce(
      (sum, fabric) => sum + fabric.reservations,
      0
    );
    return totalViews > 0
      ? ((totalReservations / totalViews) * 100).toFixed(2)
      : "0";
  };

  const getCategoryDistribution = () => {
    const categoryMap = new Map();
    fabricAnalytics.forEach((fabric) => {
      const count = categoryMap.get(fabric.category) || 0;
      categoryMap.set(fabric.category, count + 1);
    });

    const total = fabricAnalytics.length;
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      name: category,
      count,
      value: Math.round((count / total) * 100),
      color: getCategoryColor(category),
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Natural Fiber": "#8B5CF6",
      "Luxury Fiber": "#06B6D4",
      Workwear: "#10B981",
      "Synthetic Fiber": "#F59E0B",
      Specialty: "#EF4444",
    };
    return colors[category as keyof typeof colors] || "#64748B";
  };

  return {
    metrics,
    fabricAnalytics,
    trafficData,
    loading,
    getTopFabrics,
    getTotalRevenue,
    getConversionRate,
    getCategoryDistribution,
  };
}
