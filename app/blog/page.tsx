import { client, type Blog } from "@/lib/microcms";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const BlogPage = async () => {
  const data = await client.getList<Blog>({
    endpoint: "blogs",
  });
  return (
    <main className="w-full mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">ブログ記事一覧</h1>
      <ul className="space-y-4">
        {data.contents.map((blog) => (
          <li key={blog.id}>
            <Link href={`/articles/${blog.id}`}>
              <Card>
                <CardContent>
                  <h2 className="text-xl font-semibold">{blog.title}</h2>
                  <time className="text-sm text-gray-400">
                    {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
                  </time>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default BlogPage;
