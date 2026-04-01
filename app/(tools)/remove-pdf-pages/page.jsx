// app/page.js
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PDFDocument } from "pdf-lib";
import {
  Loader2,
  Upload,
  Download,
  Trash,
  FileText,
  Eye,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function RemovePDFPages() {
  const [file, setFile] = useState(null);
  const [pdfData, setPdfData] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const pdfjsRef = useRef(null);

  // Initialize PDF.js in useEffect to avoid SSR issues
  useEffect(() => {
    async function initializePdfJs() {
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
        // Use CDN worker to avoid bundling issues
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        pdfjsRef.current = pdfjsLib;
      } catch (e) {
        console.error("Failed to load PDF.js:", e);
      }
    }
    initializePdfJs();
  }, []);

  const renderPdfToImages = async (data, scale = 0.5) => {
    const pdfjs = pdfjsRef.current;
    if (!pdfjs) return [];
    const pdf = await pdfjs.getDocument({ data }).promise;
    const total = pdf.numPages;
    const images = [];
    for (let i = 1; i <= total; i++) {
      setProgress(Math.floor((i / total) * 100));
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport }).promise;
      images.push(canvas.toDataURL());
    }
    return images;
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || selectedFile.type !== "application/pdf" || !pdfjsRef.current) return;
    setLoading(true);
    setFile(selectedFile);
    setProgress(0);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      setPdfData(arrayBuffer);
      const images = await renderPdfToImages(arrayBuffer, zoom);
      setPageImages(images);
      setSelectedPages([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error processing PDF:", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handlePageSelection = (index) => {
    setSelectedPages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleDeletePages = async () => {
    if (!pdfData || selectedPages.length === 0) return;
    setLoading(true);
    setProgress(0);
    try {
      const pdfDoc = await PDFDocument.load(pdfData);
      setProgress(20);
      const sortedIndicesToRemove = [...selectedPages].sort((a, b) => b - a);
      for (const index of sortedIndicesToRemove) pdfDoc.removePage(index);
      setProgress(40);
      const modifiedPdfBytes = await pdfDoc.save();
      setProgress(60);
      setPdfData(modifiedPdfBytes);
      const images = await renderPdfToImages(modifiedPdfBytes, zoom);
      setPageImages(images);
      setSelectedPages([]);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error removing pages:", error);
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  const handleDownload = async () => {
    if (!pdfData) return;
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file ? `edited-${file.name}` : "edited-document.pdf";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all tools
      </Link>
      <Card className="w-full shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-500 to-red-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white">Remove PDF Pages</CardTitle>
              <CardDescription className="text-red-100 mt-1">
                Select pages to delete, then download the modified document.
                <span className="block mt-1 text-xs italic">
                  All processing happens in your browser — your files stay private.
                </span>
              </CardDescription>
            </div>
            {file && (
              <Badge variant="outline" className="bg-white/20 text-white border-white/40 px-3 py-1 flex items-center gap-1">
                <FileText className="h-4 w-4" />{file.name}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {!file && (
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <input type="file" id="pdf-upload" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                <label htmlFor="pdf-upload">
                  <div className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-500 mb-3" />
                    <span className="text-lg font-medium text-gray-700 mb-1">Click to upload a PDF file</span>
                    <span className="text-sm text-gray-500">or drag and drop</span>
                  </div>
                </label>
              </div>
            )}

            {loading && (
              <div className="py-6 space-y-4">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-red-500 mr-3" />
                  <span className="text-lg font-medium text-gray-700">Processing PDF...</span>
                </div>
                <Progress value={progress} className="h-2 w-full" />
              </div>
            )}

            {pageImages.length > 0 && !loading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "grid" ? "single" : "grid")}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Toggle View Mode</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Badge variant="secondary">{Math.round(zoom * 100)}%</Badge>
                  </div>
                  <div className="space-x-2">
                    <Button variant="destructive" size="sm" onClick={handleDeletePages} disabled={selectedPages.length === 0}>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete {selectedPages.length > 0 ? `(${selectedPages.length})` : "Selected"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPages(pageImages.map((_, i) => i))}>Select All</Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedPages([])}>Clear</Button>
                  </div>
                </div>

                <Tabs value={viewMode} onValueChange={setViewMode} className="w-full">
                  <TabsList className="grid w-[200px] grid-cols-2">
                    <TabsTrigger value="grid">Grid View</TabsTrigger>
                    <TabsTrigger value="single">Single Page</TabsTrigger>
                  </TabsList>

                  <TabsContent value="grid" className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {pageImages.map((imgSrc, index) => (
                        <div key={index} className={`relative border rounded-md overflow-hidden group hover:shadow-md transition-shadow ${selectedPages.includes(index) ? "ring-2 ring-red-500" : ""}`}>
                          <img src={imgSrc} alt={`Page ${index + 1}`} className="w-full h-auto" />
                          <div className="absolute top-2 left-2 z-10">
                            <Checkbox checked={selectedPages.includes(index)} onCheckedChange={() => handlePageSelection(index)} id={`page-${index}`} className="bg-white/90" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1.5 px-2 text-center">Page {index + 1}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="single" className="mt-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative max-w-3xl mx-auto border rounded-md shadow-md">
                        {pageImages[currentPage - 1] && (
                          <img src={pageImages[currentPage - 1]} alt={`Page ${currentPage}`} className="w-full h-auto" />
                        )}
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium">Page {currentPage} of {pageImages.length}</span>
                        <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(pageImages.length, p + 1))} disabled={currentPage >= pageImages.length}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="pt-4 pb-2 flex items-center">
                        <Checkbox checked={selectedPages.includes(currentPage - 1)} onCheckedChange={() => handlePageSelection(currentPage - 1)} id={`single-page-${currentPage}`} className="mr-2" />
                        <label htmlFor={`single-page-${currentPage}`} className="text-sm cursor-pointer">Select this page</label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between bg-gray-50 border-t py-4">
          <div>
            {file && (
              <Button variant="outline" onClick={() => { setFile(null); setPdfData(null); setPageImages([]); setSelectedPages([]); }}>
                Upload Different PDF
              </Button>
            )}
          </div>
          <Button variant="default" onClick={handleDownload} disabled={!pdfData} className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />Download Modified PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
