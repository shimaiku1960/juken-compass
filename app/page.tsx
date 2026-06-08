import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const Home = async () => {
  const blogs = await prisma.article.findMany({
    orderBy: { date: "desc" },
  });
  return(
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">ブログ記事一覧</h1>
      <Link href="/create" className="text-blue-500 underline mb-4 inline-block" >
        新規作成
      </Link>
      <ul className="space-y-4">
        {blogs.map((blog) => (
          <li key={blog.id} className="border p-4 rounded">
            <Link href={`/edit/${blog.id}`}>
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="text-gray-600">{blog.description}</p>
            <time className="text-sm text-gray-400">
                  作成: {new Date(blog.date).toLocaleDateString("ja-JP")}
            </time>
            <time className="text-sm text-gray-400 ml-4">
                  更新: {new Date(blog.updatedAt).toLocaleDateString("ja-JP")}
            </time>
            </Link>
          </li>        
        ))}
        </ul>
    </main>
  )
};

export default Home;