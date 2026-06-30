"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    if (error) {
      toast.error(error.message ?? "送信に失敗しました");
      return;
    }
    setSent(true);
  };

  return (
    <main className="w-full mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6">パスワードの再設定</h1>

      {sent ? (
        <p className="text-sm text-muted-foreground">
          入力されたメールアドレス宛に再設定用のリンクを送信しました。メールをご確認ください。
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          <Input
            type="email"
            placeholder="登録したメールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleSubmit}>再設定リンクを送信</Button>
        </div>
      )}
    </main>
  );
}