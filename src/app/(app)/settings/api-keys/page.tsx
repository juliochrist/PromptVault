"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">API Keys</h1>
        <p className="text-sm text-muted">Manage integration keys</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <KeyRound className="mb-4 h-12 w-12 text-muted" />
          <CardTitle className="mb-2">Coming Soon</CardTitle>
          <CardDescription>
            API key management will be available in a future update
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
