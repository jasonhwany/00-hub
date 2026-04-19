export const dynamic = "force-static"
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://moneystom7.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ]
}
