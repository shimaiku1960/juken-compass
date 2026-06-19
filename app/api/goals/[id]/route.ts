import { NextResponse } from "next/server";                                                                                                                                 
import { createClient } from "@/lib/supabase/server";                                                                                                                       
import prisma from "@/lib/prisma";                                                                                                                                          
import { z } from "zod";                                                                                                                                                    
                                                                                                                                                                            
const updateGoalSchema = z.object({                                                                                                                                         
  title: z.string().min(1).optional(),
  examDate: z.string().datetime().optional(),                                                                                                                               
});                                                                                                                                                                       

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
      ...(parsed.data.title && { title: parsed.data.title }),
      ...(parsed.data.examDate && { examDate: new Date(parsed.data.examDate) }),                                                                                            
    },
  });                                                                                                                                                                       
                                                                                                                                                                          
  return NextResponse.json(updated);
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


