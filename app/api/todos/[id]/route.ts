import prisma from "@/lib/prisma";                                        
import { createClient } from "@/lib/supabase/server";                     
import { NextResponse } from "next/server";   
import { z } from "zod";  

const updateTodoSchema = z.object({                                                                                          
  completed: z.boolean({ message: "completedはtrue/falseで入力してください" }),                                              
});        
                                          
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
    const body = await request.json();
    const result = updateTodoSchema.safeParse(body);                         
                                                                              
    if (!result.success) {            
      return NextResponse.json(
        { error: result.error.issues[0].message },                                                                           
        { status: 400 }
      );                                                                                                                     
    }                                            
   
                                                                          
    const todo = await prisma.todo.update({
      where: { id: Number(id), profileId: user.id },
      data: { completed: result.data.completed },                                                  
    });
                                                                            
    return NextResponse.json(todo);
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
                                                                            
    await prisma.todo.delete({                                            
      where: { id: Number(id), profileId: user.id },                        
    });           
               
    return NextResponse.json({ message: "削除しました" });                
  };                   