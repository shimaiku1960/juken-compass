"use client";                                                                                             
                                                                                                            
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, type GoalInput } from "@/lib/validations/goal";      
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
                                                            
                                                                                                          
type Goal = {
  id: number;
  title: string;
  examDate: Date;
  createdAt: Date;                                                                                        
  profileId: string;
};                                                                                                        
                                                                                                        
type Props = {
  initialGoals: Goal[];
};

export default function GoalList({ initialGoals }: Props) {                                               
  const [goals, setGoals] = useState(initialGoals);

  const form = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      examDate: "",
    },
  });
           
  const onSubmit = async (data: GoalInput) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newGoal = await res.json();
      setGoals([...goals, newGoal]);
      form.reset();
      toast.success("目標を追加しました");
    }else {
      toast.error("追加に失敗しました");
    }
  };

  const deleteGoal = async (id: number) => {
    const res = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setGoals(goals.filter((goal) => goal.id !== id));
      toast.success("目標を削除しました");
    } else {
      toast.error("削除に失敗しました");
    }
  };


                                                                                                          
  return (
    <div>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6 items-start">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder="志望校名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="examDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">追加</Button>
          </form>
        </Form>

 
      <ul className="space-y-2">
          {goals.map((goal) => (
                      <li
                      key={goal.id}
                      className="border rounded px-4 py-3 flex justify-between items-center"
                    >
                      <span className="font-medium">{goal.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {new Date(goal.examDate).toLocaleDateString("ja-JP")}
                        </span>
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-red-500 text-sm hover:underline"
                        >
                          削除
                        </button>
                      </div>
                    </li>
                    
        
          ))}
        </ul>
        




    </div>
  );
}