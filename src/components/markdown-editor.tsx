"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function MarkdownEditor({
    value,
    onChange,
    placeholder,
}: MarkdownEditorProps) {
    const [preview, setPreview] = useState(false);

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-end p-2 border-b border-border">
                <button
                    className={cn(
                        "px-3 py-1 rounded text-sm",
                        preview
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                    )}
                    onClick={() => setPreview(!preview)}
                >
                    {preview ? "Editor" : "Preview"}
                </button>
            </div>
            {preview ? (
                <div className="p-4 overflow-auto markdown">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {value}
                    </ReactMarkdown>
                </div>
            ) : (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="h-full resize-none border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            )}
        </div>
    );
}
