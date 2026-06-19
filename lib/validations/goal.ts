import { z } from "zod";

export const goalSchema = z.object({
    title: z.string().min(1, "志望校名を入力してください"),
    examDate: z.string().min(1, "受験日を選択してください"),
  });

  export type GoalInput = z.infer<typeof goalSchema>;