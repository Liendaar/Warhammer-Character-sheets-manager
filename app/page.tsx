"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            WFRP 4e Manager
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-sepia)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--bg-paper)] px-2 text-[var(--text-muted)]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={handleGoogleLogin}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                <path
                  d="M12.0003 20.45c4.656 0 8.556-3.21 9.972-7.59h-9.972v-4.14h14.64c.15 1.05.24 2.13.24 3.24 0 8.37-5.94 14.4-14.88 14.4-8.61 0-15.6-6.99-15.6-15.6 0-8.61 6.99-15.6 15.6-15.6 4.17 0 7.92 1.53 10.83 4.02l-3.99 3.99c-1.5-1.17-3.87-2.1-6.84-2.1-5.73 0-10.44 4.65-10.44 10.38 0 5.73 4.71 10.38 10.44 10.38z"
                  fill="currentColor"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
