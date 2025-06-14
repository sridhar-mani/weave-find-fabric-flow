import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Box,
  Ruler,
  ArrowLeft,
  CheckCircle,
  Factory,
  BoxSelect,
  History,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import SampleRequestForm from "@/components/SampleRequestForm";
import { format } from "date-fns";

// Mock data for sample requests history
const sampleRequestsHistory = [
  {
    id: "sr-001",
    material: {
      id: "mat-001",
      name: "Cotton Canvas",
      supplier: {
        id: "sup-001",
        name: "Textile Solutions Inc.",
        location: "New York, USA",
        contactEmail: "sales@textilesolutions.com",
      },
      type: "fabric",
      color: "Natural White",
      composition: "100% Organic Cotton",
      weight: "400 GSM",
      minimumOrderQuantity: 50,
    },
    requestDate: "2023-09-15",
    status: "delivered",
    trackingNumber: "TRK9283745628",
    deliveryDate: "2023-09-25",
    quantity: 2,
    sampleType: "swatch",
    notes: "Need to check hand feel and colorfastness",
  },
  {
    id: "sr-002",
    material: {
      id: "mat-002",
      name: "Merino Wool Jersey",
      supplier: {
        id: "sup-002",
        name: "Woolmark Fabrics",
        location: "Manchester, UK",
        contactEmail: "info@woolmarkfabrics.com",
      },
      type: "fabric",
      color: "Heather Grey",
      composition: "95% Merino Wool, 5% Elastane",
      weight: "220 GSM",
      minimumOrderQuantity: 100,
    },
    requestDate: "2023-10-05",
    status: "in-transit",
    trackingNumber: "TRK8372615493",
    quantity: 1,
    sampleType: "yardage",
    notes: "Testing for winter collection, need 1 yard for prototype",
  },
  {
    id: "sr-003",
    material: {
      id: "mat-003",
      name: "Recycled Polyester Ripstop",
      supplier: {
        id: "sup-003",
        name: "EcoFabrics Global",
        location: "Seoul, South Korea",
        contactEmail: "orders@ecofabrics.co",
      },
      type: "fabric",
      color: "Navy Blue",
      composition: "100% Recycled Polyester",
      weight: "85 GSM",
      minimumOrderQuantity: 200,
    },
    requestDate: "2023-10-20",
    status: "processing",
    quantity: 3,
    sampleType: "swatch",
    notes: "Need to check water resistance and durability",
  },
];

// Material selection for new sample requests
const availableMaterials = [
  {
    id: "mat-001",
    name: "Cotton Canvas",
    supplier: {
      id: "sup-001",
      name: "Textile Solutions Inc.",
      location: "New York, USA",
      contactEmail: "sales@textilesolutions.com",
    },
    type: "fabric",
    color: "Natural White",
    composition: "100% Organic Cotton",
    weight: "400 GSM",
    minimumOrderQuantity: 50,
  },
  {
    id: "mat-002",
    name: "Merino Wool Jersey",
    supplier: {
      id: "sup-002",
      name: "Woolmark Fabrics",
      location: "Manchester, UK",
      contactEmail: "info@woolmarkfabrics.com",
    },
    type: "fabric",
    color: "Heather Grey",
    composition: "95% Merino Wool, 5% Elastane",
    weight: "220 GSM",
    minimumOrderQuantity: 100,
  },
  {
    id: "mat-003",
    name: "Recycled Polyester Ripstop",
    supplier: {
      id: "sup-003",
      name: "EcoFabrics Global",
      location: "Seoul, South Korea",
      contactEmail: "orders@ecofabrics.co",
    },
    type: "fabric",
    color: "Navy Blue",
    composition: "100% Recycled Polyester",
    weight: "85 GSM",
    minimumOrderQuantity: 200,
  },
  {
    id: "mat-004",
    name: "Hemp Linen Blend",
    supplier: {
      id: "sup-004",
      name: "Natural Textiles Co.",
      location: "Portland, USA",
      contactEmail: "hello@naturaltextiles.com",
    },
    type: "fabric",
    color: "Sage Green",
    composition: "55% Hemp, 45% Linen",
    weight: "180 GSM",
    minimumOrderQuantity: 75,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "in-transit":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "processing":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return <CheckCircle className="w-4 h-4 mr-1" />;
    case "in-transit":
      return <Box className="w-4 h-4 mr-1" />;
    case "processing":
      return <Factory className="w-4 h-4 mr-1" />;
    case "cancelled":
      return <Box className="w-4 h-4 mr-1" />;
    default:
      return <Package className="w-4 h-4 mr-1" />;
  }
};

interface SampleRequestProps {}

const SampleRequest: React.FC<SampleRequestProps> = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMaterial, setSelectedMaterial] = useState(
    availableMaterials[0]
  );

  const handleSubmit = (data: any) => {
    console.log("Sample request submitted:", data);
    toast({
      title: "Sample Request Submitted",
      description: `Your request for ${selectedMaterial.name} samples has been sent to the supplier.`,
    });
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title="Sample Requests"
        description="Request and manage fabric and material samples from suppliers"
        icon={<Package className="w-5 h-5" />}
      >
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </PageHeader>

      <div className="mt-8">
        <Tabs defaultValue="new">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="new" className="text-center py-3">
              <BoxSelect className="w-4 h-4 mr-2" />
              New Sample Request
            </TabsTrigger>
            <TabsTrigger value="history" className="text-center py-3">
              <History className="w-4 h-4 mr-2" />
              Request History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Material</CardTitle>
                    <CardDescription>
                      Choose a material to request samples
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {availableMaterials.map((material) => (
                      <div
                        key={material.id}
                        className={`p-3 border rounded-md cursor-pointer transition-all ${
                          selectedMaterial.id === material.id
                            ? "border-primary bg-primary/5"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => setSelectedMaterial(material)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{material.name}</h3>
                            <p className="text-sm text-slate-600">
                              {material.composition}
                            </p>
                          </div>
                          <div
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: material.color }}
                          ></div>
                        </div>
                        <div className="mt-2 text-sm text-slate-500">
                          {material.supplier.name}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-slate-500">
                          <Ruler className="w-3 h-3 mr-1" />
                          {material.weight}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Form</CardTitle>
                    <CardDescription>
                      Fill out the details to request samples from the supplier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SampleRequestForm
                      material={selectedMaterial}
                      onSubmit={handleSubmit}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Sample Request History</CardTitle>
                <CardDescription>
                  Track and manage your sample requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleRequestsHistory.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">
                            {request.material.name}
                          </h3>
                          <p className="text-sm text-slate-600">
                            {request.material.supplier.name} &middot;{" "}
                            {request.material.composition}
                          </p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500">Request Date</p>
                          <p>
                            {format(
                              new Date(request.requestDate),
                              "MMM d, yyyy"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Sample Type</p>
                          <p className="capitalize">
                            {request.sampleType}{" "}
                            <span className="text-slate-500">
                              ({request.quantity})
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Tracking Number
                          </p>
                          <p>
                            {request.trackingNumber || (
                              <span className="text-slate-400">
                                Not available
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mt-3 p-2 bg-slate-50 rounded text-sm">
                          <span className="font-medium">Notes: </span>
                          {request.notes}
                        </div>
                      )}

                      <div className="mt-4 flex gap-2 justify-end">
                        {request.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Order Material
                          </Button>
                        )}
                        {request.trackingNumber && (
                          <Button variant="secondary" size="sm">
                            Track Package
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Contact Supplier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SampleRequest;
