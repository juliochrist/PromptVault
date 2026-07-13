import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Heart,
  FolderOpen,
  Clock,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Prompts",
    value: "12",
    icon: FileText,
    change: "+3 this week",
  },
  {
    title: "Favorites",
    value: "4",
    icon: Heart,
    change: "2 updated recently",
  },
  {
    title: "Collections",
    value: "6",
    icon: FolderOpen,
    change: "1 new collection",
  },
  {
    title: "Recently Edited",
    value: "5",
    icon: Clock,
    change: "in the last 7 days",
  },
];

const recentPrompts = [
  { title: "React Component Generator", category: "Frontend", updated: "2h ago" },
  { title: "SQL Query Optimizer", category: "Backend", updated: "5h ago" },
  { title: "Email Copy Writer", category: "Marketing", updated: "1d ago" },
  { title: "Trading Strategy Analyzer", category: "Trading", updated: "2d ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-sm text-muted">
          Overview of your prompt library
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-text">{stat.value}</div>
                <p className="text-xs text-muted">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Prompts</CardTitle>
            <CardDescription>Your most recently updated prompts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPrompts.map((prompt) => (
                <div
                  key={prompt.title}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-text">
                      {prompt.title}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {prompt.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted">{prompt.updated}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt Usage</CardTitle>
            <CardDescription>Your activity over the past weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
              <div className="flex flex-col items-center gap-2 text-center">
                <TrendingUp className="h-8 w-8 text-muted" />
                <p className="text-sm text-muted">Usage chart coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
