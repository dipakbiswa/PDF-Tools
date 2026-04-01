export default function sitemap() {
  const baseUrl = "https://pdf-tools.vercel.app";

  const tools = [
    "/merge-pdf",
    "/split-pdf",
    "/compress-pdf",
    "/remove-pdf-pages",
    "/rotate-pdf-pages",
    "/reorder-pdf-pages",
    "/pdf-to-images",
    "/watermark-pdf",
    "/protect-pdf",
  ];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...tools.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
