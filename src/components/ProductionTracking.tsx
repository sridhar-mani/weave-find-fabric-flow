import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  FileText,
  Package,
  Factory,
  Truck,
  Timer,
  Clipboard,
  Loader,
  MoreHorizontal,
  Download,
  ChevronDown,
  CalendarDays,
  FileClock,
  MessageSquare,
  Eye,
  Users,
  Scale,
} from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";

// Types
export interface ProductionPhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "not_started" | "in_progress" | "completed" | "delayed" | "issue";
  completion: number;
  owner?: string;
  notes?: string;
}

export interface QualityCheckResult {
  id: string;
  date: string;
  type: string;
  status: "passed" | "failed" | "pending";
  inspector: string;
  notes?: string;
  images?: string[];
}

export interface ProductionMilestone {
  id: string;
  title: string;
  date: string;
  isCompleted: boolean;
  description?: string;
}

export interface ProductionOrder {
  id: string;
  poNumber: string;
  title: string;
  orderDate: string;
  targetDate: string;
  estimatedCompletionDate: string;
  status:
    | "pre_production"
    | "in_production"
    | "quality_check"
    | "completed"
    | "delayed"
    | "cancelled";
  progress: number;
  customer: {
    id: string;
    name: string;
    company: string;
  };
  material: {
    id: string;
    name: string;
    category: string;
  };
  quantity: number;
  unit: string;
  phases: ProductionPhase[];
  qualityChecks: QualityCheckResult[];
  milestones: ProductionMilestone[];
  lastUpdate: string;
}

interface ProductionTrackingProps {
  productionOrder: ProductionOrder;
}

