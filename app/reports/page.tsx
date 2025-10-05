// app/reports/page.tsx
"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link"; // Import the Link component

// Interface to define the structure of a file document
interface FileDocument {
  $id: string;
  name: string;
  size: number;
  $createdAt: string;
  url: string; // Add the url property
}

export default function ReportsPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredFiles, setFilteredFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const startISO = startDate.toISOString();
      const endISO = endDate.toISOString();

      const response = await fetch(
        `/api/files/reports?startDate=${startISO}&endDate=${endISO}`,
      );
      const data = await response.json();
      setFilteredFiles(data.files);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">File Reports</h2>
      </div>
      <div className="flex items-end space-x-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              if (e.target.value) {
                setStartDate(new Date(e.target.value));
              } else {
                setStartDate(undefined);
              }
            }}
            className="w-[280px] rounded-md border p-2"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
            onChange={(e) => {
              if (e.target.value) {
                setEndDate(new Date(e.target.value));
              } else {
                setEndDate(undefined);
              }
            }}
            className="w-[280px] rounded-md border p-2"
          />
        </div>
        <Button
          onClick={handleFilter}
          disabled={loading || !startDate || !endDate}
        >
          {loading ? "Filtering..." : "Filter"}
        </Button>
      </div>
      <Card>
        <div className="p-4">
          <h3 className="mb-4 text-xl font-semibold">Filtered Files</h3>
          {filteredFiles.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredFiles.map((file) => (
                // Wrap the file info in a Link component
                <Link key={file.$id} href={file.url} passHref>
                  <div className="cursor-pointer rounded-md border p-4 transition-colors duration-200 hover:bg-gray-100">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-sm text-gray-500">
                      Uploaded On:{" "}
                      {format(
                        new Date(file.$createdAt),
                        "dd MMMM yyyy, h:mm a",
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              No files found for the selected date range.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
