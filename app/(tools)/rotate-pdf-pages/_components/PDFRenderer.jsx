"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import just what we need for worker initialization
import { pdfjs } from "react-pdf";

// Set worker source before any rendering occurs
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
}

// Dynamically import Page and Document components
const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  {
    ssr: false,
    loading: () => (
      <div className="text-center p-8">Loading PDF components...</div>
    ),
  }
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
  loading: () => (
    <div className="w-[180px] h-[240px] bg-gray-100 flex items-center justify-center">
      Loading page...
    </div>
  ),
});

// Import UI components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, RotateCw } from "lucide-react";

export default function PDFRenderer({
  file,
  onLoadSuccess,
  onLoadError,
  pageRotations,
  rotatePageHandler,
}) {
  const [numPages, setNumPages] = useState(null);

  const handleLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    if (onLoadSuccess) onLoadSuccess(pdf);
  };

  // Split the rendering to avoid issues
  const renderPages = () => {
    if (!numPages) return null;

    return Array.from(new Array(numPages), (_, index) => (
      <Card
        key={`page_${index + 1}`}
        className="p-4 flex flex-col items-center mb-6"
      >
        <div className="text-sm font-medium mb-2">Page {index + 1}</div>
        <div
          className="relative border border-gray-200 rounded mb-3"
          style={{
            transform: `rotate(${pageRotations[index + 1] || 0}deg)`,
            transition: "transform 0.3s ease",
          }}
        >
          <Page
            pageNumber={index + 1}
            width={180}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </div>
        <div className="flex space-x-2 mt-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => rotatePageHandler(index + 1, "left")}
            title="Rotate Left"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => rotatePageHandler(index + 1, "right")}
            title="Rotate Right"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    ));
  };

  return (
    <>
      <Document
        file={file}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={onLoadError}
        className="mb-4"
        loading={<div className="text-center p-8">Loading PDF document...</div>}
        error={
          <div className="text-center p-8 text-red-500">Error loading PDF!</div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderPages()}
        </div>
      </Document>

      {!numPages && <div className="text-center p-8">Loading PDF pages...</div>}
    </>
  );
}
