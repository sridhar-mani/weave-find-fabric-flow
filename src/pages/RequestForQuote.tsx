import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Info,
  Package,
  Calendar,
  Send,
  Building2,
  ArrowLeft,
  Clock,
  Check,
  Upload,
  Copy,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import WebRTCChat from "@/components/WebRTCChat";
import { useAuth } from "@/hooks/useAuth";

// RFQ form schema
const rfqFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  materialType: z.string().min(1, {
    message: "Please select a material type.",
  }),
  quantity: z.string().min(1, {
    message: "Please enter a quantity.",
  }),
  unit: z.string().min(1, {
    message: "Please select a unit.",
  }),
  targetPrice: z.string().optional(),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  deliveryDate: z.string().min(1, {
    message: "Please enter a target delivery date.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  specifications: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type RFQFormValues = z.infer<typeof rfqFormSchema>;

const defaultValues: Partial<RFQFormValues> = {
  materialType: "",
  unit: "meters",
  currency: "USD",
  certifications: [],
  termsAccepted: false,
};

const RequestForQuote = () => {
  const { user } = useAuth();
  const { supplierId } = useParams<{ supplierId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [rfqId, setRfqId] = useState<string>("");
  const { toast } = useToast();
  // Define the supplier (in a real app, fetch from API)
  const supplier = {
    id: supplierId || "supplier-1",
    name: supplierId ? "Milano Fabrics" : "Select a supplier",
    logo: "/placeholder.svg",
    location: "Milan, Italy",
    specialties: ["Wool", "Silk", "Premium Blends"],
    rating: 4.8,
    responseTime: "Within 24 hours",
    materials: [
      "Italian Merino Wool Jersey",
      "Silk Charmeuse",
      "Wool Gabardine",
    ],
  };

  const form = useForm<RFQFormValues>({
    resolver: zodResolver(rfqFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: RFQFormValues) => {
    setIsSubmitting(true);
    // Real RFQ submission to Supabase
    if (!isSupabaseConfigured) {
      toast({
        title: "Error",
        description: "Backend not configured",
        variant: "destructive",
      });
      return;
    }
    const { data: rfq, error } = await supabase
      .from("RFQ")
      .insert([{ ...data, supplierId, userId: user?.id }])
      .select("*")
      .single();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setRfqSubmitted(true);
      setRfqId(rfq.id);
      toast({ title: "Success", description: "RFQ submitted" });
    }
    setIsSubmitting(false);
  };

  const copyRfqId = () => {
    navigator.clipboard.writeText(rfqId);
    toast({
      title: "RFQ ID Copied",
      description: "The RFQ ID has been copied to your clipboard.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={rfqSubmitted ? "RFQ Submitted" : "Request For Quote (RFQ)"}
        description={
          rfqSubmitted
            ? `RFQ #${rfqId} sent to ${supplier.name}`
            : `Submit a detailed quote request to ${supplier.name}`
        }
        breadcrumbs={[
          { label: "Materials", path: "/materials" },
          { label: "Request For Quote", path: "/rfq" },
        ]}
        actions={
          rfqSubmitted ? (
            <Button asChild variant="outline">
              <Link to="/materials">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Materials
              </Link>
            </Button>
          ) : null
        }
      />

      {rfqSubmitted ? (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <div className="bg-green-100 text-green-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Your RFQ has been submitted!
              </h2>
              <p className="text-slate-600 mb-6">
                {supplier.name} typically responds within{" "}
                {supplier.responseTime}
              </p>

              <div className="flex items-center justify-center mb-6">
                <div className="bg-slate-100 py-2 px-4 rounded-lg flex items-center">
                  <span className="text-slate-500 mr-2">RFQ ID:</span>
                  <span className="font-mono font-medium">{rfqId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={copyRfqId}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6 max-w-3xl mx-auto">
                <Card className="bg-slate-50">
                  <CardContent className="p-4 text-center">
                    <Clock className="w-5 h-5 mx-auto mb-2 text-slate-500" />
                    <h3 className="text-sm font-medium">Next Steps</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Supplier will review and respond with a quote
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-5 h-5 mx-auto mb-2 text-slate-500" />
                    <h3 className="text-sm font-medium">Timeline</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Expected response: {supplier.responseTime}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-50">
                  <CardContent className="p-4 text-center">
                    <FileText className="w-5 h-5 mx-auto mb-2 text-slate-500" />
                    <h3 className="text-sm font-medium">Track RFQ</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Check status in "My RFQs" section
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link to="/materials">Browse More Materials</Link>
                </Button>
                <Button asChild>
                  <Link to="/quotes">View My RFQs</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>RFQ Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RFQ Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Organic Cotton for Summer Collection"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A clear title helps the supplier understand your
                            request quickly.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="materialType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Material Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select material type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="linen">Linen</SelectItem>
                                <SelectItem value="wool">Wool</SelectItem>
                                <SelectItem value="silk">Silk</SelectItem>
                                <SelectItem value="polyester">
                                  Polyester
                                </SelectItem>
                                <SelectItem value="blends">Blends</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="meters">Meters</SelectItem>
                                  <SelectItem value="yards">Yards</SelectItem>
                                  <SelectItem value="pieces">Pieces</SelectItem>
                                  <SelectItem value="kg">Kilograms</SelectItem>
                                  <SelectItem value="rolls">Rolls</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="targetPrice"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-2">
                              <FormLabel>Target Price (Optional)</FormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-slate-400" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="w-80">
                                      Providing a target price helps suppliers
                                      understand your budget constraints. Leave
                                      blank if you're open to any pricing.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="e.g., 12.50"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Price per unit in selected currency
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="GBP">GBP (£)</SelectItem>
                                <SelectItem value="INR">INR (₹)</SelectItem>
                                <SelectItem value="CNY">CNY (¥)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deliveryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Delivery Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            When do you need this material delivered?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Request Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your requirements in detail..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Include details about your project, intended use,
                            and any specific requirements.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="specifications"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Technical Specifications (Optional)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter any technical specifications such as GSM, width, composition requirements, etc."
                              className="min-h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="certifications"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">
                              Required Certifications
                            </FormLabel>
                            <FormDescription>
                              Select any required certifications for this
                              material
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "GOTS",
                              "OEKO-TEX",
                              "GRS",
                              "Fair Trade",
                              "FSC",
                              "REACH",
                            ].map((item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="certifications"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...(field.value || []),
                                                  item,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center py-2 mb-4">
                      <div className="h-px flex-1 bg-slate-200"></div>
                      <span className="px-4 text-sm text-slate-500">
                        Attachments & Terms
                      </span>
                      <div className="h-px flex-1 bg-slate-200"></div>
                    </div>

                    <div className="border border-dashed border-slate-300 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">
                        Upload Attachments (Optional)
                      </p>
                      <p className="text-xs text-slate-500 mb-3">
                        Drag and drop files or click to browse (max 5MB per
                        file)
                      </p>
                      <Button type="button" variant="outline" size="sm">
                        Add Files
                      </Button>
                    </div>

                    <FormField
                      control={form.control}
                      name="termsAccepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I accept the terms and conditions
                            </FormLabel>
                            <FormDescription>
                              By submitting this RFQ, you agree to our{" "}
                              <Link
                                to="/terms"
                                className="text-primary underline"
                              >
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link
                                to="/privacy"
                                className="text-primary underline"
                              >
                                Privacy Policy
                              </Link>
                              .
                            </FormDescription>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 text-right">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit RFQ
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with supplier info and help */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Supplier Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                      {supplier.logo ? (
                        <img
                          src={supplier.logo}
                          alt={supplier.name}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <Building2 className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{supplier.name}</h3>
                      <p className="text-sm text-slate-500">
                        {supplier.location}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Response Time:</span>
                      <span className="font-medium">
                        {supplier.responseTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">RFQ Fee:</span>
                      <Badge variant="outline" className="text-green-600">
                        Free
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">RFQ Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>
                        Be as specific as possible about your requirements
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Include technical specifications if available</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>
                        Mention your timeline and any flexibility in delivery
                        dates
                      </span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>
                        Attach reference images or diagrams if applicable
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-amber-800 mb-1">
                        Need assistance?
                      </h3>
                      <p className="text-sm text-amber-700 mb-3">
                        Our sourcing specialists can help you find the right
                        materials and suppliers.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-300 text-amber-700 hover:bg-amber-100"
                      >
                        Contact Sourcing Team
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      {rfqSubmitted && (
        <div>
          <h3>Chat with Supplier</h3>
          <WebRTCChat peerId={user?.id || ""} targetPeerId={supplierId || ""} />
        </div>
      )}
    </div>
  );
};

export default RequestForQuote;
