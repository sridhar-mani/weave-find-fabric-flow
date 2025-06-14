import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
  AlertTriangle,
  TestTube,
  Leaf,
  Droplets,
  Skull,
  Thermometer,
  Flame,
} from "lucide-react";

export interface TestResult {
  id: string;
  name: string;
  standard: string;
  method: string;
  result: string;
  status: "pass" | "fail" | "warning" | "na";
  date: string;
  notes?: string;
  reportId?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  standard: string;
  issuedDate: string;
  expiryDate: string;
  status: "active" | "pending" | "expired";
  scope: string[];
  documentUrl?: string;
}

interface FabricCertificationProps {
  materialId: string;
  materialName: string;
  certifications: Certification[];
  testResults: TestResult[];
  onDownloadReport?: (reportId: string) => void;
}

const FabricCertification: React.FC<FabricCertificationProps> = ({
  materialId,
  materialName,
  certifications,
  testResults,
  onDownloadReport,
}) => {
  const getStatusBadge = (status: Certification["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTestStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "fail":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "na":
        return <div className="w-4 h-4 text-slate-300">-</div>;
      default:
        return null;
    }
  };

  const getTestIcon = (testName: string) => {
    if (testName.toLowerCase().includes("water"))
      return <Droplets className="w-4 h-4" />;
    if (
      testName.toLowerCase().includes("chemical") ||
      testName.toLowerCase().includes("substance")
    )
      return <TestTube className="w-4 h-4" />;
    if (
      testName.toLowerCase().includes("eco") ||
      testName.toLowerCase().includes("sustainable")
    )
      return <Leaf className="w-4 h-4" />;
    if (
      testName.toLowerCase().includes("toxic") ||
      testName.toLowerCase().includes("hazard")
    )
      return <Skull className="w-4 h-4" />;
    if (
      testName.toLowerCase().includes("temp") ||
      testName.toLowerCase().includes("shrink")
    )
      return <Thermometer className="w-4 h-4" />;
    if (
      testName.toLowerCase().includes("flame") ||
      testName.toLowerCase().includes("fire")
    )
      return <Flame className="w-4 h-4" />;

    return <FileText className="w-4 h-4" />;
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Certifications & Testing</CardTitle>
        <CardDescription>
          Quality assurance and compliance information for {materialName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="certifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="testing">Test Results</TabsTrigger>
          </TabsList>

          <TabsContent value="certifications" className="space-y-4">
            {certifications.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                No certifications available
              </p>
            ) : (
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <Card key={cert.id} className="shadow-none border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <h4 className="font-medium">{cert.name}</h4>
                            {getStatusBadge(cert.status)}
                          </div>
                          <p className="text-sm text-slate-500 mb-2">
                            {cert.issuer} • {cert.standard}
                          </p>
                          <div className="flex gap-4 text-xs text-slate-500">
                            <div>
                              <span>Issued: </span>
                              <span className="text-slate-700">
                                {new Date(cert.issuedDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span>Expires: </span>
                              <span className="text-slate-700">
                                {new Date(cert.expiryDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {cert.scope.map((item, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs font-normal"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {cert.documentUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 flex-shrink-0"
                            onClick={() => onDownloadReport?.(cert.id)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            {testResults.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                No test results available
              </p>
            ) : (
              <div className="space-y-1">
                <Accordion type="multiple" className="w-full">
                  {testResults.map((test) => (
                    <AccordionItem key={test.id} value={test.id}>
                      <AccordionTrigger className="py-3 px-4 hover:bg-slate-50 rounded-md">
                        <div className="flex items-center w-full gap-3">
                          <div className="flex-shrink-0">
                            {getTestStatusIcon(test.status)}
                          </div>
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="flex items-center gap-1.5">
                              {getTestIcon(test.name)}
                              <span className="font-medium truncate">
                                {test.name}
                              </span>
                            </span>
                            <span className="text-xs text-slate-500">
                              ({test.standard})
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-2">
                          <div>
                            <div className="text-xs text-slate-500 mb-1">
                              Test Method
                            </div>
                            <div>{test.method}</div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">
                              Test Date
                            </div>
                            <div>
                              {new Date(test.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500 mb-1">
                              Result
                            </div>
                            <div className="font-medium">
                              {test.result}
                              {test.status === "pass" && (
                                <span className="text-green-600 ml-2">
                                  (Passed)
                                </span>
                              )}
                              {test.status === "fail" && (
                                <span className="text-red-600 ml-2">
                                  (Failed)
                                </span>
                              )}
                              {test.status === "warning" && (
                                <span className="text-amber-600 ml-2">
                                  (Caution)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {test.notes && (
                          <div className="mt-2 text-sm">
                            <div className="text-xs text-slate-500 mb-1">
                              Notes
                            </div>
                            <div className="text-slate-700">{test.notes}</div>
                          </div>
                        )}
                        {test.reportId && (
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDownloadReport?.(test.reportId!)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download Full Report
                            </Button>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FabricCertification;
