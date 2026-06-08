import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const { title, description } = await request.json();
  const post = await prisma.article.create({
    data: { title, description, date: new Date() },
  });
  return NextResponse.json(post);
};


      