import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Heart,
  Eye,
  ShoppingCart,
  MapPin,
  Building2,
  Award,
  Leaf,
  MessageSquare,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface MaterialCardProps {
  material: MaterialForm;
  layout?: "grid" | "list";
  onToggleFavorite?: (id: string) => void;
  onQuoteRequest?: (id: string) => void;
  onSampleRequest?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onContact?: (id: string) => void;
  isFavorite?: boolean;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  layout = "grid",
  onToggleFavorite,
  onQuoteRequest,
  onSampleRequest,
  onViewDetails,
  onContact,
  isFavorite = false,
}) => {
  if (layout === "list") {
    return (
      <Card
        key={material.id}
        className="hover:shadow-md transition-shadow border border-slate-200 bg-white"
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden"
              onClick={() => onViewDetails?.(material.id || "")}
            >
              {material.image ? (
                <img
                  src={material.image}
                  alt={material.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-8 h-8 text-slate-400" />
              )}
              {material.rating && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-0.5 flex items-center justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.round(material.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3
                    className="font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                    onClick={() => onViewDetails?.(material.id || "")}
                  >
                    {material.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {material.composition}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => onToggleFavorite?.(material.id || "")}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite
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
                  <div
                    className="font-medium flex items-center gap-1 cursor-pointer"
                    onClick={() => onContact?.(material.id || "")}
                  >
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
                <div className="flex gap-1 flex-wrap">
                  {material.certifications.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onContact?.(material.id || "")}
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSampleRequest?.(material.id || "")}
                  >
                    Sample
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onQuoteRequest?.(material.id || "")}
                  >
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
  }

  // Grid view
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-slate-200 bg-white h-full flex flex-col">
      <div
        className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden rounded-t-lg cursor-pointer"
        onClick={() => onViewDetails?.(material.id || "")}
      >
        {material.image ? (
          <img
            src={material.image}
            alt={material.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <Package className="w-16 h-16" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(material.id || "");
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"
              }`}
            />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(material.id || "");
            }}
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
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
          <Badge
            variant={
              material.availability === "In Stock" ? "default" : "secondary"
            }
          >
            {material.availability}
          </Badge>

          {material.rating && (
            <div className="bg-black/50 text-white text-xs py-1 px-2 rounded-full flex items-center">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" />
              <span>{material.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-3 flex-1">
          <h3
            className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer"
            onClick={() => onViewDetails?.(material.id || "")}
          >
            {material.name}
          </h3>
          <p className="text-sm text-slate-600 mt-1 line-clamp-1">
            {material.composition}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
          <Building2 className="w-4 h-4" />
          <span
            className="font-medium cursor-pointer hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onContact?.(material.id || "");
            }}
          >
            {material.supplier}
          </span>
          <MapPin className="w-3 h-3 ml-1" />
          <span className="text-xs truncate">{material.supplierLocation}</span>
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
              ${material.unitPrice.toFixed(2)}
              <span className="text-sm font-normal text-slate-500">
                /{material.type === "fabric" ? "yard" : "unit"}
              </span>
            </div>
            <div className="text-sm text-green-600">
              Bulk: ${material.bulkPrice.toFixed(2)}
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

        <div className="flex gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onQuoteRequest?.(material.id || "")}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Request Quote
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSampleRequest?.(material.id || "")}
          >
            Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaterialCard;
