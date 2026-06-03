import { createClient } from "@/lib/supabase/server";  
import prisma from "@/lib/prisma";     
import { NextResponse } from "next/server"; 
import { z } from "zod";

const nicknameSchema = z.object({                                                          
  nickname: z.string({ message: "ニックネームは文字列で入力してください" }).min(1,         
"ニックネームは必須です").max(50, "50文字以内で入力してください").trim(),                  
});   

export const PUT = async (request: Request) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {                                                                                     
        return NextResponse.json({ error: "未認証" }, { status: 401 });
      }                                                                                                  
     
         const body = await request.json();                                                         
  const result = nicknameSchema.safeParse(body);

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
