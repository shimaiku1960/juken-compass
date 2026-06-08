import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const GET = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "未認証" }, { status: 401 });
    }

    const { id } = await params;
    const post = await prisma.article.findUnique({
        where: { id: Number(id) },
    });
    return NextResponse.json(post);
};

export const PUT = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "未認証" }, { status: 401 });
    }

    const { id } = await params;
    const { title, description } = await request.json();
    const post = await prisma.article.update({
        where: { id: Number(id) },
        data: { title, description },
    });
    return NextResponse.json(post);
};

export const DELETE = async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "未認証" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.article.delete({
        where: { id: Number(id) },
    });
    return NextResponse.json({ message: "削除しました" });
};
