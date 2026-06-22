
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileInput } from
"@/lib/validations/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const ProfileEdit = ({ currentNickname }: { currentNickname: string }) =>
{
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: currentNickname,
    },
  });

  const onSubmit = async (data: ProfileInput) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("更新しました！");
      setIsEditing(false);
      router.refresh();
    } else {
      const result = await res.json();
      toast.error(result.error || "更新に失敗しました");
    }
  };

  if (!isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <p className="text-xl flex-1">{currentNickname}</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.reset({ nickname: currentNickname });
            setIsEditing(true);
          }}
        >
          編集
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-start">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "更新中..." : "更新"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
        >
          キャンセル
        </Button>
      </form>
    </Form>
  );
};

export default ProfileEdit;