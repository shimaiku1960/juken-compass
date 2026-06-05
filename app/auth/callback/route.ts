import { NextResponse } from "next/server";                                                                                                                
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";     

                                                                                                                                                             
  export const GET = async (request: Request) => {
    const { searchParams, origin } = new URL(request.url);                                                                                                   
    const code = searchParams.get("code");                                                                                                                   
                                                                                                                                                             
    if (code) {                                                                                                                                              
      const supabase = await createClient();                                                                                                               
      const { error } = await supabase.auth.exchangeCodeForSession(code);                                                                                    
   
      if (!error) {    
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const existingProfile = await prisma.profile.findUnique({
            where: { id: user.id },
          });

          if (!existingProfile) {
            await prisma.profile.create({
              data: {
                id: user.id,
                nickname: user.email?.split("@")[0] ?? "名無し",
              },
            });
          }
        }


        return NextResponse.redirect(`${origin}/`);                                                                                                        
      }
    }                                                                                                                                                        
   
    return NextResponse.redirect(`${origin}/login?error=認証に失敗しました`);                                                                                
  };          