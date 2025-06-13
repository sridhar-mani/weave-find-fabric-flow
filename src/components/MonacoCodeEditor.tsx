import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Download,
  FileText,
  Code,
  BarChart3,
  X,
  Plus,
  Trash2,
} from "lucide-react";

interface CodeCell {
  id: string;
  type: "code" | "markdown";
  content: string;
  output?: string;
  language?: string;
}

const MonacoCodeEditor = () => {
  const [cells, setCells] = useState<CodeCell[]>([
    {
      id: "1",
      type: "markdown",
      content:
        "# Textile Analytics Notebook\n\nWelcome to the advanced textile analytics environment.",
    },
    {
      id: "2",
      type: "code",
      content: `# Textile data analysis example
import pandas as pd
import matplotlib.pyplot as plt

# Sample fabric data
fabric_data = {
    'material': ['Cotton', 'Silk', 'Polyester', 'Linen', 'Wool'],
    'gsm': [180, 120, 150, 160, 220],
    'price_per_meter': [25, 85, 15, 45, 65],
    'sustainability_score': [8, 6, 3, 9, 7]
}

df = pd.DataFrame(fabric_data)
print("Textile Material Analysis")
print(df)`,
      language: "python",
    },
  ]);

  const [graphOutput, setGraphOutput] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const addCell = (type: "code" | "markdown") => {
    const newCell: CodeCell = {
      id: Date.now().toString(),
      type,
      content: type === "markdown" ? "# New Section" : "# New analysis code",
      language: type === "code" ? "python" : undefined,
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

  const executeCell = (id: string) => {
    const cell = cells.find((c) => c.id === id);
    if (!cell || cell.type !== "code") return;

    // Simulate code execution
    let output = "";

    if (cell.content.includes("matplotlib") || cell.content.includes("plt")) {
      // Simulate graph generation
      setGraphOutput(`
        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin: 10px 0;">
          <h4>Generated Chart: Material Analysis</h4>
          <div style="width: 100%; height: 300px; background: linear-gradient(45deg, #e3f2fd, #bbdefb); 
                      display: flex; align-items: center; justify-content: center; border-radius: 4px;">
            <p style="color: #1976d2; font-weight: bold;">📊 Interactive Chart Generated</p>
          </div>
          <p style="margin-top: 10px; color: #666; font-size: 14px;">
            Chart showing GSM vs Price relationship across different materials
          </p>
        </div>
      `);
      output = "Chart generated successfully! See visualization below.";
    } else if (cell.content.includes("print")) {
      output = `Textile Material Analysis
                material  gsm  price_per_meter  sustainability_score
0               Cotton  180               25                     8
1                 Silk  120               85                     6
2           Polyester  150               15                     3
3                Linen  160               45                     9
4                 Wool  220               65                     7`;
    } else {
      output = "Code executed successfully! (Python integration ready)";
    }

    setCells(
      cells.map((cell) => (cell.id === id ? { ...cell, output } : cell))
    );
  };

  const clearGraphOutput = () => {
    setGraphOutput(null);
  };

  const exportNotebook = () => {
    const notebook = {
      cells: cells.map((cell) => ({
        cell_type: cell.type,
        source: cell.content.split("\n"),
        outputs: cell.output
          ? [{ output_type: "stream", text: cell.output }]
          : [],
        metadata: cell.language ? { language: cell.language } : {},
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
    a.download = "textile_analytics.ipynb";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (content: string) => {
    return content
      .replace(
        /^# (.*$)/gm,
        '<h1 class="text-2xl font-bold mb-4 text-slate-800">$1</h1>'
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 class="text-xl font-semibold mb-3 text-slate-700">$1</h2>'
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 class="text-lg font-medium mb-2 text-slate-600">$1</h3>'
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`(.*?)`/g,
        '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )
      .replace(/\n/g, "<br>");
  };

  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Advanced Textile Analytics Notebook
          </CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="default" className="bg-green-600">
              Ready
            </Badge>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addCell("code")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addCell("markdown")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={exportNotebook}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Graph Output Area - Fixed position that can be cleared */}
      {graphOutput && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-blue-800">
                Data Visualization Output
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearGraphOutput}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: graphOutput }} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {cells.map((cell, index) => (
          <Card key={cell.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={cell.type === "code" ? "default" : "secondary"}
                  >
                    {cell.type === "code" ? (
                      <Code className="w-3 h-3 mr-1" />
                    ) : (
                      <FileText className="w-3 h-3 mr-1" />
                    )}
                    {cell.type === "code" ? "Code" : "Markdown"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Cell {index + 1}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {cell.type === "code" && (
                    <Button size="sm" onClick={() => executeCell(cell.id)}>
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCell(cell.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {cell.type === "code" ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Editor
                      height="200px"
                      language={cell.language || "python"}
                      value={cell.content}
                      onChange={(value) => updateCell(cell.id, value || "")}
                      theme="light"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 10, bottom: 10 },
                      }}
                      onMount={(editor) => {
                        if (cell.id === "2") editorRef.current = editor;
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Editor
                      height="120px"
                      language="markdown"
                      value={cell.content}
                      onChange={(value) => updateCell(cell.id, value || "")}
                      theme="light"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "off",
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 10, bottom: 10 },
                      }}
                    />
                    {cell.content && (
                      <div className="border-t pt-4">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(cell.content),
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {cell.output && (
                  <div className="border-t pt-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-slate-600 mb-2">
                        Output:
                      </div>
                      <pre className="font-mono text-sm whitespace-pre-wrap text-slate-800">
                        {cell.output}
                      </pre>
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

export default MonacoCodeEditor;
