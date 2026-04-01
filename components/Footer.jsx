import Link from "next/link";
import { FileText, Shield, Zap, Heart } from "lucide-react";

const toolLinks = [
  { name: "Merge PDF", href: "/merge-pdf" },
  { name: "Split PDF", href: "/split-pdf" },
  { name: "Compress PDF", href: "/compress-pdf" },
  { name: "Remove Pages", href: "/remove-pdf-pages" },
  { name: "Rotate Pages", href: "/rotate-pdf-pages" },
  { name: "Reorder Pages", href: "/reorder-pdf-pages" },
  { name: "PDF to Images", href: "/pdf-to-images" },
  { name: "Add Watermark", href: "/watermark-pdf" },
  { name: "Protect PDF", href: "/protect-pdf" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PDF Tools</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Free, fast, and secure PDF tools that work entirely in your browser. No uploads, no servers, no data stored.
            </p>
            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                100% Private
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                Instant
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                Free
              </div>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">PDF Tools</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Why PDF Tools?</h3>
            <ul className="space-y-2 text-sm">
              <li>✅ No file size limits</li>
              <li>✅ Works offline — no internet required</li>
              <li>✅ Your files never leave your device</li>
              <li>✅ No sign-up or account required</li>
              <li>✅ Works on any device or browser</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs">
            © {new Date().getFullYear()} PDF Tools. All rights reserved.
          </p>
          <p className="text-xs">
            All PDF processing happens locally in your browser. We never see your files.
          </p>
        </div>
      </div>
    </footer>
  );
}
