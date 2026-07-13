import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function PlaygroundPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Playground</h1>
        <p className="text-sm text-muted">Test and experiment with prompts</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Play className="mb-4 h-12 w-12 text-muted" />
          <CardTitle className="mb-2">Playground coming soon</CardTitle>
          <CardDescription>A split editor and preview area for prompt testing</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
