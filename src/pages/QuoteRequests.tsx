import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText,
  Search,
  Filter,
  FileDown,
  MessageSquare,
  Package,
  Eye,
  AlertCircle,
  X,
  Check,
  Clock,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Download,
  Truck,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";

interface Quote {
  id: string;
  rfqId: string;
  title: string;
  supplier: {
    id: string;
    name: string;
    location: string;
  };
  material: {
    type: string;
    quantity: number;
    unit: string;
  };
  status: "pending" | "responded" | "accepted" | "rejected" | "expired";
  createdAt: string;
  targetDate: string;
  price?: {
    value: number;
    currency: string;
    perUnit: boolean;
  };
  notes?: string;
  lastUpdated: string;
  hasAttachments: boolean;
  hasUnreadMessages: boolean;
}

const QuoteRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();

  // Mock quote data for demonstration
  const mockQuotes: Quote[] = [
    {
      id: "quote-1",
      rfqId: "RFQ-67890",
      title: "Organic Cotton Canvas for Summer Collection",
      supplier: {
        id: "supplier-1",
        name: "EcoTextile Mills",
        location: "Gujarat, India",
      },
      material: {
        type: "cotton",
        quantity: 500,
        unit: "meters",
      },
      status: "responded",
      createdAt: "2025-06-01T10:30:00Z",
      targetDate: "2025-07-15T00:00:00Z",
      price: {
        value: 11.5,
        currency: "USD",
        perUnit: true,
      },
      notes:
        "Supplier can meet all requirements and offers a 5% discount for orders over 1000 meters.",
      lastUpdated: "2025-06-03T14:45:00Z",
      hasAttachments: true,
      hasUnreadMessages: true,
    },
    {
      id: "quote-2",
      rfqId: "RFQ-67891",
      title: "Merino Wool for Winter Outerwear",
      supplier: {
        id: "supplier-2",
        name: "Milano Fabrics",
        location: "Milan, Italy",
      },
      material: {
        type: "wool",
        quantity: 300,
        unit: "meters",
      },
      status: "pending",
      createdAt: "2025-06-05T09:15:00Z",
      targetDate: "2025-08-01T00:00:00Z",
      lastUpdated: "2025-06-05T09:15:00Z",
      hasAttachments: false,
      hasUnreadMessages: false,
    },
    {
      id: "quote-3",
      rfqId: "RFQ-67892",
      title: "Recycled Polyester for Eco Bags",
      supplier: {
        id: "supplier-3",
        name: "EcoSynth Textiles",
        location: "Taiwan",
      },
      material: {
        type: "polyester",
        quantity: 1000,
        unit: "meters",
      },
      status: "accepted",
      createdAt: "2025-05-28T11:20:00Z",
      targetDate: "2025-06-30T00:00:00Z",
      price: {
        value: 8.25,
        currency: "USD",
        perUnit: true,
      },
      notes:
        "Order confirmed and in production. Expected shipping date June 20th.",
      lastUpdated: "2025-05-30T16:45:00Z",
      hasAttachments: true,
      hasUnreadMessages: false,
    },
    {
      id: "quote-4",
      rfqId: "RFQ-67893",
      title: "Organic Linen for Resort Wear",
      supplier: {
        id: "supplier-4",
        name: "Baltic Flax",
        location: "Lithuania",
      },
      material: {
        type: "linen",
        quantity: 250,
        unit: "meters",
      },
      status: "rejected",
      createdAt: "2025-05-20T14:10:00Z",
      targetDate: "2025-07-10T00:00:00Z",
      notes: "Rejected due to high price point compared to budget.",
      lastUpdated: "2025-05-22T11:30:00Z",
      hasAttachments: false,
      hasUnreadMessages: false,
    },
    {
      id: "quote-5",
      rfqId: "RFQ-67894",
      title: "Sustainable Bamboo Silk Blend",
      supplier: {
        id: "supplier-5",
        name: "Green Fiber Co.",
        location: "Shanghai, China",
      },
      material: {
        type: "blends",
        quantity: 400,
        unit: "meters",
      },
      status: "expired",
      createdAt: "2025-04-15T08:45:00Z",
      targetDate: "2025-05-30T00:00:00Z",
      lastUpdated: "2025-04-15T08:45:00Z",
      hasAttachments: false,
      hasUnreadMessages: false,
    },
  ];

  // Filter quotes based on active tab, search query, and status filter
  const filteredQuotes = mockQuotes.filter((quote) => {
    // Filter by tab
    if (activeTab !== "all" && quote.status !== activeTab) {
      if (
        !(
          activeTab === "active" &&
          (quote.status === "pending" || quote.status === "responded")
        )
      ) {
        return false;
      }
    }

    // Filter by search query
    if (
      searchQuery &&
      !quote.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quote.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !quote.rfqId.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by status
    if (statusFilter !== "all" && quote.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleViewDetails = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowDetails(true);
  };

  const handleAcceptQuote = (quoteId: string) => {
    toast({
      title: "Quote Accepted",
      description: "The supplier has been notified of your acceptance.",
    });
    setShowDetails(false);
  };

  const handleRejectQuote = (quoteId: string) => {
    toast({
      title: "Quote Rejected",
      description: "The supplier has been notified of your rejection.",
    });
    setShowDetails(false);
  };

  const handleDownloadQuote = (quoteId: string) => {
    toast({
      title: "Quote Downloaded",
      description: "The quote details have been downloaded.",
    });
  };

  // Helper function to display status badge
  const getStatusBadge = (status: Quote["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "responded":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <Check className="w-3 h-3 mr-1" />
            Quoted
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Check className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-500 border-slate-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      {" "}
      <PageHeader
        title="Quote Requests"
        description="Manage your material quote requests and supplier responses"
        breadcrumbs={[{ label: "Quote Requests", path: "/quotes" }]}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/orders">
                <Truck className="w-4 h-4 mr-2" />
                Order Tracking
              </Link>
            </Button>
            <Button asChild>
              <Link to="/materials">
                <FileText className="w-4 h-4 mr-2" />
                New RFQ
              </Link>
            </Button>
          </div>
        }
      />
      <div className="mt-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <TabsList className="mb-2 md:mb-0">
              <TabsTrigger value="all">All Quotes</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="responded">Quoted</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, supplier, or RFQ ID"
                  className="pl-10 min-w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    <span>Status Filter</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="responded">Quoted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <Card>
              <CardContent className="p-0">
                {filteredQuotes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">RFQ ID</TableHead>
                        <TableHead className="w-[300px]">Title</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Date
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">
                            {quote.rfqId}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{quote.title}</div>
                            <div className="text-xs text-slate-500">
                              Due:{" "}
                              {format(
                                parseISO(quote.targetDate),
                                "MMM d, yyyy"
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-2">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-medium">
                                  {quote.supplier.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {quote.supplier.location}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Package className="w-4 h-4 text-slate-400 mr-2" />
                              <span className="capitalize">
                                {quote.material.type}
                              </span>
                              <span className="text-xs text-slate-500 ml-1">
                                ({quote.material.quantity} {quote.material.unit}
                                )
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(quote.status)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {format(parseISO(quote.createdAt), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-slate-500">
                              Updated:{" "}
                              {format(parseISO(quote.lastUpdated), "MMM d")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-2">
                              {quote.hasUnreadMessages && (
                                <Badge className="bg-red-500 h-2 w-2 p-0 rounded-full" />
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(quote)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {quote.status === "responded" && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-600"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDownloadQuote(quote.id)}
                              >
                                <FileDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full bg-slate-100 p-3 mb-4">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-1">
                      No quote requests found
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 max-w-md text-center">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your search filters or create a new RFQ."
                        : "You haven't created any quote requests yet. Start by requesting a quote from a supplier."}
                    </p>
                    <Button asChild>
                      <Link to="/materials">
                        <FileText className="w-4 h-4 mr-2" />
                        Create New RFQ
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Quote Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        {selectedQuote && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Quote Details</DialogTitle>
                {getStatusBadge(selectedQuote.status)}
              </div>
              <DialogDescription>
                {selectedQuote.rfqId} - Created on{" "}
                {format(parseISO(selectedQuote.createdAt), "MMMM d, yyyy")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    RFQ Title
                  </h3>
                  <p className="text-base font-medium">{selectedQuote.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    Supplier
                  </h3>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mr-2">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-base font-medium">
                        {selectedQuote.supplier.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedQuote.supplier.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    Material Details
                  </h3>
                  <div className="flex items-center">
                    <Package className="w-4 h-4 text-slate-400 mr-2" />
                    <div>
                      <p className="text-base font-medium capitalize">
                        {selectedQuote.material.type}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedQuote.material.quantity}{" "}
                        {selectedQuote.material.unit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    Timeline
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">Created:</span>
                      <span className="text-sm">
                        {format(
                          parseISO(selectedQuote.createdAt),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">
                        Target Date:
                      </span>
                      <span className="text-sm">
                        {format(
                          parseISO(selectedQuote.targetDate),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500">
                        Last Updated:
                      </span>
                      <span className="text-sm">
                        {format(
                          parseISO(selectedQuote.lastUpdated),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedQuote.price && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-500 mb-1">
                      Price Quote
                    </h3>
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                      <div className="text-xl font-bold text-green-700">
                        {selectedQuote.price.currency}{" "}
                        {selectedQuote.price.value.toFixed(2)}
                        <span className="text-sm font-normal">
                          {selectedQuote.price.perUnit ? " per unit" : " total"}
                        </span>
                      </div>
                      <div className="text-sm text-green-600 mt-1">
                        Total Value: {selectedQuote.price.currency}{" "}
                        {selectedQuote.price.perUnit
                          ? (
                              selectedQuote.price.value *
                              selectedQuote.material.quantity
                            ).toFixed(2)
                          : selectedQuote.price.value.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    Notes from Supplier
                  </h3>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                    {selectedQuote.notes ||
                      "No notes provided by the supplier."}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-1">
                    Attachments
                  </h3>
                  {selectedQuote.hasAttachments ? (
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-slate-400 mr-2" />
                          <span>Quote_Details.pdf</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No attachments.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full RFQ
                </Button>
              </div>

              {selectedQuote.status === "responded" && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRejectQuote(selectedQuote.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                  <Button onClick={() => handleAcceptQuote(selectedQuote.id)}>
                    <Check className="w-4 h-4 mr-2" />
                    Accept Quote
                  </Button>
                </div>
              )}

              {selectedQuote.status === "accepted" && (
                <Button>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Proceed to Order
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default QuoteRequests;
