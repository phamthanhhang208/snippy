"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { SnippetsList } from "@/components/snippets-list";
import { SnippetView } from "@/components/snippet-view";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Snippet, Folder, Tag, User } from "@/lib/types";
import { AuthPage } from "@/components/auth/auth-page";
import useUser from "./hooks/useUser";
import useListSnippetQuery from "./hooks/queries";
import {
    useCreateTag,
    useDeleteTag,
    useUpdateTag,
} from "./hooks/tag/mutations";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "./login/action";
import {
    useCreateSnippet,
    useDeleteSnippet,
    useUpdateSnippet,
} from "./hooks/snippet/mutations";

import {
    useCreateFolder,
    useDeleteFolder,
    useUpdateFolder,
} from "./hooks/folder/mutation";

export default function Home() {
    const { user, loading } = useUser();
    const queryClient = useQueryClient();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedView, setSelectedView] = useState<
        "all" | "favorites" | "public"
    >("all");
    const [isLoading, setIsLoading] = useState(true);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
    // --- queries ---
    const {
        data,
        loading: isLoadingListSnippet,
        success,
    } = useListSnippetQuery(currentUser);

    // -- mutation --

    const createSnippet = useCreateSnippet();
    const updateSnippet = useUpdateSnippet();
    const deleteSnippet = useDeleteSnippet();

    const createFolder = useCreateFolder();
    const updateFolder = useUpdateFolder();
    const deleteFolder = useDeleteFolder();

    const createTag = useCreateTag();
    const updateTag = useUpdateTag();
    const deleteTag = useDeleteTag();

    useEffect(() => {
        if (user) {
            setCurrentUser({
                id: user.id,
                email: user.email ?? "",
                name: user.user_metadata?.name ?? user.email ?? "",
                avatar: user.user_metadata?.avatar_url,
            });
        } else {
            setCurrentUser(null);
        }
        setIsLoading(loading);
    }, [user, loading]);

    useEffect(() => {
        if (!isLoadingListSnippet && success) {
            setFolders(data.folders);
            setSnippets(data.snippets);
            setTags(data.tags);
        }
    }, [isLoadingListSnippet, success, data]);

    // Filter snippets based on selected folder, view, and search query
    useEffect(() => {
        let filtered = snippets;

        // Filter by view
        if (selectedView === "favorites") {
            filtered = filtered.filter((snippet) => snippet.isFavorite);
        } else if (selectedView === "public") {
            filtered = filtered.filter((snippet) => snippet.isPublic);
        }

        // Filter by folder
        if (selectedFolder) {
            filtered = filtered.filter(
                (snippet) =>
                    snippet.folderId === selectedFolder ||
                    folders.find((f) => f.id === snippet.folderId)?.parentId ===
                        selectedFolder
            );
        }

        // Filter by tags
        if (selectedTags.length > 0) {
            filtered = filtered.filter((snippet) =>
                selectedTags.every((tagId) => snippet.tags.includes(tagId))
            );
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (snippet) =>
                    snippet.title.toLowerCase().includes(query) ||
                    (snippet.description &&
                        snippet.description.toLowerCase().includes(query)) ||
                    snippet.code.toLowerCase().includes(query) ||
                    snippet.notes.toLowerCase().includes(query) ||
                    snippet.tags?.some((tagId) =>
                        tags
                            .find((t) => t.id === tagId)
                            ?.name.toLowerCase()
                            .includes(query)
                    )
            );
        }

        setFilteredSnippets(filtered);

        // Select the first snippet if none is selected
        if (filtered.length > 0 && !selectedSnippet) {
            setSelectedSnippet(filtered[0]);
        } else if (filtered.length === 0) {
            setSelectedSnippet(null);
        }
    }, [
        snippets,
        selectedFolder,
        selectedView,
        searchQuery,
        folders,
        tags,
        selectedSnippet,
        selectedTags,
    ]);

    const handleCreateSnippet = () => {
        const newSnippet: Snippet = {
            id: `snippet-${Date.now()}`,
            title: "New Snippet",
            code: "// Add your code here",
            language: "javascript",
            notes: "",
            description: "",
            tags: [],
            folderId: selectedFolder || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
            isPublic: false,
        };
        setSnippets([newSnippet, ...snippets]);
        setSelectedSnippet(newSnippet);

        createSnippet.mutate(newSnippet, {
            onSuccess(data: unknown) {
                const snippetData = data as { snippet: Snippet };
                const returnedNewSnippet = snippetData.snippet;
                newSnippet.id = returnedNewSnippet.id;
            },
        });
    };

    const handleUpdateSnippet = (updatedSnippet: Snippet) => {
        const updatedSnippets = snippets.map((s) =>
            s.id === updatedSnippet.id ? updatedSnippet : s
        );
        setSnippets(updatedSnippets);
        setSelectedSnippet(updatedSnippet);
        updateSnippet.mutate(updatedSnippet);
    };

    const handleDeleteSnippet = (id: string) => {
        const updatedSnippets = snippets.filter((s) => s.id !== id);
        setSnippets(updatedSnippets);
        setSelectedSnippet(updatedSnippets[0] || null);
        deleteSnippet.mutate(id);
    };

    const handleCreateFolder = (
        name: string,
        parentId: string | null = null,
        color: string
    ) => {
        // Assign a random color from the available colors
        const colors = ["blue", "yellow", "orange", "red"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newFolder: Folder = {
            id: `folder-${Date.now()}`,
            name,
            parentId,
            color: color ? color : randomColor,
        };
        setFolders([...folders, newFolder]);
        createFolder.mutate(newFolder);
    };

    const handleUpdateFolder = async (
        id: string,
        name: string,
        color: string,
        parentId: string | null
    ) => {
        try {
            const folder = {
                id: id,
                name: name,
                color: color,
                parentId: parentId,
            };
            updateFolder.mutate(folder);
            setFolders(folders.map((f) => (f.id === id ? folder : f)));
        } catch (error) {
            console.error("Error updating folder:", error);
        }
    };

    const handleDeleteFolder = (id: string) => {
        try {
            deleteFolder.mutate(id);
            setFolders(folders.filter((f) => f.id !== id));
            // Move snippets from deleted folder to root
            const updatedSnippets = snippets.map((s) =>
                s.folderId === id ? { ...s, folderId: null } : s
            );
            setSnippets(updatedSnippets);
            if (selectedFolder === id) {
                setSelectedFolder(null);
            }
        } catch (error) {
            console.error("Error deleting folder:", error);
        }
    };

    const handleCreateTag = (name: string) => {
        // Assign a random color from the available colors
        const colors = ["blue", "yellow", "orange", "red", "green", "purple"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newTag: Tag = {
            id: `tag-${Date.now()}`,
            name,
            color: randomColor,
        };
        setTags([...tags, newTag]);
        createTag.mutate(newTag, {
            onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["tag"] }),
        });
        return newTag.id;
    };

    const handleUpdateTag = (id: string, name: string, color: string) => {
        try {
            const tag = { id: id, name: name, color: color };
            updateTag.mutate(tag);
            setTags(tags.map((t) => (t.id === id ? tag : t)));
        } catch (error) {
            console.error("Error updating tag:", error);
        }
    };

    const handleDeleteTag = (id: string) => {
        try {
            deleteTag.mutate(id);
            setTags(tags.filter((t) => t.id !== id));
            // Remove tag from all snippets
            const updatedSnippets = snippets.map((s) => ({
                ...s,
                tags: s.tags.filter((tagId) => tagId !== id),
            }));
            setSnippets(updatedSnippets);
            // Remove from selected tags
            setSelectedTags(selectedTags.filter((tagId) => tagId !== id));
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    const handleSelectView = (view: "all" | "favorites" | "public") => {
        setSelectedView(view);
        setSelectedFolder(null); // Clear folder selection when changing view
        setSelectedTags([]);
    };

    const handleAuthSuccess = (authenticatedUser: User) => {
        setCurrentUser(authenticatedUser);
    };

    const handleLogout = async () => {
        logout();
        setCurrentUser(null);
        setFolders([]);
        setSnippets([]);
        setTags([]);
        setSelectedTags([]);
        setSelectedFolder(null);
        setSelectedView("all");
        setSelectedSnippet(null);
        setSearchQuery("");
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0a0d12]">
                <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                        <span className="text-[#3b82f6]">S</span>nip
                        <span className="text-[#3b82f6]">y</span>
                    </div>
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }

    return (
        <main
            className="flex h-screen overflow-hidden"
            style={{ backgroundColor: "#0a0d12" }}
        >
            <Sidebar
                folders={folders}
                tags={tags}
                onSelectFolder={setSelectedFolder}
                selectedFolder={selectedFolder}
                selectedView={selectedView}
                selectedTags={selectedTags}
                onSelectView={handleSelectView}
                onSelectTags={setSelectedTags}
                onCreateFolder={handleCreateFolder}
                onUpdateFolder={handleUpdateFolder}
                onDeleteFolder={handleDeleteFolder}
                onCreateTag={handleCreateTag}
                onUpdateTag={handleUpdateTag}
                onDeleteTag={handleDeleteTag}
                user={currentUser}
                onLogout={handleLogout}
            />
            <div className="flex flex-col flex-1 border-l border-[#1e2330]">
                <div className="flex items-center p-2 border-b border-[#1e2330]">
                    <SearchBar onSearch={setSearchQuery} />
                </div>
                <div className="flex flex-1 overflow-hidden">
                    <SnippetsList
                        snippets={filteredSnippets}
                        tags={tags}
                        selectedSnippet={selectedSnippet}
                        onSelectSnippet={setSelectedSnippet}
                        onCreateSnippet={handleCreateSnippet}
                    />
                    {selectedSnippet ? (
                        <SnippetView
                            snippet={selectedSnippet}
                            tags={tags}
                            onUpdateSnippet={handleUpdateSnippet}
                            onDeleteSnippet={handleDeleteSnippet}
                        />
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-muted-foreground mb-4">
                                    No snippet selected
                                </p>
                                <Button onClick={handleCreateSnippet}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Snippet
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Button
                size="icon"
                className="absolute bottom-6 right-6 rounded-full h-12 w-12 shadow-lg"
                onClick={handleCreateSnippet}
            >
                <Plus className="h-6 w-6" />
            </Button>
        </main>
    );
}
