import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Download,
  Plus,
  Trash2,
  Save,
  FileSpreadsheet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface FabricData {
  id?: string;
  name: string;
  category: string;
  weight: string;
  composition: string;
  supplier: string;
  price: number;
  availability: string;
  description: string;
}

const CSVDataEntry = () => {
  const [fabricData, setFabricData] = useState<FabricData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const categories = ["Cotton", "Silk", "Wool", "Linen", "Synthetic", "Blend"];
  const availabilityOptions = [
    "In Stock",
    "Low Stock",
    "Out of Stock",
    "Pre-Order",
  ];

  const addNewRow = () => {
    setFabricData([
      ...fabricData,
      {
        name: "",
        category: "",
        weight: "",
        composition: "",
        supplier: "",
        price: 0,
        availability: "",
        description: "",
      },
    ]);
  };

  const updateRow = (
    index: number,
    field: keyof FabricData,
    value: string | number
  ) => {
    const updated = [...fabricData];
    updated[index] = { ...updated[index], [field]: value };
    setFabricData(updated);
  };

  const deleteRow = (index: number) => {
    setFabricData(fabricData.filter((_, i) => i !== index));
  };
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split("\n").filter((line) => line.trim());

        const parseCSVLine = (line: string) => {
          return line.split(",").map((v) => v.trim().replace(/"/g, ""));
        };

        const data: FabricData[] = lines.slice(1).map((line) => {
          const values = parseCSVLine(line);
          return {
            name: values[0] || "",
            category: values[1] || "",
            weight: values[2] || "",
            composition: values[3] || "",
            supplier: values[4] || "",
            price: parseFloat(values[5]) || 0,
            availability: values[6] || "",
            description: values[7] || "",
          };
        });

        setFabricData(data);
        toast({
          title: "CSV Uploaded",
          description: `Successfully loaded ${data.length} fabric records.`,
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Please check your CSV format and try again.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const headers = [
      "name",
      "category",
      "weight",
      "composition",
      "supplier",
      "price",
      "availability",
      "description",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      "Premium Cotton Twill,Cotton,280gsm,100% Cotton,TextileCorp,25.50,In Stock,High-quality cotton twill fabric\n" +
      "Silk Charmeuse,Silk,120gsm,100% Silk,LuxuryTextiles,85.00,Low Stock,Smooth silk with lustrous finish";

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fabric_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    if (fabricData.length === 0) {
      toast({
        title: "No Data",
        description: "Add some fabric data before exporting.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "name",
      "category",
      "weight",
      "composition",
      "supplier",
      "price",
      "availability",
      "description",
    ];
    const csvContent =
      headers.join(",") +
      "\n" +
      fabricData
        .map(
          (row) =>
            `"${row.name}","${row.category}","${row.weight}","${row.composition}","${row.supplier}",${row.price},"${row.availability}","${row.description}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fabric_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveToDatabase = async () => {
    if (fabricData.length === 0) {
      toast({
        title: "No Data",
        description: "Add some fabric data before saving.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("fabrics").insert(
        fabricData.map((fabric) => ({
          ...fabric,
          created_at: new Date().toISOString(),
        }))
      );

      if (error) throw error;

      toast({
        title: "Data Saved",
        description: `Successfully saved ${fabricData.length} fabric records to database.`,
      });
      setFabricData([]);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save data to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            CSV Data Entry
          </CardTitle>
          <CardDescription>
            Import fabric data from CSV files or enter data manually for
            database storage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
            </div>

            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>

            <Button variant="outline" onClick={addNewRow}>
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>

            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <Button
              onClick={saveToDatabase}
              disabled={isLoading || fabricData.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save to Database
            </Button>
          </div>

          {fabricData.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Composition</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {" "}
                    {fabricData.map((fabric, index) => (
                      <TableRow key={`fabric-${index}-${fabric.name || "new"}`}>
                        <TableCell>
                          <Input
                            value={fabric.name}
                            onChange={(e) =>
                              updateRow(index, "name", e.target.value)
                            }
                            placeholder="Fabric name"
                            className="min-w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={fabric.category}
                            onValueChange={(value) =>
                              updateRow(index, "category", value)
                            }
                          >
                            <SelectTrigger className="min-w-24">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={fabric.weight}
                            onChange={(e) =>
                              updateRow(index, "weight", e.target.value)
                            }
                            placeholder="Weight"
                            className="min-w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={fabric.composition}
                            onChange={(e) =>
                              updateRow(index, "composition", e.target.value)
                            }
                            placeholder="Composition"
                            className="min-w-32"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={fabric.supplier}
                            onChange={(e) =>
                              updateRow(index, "supplier", e.target.value)
                            }
                            placeholder="Supplier"
                            className="min-w-28"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={fabric.price}
                            onChange={(e) =>
                              updateRow(
                                index,
                                "price",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            placeholder="Price"
                            className="min-w-20"
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={fabric.availability}
                            onValueChange={(value) =>
                              updateRow(index, "availability", value)
                            }
                          >
                            <SelectTrigger className="min-w-28">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {availabilityOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={fabric.description}
                            onChange={(e) =>
                              updateRow(index, "description", e.target.value)
                            }
                            placeholder="Description"
                            className="min-w-40 min-h-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRow(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {fabricData.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">
                  {fabricData.length}{" "}
                  {fabricData.length === 1 ? "record" : "records"}
                </Badge>
                <span className="text-sm text-stone-600">
                  Total estimated value: $
                  {fabricData
                    .reduce((sum, fabric) => sum + fabric.price, 0)
                    .toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVDataEntry;
