
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

// 大学ごとの学部データ（学部はここを手動で拡充していく）
// ⚠️  examDate は2026年度入試の実績ベースの暫定値。2027年度の正式日程が
//    各大学から発表されたら要更新（現時点では未発表のため暫定）
const facultyData: Record<
  string,
  { name: string; examDate: string; tags: string[] }[]
> = {
  早稲田大学: [
    { name: "政治経済学部", examDate: "2027-02-20", tags: ["法・政経系", "商・経営系"] },
    { name: "法学部", examDate: "2027-02-15", tags: ["法・政経系"] },
    { name: "商学部", examDate: "2027-02-21", tags: ["商・経営系"] },
    { name: "文学部", examDate: "2027-02-17", tags: ["文・文化系"] },
    { name: "文化構想学部", examDate: "2027-02-12", tags: ["文・文化系"] },
  ],
  慶應義塾大学: [
    { name: "経済学部", examDate: "2027-02-13", tags: ["法・政経系", "商・経営系"] },
    { name: "法学部", examDate: "2027-02-16", tags: ["法・政経系"] },
    { name: "商学部", examDate: "2027-02-14", tags: ["商・経営系"] },
    { name: "文学部", examDate: "2027-02-15", tags: ["文・文化系"] },
  ],
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

  // 3. 大学ごとに学部・系統タグを投入（学部データは facultyData を手動拡充）
  for (const [universityName, faculties] of Object.entries(facultyData)) {
    const university = await prisma.university.findUniqueOrThrow({
      where: { name: universityName },
    });

    for (const { name, examDate, tags } of faculties) {
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
            examDate: new Date(examDate),
            universityId: university.id,
            tags: { connect: tagConnect },
          },
        });
      }
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
