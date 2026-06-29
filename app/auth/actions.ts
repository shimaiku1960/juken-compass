"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const logout = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  redirect("/login");
};
