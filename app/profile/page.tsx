import { createClient } from "@/lib/supabase/server";                                                
import prisma from "@/lib/prisma";                                                                   
import { redirect } from "next/navigation"; 
import ProfileEdit from "@/app/components/ProfileEdit";  
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
      <div>
        <p className="text-sm text-gray-500">登録日</p>
        <p className="text-xl">{new
  Date(profile.createdAt).toLocaleDateString("ja-JP")}</p>
      </div>
    </CardContent>
  </Card>
        </main>
      );
    };
  



 
        


export default ProfilePage;