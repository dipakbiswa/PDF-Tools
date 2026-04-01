"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import {
  FileUp,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Image as ImageIcon,
  Package,
} from "lucide-react";
import Link from "next/link";

export default function PDFToImages() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState("image/png");
  const [scale, setScale] = useState(1.5);
  const pdfjsRef = useRef(null);

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

  const onDrop = useCallback((accepted) => {
    const f = accepted.find((f) => f.type === "application/pdf");
    if (!f) return setError("Please select a valid PDF file.");
    setFile(f); setImages([]); setError(null); setProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, multiple: false, disabled: isProcessing,
  });

  const convertToImages = async () => {
    if (!file || !pdfjsRef.current) return;
    setIsProcessing(true); setError(null); setImages([]); setProgress(0);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsRef.current.getDocument({ data: buf }).promise;
      const total = pdf.numPages;
      const imgs = [];
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        const ext = format === "image/png" ? "png" : "jpg";
        imgs.push({ dataUrl: canvas.toDataURL(format, 0.92), name: `page-${i}.${ext}`, page: i });
        setProgress(Math.round((i / total) * 100));
      }
      setImages(imgs);
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (img) => {
    const a = document.createElement("a");
    a.href = img.dataUrl; a.download = img.name;
    document.body.appendChild(a); a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    images.forEach((img) => {
      const base64 = img.dataUrl.split(",")[1];
      zip.file(img.name, base64, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url; a.download = `${file.name.replace(".pdf","")}-images.zip`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-cyan-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">PDF to Images</h1>
                <p className="text-cyan-100 text-sm">Convert every PDF page to PNG or JPEG</p>
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
                isDragActive ? "border-cyan-400 bg-cyan-50" : "border-gray-200 hover:border-cyan-400 hover:bg-cyan-50"
              }`}>
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <FileUp className="w-4 h-4 text-cyan-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate max-w-xs">{file.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); setImages([]); }}
                      className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <FileUp className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? "text-cyan-500" : "text-gray-400"}`} />
                    <p className="font-medium text-gray-700">{isDragActive ? "Drop your PDF here" : "Drag & drop PDF or click to browse"}</p>
                  </>
                )}
              </div>
            </div>

            {file && (
              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Output Format</label>
                  <div className="flex gap-2">
                    {["image/png", "image/jpeg"].map((f) => (
                      <button key={f} onClick={() => setFormat(f)}
                        className={`flex-1 py-2 text-sm rounded-xl border font-medium transition-colors ${
                          format === f ? "bg-cyan-600 text-white border-cyan-600" : "bg-white text-gray-600 border-gray-200 hover:border-cyan-300"
                        }`}>
                        {f === "image/png" ? "PNG" : "JPEG"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">
                    Quality: <span className="text-gray-700">{scale === 1 ? "Standard" : scale === 1.5 ? "High" : "Very High"}</span>
                  </label>
                  <input
                    type="range" min={1} max={2} step={0.5} value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-cyan-700 font-medium flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" /> Converting pages...
                  </span>
                  <span className="text-cyan-700 font-bold">{progress}%</span>
                </div>
                <div className="h-2 bg-cyan-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    {images.length} pages converted
                  </p>
                  <button
                    onClick={downloadAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white text-xs font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    <Package className="w-3.5 h-3.5" /> Download ZIP
                  </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto">
                  {images.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm aspect-[3/4]">
                      <img src={img.dataUrl} alt={`Page ${img.page}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        <button onClick={() => downloadImage(img)}
                          className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 rounded-lg p-1.5 transition-all">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                        Page {img.page}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={convertToImages}
              disabled={!file || isProcessing || !pdfjsRef.current}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Converting...</> : <>Convert to Images</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
