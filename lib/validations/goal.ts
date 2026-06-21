import { z } from "zod";

export const goalSchema = z.object({
  facultyId: z.number().int().positive("志望学部を選択してください"),
});

export type GoalInput = z.infer<typeof goalSchema>;

export const updateGoalSchema = goalSchema.partial();

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;