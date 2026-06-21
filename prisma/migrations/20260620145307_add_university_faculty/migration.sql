/*
  Warnings:

  - You are about to drop the column `examDate` on the `FinalGoal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `FinalGoal` table. All the data in the column will be lost.
  - Added the required column `facultyId` to the `FinalGoal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FinalGoal" DROP COLUMN "examDate",
DROP COLUMN "title",
ADD COLUMN     "facultyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "University" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "examDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "universityId" INTEGER NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FinalGoal" ADD CONSTRAINT "FinalGoal_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
