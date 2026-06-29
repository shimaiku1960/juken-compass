"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { error } = await authClient.signUp.email({
      email,
      password,
      name: email,
    });
    if (error) {
      toast.error(error.message ?? "登録に失敗しました");
      return;
    }
    toast.success("登録しました");
    router.push("/");
  };

  const handleSignIn = async () => {
    const { error } = await authClient.signIn.email({
      email,
      password,
    });
    if (error) {
      toast.error(error.message ?? "ログインに失敗しました");
      return;
    }
    router.push("/");
  };

  return (
    <main className="w-full mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6">ログイン</h1>

      <div className="flex flex-col gap-3 mb-3">
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex gap-3 mb-6">
        <Button className="flex-1" onClick={handleSignIn}>
          ログイン
        </Button>
        <Button className="flex-1" variant="outline" onClick={handleSignUp}>
          新規登録
        </Button>
      </div>

      <Button
        className="w-full"
        variant="secondary"
        onClick={() =>
          authClient.signIn.social({ provider: "google", callbackURL: "/" })
        }
      >
        Googleでログイン
      </Button>
      <Button
        className="w-full mt-3"
        variant="secondary"
        onClick={() =>
          authClient.signIn.social({ provider: "github", callbackURL: "/" })
        }
      >
        GitHubでログイン
      </Button>
    </main>
  );
}
