"use client";

import Link from "next/link";
import { Folder, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Collection } from "@/types/prompt";

interface CollectionCardProps {
  collection: Collection;
  onDelete: (id: string) => void;
}

export function CollectionCard({ collection, onDelete }: CollectionCardProps) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="group transition-all duration-200 hover:border-border-hover hover:shadow-dropdown cursor-pointer">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[12px]"
              style={{ backgroundColor: collection.color ?? "var(--color-surface)" }}
            >
              <Folder className="h-5 w-5 text-text" />
            </div>
            <div>
              <CardTitle className="text-[15px]">{collection.name}</CardTitle>
              {collection.description && (
                <p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm("Delete this collection?")) onDelete(collection.id);
            }}
          >
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
        </CardHeader>
      </Card>
    </Link>
  );
}
