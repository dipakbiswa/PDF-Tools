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
  Stamp,
} from "lucide-react";
import Link from "next/link";

export default function WatermarkPDF() {
  const [file, setFile] = useState(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(30);
  const [fontSize, setFontSize] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBytes, setResultBytes] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onDrop = useCallback((accepted) => {
    const f = accepted.find((f) => f.type === "application/pdf");
    if (!f) return setError("Please select a valid PDF file.");
    setFile(f); setResultBytes(null); setSuccess(false); setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, multiple: false, disabled: isProcessing,
  });

  const applyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true); setError(null); setSuccess(false);
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const { StandardFonts, rgb, degrees } = await import("pdf-lib");
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();
      const color = rgb(0.7, 0.7, 0.7);
      const opacityVal = opacity / 100;

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2 - fontSize / 2,
          size: fontSize,
          font,
          color,
          opacity: opacityVal,
          rotate: degrees(45),
        });
      }

      const bytes = await pdfDoc.save();
      setResultBytes(bytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to add watermark. The file may be encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBytes) return;
    const blob = new Blob([resultBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `watermarked-${file.name}`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Add Watermark</h1>
                <p className="text-amber-100 text-sm">Stamp custom text on every page of your PDF</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
              </div>
            )}

            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                isDragActive ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-400 hover:bg-amber-50"
              }`}>
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FileUp className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setResultBytes(null); setSuccess(false); }}
                      className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <FileUp className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? "text-amber-500" : "text-gray-400"}`} />
                    <p className="font-medium text-gray-700">{isDragActive ? "Drop your PDF here" : "Drag & drop PDF or click to browse"}</p>
                  </>
                )}
              </div>
            </div>

            {/* Watermark settings */}
            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-700">Watermark Settings</h2>

              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Watermark Text</label>
                <input
                  type="text" value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">
                    Opacity: <span className="text-gray-700">{opacity}%</span>
                  </label>
                  <input
                    type="range" min={5} max={80} value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">
                    Font Size: <span className="text-gray-700">{fontSize}px</span>
                  </label>
                  <input
                    type="range" min={20} max={120} value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="border border-dashed border-amber-300 rounded-xl overflow-hidden bg-white h-24 flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <span
                    style={{
                      fontSize: `${Math.round(fontSize / 3)}px`,
                      color: `rgba(160,160,160,${opacity / 100})`,
                      transform: "rotate(-45deg)",
                      fontWeight: "bold",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {watermarkText || "Preview"}
                  </span>
                </div>
                <span className="absolute bottom-1.5 right-2 text-xs text-gray-400">Preview</span>
              </div>
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-4 text-amber-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Applying watermark...</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> Watermark applied successfully!
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={applyWatermark}
              disabled={!file || isProcessing || !watermarkText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Applying...</> : <>Apply Watermark</>}
            </button>
            {resultBytes && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 rounded-xl text-sm font-semibold transition-colors"
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
