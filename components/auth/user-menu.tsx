"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LayoutDashboard, CreditCard, LogOut } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const user = session.user;
  const plan = (user as any).plan || "free";
  const planLabel =
    plan === "intelligence" ? "Intelligence" : plan === "care" ? "Care Management" : "Free";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-dark-50/80 px-3 py-1.5 transition-all hover:border-gold/30"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {user.image ? (
          <img
            src={user.image}
            alt=""
            className="h-6 w-6 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <User className="h-4 w-4 text-[var(--text-secondary)]" />
        )}
        <span className="text-sm font-medium hidden sm:inline max-w-[120px] truncate">
          {user.name?.split(" ")[0] || "Account"}
        </span>
        {plan !== "free" && (
          <span className="hidden sm:inline text-[10px] font-semibold bg-gold/15 text-gold px-1.5 py-0.5 rounded">
            PRO
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-dark-50/80 bg-dark-300 shadow-xl shadow-black/20 py-1 z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-dark-50/50">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-[var(--text-secondary)] truncate">
              {user.email}
            </p>
            <p className="text-xs text-gold mt-1">{planLabel} Plan</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-gold hover:bg-gold/5 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/billing"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-gold hover:bg-gold/5 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Billing
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-dark-50/50 py-1">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-400/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
