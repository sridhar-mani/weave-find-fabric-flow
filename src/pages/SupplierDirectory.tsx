import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  ChevronDown,
  Building,
  Award,
  BarChart2,
  Users,
  Package,
  ArrowUpDown,
  ExternalLink,
  Check,
  Mail,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import SupplierCard from "@/components/SupplierCard";

// Mock data for suppliers
const mockSuppliers = [
  {
    id: "sup-1",
    name: "TextileTech Industries",
    logo: "https://ui-avatars.com/api/?name=TextileTech+Industries&background=0D8ABC&color=fff",
    location: "Mumbai, India",
    description:
      "Leading manufacturer of premium cotton and polyester fabrics for fashion and home textiles.",
    rating: 4.8,
    reviewCount: 142,
    specialties: ["Cotton", "Polyester", "Blends"],
    certifications: ["ISO 9001", "GOTS", "OEKO-TEX"],
    foundedYear: 2005,
    employeeCount: "100-250",
    minOrderValue: "$2,000",
    leadTime: "2-3 weeks",
    featured: true,
    verified: true,
    materialCount: 48,
    responseRate: 98,
    responseTime: "Under 24 hours",
  },
  {
    id: "sup-2",
    name: "Eco Fabrics Co.",
    logo: "https://ui-avatars.com/api/?name=Eco+Fabrics&background=27AE60&color=fff",
    location: "Barcelona, Spain",
    description:
      "Sustainable textile manufacturer specializing in eco-friendly, organic, and recycled fabrics.",
    rating: 4.7,
    reviewCount: 98,
    specialties: ["Organic Cotton", "Recycled Polyester", "Hemp"],
    certifications: ["GOTS", "GRS", "OEKO-TEX", "B Corp"],
    foundedYear: 2012,
    employeeCount: "50-100",
    minOrderValue: "$1,500",
    leadTime: "3-4 weeks",
    featured: true,
    verified: true,
    materialCount: 36,
    responseRate: 95,
    responseTime: "Under 12 hours",
  },
  {
    id: "sup-3",
    name: "Global Textile Solutions",
    logo: "https://ui-avatars.com/api/?name=Global+Textile&background=9B59B6&color=fff",
    location: "Shanghai, China",
    description:
      "Full-service textile manufacturer offering a wide range of fabrics for apparel and technical applications.",
    rating: 4.5,
    reviewCount: 215,
    specialties: ["Silk", "Wool", "Technical Fabrics"],
    certifications: ["ISO 9001", "ISO 14001", "OEKO-TEX"],
    foundedYear: 2000,
    employeeCount: "250-500",
    minOrderValue: "$3,000",
    leadTime: "3-5 weeks",
    featured: false,
    verified: true,
    materialCount: 124,
    responseRate: 90,
    responseTime: "1-2 days",
  },
  {
    id: "sup-4",
    name: "Premium Weavers Ltd.",
    logo: "https://ui-avatars.com/api/?name=Premium+Weavers&background=E74C3C&color=fff",
    location: "Manchester, UK",
    description:
      "Specialized in high-end woven fabrics for fashion, upholstery, and technical applications.",
    rating: 4.6,
    reviewCount: 87,
    specialties: ["Jacquard", "Twill", "Satin"],
    certifications: ["ISO 9001", "REACH"],
    foundedYear: 1995,
    employeeCount: "100-250",
    minOrderValue: "$2,500",
    leadTime: "4-6 weeks",
    featured: false,
    verified: true,
    materialCount: 72,
    responseRate: 92,
    responseTime: "Under 24 hours",
  },
  {
    id: "sup-5",
    name: "Artisan Textiles",
    logo: "https://ui-avatars.com/api/?name=Artisan+Textiles&background=F39C12&color=fff",
    location: "Jaipur, India",
    description:
      "Handcrafted textiles combining traditional techniques with modern design for unique, high-quality products.",
    rating: 4.9,
    reviewCount: 56,
    specialties: ["Hand-woven", "Block Print", "Natural Dyes"],
    certifications: ["Fair Trade", "Craftmark"],
    foundedYear: 2010,
    employeeCount: "25-50",
    minOrderValue: "$1,000",
    leadTime: "4-8 weeks",
    featured: true,
    verified: true,
    materialCount: 28,
    responseRate: 97,
    responseTime: "Under 12 hours",
  },
  {
    id: "sup-6",
    name: "Innovative Fibers Inc.",
    logo: "https://ui-avatars.com/api/?name=Innovative+Fibers&background=3498DB&color=fff",
    location: "Seoul, South Korea",
    description:
      "Pioneer in technical and performance textiles using advanced manufacturing processes.",
    rating: 4.7,
    reviewCount: 112,
    specialties: ["Performance Fabrics", "Smart Textiles", "Synthetics"],
    certifications: ["ISO 9001", "OEKO-TEX", "bluesign®"],
    foundedYear: 2008,
    employeeCount: "100-250",
    minOrderValue: "$2,000",
    leadTime: "3-5 weeks",
    featured: false,
    verified: true,
    materialCount: 65,
    responseRate: 94,
    responseTime: "1-2 days",
  },
  {
    id: "sup-7",
    name: "Heritage Fabrics",
    logo: "https://ui-avatars.com/api/?name=Heritage+Fabrics&background=795548&color=fff",
    location: "Florence, Italy",
    description:
      "Family-owned business with generations of expertise in luxury fabrics for high-end fashion.",
    rating: 4.8,
    reviewCount: 75,
    specialties: ["Cashmere", "Fine Wool", "Luxury Cotton"],
    certifications: ["IWTO", "OEKO-TEX"],
    foundedYear: 1962,
    employeeCount: "50-100",
    minOrderValue: "$5,000",
    leadTime: "4-6 weeks",
    featured: true,
    verified: true,
    materialCount: 42,
    responseRate: 96,
    responseTime: "Under 24 hours",
  },
  {
    id: "sup-8",
    name: "FutureTex Solutions",
    logo: "https://ui-avatars.com/api/?name=FutureTex+Solutions&background=607D8B&color=fff",
    location: "Portland, USA",
    description:
      "Innovative textiles utilizing recycled materials and sustainable production methods.",
    rating: 4.5,
    reviewCount: 63,
    specialties: ["Recycled Materials", "Sustainable Synthetics", "Eco Blends"],
    certifications: ["GRS", "OEKO-TEX", "Cradle to Cradle"],
    foundedYear: 2015,
    employeeCount: "25-50",
    minOrderValue: "$1,500",
    leadTime: "2-4 weeks",
    featured: false,
    verified: true,
    materialCount: 31,
    responseRate: 91,
    responseTime: "1-2 days",
  },
];

