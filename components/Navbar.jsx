"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileUp,
  Scissors,
  RotateCw,
  Trash2,
  Layers,
  Image,
  GripVertical,
  Stamp,
  Lock,
  ChevronDown,
  Menu,
  X,
  FileText,
} from "lucide-react";

const tools = [
  { name: "Merge PDF", href: "/merge-pdf", icon: Layers, color: "text-blue-500" },
  { name: "Split PDF", href: "/split-pdf", icon: Scissors, color: "text-violet-500" },
  { name: "Compress PDF", href: "/compress-pdf", icon: FileUp, color: "text-green-500" },
  { name: "Remove Pages", href: "/remove-pdf-pages", icon: Trash2, color: "text-red-500" },
  { name: "Rotate Pages", href: "/rotate-pdf-pages", icon: RotateCw, color: "text-orange-500" },
  { name: "Reorder Pages", href: "/reorder-pdf-pages", icon: GripVertical, color: "text-pink-500" },
  { name: "PDF to Images", href: "/pdf-to-images", icon: Image, color: "text-cyan-500" },
  { name: "Add Watermark", href: "/watermark-pdf", icon: Stamp, color: "text-amber-500" },
  { name: "Protect PDF", href: "/protect-pdf", icon: Lock, color: "text-emerald-500" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              PDF Tools
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors py-2"
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                All Tools
                <ChevronDown className="w-4 h-4" />
              </button>
              {/* Dropdown */}
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${toolsOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
              >
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72 grid grid-cols-1 gap-1">
                  {tools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <tool.icon className={`w-4 h-4 ${tool.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-md hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
              <span className="text-sm font-medium text-gray-700">{tool.name}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
