import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import UniversitySearch from "@/app/components/UniversitySearch";

const ExplorePage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      prefecture: true,
      type: true,
      _count: { select: { faculties: true } },
    },
  });

  return (
    <main className="w-full mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">大学を探す</h1>
      <UniversitySearch universities={universities} />
    </main>
  );
};

export default ExplorePage;
