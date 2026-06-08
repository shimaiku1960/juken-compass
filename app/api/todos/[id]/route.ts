import prisma from "@/lib/prisma";                                        
import { createClient } from "@/lib/supabase/server";                     
import { NextResponse } from "next/server";                               
                                          
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
    const { completed } = await request.json();
                                                                          
    const todo = await prisma.todo.update({
      where: { id: Number(id), profileId: user.id },
      data: { completed },                                                  
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