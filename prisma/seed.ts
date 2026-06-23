
import { readFileSync } from "fs";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

// 全国大学マスター（scripts/transform-universities.ts が生成）
type UniversityRow = { name: string; prefecture: string; type: string };
const universities: UniversityRow[] = JSON.parse(
  readFileSync("data/clean/universities.json", "utf-8")
);

// 学部 → 系統タグ（中位の粒度。複数当てはまる学部は複数タグ）
const facultyTags: Record<string, string[]> = {
  政治経済学部: ["法・政経系", "商・経営系"],
  法学部: ["法・政経系"],
  商学部: ["商・経営系"],
  文学部: ["文・文化系"],
  文化構想学部: ["文・文化系"],
};

const facultyExamDates: Record<string, string> = {
  政治経済学部: "2027-02-20",
  法学部: "2027-02-15",
  商学部: "2027-02-21",
  文学部: "2027-02-17",
  文化構想学部: "2027-02-12",
};

async function main() {
  // 1. 全国の大学マスターを upsert（name が一意キー）
  for (const u of universities) {
    await prisma.university.upsert({
      where: { name: u.name },
      update: { prefecture: u.prefecture, type: u.type },
      create: { name: u.name, prefecture: u.prefecture, type: u.type },
    });
  }
  console.log(`大学を投入: ${universities.length}校`);

  // 2. 系統タグを upsert（重複作成を避ける）
  const tagNames = ["法・政経系", "商・経営系", "文・文化系"];
  for (const name of tagNames) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 3. 早稲田の学部・系統タグを投入（学部データは当面ここだけ手動で拡充）
  const university = await prisma.university.findUniqueOrThrow({
    where: { name: "早稲田大学" },
  });

  // 各学部を「無ければ作成・あればタグだけ付け直す」
  for (const [name, tags] of Object.entries(facultyTags)) {
    const existing = await prisma.faculty.findFirst({
      where: { name, universityId: university.id },
    });

    const tagConnect = tags.map((t) => ({ name: t }));

    if (existing) {
      await prisma.faculty.update({
        where: { id: existing.id },
        data: { tags: { set: tagConnect } },
      });
    } else {
      await prisma.faculty.create({
        data: {
          name,
          examDate: new Date(facultyExamDates[name]),
          universityId: university.id,
          tags: { connect: tagConnect },
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
