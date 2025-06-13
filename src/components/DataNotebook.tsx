import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Download,
  Code,
  BarChart3,
  FileText,
  Play,
} from "lucide-react";

interface NotebookCell {
  id: string;
  type: "code" | "markdown";
  content: string;
  output?: string;
  isExecuting?: boolean;
  language?: string;
}

const DataNotebook = () => {
  const [cells, setCells] = useState<NotebookCell[]>([
    {
      id: "1",
      type: "markdown",
      content:
        "# Textile Analytics Workspace\n\nInteractive environment for fabric data analysis and business insights.",
    },
    {
      id: "2",
      type: "code",
      content: `# Textile material analysis example
import pandas as pd
import matplotlib.pyplot as plt

# Sample fabric inventory data
fabric_data = {
    'material': ['Cotton', 'Silk', 'Polyester', 'Linen', 'Wool'],
    'gsm': [180, 120, 150, 160, 220],
    'price_per_meter': [25, 85, 15, 45, 65],
    'sustainability_score': [8, 6, 3, 9, 7]
}

df = pd.DataFrame(fabric_data)
print("Textile Material Analysis Report")
print(df)`,
      language: "python",
    },
  ]);

  const addCell = (type: "code" | "markdown") => {
    const newCell: NotebookCell = {
      id: Date.now().toString(),
      type,
      content:
        type === "markdown"
          ? "# New Section\n\nAdd your textile insights here..."
          : '# Your analysis code here\nprint("Ready for textile data analysis")',
      isExecuting: false,
    };
    setCells([...cells, newCell]);
  };

  const updateCell = (id: string, content: string) => {
    setCells(
      cells.map((cell) => (cell.id === id ? { ...cell, content } : cell))
    );
  };

  const deleteCell = (id: string) => {
    if (cells.length > 1) {
      setCells(cells.filter((cell) => cell.id !== id));
    }
  };

  const clearCellOutput = (id: string) => {
    setCells(
      cells.map((cell) =>
        cell.id === id ? { ...cell, output: undefined } : cell
      )
    );
  };

  const executeCell = async (id: string) => {
    // Set executing state
    setCells(
      cells.map((cell) =>
        cell.id === id
          ? { ...cell, isExecuting: true, output: undefined }
          : cell
      )
    );

    // Simulate execution delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate different outputs based on content
    const cell = cells.find((c) => c.id === id);
    let mockOutput = "Execution completed";

    if (cell?.content.includes("import")) {
      mockOutput = "Modules imported successfully";
    } else if (
      cell?.content.includes("plot") ||
      cell?.content.includes("chart")
    ) {
      mockOutput =
        "📊 Chart generated successfully\n[Chart would appear here in full implementation]";
    } else if (cell?.content.includes("print")) {
      mockOutput =
        "Hello from Textile Analytics!\nSystem ready for data processing";
    }

    setCells(
      cells.map((cell) =>
        cell.id === id
          ? {
              ...cell,
              output: mockOutput,
              isExecuting: false,
            }
          : cell
      )
    );
  };

  const exportNotebook = () => {
    const notebook = {
      cells: cells.map((cell) => ({
        cell_type: cell.type,
        source: cell.content.split("\n"),
        outputs: cell.output
          ? [{ output_type: "stream", text: cell.output }]
          : [],
      })),
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3",
        },
      },
      nbformat: 4,
      nbformat_minor: 4,
    };

    const blob = new Blob([JSON.stringify(notebook, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fabric_analytics.ipynb";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`(.*?)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      )
      .replace(/\n/g, "<br>");
  };
  return (
    <div className="max-w-6xl mx-auto p-8">
      <Card className="mb-8 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Textile Analytics Workspace
              </CardTitle>
              <p className="text-slate-600 mt-2">
                Interactive environment for fabric data analysis and business
                insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-200"
              >
                Ready for Analysis
              </Badge>
              <div className="flex gap-3">
                <Button
                  onClick={() => addCell("code")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Analysis
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addCell("markdown")}
                  className="border-slate-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Notes
                </Button>
                <Button variant="outline" onClick={exportNotebook}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>{" "}
      <div className="space-y-8">
        {cells.map((cell, index) => (
          <Card
            key={cell.id}
            className="overflow-hidden border-l-4 border-l-blue-500 shadow-lg bg-white/95 backdrop-blur-sm"
          >
            <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge
                    variant={cell.type === "code" ? "default" : "secondary"}
                    className="px-4 py-2 text-sm font-medium"
                  >
                    {cell.type === "code" ? (
                      <Code className="w-4 h-4 mr-2" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    {cell.type === "code" ? "Analysis Code" : "Documentation"}
                  </Badge>
                  <span className="text-sm text-muted-foreground font-medium bg-white/70 px-3 py-1 rounded-full">
                    Cell [{index + 1}]
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {" "}
                  {cell.type === "code" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => executeCell(cell.id)}
                        disabled={cell.isExecuting}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {cell.isExecuting ? "Running..." : "Run Analysis"}
                      </Button>
                      {cell.output && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => clearCellOutput(cell.id)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          Clear Results
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCell(cell.id)}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>{" "}
            <CardContent className="pt-0">
              <div className="space-y-6">
                {cell.type === "code" ? (
                  <div className="border rounded-xl overflow-hidden shadow-sm bg-slate-900">
                    <Editor
                      height="500px"
                      defaultLanguage={cell.language || "python"}
                      value={cell.content}
                      onChange={(value) => updateCell(cell.id, value || "")}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        lineNumbers: "on",
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        wordWrap: "bounded",
                        suggestOnTriggerCharacters: true,
                        quickSuggestions: true,
                        parameterHints: { enabled: true },
                        autoIndent: "full",
                        formatOnPaste: true,
                        formatOnType: true,
                      }}
                    />
                  </div>
                ) : (
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <Editor
                      height="300px"
                      defaultLanguage="markdown"
                      value={cell.content}
                      onChange={(value) => updateCell(cell.id, value || "")}
                      theme="vs-light"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: "on",
                        automaticLayout: true,
                      }}
                    />
                  </div>
                )}{" "}
                {cell.type === "markdown" && cell.content && (
                  <div className="border-t pt-6">
                    <div className="prose max-w-none prose-slate">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(cell.content),
                        }}
                      />
                    </div>
                  </div>
                )}
                {cell.output && (
                  <div className="border-t pt-6">
                    <div className="bg-slate-900 text-green-400 p-6 rounded-xl font-mono text-sm shadow-inner">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                          Analysis Results:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-slate-400 text-xs">Active</span>
                        </div>
                      </div>
                      <pre className="whitespace-pre-wrap leading-relaxed">
                        {cell.output}
                      </pre>
                    </div>
                  </div>
                )}
                {cell.isExecuting && (
                  <div className="border-t pt-6">
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-700 text-sm font-medium">
                          Processing textile analysis...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataNotebook;
