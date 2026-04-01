"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  GripVertical,
} from "lucide-react";
import Link from "next/link";

export default function ReorderPDFPages() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // { index, dataUrl }
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const pdfjsRef = useRef(null);
  const pdfDataRef = useRef(null);

  useEffect(() => {
    async function loadPdfJs() {
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        pdfjsRef.current = pdfjs;
      } catch (e) {
        console.error("Failed to load pdf.js:", e);
      }
    }
    loadPdfJs();
  }, []);

  const onDrop = useCallback(async (accepted) => {
    const f = accepted.find((f) => f.type === "application/pdf");
    if (!f) return setError("Please select a valid PDF file.");
    setError(null); setSuccess(false); setPages([]); setFile(f); setIsLoading(true); setProgress(0);
    try {
      const buf = await f.arrayBuffer();
      pdfDataRef.current = buf;
      const pdfjs = pdfjsRef.current;
      if (!pdfjs) throw new Error("PDF.js not loaded");
      const pdf = await pdfjs.getDocument({ data: buf }).promise;
      const total = pdf.numPages;
      const previews = [];
      for (let i = 1; i <= total; i++) {
        setProgress(Math.round((i / total) * 100));
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        previews.push({ index: i, dataUrl: canvas.toDataURL() });
      }
      setPages(previews);
    } catch (err) {
      console.error(err); setError("Failed to load PDF.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, multiple: false, disabled: isLoading || isProcessing,
  });

  // Drag-and-drop reorder
  const handleDragStart = (i) => setDragIdx(i);
  const handleDragOver = (e, i) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setPages((prev) => {
      const arr = [...prev];
      const [removed] = arr.splice(dragIdx, 1);
      arr.splice(i, 0, removed);
      setDragIdx(i);
      return arr;
    });
  };
  const handleDragEnd = () => setDragIdx(null);

  const saveReordered = async () => {
    if (!pdfDataRef.current || pages.length === 0) return;
    setIsProcessing(true); setError(null); setSuccess(false);
    try {
      const srcDoc = await PDFDocument.load(pdfDataRef.current);
      const newDoc = await PDFDocument.create();
      const indices = pages.map((p) => p.index - 1);
      const copied = await newDoc.copyPages(srcDoc, indices);
      copied.forEach((pg) => newDoc.addPage(pg));
      const bytes = await newDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `reordered-${file.name}`;
      document.body.appendChild(a); a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      setSuccess(true);
    } catch (err) {
      console.error(err); setError("Failed to save reordered PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <GripVertical className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Reorder PDF Pages</h1>
                <p className="text-pink-100 text-sm">Drag and drop pages to rearrange them</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
              </div>
            )}

            {!file ? (
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <div className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                  isDragActive ? "border-pink-400 bg-pink-50" : "border-gray-200 hover:border-pink-400 hover:bg-pink-50"
                }`}>
                  <FileUp className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? "text-pink-500" : "text-gray-400"}`} />
                  <p className="font-medium text-gray-700">{isDragActive ? "Drop your PDF here" : "Drag & drop PDF or click to browse"}</p>
                  <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                    <FileUp className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-400">{pages.length} pages</p>
                  </div>
                </div>
                <button onClick={() => { setFile(null); setPages([]); pdfDataRef.current = null; setSuccess(false); }}
                  className="text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-pink-700 font-medium flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading page previews...
                  </span>
                  <span className="font-bold text-pink-700">{progress}%</span>
                </div>
                <div className="h-2 bg-pink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {pages.length > 0 && !isLoading && (
              <>
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                  <GripVertical className="w-3.5 h-3.5" /> Drag pages to reorder, then click Save
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto p-1">
                  {pages.map((page, i) => (
                    <div
                      key={`${page.index}-${i}`}
                      draggable
                      onDragStart={() => handleDragStart(i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      onDragEnd={handleDragEnd}
                      className={`relative cursor-grab active:cursor-grabbing rounded-xl overflow-hidden border-2 transition-all shadow-sm hover:shadow-md ${
                        dragIdx === i ? "border-pink-400 opacity-70 scale-95" : "border-gray-100 hover:border-pink-300"
                      }`}
                    >
                      <img src={page.dataUrl} alt={`Page ${i + 1}`} className="w-full h-auto" />
                      <div className="absolute top-1 right-1 bg-black/60 text-white text-xs rounded px-1.5 py-0.5">
                        {i + 1}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                        orig. {page.index}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-4 text-pink-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Saving reordered PDF...</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> PDF downloaded with new page order!
              </div>
            )}
          </div>

          <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={saveReordered}
              disabled={pages.length === 0 || isProcessing || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Download className="w-4 h-4" /> Save & Download</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
