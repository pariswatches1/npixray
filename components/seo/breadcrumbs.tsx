import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://npixray.com" },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        ...(item.href ? { item: `https://npixray.com${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-[#2F5EA8] transition-colors flex items-center gap-1">
          <Home className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only">Home</span>
        </Link>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="hover:text-[#2F5EA8] transition-colors">{item.label}</Link>
            ) : (
              <span className="text-[var(--text-primary)]">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
