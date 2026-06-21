
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  await prisma.faculty.deleteMany();
  await prisma.university.deleteMany();

  await prisma.university.create({
    data: {
      name: "早稲田大学",
      faculties: {
        create: [
          { name: "政治経済学部", examDate: new Date("2027-02-20") },
          { name: "法学部", examDate: new Date("2027-02-15") },
          { name: "商学部", examDate: new Date("2027-02-21") },
          { name: "文学部", examDate: new Date("2027-02-17") },
          { name: "文化構想学部", examDate: new Date("2027-02-12") },
        ],
      },
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

