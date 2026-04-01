"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import {
  FileUp,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Minimize2,
} from "lucide-react";
import Link from "next/link";

function formatBytes(bytes, decimals = 1) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

export default function CompressPDF() {
  const [file, setFile] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedBytes, setCompressedBytes] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const f = acceptedFiles.find((f) => f.type === "application/pdf");
    if (f) {
      setFile(f);
      setOriginalSize(f.size);
      setCompressedBytes(null);
      setCompressedSize(0);
      setSuccess(false);
      setError(null);
    } else {
      setError("Please select a valid PDF file.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: isProcessing,
  });

  const compressPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load with pdf-lib — re-saving optimises cross-references and compresses streams
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        updateMetadata: false,
      });

      // Save with object streams (compresses internal structure significantly)
      const savedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      setCompressedBytes(savedBytes);
      setCompressedSize(savedBytes.length);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to compress PDF. The file may be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBytes) return;
    const blob = new Blob([compressedBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name}`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  const reduction = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Minimize2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Compress PDF</h1>
                <p className="text-green-100 text-sm">Reduce your PDF file size — free &amp; private</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Alerts */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Dropzone */}
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                isDragActive ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-green-400 hover:bg-green-50"
              }`}>
                <FileUp className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? "text-green-500" : "text-gray-400"}`} />
                <p className="font-medium text-gray-700">
                  {isDragActive ? "Drop your PDF here" : "Drag & drop PDF or click to browse"}
                </p>
                <p className="text-sm text-gray-400 mt-1">PDF files only</p>
              </div>
            </div>

            {/* File info & stats */}
            {file && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-gray-400">Original: {formatBytes(originalSize)}</p>
                    </div>
                  </div>
                  <button onClick={() => { setFile(null); setCompressedBytes(null); setSuccess(false); }}
                    className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {success && (
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-200">
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Original</p>
                      <p className="font-semibold text-gray-800">{formatBytes(originalSize)}</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Compressed</p>
                      <p className="font-semibold text-green-600">{formatBytes(compressedSize)}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-xs text-green-600 mb-1">Reduction</p>
                      <p className="font-bold text-green-700">{reduction > 0 ? `-${reduction}%` : "Optimised"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-4 text-green-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Compressing PDF...</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                PDF compressed successfully!
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={compressPDF}
              disabled={!file || isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Compressing...</> : <>Compress PDF</>}
            </button>
            {compressedBytes && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-green-500 text-green-600 hover:bg-green-50 rounded-xl text-sm font-semibold transition-colors"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
