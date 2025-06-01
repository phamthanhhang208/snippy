"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { login, register } from "@/app/login/action";
import type { User } from "@/lib/types";

interface AuthPageProps {
    onAuthSuccess: (user: User) => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await login(email, password);

            if (result.user) {
                onAuthSuccess({
                    id: result.user.id,
                    email: result.user.email ?? "",
                    name: result.user.user_metadata?.name ?? "Anonymous",
                    avatar: result.user.user_metadata?.avatar,
                });
            } else {
                setError(result.error?.message || "Login failed");
            }
        } catch (err) {
            setError(`An unexpected error occurred: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (
        email: string,
        password: string,
        name: string
    ) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await register(email, password, name);
            if (result.user) {
                onAuthSuccess({
                    id: result.user.id,
                    email: result.user.email ?? "",
                    name: result.user.user_metadata?.name ?? "Anonymous",
                    avatar: result.user.user_metadata?.avatar,
                });
            } else {
                setError(result.error?.message || "Registration failed");
            }
        } catch (err) {
            setError(`An unexpected error occurred: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    const switchToRegister = () => {
        setIsLogin(false);
        setError(null);
    };

    const switchToLogin = () => {
        setIsLogin(true);
        setError(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0d12] p-4">
            {isLogin ? (
                <LoginForm
                    onLogin={handleLogin}
                    onSwitchToRegister={switchToRegister}
                    isLoading={isLoading}
                    error={error}
                />
            ) : (
                <RegisterForm
                    onRegister={handleRegister}
                    onSwitchToLogin={switchToLogin}
                    isLoading={isLoading}
                    error={error}
                />
            )}
        </div>
    );
}
