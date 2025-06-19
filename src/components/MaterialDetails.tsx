import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  Building2,
  Award,
  Leaf,
  MessageSquare,
  Star,
  Info,
  FileText,
  Tag,
  Droplet,
  Scale,
  Ruler,
  Shield,
  Clock,
} from "lucide-react";
import FabricCertification from "./FabricCertification";
import SampleRequestForm from "./SampleRequestForm";

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

interface MaterialDetailsProps {
  material: MaterialForm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite?: (id: string) => void;
  onQuoteRequest?: (id: string) => void;
  onSampleRequest?: (id: string) => void;
  onContact?: (id: string) => void;
  isFavorite?: boolean;
}

const MaterialDetails: React.FC<MaterialDetailsProps> = ({
  material,
  open,
  onOpenChange,
  onToggleFavorite,
  onQuoteRequest,
  onSampleRequest,
  onContact,
  isFavorite = false,
}) => {
  const [isSampleRequestOpen, setSampleRequestOpen] = useState(false);

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{material.name}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFavorite?.(material.id || "")}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"
                }`}
              />
            </Button>
          </div>
          <DialogDescription>
            {material.category}{" "}
            {material.subcategory ? `› ${material.subcategory}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image/Placeholder */}
          <div className="bg-gradient-to-br from-slate-100 to-slate-200 aspect-square rounded-lg flex items-center justify-center relative">
            {material.image ? (
              <img
                src={material.image}
                alt={material.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="w-24 h-24 text-slate-400" />
            )}
            <div className="absolute top-3 right-3">
              {material.rating && (
                <div className="bg-black/60 text-white text-sm py-1 px-3 rounded-full flex items-center">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                  <span>{material.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              <Badge
                variant={
                  material.availability === "In Stock" ? "default" : "secondary"
                }
              >
                {material.availability}
              </Badge>
              {material.sustainability.length > 0 && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Leaf className="w-3 h-3 mr-1" />
                  Eco-Friendly
                </Badge>
              )}
            </div>
          </div>

          {/* Material Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-1">
                Composition
              </h3>
              <p className="text-slate-800">{material.composition}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">
                  Weight
                </h3>
                <p className="text-slate-800">{material.weight || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">
                  Width
                </h3>
                <p className="text-slate-800">{material.width || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">
                  Color
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-300"
                    style={{ backgroundColor: material.color }}
                  ></div>
                  <p className="text-slate-800">{material.color}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">
                  Finish
                </h3>
                <p className="text-slate-800">{material.finish}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500">Unit Price</div>
                  <div className="text-xl font-bold text-slate-800">
                    ${material.unitPrice.toFixed(2)}
                    <span className="text-sm font-normal text-slate-500">
                      /{material.type === "fabric" ? "yard" : "unit"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Bulk Price</div>
                  <div className="text-xl font-bold text-green-600">
                    ${material.bulkPrice.toFixed(2)}
                    <span className="text-sm font-normal text-slate-500">
                      /{material.type === "fabric" ? "yard" : "unit"}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Min qty: {material.bulkOrderQuantity}
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-md mt-2">
                <div className="flex items-center text-amber-800">
                  <Info className="w-4 h-4 mr-2 text-amber-600" />
                  <span className="text-sm">
                    Minimum order: {material.minimumOrder}{" "}
                    {material.type === "fabric" ? "yards" : "units"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-slate-500 mb-2">
                Supplier
              </h3>
              <div className="bg-slate-50 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span className="font-medium">{material.supplier}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{material.supplierLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{material.supplierContact || "Not available"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Lead time: {material.leadTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />
        
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="details" className="text-sm">
              Details
            </TabsTrigger>
            <TabsTrigger value="certifications" className="text-sm">
              Certifications
            </TabsTrigger>
            <TabsTrigger value="applications" className="text-sm">
              Applications
            </TabsTrigger>
            <TabsTrigger value="care" className="text-sm">
              Care Instructions
            </TabsTrigger>
            <TabsTrigger value="quality" className="text-sm">
              Quality Assurance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-500" />
                Description
              </h3>
              <p className="text-slate-600">{material.description}</p>
            </div>

            {material.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-slate-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {material.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                <Droplet className="w-4 h-4 mr-2 text-slate-500" />
                Season
              </h3>
              <p className="text-slate-600">
                {material.season || "All seasons"}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="certifications">
            <div className="space-y-4">
              {material.certifications.length > 0 ? (
                <>
                  <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-slate-500" />
                    Certifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {material.certifications.map((cert) => (
                      <div
                        key={cert}
                        className="flex items-center p-3 bg-slate-50 rounded-md"
                      >
                        <Award className="w-5 h-5 text-amber-600 mr-2" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-slate-500 italic">
                  No certifications provided
                </p>
              )}

              {material.sustainability.length > 0 && (
                <>
                  <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center mt-4">
                    <Leaf className="w-4 h-4 mr-2 text-slate-500" />
                    Sustainability Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {material.sustainability.map((item) => (
                      <div
                        key={item}
                        className="flex items-center p-3 bg-green-50 rounded-md"
                      >
                        <Leaf className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="applications">
            {material.applications.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {material.applications.map((app) => (
                  <div key={app} className="p-3 bg-slate-50 rounded-md">
                    <span>{app}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">
                No specific applications provided
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="care">
            {material.careInstructions ? (
              <div className="p-4 bg-slate-50 rounded-md">
                <h3 className="text-sm font-medium text-slate-700 mb-2">
                  Care Instructions
                </h3>
                <p className="text-slate-600 whitespace-pre-line">
                  {material.careInstructions}
                </p>
              </div>
            ) : (
              <p className="text-slate-500 italic">
                No care instructions provided
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="quality">
            {/* Mock certification data for demonstration */}
            <FabricCertification
              materialId={material.id || ""}
              materialName={material.name}
              certifications={[
                {
                  id: "cert1",
                  name: "OEKO-TEX® Standard 100",
                  issuer: "OEKO-TEX Association",
                  issuedDate: "2023-04-15",
                  expiryDate: "2024-04-15",
                  status: "active",
                  documentUrl: "#",
                  iconUrl: "",
                  description: "Tested for harmful substances",
                },
                {
                  id: "cert2",
                  name: "GOTS (Global Organic Textile Standard)",
                  issuer: "Control Union",
                  issuedDate: "2023-02-10",
                  expiryDate: "2024-02-10",
                  status: "active",
                  documentUrl: "#",
                  iconUrl: "",
                  description: "Certified organic textile",
                },
              ]}
              testResults={[
                {
                  id: "test1",
                  name: "Colorfastness to Washing",
                  standard: "ISO 105-C06",
                  method: "A1S",
                  result: "Grade 4-5",
                  status: "pass",
                  date: "2023-05-20",
                  notes: "Excellent color retention after washing",
                  reportId: "CR-23005",
                },
                {
                  id: "test2",
                  name: "Tear Strength",
                  standard: "ASTM D1424",
                  method: "Standard",
                  result: "Warp: 2500g, Weft: 2300g",
                  status: "pass",
                  date: "2023-05-18",
                  reportId: "TR-23018",
                },
              ]}
              onDownloadReport={(reportId) => {
                console.log(`Downloading report ${reportId}`);
              }}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onContact?.(material.id || "")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Supplier
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setSampleRequestOpen(true)}
          >
            <Package className="w-4 h-4 mr-2" />
            Request Sample
          </Button>
          <Button
            className="flex-1"
            onClick={() => onQuoteRequest?.(material.id || "")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Request Quote
          </Button>
        </DialogFooter>
        
        {/* Sample Request Form Dialog */}
        <Dialog
          open={isSampleRequestOpen}
          onOpenChange={setSampleRequestOpen}
          modal
        >
          <SampleRequestForm
            material={{
              id: material.id || '',
              name: material.name,
              supplier: {
                id: 'supplier-1',
                name: material.supplier,
                location: material.supplierLocation
              }
            }}
            onSubmit={(data) => {
              setSampleRequestOpen(false);
              onSampleRequest?.(material.id || "");
            }}
            onCancel={() => setSampleRequestOpen(false)}
          />
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetails;
