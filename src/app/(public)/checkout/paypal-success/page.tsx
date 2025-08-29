"use client";
import { Suspense } from "react";
import PaypalSuccessPage from "./PaypalSuccessPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
      <PaypalSuccessPage />
    </Suspense>
  );
}

// --- move your PaypalSuccessPage component to PaypalSuccessPage.tsx in the same folder ---
// --- and import it as above ---