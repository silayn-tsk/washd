const fallbackSiteUrl = "https://washd-my-86c6d.web.app";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
