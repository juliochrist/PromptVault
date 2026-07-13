import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AIScoreCardProps {
  score: {
    clarity: number;
    context: number;
    specificity: number;
    consistency: number;
    suggestions: string[];
  };
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const percentage = Math.round((value / 10) * 100);
  const color =
    value >= 8 ? "bg-success" : value >= 5 ? "bg-warning" : "bg-danger";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-text">{value}/10</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-card">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function AIScoreCard({ score }: AIScoreCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Prompt Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <ScoreBar label="Clarity" value={score.clarity} />
          <ScoreBar label="Context" value={score.context} />
          <ScoreBar label="Specificity" value={score.specificity} />
          <ScoreBar label="Consistency" value={score.consistency} />
        </div>

        {score.suggestions.length > 0 && (
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-text">Suggestions</p>
            <ul className="space-y-1">
              {score.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <Badge variant="warning" className="mt-0.5 shrink-0">
                    {i + 1}
                  </Badge>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
