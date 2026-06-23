"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Tag = { id: number; name: string };

type Faculty = {
  id: number;
  name: string;
  examDate: Date;
  tags: Tag[];
};

type Props = {
  faculties: Faculty[];
  registeredFacultyIds: number[];
};

export default function FacultyList({
  faculties,
  registeredFacultyIds,
}: Props) {
  const [registered, setRegistered] = useState<number[]>(registeredFacultyIds);

  const register = async (facultyId: number) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facultyId }),
    });

    if (res.ok) {
      setRegistered((prev) => [...prev, facultyId]);
      toast.success("志望校に追加しました");
    } else {
      const data = await res.json();
      if (res.status === 409) {
        setRegistered((prev) => [...prev, facultyId]);
      }
      toast.error(data.error ?? "追加に失敗しました");
    }
  };

  return (
    <ul className="space-y-2">
      {faculties.map((faculty) => {
        const isRegistered = registered.includes(faculty.id);
        return (
          <li
            key={faculty.id}
            className="border rounded px-4 py-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{faculty.name}</p>
              <p className="text-sm text-gray-500">
                {faculty.tags.map((t) => t.name).join(" / ")}
              </p>
            </div>
            <Button
              onClick={() => register(faculty.id)}
              disabled={isRegistered}
              variant={isRegistered ? "secondary" : "default"}
            >
              {isRegistered ? "登録済み" : "志望校に追加"}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
