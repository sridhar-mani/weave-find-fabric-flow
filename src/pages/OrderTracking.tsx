import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Truck,
  Calendar,
  Clock,
  Building2,
  FileText,
  MapPin,
  CheckCircle2,
  AlertCircle,
  LucideIcon,
  CheckCircle,
  Timer,
  AlertTriangle,
  Clipboard,
  Download,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import ProductionTracking from "@/components/ProductionTracking";
import { cn } from "@/lib/utils";

// Define order interface
interface Order {
  id: string;
  poNumber: string;
  materialName: string;
  supplier: {
    id: string;
    name: string;
    location: string;
  };
  quantity: number;
  unit: string;
  totalAmount: number;
  currency: string;
  status:
    | "processing"
    | "shipped"
    | "in-transit"
    | "delivered"
    | "delayed"
    | "cancelled";
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  trackingNumber?: string;
  shippingMethod?: string;
  lastUpdate: string;
  invoiceNumber?: string;
}

// Define status configuration for visual display
interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: LucideIcon;
  description: string;
}

const statusConfig: Record<Order["status"], StatusConfig> = {
  processing: {
    label: "Processing",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: Timer,
    description: "Order is being processed by the supplier",
  },
  shipped: {
    label: "Shipped",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    icon: Package,
    description: "Order has been shipped and is on its way",
  },
  "in-transit": {
    label: "In Transit",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    icon: Truck,
    description: "Order is currently in transit",
  },
  delivered: {
    label: "Delivered",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: CheckCircle,
    description: "Order has been delivered successfully",
  },
  delayed: {
    label: "Delayed",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    icon: AlertTriangle,
    description: "Order is experiencing delays",
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: AlertCircle,
    description: "Order has been cancelled",
  },
};

// Mock timeline event types
type TimelineEventType =
  | "order_placed"
  | "payment_confirmed"
  | "processing"
  | "quality_check"
  | "shipped"
  | "in_transit"
  | "customs_clearance"
  | "out_for_delivery"
  | "delivered"
  | "issue_reported"
  | "delay_reported";

// Timeline event interface
interface TimelineEvent {
  id: string;
  orderId: string;
  type: TimelineEventType;
  timestamp: string;
  description: string;
  location?: string;
  agent?: string;
  note?: string;
}

