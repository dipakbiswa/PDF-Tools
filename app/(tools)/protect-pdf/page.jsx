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
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

export default function ProtectPDF() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
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

  const protectPDF = async () => {
    if (!file) return;
    if (!password) return setError("Please enter a password.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");

    setIsProcessing(true); setError(null); setSuccess(false);
    try {
      const buf = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buf);
      const bytes = await pdfDoc.save({
        userPassword: password,
        ownerPassword: password + "_owner",
        permissions: {
          modifying: false,
          copying: false,
          annotating: false,
          fillingForms: false,
          contentAccessibility: true,
          documentAssembly: false,
          printing: "lowResolution",
        },
      });
      setResultBytes(bytes);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to protect PDF. The file may already be encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultBytes) return;
    const blob = new Blob([resultBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `protected-${file.name}`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all tools
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Protect PDF</h1>
                <p className="text-emerald-100 text-sm">Add password protection to your PDF</p>
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
                isDragActive ? "border-emerald-400 bg-emerald-50" : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
              }`}>
                {file ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FileUp className="w-4 h-4 text-emerald-600" />
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
                    <FileUp className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? "text-emerald-500" : "text-gray-400"}`} />
                    <p className="font-medium text-gray-700">{isDragActive ? "Drop your PDF here" : "Drag & drop PDF or click to browse"}</p>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-gray-700">Set Password</h2>

              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a strong password"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm pr-10 focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Confirm Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat the password"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 outline-none"
                />
              </div>

              {/* Strength indicator */}
              {password && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Password strength</span>
                    <span className={password.length >= 10 ? "text-green-600" : password.length >= 6 ? "text-yellow-600" : "text-red-500"}>
                      {password.length >= 10 ? "Strong" : password.length >= 6 ? "Medium" : "Weak"}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${password.length >= 10 ? "bg-green-500 w-full" : password.length >= 6 ? "bg-yellow-500 w-2/3" : "bg-red-500 w-1/3"}`}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <strong>Important:</strong> Remember your password — there is no way to recover it if lost. This tool applies AES-128 encryption.
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-4 text-emerald-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Encrypting PDF...</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-xl text-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> PDF protected successfully!
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              onClick={protectPDF}
              disabled={!file || isProcessing || !password}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
            >
              {isProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Protecting...</> : <><Lock className="w-4 h-4" /> Protect PDF</>}
            </button>
            {resultBytes && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition-colors"
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
