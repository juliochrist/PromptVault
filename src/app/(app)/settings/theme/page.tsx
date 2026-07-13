"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text">Theme</h1>
        <p className="text-sm text-muted">Customize your appearance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose between dark and light mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              className="gap-2"
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "light" ? "default" : "outline"}
              className="gap-2"
              onClick={() => setTheme("light")}
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
