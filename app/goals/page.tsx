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

      const goals = await prisma.finalGoal.findMany({
        where: { profileId: user.id },
        include: {
          faculty: {
            include: { university: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });

      const faculties = await prisma.faculty.findMany({
        include: { university: true },
        orderBy: { id: "asc" },
      });
    

     
    
      return (
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">最終目標</h1>
          <GoalList initialGoals={goals}  faculties={faculties}/>  
        </div>
      );
    }