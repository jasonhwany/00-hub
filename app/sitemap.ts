import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.moneystom7.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: "https://www.moneystom7.com/takdeukse",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.moneystom7.com/yangdo",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.moneystom7.com/daeul",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.moneystom7.com/jongbu",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.moneystom7.com/jeungyese",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: "https://www.moneystom7.com/jaesanse",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.moneystom7.com/jungae",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.moneystom7.com/pyeong",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.moneystom7.com/imdae",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.moneystom7.com/jeonwolse",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.moneystom7.com/yeonbong",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...[
      "about",
      "methodology",
      "editorial-policy",
      "privacy",
      "terms",
      "disclaimer",
      "contact",
      "advertise",
    ].map((path) => ({
      url: `https://www.moneystom7.com/${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "methodology" || path === "about" ? 0.7 : 0.5,
    })),
  ];
}
