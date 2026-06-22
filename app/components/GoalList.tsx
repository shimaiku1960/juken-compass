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


type Faculty = {
  id: number;
  name: string;
  examDate: Date;
  university: { name: string };
};
                                                            
                                                                                                          
type Goal = {
  id: number;

  createdAt: Date;                                                                                        
  profileId: string;
  faculty: Faculty;
};                                                                                                        
                                                                                                        
type Props = {
  initialGoals: Goal[];
  faculties: Faculty[];
};

export default function GoalList({ initialGoals, faculties }: Props) {                                               
  const [goals, setGoals] = useState(initialGoals);

  const form = useForm<GoalInput>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      facultyId: 0,
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
      setGoals((prev) => [...prev, newGoal]);
      form.reset();
      toast.success("目標を追加しました");
    } else {
      const data = await res.json();
      toast.error(data.error ?? "追加に失敗しました");
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
      const data = await res.json();
      toast.error(data.error ?? "追加に失敗しました");
    }
   
  };


                                                                                                          
  return (
    <div>
          <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 mb-6 items-start">
            <FormField
              control={form.control}
              name="facultyId"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border rounded px-3 py-2 w-full"
                    >
                      <option value={0}>志望学部を選択</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.university.name} {faculty.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>追加</Button>
          </form>
        </Form>

 
      <ul className="space-y-2">
          {goals.map((goal) => (
                      <li
                      key={goal.id}
                      className="border rounded px-4 py-3 flex justify-between items-center"
                    >
                      <span className="font-medium">
                        {goal.faculty.university.name} {goal.faculty.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">
                          {new Date(goal.faculty.examDate).toLocaleDateString("ja-JP")}
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