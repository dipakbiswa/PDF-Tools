"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, RotateCcw, RotateCw, Download, FileUp, ArrowLeft } from "lucide-react";

// Dynamically import PDFRenderer with no SSR
const PDFRenderer = dynamic(() => import("./_components/PDFRenderer"), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading PDF viewer...</div>,
});

export default function PDFRotator() {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageRotations, setPageRotations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfLib, setPdfLib] = useState(null);
  const fileInputRef = useRef(null);

  // Dynamically load pdf-lib on client side
  useEffect(() => {
    const loadPdfLib = async () => {
      try {
        const module = await import("pdf-lib");
        setPdfLib(module);
      } catch (error) {
        console.error("Error loading pdf-lib:", error);
        setError(
          "Failed to load PDF processing library. Please refresh the page."
        );
      }
    };

    loadPdfLib();
  }, []);

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setPageRotations({});
      setError(null);
    } else {
      setPdfFile(null);
      setError("Please upload a valid PDF file");
    }
  };

  // Handle document load success
  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    // Initialize rotations for all pages to 0
    const initialRotations = {};
    for (let i = 1; i <= pdf.numPages; i++) {
      initialRotations[i] = 0;
    }
    setPageRotations(initialRotations);
  };

  // Handle rotation
  const rotatePageHandler = (pageNumber, direction) => {
    setPageRotations((prev) => {
      const currentRotation = prev[pageNumber] || 0;
      const newRotation =
        (currentRotation + (direction === "left" ? -90 : 90)) % 360;
      // If negative, convert to positive equivalent
      return {
        ...prev,
        [pageNumber]: newRotation < 0 ? 360 + newRotation : newRotation,
      };
    });
  };

  // Process and download the rotated PDF
  const processAndDownloadPDF = async () => {
    if (!pdfFile || !pdfLib) {
      setError("PDF file or PDF library not loaded");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Load the PDF file as bytes
      const fileData = await pdfFile.arrayBuffer();

      // Load the PDF document
      const { PDFDocument } = pdfLib;
      const pdfDoc = await PDFDocument.load(fileData);

      // Apply rotations
      const pages = pdfDoc.getPages();

      Object.entries(pageRotations).forEach(([pageNum, rotation]) => {
        const pageIndex = parseInt(pageNum) - 1;
        if (pageIndex >= 0 && pageIndex < pages.length) {
          const page = pages[pageIndex];

          // pdf-lib only accepts rotations of 0, 90, 180, or 270 degrees
          // Convert our UI rotation to one of these valid values

          // First, get the original rotation
          const originalRotation = page.getRotation().angle || 0;

          // Calculate the new rotation
          // We need to ensure it's one of the valid values: 0, 90, 180, or 270
          let newRotation = (originalRotation + rotation) % 360;

          // Make sure we have a positive value
          if (newRotation < 0) newRotation += 360;

          // Round to the nearest valid rotation (0, 90, 180, 270)
          const validRotations = [0, 90, 180, 270];
          newRotation = validRotations.reduce((prev, curr) =>
            Math.abs(curr - newRotation) < Math.abs(prev - newRotation)
              ? curr
              : prev
          );

          // Set the rotation
          page.setRotation({ angle: newRotation });
        }
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();

      // Convert to Blob and download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Create and trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `rotated-${pdfFile.name || "document.pdf"}`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

      setIsLoading(false);
    } catch (error) {
      console.error("Error processing PDF:", error);
      setError(`Error processing PDF: ${error.message}`);
      setIsLoading(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setPdfFile(null);
    setNumPages(null);
    setPageRotations({});
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all tools
      </Link>
      <h1 className="text-3xl font-bold mb-6 text-center">PDF Page Rotator</h1>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button onClick={handleReset} variant="outline">
            Clear
          </Button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {pdfFile && (
        <div className="space-y-4">
          <PDFRenderer
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={() => setError("Error loading PDF")}
            pageRotations={pageRotations}
            rotatePageHandler={rotatePageHandler}
          />

          <div className="flex justify-center mt-6">
            <Button
              onClick={processAndDownloadPDF}
              disabled={isLoading || !pdfLib}
              className="w-full max-w-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Rotated PDF
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {!pdfFile && (
        <div className="text-center p-12 border-2 border-dashed rounded-lg">
          <FileUp className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-600">Upload a PDF file to get started</p>
        </div>
      )}
    </div>
  );
}
