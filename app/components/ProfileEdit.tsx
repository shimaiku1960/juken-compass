"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ProfileEdit = ({ currentNickname }: { currentNickname: string }) => {
  const [nickname, setNickname] = useState(currentNickname);
  const [loading, setLoading] = useState(false);  
  const router = useRouter();  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });

    if (res.ok) {
      toast.success("更新しました！");
      router.refresh();
    } else {
      toast.error("更新に失敗しました");
    }
    setLoading(false);
  };



  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)} 
        className="border rounded px-3 py-2 flex-1"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "更新中..." : "更新"}
      </button>
    </form>

  );
};

export default ProfileEdit;