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
  Shield,
  Zap,
  Monitor,
  ArrowRight,
  ChevronRight,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Free Online PDF Tools — Merge, Split, Compress & More",
  description:
    "Free, fast and secure PDF tools that work entirely in your browser. Merge, split, compress, rotate, watermark and protect PDFs — no uploads, no sign-up required.",
  openGraph: {
    title: "Free Online PDF Tools — Merge, Split, Compress & More",
    description:
      "Merge, split, compress, rotate, watermark and protect PDFs — free, private, and instant.",
  },
};

const tools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one document in the order you want.",
    href: "/merge-pdf",
    icon: Layers,
    gradient: "from-blue-500 to-blue-700",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "Most Popular",
  },
  {
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple separate files.",
    href: "/split-pdf",
    icon: Scissors,
    gradient: "from-violet-500 to-violet-700",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining good quality.",
    href: "/compress-pdf",
    icon: FileUp,
    gradient: "from-green-500 to-green-700",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    name: "Remove Pages",
    description: "Select and delete specific pages from your PDF document.",
    href: "/remove-pdf-pages",
    icon: Trash2,
    gradient: "from-red-500 to-red-700",
    bg: "bg-red-50",
    iconColor: "text-red-600",
  },
  {
    name: "Rotate Pages",
    description: "Rotate individual pages or the entire PDF to the right orientation.",
    href: "/rotate-pdf-pages",
    icon: RotateCw,
    gradient: "from-orange-500 to-orange-700",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    name: "Reorder Pages",
    description: "Drag and drop to rearrange PDF pages in any order you like.",
    href: "/reorder-pdf-pages",
    icon: GripVertical,
    gradient: "from-pink-500 to-pink-700",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    name: "PDF to Images",
    description: "Convert every PDF page into a high-quality PNG or JPEG image.",
    href: "/pdf-to-images",
    icon: Image,
    gradient: "from-cyan-500 to-cyan-700",
    bg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    name: "Add Watermark",
    description: "Stamp a custom text watermark on every page of your PDF.",
    href: "/watermark-pdf",
    icon: Stamp,
    gradient: "from-amber-500 to-amber-700",
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    name: "Protect PDF",
    description: "Password-protect your PDF to prevent unauthorised access.",
    href: "/protect-pdf",
    icon: Lock,
    gradient: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const features = [
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Your files are processed entirely in your browser. They never leave your device and are never uploaded to any server.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "No waiting for uploads or server processing. Everything happens instantly right in your browser using WebAssembly.",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
  {
    icon: Monitor,
    title: "Works Everywhere",
    description:
      "No installation needed. Works on Windows, macOS, Linux, iOS and Android — any modern browser, any device.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your tool",
    description: "Select the PDF tool you need from our collection of 9 powerful utilities.",
  },
  {
    number: "02",
    title: "Upload your PDF",
    description: "Drag & drop or click to select your PDF file. It stays on your device.",
  },
  {
    number: "03",
    title: "Download the result",
    description: "Your processed PDF is ready instantly. Click to download and you're done!",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950 text-white py-20 md:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-blue-200">Free, Private &amp; Works in your Browser</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight mb-6">
            The Only PDF Toolkit
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              You'll Ever Need
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Merge, split, compress, rotate, watermark, and protect PDFs — all for free,
            all in your browser. No uploads. No sign-up. No limits.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#tools"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl text-white font-semibold text-lg shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200"
            >
              Explore All Tools
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/merge-pdf"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
            >
              Merge PDF
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-white/10">
            {[
              { value: "9+", label: "PDF Tools" },
              { value: "100%", label: "Free Forever" },
              { value: "0", label: "Files Uploaded" },
              { value: "∞", label: "No Size Limit" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              All the PDF Tools You Need
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Everything you need to work with PDFs — all free, all private, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="tool-card group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-blue-100 shadow-sm hover:shadow-xl"
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {tool.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4`}>
                  <tool.icon className={`w-6 h-6 ${tool.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Use Tool <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PDF Tools?
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Not just another PDF website — built with your privacy and speed as the top priority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-blue-300 text-lg max-w-xl mx-auto">
              Process your PDFs in three simple steps — no technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] right-0 h-px bg-gradient-to-r from-blue-500/50 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-2xl font-black mx-auto mb-5 shadow-lg">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-blue-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-violet-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to work with your PDF?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Pick a tool and get started in seconds — it's completely free.
          </p>
          <Link
            href="#tools"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Get Started — It's Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
