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
  Scissors,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";

export default function SplitPDF() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [ranges, setRanges] = useState([{ from: 1, to: 1 }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (accepted) => {
    const f = accepted.find((f) => f.type === "application/pdf");
    if (!f) return setError("Please select a valid PDF file.");
    setError(null);
    setResults([]);
    setFile(f);
    const buf = await f.arrayBuffer();
    const doc = await PDFDocument.load(buf);
    const n = doc.getPageCount();
    setNumPages(n);
    setRanges([{ from: 1, to: n }]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    disabled: isProcessing,
  });

  const addRange = () => setRanges((r) => [...r, { from: 1, to: numPages }]);
  const removeRange = (i) => setRanges((r) => r.filter((_, idx) => idx !== i));
  const updateRange = (i, field, val) =>
    setRanges((r) => r.map((range, idx) => (idx === i ? { ...range, [field]: Number(val) } : range)));

  const splitPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setResults([]);
    try {
      const buf = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buf);
      const newResults = [];
      for (let ri = 0; ri < ranges.length; ri++) {
        const { from, to } = ranges[ri];
        const start = Math.max(1, Math.min(from, numPages));
        const end = Math.max(start, Math.min(to, numPages));
        const newDoc = await PDFDocument.create();
        const indices = [];
        for (let p = start - 1; p <= end - 1; p++) indices.push(p);
        const pages = await newDoc.copyPages(srcDoc, indices);
        pages.forEach((pg) => newDoc.addPage(pg));
        const bytes = await newDoc.save();
        const blob = new Blob([bytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        newResults.push({ url, name: `split-part${ri + 1}-${file.name}`, pages: `Pages ${start}–${end}` });
      }
      setResults(newResults);
    } catch (err) {
      console.error(err);
      setError("Failed to split PDF. The file may be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadAll = () => results.forEach((r) => {
    const a = document.createElement("a");
    a.href = r.url; a.download = r.name;
    document.body.appendChild(a); a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Split PDF</h1>
                <p className="text-violet-100 text-sm">Extract pages or split into multiple files</p>
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
                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragActive ? "border-violet-400 bg-violet-50" : "border-gray-200 hover:border-violet-400 hover:bg-violet-50"
                }`}>
                  <FileUp className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? "text-violet-500" : "text-gray-400"}`} />
                  <p className="font-medium text-gray-700">{isDragActive ? "Drop your PDF here" : "Drag & drop PDF or click to browse"}</p>
                  <p className="text-sm text-gray-400 mt-1">PDF files only</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <FileUp className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-gray-400">{numPages} pages total</p>
                    </div>
                  </div>
                  <button onClick={() => { setFile(null); setResults([]); }} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Ranges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-700">Page Ranges</h2>
                    <button onClick={addRange} className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium">
                      <Plus className="w-3.5 h-3.5" /> Add Range
                    </button>
                  </div>
                  {ranges.map((range, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="text-xs text-gray-500 font-medium w-14">Part {i + 1}</span>
                      <span className="text-xs text-gray-500">From page</span>
                      <input
                        type="number" min={1} max={numPages} value={range.from}
                        onChange={(e) => updateRange(i, "from", e.target.value)}
                        className="w-16 text-center text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none"
                      />
                      <span className="text-xs text-gray-500">to</span>
                      <input
                        type="number" min={1} max={numPages} value={range.to}
                        onChange={(e) => updateRange(i, "to", e.target.value)}
                        className="w-16 text-center text-sm border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-violet-300 focus:border-violet-400 outline-none"
                      />
                      {ranges.length > 1 && (
                        <button onClick={() => removeRange(i)} className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Results */}
                {results.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Split files ready
                      </h2>
                      {results.length > 1 && (
                        <button onClick={downloadAll} className="text-xs text-violet-600 hover:underline font-medium">
                          Download all
                        </button>
                      )}
                    </div>
                    {results.map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-violet-50 rounded-xl p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700">{r.name}</p>
                          <p className="text-xs text-gray-500">{r.pages}</p>
                        </div>
                        <a href={r.url} download={r.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                          <Download className="w-3.5 h-3.5" /> Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {isProcessing && (
                  <div className="flex items-center justify-center gap-2 py-4 text-violet-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">Splitting PDF...</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={splitPDF}
              disabled={!file || isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Splitting...</> : <>Split PDF</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
