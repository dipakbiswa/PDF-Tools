"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileUp,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useDropzone } from "react-dropzone";

export default function PDFMerger() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // Filter to only keep PDF files
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );

    if (pdfFiles.length < acceptedFiles.length) {
      setError("Some files were skipped as they weren't PDF files");
      setTimeout(() => setError(null), 3000);
    }

    setSelectedFiles((prev) => [...prev, ...pdfFiles]);
    // Reset merged PDF if new files are selected
    setMergedPdfUrl(null);
    setSuccess(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    disabled: isProcessing,
  });

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    // Reset merged PDF if files change
    setMergedPdfUrl(null);
    setSuccess(false);
  };

  const removeAllFiles = () => {
    setSelectedFiles([]);
    setMergedPdfUrl(null);
    setSuccess(false);
  };

  const mergePDFs = async () => {
    if (selectedFiles.length < 2) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // Update progress
        setProgress(Math.round((i / selectedFiles.length) * 100));

        // Convert file to ArrayBuffer
        const fileBuffer = await file.arrayBuffer();

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(fileBuffer);

        // Get all pages from the document
        const pages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );

        // Add each page to the merged document
        for (const page of pages) {
          mergedPdf.addPage(page);
        }
      }

      setProgress(100);

      // Serialize the merged PDF document
      const mergedPdfBytes = await mergedPdf.save();

      // Create a Blob from the PDF bytes
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
      setSuccess(true);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      setError("Failed to merge PDFs. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 bg-gray-50 min-h-screen">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to all tools
      </Link>
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <FileUp className="h-6 w-6" />
            PDF Merger
          </CardTitle>
          <CardDescription className="text-blue-100">
            Upload multiple PDF files to merge them into a single document
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                <AlertDescription>PDFs merged successfully!</AlertDescription>
              </Alert>
            )}

            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <div
                className={`border-2 rounded-lg p-6 transition-all ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50 border-dashed"
                    : "border-gray-200 border-dashed hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3 py-4">
                  <div
                    className={`rounded-full p-3 ${
                      isDragActive ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Upload
                      className={`h-8 w-8 ${
                        isDragActive ? "text-blue-600" : "text-gray-500"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-700">
                      {isDragActive
                        ? "Drop your PDFs here"
                        : "Drag & drop your PDF files here"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      or click to browse files
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium flex items-center">
                    <FileUp className="h-4 w-4 mr-2 text-blue-600" />
                    Selected files ({selectedFiles.length})
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeAllFiles}
                    disabled={isProcessing}
                    className="text-gray-500 hover:text-red-500"
                  >
                    Clear all
                  </Button>
                </div>
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-md border border-gray-100 shadow-sm hover:shadow transition-all"
                    >
                      <div className="flex items-center overflow-hidden">
                        <div className="flex-shrink-0 h-8 w-8 rounded bg-blue-100 flex items-center justify-center mr-3">
                          <FileUp className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        disabled={isProcessing}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-blue-700">
                    Merging PDFs...
                  </span>
                  <span className="text-blue-700 font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-blue-100" />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6 bg-gray-50">
          <div className="text-sm text-gray-500">
            {selectedFiles.length > 0 ? (
              <span>
                {selectedFiles.length} file
                {selectedFiles.length !== 1 ? "s" : ""} selected
              </span>
            ) : (
              <span>No files selected</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              onClick={mergePDFs}
              disabled={selectedFiles.length < 2 || isProcessing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isProcessing ? <>Processing...</> : <>Merge PDFs</>}
            </Button>
            {mergedPdfUrl && (
              <Button
                variant="outline"
                asChild
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <a href={mergedPdfUrl} download="merged.pdf">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
