"use client";

import { PageLoader } from "@/components/common";
import AuthLoader from "@/components/main/auth/AuthLoader";
import { Suspense } from "react";

export default function AuthCallback() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AuthLoader />
    </Suspense>
  );
}
