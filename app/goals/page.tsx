import { createClient } from "@/lib/supabase/server";                                                     
import { redirect } from "next/navigation"; 
import prisma from "@/lib/prisma"; 
import  GoalList  from "@/app/components/GoalList";

export default async function GoalsPage() {
    const supabase = await createClient();                                                                  
    const { data: { user } } = await supabase.auth.getUser(); 
    
    if (!user) {
        redirect("/login");                                                                                   
      } 
    
      const goals = await prisma.finalGoal.findMany({           // ← 追加
        where: { profileId: user.id },                          // ← 追加
        orderBy: { examDate: "asc" },                           // ← 追加                                     
      });  
     
    
      return (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">最終目標</h1>
          <GoalList initialGoals={goals} />  
        </div>
      );
    }