import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ExamCalendar from "@/app/components/ExamCalendar";

const Home = async () => {
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

  const events = goals.map((goal) => ({
    id: String(goal.id),
    title: `${goal.faculty.university.name} ${goal.faculty.name}`,
    date: goal.faculty.examDate.toISOString().slice(0, 10),
  }));

  return (
    <main className="w-full mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      <ExamCalendar events={events} />
    </main>
  );
};

export default Home;