"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";

export default function AuthLoader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setError("No authorization code received");
      return;
    }

    const processAuth = async () => {
      try {
        const response = await axios.post("/api/auth/google", {
          code,
          redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        });

        if (response.data.success) {
          setStatus("success");

          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      } catch (err: any) {
        setStatus("error");
        setError(err.response?.data?.error || "Authentication failed");
      }
    };

    processAuth();
  }, [code, router]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              href="/"
              className="w-full block bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border">
        <div className="text-center space-y-6">
          {/* Simple Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <FcGoogle size={32} />
              <span className="text-2xl font-bold text-gray-900">
                BookmarkHub
              </span>
            </div>
          </div>

          {/* Simple Status */}
          {status === "success" ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-xl mx-auto flex items-center justify-center mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Success!
                </h2>
                <p className="text-gray-600">Redirecting to dashboard...</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Signing you in
                </h2>
                <p className="text-gray-600 mb-6">
                  Please wait while we complete authentication
                </p>
                <div className="space-y-2 text-sm text-gray-500 text-left mx-auto max-w-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>✓ Google verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-spin border-t-blue-600 w-6 h-6"></div>
                    <span>Setting up session</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