// Filter categories for supplier filtering
const filterCategories = [
  {
    id: "specialties",
    name: "Specialties",
    options: [
      { id: "cotton", name: "Cotton" },
      { id: "polyester", name: "Polyester" },
      { id: "silk", name: "Silk" },
      { id: "wool", name: "Wool" },
      { id: "linen", name: "Linen" },
      { id: "recycled", name: "Recycled Materials" },
      { id: "organic", name: "Organic" },
      { id: "performance", name: "Performance Fabrics" },
      { id: "technical", name: "Technical Textiles" },
      { id: "handcrafted", name: "Handcrafted" },
    ],
  },
  {
    id: "certifications",
    name: "Certifications",
    options: [
      { id: "gots", name: "GOTS" },
      { id: "oeko-tex", name: "OEKO-TEX" },
      { id: "iso9001", name: "ISO 9001" },
      { id: "grs", name: "GRS" },
      { id: "fair-trade", name: "Fair Trade" },
      { id: "bluesign", name: "bluesign®" },
      { id: "iso14001", name: "ISO 14001" },
      { id: "reach", name: "REACH" },
      { id: "bci", name: "BCI" },
      { id: "cradle-to-cradle", name: "Cradle to Cradle" },
    ],
  },
  {
    id: "location",
    name: "Location",
    options: [
      { id: "asia", name: "Asia" },
      { id: "europe", name: "Europe" },
      { id: "north-america", name: "North America" },
      { id: "south-america", name: "South America" },
      { id: "africa", name: "Africa" },
      { id: "oceania", name: "Oceania" },
    ],
  },
  {
    id: "lead-time",
    name: "Lead Time",
    options: [
      { id: "lt-2w", name: "Under 2 weeks" },
      { id: "lt-4w", name: "2-4 weeks" },
      { id: "lt-6w", name: "4-6 weeks" },
      { id: "lt-8w", name: "6-8 weeks" },
      { id: "lt-8w+", name: "Over 8 weeks" },
    ],
  },
];

