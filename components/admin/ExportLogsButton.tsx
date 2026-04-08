"use client";

import { Download } from "lucide-react";

interface ExportLogsButtonProps {
  logs: Array<{
    id: string;
    accessedAt: Date;
  }>;
  clientName: string;
}

export function ExportLogsButton({ logs, clientName }: ExportLogsButtonProps) {
  const handleExport = () => {
    if (logs.length === 0) {
      return;
    }

    // Create CSV content
    const csvHeader = "Access Number,Timestamp\n";
    const csvRows = logs
      .reverse()
      .map((log, index) => {
        const timestamp = new Date(log.accessedAt).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        return `${index + 1},"${timestamp}"`;
      })
      .join("\n");

    const csvContent = csvHeader + csvRows;

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    const filename = `${clientName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-access-logs-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={logs.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}
