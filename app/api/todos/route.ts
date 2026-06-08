import prisma from "@/lib/prisma";                                                                                             
import { createClient } from "@/lib/supabase/server";                                                                          
import { NextResponse } from "next/server";  
import { z } from "zod";   

const todoSchema = z.object({
  title: z                                                                                                                                                 
    .string({ message: "タイトルは文字列で入力してください" })                                                                                           
    .min(1, "タイトルは必須です")                                                                                                                          
    .max(100, "100文字以内で入力してください")
    .trim(),                                                                                                                                               
});          

export const GET = async () => {                                                                                             
    const supabase = await createClient();                                                                                       
    const { data: { user } } = await supabase.auth.getUser();                                                                  
                                                                                                                                 
    if (!user) {                                   
      return NextResponse.json({ error: "未認証" }, { status: 401 });                                                            
    }                                                                                                                          
                                                                                                                                 
    const todos = await prisma.todo.findMany({                                                                                 
      where: { profileId: user.id },                                                                                             
      orderBy: { createdAt: "desc" },
    });                                                                                                                          
                                                                                                                               
    return NextResponse.json(todos);
  };                                                                                                                             


  export const POST = async (request: Request) => {                                                                                                          
    const supabase = await createClient();           
    const { data: { user } } = await supabase.auth.getUser();                                                                                                
                                                                                                                                                           
    if (!user) {                                                                                                                                             
      return NextResponse.json({ error: "未認証" }, { status: 401 });                                                                                      
    }  
    
  const body = await request.json();
  const result = todoSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const todo = await prisma.todo.create({
    data: { title: result.data.title, profileId: user.id },
  });
                                                                                                                                                           
                                                                                                                                                        
                                                                                                                                                             
    return NextResponse.json(todo);
  };                                    