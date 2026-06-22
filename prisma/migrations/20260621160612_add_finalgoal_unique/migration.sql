/*
  Warnings:

  - A unique constraint covering the columns `[profileId,facultyId]` on the table `FinalGoal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FinalGoal_profileId_facultyId_key" ON "FinalGoal"("profileId", "facultyId");