// Main component
const SupplierDirectory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
    {}
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);

  // Filter suppliers based on search query and active filters
  const filteredSuppliers = suppliers.filter((supplier) => {
    // Search filter
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.specialties.some((spec) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Check if any active filters are applied
    if (Object.keys(activeFilters).length === 0) {
      return matchesSearch;
    }

    // Apply category filters
    const passesFilters = Object.entries(activeFilters).every(
      ([category, values]) => {
        if (values.length === 0) return true;

        switch (category) {
          case "specialties":
            return supplier.specialties.some((specialty) =>
              values.some((value) =>
                specialty.toLowerCase().includes(value.toLowerCase())
              )
            );
          case "certifications":
            return supplier.certifications.some((cert) =>
              values.some((value) =>
                cert.toLowerCase().includes(value.toLowerCase())
              )
            );
          case "location":
            // Simplified continent matching
            if (
              (values.includes("asia") &&
                supplier.location.includes("India")) ||
              supplier.location.includes("China") ||
              supplier.location.includes("Korea")
            )
              return true;
            if (
              (values.includes("europe") &&
                supplier.location.includes("Spain")) ||
              supplier.location.includes("UK") ||
              supplier.location.includes("Italy")
            )
              return true;
            if (
              values.includes("north-america") &&
              supplier.location.includes("USA")
            )
              return true;
            return false;
          case "lead-time":
            const leadTime = supplier.leadTime;
            if (values.includes("lt-2w") && leadTime.includes("Under 2 weeks"))
              return true;
            if (values.includes("lt-4w") && leadTime.includes("2-3 weeks"))
              return true;
            if (values.includes("lt-6w") && leadTime.includes("4-6 weeks"))
              return true;
            if (values.includes("lt-8w") && leadTime.includes("6-8 weeks"))
              return true;
            if (values.includes("lt-8w+") && leadTime.includes("Over 8 weeks"))
              return true;
            return false;
          default:
            return true;
        }
      }
    );

    return matchesSearch && passesFilters;
  });

  // Sort suppliers based on selected sort option
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "rating":
        return b.rating - a.rating;
      case "rating-asc":
        return a.rating - b.rating;
      case "materials":
        return b.materialCount - a.materialCount;
      case "founded-desc":
        return b.foundedYear - a.foundedYear;
      case "founded-asc":
        return a.foundedYear - b.foundedYear;
      default:
        return 0;
    }
  });

  // Handle toggling a filter option
  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => {
      const currentValues = prev[category] || [];
      const valueIndex = currentValues.indexOf(value);

      if (valueIndex === -1) {
        // Add the value
        return {
          ...prev,
          [category]: [...currentValues, value],
        };
      } else {
        // Remove the value
        return {
          ...prev,
          [category]: currentValues.filter((v) => v !== value),
        };
      }
    });
  };

  // Handle clearing all filters
  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
  };

  // Handle opening contact dialog
  const handleContactSupplier = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowContactDialog(true);
  };

  // Handle sending a contact message
  const handleSendContactMessage = () => {
    // In a real app, you would send this to your backend
    setShowContactDialog(false);

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedSupplier?.name}`,
    });

    // Navigate to the messages page
    setTimeout(() => {
      navigate("/messages");
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <PageHeader
        title="Supplier Directory"
        description="Find and connect with verified textile suppliers from around the world"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Suppliers" }]}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="md:w-64 flex-shrink-0">
          {/* Filters Panel */}
          <div className="border rounded-lg bg-background">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">Filters</h3>
              {Object.keys(activeFilters).length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Accordion type="multiple" className="w-full">
                {filterCategories.map((category) => (
                  <AccordionItem value={category.id} key={category.id}>
                    <AccordionTrigger className="text-sm py-2">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pl-1">
                        {category.options.map((option) => (
                          <div
                            className="flex items-center space-x-2"
                            key={option.id}
                          >
                            <Checkbox
                              id={`${category.id}-${option.id}`}
                              checked={(
                                activeFilters[category.id] || []
                              ).includes(option.id)}
                              onCheckedChange={() =>
                                toggleFilter(category.id, option.id)
                              }
                            />
                            <label
                              htmlFor={`${category.id}-${option.id}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {option.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium text-sm mb-2">Supplier Status</h4>
                <div className="space-y-2 pl-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" />
                    <label
                      htmlFor="verified"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Verified Suppliers
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" />
                    <label
                      htmlFor="featured"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Featured Suppliers
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium">
                {filteredSuppliers.length}{" "}
                {filteredSuppliers.length === 1 ? "Supplier" : "Suppliers"}
              </h3>
              {Object.keys(activeFilters).length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Filtered by {Object.keys(activeFilters).length}{" "}
                  {Object.keys(activeFilters).length === 1
                    ? "category"
                    : "categories"}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>
                    Highest Rating
                    {sortBy === "rating" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating-asc")}>
                    Lowest Rating
                    {sortBy === "rating-asc" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name (A-Z)
                    {sortBy === "name" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-desc")}>
                    Name (Z-A)
                    {sortBy === "name-desc" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("materials")}>
                    Most Materials
                    {sortBy === "materials" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("founded-desc")}>
                    Newest Companies
                    {sortBy === "founded-desc" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("founded-asc")}>
                    Oldest Companies
                    {sortBy === "founded-asc" && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none h-8 px-3"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Separator orientation="vertical" />
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none h-8 px-3"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Supplier Results */}
          {sortedSuppliers.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {sortedSuppliers.map((supplier) =>
                viewMode === "grid" ? (
                  <Card key={supplier.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img
                            src={supplier.logo}
                            alt={supplier.name}
                            className="w-12 h-12 rounded"
                          />
                          <div>
                            <CardTitle className="text-base flex items-center gap-1">
                              {supplier.name}
                              {supplier.verified && (
                                <Badge
                                  variant="secondary"
                                  className="ml-1 h-5 px-1"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </CardTitle>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {supplier.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {supplier.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {supplier.specialties
                          .slice(0, 3)
                          .map((specialty, index) => (
                            <Badge
                              variant="outline"
                              key={index}
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ))}
                        {supplier.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{supplier.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span className="font-medium">{supplier.rating}</span>
                          <span className="text-muted-foreground ml-1">
                            ({supplier.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{supplier.materialCount} Materials</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{supplier.leadTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>Since {supplier.foundedYear}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/suppliers/${supplier.id}`)}
                      >
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleContactSupplier(supplier)}
                      >
                        Contact
                      </Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div
                    key={supplier.id}
                    className="border rounded-lg p-4 bg-background"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 md:w-1/3">
                        <img
                          src={supplier.logo}
                          alt={supplier.name}
                          className="w-14 h-14 rounded"
                        />
                        <div>
                          <h3 className="font-medium flex items-center gap-1">
                            {supplier.name}
                            {supplier.verified && (
                              <Badge
                                variant="secondary"
                                className="ml-1 h-5 px-1"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {supplier.location}
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-500 mr-1" />
                            <span className="text-xs font-medium">
                              {supplier.rating}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({supplier.reviewCount})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-1/3">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {supplier.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {supplier.specialties
                            .slice(0, 3)
                            .map((specialty, index) => (
                              <Badge
                                variant="outline"
                                key={index}
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          {supplier.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{supplier.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="md:w-1/3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{supplier.materialCount} Materials</span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>
                            {supplier.certifications.length} Certifications
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{supplier.leadTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{supplier.employeeCount} Employees</span>
                        </div>
                      </div>

                      <div className="flex gap-2 md:flex-col justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/suppliers/${supplier.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleContactSupplier(supplier)}
                        >
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center bg-background">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                We couldn't find any suppliers matching your filters. Try
                adjusting your search criteria.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Supplier Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {selectedSupplier?.name}</DialogTitle>
            <DialogDescription>
              Send a message to inquire about materials, pricing, or other
              business details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="e.g., Material Inquiry, Pricing Request" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Describe your requirements or questions in detail..."
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Checkbox id="subscribe" />
                <span>Subscribe to supplier updates</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContactDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendContactMessage}>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupplierDirectory;
