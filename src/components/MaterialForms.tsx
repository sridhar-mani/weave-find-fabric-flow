import { useState } from "react";
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
import { Plus, Save, X, Package, Palette, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface MaterialForm {
  id?: string;
  name: string;
  category: string;
  type: "fabric" | "trim" | "accessory" | "tool";
  composition: string;
  weight?: string;
  width?: string;
  color: string;
  supplier: string;
  supplierContact: string;
  price: number;
  currency: string;
  minimumOrder: number;
  leadTime: string;
  availability: string;
  certifications: string[];
  careInstructions: string;
  description: string;
  notes: string;
  tags: string[];
}

const FormFields = ({
  form,
  setForm,
  categories,
  updateForm,
  addTag,
  removeTag,
}: {
  form: MaterialForm;
  setForm: (form: MaterialForm) => void;
  categories: string[];
  updateForm: (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    field: keyof MaterialForm,
    value: any
  ) => void;
  addTag: (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    tag: string
  ) => void;
  removeTag: (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    tag: string
  ) => void;
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Material Name *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => updateForm(form, setForm, "name", e.target.value)}
          placeholder="Enter material name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={form.category}
          onValueChange={(value) =>
            updateForm(form, setForm, "category", value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="composition">Composition *</Label>
        <Input
          id="composition"
          value={form.composition}
          onChange={(e) =>
            updateForm(form, setForm, "composition", e.target.value)
          }
          placeholder="e.g., 100% Cotton"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Color *</Label>
        <Input
          id="color"
          value={form.color}
          onChange={(e) => updateForm(form, setForm, "color", e.target.value)}
          placeholder="Enter color"
        />
      </div>

      {form.type === "fabric" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={form.weight || ""}
              onChange={(e) =>
                updateForm(form, setForm, "weight", e.target.value)
              }
              placeholder="e.g., 200gsm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              value={form.width || ""}
              onChange={(e) =>
                updateForm(form, setForm, "width", e.target.value)
              }
              placeholder="e.g., 150cm"
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier *</Label>
        <Input
          id="supplier"
          value={form.supplier}
          onChange={(e) =>
            updateForm(form, setForm, "supplier", e.target.value)
          }
          placeholder="Supplier name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplierContact">Supplier Contact</Label>
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
        <Label htmlFor="price">Price *</Label>
        <div className="flex gap-2">
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) =>
              updateForm(
                form,
                setForm,
                "price",
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
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minimumOrder">Minimum Order</Label>
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
        <Label htmlFor="leadTime">Lead Time</Label>
        <Input
          id="leadTime"
          value={form.leadTime}
          onChange={(e) =>
            updateForm(form, setForm, "leadTime", e.target.value)
          }
          placeholder="e.g., 2-3 weeks"
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
            {[
              "In Stock",
              "Low Stock",
              "Out of Stock",
              "Pre-Order",
              "Custom Order",
            ].map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    <Separator />

    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="certifications">Certifications</Label>
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
                onClick={() => removeTag(form, setForm, cert)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add certification"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = e.currentTarget.value.trim();
                if (value && !form.certifications.includes(value)) {
                  updateForm(form, setForm, "certifications", [
                    ...form.certifications,
                    value,
                  ]);
                  e.currentTarget.value = "";
                }
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.querySelector(
                'input[placeholder="Add certification"]'
              ) as HTMLInputElement;
              const value = input?.value.trim();
              if (value && !form.certifications.includes(value)) {
                updateForm(form, setForm, "certifications", [
                  ...form.certifications,
                  value,
                ]);
                input.value = "";
              }
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="careInstructions">Care Instructions</Label>
        <Textarea
          id="careInstructions"
          value={form.careInstructions}
          onChange={(e) =>
            updateForm(form, setForm, "careInstructions", e.target.value)
          }
          placeholder="Care and maintenance instructions"
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
          placeholder="Detailed description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Internal Notes</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => updateForm(form, setForm, "notes", e.target.value)}
          placeholder="Internal notes and comments"
          rows={2}
        />
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
                onClick={() => removeTag(form, setForm, tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTag(form, setForm, e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.querySelector(
                'input[placeholder="Add tag"]'
              ) as HTMLInputElement;
              addTag(form, setForm, input?.value || "");
              if (input) input.value = "";
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);

const MaterialForms = () => {
  const [activeTab, setActiveTab] = useState("fabric");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [fabricForm, setFabricForm] = useState<MaterialForm>({
    name: "",
    category: "",
    type: "fabric",
    composition: "",
    weight: "",
    width: "",
    color: "",
    supplier: "",
    supplierContact: "",
    price: 0,
    currency: "USD",
    minimumOrder: 1,
    leadTime: "",
    availability: "",
    certifications: [],
    careInstructions: "",
    description: "",
    notes: "",
    tags: [],
  });

  const [trimForm, setTrimForm] = useState<MaterialForm>({
    name: "",
    category: "",
    type: "trim",
    composition: "",
    color: "",
    supplier: "",
    supplierContact: "",
    price: 0,
    currency: "USD",
    minimumOrder: 1,
    leadTime: "",
    availability: "",
    certifications: [],
    careInstructions: "",
    description: "",
    notes: "",
    tags: [],
  });

  const fabricCategories = [
    "Cotton",
    "Silk",
    "Wool",
    "Linen",
    "Synthetic",
    "Knit",
    "Woven",
    "Denim",
    "Jersey",
  ];
  const trimCategories = [
    "Buttons",
    "Zippers",
    "Lace",
    "Ribbon",
    "Thread",
    "Elastic",
    "Velcro",
    "Snaps",
  ];
  const availabilityOptions = [
    "In Stock",
    "Low Stock",
    "Out of Stock",
    "Pre-Order",
    "Custom Order",
  ];
  const certificationOptions = [
    "OEKO-TEX",
    "GOTS",
    "Cradle to Cradle",
    "Fair Trade",
    "Organic",
    "Recycled",
  ];
  const currencies = ["USD", "EUR", "GBP", "JPY", "CAD"];

  const updateForm = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    field: keyof MaterialForm,
    value: any
  ) => {
    setForm({ ...form, [field]: value });
  };

  const addTag = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    tag: string
  ) => {
    if (tag.trim() && !form.tags.includes(tag.trim())) {
      setForm({ ...form, tags: [...form.tags, tag.trim()] });
    }
  };

  const removeTag = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    tagToRemove: string
  ) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) });
  };

  const addCertification = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    cert: string
  ) => {
    if (!form.certifications.includes(cert)) {
      setForm({ ...form, certifications: [...form.certifications, cert] });
    }
  };

  const removeCertification = (
    form: MaterialForm,
    setForm: (form: MaterialForm) => void,
    certToRemove: string
  ) => {
    setForm({
      ...form,
      certifications: form.certifications.filter(
        (cert) => cert !== certToRemove
      ),
    });
  };

  const resetForm = (
    setForm: (form: MaterialForm) => void,
    type: "fabric" | "trim" | "accessory" | "tool"
  ) => {
    setForm({
      name: "",
      category: "",
      type,
      composition: "",
      weight: "",
      width: "",
      color: "",
      supplier: "",
      supplierContact: "",
      price: 0,
      currency: "USD",
      minimumOrder: 1,
      leadTime: "",
      availability: "",
      certifications: [],
      careInstructions: "",
      description: "",
      notes: "",
      tags: [],
    });
  };

  const saveMaterial = async (form: MaterialForm) => {
    if (!form.name || !form.category || !form.supplier) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all required fields (name, category, supplier).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("materials").insert([
        {
          ...form,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Material Saved",
        description: `${form.name} has been added to your materials database.`,
      });

      if (form.type === "fabric") {
        resetForm(setFabricForm, "fabric");
      } else {
        resetForm(setTrimForm, "trim");
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

  const FormFields = ({
    form,
    setForm,
    categories,
  }: {
    form: MaterialForm;
    setForm: (form: MaterialForm) => void;
    categories: string[];
  }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Material Name *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => updateForm(form, setForm, "name", e.target.value)}
            placeholder="Enter material name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={form.category}
            onValueChange={(value) =>
              updateForm(form, setForm, "category", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="composition">Composition</Label>
          <Input
            id="composition"
            value={form.composition}
            onChange={(e) =>
              updateForm(form, setForm, "composition", e.target.value)
            }
            placeholder="e.g., 100% Cotton"
          />
        </div>

        {form.type === "fabric" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={form.weight || ""}
                onChange={(e) =>
                  updateForm(form, setForm, "weight", e.target.value)
                }
                placeholder="e.g., 280gsm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={form.width || ""}
                onChange={(e) =>
                  updateForm(form, setForm, "width", e.target.value)
                }
                placeholder="e.g., 150cm"
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={form.color}
            onChange={(e) => updateForm(form, setForm, "color", e.target.value)}
            placeholder="e.g., Navy Blue"
          />
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier *</Label>
          <Input
            id="supplier"
            value={form.supplier}
            onChange={(e) =>
              updateForm(form, setForm, "supplier", e.target.value)
            }
            placeholder="Supplier name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplierContact">Supplier Contact</Label>
          <Input
            id="supplierContact"
            value={form.supplierContact}
            onChange={(e) =>
              updateForm(form, setForm, "supplierContact", e.target.value)
            }
            placeholder="Email or phone"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) =>
              updateForm(
                form,
                setForm,
                "price",
                parseFloat(e.target.value) || 0
              )
            }
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={form.currency}
            onValueChange={(value) =>
              updateForm(form, setForm, "currency", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr} value={curr}>
                  {curr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            min="1"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadTime">Lead Time</Label>
          <Input
            id="leadTime"
            value={form.leadTime}
            onChange={(e) =>
              updateForm(form, setForm, "leadTime", e.target.value)
            }
            placeholder="e.g., 2-3 weeks"
          />
        </div>
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
            {availabilityOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

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
                onClick={() => removeCertification(form, setForm, cert)}
              />
            </Badge>
          ))}
        </div>
        <Select
          onValueChange={(value) => addCertification(form, setForm, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Add certification" />
          </SelectTrigger>
          <SelectContent>
            {certificationOptions
              .filter((cert) => !form.certifications.includes(cert))
              .map((cert) => (
                <SelectItem key={cert} value={cert}>
                  {cert}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="careInstructions">Care Instructions</Label>
        <Textarea
          id="careInstructions"
          value={form.careInstructions}
          onChange={(e) =>
            updateForm(form, setForm, "careInstructions", e.target.value)
          }
          placeholder="Washing and care instructions"
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
          placeholder="Detailed description of the material"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => updateForm(form, setForm, "notes", e.target.value)}
          placeholder="Additional notes or comments"
        />
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
                onClick={() => removeTag(form, setForm, tag)}
              />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {" "}
          <Input
            placeholder="Add tag"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTag(form, setForm, e.currentTarget.value);
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
              addTag(form, setForm, input.value);
              input.value = "";
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Material Forms
          </CardTitle>
          <CardDescription>
            Add new fabrics, trims, and accessories to your materials database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fabric" className="flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Fabrics
              </TabsTrigger>
              <TabsTrigger value="trim" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Trims & Accessories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fabric" className="mt-6">
              <FormFields
                form={fabricForm}
                setForm={setFabricForm}
                categories={fabricCategories}
              />
            </TabsContent>

            <TabsContent value="trim" className="mt-6">
              <FormFields
                form={trimForm}
                setForm={setTrimForm}
                categories={trimCategories}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialForms;
