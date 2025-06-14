import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Grid,
  List,
  Filter,
  Package,
  Scissors,
  Circle,
  Building2,
  Sliders,
  X,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import MaterialCard from "@/components/MaterialCard";
import MaterialDetails from "@/components/MaterialDetails";
import PageHeader from "@/components/PageHeader";

// Reuse the MaterialForm interface from the original Materials.tsx
interface MaterialForm {
  id?: string;
  name: string;
  category: string;
  subcategory: string;
  type: "fabric" | "trim" | "accessory" | "packaging" | "hardware";
  composition: string;
  weight?: string;
  width?: string;
  thickness?: string;
  color: string;
  finish: string;
  supplier: string;
  supplierContact: string;
  supplierLocation: string;
  unitPrice: number;
  bulkPrice: number;
  minimumOrder: number;
  bulkOrderQuantity: number;
  currency: string;
  leadTime: string;
  availability: string;
  certifications: string[];
  sustainability: string[];
  careInstructions: string;
  description: string;
  applications: string[];
  season: string;
  tags: string[];
  image?: string;
  rating?: number;
}

const MaterialsMarketplace = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialForm | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [supplierContactOpen, setSupplierContactOpen] = useState(false);
  const [sampleRequestOpen, setSampleRequestOpen] = useState(false);
  const [quoteRequestOpen, setQuoteRequestOpen] = useState(false);
  const [contactSupplier, setContactSupplier] = useState<string | null>(null);

  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    priceRange: "all",
    availability: "all",
    supplier: "all",
    certification: "all",
    sustainability: false,
  });

  const [materials, setMaterials] = useState<MaterialForm[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Sample materials for B2B showcase
  const sampleMaterials: MaterialForm[] = [
    {
      id: "1",
      name: "Premium Organic Cotton Canvas",
      category: "Cotton",
      subcategory: "Canvas",
      type: "fabric",
      composition: "100% Organic Cotton",
      weight: "280 GSM",
      width: "150cm",
      color: "Natural White",
      finish: "Enzyme Washed",
      supplier: "EcoTextile Mills",
      supplierContact: "+1-555-0123",
      supplierLocation: "Gujarat, India",
      unitPrice: 12.5,
      bulkPrice: 8.75,
      minimumOrder: 100,
      bulkOrderQuantity: 1000,
      currency: "USD",
      leadTime: "15-20 days",
      availability: "In Stock",
      certifications: ["GOTS", "OEKO-TEX Standard 100"],
      sustainability: ["Organic", "Biodegradable", "Fair Trade"],
      careInstructions: "Machine wash cold, tumble dry low",
      description:
        "Premium organic cotton canvas perfect for bags, jackets, and durable garments. Pre-shrunk and enzyme washed for softness.",
      applications: ["Bags", "Jackets", "Workwear", "Home Textiles"],
      season: "Year Round",
      tags: ["premium", "sustainable", "durable"],
      rating: 4.8,
    },
    {
      id: "2",
      name: "Italian Merino Wool Jersey",
      category: "Wool",
      subcategory: "Jersey",
      type: "fabric",
      composition: "100% Merino Wool",
      weight: "180 GSM",
      width: "160cm",
      color: "Charcoal Grey",
      finish: "Anti-Pilling",
      supplier: "Milano Fabrics",
      supplierContact: "+39-02-1234567",
      supplierLocation: "Milan, Italy",
      unitPrice: 28.0,
      bulkPrice: 22.5,
      minimumOrder: 50,
      bulkOrderQuantity: 500,
      currency: "EUR",
      leadTime: "10-14 days",
      availability: "In Stock",
      certifications: ["RWS", "OEKO-TEX Standard 100"],
      sustainability: ["Renewable", "Biodegradable"],
      careInstructions: "Hand wash or dry clean",
      description:
        "Luxurious Italian merino wool jersey with excellent drape and temperature regulation properties.",
      applications: ["Sweaters", "Dresses", "Base Layers", "Activewear"],
      season: "Fall/Winter",
      tags: ["luxury", "italian", "temperature-regulating"],
      rating: 4.9,
    },
    {
      id: "3",
      name: "Sustainable Bamboo Silk Blend",
      category: "Blends",
      subcategory: "Bamboo-Silk",
      type: "fabric",
      composition: "70% Bamboo, 30% Silk",
      weight: "140 GSM",
      width: "140cm",
      color: "Sage Green",
      finish: "Silky Smooth",
      supplier: "Green Fiber Co.",
      supplierContact: "+86-21-5555-0199",
      supplierLocation: "Shanghai, China",
      unitPrice: 18.75,
      bulkPrice: 14.25,
      minimumOrder: 200,
      bulkOrderQuantity: 2000,
      currency: "USD",
      leadTime: "12-18 days",
      availability: "In Stock",
      certifications: ["OEKO-TEX Standard 100", "FSC Certified"],
      sustainability: ["Renewable", "Antibacterial", "UV Protection"],
      careInstructions: "Machine wash gentle, hang dry",
      description:
        "Innovative bamboo-silk blend offering natural antibacterial properties and luxurious feel.",
      applications: ["Shirts", "Dresses", "Lingerie", "Sleepwear"],
      season: "Spring/Summer",
      tags: ["innovative", "antibacterial", "eco-friendly"],
      rating: 4.2,
    },
    {
      id: "4",
      name: "Recycled Polyester Twill",
      category: "Synthetic",
      subcategory: "Twill",
      type: "fabric",
      composition: "100% Recycled Polyester",
      weight: "220 GSM",
      width: "145cm",
      color: "Navy Blue",
      finish: "Water Repellent",
      supplier: "EcoSynth Textiles",
      supplierContact: "+1-555-8976",
      supplierLocation: "Taiwan",
      unitPrice: 14.5,
      bulkPrice: 11.25,
      minimumOrder: 100,
      bulkOrderQuantity: 1000,
      currency: "USD",
      leadTime: "14-21 days",
      availability: "In Stock",
      certifications: ["GRS", "bluesign®"],
      sustainability: [
        "Recycled Materials",
        "Water Saving",
        "Energy Efficient",
      ],
      careInstructions: "Machine wash cold, hang dry, do not bleach",
      description:
        "Durable recycled polyester twill with water repellent finish, perfect for outerwear and bags. Made from post-consumer plastic bottles.",
      applications: ["Outerwear", "Bags", "Workwear", "Pants"],
      season: "All Season",
      tags: ["recycled", "water-repellent", "durable"],
      rating: 4.5,
    },
    {
      id: "5",
      name: "Organic Linen Canvas",
      category: "Linen",
      subcategory: "Canvas",
      type: "fabric",
      composition: "100% Organic Linen",
      weight: "320 GSM",
      width: "155cm",
      color: "Natural Beige",
      finish: "Stonewashed",
      supplier: "Baltic Flax",
      supplierContact: "+370-5-1234567",
      supplierLocation: "Lithuania",
      unitPrice: 26.5,
      bulkPrice: 21.75,
      minimumOrder: 50,
      bulkOrderQuantity: 500,
      currency: "EUR",
      leadTime: "14-21 days",
      availability: "Low Stock",
      certifications: ["GOTS", "European Flax"],
      sustainability: ["Organic", "Biodegradable", "Low Water Usage"],
      careInstructions:
        "Machine wash cold, tumble dry low, expect natural shrinkage",
      description:
        "Premium heavyweight organic linen canvas with a beautiful stonewashed finish for softness and texture. Perfect for upholstery and heavy-duty apparel.",
      applications: ["Upholstery", "Bags", "Jackets", "Shoes"],
      season: "Year Round",
      tags: ["premium", "organic", "textured"],
      rating: 4.7,
    },
    {
      id: "6",
      name: "Metal Snap Buttons",
      category: "Fasteners",
      subcategory: "Buttons",
      type: "trim",
      composition: "Brass with Nickel Finish",
      thickness: "2mm",
      color: "Silver",
      finish: "Polished",
      supplier: "Hardware Solutions Co.",
      supplierContact: "+1-555-3457",
      supplierLocation: "Hong Kong",
      unitPrice: 0.25,
      bulkPrice: 0.15,
      minimumOrder: 1000,
      bulkOrderQuantity: 10000,
      currency: "USD",
      leadTime: "7-14 days",
      availability: "In Stock",
      certifications: ["OEKO-TEX Standard 100"],
      sustainability: [],
      careInstructions: "Wipe clean, avoid exposure to moisture",
      description:
        "Durable metal snap buttons with nickel finish. Easy to attach and secure closure for various applications.",
      applications: ["Jackets", "Bags", "Leather Goods", "Denim"],
      season: "All Season",
      tags: ["metal", "hardware", "closure"],
      rating: 4.5,
    },
    {
      id: "7",
      name: "YKK Waterproof Zipper",
      category: "Fasteners",
      subcategory: "Zippers",
      type: "trim",
      composition: "Polyester Tape with PU Coating, Metal Teeth",
      thickness: "5mm",
      color: "Black",
      finish: "Matte",
      supplier: "YKK Group",
      supplierContact: "+81-3-1234567",
      supplierLocation: "Japan",
      unitPrice: 1.85,
      bulkPrice: 1.45,
      minimumOrder: 500,
      bulkOrderQuantity: 5000,
      currency: "USD",
      leadTime: "10-15 days",
      availability: "In Stock",
      certifications: ["OEKO-TEX Standard 100", "bluesign®"],
      sustainability: ["Reduced Chemicals"],
      careInstructions: "Machine washable, avoid high heat",
      description:
        "Premium YKK waterproof zipper with PU coating. Perfect for outdoor gear and technical apparel requiring water resistance.",
      applications: ["Outerwear", "Bags", "Technical Apparel", "Sportswear"],
      season: "All Season",
      tags: ["waterproof", "technical", "high-quality"],
      rating: 4.9,
    },
  ];

  // Load materials on component mount
  useEffect(() => {
    setMaterials(sampleMaterials);

    // In a real app, we would fetch from the database:
    // const fetchMaterials = async () => {
    //   setIsLoading(true);
    //   try {
    //     const { data, error } = await supabase
    //       .from("materials")
    //       .select("*");
    //
    //     if (error) throw error;
    //     setMaterials(data || []);
    //   } catch (error) {
    //     console.error("Error fetching materials:", error);
    //     toast({
    //       title: "Failed to load materials",
    //       description: "Please try again later.",
    //       variant: "destructive",
    //     });
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    //
    // fetchMaterials();
  }, []);

  // Filter materials based on selected filters and search query
  const filteredMaterials = materials.filter((material) => {
    // Filter by material type (tab)
    if (activeTab !== "all" && material.type !== activeTab) {
      return false;
    }

    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.composition.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory =
      selectedFilters.category === "all" ||
      material.category === selectedFilters.category;

    // Filter by availability
    const matchesAvailability =
      selectedFilters.availability === "all" ||
      material.availability === selectedFilters.availability;

    // Filter by sustainability
    const matchesSustainability =
      !selectedFilters.sustainability || material.sustainability.length > 0;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability &&
      matchesSustainability
    );
  });

  // Handle toggling favorites
  const handleToggleFavorite = (materialId: string) => {
    setFavorites((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );

    // Show feedback toast
    toast({
      title: favorites.includes(materialId)
        ? "Removed from favorites"
        : "Added to favorites",
      description: favorites.includes(materialId)
        ? "Item has been removed from your favorites."
        : "Item has been added to your favorites.",
    });
  };

  // Handle viewing material details
  const handleViewDetails = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
      setIsDetailsOpen(true);
    }
  };

  // Handle quote request
  const handleQuoteRequest = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
      setQuoteRequestOpen(true);
    }
  };

  // Handle sample request
  const handleSampleRequest = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
      setSampleRequestOpen(true);
    }
  };

  // Handle contact supplier
  const handleContactSupplier = (materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
      setContactSupplier(material.supplier);
      setSupplierContactOpen(true);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedFilters({
      category: "all",
      priceRange: "all",
      availability: "all",
      supplier: "all",
      certification: "all",
      sustainability: false,
    });
    setSearchQuery("");
  };

  // Get unique categories, suppliers, and certifications for filter options
  const categories = Array.from(new Set(materials.map((m) => m.category)));
  const suppliers = Array.from(new Set(materials.map((m) => m.supplier)));
  const certifications = Array.from(
    new Set(materials.flatMap((m) => m.certifications))
  );

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access the materials marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/login">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Materials Marketplace"
        description="Source premium fabrics, trims, and accessories from verified suppliers worldwide"
        breadcrumbs={[{ label: "Materials", path: "/materials" }]}
        actions={
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        }
      />

      {/* Search and Tab Navigation */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search materials, suppliers, or compositions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {Object.values(selectedFilters).some(
              (value) => value !== "all" && value !== false
            ) && (
              <Badge className="ml-2 bg-white text-primary">
                {
                  Object.values(selectedFilters).filter(
                    (value) => value !== "all" && value !== false
                  ).length
                }
              </Badge>
            )}
          </Button>

          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
            <Button
              variant={displayMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDisplayMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={displayMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDisplayMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6 bg-slate-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-800">Filters</h3>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Clear All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label
                  htmlFor="category-filter"
                  className="text-xs text-slate-500 mb-1 block"
                >
                  Category
                </Label>
                <Select
                  value={selectedFilters.category}
                  onValueChange={(value) =>
                    setSelectedFilters((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger id="category-filter">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="supplier-filter"
                  className="text-xs text-slate-500 mb-1 block"
                >
                  Supplier
                </Label>
                <Select
                  value={selectedFilters.supplier}
                  onValueChange={(value) =>
                    setSelectedFilters((prev) => ({ ...prev, supplier: value }))
                  }
                >
                  <SelectTrigger id="supplier-filter">
                    <SelectValue placeholder="All Suppliers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="availability-filter"
                  className="text-xs text-slate-500 mb-1 block"
                >
                  Availability
                </Label>
                <Select
                  value={selectedFilters.availability}
                  onValueChange={(value) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      availability: value,
                    }))
                  }
                >
                  <SelectTrigger id="availability-filter">
                    <SelectValue placeholder="All Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="In Stock">In Stock</SelectItem>
                    <SelectItem value="Low Stock">Low Stock</SelectItem>
                    <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                    <SelectItem value="Pre-Order">Pre-Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="certification-filter"
                  className="text-xs text-slate-500 mb-1 block"
                >
                  Certification
                </Label>
                <Select
                  value={selectedFilters.certification}
                  onValueChange={(value) =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      certification: value,
                    }))
                  }
                >
                  <SelectTrigger id="certification-filter">
                    <SelectValue placeholder="All Certifications" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Certifications</SelectItem>
                    {certifications.map((cert) => (
                      <SelectItem key={cert} value={cert}>
                        {cert}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="outline"
                className={
                  selectedFilters.sustainability
                    ? "bg-green-50 border-green-200 text-green-800"
                    : ""
                }
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    sustainability: !prev.sustainability,
                  }))
                }
              >
                {selectedFilters.sustainability ? (
                  <X className="w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Eco-Friendly Only
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Material Type Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Materials</TabsTrigger>
          <TabsTrigger value="fabric" className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Fabrics
          </TabsTrigger>
          <TabsTrigger value="trim" className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Trims
          </TabsTrigger>
          <TabsTrigger value="accessory" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Accessories
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-600">
          {filteredMaterials.length} materials found
        </div>

        {filteredMaterials.length > 0 && (
          <div className="text-sm text-slate-600">
            Showing {Math.min(filteredMaterials.length, 20)} of{" "}
            {filteredMaterials.length}
          </div>
        )}
      </div>

      {/* Materials Grid/List */}
      {filteredMaterials.length > 0 ? (
        <div
          className={
            displayMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              layout={displayMode}
              isFavorite={favorites.includes(material.id || "")}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={handleViewDetails}
              onQuoteRequest={handleQuoteRequest}
              onSampleRequest={handleSampleRequest}
              onContact={handleContactSupplier}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No materials found
              </h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search filters or add a new material to the
                marketplace.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={resetFilters}>
                  Clear Filters
                </Button>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Material
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Material Details Modal */}
      <MaterialDetails
        material={selectedMaterial}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        isFavorite={
          selectedMaterial && favorites.includes(selectedMaterial.id || "")
        }
        onToggleFavorite={handleToggleFavorite}
        onQuoteRequest={handleQuoteRequest}
        onSampleRequest={handleSampleRequest}
        onContact={handleContactSupplier}
      />

      {/* Request Sample Dialog */}
      <Dialog open={sampleRequestOpen} onOpenChange={setSampleRequestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Sample</DialogTitle>
            <DialogDescription>
              Request a sample of {selectedMaterial?.name} from{" "}
              {selectedMaterial?.supplier}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 p-4 rounded-md text-amber-800 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Sample Request</p>
                <p className="mt-1">
                  This is a demo app. In a real application, this would be a
                  form to request a sample from the supplier.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSampleRequestOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSampleRequestOpen(false);
                toast({
                  title: "Sample request sent",
                  description: `Your sample request for ${selectedMaterial?.name} has been sent to ${selectedMaterial?.supplier}.`,
                });
              }}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Quote Dialog */}
      <Dialog open={quoteRequestOpen} onOpenChange={setQuoteRequestOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Quote</DialogTitle>
            <DialogDescription>
              Request a price quote for {selectedMaterial?.name} from{" "}
              {selectedMaterial?.supplier}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 p-4 rounded-md text-amber-800 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Quote Request</p>
                <p className="mt-1">
                  This is a demo app. In a real application, this would be a
                  form to request a price quote from the supplier.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setQuoteRequestOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setQuoteRequestOpen(false);
                toast({
                  title: "Quote request sent",
                  description: `Your quote request for ${selectedMaterial?.name} has been sent to ${selectedMaterial?.supplier}.`,
                });
              }}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Supplier Dialog */}
      <Dialog open={supplierContactOpen} onOpenChange={setSupplierContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {contactSupplier}</DialogTitle>
            <DialogDescription>
              Send a message to the supplier about {selectedMaterial?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 p-4 rounded-md text-amber-800 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Supplier Contact</p>
                <p className="mt-1">
                  This is a demo app. In a real application, this would be a
                  messaging interface to contact the supplier directly.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSupplierContactOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSupplierContactOpen(false);
                toast({
                  title: "Message sent",
                  description: `Your message has been sent to ${contactSupplier}.`,
                });
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Material Dialog - In a real app, would use the existing material form */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Material</DialogTitle>
            <DialogDescription>
              Add a new material to the marketplace
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 p-4 rounded-md text-amber-800 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Demo App</p>
                <p className="mt-1">
                  This is a demo app. In a real application, this would be a
                  form to add a new material to the marketplace.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAddForm(false)}>
              Continue to Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaterialsMarketplace;
