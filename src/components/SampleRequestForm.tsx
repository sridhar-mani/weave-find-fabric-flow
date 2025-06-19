
import React, { useState } from "react";
import {
  Dialog,
  DialogContent as DialogContentComponent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  Send,
  Scissors,
  FileText,
  MapPin,
  Building2,
  Info,
  Ruler,
  Banknote,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Material {
  id: string;
  name: string;
  supplier: {
    id: string;
    name: string;
    location: string;
  };
}

interface SampleRequestFormProps {
  material: Material;
  onSubmit: (data: SampleRequestData) => void;
  onCancel?: () => void;
  trigger?: React.ReactNode;
}

export interface SampleRequestData {
  materialId: string;
  supplierId: string;
  quantity: number;
  sampleType: "swatch" | "yardage" | "custom";
  customSize?: string;
  shippingAddress: {
    name: string;
    company: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: "standard" | "express" | "economy";
  purpose: string;
  additionalInfo?: string;
  paymentAccepted: boolean;
}

const SampleRequestForm: React.FC<SampleRequestFormProps> = ({
  material,
  onSubmit,
  onCancel,
  trigger,
}) => {
  const [open, setOpen] = useState(false);
  const [sampleType, setSampleType] = useState<"swatch" | "yardage" | "custom">(
    "swatch"
  );
  const [formData, setFormData] = useState<Partial<SampleRequestData>>({
    materialId: material.id,
    supplierId: material.supplier.id,
    quantity: 1,
    sampleType: "swatch",
    shippingMethod: "standard",
    paymentAccepted: false,
    shippingAddress: {
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...(formData[parent as keyof SampleRequestData] as any),
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const shippingAddress = formData.shippingAddress;
    if (
      !shippingAddress?.name ||
      !shippingAddress?.email ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.country
    ) {
      toast({
        title: "Missing information",
        description: "Please fill out all required shipping address fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.purpose) {
      toast({
        title: "Missing information",
        description: "Please specify the purpose for your sample request.",
        variant: "destructive",
      });
      return;
    }

    if (sampleType === "custom" && !formData.customSize) {
      toast({
        title: "Missing information",
        description: "Please specify the custom size for your sample.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData as SampleRequestData);
    setOpen(false);

    toast({
      title: "Sample request submitted",
      description: `Your request for ${material.name} samples has been sent to ${material.supplier.name}.`,
    });
  };

  const renderDialogContent = () => (
    <DialogContentComponent className="max-w-md md:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Scissors className="w-5 h-5" />
          Request Material Sample
        </DialogTitle>
        <DialogDescription>
          Fill out this form to request sample materials from{" "}
          {material.supplier.name}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-slate-50 p-3 rounded-md border border-slate-100">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-md h-12 w-12 flex items-center justify-center flex-shrink-0">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{material.name}</h3>
              <div className="flex items-center text-sm text-slate-500">
                <Building2 className="w-3.5 h-3.5 mr-1" />
                {material.supplier.name}
                <span className="mx-1.5">•</span>
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {material.supplier.location}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-medium text-slate-900">
              Sample Details
            </h3>

            <div className="space-y-3">
              <Label>Sample Type</Label>
              <RadioGroup
                defaultValue={sampleType}
                onValueChange={(value) => {
                  setSampleType(value as any);
                  setFormData({ ...formData, sampleType: value as any });
                }}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="swatch" id="swatch" />
                  <Label htmlFor="swatch" className="cursor-pointer">
                    <span className="font-medium">Small Swatch</span> - Standard
                    sample size (typically 5cm x 5cm)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yardage" id="yardage" />
                  <Label htmlFor="yardage" className="cursor-pointer">
                    <span className="font-medium">Yardage Sample</span> - Larger
                    piece (typically 0.5m or more)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">
                    <span className="font-medium">Custom Size</span> - Specify
                    custom dimensions
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {sampleType === "custom" && (
              <div>
                <Label htmlFor="customSize">
                  Custom Size <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customSize"
                  name="customSize"
                  placeholder="e.g., 20cm x 30cm"
                  value={formData.customSize || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="quantity">
                  Quantity <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shippingMethod">
                  Shipping Method <span className="text-red-500">*</span>
                </Label>
                <Select
                  defaultValue={formData.shippingMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, shippingMethod: value as any })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard (7-10 days)
                    </SelectItem>
                    <SelectItem value="express">Express (3-5 days)</SelectItem>
                    <SelectItem value="economy">
                      Economy (14-21 days)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">
                Purpose <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, purpose: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evaluation">
                    Material Evaluation
                  </SelectItem>
                  <SelectItem value="product_development">
                    Product Development
                  </SelectItem>
                  <SelectItem value="color_matching">Color Matching</SelectItem>
                  <SelectItem value="quality_testing">
                    Quality Testing
                  </SelectItem>
                  <SelectItem value="client_presentation">
                    Client Presentation
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Any specific requirements or questions about the material..."
                value={formData.additionalInfo || ""}
                onChange={handleChange}
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-medium text-slate-900">
              Shipping Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="shippingAddress.name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.name"
                  name="shippingAddress.name"
                  value={formData.shippingAddress?.name || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shippingAddress.company">Company</Label>
                <Input
                  id="shippingAddress.company"
                  name="shippingAddress.company"
                  value={formData.shippingAddress?.company || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="shippingAddress.email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.email"
                  name="shippingAddress.email"
                  type="email"
                  value={formData.shippingAddress?.email || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shippingAddress.phone">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.phone"
                  name="shippingAddress.phone"
                  value={formData.shippingAddress?.phone || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shippingAddress.address">
                Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="shippingAddress.address"
                name="shippingAddress.address"
                value={formData.shippingAddress?.address || ""}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="shippingAddress.city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.city"
                  name="shippingAddress.city"
                  value={formData.shippingAddress?.city || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shippingAddress.state">
                  State/Province <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.state"
                  name="shippingAddress.state"
                  value={formData.shippingAddress?.state || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="shippingAddress.postalCode">
                  Postal Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.postalCode"
                  name="shippingAddress.postalCode"
                  value={formData.shippingAddress?.postalCode || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="shippingAddress.country">
                  Country <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="shippingAddress.country"
                  name="shippingAddress.country"
                  value={formData.shippingAddress?.country || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="paymentAccepted"
            checked={formData.paymentAccepted}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, paymentAccepted: !!checked })
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="paymentAccepted" className="text-sm leading-snug">
              I understand that sample requests may incur shipping costs and
              fees depending on the supplier's policy.
            </Label>
          </div>
        </div>

        <div className="bg-amber-50 p-3 rounded-md border border-amber-100 flex items-start gap-2">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">Sample Policy</p>
            <p className="mt-1">
              Some suppliers may charge for samples depending on quantity and
              size. Sample costs are often credited toward future bulk orders.
              Please contact the supplier directly for specific sample policies.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setOpen(false);
              onCancel?.();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Send className="w-4 h-4 mr-2" />
            Submit Sample Request
          </Button>
        </DialogFooter>
      </form>
    </DialogContentComponent>
  );

  return trigger ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {renderDialogContent()}
    </Dialog>
  ) : (
    renderDialogContent()
  );
};

export default SampleRequestForm;
