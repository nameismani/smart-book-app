"use client";

import { useEffect, useState, useTransition } from "react";
import { signInWithGoogle } from "@/actions/auth";
import Link from "next/link";
import CheckIcon from "@/assets/CheckIcon";
import { User } from "@supabase/supabase-js";

interface Props {
  user: User;
  isAuthenticated: boolean;
}

export default function AuthUI({ user, isAuthenticated }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isClientLoading, setIsClientLoading] = useState(true);

  useEffect(() => {
    setIsClientLoading(false);
  }, []);

  const handleSignIn = () => {
    startTransition(async () => {
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error("Sign in error:", error);
      }
    });
  };

  // Show loader during server action
  if (isPending) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6 mx-auto"></div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Signing in...
          </h3>
          <p className="text-slate-600 text-sm">Redirecting to Google...</p>
        </div>
      </div>
    );
  }

  if (isClientLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400 mb-4 mx-auto"></div>
          <p className="text-slate-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ USER AUTHENTICATED (secure)
  if (isAuthenticated && user) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              Welcome back!
            </h3>
            <p className="text-slate-600 text-sm max-w-[200px] mx-auto truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="w-full block text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  // ✅ NOT AUTHENTICATED
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Get Started Free
          </h3>
          <p className="text-slate-600">
            Sign in to start organizing your bookmarks
          </p>
        </div>

        {/* Sign In Button */}
        <form action={signInWithGoogle} onClick={handleSignIn}>
          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 text-slate-700 font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:group-hover:shadow-sm"
          >
            {/* Google Icon */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </form>

        {/* Benefits */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckIcon />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckIcon />
            <span>Free forever</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckIcon />
            <span>Secure & private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
