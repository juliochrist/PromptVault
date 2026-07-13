"use client";

import {
  Sparkles,
  Lightbulb,
  FileText,
  Languages,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIActionsProps {
  onAction: (action: string) => void;
  loading: boolean;
}

const actions = [
  { id: "improve", label: "Improve", icon: Sparkles },
  { id: "explain", label: "Explain", icon: Lightbulb },
  { id: "summarise", label: "Summarise", icon: FileText },
  { id: "translate", label: "Translate", icon: Languages },
  { id: "generateBetter", label: "Generate Better", icon: Wand2 },
];

export function AIActions({ onAction, loading }: AIActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            className="gap-1.5"
            disabled={loading}
            onClick={() => onAction(action.id)}
          >
            <Icon className="h-3.5 w-3.5" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
