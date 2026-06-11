import { createClient } from "@/lib/supabase/server";                                                                        
import { redirect } from "next/navigation";                                                                                  
import TodoList from "@/app/components/TodoList";                                                                            
                                                                                                                           
const TodosPage = async () => {                                                                                              
  const supabase = await createClient();                                                                                   
  const { data: { user } } = await supabase.auth.getUser();                                                                  
 
  if (!user) {                                                                                                               
    redirect("/login");                                                                                                    
  }                                   

  return (                                                                                                                   
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-bold mb-6">Todo</h1>                                                                      
      <TodoList />                                                                                                         
    </main>                                                                  
  );                                                                          
};                                    

export default TodosPage;  