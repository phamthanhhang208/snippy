# 📝 Snippy

[LiveDemo]()

A modern, full-stack code snippet management app built with **Next.js (App Router)**, **Supabase**, **React Query**, and TypeScript.

---

## ✨ Features

-   **User Authentication** (Supabase Auth)
-   **Create, Read, Update, Delete** for:
    -   Snippets (with code, markdown notes, readme, language, description)
    -   Folders (with nesting and color)
    -   Tags (with color)
-   **Organize snippets** in folders and categorize with tags
-   **Favorite** snippets
-   **Mark snippets as public/private**
-   **Full-text search** (optional, via Supabase)
-   **React Query** for data fetching, caching, and mutations
-   **TypeScript** end-to-end
-   **API routes** for all business logic (no direct client DB access)
-   **Responsive UI** (customize as you wish)

---

## 🧑‍💻 Development Notes

-   **Auth:** Uses Supabase Auth UI for sign-in/sign-up. OAuth providers supported.
-   **API:** All data operations go through Next.js API routes (`/app/api/...`).
-   **React Query:** Handles all data fetching and mutations.
-   **Type Safety:** All API responses and client code are fully typed.
-   **RLS:** Row Level Security is enabled on all tables. Users can only access their own data (except public snippets).

---

## 🗃️ Database Schema (Summary)

-   **users** (Supabase Auth)
-   **snippets** (code, notes, readme, language, description, folder, is_public)
-   **folders** (name, parent, color)
-   **tags** (name, color)
-   **snippet_tags** (join table)
-   **favorite_snippets** (user, snippet)

## ![database_schema](/public/supabase-schema.png)

## 🛠️ Scripts

-   `npm run dev` — Start development server
-   `npm run build` — Build for production
-   `npm run start` — Start production server

---

## 📦 Tech Stack

-   [Next.js (App Router)](https://nextjs.org/docs/app)
-   [Supabase](https://supabase.com/)
-   [@tanstack/react-query](https://tanstack.com/query/latest)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Sonner](https://sonner.emilkowal.ski/) (for toasts)
-   [Tailwind CSS](https://tailwindcss.com/) (optional, for styling)

---

## 📝 License

MIT

---

## 🙏 Credits

-   [Supabase](https://supabase.com/)
-   [Next.js](https://nextjs.org/)
-   [TanStack Query](https://tanstack.com/query/latest)

---
