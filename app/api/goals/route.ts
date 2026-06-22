import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import prisma  from "@/lib/prisma";
import { goalSchema } from "@/lib/validations/goal";
import { Prisma } from "@/app/generated/prisma/client";




export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.finalGoal.findMany({
    where: { profileId: user.id },
    orderBy: { createdAt: "asc" },
    include: {
      faculty: {
        include: { university: true },
      },
    },
  });

  return NextResponse.json(goals);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = goalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  try {
    const goal = await prisma.finalGoal.create({
      data: {
        facultyId: parsed.data.facultyId,
        profileId: user.id,
      },
      include: {
        faculty: {
          include: { university: true },
        },
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "この学部はすでに登録されています" },
        { status: 409 }
      );
    }
    throw error;
  }
}
