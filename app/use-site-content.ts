"use client";

import { useEffect, useState } from "react";
import { defaultAddons, defaultPlans, defaultSiteContent, mergeSiteContent, type Plan, type PlanAddon, type SiteContent } from "@/lib/site-content";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [addons, setAddons] = useState<PlanAddon[]>(defaultAddons);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    void Promise.all([
      supabase.from("site_content").select("content").eq("key", "main").maybeSingle(),
      supabase.from("plans").select("id, name, description, price_rm, popular, features, sort_order, stripe_price_id").eq("active", true).order("sort_order"),
      supabase.from("plan_addons").select("id, name, description, price_rm, active, sort_order, stripe_price_id").eq("active", true).order("sort_order"),
    ]).then(([contentResult, plansResult, addonsResult]) => {
      if (contentResult.data?.content) setContent(mergeSiteContent(contentResult.data.content));
      if (plansResult.data?.length) setPlans(plansResult.data as Plan[]);
      if (addonsResult.data?.length) setAddons(addonsResult.data as PlanAddon[]);
      setLoading(false);
    });
  }, []);

  return { content, plans, addons, loading };
}
