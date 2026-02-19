import Link from "next/link";
import {
  MapPin,
  Stethoscope,
  BookOpen,
  Wrench,
  BarChart3,
  ArrowLeftRight,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { getRelatedLinks, type PageType } from "@/lib/internal-links";

// ── Icon resolver ────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  MapPin,
  Stethoscope,
  BookOpen,
  Wrench,
  BarChart3,
  ArrowLeftRight,
  Layers,
};

function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? BarChart3;
}

// ── Props ────────────────────────────────────────────────────

interface RelatedLinksProps {
  pageType: PageType;
  currentSlug?: string;
  context?: {
    state?: string;
    specialty?: string;
  };
}

// ── Component ────────────────────────────────────────────────

export function RelatedLinks({ pageType, currentSlug, context }: RelatedLinksProps) {
  const groups = getRelatedLinks(pageType, {
    state: context?.state,
    specialty: context?.specialty,
    slug: currentSlug,
  });

  if (groups.length === 0) return null;

  return (
    <section className="border-t border-dark-50/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold tracking-tight mb-6">
          Explore <span className="text-gold">More</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const Icon = resolveIcon(group.icon);
            return (
              <div
                key={group.category}
                className="rounded-xl border border-dark-50/50 bg-dark-400/30 p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="h-4 w-4 text-gold" />
                  <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                    {group.category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/80 hover:text-gold transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
