"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="w-full mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6">ログイン</h1>
      <Button
        className="w-full"
        onClick={() =>
          authClient.signIn.social({ provider: "google", callbackURL: "/" })
        }
      >
        Googleでログイン
      </Button>
    </main>
  );
}
