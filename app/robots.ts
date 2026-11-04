import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    "/admin",
    "/admin/",
    "/api/",
    "/perfil",
    "/perfil/",
    "/dashboard",
    "/dashboard/",
    "/libro",
    "/libro/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User"],
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: ["ClaudeBot", "anthropic-ai"],
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: disallowedPaths,
      },
    ],
    sitemap: "https://www.ayudarte.app/sitemap.xml",
  };
}
