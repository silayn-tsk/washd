"use client";

import { WashingMachine } from "lucide-react";
import { useAuth } from "./auth-provider";

export function MemberHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="member-header">
      <a className="brand" href="/" aria-label="Washd home">
        <span className="brand-mark"><WashingMachine size={22} strokeWidth={1.8} /></span>
        <span>Washd</span>
      </a>
      <nav aria-label="Member navigation">
        <a href="/">Home</a>
        <a href="/plans">Plans</a>
        {!loading && (
          <a className="member-pill" href={user ? "/account" : "/login"}>
            {user ? "My account" : "Log in"}
          </a>
        )}
      </nav>
    </header>
  );
}
