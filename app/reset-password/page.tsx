"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!token) {
      toast.error("リンクが無効です。お手数ですが再度お試しください");
      return;
    }
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    if (error) {
      toast.error(error.message ?? "再設定に失敗しました");
      return;
    }
    toast.success("パスワードを再設定しました");
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        type="password"
        placeholder="新しいパスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSubmit}>パスワードを再設定する</Button>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="w-full mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6">新しいパスワードの設定</h1>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}