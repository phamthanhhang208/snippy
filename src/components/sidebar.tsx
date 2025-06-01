"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    FileCode,
    Star,
    Search,
    Globe,
    Tag,
    LogOut,
    // Settings,
    Edit,
    Trash2,
    FolderPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Folder, User, Tag as TagType } from "@/lib/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
    folders: Folder[];
    tags: TagType[];
    selectedFolder: string | null;
    selectedView: "all" | "favorites" | "public";
    selectedTags: string[];
    onSelectFolder: (folderId: string | null) => void;
    onSelectView: (view: "all" | "favorites" | "public") => void;
    onSelectTags: (tagIds: string[]) => void;
    onCreateFolder: (
        name: string,
        parentId: string | null,
        color: string
    ) => void;
    onUpdateFolder: (
        id: string,
        name: string,
        color: string,
        parentId: string | null
    ) => void;
    onDeleteFolder: (id: string) => void;
    onCreateTag: (name: string, color: string) => void;
    onUpdateTag: (id: string, name: string, color: string) => void;
    onDeleteTag: (id: string) => void;
    user: User;
    onLogout: () => void;
}

export function Sidebar({
    folders,
    tags,
    selectedFolder,
    selectedView,
    selectedTags,
    onSelectFolder,
    onSelectView,
    onSelectTags,
    onCreateFolder,
    onUpdateFolder,
    onDeleteFolder,
    onCreateTag,
    onUpdateTag,
    onDeleteTag,
    user,
    onLogout,
}: SidebarProps) {
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderColor, setNewFolderColor] = useState("blue");
    const [newFolderParentId, setNewFolderParentId] = useState<string | null>(
        null
    );
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
    const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null);

    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("blue");
    const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);
    const [deletingTag, setDeletingTag] = useState<TagType | null>(null);

    const [foldersExpanded, setFoldersExpanded] = useState(true);
    const [tagsExpanded, setTagsExpanded] = useState(true);
    const [tagSearchQuery, setTagSearchQuery] = useState("");

    const rootFolders = folders.filter((folder) => !folder.parentId);

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName, newFolderParentId, newFolderColor);
            setNewFolderName("");
            setNewFolderColor("blue");
            setIsFolderDialogOpen(false);
        }
    };

    const handleUpdateFolder = () => {
        if (editingFolder && newFolderName.trim()) {
            onUpdateFolder(
                editingFolder.id,
                newFolderName,
                newFolderColor,
                editingFolder.parentId
            );
            setEditingFolder(null);
            setNewFolderName("");
            setNewFolderColor("blue");
            setIsFolderDialogOpen(false);
        }
    };

    const handleDeleteFolder = () => {
        if (deletingFolder) {
            onDeleteFolder(deletingFolder.id);
            setDeletingFolder(null);
        }
    };

    const handleCreateTag = () => {
        if (newTagName.trim()) {
            onCreateTag(newTagName, newTagColor);
            setNewTagName("");
            setNewTagColor("blue");
            setIsTagDialogOpen(false);
        }
    };

    const handleUpdateTag = () => {
        if (editingTag && newTagName.trim()) {
            onUpdateTag(editingTag.id, newTagName, newTagColor);
            setEditingTag(null);
            setNewTagName("");
            setNewTagColor("blue");
            setIsTagDialogOpen(false);
        }
    };

    const handleDeleteTag = () => {
        if (deletingTag) {
            onDeleteTag(deletingTag.id);
            setDeletingTag(null);
        }
    };

    const openNewFolderDialog = (parentId: string | null = null) => {
        setNewFolderParentId(parentId);
        setEditingFolder(null);
        setNewFolderName("");
        setNewFolderColor("blue");
        setIsFolderDialogOpen(true);
    };

    const openEditFolderDialog = (folder: Folder) => {
        setEditingFolder(folder);
        setNewFolderName(folder.name);
        setNewFolderColor(folder.color || "blue");
        setNewFolderParentId(folder.parentId);
        setIsFolderDialogOpen(true);
    };

    const openNewTagDialog = () => {
        setEditingTag(null);
        setNewTagName("");
        setNewTagColor("blue");
        setIsTagDialogOpen(true);
    };

    const openEditTagDialog = (tag: TagType) => {
        setEditingTag(tag);
        setNewTagName(tag.name);
        setNewTagColor(tag.color);
        setIsTagDialogOpen(true);
    };

    const getChildFolders = (parentId: string) => {
        return folders.filter((folder) => folder.parentId === parentId);
    };

    const getFolderIconClass = (color?: string) => {
        if (!color) return "";
        return `folder-icon-${color}`;
    };

    const getTagColorClass = (color: string) => {
        return `tag-${color}`;
    };

    const getUserInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const filteredTags = tags.filter((tag) =>
        tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );

    const handleTagToggle = (tagId: string) => {
        const newSelectedTags = selectedTags.includes(tagId)
            ? selectedTags.filter((id) => id !== tagId)
            : [...selectedTags, tagId];
        onSelectTags(newSelectedTags);
    };

    const renderFolder = (folder: Folder, level = 0) => {
        const childFolders = getChildFolders(folder.id);
        const hasChildren = childFolders.length > 0;

        return (
            <div key={folder.id}>
                <div className="flex items-center group">
                    <Button
                        variant="ghost"
                        className={cn(
                            "flex-1 justify-start text-sm h-8 px-2 rounded-md",
                            selectedFolder === folder.id && "bg-[#1e2330]"
                        )}
                        style={{ paddingLeft: `${8 + level * 16}px` }}
                        onClick={() => onSelectFolder(folder.id)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={cn(
                                "mr-2",
                                getFolderIconClass(folder.color)
                            )}
                        >
                            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                        </svg>
                        {folder.name}
                    </Button>
                    <div className="opacity-0 group-hover:opacity-100 flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                >
                                    <Edit className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => openEditFolderDialog(folder)}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Folder
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        openNewFolderDialog(folder.id)
                                    }
                                >
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    Add Subfolder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => setDeletingFolder(folder)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Folder
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                {hasChildren && (
                    <div className="ml-4">
                        {childFolders.map((childFolder) =>
                            renderFolder(childFolder, level + 1)
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-64 h-full flex flex-col bg-[#0a0d12] text-[#e4e7eb]">
            <div className="flex items-center p-4 border-b border-[#1e2330]">
                <div className="flex items-center w-full">
                    <span className="text-xl font-bold">
                        <span className="text-[#3b82f6]">S</span>nip
                        <span className="text-[#3b82f6]">y</span>
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
                <div className="space-y-6">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-sm h-8 px-2 rounded-md",
                                selectedView === "all" &&
                                    selectedTags.length === 0 &&
                                    !selectedFolder &&
                                    "bg-[#1e2330]"
                            )}
                            onClick={() => {
                                onSelectView("all");
                                onSelectTags([]);
                                onSelectFolder(null);
                            }}
                        >
                            <FileCode className="h-4 w-4 mr-2" />
                            All Snippets
                        </Button>

                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-sm h-8 px-2 rounded-md",
                                selectedView === "favorites" && "bg-[#1e2330]"
                            )}
                            onClick={() => onSelectView("favorites")}
                        >
                            <Star className="h-4 w-4 mr-2" />
                            Favorites
                        </Button>

                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start text-sm h-8 px-2 rounded-md",
                                selectedView === "public" && "bg-[#1e2330]"
                            )}
                            onClick={() => onSelectView("public")}
                        >
                            <Globe className="h-4 w-4 mr-2" />
                            Public Snippets
                        </Button>
                    </div>

                    {/* Folders Section */}
                    <div className="mb-2">
                        <div
                            className="flex items-center justify-between py-2 px-2 text-sm font-medium cursor-pointer"
                            onClick={() => setFoldersExpanded(!foldersExpanded)}
                        >
                            {foldersExpanded ? (
                                <ChevronDown className="h-4 w-4 mr-1" />
                            ) : (
                                <ChevronRight className="h-4 w-4 mr-1" />
                            )}
                            <span>Folders</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openNewFolderDialog(null);
                                }}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {foldersExpanded && (
                            <div className="space-y-1 mt-1">
                                {rootFolders.map((folder) =>
                                    renderFolder(folder)
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags Section */}
                    <div className="mb-2">
                        <div
                            className="flex items-center justify-between py-2 px-2 text-sm font-medium cursor-pointer"
                            onClick={() => setTagsExpanded(!tagsExpanded)}
                        >
                            {tagsExpanded ? (
                                <ChevronDown className="h-4 w-4 mr-1" />
                            ) : (
                                <ChevronRight className="h-4 w-4 mr-1" />
                            )}
                            <span>Tags</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 ml-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openNewTagDialog();
                                }}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>

                        {tagsExpanded && (
                            <div className="space-y-1 mt-1">
                                <div className="px-2 mb-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                                        <Input
                                            placeholder="Search tags"
                                            className="pl-7 h-8 text-xs bg-[#1e2330] border-none"
                                            value={tagSearchQuery}
                                            onChange={(e) =>
                                                setTagSearchQuery(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {filteredTags.map((tag) => (
                                    <div
                                        key={tag.id}
                                        className="flex items-center group"
                                    >
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "flex-1 justify-start text-sm h-8 px-2 rounded-md",
                                                selectedTags.includes(tag.id) &&
                                                    "bg-[#1e2330]"
                                            )}
                                            onClick={() =>
                                                handleTagToggle(tag.id)
                                            }
                                        >
                                            <Tag className="h-4 w-4 mr-2" />
                                            <span
                                                className={cn(
                                                    "px-2 py-1 rounded text-xs",
                                                    getTagColorClass(tag.color)
                                                )}
                                            >
                                                {tag.name}
                                            </span>
                                        </Button>
                                        <div className="opacity-0 group-hover:opacity-100 flex">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            openEditTagDialog(
                                                                tag
                                                            )
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Tag
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            setDeletingTag(tag)
                                                        }
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Tag
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-3 border-t border-[#1e2330] bg-[#0f1319]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="w-full justify-start p-0 h-auto"
                        >
                            <div className="flex items-center w-full">
                                <div className="h-8 w-8 rounded-full bg-[#3b82f620] flex items-center justify-center text-[#3b82f6] font-medium mr-2">
                                    {getUserInitials(user.name)}
                                </div>
                                <div className="text-xs text-left flex-1">
                                    <div className="font-medium">
                                        {user.name}
                                    </div>
                                    <div className="text-[#9ca3af] text-xs truncate">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56"
                    >
                        {/* <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuItem onClick={onLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Folder Dialog */}
            <Dialog
                open={isFolderDialogOpen}
                onOpenChange={setIsFolderDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingFolder
                                ? "Edit Folder"
                                : "Create New Folder"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="folderName">Folder Name</Label>
                            <Input
                                id="folderName"
                                placeholder="Enter folder name"
                                value={newFolderName}
                                onChange={(e) =>
                                    setNewFolderName(e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="folderColor">Folder Color</Label>
                            <Select
                                value={newFolderColor}
                                onValueChange={setNewFolderColor}
                            >
                                <SelectTrigger id="folderColor">
                                    <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="yellow">
                                        Yellow
                                    </SelectItem>
                                    <SelectItem value="orange">
                                        Orange
                                    </SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                    <SelectItem value="purple">
                                        Purple
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={
                                editingFolder
                                    ? handleUpdateFolder
                                    : handleCreateFolder
                            }
                        >
                            {editingFolder ? "Update Folder" : "Create Folder"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Tag Dialog */}
            <Dialog
                open={isTagDialogOpen}
                onOpenChange={setIsTagDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingTag ? "Edit Tag" : "Create New Tag"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="tagName">Tag Name</Label>
                            <Input
                                id="tagName"
                                placeholder="Enter tag name"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tagColor">Tag Color</Label>
                            <Select
                                value={newTagColor}
                                onValueChange={setNewTagColor}
                            >
                                <SelectTrigger id="tagColor">
                                    <SelectValue placeholder="Select color" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blue">Blue</SelectItem>
                                    <SelectItem value="green">Green</SelectItem>
                                    <SelectItem value="yellow">
                                        Yellow
                                    </SelectItem>
                                    <SelectItem value="orange">
                                        Orange
                                    </SelectItem>
                                    <SelectItem value="red">Red</SelectItem>
                                    <SelectItem value="purple">
                                        Purple
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={
                                editingTag ? handleUpdateTag : handleCreateTag
                            }
                        >
                            {editingTag ? "Update Tag" : "Create Tag"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Folder Confirmation */}
            <AlertDialog
                open={!!deletingFolder}
                onOpenChange={() => setDeletingFolder(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {deletingFolder?.name}&quot;? This action cannot be
                            undone. All snippets in this folder will be moved to
                            the root level.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteFolder}
                            className="bg-destructive text-destructive-foreground"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Tag Confirmation */}
            <AlertDialog
                open={!!deletingTag}
                onOpenChange={() => setDeletingTag(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {deletingTag?.name}
                            &quot;? This action cannot be undone. The tag will
                            be removed from all snippets.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteTag}
                            className="bg-destructive text-destructive-foreground"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
