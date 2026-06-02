import { createClient } from "@/lib/supabase/server";  
import prisma from "@/lib/prisma";     
import { NextResponse } from "next/server";    

export const PUT = async (request: Request) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {                                                                                     
        return NextResponse.json({ error: "未認証" }, { status: 401 });
      }                                                                                                  
     
      const { nickname } = await request.json();                                                         
                                                                                                       
      const profile = await prisma.profile.update({
        where: { id: user.id },                                                                          
        data: { nickname },
      });                                                                                                
                                                                                                       
      return NextResponse.json(profile);        
    };                     
