"use client";

import { WashingMachine } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./auth-provider";

export function MemberHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="member-header">
      <Link className="brand" href="/" aria-label="Washd home">
        <span className="brand-mark"><WashingMachine size={22} strokeWidth={1.8} /></span>
        <span>washd<span className="brand-dot">.</span></span>
      </Link>
      <nav aria-label="Member navigation">
        <Link className="member-home-link" href="/">Home</Link>
        {user && <Link className="member-dashboard-link" href="/account">Dashboard</Link>}
        <Link href="/plans">Plans</Link>
        {!loading && (
          <Link className="member-pill" href={user ? "/account" : "/login"}>
            {user ? "My profile" : "Log in"}
          </Link>
        )}
      </nav>
    </header>
  );
}
