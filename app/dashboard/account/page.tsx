"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Shield } from "lucide-react";

export default function AccountPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const plan = (user as any)?.plan || "free";

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Account</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your account details
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-5 w-5 text-[#2F5EA8]" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          {user?.image ? (
            <img
              src={user.image}
              alt=""
              className="h-14 w-14 rounded-full border-2 border-[#2F5EA8]/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-[#2F5EA8]/[0.06] flex items-center justify-center border-2 border-[#2F5EA8]/10">
              <User className="h-6 w-6 text-[#2F5EA8]" />
            </div>
          )}
          <div>
            <p className="font-semibold">{user?.name || "User"}</p>
            <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[var(--text-secondary)]" />
              <span className="text-sm">Email</span>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">
              {user?.email}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--text-secondary)]" />
              <span className="text-sm">Plan</span>
            </div>
            <span className="text-sm font-medium text-[#2F5EA8]">
              {plan === "intelligence"
                ? "Intelligence"
                : plan === "care"
                  ? "Care Management"
                  : "Free"}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-[var(--border-light)]">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-[var(--text-secondary)]" />
              <span className="text-sm">Auth Provider</span>
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Google</span>
          </div>
        </div>
      </div>

      {/* Data usage */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Your data is safe</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              NPIxray only uses public CMS Medicare data. We never access
              patient records or protected health information (PHI). Your
              account data is encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
