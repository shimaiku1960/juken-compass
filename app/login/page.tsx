"use client";

import { login } from "@/app/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main className="w-full mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6">ログイン</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium
  mb-1">
              メールアドレス
            </label>
            <Input id="email" name="email" type="email" required />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium
  mb-1">
              パスワード
            </label>
            <Input id="password" name="password" type="password" required
  minLength={6} />
          </div>

          <Button type="submit" className="w-full">
            ログイン
          </Button>
        </form>


     

      <p className="mt-4 text-sm text-gray-600">
        アカウントがない方は{" "}
        <Link href="/signup" className="text-blue-500 underline">
          サインアップ
        </Link>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
