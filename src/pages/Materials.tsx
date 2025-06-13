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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Save,
  X,
  Package,
  Scissors,
  Circle,
  Search,
  Grid,
  List,
  Eye,
  ShoppingCart,
  Heart,
  MapPin,
  Building2,
  Award,
  Leaf,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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
}

const Materials = () => {
  const [activeTab, setActiveTab] = useState("fabrics");
  const [viewMode, setViewMode] = useState<"browse" | "add">("browse");
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    priceRange: "",
    availability: "",
    sustainability: false,
  });
  const [materials, setMaterials] = useState<MaterialForm[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const [fabricForm, setFabricForm] = useState<MaterialForm>({
    name: "",
    category: "",
    subcategory: "",
    type: "fabric",
    composition: "",
    weight: "",
    width: "",
    color: "",
    finish: "",
    supplier: "",
    supplierContact: "",
    supplierLocation: "",
    unitPrice: 0,
    bulkPrice: 0,
    minimumOrder: 1,
    bulkOrderQuantity: 100,
    currency: "USD",
    leadTime: "",
    availability: "",
    certifications: [],
    sustainability: [],
    careInstructions: "",
    description: "",
    applications: [],
    season: "",
    tags: [],
  });

  const [trimForm, setTrimForm] = useState<MaterialForm>({
    name: "",
    category: "",
    subcategory: "",
    type: "trim",
    composition: "",
    thickness: "",
    color: "",
    finish: "",
    supplier: "",
    supplierContact: "",
    supplierLocation: "",
    unitPrice: 0,
    bulkPrice: 0,
    minimumOrder: 1,
    bulkOrderQuantity: 1000,
    currency: "USD",
    leadTime: "",
    availability: "",
    certifications: [],
    sustainability: [],
    careInstructions: "",
    description: "",
    applications: [],
    season: "",
    tags: [],
  });

  const [accessoryForm, setAccessoryForm] = useState<MaterialForm>({
    name: "",
    category: "",
    subcategory: "",
    type: "accessory",
    composition: "",
    color: "",
    finish: "",
    supplier: "",
    supplierContact: "",
    supplierLocation: "",
    unitPrice: 0,
    bulkPrice: 0,
    minimumOrder: 1,
    bulkOrderQuantity: 500,
    currency: "USD",
    leadTime: "",
    availability: "",
    certifications: [],
    sustainability: [],
    careInstructions: "",
    description: "",
    applications: [],
    season: "",
    tags: [],
  });

  const fabricCategories = {
    Cotton: ["Woven", "Knit", "Denim", "Canvas", "Poplin", "Twill", "Jersey"],
    Silk: ["Charmeuse", "Chiffon", "Crepe", "Taffeta", "Organza", "Satin"],
    Wool: ["Worsted", "Woolen", "Felt", "Cashmere", "Merino", "Tweed"],
    Synthetic: ["Polyester", "Nylon", "Acrylic", "Spandex", "Rayon"],
    Linen: ["Pure Linen", "Linen Blend", "Hemp", "Ramie"],
    Blends: ["Cotton-Poly", "Wool-Silk", "Cotton-Spandex", "Tri-blend"],
  };

  const trimCategories = {
    Fasteners: ["Buttons", "Zippers", "Snaps", "Hooks", "Velcro", "Grommets"],
    Decorative: ["Lace", "Ribbon", "Braid", "Fringe", "Tassels", "Beading"],
    Structural: ["Elastic", "Binding", "Piping", "Cord", "Webbing"],
    Labels: ["Woven Labels", "Printed Labels", "Care Labels", "Size Labels"],
  };
  const accessoryCategories = {
    Hardware: ["Buckles", "Rings", "Chains", "Rivets", "Studs", "Eyelets"],
    Padding: ["Shoulder Pads", "Chest Pieces", "Interfacing", "Batting"],
    Closure: ["Magnetic Snaps", "Toggle Buttons", "Drawstring", "Ties"],
    Packaging: ["Hangtags", "Bags", "Boxes", "Tissue Paper", "Stickers"],
  };

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
    },
  ];

  useEffect(() => {
    setMaterials(sampleMaterials);
  }, []);

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedFilters.category === "all" ||
      !selectedFilters.category ||
      material.category === selectedFilters.category;
    const matchesAvailability =
      selectedFilters.availability === "all" ||
      !selectedFilters.availability ||
      material.availability === selectedFilters.availability;
    const matchesSustainability =
      !selectedFilters.sustainability || material.sustainability.length > 0;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesAvailability &&
      matchesSustainability
    );
  });

  const toggleFavorite = (materialId: string) => {
    setFavorites((prev) =>
      prev.includes(materialId)
        ? prev.filter((id) => id !== materialId)
        : [...prev, materialId]
    );
  };

  const renderMaterialCard = (material: MaterialForm) => (
    <Card
      key={material.id}
      className="group hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden rounded-t-lg">
        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
          <Package className="w-16 h-16" />
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          {" "}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={() => toggleFavorite(material.id || "")}
          >
            <Heart
              className={`w-4 h-4 ${
                favorites.includes(material.id || "")
                  ? "fill-red-500 text-red-500"
                  : "text-slate-600"
              }`}
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
          >
            <Eye className="w-4 h-4 text-slate-600" />
          </Button>
        </div>
        {material.sustainability.length > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Leaf className="w-3 h-3 mr-1" />
              Eco-Friendly
            </Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <Badge
            variant={
              material.availability === "In Stock" ? "default" : "secondary"
            }
          >
            {material.availability}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
            {material.name}
          </h3>
          <p className="text-sm text-slate-600 mt-1">{material.composition}</p>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
          <Building2 className="w-4 h-4" />
          <span className="font-medium">{material.supplier}</span>
          <MapPin className="w-3 h-3 ml-1" />
          <span className="text-xs">{material.supplierLocation}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          {material.weight && (
            <div className="flex justify-between">
              <span className="text-slate-500">Weight:</span>
              <span className="font-medium">{material.weight}</span>
            </div>
          )}
          {material.width && (
            <div className="flex justify-between">
              <span className="text-slate-500">Width:</span>
              <span className="font-medium">{material.width}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {material.certifications.slice(0, 2).map((cert) => (
            <Badge key={cert} variant="outline" className="text-xs">
              <Award className="w-3 h-3 mr-1" />
              {cert}
            </Badge>
          ))}
        </div>

        <Separator className="my-3" />

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-lg font-bold text-slate-800">
              ${material.unitPrice}
              <span className="text-sm font-normal text-slate-500">
                /{material.type === "fabric" ? "yard" : "unit"}
              </span>
            </div>
            <div className="text-sm text-green-600">
              Bulk: ${material.bulkPrice}
              <span className="text-xs text-slate-500">
                {" "}
                (min {material.bulkOrderQuantity})
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>MOQ: {material.minimumOrder}</div>
            <div>{material.leadTime}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Request Quote
          </Button>
          <Button size="sm" variant="outline">
            Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderMaterialList = (material: MaterialForm) => (
    <Card
      key={material.id}
      className="hover:shadow-md transition-shadow border border-slate-200"
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-8 h-8 text-slate-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                  {material.name}
                </h3>
                <p className="text-sm text-slate-600">{material.composition}</p>
              </div>
              <div className="flex gap-2">
                {" "}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => toggleFavorite(material.id || "")}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(material.id || "")
                        ? "fill-red-500 text-red-500"
                        : "text-slate-600"
                    }`}
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-slate-500 text-xs">Supplier</div>
                <div className="font-medium flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {material.supplier}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {material.supplierLocation}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-xs">Specifications</div>
                <div className="space-y-1">
                  {material.weight && <div>{material.weight}</div>}
                  {material.width && <div>{material.width} wide</div>}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-xs">Pricing</div>
                <div className="font-semibold">
                  ${material.unitPrice}/
                  {material.type === "fabric" ? "yard" : "unit"}
                </div>
                <div className="text-green-600 text-xs">
                  Bulk: ${material.bulkPrice}
                </div>
                <div className="text-slate-500 text-xs">
                  MOQ: {material.minimumOrder}
                </div>
              </div>

              <div>
                <div className="text-slate-500 text-xs">Availability</div>
                <Badge
                  variant={
                    material.availability === "In Stock"
                      ? "default"
                      : "secondary"
                  }
                  className="mb-1"
                >
                  {material.availability}
                </Badge>
                <div className="text-xs text-slate-500">
                  {material.leadTime}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                {material.certifications.slice(0, 3).map((cert) => (
                  <Badge key={cert} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
                {material.sustainability.length > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    <Leaf className="w-3 h-3 mr-1" />
                    Sustainable
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Sample
                </Button>
                <Button size="sm">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Quote
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const updateForm = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    field: keyof MaterialForm,
    value: any
  ) => {
    setForm({ ...form, [field]: value });
  };

  const addToArray = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    field: keyof MaterialForm,
    value: string
  ) => {
    const trimmedValue = value.trim();
    const currentArray = form[field] as string[];
    if (trimmedValue && !currentArray.includes(trimmedValue)) {
      setForm({
        ...form,
        [field]: [...currentArray, trimmedValue],
      });
    }
  };

  const removeFromArray = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    field: keyof MaterialForm,
    value: string
  ) => {
    setForm({
      ...form,
      [field]: (form[field] as string[]).filter((item) => item !== value),
    });
  };
  const resetForm = (
    setForm: (form: MaterialForm) => void,
    type: MaterialForm["type"]
  ) => {
    let defaultBulkQuantity = 500;
    if (type === "fabric") {
      defaultBulkQuantity = 100;
    } else if (type === "trim") {
      defaultBulkQuantity = 1000;
    }

    const emptyForm: MaterialForm = {
      name: "",
      category: "",
      subcategory: "",
      type,
      composition: "",
      weight: type === "fabric" ? "" : undefined,
      width: type === "fabric" ? "" : undefined,
      thickness: type === "trim" ? "" : undefined,
      color: "",
      finish: "",
      supplier: "",
      supplierContact: "",
      supplierLocation: "",
      unitPrice: 0,
      bulkPrice: 0,
      minimumOrder: 1,
      bulkOrderQuantity: defaultBulkQuantity,
      currency: "USD",
      leadTime: "",
      availability: "",
      certifications: [],
      sustainability: [],
      careInstructions: "",
      description: "",
      applications: [],
      season: "",
      tags: [],
    };
    setForm(emptyForm);
  };

  const saveMaterial = async (form: MaterialForm) => {
    if (!form.name || !form.category || !form.supplier || !form.unitPrice) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields (Name, Category, Supplier, Unit Price).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("materials").insert([
        {
          ...form,
          user_id: user?.id,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Material Saved",
        description: `${form.name} has been added to your materials database.`,
      });

      if (form.type === "fabric") {
        resetForm(setFabricForm, "fabric");
      } else if (form.type === "trim") {
        resetForm(setTrimForm, "trim");
      } else {
        resetForm(setAccessoryForm, "accessory");
      }
    } catch (error) {
      console.error("Failed to save material:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    categories: Record<string, string[]>
  ) => (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Material Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) =>
                  updateForm(form, setForm, "name", e.target.value)
                }
                placeholder="e.g., Premium Cotton Twill"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="composition">Composition *</Label>
              <Input
                id="composition"
                value={form.composition}
                onChange={(e) =>
                  updateForm(form, setForm, "composition", e.target.value)
                }
                placeholder="e.g., 100% Cotton, 95% Cotton 5% Spandex"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(value) => {
                  updateForm(form, setForm, "category", value);
                  updateForm(form, setForm, "subcategory", "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <Select
                value={form.subcategory}
                onValueChange={(value) =>
                  updateForm(form, setForm, "subcategory", value)
                }
                disabled={!form.category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {form.category &&
                    categories[form.category]?.map((subcat) => (
                      <SelectItem key={subcat} value={subcat}>
                        {subcat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={form.color}
                onChange={(e) =>
                  updateForm(form, setForm, "color", e.target.value)
                }
                placeholder="e.g., Navy Blue, #1a365d"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="finish">Finish</Label>
              <Input
                id="finish"
                value={form.finish}
                onChange={(e) =>
                  updateForm(form, setForm, "finish", e.target.value)
                }
                placeholder="e.g., Matte, Glossy, Brushed"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {form.type === "fabric" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (GSM)</Label>
                  <Input
                    id="weight"
                    value={form.weight || ""}
                    onChange={(e) =>
                      updateForm(form, setForm, "weight", e.target.value)
                    }
                    placeholder="e.g., 280"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="width">Width (cm)</Label>
                  <Input
                    id="width"
                    value={form.width || ""}
                    onChange={(e) =>
                      updateForm(form, setForm, "width", e.target.value)
                    }
                    placeholder="e.g., 150"
                  />
                </div>
              </>
            )}

            {form.type === "trim" && (
              <div className="space-y-2">
                <Label htmlFor="thickness">Thickness (mm)</Label>
                <Input
                  id="thickness"
                  value={form.thickness || ""}
                  onChange={(e) =>
                    updateForm(form, setForm, "thickness", e.target.value)
                  }
                  placeholder="e.g., 2.5"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select
                value={form.season}
                onValueChange={(value) =>
                  updateForm(form, setForm, "season", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Season">All Season</SelectItem>
                  <SelectItem value="Spring/Summer">Spring/Summer</SelectItem>
                  <SelectItem value="Fall/Winter">Fall/Winter</SelectItem>
                  <SelectItem value="Holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supplier Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier Name *</Label>
              <Input
                id="supplier"
                value={form.supplier}
                onChange={(e) =>
                  updateForm(form, setForm, "supplier", e.target.value)
                }
                placeholder="Supplier company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierContact">Contact</Label>
              <Input
                id="supplierContact"
                value={form.supplierContact}
                onChange={(e) =>
                  updateForm(form, setForm, "supplierContact", e.target.value)
                }
                placeholder="Email or phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierLocation">Location</Label>
              <Input
                id="supplierLocation"
                value={form.supplierLocation}
                onChange={(e) =>
                  updateForm(form, setForm, "supplierLocation", e.target.value)
                }
                placeholder="Country/Region"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing & Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <div className="flex gap-2">
                <Input
                  id="unitPrice"
                  type="number"
                  value={form.unitPrice}
                  onChange={(e) =>
                    updateForm(
                      form,
                      setForm,
                      "unitPrice",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <Select
                  value={form.currency}
                  onValueChange={(value) =>
                    updateForm(form, setForm, "currency", value)
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulkPrice">Bulk Price</Label>
              <Input
                id="bulkPrice"
                type="number"
                value={form.bulkPrice}
                onChange={(e) =>
                  updateForm(
                    form,
                    setForm,
                    "bulkPrice",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumOrder">Min Order</Label>
              <Input
                id="minimumOrder"
                type="number"
                value={form.minimumOrder}
                onChange={(e) =>
                  updateForm(
                    form,
                    setForm,
                    "minimumOrder",
                    parseInt(e.target.value) || 1
                  )
                }
                placeholder="1"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulkOrderQuantity">Bulk Quantity</Label>
              <Input
                id="bulkOrderQuantity"
                type="number"
                value={form.bulkOrderQuantity}
                onChange={(e) =>
                  updateForm(
                    form,
                    setForm,
                    "bulkOrderQuantity",
                    parseInt(e.target.value) || 100
                  )
                }
                placeholder="100"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead Time</Label>
              <Input
                id="leadTime"
                value={form.leadTime}
                onChange={(e) =>
                  updateForm(form, setForm, "leadTime", e.target.value)
                }
                placeholder="e.g., 2-3 weeks, 10-15 days"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={form.availability}
                onValueChange={(value) =>
                  updateForm(form, setForm, "availability", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Pre-Order">Pre-Order</SelectItem>
                  <SelectItem value="Custom Order">Custom Order</SelectItem>
                  <SelectItem value="Seasonal">Seasonal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Array fields with tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Certifications</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.certifications.map((cert) => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {cert}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        removeFromArray(form, setForm, "certifications", cert)
                      }
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add certification (e.g., OEKO-TEX, GOTS)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToArray(
                        form,
                        setForm,
                        "certifications",
                        e.currentTarget.value
                      );
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addToArray(
                      form,
                      setForm,
                      "certifications",
                      input?.value || ""
                    );
                    if (input) input.value = "";
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sustainability</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.sustainability.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {item}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        removeFromArray(form, setForm, "sustainability", item)
                      }
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add sustainability feature"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToArray(
                        form,
                        setForm,
                        "sustainability",
                        e.currentTarget.value
                      );
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addToArray(
                      form,
                      setForm,
                      "sustainability",
                      input?.value || ""
                    );
                    if (input) input.value = "";
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applications</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.applications.map((app) => (
                  <Badge
                    key={app}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {app}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        removeFromArray(form, setForm, "applications", app)
                      }
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add application (e.g., Shirts, Dresses)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToArray(
                        form,
                        setForm,
                        "applications",
                        e.currentTarget.value
                      );
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addToArray(
                      form,
                      setForm,
                      "applications",
                      input?.value || ""
                    );
                    if (input) input.value = "";
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() =>
                        removeFromArray(form, setForm, "tags", tag)
                      }
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addToArray(form, setForm, "tags", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget
                      .previousElementSibling as HTMLInputElement;
                    addToArray(form, setForm, "tags", input?.value || "");
                    if (input) input.value = "";
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="careInstructions">Care Instructions</Label>
              <Textarea
                id="careInstructions"
                value={form.careInstructions}
                onChange={(e) =>
                  updateForm(form, setForm, "careInstructions", e.target.value)
                }
                placeholder="Washing, drying, and maintenance instructions"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  updateForm(form, setForm, "description", e.target.value)
                }
                placeholder="Detailed description, features, and characteristics"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 pt-4">
        <Button
          onClick={() => saveMaterial(form)}
          disabled={isLoading}
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Material
        </Button>
        <Button
          variant="outline"
          onClick={() => resetForm(setForm, form.type)}
          disabled={isLoading}
        >
          Clear Form
        </Button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access the materials database.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">
            Textile Materials Marketplace
          </h1>
          <p className="text-stone-600">
            Source premium fabrics, trims, and accessories from verified
            suppliers worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search materials, suppliers, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select
                value={selectedFilters.category}
                onValueChange={(value) =>
                  setSelectedFilters((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Cotton">Cotton</SelectItem>
                  <SelectItem value="Silk">Silk</SelectItem>
                  <SelectItem value="Wool">Wool</SelectItem>
                  <SelectItem value="Synthetic">Synthetic</SelectItem>
                  <SelectItem value="Blends">Blends</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedFilters.availability}
                onValueChange={(value) =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    availability: value,
                  }))
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Pre-Order">Pre-Order</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedFilters((prev) => ({
                    ...prev,
                    sustainability: !prev.sustainability,
                  }))
                }
                className={
                  selectedFilters.sustainability
                    ? "bg-green-50 border-green-200"
                    : ""
                }
              >
                <Leaf className="w-4 h-4 mr-2" />
                Eco-Friendly
              </Button>
            </div>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-white border border-slate-200">
                <TabsTrigger
                  value="fabrics"
                  className="flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  Fabrics
                </TabsTrigger>
                <TabsTrigger value="trims" className="flex items-center gap-2">
                  <Circle className="w-4 h-4" />
                  Trims
                </TabsTrigger>
                <TabsTrigger
                  value="accessories"
                  className="flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  Accessories
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="text-sm text-slate-600">
              {filteredMaterials.length} materials found
            </div>
          </div>

          <div className="flex items-center gap-2">
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

            <Button
              onClick={() =>
                setViewMode(viewMode === "browse" ? "add" : "browse")
              }
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {viewMode === "browse" ? "Add Material" : "Back to Browse"}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === "browse" ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="fabrics" className="mt-0">
              {displayMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials
                    .filter((m) => m.type === "fabric")
                    .map((material) => renderMaterialCard(material))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials
                    .filter((m) => m.type === "fabric")
                    .map((material) => renderMaterialList(material))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="trims" className="mt-0">
              {displayMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials
                    .filter((m) => m.type === "trim")
                    .map((material) => renderMaterialCard(material))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials
                    .filter((m) => m.type === "trim")
                    .map((material) => renderMaterialList(material))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="accessories" className="mt-0">
              {displayMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMaterials
                    .filter((m) => m.type === "accessory")
                    .map((material) => renderMaterialCard(material))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMaterials
                    .filter((m) => m.type === "accessory")
                    .map((material) => renderMaterialList(material))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="fabrics">
              {renderFormFields(fabricForm, setFabricForm, fabricCategories)}
            </TabsContent>

            <TabsContent value="trims">
              {renderFormFields(trimForm, setTrimForm, trimCategories)}
            </TabsContent>

            <TabsContent value="accessories">
              {renderFormFields(
                accessoryForm,
                setAccessoryForm,
                accessoryCategories
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Empty State */}
        {viewMode === "browse" && filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">
              No materials found
            </h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => setViewMode("add")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Material
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
