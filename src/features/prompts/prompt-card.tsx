"use client";

import Link from "next/link";
import { Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Prompt } from "@/types/prompt";

interface PromptCardProps {
  prompt: Prompt;
  onToggleFavorite: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
}

export function PromptCard({ prompt, onToggleFavorite, onDelete }: PromptCardProps) {
  return (
    <Card className="group transition-all duration-200 hover:border-border-hover hover:shadow-dropdown">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <Link href={`/prompts/${prompt.id}`}>
            <CardTitle className="text-[15px] hover:text-primary transition-colors duration-150">
              {prompt.title}
            </CardTitle>
          </Link>
          {prompt.description && (
            <p className="text-sm text-text-secondary line-clamp-2">{prompt.description}</p>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-[10px]"
            onClick={() => onToggleFavorite(prompt.id, prompt.is_favorite)}
            aria-label={prompt.is_favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-150 ${
                prompt.is_favorite ? "fill-danger text-danger" : "text-text-secondary"
              }`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4 text-text-secondary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href={`/prompts/${prompt.id}`} className="flex items-center gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(prompt.id)}
                className="text-danger"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {prompt.category && (
            <Badge variant="secondary" className="text-[11px]">
              {prompt.category}
            </Badge>
          )}
          <span className="text-xs text-muted">
            {new Date(prompt.updated_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
