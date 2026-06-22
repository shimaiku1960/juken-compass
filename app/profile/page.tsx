import { createClient } from "@/lib/supabase/server";                                                
import prisma from "@/lib/prisma";                                                                   
import { redirect } from "next/navigation"; 
import ProfileEdit from "@/app/components/ProfileEdit";
import GoalList from "@/app/components/GoalList";
import { Card, CardContent } from "@/components/ui/card";
                                                                                                       
const ProfilePage = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
    });


    if (!profile) {
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
        <main className="w-full mx-auto max-w-3xl p-8">
          <h1 className="text-3xl font-bold mb-6">プロフィール</h1>
          <Card>
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">ニックネーム</p>
        <ProfileEdit currentNickname={profile.nickname} />
      </div>
      <div>
        <p className="text-sm text-gray-500">メールアドレス</p>
        <p className="text-xl">{user.email}</p>
      </div>
    </CardContent>
  </Card>

  <h2 className="text-2xl font-bold mt-10 mb-4">志望校</h2>
  <Card>
    <CardContent>
      <GoalList initialGoals={goals} faculties={faculties} />
    </CardContent>
  </Card>
        </main>
      );
    };
  



 
        


export default ProfilePage;