import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://moneystom7.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: "https://calc.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://unit.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://qr.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://pass.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://pdf.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://time.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://bmi.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://invoice.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://json.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: "https://lotto.moneystom7.com", lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ]
}
