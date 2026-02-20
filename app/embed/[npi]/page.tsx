import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ npi: string }> }): Promise<Metadata> {
  const { npi } = await params;
  return {
    title: `NPIxray Revenue Score — ${npi}`,
    robots: "noindex, nofollow",
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ npi: string }> }) {
  const { npi } = await params;

  if (!/^\d{10}$/.test(npi)) {
    notFound();
  }

  return <EmbedWidget npi={npi} />;
}

function EmbedWidget({ npi }: { npi: string }) {
  // This is a server component that renders the initial shell.
  // The client-side script below fetches data and hydrates.
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: embedStyles }} />
      </head>
      <body>
        <div id="npixray-widget" data-npi={npi}>
          <div className="npx-loading">
            <div className="npx-spinner" />
            <span>Loading Revenue Score...</span>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: embedScript(npi) }} />
      </body>
    </html>
  );
}

const embedStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0c0a09;
    color: #fafaf9;
    padding: 16px;
    min-height: 100vh;
  }
  .npx-loading {
    display: flex; align-items: center; gap: 8px;
    justify-content: center; padding: 40px; color: #a8a29e;
    font-size: 13px;
  }
  .npx-spinner {
    width: 16px; height: 16px; border: 2px solid #292524;
    border-top-color: #2F5EA8; border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .npx-card {
    background: #1c1917; border: 1px solid #292524;
    border-radius: 12px; padding: 20px; max-width: 320px;
  }
  .npx-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
  }
  .npx-logo {
    font-size: 11px; font-weight: 700; color: #2F5EA8;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .npx-name { font-size: 15px; font-weight: 600; color: #fafaf9; }
  .npx-specialty { font-size: 12px; color: #a8a29e; margin-top: 2px; }

  .npx-score-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .npx-score-label { font-size: 11px; color: #a8a29e; text-transform: uppercase; letter-spacing: 0.5px; }
  .npx-score {
    font-size: 32px; font-weight: 700; font-family: 'SF Mono', 'Fira Code', monospace;
  }
  .npx-score-max { font-size: 14px; color: #57534e; font-weight: 400; }
  .npx-tier {
    display: inline-block; padding: 2px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }

  .npx-bar { height: 6px; background: #292524; border-radius: 3px; overflow: hidden; margin-bottom: 12px; }
  .npx-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s; }

  .npx-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
  .npx-stat {
    background: #0c0a09; border-radius: 8px; padding: 10px;
  }
  .npx-stat-label { font-size: 10px; color: #78716c; text-transform: uppercase; letter-spacing: 0.5px; }
  .npx-stat-value { font-size: 16px; font-weight: 600; font-family: 'SF Mono', monospace; margin-top: 2px; }

  .npx-link {
    display: block; text-align: center; padding: 8px;
    color: #2F5EA8; font-size: 12px; text-decoration: none;
    border-top: 1px solid #292524; margin-top: 4px; padding-top: 12px;
  }
  .npx-link:hover { text-decoration: underline; }

  .npx-programs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .npx-badge {
    padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;
  }
  .npx-badge-yes { background: #064e3b; color: #34d399; }
  .npx-badge-no { background: #1c1917; color: #57534e; border: 1px solid #292524; }

  .npx-error { text-align: center; padding: 40px; color: #a8a29e; font-size: 13px; }
`;

function embedScript(npi: string): string {
  return `
(async function() {
  const widget = document.getElementById('npixray-widget');
  try {
    const res = await fetch('/api/v1/provider/${npi}');
    if (!res.ok) throw new Error('Not found');
    const json = await res.json();
    const p = json.data;

    // Determine tier styling
    const score = p.revenue_score || 0;
    let tier, color;
    if (score >= 90) { tier = 'Elite'; color = '#2F5EA8'; }
    else if (score >= 75) { tier = 'Strong'; color = '#34d399'; }
    else if (score >= 60) { tier = 'Average'; color = '#facc15'; }
    else if (score >= 40) { tier = 'Below Avg'; color = '#fb923c'; }
    else { tier = 'Critical'; color = '#f87171'; }

    function fmt(n) {
      if (n >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
      if (n >= 1e3) return '$' + Math.round(n/1e3) + 'K';
      return '$' + n.toLocaleString();
    }

    widget.innerHTML = '<div class="npx-card">' +
      '<div class="npx-header"><div><div class="npx-logo">NPIxray</div>' +
      '<div class="npx-name">' + p.name + '</div>' +
      '<div class="npx-specialty">' + p.specialty + ' &bull; ' + p.city + ', ' + p.state + '</div>' +
      '</div></div>' +
      '<div class="npx-score-row"><div><div class="npx-score-label">Revenue Score</div>' +
      '<div class="npx-score" style="color:' + color + '">' + score + '<span class="npx-score-max">/100</span></div></div>' +
      '<span class="npx-tier" style="background:' + color + '20;color:' + color + ';border:1px solid ' + color + '40">' + tier + '</span></div>' +
      '<div class="npx-bar"><div class="npx-bar-fill" style="width:' + score + '%;background:' + color + '"></div></div>' +
      '<div class="npx-stats">' +
      '<div class="npx-stat"><div class="npx-stat-label">Medicare Revenue</div><div class="npx-stat-value" style="color:#fafaf9">' + fmt(p.total_medicare_payment) + '</div></div>' +
      '<div class="npx-stat"><div class="npx-stat-label">Patients</div><div class="npx-stat-value" style="color:#fafaf9">' + (p.total_beneficiaries || 0).toLocaleString() + '</div></div>' +
      '</div>' +
      '<a class="npx-link" href="https://npixray.com/scan/' + p.npi + '" target="_blank" rel="noopener">View Full Report on NPIxray &rarr;</a>' +
      '</div>';
  } catch(e) {
    widget.innerHTML = '<div class="npx-error">Provider not found. <a href="https://npixray.com" target="_blank" style="color:#2F5EA8">Visit NPIxray</a></div>';
  }
})();
`;
}