const OrderTracking = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const { toast } = useToast();

  // Mock order data
  const mockOrders: Order[] = [
    {
      id: "ORD-27893",
      poNumber: "PO-92175",
      materialName: "Organic Cotton Canvas",
      supplier: {
        id: "supplier-1",
        name: "EcoTextile Mills",
        location: "Gujarat, India",
      },
      quantity: 500,
      unit: "meters",
      totalAmount: 4375.0,
      currency: "USD",
      status: "in-transit",
      orderDate: "2025-05-15T12:00:00Z",
      estimatedDelivery: "2025-06-20T12:00:00Z",
      trackingNumber: "SHIP-782910-ET",
      shippingMethod: "Sea Freight",
      lastUpdate: "2025-06-01T14:30:00Z",
      invoiceNumber: "INV-5782",
    },
    {
      id: "ORD-27894",
      poNumber: "PO-92176",
      materialName: "Merino Wool Jersey",
      supplier: {
        id: "supplier-2",
        name: "Milano Fabrics",
        location: "Milan, Italy",
      },
      quantity: 200,
      unit: "meters",
      totalAmount: 4500.0,
      currency: "EUR",
      status: "processing",
      orderDate: "2025-06-01T12:00:00Z",
      estimatedDelivery: "2025-06-30T12:00:00Z",
      lastUpdate: "2025-06-05T09:15:00Z",
    },
    {
      id: "ORD-27895",
      poNumber: "PO-92177",
      materialName: "Recycled Polyester Twill",
      supplier: {
        id: "supplier-4",
        name: "EcoSynth Textiles",
        location: "Taiwan",
      },
      quantity: 350,
      unit: "meters",
      totalAmount: 3937.5,
      currency: "USD",
      status: "delivered",
      orderDate: "2025-04-10T12:00:00Z",
      estimatedDelivery: "2025-05-15T12:00:00Z",
      actualDelivery: "2025-05-12T14:20:00Z",
      trackingNumber: "SHIP-651283-ES",
      shippingMethod: "Air Freight",
      lastUpdate: "2025-05-12T14:20:00Z",
      invoiceNumber: "INV-5610",
    },
    {
      id: "ORD-27896",
      poNumber: "PO-92178",
      materialName: "Sustainable Bamboo Silk Blend",
      supplier: {
        id: "supplier-3",
        name: "Green Fiber Co.",
        location: "Shanghai, China",
      },
      quantity: 250,
      unit: "meters",
      totalAmount: 3562.5,
      currency: "USD",
      status: "delayed",
      orderDate: "2025-05-20T12:00:00Z",
      estimatedDelivery: "2025-06-15T12:00:00Z",
      trackingNumber: "SHIP-892734-GF",
      shippingMethod: "Sea Freight",
      lastUpdate: "2025-06-10T16:45:00Z",
    },
    {
      id: "ORD-27897",
      poNumber: "PO-92179",
      materialName: "YKK Waterproof Zipper (Black)",
      supplier: {
        id: "supplier-7",
        name: "YKK Group",
        location: "Japan",
      },
      quantity: 1000,
      unit: "pieces",
      totalAmount: 1450.0,
      currency: "USD",
      status: "shipped",
      orderDate: "2025-05-28T12:00:00Z",
      estimatedDelivery: "2025-06-18T12:00:00Z",
      trackingNumber: "SHIP-102938-YK",
      shippingMethod: "Air Freight",
      lastUpdate: "2025-06-05T08:30:00Z",
      invoiceNumber: "INV-5721",
    },
  ];

  // Filter orders based on search, status, and tab
  const filteredOrders = mockOrders.filter((order) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.materialName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    // Filter by tab
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" &&
        ["processing", "shipped", "in-transit", "delayed"].includes(
          order.status
        )) ||
      (activeTab === "completed" && order.status === "delivered") ||
      (activeTab === "cancelled" && order.status === "cancelled");

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Generate mock timeline events for the selected order
  const generateTimelineEvents = (order: Order): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        id: `event-${order.id}-1`,
        orderId: order.id,
        type: "order_placed",
        timestamp: order.orderDate,
        description: "Order placed and confirmed",
        agent: "System",
      },
      {
        id: `event-${order.id}-2`,
        orderId: order.id,
        type: "payment_confirmed",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24
        ).toISOString(),
        description: "Payment confirmed",
        agent: "Finance Department",
      },
    ];

    // Add status-specific events
    if (
      ["processing", "shipped", "in-transit", "delivered", "delayed"].includes(
        order.status
      )
    ) {
      events.push({
        id: `event-${order.id}-3`,
        orderId: order.id,
        type: "processing",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 3
        ).toISOString(),
        description: "Order is being processed by the supplier",
        location: order.supplier.location,
        agent: order.supplier.name,
      });
    }

    if (
      ["shipped", "in-transit", "delivered", "delayed"].includes(order.status)
    ) {
      events.push({
        id: `event-${order.id}-4`,
        orderId: order.id,
        type: "quality_check",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 5
        ).toISOString(),
        description: "Quality check completed",
        location: order.supplier.location,
        agent: "QA Team",
      });

      events.push({
        id: `event-${order.id}-5`,
        orderId: order.id,
        type: "shipped",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 7
        ).toISOString(),
        description: `Order shipped via ${order.shippingMethod}`,
        location: order.supplier.location,
        agent: order.supplier.name,
        note: order.trackingNumber
          ? `Tracking number: ${order.trackingNumber}`
          : undefined,
      });
    }

    if (["in-transit", "delivered", "delayed"].includes(order.status)) {
      events.push({
        id: `event-${order.id}-6`,
        orderId: order.id,
        type: "in_transit",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 10
        ).toISOString(),
        description: "Order in transit",
        location: "International Shipping",
        agent: order.shippingMethod,
      });
    }

    if (order.status === "delayed") {
      events.push({
        id: `event-${order.id}-7`,
        orderId: order.id,
        type: "delay_reported",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 15
        ).toISOString(),
        description: "Shipping delay reported",
        location: "Transit Hub",
        agent: "Logistics Provider",
        note: "Weather conditions affecting shipping routes",
      });
    }

    if (order.status === "delivered") {
      events.push({
        id: `event-${order.id}-7`,
        orderId: order.id,
        type: "customs_clearance",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 15
        ).toISOString(),
        description: "Cleared customs",
        location: "Destination Port",
        agent: "Customs Authority",
      });

      events.push({
        id: `event-${order.id}-8`,
        orderId: order.id,
        type: "out_for_delivery",
        timestamp: new Date(
          new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 18
        ).toISOString(),
        description: "Out for delivery",
        location: "Local Distribution Center",
        agent: "Delivery Service",
      });

      events.push({
        id: `event-${order.id}-9`,
        orderId: order.id,
        type: "delivered",
        timestamp:
          order.actualDelivery ||
          new Date(
            new Date(order.orderDate).getTime() + 1000 * 60 * 60 * 24 * 20
          ).toISOString(),
        description: "Order delivered",
        location: "Destination",
        agent: "Receiving Department",
      });
    }

    return events.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };

  // Handle view order details
  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTimelineEvents(generateTimelineEvents(order));
    setShowOrderDetails(true);
  };

  // Copy tracking number to clipboard
  const copyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    toast({
      title: "Tracking number copied",
      description: "The tracking number has been copied to your clipboard.",
    });
  };

  return (
    <div>
      {" "}
      <PageHeader
        title="Order Tracking"
        description="Track and manage your material orders"
        breadcrumbs={[{ label: "Order Tracking", path: "/orders" }]}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/quotes">
                <FileText className="w-4 h-4 mr-2" />
                Quote Requests
              </Link>
            </Button>
            <Button asChild>
              <Link to="/materials">
                <Package className="w-4 h-4 mr-2" />
                Materials
              </Link>
            </Button>
          </div>
        }
      />
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search by order ID, PO number, material name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>
                  {statusFilter === "all"
                    ? "All Statuses"
                    : statusConfig[statusFilter as Order["status"]].label}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <config.icon className={`w-4 h-4 ${config.color}`} />
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Order Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Orders Table */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">
                  <div className="flex items-center">
                    Order ID
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end">
                    Amount
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-semibold">{order.id}</span>
                        <span className="text-xs text-slate-500">
                          {order.poNumber}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {order.materialName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>{order.supplier.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.quantity} {order.unit}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-normal",
                          statusConfig[order.status].bgColor,
                          statusConfig[order.status].color
                        )}
                      >
                        {React.createElement(statusConfig[order.status].icon, {
                          className: "w-3 h-3 mr-1",
                        })}
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {format(
                            parseISO(order.estimatedDelivery),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {order.currency}{" "}
                      {order.totalAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrderDetails(order)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <Package className="w-12 h-12 text-slate-300 mb-3" />
                      <h3 className="text-lg font-medium text-slate-700 mb-1">
                        No orders found
                      </h3>
                      <p className="mb-4 text-slate-500">
                        {searchQuery || statusFilter !== "all"
                          ? "Try changing your search or filter criteria"
                          : "You haven't placed any orders yet"}
                      </p>
                      <Link to="/materials">
                        <Button>Browse Materials</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Order Details {selectedOrder?.id}</span>
              <Badge
                className={cn(
                  "font-normal",
                  selectedOrder
                    ? statusConfig[selectedOrder.status].bgColor
                    : "",
                  selectedOrder ? statusConfig[selectedOrder.status].color : ""
                )}
              >
                {selectedOrder && (
                  <>
                    {React.createElement(
                      statusConfig[selectedOrder.status].icon,
                      { className: "w-3 h-3 mr-1" }
                    )}
                    {statusConfig[selectedOrder.status].label}
                  </>
                )}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.materialName} from {selectedOrder?.supplier.name}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Order Information */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Order Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-slate-500">PO Number</div>
                      <div className="font-medium">
                        {selectedOrder.poNumber}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Invoice Number</div>
                      <div className="font-medium">
                        {selectedOrder.invoiceNumber || "Pending"}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Order Date</div>
                      <div className="font-medium">
                        {format(
                          parseISO(selectedOrder.orderDate),
                          "MMMM d, yyyy"
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Last Updated</div>
                      <div className="font-medium">
                        {format(
                          parseISO(selectedOrder.lastUpdate),
                          "MMMM d, yyyy h:mm a"
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Quantity</div>
                      <div className="font-medium">
                        {selectedOrder.quantity} {selectedOrder.unit}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Total Amount</div>
                      <div className="font-medium">
                        {selectedOrder.currency}{" "}
                        {selectedOrder.totalAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-slate-500">Estimated Delivery</div>
                      <div className="font-medium">
                        {format(
                          parseISO(selectedOrder.estimatedDelivery),
                          "MMMM d, yyyy"
                        )}
                      </div>
                    </div>
                    {selectedOrder.actualDelivery && (
                      <div className="space-y-1">
                        <div className="text-slate-500">Actual Delivery</div>
                        <div className="font-medium">
                          {format(
                            parseISO(selectedOrder.actualDelivery),
                            "MMMM d, yyyy"
                          )}
                        </div>
                      </div>
                    )}
                    <div className="space-y-1 col-span-2">
                      <div className="text-slate-500">Shipping Method</div>
                      <div className="font-medium">
                        {selectedOrder.shippingMethod || "To be determined"}
                      </div>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="space-y-1 col-span-2">
                        <div className="text-slate-500">Tracking Number</div>
                        <div className="font-medium flex items-center">
                          {selectedOrder.trackingNumber}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-6 px-2"
                            onClick={() =>
                              copyTrackingNumber(selectedOrder.trackingNumber!)
                            }
                          >
                            <Clipboard className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>{" "}
                </Card>

                {/* Order Timeline */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {timelineEvents.map((event, index) => (
                        <div key={event.id} className="relative pl-6">
                          {/* Timeline connector */}
                          {index < timelineEvents.length - 1 && (
                            <div className="absolute top-6 bottom-0 left-[10px] w-px bg-slate-200"></div>
                          )}

                          {/* Event dot */}
                          <div className="absolute top-1 left-0 w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          </div>

                          {/* Event content */}
                          <div className="pb-4">
                            <div className="text-sm text-slate-500">
                              {format(
                                parseISO(event.timestamp),
                                "MMM d, yyyy h:mm a"
                              )}
                            </div>
                            <div className="text-base font-medium mt-1">
                              {event.description}
                            </div>
                            {(event.location || event.agent) && (
                              <div className="text-sm text-slate-600 mt-1">
                                {event.location && (
                                  <span className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {event.location}
                                  </span>
                                )}
                                {event.agent && (
                                  <span className="flex items-center mt-1">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    {event.agent}
                                  </span>
                                )}
                              </div>
                            )}
                            {event.note && (
                              <div className="text-sm italic text-slate-500 mt-1">
                                Note: {event.note}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Production Tracking */}
                {selectedOrder && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Production Tracking
                      </CardTitle>
                      <CardDescription>
                        Real-time manufacturing and production status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {" "}
                      <ProductionTracking
                        productionOrder={{
                          id: selectedOrder.id,
                          poNumber: selectedOrder.poNumber,
                          title: selectedOrder.materialName,
                          orderDate: selectedOrder.orderDate,
                          targetDate: selectedOrder.estimatedDelivery,
                          estimatedCompletionDate:
                            selectedOrder.estimatedDelivery,
                          status: "in_production", // Default status
                          progress: 60, // Default progress
                          customer: {
                            id: "customer-1",
                            name: "Your Company",
                            company: "Your Company Ltd.",
                          },
                          material: {
                            id: "material-1",
                            name: selectedOrder.materialName,
                            category: "Fabric",
                          },
                          quantity: selectedOrder.quantity,
                          unit: selectedOrder.unit,
                          phases: [],
                          qualityChecks: [],
                          milestones: [],
                          lastUpdate: selectedOrder.lastUpdate,
                        }}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Supplier Information and Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Supplier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {selectedOrder.supplier.name}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {selectedOrder.supplier.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link to={`/suppliers/${selectedOrder.supplier.id}`}>
                        <Button className="w-full" variant="outline" size="sm">
                          <Building2 className="w-4 h-4 mr-2" />
                          View Supplier Profile
                        </Button>
                      </Link>
                      <Link
                        to={`/messages?supplier=${selectedOrder.supplier.id}`}
                      >
                        <Button className="w-full" variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Supplier
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Order Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full"
                      variant="secondary"
                      onClick={() => {
                        setShowOrderDetails(false);
                        toast({
                          title: "Order documents downloaded",
                          description:
                            "All documents have been downloaded to your device.",
                        });
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Documents
                    </Button>

                    {selectedOrder.status === "processing" && (
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => {
                          setShowOrderDetails(false);
                          toast({
                            title: "Cancellation request sent",
                            description:
                              "Your cancellation request has been sent to the supplier.",
                          });
                        }}
                      >
                        Request Cancellation
                      </Button>
                    )}

                    {["delayed", "in-transit"].includes(
                      selectedOrder.status
                    ) && (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          setShowOrderDetails(false);
                          toast({
                            title: "Tracking update requested",
                            description:
                              "We've sent a request for the latest tracking information.",
                          });
                        }}
                      >
                        <Truck className="w-4 h-4 mr-2" />
                        Request Tracking Update
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTracking;