const ProductionTracking: React.FC<ProductionTrackingProps> = ({
  productionOrder,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [selectedQualityCheck, setSelectedQualityCheck] =
    useState<QualityCheckResult | null>(null);

  // Helper function to generate status badge
  const getStatusBadge = (status: ProductionOrder["status"]) => {
    switch (status) {
      case "pre_production":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pre-Production
          </Badge>
        );
      case "in_production":
        <Badge
          variant="outline"
          className="bg-indigo-50 text-indigo-700 border-indigo-200"
        >
          <Factory className="w-3 h-3 mr-1" />
          In Production
        </Badge>;
      case "quality_check":
        return (
          <Badge
            variant="outline"
            className="bg-violet-50 text-violet-700 border-violet-200"
          >
            <Clipboard className="w-3 h-3 mr-1" />
            Quality Check
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "delayed":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Delayed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  // Helper function to get phase status
  const getPhaseStatusBadge = (status: ProductionPhase["status"]) => {
    switch (status) {
      case "not_started":
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200"
          >
            Not Started
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "delayed":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Delayed
          </Badge>
        );
      case "issue":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Issue
          </Badge>
        );
      default:
        return null;
    }
  };

  // Function to show quality check details
  const handleViewQualityCheck = (check: QualityCheckResult) => {
    setSelectedQualityCheck(check);
    setShowQualityModal(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Factory className="h-5 w-5 text-primary" />
                Production Order #{productionOrder.poNumber}
              </CardTitle>
              <CardDescription>{productionOrder.title}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(productionOrder.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Production Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Production Manager
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="h-4 w-4 mr-2" />
                    View PO Details
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Customer</span>
              <span className="font-medium">
                {productionOrder.customer.name}
              </span>
              <span className="text-sm text-slate-500">
                {productionOrder.customer.company}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Material</span>
              <span className="font-medium">
                {productionOrder.material.name}
              </span>
              <span className="text-sm text-slate-500">
                {productionOrder.material.category}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Quantity</span>
              <span className="font-medium">
                {productionOrder.quantity} {productionOrder.unit}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">Target Completion</span>
              <span className="font-medium">
                {format(parseISO(productionOrder.targetDate), "MMM d, yyyy")}
              </span>
              <span className="text-sm text-slate-500">
                {formatDistanceToNow(parseISO(productionOrder.targetDate), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Loader className="w-4 h-4 text-primary animate-spin" />
                <span className="font-medium">Production Progress</span>
              </div>
              <span className="text-sm font-medium">
                {productionOrder.progress}%
              </span>
            </div>
            <Progress value={productionOrder.progress} className="h-2" />
          </div>

          <Tabs
            defaultValue={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="phases">Production Phases</TabsTrigger>
              <TabsTrigger value="quality">Quality Control</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-none border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                      Important Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">Order Date</dt>
                        <dd className="text-sm font-medium">
                          {format(
                            parseISO(productionOrder.orderDate),
                            "MMM d, yyyy"
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Production Start
                        </dt>
                        <dd className="text-sm font-medium">
                          {format(
                            parseISO(
                              productionOrder.phases[0]?.startDate ||
                                productionOrder.orderDate
                            ),
                            "MMM d, yyyy"
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Estimated Completion
                        </dt>
                        <dd className="text-sm font-medium">
                          {format(
                            parseISO(productionOrder.estimatedCompletionDate),
                            "MMM d, yyyy"
                          )}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Target Delivery
                        </dt>
                        <dd className="text-sm font-medium">
                          {format(
                            parseISO(productionOrder.targetDate),
                            "MMM d, yyyy"
                          )}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="shadow-none border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Clipboard className="w-4 h-4 mr-2 text-primary" />
                      Quality Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Tests Planned
                        </dt>
                        <dd className="text-sm font-medium">
                          {productionOrder.qualityChecks.length}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Tests Completed
                        </dt>
                        <dd className="text-sm font-medium">
                          {
                            productionOrder.qualityChecks.filter(
                              (qc) =>
                                qc.status === "passed" || qc.status === "failed"
                            ).length
                          }
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">Tests Passed</dt>
                        <dd className="text-sm font-medium">
                          {
                            productionOrder.qualityChecks.filter(
                              (qc) => qc.status === "passed"
                            ).length
                          }
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">Issues Found</dt>
                        <dd className="text-sm font-medium">
                          {
                            productionOrder.qualityChecks.filter(
                              (qc) => qc.status === "failed"
                            ).length
                          }
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="shadow-none border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Users className="w-4 h-4 mr-2 text-primary" />
                      Production Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Production Manager
                        </dt>
                        <dd className="text-sm font-medium">Sarah Johnson</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Quality Control
                        </dt>
                        <dd className="text-sm font-medium">David Chen</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Process Engineer
                        </dt>
                        <dd className="text-sm font-medium">Maria Rodriguez</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-slate-500">
                          Customer Contact
                        </dt>
                        <dd className="text-sm font-medium">Account Manager</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-none border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FileClock className="w-4 h-4 mr-2 text-primary" />
                    Upcoming Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {productionOrder.milestones
                      .sort(
                        (a, b) =>
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                      )
                      .map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                        >
                          <div className="flex items-start gap-2">
                            {milestone.isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 mt-0.5" />
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {milestone.title}
                              </div>
                              {milestone.description && (
                                <div className="text-xs text-slate-500">
                                  {milestone.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm">
                            {format(parseISO(milestone.date), "MMM d, yyyy")}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="phases" className="space-y-4">
              <div className="space-y-4">
                {productionOrder.phases.map((phase, index) => (
                  <Card key={phase.id} className="shadow-none border">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              phase.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : phase.status === "in_progress"
                                ? "bg-blue-100 text-blue-700"
                                : phase.status === "delayed" ||
                                  phase.status === "issue"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{phase.name}</h3>
                              {getPhaseStatusBadge(phase.status)}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                              <span>
                                {format(parseISO(phase.startDate), "MMM d")} -{" "}
                                {format(parseISO(phase.endDate), "MMM d, yyyy")}
                              </span>
                              {phase.owner && (
                                <span className="ml-2">
                                  • Managed by {phase.owner}
                                </span>
                              )}
                            </div>
                            {phase.notes && (
                              <div className="text-sm mt-1">{phase.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end md:w-1/4">
                          <div className="w-full flex items-center justify-between mb-1">
                            <span className="text-sm text-slate-500">
                              Progress
                            </span>
                            <span className="text-sm font-medium">
                              {phase.completion}%
                            </span>
                          </div>
                          <Progress
                            value={phase.completion}
                            className="h-2 w-full"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="bg-slate-50 rounded-md p-4 border">
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Quality Control Process</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      All fabric undergoes a 4-point inspection system to
                      evaluate defects, with quality control checks at multiple
                      stages of production. Our standard allows for no more than
                      25 points of defect per 100 square yards.
                    </p>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionOrder.qualityChecks.map((check) => (
                    <TableRow key={check.id}>
                      <TableCell className="font-medium">
                        {check.type}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(check.date), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{check.inspector}</TableCell>
                      <TableCell>
                        {check.status === "passed" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Passed
                          </Badge>
                        ) : check.status === "failed" ? (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 border-red-200"
                          >
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Failed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewQualityCheck(check)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-6 py-2">
                {/* Production timeline rendering would go here */}
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                  {/* Order placement */}
                  <div className="relative">
                    <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-green-100 flex items-center justify-center border-4 border-white">
                      <FileText className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="pl-4">
                      <div className="font-medium">Order Placed</div>
                      <div className="text-sm text-slate-500">
                        {format(
                          parseISO(productionOrder.orderDate),
                          "MMMM d, yyyy"
                        )}{" "}
                        at{" "}
                        {format(parseISO(productionOrder.orderDate), "h:mm a")}
                      </div>
                      <div className="text-sm mt-1">
                        Order #{productionOrder.poNumber} was placed and
                        confirmed.
                      </div>
                    </div>
                  </div>

                  {/* Pre-production */}
                  <div className="relative">
                    <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white">
                      <Clipboard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="pl-4">
                      <div className="font-medium">Pre-Production</div>
                      <div className="text-sm text-slate-500">
                        {format(
                          parseISO(
                            productionOrder.phases[0]?.startDate ||
                              productionOrder.orderDate
                          ),
                          "MMMM d, yyyy"
                        )}
                      </div>
                      <div className="text-sm mt-1">
                        Material requirements confirmed and production planning
                        completed.
                      </div>
                    </div>
                  </div>

                  {/* Production */}
                  <div className="relative">
                    <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white">
                      <Factory className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="pl-4">
                      <div className="font-medium">Production Started</div>
                      <div className="text-sm text-slate-500">
                        {format(
                          parseISO(
                            productionOrder.phases[1]?.startDate ||
                              productionOrder.orderDate
                          ),
                          "MMMM d, yyyy"
                        )}
                      </div>
                      <div className="text-sm mt-1">
                        Production of {productionOrder.quantity}{" "}
                        {productionOrder.unit} of{" "}
                        {productionOrder.material.name} started.
                      </div>
                    </div>
                  </div>

                  {/* Current Status Indicator */}
                  <div className="relative">
                    <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center border-4 border-white">
                      <Timer className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="pl-4">
                      <div className="font-medium">
                        Current Status:{" "}
                        {productionOrder.status
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </div>
                      <div className="text-sm text-slate-500">
                        Last updated{" "}
                        {formatDistanceToNow(
                          parseISO(productionOrder.lastUpdate),
                          { addSuffix: true }
                        )}
                      </div>
                      <div className="text-sm mt-1">
                        Production is {productionOrder.progress}% complete.{" "}
                        {productionOrder.status === "delayed" &&
                          "There are some delays in the production schedule."}
                      </div>
                    </div>
                  </div>

                  {/* Expected Completion */}
                  <div className="relative opacity-50">
                    <div className="absolute -left-[25px] h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white">
                      <Truck className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="pl-4">
                      <div className="font-medium">Expected Completion</div>
                      <div className="text-sm text-slate-500">
                        {format(
                          parseISO(productionOrder.estimatedCompletionDate),
                          "MMMM d, yyyy"
                        )}
                      </div>
                      <div className="text-sm mt-1">
                        Estimated completion and shipping date
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quality Check Details Modal */}
      <Dialog open={showQualityModal} onOpenChange={setShowQualityModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quality Check Details</DialogTitle>
            <DialogDescription>
              {selectedQualityCheck?.type} on{" "}
              {selectedQualityCheck?.date
                ? format(parseISO(selectedQualityCheck.date), "MMMM d, yyyy")
                : ""}
            </DialogDescription>
          </DialogHeader>

          {selectedQualityCheck && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status</span>
                {selectedQualityCheck.status === "passed" ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Passed
                  </Badge>
                ) : selectedQualityCheck.status === "failed" ? (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Failed
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div>
                <span className="text-sm text-slate-500">Inspector</span>
                <p>{selectedQualityCheck.inspector}</p>
              </div>

              {selectedQualityCheck.notes && (
                <div>
                  <span className="text-sm text-slate-500">Notes</span>
                  <p className="mt-1">{selectedQualityCheck.notes}</p>
                </div>
              )}

              {selectedQualityCheck.images &&
                selectedQualityCheck.images.length > 0 && (
                  <div>
                    <span className="text-sm text-slate-500">Images</span>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {selectedQualityCheck.images.map((img, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-slate-100 rounded-md overflow-hidden"
                        >
                          <img
                            src={img}
                            alt={`Quality check ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowQualityModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// This component is missing in the original code, adding a simple implementation
const Circle = ({ className }: { className?: string }) => {
  return (
    <div
      className={`rounded-full border-2 border-current ${className || ""}`}
    ></div>
  );
};

export default ProductionTracking;
