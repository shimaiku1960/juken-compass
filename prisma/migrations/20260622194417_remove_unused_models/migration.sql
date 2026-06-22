-- DropForeignKey
ALTER TABLE "DailyGoal" DROP CONSTRAINT "DailyGoal_weeklyGoalId_fkey";

-- DropForeignKey
ALTER TABLE "IntermediateGoal" DROP CONSTRAINT "IntermediateGoal_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "StudyLog" DROP CONSTRAINT "StudyLog_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Subject" DROP CONSTRAINT "Subject_profileId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectWeight" DROP CONSTRAINT "SubjectWeight_finalGoalId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectWeight" DROP CONSTRAINT "SubjectWeight_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyGoal" DROP CONSTRAINT "WeeklyGoal_intermediateGoalId_fkey";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "DailyGoal";

-- DropTable
DROP TABLE "IntermediateGoal";

-- DropTable
DROP TABLE "StudyLog";

-- DropTable
DROP TABLE "Subject";

-- DropTable
DROP TABLE "SubjectWeight";

-- DropTable
DROP TABLE "WeeklyGoal";

