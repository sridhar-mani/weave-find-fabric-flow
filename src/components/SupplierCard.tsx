import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  Star,
  Clock,
  Package,
  Shield,
  ExternalLink,
  MessageSquare,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SupplierInfo {
  id: string;
  name: string;
  location: string;
  logo?: string;
  specialties?: string[];
  rating?: number;
  responseTime?: string;
  materialsCount?: number;
  certifications?: string[];
  description?: string;
}

interface SupplierCardProps {
  supplier: SupplierInfo;
  variant?: "compact" | "full";
  className?: string;
  showActions?: boolean;
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  variant = "full",
  className,
  showActions = true,
}) => {
  const isCompact = variant === "compact";

  return (
    <Card className={cn("bg-white overflow-hidden", className)}>
      {!isCompact && (
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Supplier Information</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(isCompact ? "p-3" : "pt-3")}>
        <div className="flex items-center gap-3">
          <Avatar className={cn(isCompact ? "h-10 w-10" : "h-12 w-12")}>
            <AvatarImage src={supplier.logo} alt={supplier.name} />
            <AvatarFallback>
              <Building2 className="w-6 h-6 text-slate-400" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "font-medium truncate",
                  isCompact ? "text-sm" : "text-base"
                )}
              >
                {supplier.name}
              </h3>

              {supplier.rating && !isCompact && (
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  <span className="font-medium">{supplier.rating}</span>
                </div>
              )}
            </div>

            <div
              className={cn(
                "text-slate-500 flex items-center",
                isCompact ? "text-xs" : "text-sm"
              )}
            >
              <MapPin
                className={cn("mr-1", isCompact ? "w-3 h-3" : "w-4 h-4")}
              />
              {supplier.location}
            </div>
          </div>
        </div>

        {!isCompact && (
          <>
            {supplier.specialties && supplier.specialties.length > 0 && (
              <div className="mt-3">
                <div className="text-xs text-slate-500 mb-1">Specialties</div>
                <div className="flex flex-wrap gap-1">
                  {supplier.specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mt-3">
              {supplier.responseTime && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Response Time</div>
                    <div className="text-sm">{supplier.responseTime}</div>
                  </div>
                </div>
              )}

              {supplier.materialsCount !== undefined && (
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Materials</div>
                    <div className="text-sm">{supplier.materialsCount}</div>
                  </div>
                </div>
              )}

              {supplier.certifications &&
                supplier.certifications.length > 0 && (
                  <div className="flex items-start gap-2 col-span-2">
                    <Shield className="w-4 h-4 text-slate-400 mt-0.5" />
                    <div>
                      <div className="text-xs text-slate-500">
                        Certifications
                      </div>
                      <div className="text-sm">
                        {supplier.certifications.slice(0, 2).join(", ")}
                        {supplier.certifications.length > 2 &&
                          ` +${supplier.certifications.length - 2} more`}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {supplier.description && (
              <div className="mt-3 text-sm text-slate-600">
                <p className="line-clamp-2">{supplier.description}</p>
              </div>
            )}
          </>
        )}

        {showActions && (
          <div className="flex flex-col gap-2 mt-3">
            <Link to={`/suppliers/${supplier.id}`} className="w-full">
              <Button
                variant="outline"
                size={isCompact ? "sm" : "default"}
                className="w-full"
              >
                <Building2
                  className={cn("mr-2", isCompact ? "w-3 h-3" : "w-4 h-4")}
                />
                View Profile
              </Button>
            </Link>

            {!isCompact && (
              <>
                <Link
                  to={`/quotes/new?supplier=${supplier.id}`}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Request Quote
                  </Button>
                </Link>

                <Link
                  to={`/messages?supplier=${supplier.id}`}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupplierCard;
