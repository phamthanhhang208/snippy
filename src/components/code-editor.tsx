"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeEditorProps {
    code: string;
    language: string;
    onChange: (code: string) => void;
}

export function CodeEditor({ code, language, onChange }: CodeEditorProps) {
    const [value, setValue] = useState(code);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);

    // Update local state when the code prop changes
    useEffect(() => {
        setValue(code);
    }, [code]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        onChange(newValue);
    };

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (preRef.current) {
            preRef.current.scrollTop = e.currentTarget.scrollTop;
            preRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    // Map language to Prism language
    const getPrismLanguage = (lang: string) => {
        const languageMap: Record<string, string> = {
            javascript: "javascript",
            typescript: "typescript",
            html: "html",
            css: "css",
            python: "python",
            java: "java",
            csharp: "csharp",
            php: "php",
            ruby: "ruby",
            go: "go",
            rust: "rust",
            swift: "swift",
            kotlin: "kotlin",
        };

        return languageMap[lang] || "javascript";
    };

    const commonStyles = {
        fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: "14px",
        lineHeight: "1.5",
        padding: "16px",
        margin: "0",
        border: "none",
        outline: "none",
        resize: "none" as const,
        whiteSpace: "pre" as const,
        wordWrap: "break-word" as const,
        overflowWrap: "break-word" as const,
    };

    return (
        <div className="relative h-full overflow-hidden bg-[#1e1e1e]">
            <Highlight
                theme={themes.vsDark}
                code={value}
                language={getPrismLanguage(language)}
            >
                {({
                    className,
                    style,
                    tokens,
                    getLineProps,
                    getTokenProps,
                }) => (
                    <>
                        {/* Syntax highlighted background */}
                        <pre
                            ref={preRef}
                            className={`${className} absolute inset-0 overflow-auto pointer-events-none`}
                            style={{
                                ...style,
                                ...commonStyles,
                                color: "transparent",
                                background: "transparent",
                            }}
                        >
                            {tokens.map((line, i) => {
                                const { ...lineProps } = getLineProps({
                                    line,
                                    key: i,
                                });
                                return (
                                    <div
                                        key={i}
                                        {...lineProps}
                                    >
                                        <span className="inline-block w-8 text-right mr-4 text-gray-500 select-none">
                                            {i + 1}
                                        </span>
                                        {line.map((token, tokenIndex) => {
                                            const {
                                                //key: tokenKey,
                                                ...tokenProps
                                            } = getTokenProps({
                                                token,
                                                key: tokenIndex,
                                            });
                                            return (
                                                <span
                                                    key={tokenIndex}
                                                    {...tokenProps}
                                                />
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </pre>

                        {/* Editable textarea */}
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={handleChange}
                            onScroll={handleScroll}
                            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white z-10"
                            style={{
                                ...commonStyles,
                                paddingLeft: "64px", // Account for line numbers (8 + 4 + 16 = 28px base + 36px for numbers)
                                caretColor: "white",
                                color: "transparent",
                                background: "transparent",
                            }}
                            spellCheck="false"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            data-gramm="false" // Disable Grammarly
                        />
                    </>
                )}
            </Highlight>
        </div>
    );
}
