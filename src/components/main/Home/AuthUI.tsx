"use client";

import { useEffect, useState, useTransition } from "react";
import { signInWithGoogle } from "@/actions/auth";
import Link from "next/link";
import { CheckIcon, GoogleIcon } from "@/assets";
import { User } from "@supabase/supabase-js";
import { ArrowRight, LucideCheckCircle } from "lucide-react";

interface Props {
  user: User;
  isAuthenticated: boolean;
}

const AuthUI = ({ user, isAuthenticated }: Props) => {
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
              <LucideCheckCircle className="text-white size-8" />
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
            className="w-full cursor-pointer bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-blue-300 text-slate-700 font-semibold py-4 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:group-hover:shadow-sm "
          >
            {/* Google Icon */}
            <GoogleIcon />
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </button>
        </form>

        {/* Benefits */}
        <div className="space-y-3 pt-4 ">
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
};

export default AuthUI;
