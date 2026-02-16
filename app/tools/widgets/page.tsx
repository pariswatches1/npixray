import type { Metadata } from "next";
import { Code2, Calculator, Search, BarChart3 } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { CopyButton } from "./copy-button";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Embeddable Medicare Data Widgets | NPIxray",
  description:
    "Free embeddable Medicare data widgets for your website. Revenue calculator, NPI lookup, and practice benchmark widgets with copy-paste embed codes.",
  keywords: [
    "Medicare widget",
    "NPI lookup widget",
    "revenue calculator embed",
    "healthcare data widget",
    "medical practice benchmark widget",
  ],
  openGraph: {
    title: "Embeddable Medicare Data Widgets | NPIxray",
    description:
      "Free embeddable Medicare data widgets for your website. Copy-paste embed codes.",
  },
};

interface WidgetInfo {
  title: string;
  description: string;
  path: string;
  icon: typeof Calculator;
  color: string;
  bgColor: string;
}

const widgets: WidgetInfo[] = [
  {
    title: "Revenue Calculator Widget",
    description:
      "Let visitors calculate estimated missed revenue based on their specialty, patient count, and billing patterns. Perfect for healthcare blogs and consulting sites.",
    path: "/tools/revenue-calculator",
    icon: Calculator,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "NPI Lookup Widget",
    description:
      "Embed an NPI lookup tool on your site. Visitors can search by name or NPI number to find provider details, specialty, and location data.",
    path: "/tools/npi-lookup",
    icon: Search,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Practice Benchmark Widget",
    description:
      "Show specialty-level Medicare benchmarks including E&M coding distributions, CCM/RPM adoption rates, and average revenue per patient.",
    path: "/tools/practice-benchmark",
    icon: BarChart3,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
];

function getEmbedCode(path: string): string {
  return `<iframe src="https://npixray.com${path}?embed=true" width="100%" height="600" frameborder="0"></iframe>\n<p style="font-size:12px">Powered by <a href="https://npixray.com">NPIxray</a></p>`;
}

export default function WidgetsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Tools", href: "/tools/widgets" },
              { label: "Widgets" },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Code2 className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Embeddable Medicare Data{" "}
                <span className="text-gold">Widgets</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Free widgets for your website &mdash; just copy and paste
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Widget Cards */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {widgets.map((widget) => {
              const embedCode = getEmbedCode(widget.path);
              return (
                <div
                  key={widget.path}
                  className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 sm:p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${widget.bgColor}`}
                    >
                      <widget.icon className={`h-5 w-5 ${widget.color}`} />
                    </div>
                    <h2 className="text-xl font-bold">{widget.title}</h2>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl">
                    {widget.description}
                  </p>

                  {/* Preview */}
                  <div className="mb-6">
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                      Preview
                    </p>
                    <div className="rounded-lg border border-dark-50/50 bg-dark-300 p-4 min-h-[200px] flex items-center justify-center">
                      <div className="text-center">
                        <widget.icon className="h-8 w-8 text-[var(--text-secondary)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--text-secondary)]">
                          Widget preview loads at{" "}
                          <code className="text-gold text-xs">
                            npixray.com{widget.path}
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Embed Code */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
                        Embed Code
                      </p>
                      <CopyButton text={embedCode} />
                    </div>
                    <pre className="rounded-lg border border-dark-50/50 bg-[#0a0908] p-4 overflow-x-auto text-xs text-[var(--text-secondary)] font-mono leading-relaxed">
                      <code>{embedCode}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Usage Notes */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">
            Usage <span className="text-gold">Notes</span>
          </h2>
          <div className="space-y-4 max-w-2xl text-sm text-[var(--text-secondary)] leading-relaxed">
            <p>
              All widgets are free to embed on any website. The embed code uses
              an iframe that loads directly from npixray.com.
            </p>
            <p>
              You can customize the height by changing the{" "}
              <code className="text-gold">height</code> attribute in the iframe
              code. Width is set to 100% by default and will fill its container.
            </p>
            <p>
              Widgets include the{" "}
              <code className="text-gold">?embed=true</code> parameter which
              hides the site header and footer for a cleaner embedded
              experience.
            </p>
            <p>
              Data is sourced from CMS Medicare public data and updated
              periodically. Attribution is appreciated but not required beyond
              the included &quot;Powered by NPIxray&quot; link.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
