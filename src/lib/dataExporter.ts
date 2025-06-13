import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export interface AnalyticsData {
  [key: string]: any;
}

export class DataExporter {
  /**
   * Export data to Excel format
   */
  static exportToExcel(
    data: AnalyticsData[],
    filename: string,
    sheetName: string = "Sheet1"
  ) {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `${filename}.xlsx`);
      return true;
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      return false;
    }
  }

  /**
   * Export data to CSV format
   */
  static exportToCSV(data: AnalyticsData[], filename: string) {
    try {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${filename}.csv`);
      return true;
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      return false;
    }
  }

  /**
   * Export data to JSON format
   */
  static exportToJSON(data: AnalyticsData[], filename: string) {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      saveAs(blob, `${filename}.json`);
      return true;
    } catch (error) {
      console.error("Error exporting to JSON:", error);
      return false;
    }
  }

  /**
   * Generate Jupyter Notebook content
   */
  static generateJupyterNotebook(
    data: AnalyticsData[],
    title: string = "Analytics Report"
  ) {
    const notebook = {
      cells: [
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            `# ${title}\n`,
            "\n",
            "This notebook contains analytics data exported from the Weave Find admin dashboard.\n",
            "\n",
            "## Data Overview\n",
            `- Total records: ${data.length}\n`,
            `- Generated on: ${new Date().toISOString()}\n`,
          ],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "import pandas as pd\n",
            "import plotly.express as px\n",
            "import numpy as np\n",
            "\n",
            "# Load the data\n",
            `data = ${JSON.stringify(data, null, 2)}\n`,
            "df = pd.DataFrame(data)\n",
            "df.head()",
          ],
        },
        {
          cell_type: "code",
          execution_count: null,
          metadata: {},
          outputs: [],
          source: [
            "# Basic statistics\n",
            'print("Dataset Info:")\n',
            'print(f"Shape: {df.shape}")\n',
            'print(f"\\nColumns: {list(df.columns)}")\n',
            'print(f"\\nData types:")\n',
            "print(df.dtypes)\n",
            'print(f"\\nBasic statistics:")\n',
            "df.describe()",
          ],
        },
      ],
      metadata: {
        kernelspec: {
          display_name: "Python 3",
          language: "python",
          name: "python3",
        },
        language_info: {
          name: "python",
          version: "3.8.0",
        },
      },
      nbformat: 4,
      nbformat_minor: 4,
    };

    return notebook;
  }

  /**
   * Export as Jupyter Notebook
   */
  static exportToJupyterNotebook(
    data: AnalyticsData[],
    filename: string,
    title?: string
  ) {
    try {
      const notebook = this.generateJupyterNotebook(data, title);
      const blob = new Blob([JSON.stringify(notebook, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, `${filename}.ipynb`);
      return true;
    } catch (error) {
      console.error("Error exporting to Jupyter Notebook:", error);
      return false;
    }
  }

  /**
   * Generate Google Colab URL
   */
  static generateColabUrl(
    data: AnalyticsData[],
    title: string = "Analytics Report"
  ) {
    try {
      const notebook = this.generateJupyterNotebook(data, title);
      const notebookString = JSON.stringify(notebook);
      const encodedNotebook = encodeURIComponent(notebookString);

      // Create a GitHub Gist URL (in practice, you'd want to upload to GitHub first)
      const colabUrl = `https://colab.research.google.com/github/gist/${encodedNotebook}`;
      return colabUrl;
    } catch (error) {
      console.error("Error generating Colab URL:", error);
      return null;
    }
  }

  /**
   * Send data to Jupyter Hub (if configured)
   */
  static async sendToJupyterHub(data: AnalyticsData[], filename: string) {
    const jupyterUrl = import.meta.env.VITE_JUPYTER_HUB_URL;
    const jupyterToken = import.meta.env.VITE_JUPYTER_TOKEN;

    if (!jupyterUrl || !jupyterToken) {
      console.warn(
        "Jupyter Hub not configured. Please set VITE_JUPYTER_HUB_URL and VITE_JUPYTER_TOKEN"
      );
      return false;
    }

    try {
      const notebook = this.generateJupyterNotebook(data);

      const response = await fetch(
        `${jupyterUrl}/api/contents/${filename}.ipynb`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${jupyterToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "notebook",
            content: notebook,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        return `${jupyterUrl}/notebooks/${result.path}`;
      } else {
        console.error(
          "Failed to upload to Jupyter Hub:",
          await response.text()
        );
        return false;
      }
    } catch (error) {
      console.error("Error sending to Jupyter Hub:", error);
      return false;
    }
  }
}

export default DataExporter;
