"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";


const EditArticle = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {                                                                                                                                          
    const fetchArticle = async () => {                                                                                                                          
      const res = await fetch(`/api/articles/${id}`);                                                                                                           
      const data = await res.json();                                                                                                                         
      setTitle(data.title);                                                                                                                                  
      setDescription(data.description);                                                                                                                      
    };                                                                                                                                                       
    fetchArticle();                                                                                                                                           
  }, [id]);   


  const handleSubmit = async (e: React.FormEvent) => {                                                                                                       
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/articles/${id}`, {
      method: "PUT",                                                                                                                                         
      headers: { "Content-Type": "application/json" },                                                                                                       
      body: JSON.stringify({ title, description }),                                                                                                        
    });                                                                                                                                                      
                                                                                                                                                             
    if (res.ok) {                                                                                                                                          
      toast.success("記事を更新しました");                                                                                                                   
      router.push("/");                                                                                                                                    
    } else {                                                                                                                                               
      toast.error("更新に失敗しました");
    }                                                                                                                                                        
  };

  const handleDelete = async () => {
    const res = await fetch(`/api/articles/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("記事を削除しました");
      router.push("/");
    } else {
      toast.error("削除に失敗しました");
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6">記事を編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? "更新中..." : "更新"}
        </button>
      </form>
     
      <button onClick={handleDelete} disabled={loading} className="bg-red-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50">
        削除
      </button>                                                                                                                                              
    </main>                                                                                                                                                  
  );
};

export default EditArticle;