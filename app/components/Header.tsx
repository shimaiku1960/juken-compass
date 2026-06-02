import Link from "next/link";                                                                        
import { createClient } from "@/lib/supabase/server";                                                
import { logout } from "@/app/auth/actions";                                                         
                                                                                                     
const Header = async () => {                                                                       
  const supabase = await createClient();                                                             
  const { data: { user } } = await supabase.auth.getUser();
                                                                                                     
  return (                                                                                         
    <header className="border-b px-8 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">                                                  
        ブログ                          
      </Link>                                                                                        
      <nav className="flex gap-4 items-center">                                                      
        {user ? (                           
          <>                                                                                         
            <Link href="/profile" className="text-blue-500 hover:underline">                       
              プロフィール                                                                           
            </Link>                     
            <form action={logout}>                                                                   
              <button type="submit" className="text-red-500 hover:underline">                        
                ログアウト
              </button>                                                                              
            </form>                                                                                
          </>
        ) : (                                                                                        
          <Link href="/login" className="text-blue-500 hover:underline">
            ログイン                                                                                 
          </Link>                                                                                  
        )}
      </nav>
    </header>
  );                                        
};                                      

export default Header; 