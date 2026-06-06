import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  const { title, description } = await request.json();
  const post = await prisma.post.create({
    data: { title, description, date: new Date() },
  });
  return NextResponse.json(post);
};


      