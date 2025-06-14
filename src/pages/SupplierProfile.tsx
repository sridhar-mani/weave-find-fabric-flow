import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Star,
  Package,
  Shield,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  AlertCircle,
  Send,
  Download,
  Truck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MaterialCard from "@/components/MaterialCard";
import PageHeader from "@/components/PageHeader";

interface Supplier {
  id: string;
  name: string;
  location: string;
  contact: {
    email: string;
    phone: string;
    website: string;
  };
  rating: number;
  responseTime: string;
  established: string;
  description: string;
  specialties: string[];
  certifications: string[];
  performance: {
    qualityScore: number;
    deliveryScore: number;
    communicationScore: number;
    reliabilityScore: number;
  };
  materialsCount: number;
  logo?: string;
  gallery?: string[];
}

interface Material {
  id: string;
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

const SupplierProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch supplier from API
    // This is mock data for demonstration
    const mockSupplier: Supplier = {
      id: id || "supplier-1",
      name: "EcoTextile Mills",
      location: "Gujarat, India",
      contact: {
        email: "info@ecotextilemills.com",
        phone: "+91 265 2354789",
        website: "www.ecotextilemills.com",
      },
      rating: 4.8,
      responseTime: "< 24 hours",
      established: "1998",
      description:
        "EcoTextile Mills is a leading manufacturer of sustainable textiles with a focus on organic cotton and eco-friendly production processes. With over 25 years of experience, we supply premium fabrics to fashion brands worldwide who prioritize sustainability and ethical manufacturing.",
      specialties: [
        "Organic Cotton",
        "Sustainable Textiles",
        "Eco-Friendly Dyes",
        "Fair Trade Manufacturing",
      ],
      certifications: ["GOTS", "OEKO-TEX Standard 100", "Fair Trade Certified"],
      performance: {
        qualityScore: 95,
        deliveryScore: 92,
        communicationScore: 88,
        reliabilityScore: 90,
      },
      materialsCount: 48,
      gallery: [
        "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?q=80&w=2069",
        "https://images.unsplash.com/photo-1594631450865-8861000c09cb?q=80&w=2051",
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080",
      ],
    };

