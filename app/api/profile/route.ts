import { createClient } from "@/lib/supabase/server";  
import prisma from "@/lib/prisma";     
import { NextResponse } from "next/server"; 
import { profileSchema } from "@/lib/validations/profile";



export const PUT = async (request: Request) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {                                                                                     
        return NextResponse.json({ error: "未認証" }, { status: 401 });
      }                                                                                                  
     
         const body = await request.json();                                                         
  const result = profileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

      const profile = await prisma.profile.update({
        where: { id: user.id },
        data: { nickname: result.data.nickname },
      });                                                                                                
                                                                                                       
      return NextResponse.json(profile);        
    };                     
