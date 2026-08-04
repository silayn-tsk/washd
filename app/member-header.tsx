"use client";

import Link from "next/link";
import { useAuth } from "./auth-provider";

export function MemberHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="member-header">
      <Link className="brand" href="/" aria-label="Washd home">
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
