
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [hovered, setHovered] = useState<"left" | "right" | null>(null);

    const [mode, setMode] = useState<"login" | "signup">("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const supabase = createSupabaseBrowserClient();

            if (mode === "signup") {
                if (!name.trim()) {
                    setError("Please enter your full name.");
                    return;
                }

                if (password.length < 6) {
                    setError("Password must be at least 6 characters.");
                    return;
                }

                if (password !== confirmPassword) {
                    setError("Passwords do not match.");
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: { full_name: name.trim() },
                        emailRedirectTo: `${window.location.origin}/login`,
                    },
                });

                if (error) throw error;

                if (data.session) {
                    router.replace("/account");
                    router.refresh();
                } else {
                    setMessage(
                        "Account created! Please check your email and verify your account before logging in."
                    );
                    setMode("login");
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

                if (error) throw error;

                router.replace("/account");
                router.refresh();
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            setError("Please enter your email address first.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const supabase = createSupabaseBrowserClient();

            const { error } = await supabase.auth.resetPasswordForEmail(
                email.trim(),
                {
                    redirectTo: `${window.location.origin}/login`,
                }
            );

            if (error) throw error;

            setMessage(
                "If an account exists for this email, a password reset link will be sent."
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to send reset email."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-12">

            {/* Main Login Card */}
            <div
                onMouseLeave={() => setHovered(null)}
                className={`login-card-animate grid w-full max-w-5xl overflow-hidden rounded-3xl border border-saffron-light bg-[var(--surface)] shadow-xl md:transition-[grid-template-columns] md:duration-500 md:ease-out ${hovered === "left" ? "md:grid-cols-[1.12fr_0.88fr]" : hovered === "right" ? "md:grid-cols-[0.88fr_1.12fr]" : "md:grid-cols-2"}`}
            >

                {/* Left Panel */}
                <div
                    onMouseEnter={() => setHovered("left")}
                    className={`relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4b2818] via-[#713d20] to-[#a65b25] p-8 text-white transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none md:p-12 ${hovered === "left" ? "md:z-10 md:[transform:perspective(1200px)_rotateY(2.5deg)_scale(1.04)]" : hovered === "right" ? "md:[transform:scale(0.97)]" : ""}`}
                >

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
                    <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-white/10" />

                    <Link
                        href="/"
                        className="relative flex items-center gap-2 text-sm text-white/80 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>

                    <div className="relative py-12">
                        <div className="mb-6 text-5xl">🪷</div>

                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
                            Your Spiritual Journey
                        </p>

                        <h1 className="font-heading text-4xl font-semibold leading-tight md:text-5xl">
                            Welcome to
                            <br />
                            Darshan Dham
                        </h1>

                        <p className="mt-5 max-w-sm text-sm leading-7 text-white/75">
                            Discover sacred places, save your favourite temples
                            and plan your next spiritual journey.
                        </p>
                    </div>

                    <p className="relative text-xs text-white/50">
                        Your journey. Your devotion. Your memories.
                    </p>
                </div>

                {/* Right Panel */}
                <div
                    onMouseEnter={() => setHovered("right")}
                    className={`bg-[var(--surface)] p-7 transition-all duration-500 ease-out will-change-transform motion-reduce:transition-none sm:p-10 md:p-12 ${hovered === "right" ? "md:z-10 md:[transform:perspective(1200px)_rotateY(-2.5deg)_scale(1.03)]" : hovered === "left" ? "md:[transform:scale(0.97)]" : ""}`}
                >

                    <div className="mb-8">
                        <p className="text-sm font-semibold uppercase tracking-widest text-saffron">
                            Devotee Account
                        </p>

                        <h2 className="mt-3 font-heading text-3xl font-semibold text-[var(--foreground)]">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </h2>

                        <p className="mt-2 text-sm text-[var(--muted)]">
                            {mode === "login"
                                ? "Sign in to continue your journey."
                                : "Join us and begin your spiritual journey."}
                        </p>
                    </div>

                    {/* Login / Signup Tabs */}
                    <div className="mb-7 grid grid-cols-2 rounded-xl bg-[var(--surface-soft)] p-1">

                        <button
                            type="button"
                            onClick={() => {
                                setMode("login");
                                setError("");
                                setMessage("");
                            }}
                            className={`rounded-lg py-3 text-sm font-semibold transition ${mode === "login"
                                    ? "bg-[var(--color-saffron)] text-white shadow"
                                    : "text-[var(--muted)]"
                                }`}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setMode("signup");
                                setError("");
                                setMessage("");
                            }}
                            className={`rounded-lg py-3 text-sm font-semibold transition ${mode === "signup"
                                    ? "bg-[var(--color-saffron)] text-white shadow"
                                    : "text-[var(--muted)]"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        {mode === "signup" && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                                    Full Name
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 focus-within:border-saffron">
                                    <User className="h-5 w-5 text-[var(--muted)]" />

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        autoComplete="name"
                                        required
                                        className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                                Email Address
                            </label>

                            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 focus-within:border-saffron">
                                <Mail className="h-5 w-5 text-[var(--muted)]" />

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                                Password
                            </label>

                            <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 focus-within:border-saffron">
                                <Lock className="h-5 w-5 text-[var(--muted)]" />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete={
                                        mode === "login"
                                            ? "current-password"
                                            : "new-password"
                                    }
                                    required
                                    minLength={6}
                                    className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label="Toggle password visibility"
                                    className="text-[var(--muted)]"
                                >
                                    {showPassword
                                        ? <EyeOff className="h-5 w-5" />
                                        : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        {mode === "signup" && (
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                                    Confirm Password
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-4 py-3 focus-within:border-saffron">
                                    <Lock className="h-5 w-5 text-[var(--muted)]" />

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        required
                                        minLength={6}
                                        className="w-full bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted)]"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label="Toggle confirm password visibility"
                                        className="text-[var(--muted)]"
                                    >
                                        {showConfirmPassword
                                            ? <EyeOff className="h-5 w-5" />
                                            : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Forgot Password */}
                        {mode === "login" && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    disabled={loading}
                                    className="text-xs font-semibold text-saffron-dark hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-300"
                            >
                                {error}
                            </p>
                        )}

                        {/* Success Message */}
                        {message && (
                            <p
                                role="status"
                                className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-300"
                            >
                                {message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-[#b96825] to-[#df913b] py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Please wait..."
                                : mode === "login"
                                    ? "Login to Your Account"
                                    : "Create My Account"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-xs leading-6 text-[var(--muted)]">
                        By continuing, you agree to use Darshan Dham respectfully
                        and responsibly.
                    </p>
                </div>
            </div>
        </main>
    );
}
