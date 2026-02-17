import { getScoreTier } from "@/lib/revenue-score";

interface LeaderboardEntry {
  npi: string;
  specialty: string;
  state: string;
  city: string;
  revenue_score: number;
}

interface ScoreLeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
}

export function ScoreLeaderboard({ entries, title = "Top Scoring Providers" }: ScoreLeaderboardProps) {
  if (!entries.length) {
    return (
      <p className="text-sm text-[var(--text-secondary)]">
        No scored providers available yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      {title && (
        <h3 className="text-lg font-bold mb-3">{title}</h3>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[var(--text-secondary)] text-xs uppercase tracking-wider">
            <th className="text-left p-2">#</th>
            <th className="text-left p-2">NPI</th>
            <th className="text-left p-2">Specialty</th>
            <th className="text-left p-2 hidden sm:table-cell">Location</th>
            <th className="text-right p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const tier = getScoreTier(entry.revenue_score);
            return (
              <tr
                key={entry.npi}
                className="border-t border-dark-50/30 hover:bg-dark-400/20"
              >
                <td className="p-2 text-[var(--text-secondary)]">{i + 1}</td>
                <td className="p-2 font-mono text-xs">{entry.npi}</td>
                <td className="p-2">{entry.specialty}</td>
                <td className="p-2 text-[var(--text-secondary)] hidden sm:table-cell">
                  {entry.city}, {entry.state}
                </td>
                <td className="p-2 text-right">
                  <span
                    className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold ${tier.bgColor} ${tier.color} ${tier.borderColor} border`}
                  >
                    {entry.revenue_score}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
