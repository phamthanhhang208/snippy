"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
    onRegister: (
        email: string,
        password: string,
        name: string
    ) => Promise<void>;
    onSwitchToLogin: () => void;
    isLoading: boolean;
    error: string | null;
}

export function RegisterForm({
    onRegister,
    onSwitchToLogin,
    isLoading,
    error,
}: RegisterFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onRegister(email, password, name);
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                    <span className="text-[#3b82f6]">S</span>nip
                    <span className="text-[#3b82f6]">y</span>
                </CardTitle>
                <CardDescription>Create your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={isLoading}
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            Already have an account?{" "}
                        </span>
                        <Button
                            type="button"
                            variant="link"
                            className="p-0 h-auto"
                            onClick={onSwitchToLogin}
                            disabled={isLoading}
                        >
                            Sign in
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
