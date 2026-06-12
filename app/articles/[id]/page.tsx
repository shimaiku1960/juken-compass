import { client, type Blog } from "@/lib/microcms";                                                                                                        
                                                                                                                                                             
const ArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {                                                                           
  const { id } = await params;
  const blog = await client.get<Blog>({                                                                                                                    
    endpoint: "blogs",
    contentId: id,                                                                                                                                         
  });                                                                                                                                                    

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
      <time className="text-sm text-gray-400">                                                                                                             
        {new Date(blog.createdAt).toLocaleDateString("ja-JP")}
      </time>                                                                                                                                              
      <div                                                                                                                                               
        className="mt-6 prose"                                                                                                                             
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />                                                                                                                                                   
    </main>                                                                                                                                              
  );
};

export default ArticlePage;