export interface Snippet {
    id: string;
    title: string;
    code: string;
    language: string;
    notes: string;
    readme?: string;
    tags: string[]; // Array of tag IDs
    folderId: string | null;
    createdAt: string;
    updatedAt: string;
    description?: string;
    isFavorite: boolean;
    isPublic: boolean;
}

export interface SnippetApi extends Snippet {
    folder_id: string | null;
    created_at: string;
    updated_at: string;
    snippet_tags: { tag: Tag }[];
    favorite_snippets: { user_id: string }[];
    is_public: boolean;
}

export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    color?: string; // Added color property
}

export interface Tag {
    id: string;
    name: string;
    color: string; // Added color property
}

export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
