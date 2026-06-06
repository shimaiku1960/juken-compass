import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const post = await prisma.post.findUnique({
        where: { id: Number(id) },
    });
    return NextResponse.json(post);
};

export const PUT = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const { title, description } = await request.json();
    const post = await prisma.post.update({
        where: { id: Number(id) },
        data: { title, description },
    });
    return NextResponse.json(post);
};

export const DELETE = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    await prisma.post.delete({
        where: { id: Number(id) },
    });
    return NextResponse.json({ message: "削除しました" });
};
