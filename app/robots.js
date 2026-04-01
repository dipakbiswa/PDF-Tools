export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://pdf-tools.vercel.app/sitemap.xml",
  };
}
