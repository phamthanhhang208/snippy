"use client";

import { CommandEmpty } from "@/components/ui/command";
import type React from "react";
import { useState } from "react";
import type { Snippet, Tag } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Save, Trash2, Heart, Globe, Lock } from "lucide-react";
import { CodeEditor } from "@/components/code-editor";
import { MarkdownEditor } from "@/components/markdown-editor";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandList,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { ChevronsUpDown } from "lucide-react";
import {
    useFavoriteSnippet,
    useUnfavoriteSnippet,
    useAddTagsToSnippet,
    useDeleteSnippet,
    useSetSnippetPublic,
    useRemoveTagFromSnippet,
} from "@/app/hooks/snippet/mutations";

interface SnippetViewProps {
    snippet: Snippet;
    tags: Tag[];
    onUpdateSnippet: (snippet: Snippet) => void;
    onDeleteSnippet: (id: string) => void;
}

export function SnippetView({
    snippet,
    tags,
    onUpdateSnippet,
    onDeleteSnippet,
}: SnippetViewProps) {
    const [editedSnippet, setEditedSnippet] = useState<Snippet>(snippet);
    const [activeTab, setActiveTab] = useState<string>("snippets");
    const [tagSelectorOpen, setTagSelectorOpen] = useState(false);

    // --- mutation ---
    const deleteSnippet = useDeleteSnippet();
    const favoriteSnippet = useFavoriteSnippet();
    const unFavoriteSnippet = useUnfavoriteSnippet();
    const addTagToSnippet = useAddTagsToSnippet();
    const removeTagFromSnippet = useRemoveTagFromSnippet();
    const updateSnippetVisibilty = useSetSnippetPublic();

    // Update local state when the selected snippet changes
    if (snippet.id !== editedSnippet.id) {
        setEditedSnippet(snippet);
    }

    const handleCodeChange = (code: string) => {
        setEditedSnippet({
            ...editedSnippet,
            code,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleReadmeChange = (readme: string) => {
        setEditedSnippet({
            ...editedSnippet,
            readme,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedSnippet({
            ...editedSnippet,
            title: e.target.value,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleDescriptionChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setEditedSnippet({
            ...editedSnippet,
            description: e.target.value,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditedSnippet({
            ...editedSnippet,
            notes: e.target.value,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleLanguageChange = (language: string) => {
        setEditedSnippet({
            ...editedSnippet,
            language,
            updatedAt: new Date().toISOString(),
        });
    };

    const handleFavoriteToggle = (checked: boolean) => {
        setEditedSnippet({
            ...editedSnippet,
            isFavorite: checked,
            updatedAt: new Date().toISOString(),
        });
        void (checked
            ? favoriteSnippet.mutate(editedSnippet.id)
            : unFavoriteSnippet.mutate(editedSnippet.id));
    };

    const handlePublicToggle = (checked: boolean) => {
        setEditedSnippet({
            ...editedSnippet,
            isPublic: checked,
            updatedAt: new Date().toISOString(),
        });
        updateSnippetVisibilty.mutate({
            snippetId: editedSnippet.id,
            isPublic: checked,
        });
    };

    const handleSave = () => {
        onUpdateSnippet(editedSnippet);
    };

    const handleDelete = () => {
        onDeleteSnippet(snippet.id);
        deleteSnippet.mutate(snippet.id);
    };

    const handleTagToggle = (tagId: string, checked: boolean) => {
        const newTags = checked
            ? [...editedSnippet.tags, tagId]
            : editedSnippet.tags.filter((id) => id !== tagId);

        setEditedSnippet({
            ...editedSnippet,
            tags: newTags,
            updatedAt: new Date().toISOString(),
        });

        if (checked) {
            addTagToSnippet.mutate({
                snippetId: editedSnippet.id,
                tagIds: [tagId],
            });
        } else {
            removeTagFromSnippet.mutate({
                snippetId: editedSnippet.id,
                tagId: tagId,
            });
        }
    };

    const handleRemoveTag = (tagId: string) => {
        setEditedSnippet({
            ...editedSnippet,
            tags: editedSnippet.tags.filter((id) => id !== tagId),
            updatedAt: new Date().toISOString(),
        });

        removeTagFromSnippet.mutate({
            snippetId: editedSnippet.id,
            tagId: tagId,
        });
    };

    // Get tag objects from tag IDs
    const snippetTags = tags.filter((tag) =>
        editedSnippet.tags.includes(tag.id)
    );

    // Get tag color class
    const getTagColorClass = (color: string) => {
        return `tag-${color}`;
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
            <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex-1">
                    <Input
                        value={editedSnippet.title}
                        onChange={handleTitleChange}
                        className="border-none text-lg font-medium bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                        placeholder="Snippet Title"
                    />
                    <Input
                        value={editedSnippet.description || ""}
                        onChange={handleDescriptionChange}
                        className="border-none text-sm text-muted-foreground bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 mt-1"
                        placeholder="Add a description..."
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                    >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4 p-3 border-b border-border">
                <div className="flex flex-wrap gap-1 flex-1">
                    {snippetTags.map((tag) => (
                        <Badge
                            key={tag.id}
                            className={cn(
                                "text-xs border-0",
                                getTagColorClass(tag.color)
                            )}
                        >
                            {tag.name}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 ml-1 p-0"
                                onClick={() => handleRemoveTag(tag.id)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}

                    <Popover
                        open={tagSelectorOpen}
                        onOpenChange={setTagSelectorOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={tagSelectorOpen}
                                className="h-6 text-xs"
                            >
                                Add Tags
                                <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Search tags..." />
                                <CommandList>
                                    <CommandEmpty>No tags found.</CommandEmpty>
                                    <CommandGroup className="max-h-[200px] overflow-auto">
                                        {tags.map((tag) => (
                                            <CommandItem
                                                key={tag.id}
                                                onSelect={() => {
                                                    const isSelected =
                                                        editedSnippet.tags.includes(
                                                            tag.id
                                                        );
                                                    handleTagToggle(
                                                        tag.id,
                                                        !isSelected
                                                    );
                                                }}
                                            >
                                                <div className="flex items-center space-x-2 w-full">
                                                    <Checkbox
                                                        checked={editedSnippet.tags.includes(
                                                            tag.id
                                                        )}
                                                        onChange={() => {}}
                                                    />
                                                    <span
                                                        className={cn(
                                                            "px-2 py-1 rounded text-xs flex-1",
                                                            getTagColorClass(
                                                                tag.color
                                                            )
                                                        )}
                                                    >
                                                        {tag.name}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex items-center gap-4">
                    {/* Favorite Toggle */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="favorite"
                            checked={editedSnippet.isFavorite}
                            onCheckedChange={handleFavoriteToggle}
                        />
                        <Label
                            htmlFor="favorite"
                            className="flex items-center gap-1 text-sm"
                        >
                            <Heart
                                className={cn(
                                    "h-4 w-4",
                                    editedSnippet.isFavorite &&
                                        "fill-red-500 text-red-500"
                                )}
                            />
                            Favorite
                        </Label>
                    </div>

                    {/* Public Toggle */}
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="public"
                            checked={editedSnippet.isPublic}
                            onCheckedChange={handlePublicToggle}
                        />
                        <Label
                            htmlFor="public"
                            className="flex items-center gap-1 text-sm"
                        >
                            {editedSnippet.isPublic ? (
                                <Globe className="h-4 w-4 text-green-500" />
                            ) : (
                                <Lock className="h-4 w-4 text-gray-500" />
                            )}
                            {editedSnippet.isPublic ? "Public" : "Private"}
                        </Label>
                    </div>

                    <Select
                        value={editedSnippet.language}
                        onValueChange={handleLanguageChange}
                    >
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="javascript">
                                JavaScript
                            </SelectItem>
                            <SelectItem value="typescript">
                                TypeScript
                            </SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="csharp">C#</SelectItem>
                            <SelectItem value="php">PHP</SelectItem>
                            <SelectItem value="ruby">Ruby</SelectItem>
                            <SelectItem value="go">Go</SelectItem>
                            <SelectItem value="rust">Rust</SelectItem>
                            <SelectItem value="swift">Swift</SelectItem>
                            <SelectItem value="kotlin">Kotlin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
            >
                <TabsList className="px-3 pt-2 bg-transparent justify-start border-b border-border rounded-none">
                    <TabsTrigger value="snippets">Snippets</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    {/* <TabsTrigger value="readme">README</TabsTrigger> */}
                </TabsList>
                <TabsContent
                    value="snippets"
                    className="flex-1 p-0 m-0 overflow-hidden"
                >
                    <CodeEditor
                        code={editedSnippet.code}
                        language={editedSnippet.language}
                        onChange={handleCodeChange}
                    />
                </TabsContent>
                <TabsContent
                    value="notes"
                    className="flex-1 p-0 m-0 overflow-hidden"
                >
                    <Textarea
                        value={editedSnippet.notes}
                        onChange={handleNotesChange}
                        placeholder="Add notes about this snippet..."
                        className="h-full resize-none border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </TabsContent>
                <TabsContent
                    value="readme"
                    className="flex-1 p-0 m-0 overflow-hidden"
                >
                    <MarkdownEditor
                        value={editedSnippet.readme || ""}
                        onChange={handleReadmeChange}
                        placeholder="Write your README in Markdown..."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
