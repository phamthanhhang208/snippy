"use client";
import type { Snippet, Tag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText } from "lucide-react";

interface SnippetsListProps {
    snippets: Snippet[];
    tags: Tag[];
    selectedSnippet: Snippet | null;
    onSelectSnippet: (snippet: Snippet) => void;
    onCreateSnippet: () => void;
}

export function SnippetsList({
    snippets,
    tags,
    selectedSnippet,
    onSelectSnippet,
    onCreateSnippet,
}: SnippetsListProps) {
    return (
        <div className="w-72 border-r border-border flex flex-col bg-card/50">
            <div className="p-3 border-b border-border flex justify-between items-center">
                <h2 className="font-medium">Snippets</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onCreateSnippet}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 overflow-auto">
                {snippets.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No snippets found
                    </div>
                ) : (
                    <div>
                        {snippets.map((snippet) => (
                            <SnippetItem
                                key={snippet.id}
                                snippet={snippet}
                                tags={tags}
                                isSelected={selectedSnippet?.id === snippet.id}
                                onSelect={() => onSelectSnippet(snippet)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface SnippetItemProps {
    snippet: Snippet;
    tags: Tag[];
    isSelected: boolean;
    onSelect: () => void;
}

function SnippetItem({
    snippet,
    tags,
    isSelected,
    onSelect,
}: SnippetItemProps) {
    // Get tag objects from tag IDs
    const snippetTags = snippet.tags
        ? tags.filter((tag) => snippet.tags.includes(tag.id))
        : [];

    // Get tag color class
    const getTagColorClass = (color: string) => {
        return `tag-${color}`;
    };

    return (
        <div
            className={cn("snippet-item", isSelected && "selected")}
            onClick={onSelect}
        >
            <div className="flex items-start">
                <FileText className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                <div className="flex-1">
                    <h3 className="snippet-title">{snippet.title}</h3>
                    {snippet.description && (
                        <p className="snippet-description">
                            {snippet.description}
                        </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {snippetTags.map((tag) => (
                            <Badge
                                key={tag.id}
                                className={cn(
                                    "text-xs border-0",
                                    getTagColorClass(tag.color)
                                )}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
