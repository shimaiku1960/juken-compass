import { NextResponse } from "next/server";                                                                                                                                 
import { createClient } from "@/lib/supabase/server";                                                                                                                       
import prisma from "@/lib/prisma";                                                                                                                                          
import { updateGoalSchema, firstChoiceSchema } from "@/lib/validations/goal";
                                                                                                                                                                            
                                                                                                                                                                     

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {                                                                                                                                                                         
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();                                                                                                                 
                                                                                                                                                                          
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }                                                                                                                                                                         
 
  const { id } = await params;                                                                                                                                              
                                                                                                                                                                          
  const body = await request.json();
  const parsed = updateGoalSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }                                                                                                                                                                         
 
  const goal = await prisma.finalGoal.findUnique({                                                                                                                          
    where: { id: Number(id) },                                                                                                                                            
  });

  if (!goal || goal.profileId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }                                                                                                                                                                         
 
  const updated = await prisma.finalGoal.update({                                                                                                                           
    where: { id: Number(id) },                                                                                                                                            
    data: {
      ...(parsed.data.facultyId && { facultyId: parsed.data.facultyId }),                                                                                            
    },
  });                                                                                                                                                                       
                                                                                                                                                                          
  return NextResponse.json(updated);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json();
  const parsed = firstChoiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const goal = await prisma.finalGoal.findUnique({
    where: { id: Number(id) },
  });

  if (!goal || goal.profileId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.isFirstChoice) {
    // 第一志望は1ユーザー1校まで。既存の第一志望を全部外してから付け替える
    await prisma.$transaction([
      prisma.finalGoal.updateMany({
        where: { profileId: user.id },
        data: { isFirstChoice: false },
      }),
      prisma.finalGoal.update({
        where: { id: Number(id) },
        data: { isFirstChoice: true },
      }),
    ]);
  } else {
    await prisma.finalGoal.update({
      where: { id: Number(id) },
      data: { isFirstChoice: false },
    });
  }

  return NextResponse.json({ message: "OK" });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const goal = await prisma.finalGoal.findUnique({
    where: { id: Number(id) },
  });

  if (!goal || goal.profileId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.finalGoal.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ message: "Deleted" });
}


