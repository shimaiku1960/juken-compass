import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ExamCalendar from "@/app/components/ExamCalendar";

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if (!session) {
    redirect("/login");
  }

  const goals = await prisma.finalGoal.findMany({
    where: { userId: session.user.id },
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
      <p className="mt-4 text-sm text-gray-500">
        ※ 表示している受験日は暫定です。正式な日程は各大学の募集要項で必ずご確認ください。
      </p>
    </main>
  );
};

export default Home;