"use client";

import { signup } from "@/app/auth/actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function SignupForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <main className="w-full mx-auto max-w-md p-8">
      <h1 className="text-3xl font-bold mb-6">サインアップ</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      {message && (
        <p className="bg-green-100 text-green-700 p-3 rounded mb-4">
          {message}
        </p>
      )}

<form action={signup} className="space-y-4">
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
              パスワード（6文字以上）
            </label>
            <Input id="password" name="password" type="password" required
  minLength={6} />
          </div>

          <Button type="submit" className="w-full">
            サインアップ
          </Button>
        </form>

  

      <p className="mt-4 text-sm text-gray-600">
        すでにアカウントをお持ちの方は{" "}
        <Link href="/login" className="text-blue-500 underline">
          ログイン
        </Link>
      </p>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
