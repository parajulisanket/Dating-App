import { Suspense } from "react";
import ResetClient from "./ResetClient";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-svh flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <ResetClient />
    </Suspense>
  );
}