    // Mock materials data
    const mockMaterials: Material[] = [
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
        name: "Organic Cotton Twill",
        category: "Cotton",
        subcategory: "Twill",
        type: "fabric",
        composition: "100% Organic Cotton",
        weight: "260 GSM",
        width: "145cm",
        color: "Khaki",
        finish: "Brushed",
        supplier: "EcoTextile Mills",
        supplierContact: "+1-555-0123",
        supplierLocation: "Gujarat, India",
        unitPrice: 11.75,
        bulkPrice: 7.95,
        minimumOrder: 100,
        bulkOrderQuantity: 1000,
        currency: "USD",
        leadTime: "15-20 days",
        availability: "In Stock",
        certifications: ["GOTS", "OEKO-TEX Standard 100"],
        sustainability: ["Organic", "Biodegradable", "Fair Trade"],
        careInstructions: "Machine wash cold, tumble dry low",
        description:
          "Durable organic cotton twill with diagonal ribbing, perfect for pants, jackets, and bags. Soft yet structured.",
        applications: ["Pants", "Jackets", "Bags", "Workwear"],
        season: "Year Round",
        tags: ["premium", "sustainable", "durable"],
        rating: 4.7,
      },
      {
        id: "3",
        name: "Organic Cotton Jersey",
        category: "Cotton",
        subcategory: "Jersey",
        type: "fabric",
        composition: "100% Organic Cotton",
        weight: "180 GSM",
        width: "160cm",
        color: "Off-White",
        finish: "Soft",
        supplier: "EcoTextile Mills",
        supplierContact: "+1-555-0123",
        supplierLocation: "Gujarat, India",
        unitPrice: 9.25,
        bulkPrice: 6.75,
        minimumOrder: 100,
        bulkOrderQuantity: 1000,
        currency: "USD",
        leadTime: "15-20 days",
        availability: "In Stock",
        certifications: ["GOTS", "OEKO-TEX Standard 100"],
        sustainability: ["Organic", "Biodegradable", "Fair Trade"],
        careInstructions: "Machine wash cold, tumble dry low",
        description:
          "Soft and stretchy organic cotton jersey perfect for t-shirts and casual wear. Breathable and comfortable.",
        applications: ["T-shirts", "Casual Wear", "Loungewear"],
        season: "Year Round",
        tags: ["premium", "sustainable", "soft"],
        rating: 4.9,
      },
    ];

    setSupplier(mockSupplier);
    setMaterials(mockMaterials);
    setIsLoading(false);
  }, [id]);

  const handleToggleFavorite = (materialId: string) => {
    setFavorites((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );

    toast({
      title: favorites.includes(materialId)
        ? "Removed from favorites"
        : "Added to favorites",
      description: favorites.includes(materialId)
        ? "Item has been removed from your favorites."
        : "Item has been added to your favorites.",
    });
  };

  const handleRequestQuote = () => {
    toast({
      title: "Quote request initiated",
      description: `Your request for a quote has been sent to ${supplier?.name}.`,
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${supplier?.name}.`,
    });
  };

  const handleDownloadProfile = () => {
    toast({
      title: "Profile downloaded",
      description: `${supplier?.name} profile has been downloaded.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-400" />
              <h2 className="mt-4 text-lg font-semibold">Supplier not found</h2>
              <p className="mt-2 text-sm text-slate-500">
                The supplier you are looking for doesn't exist or has been
                removed.
              </p>
              <Button asChild className="mt-6">
                <Link to="/materials">Back to Materials</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={supplier.name}
        description="Supplier Profile"
        breadcrumbs={[
          { label: "Materials", path: "/materials" },
          { label: supplier.name, path: `/suppliers/${supplier.id}` },
        ]}
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadProfile}>
              <Download className="w-4 h-4 mr-2" />
              Download Profile
            </Button>
            <Button onClick={handleSendMessage}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Supplier
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left sidebar - Supplier info */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={supplier.logo} />
                <AvatarFallback className="bg-amber-100 text-amber-800 text-xl">
                  {supplier.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-slate-800">
                {supplier.name}
              </h2>
              <div className="flex items-center mt-2">
                <MapPin className="w-4 h-4 text-slate-500 mr-1" />
                <span className="text-sm text-slate-600">
                  {supplier.location}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-amber-500 mr-1" />
                <span className="text-sm font-medium">
                  {supplier.rating.toFixed(1)}/5.0
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm">{supplier.contact.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm">{supplier.contact.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-sm">{supplier.contact.website}</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Supplier Metrics
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Quality</span>
                      <span>{supplier.performance.qualityScore}%</span>
                    </div>
                    <Progress
                      value={supplier.performance.qualityScore}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span>On-time Delivery</span>
                      <span>{supplier.performance.deliveryScore}%</span>
                    </div>
                    <Progress
                      value={supplier.performance.deliveryScore}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Communication</span>
                      <span>{supplier.performance.communicationScore}%</span>
                    </div>
                    <Progress
                      value={supplier.performance.communicationScore}
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-xs">
                      <span>Reliability</span>
                      <span>{supplier.performance.reliabilityScore}%</span>
                    </div>
                    <Progress
                      value={supplier.performance.reliabilityScore}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">
                      Response Time
                    </span>
                    <span className="text-sm font-medium">
                      {supplier.responseTime}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">Established</span>
                    <span className="text-sm font-medium">
                      {supplier.established}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg">
                    <Package className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">Materials</span>
                    <span className="text-sm font-medium">
                      {supplier.materialsCount}+
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-lg">
                    <Shield className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-xs text-slate-500">
                      Certifications
                    </span>
                    <span className="text-sm font-medium">
                      {supplier.certifications.length}
                    </span>
                  </div>
                </div>
              </div>
              <Separator />{" "}
              <div className="pt-2">
                <Button
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  onClick={handleRequestQuote}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Request For Quote (RFQ)
                </Button>
              </div>
              {/* Quick RFQ Form */}
              <Card className="mt-6 bg-blue-50 border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-800 text-base">
                    Quick Quote Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      toast({
                        title: "Quick quote request sent",
                        description: `Your request has been sent to ${supplier.name}.`,
                      });
                    }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="quick-material">Material Type</Label>
                      <Input
                        id="quick-material"
                        placeholder="e.g., Cotton Canvas, Merino Wool"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="quick-quantity">Quantity</Label>
                        <Input id="quick-quantity" placeholder="Amount" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quick-unit">Unit</Label>
                        <Select defaultValue="meters">
                          <SelectTrigger id="quick-unit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="meters">Meters</SelectItem>
                            <SelectItem value="yards">Yards</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="kg">Kilograms</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quick-notes">Notes</Label>
                      <Textarea
                        id="quick-notes"
                        placeholder="Briefly describe your requirements"
                        className="h-20"
                      />
                    </div>
                    <div className="pt-2">
                      <Button type="submit" className="w-full">
                        Send Quick Request
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Main content - Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About {supplier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {supplier.description}
                  </p>

                  <h3 className="font-medium text-slate-800 mt-6 mb-3">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="bg-slate-100"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-medium text-slate-800 mt-6 mb-3">
                    Facility Gallery
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {supplier.gallery?.map((img, index) => (
                      <div
                        key={index}
                        className="aspect-video rounded-lg overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`${supplier.name} facility ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-800">
                  Materials from {supplier.name}
                </h3>
                <Link to="/materials">
                  <Button variant="outline" size="sm">
                    View All Materials
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {materials.map((material) => (
                  <MaterialCard
                    key={material.id}
                    material={material}
                    layout="list"
                    isFavorite={favorites.includes(material.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={() => {}}
                    onQuoteRequest={() => {}}
                    onSampleRequest={() => {}}
                    onContact={() => {}}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {supplier.certifications.map((cert) => {
                      let certDetails = {
                        name: cert,
                        description: "",
                        logo: "",
                      };

                      // Provide details for common certifications
                      if (cert === "GOTS") {
                        certDetails = {
                          name: "Global Organic Textile Standard (GOTS)",
                          description:
                            "The worldwide leading textile processing standard for organic fibers, including ecological and social criteria.",
                          logo: "https://global-standard.org/images/resource-library/gots-logo/GOTS_Logo_Colour.png",
                        };
                      } else if (cert === "OEKO-TEX Standard 100") {
                        certDetails = {
                          name: "OEKO-TEX Standard 100",
                          description:
                            "A worldwide consistent, independent testing and certification system for raw, semi-finished, and finished textile products at all processing levels.",
                          logo: "https://www.oeko-tex.com/fileadmin/user_upload/Logos/STANDARD_100_Logo_FC_RGB_Neutral.jpg",
                        };
                      } else if (cert === "Fair Trade Certified") {
                        certDetails = {
                          name: "Fair Trade Certified",
                          description:
                            "Certifies that products meet rigorous social, environmental, and economic standards including safe working conditions, environmental protection, and sustainable livelihoods.",
                          logo: "https://www.fairtradecertified.org/sites/default/files/filemanager/images/FTC-G_Transp-M.png",
                        };
                      }

                      return (
                        <div
                          key={cert}
                          className="flex flex-col p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 h-16 w-16 bg-slate-100 rounded flex items-center justify-center">
                              {certDetails.logo ? (
                                <img
                                  src={certDetails.logo}
                                  alt={certDetails.name}
                                  className="max-h-12 max-w-12"
                                />
                              ) : (
                                <Shield className="h-8 w-8 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-slate-800">
                                {certDetails.name}
                              </h3>
                              <p className="text-sm text-slate-500 mt-1">
                                Verified & Current
                              </p>
                            </div>
                          </div>
                          {certDetails.description && (
                            <p className="text-sm text-slate-600 mt-4">
                              {certDetails.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
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

export default SupplierProfile;
