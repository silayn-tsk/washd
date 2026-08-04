import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-04T00:00:00+08:00");
  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/plans`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/signup`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy/bm`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy/zh`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy/ko`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms/bm`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms/zh`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms/ko`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/service-information`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/service-information/bm`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/service-information/zh`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/service-information/ko`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/care-guarantee`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/care-guarantee/bm`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/care-guarantee/zh`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/care-guarantee/ko`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
