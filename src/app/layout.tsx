import type React from "react";
import type { Metadata } from "next";
import { Geist_Mono as GeistMono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/provider";
import { Toaster } from "@/components/ui/sonner";

const geistMono = GeistMono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Snipy - Personal Code Snippets Manager",
    description: "Manage your code snippets with ease",
    icons: {
        icon: "/square-terminal.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body className={`${geistMono.className} dark`}>
                <ReactQueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster
                            position="top-center"
                            richColors
                            expand={true}
                        />
                    </ThemeProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
